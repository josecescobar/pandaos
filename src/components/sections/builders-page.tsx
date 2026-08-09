import { builders } from "@/content/builders";
import { SignInButton } from "@/components/brand/sign-in-button";
import { AgentStack } from "@/components/modules/agent-stack";
import { Checklist } from "@/components/modules/checklist";
import { DepartmentOfOneHero } from "@/components/modules/department-of-one-hero";
import { MetricsBand } from "@/components/modules/metrics-band";
import { SocialProofStrip } from "@/components/modules/social-proof";
import { TemplateChips } from "@/components/modules/template-chips";
import { ToolsFightingHero } from "@/components/modules/tools-fighting-hero";
import { TrustStrip } from "@/components/modules/trust-strip";
import { WorkflowMotion } from "@/components/modules/workflow-motion";
import { ProductTourButton } from "@/components/modules/product-tour";
import {
  CheckCircle2,
  GitBranch,
  Rocket,
  Terminal,
} from "lucide-react";

export function BuildersPage() {
  const c = builders;

  return (
    <>
      <DepartmentOfOneHero />

      <MetricsBand />

      <section className="section-pad border-b border-[var(--color-border)]">
        <div className="container-site">
          <div className="mx-auto mb-8 max-w-2xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Watch a cross-stack run
            </h2>
            <p className="mt-2 text-sm text-[var(--color-muted)]">
              Code, email, deploy, and follow-up — the messy middle in one
              motion.
            </p>
          </div>
          <div className="mx-auto grid max-w-5xl items-start gap-6 lg:grid-cols-2">
            <WorkflowMotion />
            <div>
              <p className="mb-3 text-xs font-medium uppercase tracking-wide text-[var(--color-subtle)]">
                Start with a template
              </p>
              <TemplateChips align="left" />
              <div className="mt-6">
                <Checklist items={[...c.hero.checklist]} />
              </div>
              <div className="mt-6">
                <ProductTourButton />
              </div>
            </div>
          </div>
        </div>
      </section>

      <SocialProofStrip />

      {/* Agency framing */}
      <section className="relative overflow-hidden border-t border-[var(--color-border)]">
        <div className="pointer-events-none absolute inset-0 hero-glow opacity-50" />
        <div className="container-site relative section-pad">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-balance text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
                {c.agency.title}{" "}
                <span className="text-[var(--color-primary)]">
                  {c.agency.titleAccent}
                </span>
                <br />
                {c.agency.titleEnd}
              </h2>
              <p className="mt-5 text-base leading-relaxed text-[var(--color-muted)] sm:text-lg">
                {c.agency.body}
              </p>
              <div className="mt-6">
                <Checklist items={[...c.agency.checklist]} />
              </div>
              <div className="mt-8">
                <SignInButton size="lg">Open workspace</SignInButton>
              </div>
            </div>
            <AgentStack />
          </div>
        </div>
      </section>

      <ToolsFightingHero track="builders" showChrome={false} />

      <section className="border-y border-[var(--color-border)] bg-[var(--color-bg-elevated)]">
        <div className="container-site section-pad">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              <span className="text-[var(--color-primary)]">{c.vibe.title}</span>
              <br />
              {c.vibe.titleAccent}
            </h2>
            <p className="mt-3 text-sm tracking-wide text-[var(--color-subtle)]">
              {c.vibe.sub}
            </p>
            <p className="mt-4 text-[var(--color-muted)]">{c.vibe.body}</p>
          </div>

          <div className="mx-auto mt-10 grid max-w-4xl gap-4 md:grid-cols-3">
            {[
              {
                icon: Terminal,
                title: "Build log",
                body: "Static pages optimized · routes ready · production green",
              },
              {
                icon: Rocket,
                title: "Deploy",
                body: "Vercel production Ready · preview deploys in one flow",
              },
              {
                icon: GitBranch,
                title: "GitHub",
                body: "PRs, history, issues, and releases without leaving context",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5"
              >
                <item.icon className="mb-3 h-5 w-5 text-[var(--color-primary)]" />
                <h3 className="font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-[var(--color-muted)]">
                  {item.body}
                </p>
              </div>
            ))}
          </div>

          <div className="mx-auto mt-10 max-w-xl">
            <Checklist items={[...c.vibe.checklist]} />
          </div>
        </div>
      </section>

      <TrustStrip />

      <section className="section-pad">
        <div className="container-site">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {c.features.title}
            </h2>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {c.features.items.map((f) => (
              <div
                key={f.title}
                className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5"
              >
                <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-accent-soft)]">
                  <CheckCircle2 className="h-4 w-4 text-[var(--color-primary)]" />
                </div>
                <h3 className="font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-[var(--color-muted)]">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[var(--color-border)] bg-[#0a1630]">
        <div className="container-site section-pad text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {c.cta.title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[var(--color-muted)]">
            {c.cta.body}
          </p>
          <div className="mt-8 flex justify-center">
            <SignInButton size="lg" showArrow>
              {c.cta.cta}
            </SignInButton>
          </div>
        </div>
      </section>
    </>
  );
}
