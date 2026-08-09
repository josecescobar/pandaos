import { useWorkspaceStore } from "@/lib/workspace-store";
import { Activity, MessageSquare, Plug, Workflow } from "lucide-react";

export function MetricsStrip() {
  const connected = useWorkspaceStore(
    (s) => s.apps.filter((a) => a.connected).length,
  );
  const workflows = useWorkspaceStore((s) => s.savedWorkflows.length);
  const messages = useWorkspaceStore(
    (s) => s.messages.filter((m) => m.role === "user").length,
  );
  const activityToday = useWorkspaceStore(
    (s) => s.activity.filter((a) => Date.now() - a.ts < 86400000).length,
  );

  const items = [
    { label: "Apps connected", value: connected, icon: Plug },
    { label: "Saved workflows", value: workflows, icon: Workflow },
    { label: "Prompts run", value: messages, icon: MessageSquare },
    { label: "Activity today", value: activityToday, icon: Activity },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.label}
            className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-medium uppercase tracking-wide text-[var(--color-subtle)]">
                {item.label}
              </span>
              <Icon className="h-3.5 w-3.5 text-[var(--color-primary)]" />
            </div>
            <div className="mt-1 text-2xl font-semibold tracking-tight">
              {item.value}
            </div>
          </div>
        );
      })}
    </div>
  );
}
