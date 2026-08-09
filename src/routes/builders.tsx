import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { BuildersPage } from "@/components/sections/builders-page";
import { builders } from "@/content/builders";

export const Route = createFileRoute("/builders")({
  head: () => ({
    meta: [
      { title: builders.meta.title },
      { name: "description", content: builders.meta.description },
    ],
  }),
  component: BuildersRoute,
});

function BuildersRoute() {
  return (
    <SiteShell>
      <BuildersPage />
    </SiteShell>
  );
}
