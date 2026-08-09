import { useEffect, useState } from "react";
import { Check, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  {
    id: 1,
    app: "HubSpot",
    label: "Pull pipeline by stage & owner",
    detail: "18 Discovery · 11 Proposal · 7 Negotiation",
  },
  {
    id: 2,
    app: "Notion",
    label: "Update weekly pipeline doc",
    detail: "RevOps · Q3 snapshot written",
  },
  {
    id: 3,
    app: "Slack",
    label: "Post brief to #revops",
    detail: "Summary delivered · 3 @mentions",
  },
  {
    id: 4,
    app: "Gmail",
    label: "Draft leadership email",
    detail: "Ready to send · needs your approve",
  },
] as const;

export function WorkflowMotion({ className }: { className?: string }) {
  const [active, setActive] = useState(0);
  const [done, setDone] = useState<number[]>([]);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    setDone([]);
    setActive(0);
    let i = 0;
    const timers: number[] = [];

    const run = () => {
      if (i >= steps.length) {
        timers.push(
          window.setTimeout(() => {
            setCycle((c) => c + 1);
          }, 2200),
        );
        return;
      }
      setActive(i);
      timers.push(
        window.setTimeout(() => {
          setDone((d) => [...d, i]);
          i += 1;
          run();
        }, 1100),
      );
    };

    timers.push(window.setTimeout(run, 400));
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [cycle]);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-[1.25rem] border border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)] shadow-[var(--shadow-card)]",
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-3">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Sparkles className="h-4 w-4 text-[var(--color-primary)]" />
          Live workflow
        </div>
        <span className="text-[11px] text-[var(--color-subtle)]">
          Pipeline → Docs → Slack → Email
        </span>
      </div>

      <div className="space-y-2 p-4">
        <div className="mb-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-xs text-[var(--color-muted)]">
          <span className="font-medium text-[var(--color-fg)]">You:</span>{" "}
          Summarize this week’s HubSpot pipeline, update Notion, brief Slack
        </div>

        {steps.map((step, idx) => {
          const isDone = done.includes(idx);
          const isActive = active === idx && !isDone;
          return (
            <div
              key={step.id}
              className={cn(
                "flex items-start gap-3 rounded-[var(--radius-lg)] border px-3 py-2.5 transition-all duration-300",
                isDone &&
                  "border-[var(--color-primary)]/30 bg-[var(--color-accent-soft)]/40",
                isActive &&
                  "border-[var(--color-primary)] bg-[var(--color-surface)] shadow-[0_0_0_1px_rgba(59,130,246,0.25)]",
                !isDone &&
                  !isActive &&
                  "border-[var(--color-border)] bg-transparent opacity-55",
              )}
            >
              <span
                className={cn(
                  "mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border text-[10px] font-bold",
                  isDone &&
                    "border-[var(--color-primary)] bg-[var(--color-primary)] text-white",
                  isActive &&
                    "border-[var(--color-primary)] text-[var(--color-primary)]",
                  !isDone &&
                    !isActive &&
                    "border-[var(--color-border)] text-[var(--color-subtle)]",
                )}
              >
                {isDone ? (
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                ) : isActive ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  idx + 1
                )}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-[var(--color-fg)]">
                    {step.label}
                  </span>
                  <span className="rounded-[var(--radius-pill)] bg-white/5 px-2 py-0.5 text-[10px] font-medium text-[var(--color-subtle)]">
                    {step.app}
                  </span>
                  {isDone ? (
                    <span className="text-[11px] font-semibold text-[var(--color-primary)]">
                      ✓ Done
                    </span>
                  ) : null}
                </div>
                <p className="mt-0.5 text-xs text-[var(--color-muted)]">
                  {step.detail}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
