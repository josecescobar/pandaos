import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { CommandCenter } from "@/components/workspace/command-center";
import { AppShell } from "@/components/workspace/app-shell";
import { MetricsStrip } from "@/components/workspace/metrics-strip";
import { ActivityFeed } from "@/components/workspace/activity-feed";
import { ApprovalsPanel } from "@/components/workspace/approvals-panel";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useOnboardingStore } from "@/lib/onboarding-store";
import { useWorkspaceStore } from "@/lib/workspace-store";

export const Route = createFileRoute("/workspace")({
  head: () => ({
    meta: [
      { title: "Workspace · PandaOS" },
      {
        name: "description",
        content:
          "PandaOS command center — run workflows across HubSpot, Notion, Slack, and your business stack.",
      },
    ],
  }),
  component: WorkspaceRoute,
});

function WorkspaceRoute() {
  const { user, isPending } = useCurrentUserState();
  const completed = useOnboardingStore((s) => s.completed);
  const hydrated = useOnboardingStore((s) => s._hydrated);
  const pendingCount = useWorkspaceStore(
    (s) => s.pendingApprovals.filter((a) => a.status === "pending").length,
  );

  if (isPending || !hydrated) {
    return (
      <div className="grid min-h-dvh place-items-center bg-[var(--color-bg)]">
        <div className="h-10 w-10 animate-pulse rounded-full bg-[var(--color-surface)]" />
      </div>
    );
  }

  if (!user) {
    return <RedirectToSignIn />;
  }

  if (!completed) {
    return <Navigate to="/onboarding" />;
  }

  return (
    <AppShell
      title="Command Center"
      actions={
        <div className="flex items-center gap-3">
          {pendingCount > 0 ? (
            <span className="rounded-[var(--radius-pill)] bg-[var(--color-accent-soft)] px-2.5 py-1 text-[11px] font-semibold text-[var(--color-primary)]">
              {pendingCount} approval{pendingCount === 1 ? "" : "s"}
            </span>
          ) : null}
          <Link
            to="/templates"
            className="hidden text-xs font-medium text-[var(--color-muted)] hover:text-[var(--color-fg)] sm:inline"
          >
            Templates
          </Link>
          <Link
            to="/workflows"
            className="hidden text-xs font-medium text-[var(--color-muted)] hover:text-[var(--color-fg)] sm:inline"
          >
            Workflows
          </Link>
        </div>
      }
    >
      <div className="mx-auto max-w-6xl space-y-6">
        <MetricsStrip />
        <section>
          <h2 className="mb-3 text-sm font-semibold">Approvals</h2>
          <ApprovalsPanel />
        </section>
        <CommandCenter />
        <ActivityFeed />
      </div>
    </AppShell>
  );
}
