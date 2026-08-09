import {
  ArrowRight,
  Database,
  FileText,
  LayoutDashboard,
  Lock,
  Mail,
  RefreshCw,
  Server,
  Shield,
  Sparkles,
  Ticket,
  Users,
  Workflow,
  KeyRound,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { business } from "@/content/business";
import { SignInButton } from "@/components/brand/sign-in-button";
import { Checklist } from "@/components/modules/checklist";
import { DiagramHub } from "@/components/modules/diagram-hub";
import { IntegrationsGrid } from "@/components/modules/integrations-grid";
import { MetricsBand } from "@/components/modules/metrics-band";
import { ProductUi } from "@/components/modules/product-ui";
import { SocialProofStrip } from "@/components/modules/social-proof";
import { TemplateChips } from "@/components/modules/template-chips";
import { ToolsFightingHero } from "@/components/modules/tools-fighting-hero";
import { TrustStrip } from "@/components/modules/trust-strip";
import { WorkflowMotion } from "@/components/modules/workflow-motion";
import { ProductTourButton } from "@/components/modules/product-tour";
import { PricingSection } from "@/components/sections/pricing-section";
import { Button } from "@/components/ui/button";

const problemIcons = [RefreshCw, FileText, Sparkles, Server];
const spineIcons = [
  Users,
  Ticket,
  FileText,
  LayoutDashboard,
  Mail,
  Database,
  Workflow,
];
const pillarIcons = [Shield, KeyRound, Server, Lock];

export function BusinessPage() {
  const c = business;

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 hero-glow" />
        <div className="pointer-events-none absolute inset-0 grid-fade opacity-50" />
        <div className="container-site relative section-pad pb-10">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 text-sm font-medium text-[var(--color-primary)]">
              {c.hero.eyebrow}
            </p>
            <h1 className="text-balance text-4xl font-semibold tracking-[-0.03em] text-[var(--color-fg)] sm:text-5xl lg:text-6xl">
              {c.hero.titleLead}{" "}
              <span className="text-[var(--color-primary)]">
                {c.hero.titleAccent}
              </span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-[var(--color-muted)] sm:text-lg">
              {c.hero.body}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <SignInButton size="lg" showArrow>
                {c.hero.cta}
              </SignInButton>
              <ProductTourButton size="lg" />
              <Button asChild size="lg" variant="secondary">
                <Link to="/workspace">Open workspace</Link>
              </Button>
            </div>
            <p className="mt-6 text-xs font-medium uppercase tracking-wide text-[var(--color-subtle)]">
              Try a workflow
            </p>
            <div className="mt-3">
              <TemplateChips />
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              {c.hero.trust.map((t) => (
                <span
                  key={t}
                  className="rounded-[var(--radius-pill)] border border-[var(--color-border)] bg-white/5 px-3 py-1 text-xs font-medium text-[var(--color-muted)]"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Motion + product */}
          <div className="mx-auto mt-14 max-w-6xl">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                {c.commandHero.title}{" "}
                <span className="text-[var(--color-primary)]">
                  {c.commandHero.titleAccent}
                </span>
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm text-[var(--color-muted)] sm:text-base">
                {c.commandHero.body}
              </p>
            </div>
            <div className="grid items-start gap-6 lg:grid-cols-[0.95fr_1.05fr]">
              <WorkflowMotion />
              <div className="min-w-0">
                <ProductUi />
              </div>
            </div>
            <div className="mt-5 text-center">
              <Link
                to="/workspace"
                className="inline-flex items-center gap-1 text-sm font-medium text-[var(--color-primary)] underline-offset-4 hover:underline"
              >
                Open full command center
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <MetricsBand />
      <SocialProofStrip />

      {/* Ad checklist band */}
      <section className="border-y border-[var(--color-border)] bg-[var(--color-bg-elevated)]">
        <div className="container-site section-pad py-12">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                {c.altHero.title}
                <br />
                <span className="text-[var(--color-primary)]">
                  {c.altHero.titleAccent}
                </span>
              </h2>
              <p className="mt-3 text-sm tracking-wide text-[var(--color-subtle)]">
                {c.altHero.sub}
              </p>
              <div className="mt-6">
                <Checklist items={[...c.adChecklist]} />
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <SignInButton>Sign in</SignInButton>
                <Button asChild variant="secondary">
                  <Link to="/integrations">View integrations</Link>
                </Button>
              </div>
            </div>
            <IntegrationsGrid
              track="business"
              ids={[
                "hubspot",
                "notion",
                "gmail",
                "google-calendar",
                "github",
                "postgresql",
              ]}
            />
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="section-pad">
        <div className="container-site">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              {c.problem.title}
            </h2>
            <p className="mt-4 text-[var(--color-muted)]">{c.problem.body}</p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {c.problem.points.map((p, i) => {
              const Icon = problemIcons[i] ?? Sparkles;
              return (
                <div
                  key={p.title}
                  className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5"
                >
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-[12px] bg-[var(--color-accent-soft)] text-[var(--color-primary)]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold">{p.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-muted)]">
                    {p.body}
                  </p>
                </div>
              );
            })}
          </div>
          <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-[var(--color-muted)]">
            {c.problem.footer}
          </p>
        </div>
      </section>

      {/* Operational layer */}
      <section className="border-y border-[var(--color-border)] bg-[#0a1630]">
        <div className="container-site section-pad">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              {c.operational.title}
            </h2>
            <p className="mt-4 text-[var(--color-muted)]">{c.operational.body}</p>
          </div>
          <div className="mx-auto mt-12 flex max-w-sm flex-col items-center">
            {c.operational.spine.map((label, i) => {
              const Icon = spineIcons[i] ?? Workflow;
              return (
                <div key={label} className="flex w-full flex-col items-center">
                  <div className="flex w-full items-center gap-4 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-white/5 text-[var(--color-primary)]">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="font-medium">{label}</span>
                  </div>
                  {i < c.operational.spine.length - 1 ? (
                    <div className="h-4 w-px bg-[var(--color-border-strong)]" />
                  ) : null}
                </div>
              );
            })}
          </div>
          <div className="mx-auto mt-12 max-w-3xl">
            <DiagramHub />
          </div>
        </div>
      </section>

      <TrustStrip />

      {/* Use cases */}
      <section className="section-pad border-t border-[var(--color-border)]">
        <div className="container-site">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {c.useCases.title}
            </h2>
            <p className="mt-4 text-[var(--color-muted)]">{c.useCases.body}</p>
          </div>
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {c.useCases.items.map((u) => (
              <div
                key={u}
                className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-fg)]"
              >
                {u}
              </div>
            ))}
          </div>
          <div className="mt-8">
            <p className="mb-3 text-center text-xs font-medium uppercase tracking-wide text-[var(--color-subtle)]">
              Run one now
            </p>
            <TemplateChips />
          </div>
        </div>
      </section>

      {/* Enterprise pillars */}
      <section className="border-y border-[var(--color-border)] bg-[var(--color-bg-elevated)]">
        <div className="container-site section-pad">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {c.enterprise.title}
            </h2>
            <p className="mt-4 text-[var(--color-muted)]">{c.enterprise.body}</p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {c.enterprise.pillars.map((p, i) => {
              const Icon = pillarIcons[i] ?? Shield;
              return (
                <div
                  key={p.title}
                  className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5"
                >
                  <Icon className="mb-3 h-5 w-5 text-[var(--color-primary)]" />
                  <h3 className="font-semibold">{p.title}</h3>
                  <p className="mt-2 text-sm text-[var(--color-muted)]">{p.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Audiences */}
      <section className="section-pad">
        <div className="container-site">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {c.audiences.title}
            </h2>
            <p className="mt-4 text-[var(--color-muted)]">{c.audiences.body}</p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {c.audiences.items.map((a) => (
              <div
                key={a.title}
                className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5"
              >
                <h3 className="font-semibold">{a.title}</h3>
                <p className="mt-2 text-sm text-[var(--color-muted)]">{a.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ToolsFightingHero track="business" showChrome={false} />

      <PricingSection />

      {/* Final CTA */}
      <section className="border-t border-[var(--color-border)] bg-[#0a1630]">
        <div className="container-site section-pad text-center">
          <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            {c.cta.title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[var(--color-muted)]">
            {c.cta.body}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <SignInButton size="lg" showArrow>
              {c.cta.cta}
            </SignInButton>
            <Button asChild size="lg" variant="secondary">
              <Link to="/builders">Builders track →</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
