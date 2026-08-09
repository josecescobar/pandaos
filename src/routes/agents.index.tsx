import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { AppShell } from "@/components/workspace/app-shell";
import { Button } from "@/components/ui/button";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useWorkspaceStore } from "@/lib/workspace-store";
import { useAgentsStore } from "@/lib/agents-store";
import { agentsCatalog } from "@/content/agents";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/agents/")({
  head: () => ({
    meta: [{ title: "Agents · PandaOS" }],
  }),
  component: AgentsRoute,
});

function AgentsRoute() {
  const { user, isPending } = useCurrentUserState();
  const send = useWorkspaceStore((s) => s.send);
  const isEnabled = useAgentsStore((s) => s.isEnabled);
  const toggle = useAgentsStore((s) => s.toggle);
  const logRun = useAgentsStore((s) => s.logRun);
  const navigate = useNavigate();

  if (isPending) {
    return (
      <div className="grid min-h-dvh place-items-center bg-[var(--color-bg)]">
        <div className="h-10 w-10 animate-pulse rounded-full bg-[var(--color-surface)]" />
      </div>
    );
  }
  if (!user) return <RedirectToSignIn />;

  const business = agentsCatalog.filter((a) => a.track === "business");
  const builders = agentsCatalog.filter((a) => a.track === "builders");

  function runAgent(id: string, prompt: string, name: string) {
    if (!isEnabled(id)) {
      toast.error("Enable this agent first");
      return;
    }
    logRun(id, prompt);
    navigate({ to: "/workspace" });
    send(prompt);
    toast.success(`Agent ${name} launched`);
  }

  return (
    <AppShell title="Agents">
      <div className="mx-auto max-w-4xl space-y-8">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Operational agents
          </h2>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Toggle agents on/off, open detail for goals and history, or run
            across your connected stack.
          </p>
        </div>

        {(
          [
            ["Business", business],
            ["Builder stack", builders],
          ] as const
        ).map(([title, list]) => (
          <section key={title}>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--color-subtle)]">
              {title}
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {list.map((a) => {
                const on = isEnabled(a.id);
                return (
                  <div
                    key={a.id}
                    className={cn(
                      "rounded-[var(--radius-xl)] border bg-[var(--color-surface)] p-4",
                      on
                        ? "border-[var(--color-border)]"
                        : "border-[var(--color-border)] opacity-70",
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className="grid h-8 w-8 place-items-center rounded-lg text-xs font-bold text-white"
                          style={{ background: a.color }}
                        >
                          {a.tag}
                        </span>
                        <div>
                          <div className="font-mono text-sm font-semibold">
                            {a.name}
                          </div>
                          <div className="text-[11px] text-[var(--color-subtle)]">
                            {a.title}
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={on}
                        onClick={() => {
                          toggle(a.id);
                          toast.success(on ? "Disabled" : "Enabled");
                        }}
                        className={cn(
                          "relative h-6 w-11 rounded-full transition-colors",
                          on
                            ? "bg-[var(--color-primary)]"
                            : "bg-white/15",
                        )}
                      >
                        <span
                          className={cn(
                            "absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform",
                            on ? "left-5" : "left-0.5",
                          )}
                        />
                      </button>
                    </div>
                    <p className="mt-3 text-sm text-[var(--color-muted)]">
                      {a.body}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        disabled={!on}
                        onClick={() => runAgent(a.id, a.prompt, a.name)}
                      >
                        Run
                      </Button>
                      <Button asChild size="sm" variant="secondary">
                        <Link to="/agents/$agentId" params={{ agentId: a.id }}>
                          Details
                        </Link>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </AppShell>
  );
}
