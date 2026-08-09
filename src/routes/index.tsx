import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { BusinessPage } from "@/components/sections/business-page";
import { business } from "@/content/business";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: business.meta.title },
      { name: "description", content: business.meta.description },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <SiteShell>
      <BusinessPage />
    </SiteShell>
  );
}
