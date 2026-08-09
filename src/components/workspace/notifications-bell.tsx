import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNotificationsStore } from "@/lib/notifications-store";
import { cn } from "@/lib/utils";

function formatTime(ts: number) {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${Math.max(1, m)}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}

export function NotificationsBell() {
  const [open, setOpen] = useState(false);
  const items = useNotificationsStore((s) => s.items);
  const markRead = useNotificationsStore((s) => s.markRead);
  const markAllRead = useNotificationsStore((s) => s.markAllRead);
  const unread = items.filter((i) => !i.read).length;

  return (
    <div className="relative">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Notifications"
        onClick={() => setOpen((v) => !v)}
        className="relative"
      >
        <Bell className="h-4 w-4" />
        {unread > 0 ? (
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[var(--color-primary)]" />
        ) : null}
      </Button>

      {open ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40"
            aria-label="Close notifications"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 z-50 mt-2 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)] shadow-[var(--shadow-card)]">
            <div className="flex items-center justify-between border-b border-[var(--color-border)] px-3 py-2.5">
              <div className="text-sm font-semibold">Notifications</div>
              <button
                type="button"
                className="text-[11px] font-medium text-[var(--color-primary)] hover:underline"
                onClick={() => markAllRead()}
              >
                Mark all read
              </button>
            </div>
            <ul className="max-h-80 overflow-y-auto">
              {items.map((n) => (
                <li key={n.id}>
                  <Link
                    to={n.href || "/workspace"}
                    onClick={() => {
                      markRead(n.id);
                      setOpen(false);
                    }}
                    className={cn(
                      "block border-b border-[var(--color-border)] px-3 py-3 transition-colors hover:bg-white/5",
                      !n.read && "bg-[var(--color-accent-soft)]/40",
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-sm font-medium">{n.title}</div>
                      <time className="shrink-0 text-[11px] text-[var(--color-subtle)]">
                        {formatTime(n.ts)}
                      </time>
                    </div>
                    <p className="mt-0.5 text-xs text-[var(--color-muted)]">
                      {n.body}
                    </p>
                  </Link>
                </li>
              ))}
              {items.length === 0 ? (
                <li className="px-3 py-8 text-center text-sm text-[var(--color-muted)]">
                  You're all caught up.
                </li>
              ) : null}
            </ul>
          </div>
        </>
      ) : null}
    </div>
  );
}
