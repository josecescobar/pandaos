import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { PricingSection } from "@/components/sections/pricing-section";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing · PandaOS" },
      {
        name: "description",
        content:
          "PandaOS pricing for Starter, Team, and Enterprise. Sign in to get started.",
      },
    ],
  }),
  component: PricingRoute,
});

function PricingRoute() {
  return (
    <SiteShell>
      <div className="pt-6">
        <PricingSection />
      </div>
    </SiteShell>
  );
}
