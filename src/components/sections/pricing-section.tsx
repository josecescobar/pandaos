import { Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { pricing } from "@/content/pricing";
import { SignInButton } from "@/components/brand/sign-in-button";
import { Button } from "@/components/ui/button";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { cn } from "@/lib/utils";

export function PricingSection() {
  const { user } = useCurrentUserState();

  return (
    <section
      id="pricing"
      className="border-y border-[var(--color-border)] bg-[var(--color-bg-elevated)]"
    >
      <div className="container-site section-pad">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            {pricing.title}
          </h2>
          <p className="mt-4 text-[var(--color-muted)]">{pricing.body}</p>
        </div>

        <div className="mx-auto mt-10 max-w-4xl rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <h3 className="text-center text-sm font-semibold uppercase tracking-wide text-[var(--color-subtle)]">
            {pricing.contrast.title}
          </h3>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {pricing.contrast.items.map((item) => (
              <div
                key={item.label}
                className={cn(
                  "rounded-[var(--radius-xl)] border p-4 text-center",
                  "highlight" in item && item.highlight
                    ? "border-[var(--color-primary)] bg-[var(--color-accent-soft)]/40"
                    : "border-[var(--color-border)]",
                )}
              >
                <div className="text-xs font-medium text-[var(--color-muted)]">
                  {item.label}
                </div>
                <div className="mt-1 text-xl font-semibold tracking-tight">
                  {item.price}
                </div>
                <div className="mt-1 text-[11px] text-[var(--color-subtle)]">
                  {item.note}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {pricing.plans.map((plan) => (
            <div
              key={plan.id}
              className={cn(
                "flex flex-col rounded-[var(--radius-xl)] border p-6",
                plan.featured
                  ? "border-[var(--color-primary)] bg-[var(--color-surface)] shadow-[0_0_0_1px_var(--color-primary),0_20px_50px_rgba(59,130,246,0.12)]"
                  : "border-[var(--color-border)] bg-[var(--color-surface)]",
              )}
            >
              {plan.featured ? (
                <span className="mb-3 w-fit rounded-[var(--radius-pill)] bg-[var(--color-accent-soft)] px-2.5 py-0.5 text-[11px] font-semibold text-[var(--color-primary)]">
                  Most popular
                </span>
              ) : (
                <span className="mb-3 h-5" />
              )}
              <h3 className="text-lg font-semibold">{plan.name}</h3>
              <div className="mt-3 flex items-baseline gap-1.5">
                <span className="text-3xl font-semibold tracking-tight">
                  {plan.price}
                </span>
                <span className="text-sm text-[var(--color-subtle)]">
                  {plan.period}
                </span>
              </div>
              <p className="mt-3 text-sm text-[var(--color-muted)]">
                {plan.description}
              </p>
              <ul className="mt-6 flex-1 space-y-2.5">
                {plan.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2 text-sm text-[var(--color-fg)]"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-success)]" />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                {user ? (
                  <Button
                    asChild
                    variant={plan.featured ? "default" : "secondary"}
                    className="w-full"
                  >
                    <Link to="/checkout" search={{ plan: plan.id }}>
                      {plan.cta}
                    </Link>
                  </Button>
                ) : (
                  <SignInButton
                    variant={plan.featured ? "default" : "secondary"}
                    className="w-full"
                    showArrow={plan.featured}
                    to="/login"
                  >
                    {plan.cta}
                  </SignInButton>
                )}
              </div>
            </div>
          ))}
        </div>

        <p className="mx-auto mt-8 max-w-xl text-center text-xs text-[var(--color-subtle)]">
          {pricing.enterpriseNote}
        </p>
      </div>
    </section>
  );
}
