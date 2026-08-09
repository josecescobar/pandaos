import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/$")({
  component: NotFound,
});

function NotFound() {
  return (
    <SiteShell>
      <div className="container-site section-pad text-center">
        <p className="text-sm font-medium text-[var(--color-primary)]">404</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          Page not found
        </h1>
        <p className="mx-auto mt-3 max-w-md text-[var(--color-muted)]">
          That route doesn’t exist. Head back home or open the workspace.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link to="/">Home</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link to="/workspace">Workspace</Link>
          </Button>
        </div>
      </div>
    </SiteShell>
  );
}
