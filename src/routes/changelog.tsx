import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { SignInButton } from "@/components/brand/sign-in-button";
import { Button } from "@/components/ui/button";
import { changelog } from "@/content/changelog";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/changelog")({
  head: () => ({
    meta: [
      { title: changelog.meta.title },
      { name: "description", content: changelog.meta.description },
    ],
  }),
  component: ChangelogRoute,
});

function ChangelogRoute() {
  const c = changelog;

  return (
    <SiteShell>
      <section className="section-pad">
        <div className="container-site">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-medium text-[var(--color-primary)]">
              Product
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              {c.hero.title}
            </h1>
            <p className="mt-4 text-[var(--color-muted)]">{c.hero.body}</p>
          </div>

          <div className="mt-14">
            <h2 className="text-center text-xl font-semibold">Roadmap</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {c.roadmap.map((col) => (
                <div
                  key={col.status}
                  className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5"
                >
                  <span
                    className={cn(
                      "rounded-[var(--radius-pill)] px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
                      col.color,
                    )}
                  >
                    {col.status}
                  </span>
                  <ul className="mt-4 space-y-2.5 text-sm text-[var(--color-muted)]">
                    {col.items.map((item) => (
                      <li key={item} className="flex gap-2">
                        <span className="text-[var(--color-primary)]">·</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="mx-auto mt-16 max-w-2xl space-y-6">
            <h2 className="text-center text-xl font-semibold">Shipped</h2>
            {c.shipped.map((rel) => (
              <article
                key={rel.version}
                className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-semibold">
                    <span className="text-[var(--color-primary)]">
                      v{rel.version}
                    </span>{" "}
                    · {rel.title}
                  </h3>
                  <time className="text-xs text-[var(--color-subtle)]">
                    {rel.date}
                  </time>
                </div>
                <ul className="mt-3 space-y-1.5 text-sm text-[var(--color-muted)]">
                  {rel.items.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <div className="mt-14 flex flex-wrap justify-center gap-3">
            <SignInButton showArrow>Open product</SignInButton>
            <Button asChild variant="secondary">
              <Link to="/security">Security</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link to="/pricing">Pricing</Link>
            </Button>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
