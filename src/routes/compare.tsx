import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { SignInButton } from "@/components/brand/sign-in-button";
import { Button } from "@/components/ui/button";
import { compare } from "@/content/compare";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/compare")({
  head: () => ({
    meta: [
      { title: compare.meta.title },
      { name: "description", content: compare.meta.description },
    ],
  }),
  component: CompareRoute,
});

function CompareRoute() {
  const c = compare;

  return (
    <SiteShell>
      <section className="section-pad">
        <div className="container-site">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-medium text-[var(--color-primary)]">
              Compare
            </p>
            <h1 className="mt-2 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              {c.hero.title}{" "}
              <span className="text-[var(--color-primary)]">
                {c.hero.titleAccent}
              </span>
            </h1>
            <p className="mt-4 text-[var(--color-muted)]">{c.hero.body}</p>
          </div>

          <div className="mt-12 overflow-x-auto rounded-[var(--radius-2xl)] border border-[var(--color-border)]">
            <table className="w-full min-w-[720px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg-elevated)]">
                  <th className="px-4 py-3 font-medium text-[var(--color-subtle)]">
                    Capability
                  </th>
                  {c.columns.map((col) => (
                    <th
                      key={col.id}
                      className={cn(
                        "px-4 py-3 font-semibold",
                        "highlight" in col && col.highlight
                          ? "bg-[var(--color-accent-soft)]/40 text-[var(--color-fg)]"
                          : "text-[var(--color-muted)]",
                      )}
                    >
                      {col.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {c.rows.map((row) => (
                  <tr
                    key={row.feature}
                    className="border-b border-[var(--color-border)]/70 last:border-0"
                  >
                    <td className="px-4 py-3 font-medium text-[var(--color-fg)]">
                      {row.feature}
                    </td>
                    <td className="bg-[var(--color-accent-soft)]/20 px-4 py-3 font-medium text-[var(--color-fg)]">
                      {row.pandaos}
                    </td>
                    <td className="px-4 py-3 text-[var(--color-muted)]">
                      {row.lindy}
                    </td>
                    <td className="px-4 py-3 text-[var(--color-muted)]">
                      {row.zapier}
                    </td>
                    <td className="px-4 py-3 text-[var(--color-muted)]">
                      {row.chatgpt}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {c.takeaways.map((t) => (
              <div
                key={t.title}
                className={cn(
                  "rounded-[var(--radius-xl)] border p-5",
                  t.title.includes("PandaOS")
                    ? "border-[var(--color-primary)] bg-[var(--color-accent-soft)]/30"
                    : "border-[var(--color-border)] bg-[var(--color-surface)]",
                )}
              >
                <h2 className="font-semibold">{t.title}</h2>
                <p className="mt-2 text-sm text-[var(--color-muted)]">{t.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-3">
            <SignInButton size="lg" showArrow>
              Try PandaOS
            </SignInButton>
            <Button asChild size="lg" variant="secondary">
              <Link to="/templates">Browse templates</Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link to="/security">Security</Link>
            </Button>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
