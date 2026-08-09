import { useRef } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { AppShell } from "@/components/workspace/app-shell";
import { Button } from "@/components/ui/button";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { authEnabled, signOut } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useWorkspaceStore } from "@/lib/workspace-store";
import { useOnboardingStore } from "@/lib/onboarding-store";
import { useTeamStore } from "@/lib/team-store";
import {
  planMeta,
  useBillingStore,
} from "@/lib/billing-store";
import { downloadExport, importExport } from "@/lib/import-export";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [{ title: "Settings · PandaOS" }],
  }),
  component: SettingsRoute,
});

function SettingsRoute() {
  const { user, isPending } = useCurrentUserState();
  const clearChat = useWorkspaceStore((s) => s.clearChat);
  const apps = useWorkspaceStore((s) => s.apps);
  const resetOnboarding = useOnboardingStore((s) => s.reset);
  const teamName = useTeamStore((s) => s.teamName);
  const setTeamPlan = useTeamStore((s) => s.setPlan);
  const billingPlan = useBillingStore((s) => s.plan);
  const seats = useBillingStore((s) => s.seats);
  const paymentMethod = useBillingStore((s) => s.paymentMethod);
  const invoices = useBillingStore((s) => s.invoices);
  const cancelToFree = useBillingStore((s) => s.cancelToFree);
  const fileRef = useRef<HTMLInputElement>(null);

  if (isPending) {
    return (
      <div className="grid min-h-dvh place-items-center bg-[var(--color-bg)]">
        <div className="h-10 w-10 animate-pulse rounded-full bg-[var(--color-surface)]" />
      </div>
    );
  }
  if (!user) return <RedirectToSignIn />;

  function onImportFile(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const json = JSON.parse(String(reader.result));
        const result = importExport(json);
        if (!result.ok) {
          toast.error(result.error);
          return;
        }
        toast.success("Workspace imported");
      } catch {
        toast.error("Could not parse JSON file");
      }
    };
    reader.readAsText(file);
  }

  return (
    <AppShell title="Settings">
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Settings</h2>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Account, billing, backup, and workspace preferences.
          </p>
        </div>

        <section className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <h3 className="text-sm font-semibold">Profile</h3>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-[var(--color-muted)]">Name</dt>
              <dd className="font-medium">{user.displayName ?? "—"}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[var(--color-muted)]">Email</dt>
              <dd className="font-medium">{user.primaryEmail ?? "—"}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[var(--color-muted)]">Team</dt>
              <dd className="font-medium">{teamName}</dd>
            </div>
          </dl>
        </section>

        <section className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold">Billing</h3>
            <Button asChild size="sm">
              <Link to="/checkout" search={{ plan: "pro" }}>
                Upgrade
              </Link>
            </Button>
          </div>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-[var(--color-muted)]">Plan</dt>
              <dd className="font-medium capitalize">
                {planMeta[billingPlan].name}
                {billingPlan !== "free" ? ` · ${seats} seat(s)` : ""}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[var(--color-muted)]">Payment</dt>
              <dd className="font-medium">
                {paymentMethod
                  ? `${paymentMethod.brand} ···· ${paymentMethod.last4}`
                  : "None on file"}
              </dd>
            </div>
          </dl>
          {invoices.length ? (
            <ul className="mt-4 space-y-2 border-t border-[var(--color-border)] pt-4">
              {invoices.slice(0, 5).map((inv) => (
                <li
                  key={inv.id}
                  className="flex justify-between text-xs text-[var(--color-muted)]"
                >
                  <span>
                    {inv.id} · {planMeta[inv.plan].name}
                  </span>
                  <span>
                    {inv.amount} · {inv.status}
                  </span>
                </li>
              ))}
            </ul>
          ) : null}
          {billingPlan !== "free" ? (
            <Button
              size="sm"
              variant="ghost"
              className="mt-3"
              onClick={() => {
                cancelToFree();
                setTeamPlan("free");
                toast.success("Moved to Free plan");
              }}
            >
              Cancel to Free
            </Button>
          ) : null}
        </section>

        <section className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <h3 className="text-sm font-semibold">Import / export</h3>
          <p className="mt-2 text-sm text-[var(--color-muted)]">
            Download a portable JSON backup of apps, workflows, messages,
            projects, agents, and team settings — or restore one.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              size="sm"
              onClick={() => {
                downloadExport();
                toast.success("Export downloaded");
              }}
            >
              Export workspace
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => fileRef.current?.click()}
            >
              Import JSON
            </Button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onImportFile(f);
                e.target.value = "";
              }}
            />
          </div>
        </section>

        <section className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <h3 className="text-sm font-semibold">Workspace data</h3>
          <p className="mt-2 text-sm text-[var(--color-muted)]">
            {apps.filter((a) => a.connected).length} apps connected · chat and
            workflows stored in this browser.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                clearChat();
                toast.success("Chat cleared");
              }}
            >
              Clear chat history
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                resetOnboarding();
                toast.success("Onboarding reset");
              }}
            >
              Reset onboarding
            </Button>
            <Button asChild variant="secondary" size="sm">
              <Link to="/team">Manage team</Link>
            </Button>
            <Button asChild variant="secondary" size="sm">
              <Link to="/changelog">Changelog</Link>
            </Button>
            {authEnabled ? (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => void signOut()}
              >
                Sign out
              </Button>
            ) : null}
          </div>
        </section>

        <section className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <h3 className="text-sm font-semibold">Data control</h3>
          <ul className="mt-3 space-y-2 text-sm text-[var(--color-muted)]">
            <li>Your data stays yours — never used for model training.</li>
            <li>OAuth tokens stored only in this browser for the demo shell.</li>
            <li>Write actions require approval before completion.</li>
          </ul>
        </section>
      </div>
    </AppShell>
  );
}
