import { useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Play } from "lucide-react";
import { SiteShell } from "@/components/layout/site-shell";
import { Button } from "@/components/ui/button";
import { SignInButton } from "@/components/brand/sign-in-button";
import {
  galleryTemplates,
  type GalleryTemplate,
} from "@/content/templates-gallery";
import { PENDING_PROMPT_KEY } from "@/components/modules/template-chips";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/templates")({
  head: () => ({
    meta: [
      { title: "Workflow templates · PandaOS" },
      {
        name: "description",
        content:
          "Run ready-made PandaOS workflows for pipeline, triage, KPIs, Stripe, and more.",
      },
    ],
  }),
  component: TemplatesRoute,
});

const categories = [
  "All",
  "RevOps",
  "Support",
  "Leadership",
  "Finance",
  "Engineering",
] as const;

function TemplatesRoute() {
  const [category, setCategory] =
    useState<(typeof categories)[number]>("All");
  const { user } = useCurrentUserState();
  const navigate = useNavigate();

  const list = useMemo(() => {
    if (category === "All") return galleryTemplates;
    return galleryTemplates.filter((t) => t.category === category);
  }, [category]);

  function run(t: GalleryTemplate) {
    try {
      sessionStorage.setItem(PENDING_PROMPT_KEY, t.prompt);
    } catch {
      /* ignore */
    }
    navigate({ to: user ? "/workspace" : "/login" });
  }

  return (
    <SiteShell>
      <section className="section-pad pt-10">
        <div className="container-site">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-medium text-[var(--color-primary)]">
              Template gallery
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Workflows you can run in one click
            </h1>
            <p className="mt-3 text-[var(--color-muted)]">
              Each template shows sample output and the apps it uses. Sign in
              once — then Run opens the command center prefilled.
            </p>
            {!user ? (
              <div className="mt-6">
                <SignInButton showArrow>Sign in to run</SignInButton>
              </div>
            ) : null}
          </div>

          <div className="mt-10 flex gap-2 overflow-x-auto pb-1">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={cn(
                  "shrink-0 rounded-[var(--radius-pill)] border px-3 py-1.5 text-xs font-medium",
                  category === c
                    ? "border-[var(--color-primary)] bg-[var(--color-accent-soft)] text-[var(--color-fg)]"
                    : "border-[var(--color-border)] text-[var(--color-muted)]",
                )}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {list.map((t) => (
              <article
                key={t.id}
                className="flex flex-col rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-primary)]">
                      {t.category}
                    </span>
                    <h2 className="mt-1 text-lg font-semibold">{t.name}</h2>
                  </div>
                  <Button size="sm" onClick={() => run(t)}>
                    <Play className="h-3.5 w-3.5" />
                    Run
                  </Button>
                </div>
                <p className="mt-2 text-sm text-[var(--color-muted)]">
                  {t.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {t.apps.map((a) => (
                    <span
                      key={a}
                      className="rounded-[var(--radius-pill)] bg-white/5 px-2 py-0.5 text-[10px] font-medium text-[var(--color-subtle)]"
                    >
                      {a}
                    </span>
                  ))}
                </div>
                <div className="mt-4 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)]">
                  <div className="border-b border-[var(--color-border)] px-3 py-1.5 text-[11px] font-semibold text-[var(--color-subtle)]">
                    Sample · {t.sample.title}
                  </div>
                  <table className="w-full text-left text-[11px]">
                    <thead>
                      <tr className="text-[var(--color-subtle)]">
                        {t.sample.columns.map((col) => (
                          <th key={col} className="px-3 py-1.5 font-medium">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {t.sample.rows.map((row, i) => (
                        <tr
                          key={i}
                          className="border-t border-[var(--color-border)]/60"
                        >
                          {row.map((cell, j) => (
                            <td key={j} className="px-3 py-1.5 text-[var(--color-fg)]">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
