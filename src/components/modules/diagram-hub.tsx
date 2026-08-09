import { business } from "@/content/business";
import { LogoMark } from "@/components/brand/logo";
import { cn } from "@/lib/utils";

export function DiagramHub({ className }: { className?: string }) {
  const { left, right } = business.diagram;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6 sm:p-10",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 grid-fade opacity-60" />
      <div className="relative mx-auto grid max-w-3xl grid-cols-1 items-center gap-6 md:grid-cols-[1fr_auto_1fr] md:gap-8">
        <div className="grid gap-3">
          {left.map((n) => (
            <div
              key={n.label}
              className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm font-medium text-[var(--color-fg)] shadow-sm"
            >
              {n.label}
              <div className="text-xs font-normal text-[var(--color-subtle)]">
                {n.app}
              </div>
            </div>
          ))}
        </div>

        <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[var(--color-primary)]/40 bg-[var(--color-surface)] shadow-[var(--shadow-glow)]">
          <LogoMark className="h-12 w-12" />
        </div>

        <div className="grid gap-3">
          {right.map((n) => (
            <div
              key={n.label}
              className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm font-medium text-[var(--color-fg)] shadow-sm"
            >
              {n.label}
              <div className="text-xs font-normal text-[var(--color-subtle)]">
                {n.app}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
