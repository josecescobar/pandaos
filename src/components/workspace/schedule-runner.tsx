import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useWorkspaceStore } from "@/lib/workspace-store";
import { useNotificationsStore } from "@/lib/notifications-store";

/**
 * Demo-accelerated schedule cadence while the app is open:
 * - daily  ≈ every 2 minutes
 * - weekly ≈ every 5 minutes
 * Real product would use server cron; this proves scheduled runs fire.
 */
const DEMO_MS = {
  daily: 2 * 60 * 1000,
  weekly: 5 * 60 * 1000,
} as const;

export function ScheduleRunner() {
  const runWorkflow = useWorkspaceStore((s) => s.runWorkflow);
  const push = useNotificationsStore((s) => s.push);
  const running = useRef<Set<string>>(new Set());

  useEffect(() => {
    const tick = () => {
      const { savedWorkflows, busy } = useWorkspaceStore.getState();
      if (busy) return;
      const now = Date.now();

      for (const wf of savedWorkflows) {
        if (!wf.schedule || wf.schedule === "manual") continue;
        if (!wf.lastRunAt) continue; // arm on first schedule set / run
        const interval = DEMO_MS[wf.schedule];
        const last = wf.lastRunAt;
        if (now - last < interval) continue;
        if (running.current.has(wf.id)) continue;

        running.current.add(wf.id);
        runWorkflow(wf.id);
        push({
          title: "Scheduled run",
          body: `${wf.name} (${wf.schedule})`,
          kind: "info",
          href: "/workspace",
        });
        toast.message(`Scheduled: ${wf.name}`);
        window.setTimeout(() => running.current.delete(wf.id), 5000);
      }
    };

    const id = window.setInterval(tick, 15_000);
    // first check after mount
    const t = window.setTimeout(tick, 2000);
    return () => {
      window.clearInterval(id);
      window.clearTimeout(t);
    };
  }, [runWorkflow, push]);

  return null;
}
