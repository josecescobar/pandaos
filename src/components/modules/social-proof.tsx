import { Star } from "lucide-react";
import { designPartners, logoWall } from "@/content/design-partners";
import { cn } from "@/lib/utils";

export function SocialProofStrip({ className }: { className?: string }) {
  return (
    <section
      className={cn(
        "border-y border-[var(--color-border)] bg-[var(--color-bg-elevated)]",
        className,
      )}
    >
      <div className="container-site py-10">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex items-center gap-1 text-[var(--color-primary)]">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-3.5 w-3.5 fill-current" />
            ))}
          </div>
          <p className="text-sm font-medium text-[var(--color-muted)]">
            Design partners shipping real ops with PandaOS
          </p>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-4">
          {logoWall.map((logo) => (
            <div
              key={logo.name}
              className="flex items-center gap-2 opacity-90"
            >
              <span
                className="grid h-8 w-8 place-items-center rounded-lg text-xs font-bold text-white"
                style={{ background: logo.color }}
              >
                {logo.mark}
              </span>
              <span className="text-sm font-semibold tracking-wide text-[var(--color-subtle)]">
                {logo.name}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {designPartners.map((p) => (
            <blockquote
              key={p.id}
              className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5"
            >
              <div className="mb-3 flex items-center gap-2">
                <span
                  className="grid h-9 w-9 place-items-center rounded-lg text-sm font-bold text-white"
                  style={{ background: p.color }}
                >
                  {p.mark}
                </span>
                <div>
                  <div className="text-sm font-semibold">{p.name}</div>
                  <div className="text-[11px] text-[var(--color-subtle)]">
                    {p.industry}
                  </div>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-[var(--color-fg)]">
                “{p.quote}”
              </p>
              <footer className="mt-4 text-xs text-[var(--color-muted)]">
                <span className="font-semibold text-[var(--color-fg)]">
                  {p.person}
                </span>
                <span className="text-[var(--color-subtle)]"> · {p.role}</span>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
