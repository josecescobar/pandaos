import {
  Check,
  Code2,
  Mail,
  Rocket,
  Workflow,
} from "lucide-react";
import { SignInButton } from "@/components/brand/sign-in-button";
import { Logo } from "@/components/brand/logo";
import { Checklist } from "@/components/modules/checklist";
import { builders } from "@/content/builders";
import { cn } from "@/lib/utils";

const pillIcons = {
  Code: Code2,
  Email: Mail,
  Deploy: Rocket,
  Automation: Workflow,
} as const;

export function DepartmentOfOneHero() {
  const c = builders.hero;

  return (
    <section className="relative overflow-hidden bg-[#05070f]">
      <div className="pointer-events-none absolute inset-0 hero-glow opacity-90" />
      <div className="pointer-events-none absolute inset-0 grid-fade opacity-35" />

      <div className="container-site relative section-pad">
        <div className="mb-10 flex items-center justify-between gap-4">
          <Logo />
          <span className="hidden text-xs font-medium tracking-wide text-[var(--color-subtle)] sm:inline">
            pandaos.ai
          </span>
        </div>

        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="mb-4 text-sm font-medium text-[var(--color-primary)]">
              Builders · Department of One
            </p>
            <h1 className="text-balance text-4xl font-semibold tracking-[-0.035em] text-white sm:text-5xl md:text-[3.25rem] md:leading-[1.08]">
              {c.title}
              <br />
              <span className="text-[var(--color-primary)]">{c.titleAccent}</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-[var(--color-muted)] sm:text-lg">
              {c.bodyLead}
            </p>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-[var(--color-muted)] sm:text-lg">
              {c.body}
            </p>

            <div className="mt-7 flex flex-wrap gap-2">
              {c.pills.map((pill) => {
                const Icon = pillIcons[pill];
                return (
                  <span
                    key={pill}
                    className="inline-flex items-center gap-2 rounded-[var(--radius-pill)] border border-[var(--color-primary)]/40 bg-[var(--color-primary)]/15 px-3.5 py-1.5 text-sm font-semibold text-white shadow-[0_0_0_1px_rgba(59,130,246,0.15)]"
                  >
                    <span className="grid h-5 w-5 place-items-center rounded-full bg-[var(--color-primary)] text-white">
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </span>
                    {pill}
                    <Icon className="h-3.5 w-3.5 text-white/70" />
                  </span>
                );
              })}
            </div>

            <div className="mt-8">
              <Checklist items={[...c.checklist]} />
            </div>

            <div className="mt-9">
              <SignInButton size="lg" showArrow>
                {c.cta}
              </SignInButton>
            </div>
          </div>

          {/* Multi-monitor command desk visual (ad-inspired) */}
          <div className="relative">
            <div className="absolute -inset-6 rounded-[2rem] bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.18),transparent_65%)]" />
            <div className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#0b1220] shadow-[0_30px_80px_rgba(0,0,0,0.55)]">
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                </div>
                <span className="text-[11px] font-medium text-[var(--color-subtle)]">
                  Command Center · Live
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 p-3 sm:gap-3 sm:p-4">
                {[
                  {
                    title: "Code",
                    lines: [
                      "const deploy = await vercel.promote()",
                      "✓ build succeeded · 1.2s",
                      "PR #482 ready for review",
                    ],
                    tone: "text-sky-300",
                  },
                  {
                    title: "Email",
                    lines: [
                      "From: client@acme.com",
                      "SSO timeout on mobile",
                      "Draft reply + Jira ticket",
                    ],
                    tone: "text-emerald-300",
                  },
                  {
                    title: "Deploy",
                    lines: [
                      "Production · Ready",
                      "Preview · 3 active",
                      "Rollback available",
                    ],
                    tone: "text-violet-300",
                  },
                  {
                    title: "Automation",
                    lines: [
                      "Agent /devops-engineer",
                      "Running CI fix…",
                      "Notify #eng on done",
                    ],
                    tone: "text-amber-300",
                  },
                ].map((panel) => (
                  <div
                    key={panel.title}
                    className="rounded-[1rem] border border-white/[0.08] bg-[#0f1729] p-3"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-[11px] font-semibold uppercase tracking-wide text-white/80">
                        {panel.title}
                      </span>
                      <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-success)]" />
                    </div>
                    <div className="space-y-1.5 font-mono text-[10px] leading-relaxed sm:text-[11px]">
                      {panel.lines.map((line, i) => (
                        <div
                          key={line}
                          className={cn(
                            "truncate",
                            i === 0 ? panel.tone : "text-white/45",
                          )}
                        >
                          {line}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/10 px-4 py-3">
                <div className="flex items-center gap-2 rounded-[var(--radius-pill)] border border-white/10 bg-black/30 px-3 py-2 text-xs text-[var(--color-muted)]">
                  <Workflow className="h-3.5 w-3.5 text-[var(--color-primary)]" />
                  <span className="truncate">
                    Run: deploy preview → email client → open Linear issue
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
