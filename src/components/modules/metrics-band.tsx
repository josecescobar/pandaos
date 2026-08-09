import { cn } from "@/lib/utils";
import { integrations } from "@/content/integrations";

const metrics = [
  { value: `${integrations.length}+`, label: "Integrations ready" },
  { value: "1", label: "Command center" },
  { value: "4×", label: "Fewer app switches*" },
  { value: "Zero", label: "Waitlist to start" },
];

export function MetricsBand({ className }: { className?: string }) {
  return (
    <section className={cn("border-y border-[var(--color-border)]", className)}>
      <div className="container-site py-10">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {metrics.map((m) => (
            <div key={m.label} className="text-center">
              <div className="text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl">
                {m.value}
              </div>
              <div className="mt-1 text-xs font-medium text-[var(--color-muted)] sm:text-sm">
                {m.label}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-6 text-center text-[11px] text-[var(--color-subtle)]">
          *Based on typical multi-app ops workflows (CRM → docs → chat → email)
          consolidated into one run.
        </p>
      </div>
    </section>
  );
}
