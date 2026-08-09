import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/workspace/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useTeamStore } from "@/lib/team-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/team")({
  head: () => ({
    meta: [{ title: "Team · PandaOS" }],
  }),
  component: TeamRoute,
});

function TeamRoute() {
  const { user, isPending } = useCurrentUserState();
  const teamName = useTeamStore((s) => s.teamName);
  const setTeamName = useTeamStore((s) => s.setTeamName);
  const plan = useTeamStore((s) => s.plan);
  const setPlan = useTeamStore((s) => s.setPlan);
  const members = useTeamStore((s) => s.members);
  const activity = useTeamStore((s) => s.activity);
  const invite = useTeamStore((s) => s.invite);
  const removeMember = useTeamStore((s) => s.removeMember);
  const acceptInvite = useTeamStore((s) => s.acceptInvite);
  const logActivity = useTeamStore((s) => s.logActivity);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  if (isPending) {
    return (
      <div className="grid min-h-dvh place-items-center bg-[var(--color-bg)]">
        <div className="h-10 w-10 animate-pulse rounded-full bg-[var(--color-surface)]" />
      </div>
    );
  }
  if (!user) return <RedirectToSignIn />;

  function onInvite(e: React.FormEvent) {
    e.preventDefault();
    const m = invite({ name, email });
    if (!m) {
      toast.error("Enter a unique valid email");
      return;
    }
    toast.success(`Invited ${m.email}`);
    setName("");
    setEmail("");
  }

  return (
    <AppShell title="Team">
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Team</h2>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Invite teammates, share the workspace, and see who ran what.
          </p>
        </div>

        <section className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <Label htmlFor="team-name">Workspace name</Label>
          <Input
            id="team-name"
            className="mt-2 max-w-md"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
          />
          <div className="mt-4">
            <Label>Plan</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {(["free", "pro", "team"] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => {
                    setPlan(p);
                    logActivity(
                      user.displayName ?? "admin",
                      "Changed plan",
                      p,
                    );
                    toast.success(`Plan: ${p}`);
                  }}
                  className={cn(
                    "rounded-[var(--radius-pill)] border px-3 py-1.5 text-xs font-semibold capitalize",
                    plan === p
                      ? "border-[var(--color-primary)] bg-[var(--color-accent-soft)]"
                      : "border-[var(--color-border)] text-[var(--color-muted)]",
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-[var(--color-subtle)]">
              Tip: second account{" "}
              <span className="font-mono text-[var(--color-fg)]">ops</span> /{" "}
              <span className="font-mono text-[var(--color-fg)]">ops12345</span>{" "}
              is seeded for multi-user testing.
            </p>
          </div>
        </section>

        <section className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <h3 className="text-sm font-semibold">Invite member</h3>
          <form
            onSubmit={onInvite}
            className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto]"
          >
            <div>
              <Label htmlFor="inv-name">Name</Label>
              <Input
                id="inv-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="inv-email">Email</Label>
              <Input
                id="inv-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@company.com"
                className="mt-1"
              />
            </div>
            <div className="flex items-end">
              <Button type="submit" className="w-full sm:w-auto">
                <UserPlus className="h-3.5 w-3.5" />
                Invite
              </Button>
            </div>
          </form>
        </section>

        <section className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <h3 className="text-sm font-semibold">
            Members ({members.length})
          </h3>
          <ul className="mt-4 space-y-2">
            {members.map((m) => (
              <li
                key={m.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 py-2.5 text-sm"
              >
                <div>
                  <div className="font-medium">{m.name}</div>
                  <div className="text-xs text-[var(--color-subtle)]">
                    {m.email} · {m.role}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "rounded-[var(--radius-pill)] px-2 py-0.5 text-[10px] font-semibold uppercase",
                      m.status === "active"
                        ? "bg-[var(--color-accent-soft)] text-[var(--color-primary)]"
                        : "bg-white/5 text-[var(--color-muted)]",
                    )}
                  >
                    {m.status}
                  </span>
                  {m.status === "invited" ? (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        acceptInvite(m.id);
                        toast.success(`${m.name} is active`);
                      }}
                    >
                      Mark active
                    </Button>
                  ) : null}
                  {m.role !== "owner" ? (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        removeMember(m.id);
                        toast.success("Removed");
                      }}
                    >
                      Remove
                    </Button>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <h3 className="text-sm font-semibold">Team activity</h3>
          <ul className="mt-4 space-y-2">
            {activity.map((a) => (
              <li
                key={a.id}
                className="flex justify-between gap-3 border-b border-[var(--color-border)] py-2 text-sm last:border-0"
              >
                <div>
                  <span className="font-medium">{a.memberName}</span>
                  <span className="text-[var(--color-muted)]">
                    {" "}
                    · {a.action}
                  </span>
                  {a.detail ? (
                    <span className="text-[var(--color-subtle)]">
                      {" "}
                      — {a.detail}
                    </span>
                  ) : null}
                </div>
                <time className="shrink-0 text-[11px] text-[var(--color-subtle)]">
                  {new Date(a.ts).toLocaleString()}
                </time>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </AppShell>
  );
}
