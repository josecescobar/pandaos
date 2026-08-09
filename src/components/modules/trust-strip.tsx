import { KeyRound, Lock, Server, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  {
    icon: Shield,
    title: "Your data stays yours",
    body: "Never used to train public models.",
  },
  {
    icon: KeyRound,
    title: "Bring your own keys",
    body: "OpenAI, Anthropic, Gemini, custom endpoints.",
  },
  {
    icon: Lock,
    title: "Role-aware workspace",
    body: "Signed-in sessions and controlled access.",
  },
  {
    icon: Server,
    title: "Local-first ready",
    body: "Operate without giving up stack control.",
  },
];

export function TrustStrip({ className }: { className?: string }) {
  return (
    <section className={cn("section-pad py-12", className)}>
      <div className="container-site">
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Enterprise-minded from day one
          </h2>
          <p className="mt-2 text-sm text-[var(--color-muted)]">
            Control, privacy, and stack ownership — without waiting on a
            procurement cycle to try the product.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.title}
              className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5"
            >
              <item.icon className="mb-3 h-5 w-5 text-[var(--color-primary)]" />
              <h3 className="text-sm font-semibold">{item.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-[var(--color-muted)]">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
