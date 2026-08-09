import { Link } from "@tanstack/react-router";
import { IntegrationsGrid } from "@/components/modules/integrations-grid";
import { SignInButton } from "@/components/brand/sign-in-button";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/logo";
import type { IntegrationTrack } from "@/content/integrations";

const AD_IDS_BUSINESS = [
  "hubspot",
  "notion",
  "gmail",
  "google-calendar",
  "github",
  "postgresql",
  "slack",
  "teams",
  "jira",
] as const;

const AD_IDS_BUILDERS = [
  "supabase",
  "vercel",
  "gmail",
  "google-calendar",
  "github",
  "hubspot",
  "slack",
  "postgresql",
  "linear",
] as const;

export function ToolsFightingHero({
  track = "business",
  showChrome = true,
}: {
  track?: IntegrationTrack;
  showChrome?: boolean;
}) {
  const ids =
    track === "builders"
      ? [...AD_IDS_BUILDERS]
      : [...AD_IDS_BUSINESS];

  return (
    <section className="relative overflow-hidden border-y border-[var(--color-border)] bg-[#05070f]">
      <div className="pointer-events-none absolute inset-0 hero-glow opacity-80" />
      <div className="pointer-events-none absolute inset-0 grid-fade opacity-30" />

      <div className="container-site relative section-pad">
        {showChrome ? (
          <div className="mb-10 flex items-center justify-between gap-4">
            <Logo />
            <SignInButton size="sm" showArrow>
              Sign in
            </SignInButton>
          </div>
        ) : null}

        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-balance text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl md:text-5xl">
            Your Tools Are Fighting Each Other.
            <br />
            <span className="text-[var(--color-primary)]">
              PandaOS Makes Them Work Together.
            </span>
          </h2>
          <p className="mt-4 text-sm tracking-[0.12em] text-[var(--color-subtle)] sm:text-base">
            Connect · Execute · Automate
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-5xl">
          <IntegrationsGrid
            track={track === "builders" ? "builders" : "business"}
            ids={ids}
            limit={9}
          />
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <SignInButton size="lg" showArrow>
            Sign in
          </SignInButton>
          <Button asChild size="lg" variant="secondary">
            <Link to="/integrations">Browse all integrations</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
