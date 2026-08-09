import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Play, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/workspace/app-shell";
import { Button } from "@/components/ui/button";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useWorkspaceStore } from "@/lib/workspace-store";

export const Route = createFileRoute("/workflows")({
  head: () => ({
    meta: [{ title: "Workflows · PandaOS" }],
  }),
  component: WorkflowsRoute,
});

/** Demo cadence mirrors ScheduleRunner */
function nextRunHint(
  schedule: "manual" | "daily" | "weekly" | undefined,
  lastRunAt?: number,
) {
  if (!schedule || schedule === "manual") return "Manual only";
  const ms = schedule === "daily" ? 2 * 60 * 1000 : 5 * 60 * 1000;
  const last = lastRunAt ?? 0;
  const due = last + ms;
  const remaining = due - Date.now();
  if (remaining <= 0) return "Due now (fires while app is open)";
  const sec = Math.ceil(remaining / 1000);
  if (sec < 60) return `Next in ~${sec}s (demo cadence)`;
  return `Next in ~${Math.ceil(sec / 60)}m (demo cadence)`;
}

function WorkflowsRoute() {
  const { user, isPending } = useCurrentUserState();
  const workflows = useWorkspaceStore((s) => s.savedWorkflows);
  const runWorkflow = useWorkspaceStore((s) => s.runWorkflow);
  const deleteWorkflow = useWorkspaceStore((s) => s.deleteWorkflow);
  const setSchedule = useWorkspaceStore((s) => s.setSchedule);
  const send = useWorkspaceStore((s) => s.send);
  const navigate = useNavigate();

  if (isPending) {
    return (
      <div className="grid min-h-dvh place-items-center bg-[var(--color-bg)]">
        <div className="h-10 w-10 animate-pulse rounded-full bg-[var(--color-surface)]" />
      </div>
    );
  }
  if (!user) return <RedirectToSignIn />;

  return (
    <AppShell title="Workflows">
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Saved workflows
          </h2>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Schedules fire automatically while the app is open (demo: daily ≈ 2
            min, weekly ≈ 5 min). Write actions still require approval.
          </p>
        </div>

        <div className="space-y-3">
          {workflows.map((wf) => (
            <div
              key={wf.id}
              className="flex flex-col gap-3 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <div className="font-semibold">{wf.name}</div>
                <div className="mt-1 truncate text-sm text-[var(--color-muted)]">
                  {wf.prompt}
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-[var(--color-subtle)]">
                  <span>{wf.apps.length} apps</span>
                  {wf.lastRunAt ? (
                    <span>
                      · last run {new Date(wf.lastRunAt).toLocaleString()}
                    </span>
                  ) : null}
                  <span>· {nextRunHint(wf.schedule, wf.lastRunAt)}</span>
                  <label className="inline-flex items-center gap-1.5">
                    · schedule
                    <select
                      className="rounded border border-[var(--color-border)] bg-[var(--color-bg)] px-1.5 py-0.5 text-[11px] text-[var(--color-fg)]"
                      value={wf.schedule || "manual"}
                      onChange={(e) => {
                        setSchedule(
                          wf.id,
                          e.target.value as "manual" | "daily" | "weekly",
                        );
                        toast.success(`Schedule: ${e.target.value}`);
                      }}
                    >
                      <option value="manual">Manual</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                    </select>
                  </label>
                </div>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button
                  size="sm"
                  onClick={() => {
                    navigate({ to: "/workspace" });
                    runWorkflow(wf.id);
                    toast.success(`Running “${wf.name}”`);
                  }}
                >
                  <Play className="h-3.5 w-3.5" />
                  Run
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    deleteWorkflow(wf.id);
                    toast.success("Workflow deleted");
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
          {workflows.length === 0 ? (
            <div className="rounded-[var(--radius-xl)] border border-dashed border-[var(--color-border-strong)] p-8 text-center">
              <p className="text-sm text-[var(--color-muted)]">
                No saved workflows yet.
              </p>
              <Button
                className="mt-4"
                onClick={() => {
                  navigate({ to: "/workspace" });
                  send(
                    "Summarize this week's HubSpot pipeline by stage and owner",
                  );
                }}
              >
                Run first workflow
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </AppShell>
  );
}
