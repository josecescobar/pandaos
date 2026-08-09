import { useWorkspaceStore } from "@/lib/workspace-store";

function formatTime(ts: number) {
  try {
    return new Intl.DateTimeFormat(undefined, {
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(ts));
  } catch {
    return "";
  }
}

export function ActivityFeed({ limit = 8 }: { limit?: number }) {
  const activity = useWorkspaceStore((s) => s.activity);

  return (
    <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="border-b border-[var(--color-border)] px-4 py-3 text-sm font-semibold">
        Recent activity
      </div>
      <ul className="divide-y divide-[var(--color-border)]">
        {activity.slice(0, limit).map((item) => (
          <li key={item.id} className="flex items-start justify-between gap-3 px-4 py-3">
            <div className="min-w-0">
              <div className="truncate text-sm font-medium">{item.label}</div>
              {item.detail ? (
                <div className="truncate text-xs text-[var(--color-subtle)]">
                  {item.detail}
                </div>
              ) : null}
            </div>
            <time className="shrink-0 text-[11px] text-[var(--color-subtle)]">
              {formatTime(item.ts)}
            </time>
          </li>
        ))}
        {activity.length === 0 ? (
          <li className="px-4 py-6 text-center text-sm text-[var(--color-muted)]">
            No activity yet — run a workflow to get started.
          </li>
        ) : null}
      </ul>
    </div>
  );
}
