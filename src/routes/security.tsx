import { createFileRoute, Link } from "@tanstack/react-router";
import { FileCheck2, KeyRound, Shield, Users } from "lucide-react";
import { SiteShell } from "@/components/layout/site-shell";
import { SignInButton } from "@/components/brand/sign-in-button";
import { Button } from "@/components/ui/button";
import { security } from "@/content/security";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/security")({
  head: () => ({
    meta: [
      { title: security.meta.title },
      { name: "description", content: security.meta.description },
    ],
  }),
  component: SecurityRoute,
});

const pillarIcons = [Shield, KeyRound, Users, FileCheck2];

const statusColor: Record<string, string> = {
  Available: "text-[var(--color-primary)] bg-[var(--color-accent-soft)]",
  Roadmap: "text-amber-300 bg-amber-500/10",
  Enterprise: "text-violet-300 bg-violet-500/10",
};

function SecurityRoute() {
  const c = security;

  return (
    <SiteShell>
      <section className="section-pad">
        <div className="container-site">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-medium text-[var(--color-primary)]">
              Trust center
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              {c.hero.title}
            </h1>
            <p className="mt-4 text-[var(--color-muted)]">{c.hero.body}</p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {c.pillars.map((p, i) => {
              const Icon = pillarIcons[i] ?? Shield;
              return (
                <div
                  key={p.title}
                  className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5"
                >
                  <Icon className="mb-3 h-5 w-5 text-[var(--color-primary)]" />
                  <h2 className="font-semibold">{p.title}</h2>
                  <p className="mt-2 text-sm text-[var(--color-muted)]">
                    {p.body}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-16">
            <h2 className="text-center text-2xl font-semibold tracking-tight">
              Compliance roadmap
            </h2>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {c.compliance.map((item) => (
                <div
                  key={item.title}
                  className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold">{item.title}</h3>
                    <span
                      className={cn(
                        "rounded-[var(--radius-pill)] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                        statusColor[item.status] ?? statusColor.Roadmap,
                      )}
                    >
                      {item.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-[var(--color-muted)]">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16">
            <h2 className="text-center text-2xl font-semibold tracking-tight">
              Retention & control
            </h2>
            <div className="mx-auto mt-8 grid max-w-3xl gap-3">
              {c.retention.map((r) => (
                <div
                  key={r.title}
                  className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-4"
                >
                  <h3 className="text-sm font-semibold">{r.title}</h3>
                  <p className="mt-1 text-sm text-[var(--color-muted)]">
                    {r.body}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16 rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[#0a1630] p-8 text-center">
            <p className="text-sm text-[var(--color-muted)]">{c.contact}</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <SignInButton showArrow>Open workspace</SignInButton>
              <Button asChild variant="secondary">
                <Link to="/privacy">Privacy policy</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link to="/compare">How we compare</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
