import { builders } from "@/content/builders";
import { cn } from "@/lib/utils";

export function AgentStack({ className }: { className?: string }) {
  return (
    <div className={cn("mx-auto flex w-full max-w-xl flex-col gap-3", className)}>
      {builders.agents.map((agent, i) => (
        <div
          key={agent.tag}
          className="flex items-start gap-3 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)]/90 px-4 py-3 shadow-sm backdrop-blur"
          style={{ marginLeft: `${(i % 3) * 12}px` }}
        >
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] text-sm font-bold text-white"
            style={{ backgroundColor: agent.color }}
          >
            {agent.tag}
          </span>
          <div className="min-w-0">
            <div className="truncate font-mono text-sm font-semibold text-[var(--color-fg)]">
              {agent.name}
            </div>
            <p className="mt-0.5 line-clamp-2 text-xs text-[var(--color-muted)]">
              {agent.body}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
