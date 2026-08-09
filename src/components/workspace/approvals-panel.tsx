import { Check, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useWorkspaceStore } from "@/lib/workspace-store";
import { useNotificationsStore } from "@/lib/notifications-store";
import { cn } from "@/lib/utils";

export function ApprovalsPanel({ className }: { className?: string }) {
  const pendingApprovals = useWorkspaceStore((s) => s.pendingApprovals);
  const approve = useWorkspaceStore((s) => s.approve);
  const reject = useWorkspaceStore((s) => s.reject);
  const push = useNotificationsStore((s) => s.push);

  const pending = pendingApprovals.filter((a) => a.status === "pending");
  const recent = pendingApprovals
    .filter((a) => a.status !== "pending")
    .slice(0, 4);

  if (!pending.length && !recent.length) {
    return (
      <div
        className={cn(
          "rounded-[var(--radius-xl)] border border-dashed border-[var(--color-border-strong)] p-4 text-sm text-[var(--color-muted)]",
          className,
        )}
      >
        No pending approvals. Write actions (post Slack, create Jira, email)
        will pause here for one-click review.
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      {pending.length ? (
        <div className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--color-subtle)]">
            Needs approval ({pending.length})
          </h3>
          {pending.map((a) => (
            <div
              key={a.id}
              className="flex flex-col gap-3 rounded-[var(--radius-xl)] border border-[var(--color-primary)]/40 bg-[var(--color-accent-soft)]/30 p-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <div className="text-sm font-semibold">{a.label}</div>
                <div className="text-xs text-[var(--color-muted)]">
                  {a.app} · {new Date(a.createdAt).toLocaleTimeString()}
                </div>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button
                  size="default"
                  className="min-h-11 flex-1 sm:flex-none"
                  onClick={() => {
                    approve(a.id);
                    push({
                      title: "Action approved",
                      body: a.label,
                      kind: "success",
                      href: "/workspace",
                    });
                    toast.success(`Approved: ${a.label}`);
                  }}
                >
                  <Check className="h-3.5 w-3.5" />
                  Approve
                </Button>
                <Button
                  size="default"
                  variant="secondary"
                  className="min-h-11 flex-1 sm:flex-none"
                  onClick={() => {
                    reject(a.id);
                    toast.message(`Rejected: ${a.label}`);
                  }}
                >
                  <X className="h-3.5 w-3.5" />
                  Reject
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {recent.length ? (
        <div className="space-y-1.5">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--color-subtle)]">
            Recent decisions
          </h3>
          {recent.map((a) => (
            <div
              key={a.id}
              className="flex items-center justify-between rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 py-2 text-xs"
            >
              <span className="truncate text-[var(--color-muted)]">
                {a.label}
              </span>
              <span
                className={cn(
                  "font-semibold uppercase",
                  a.status === "approved"
                    ? "text-[var(--color-primary)]"
                    : "text-[var(--color-subtle)]",
                )}
              >
                {a.status}
              </span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
