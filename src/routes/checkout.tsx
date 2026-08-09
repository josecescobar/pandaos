import { useMemo, useState } from "react";
import {
  createFileRoute,
  Link,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";
import { toast } from "sonner";
import { SiteShell } from "@/components/layout/site-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  planMeta,
  useBillingStore,
  type BillingPlan,
} from "@/lib/billing-store";
import { useTeamStore } from "@/lib/team-store";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { cn } from "@/lib/utils";

type CheckoutSearch = { plan?: string };

export const Route = createFileRoute("/checkout")({
  validateSearch: (s: Record<string, unknown>): CheckoutSearch => ({
    plan: typeof s.plan === "string" ? s.plan : undefined,
  }),
  head: () => ({
    meta: [{ title: "Checkout · PandaOS" }],
  }),
  component: CheckoutRoute,
});

function normalizePlan(raw?: string): BillingPlan {
  if (raw === "pro" || raw === "team" || raw === "free") return raw;
  return "pro";
}

function CheckoutRoute() {
  const { plan: planQ } = useSearch({ from: "/checkout" });
  const { user, isPending } = useCurrentUserState();
  const navigate = useNavigate();
  const completeCheckout = useBillingStore((s) => s.completeCheckout);
  const setTeamPlan = useTeamStore((s) => s.setPlan);
  const logActivity = useTeamStore((s) => s.logActivity);

  const [plan, setPlan] = useState<BillingPlan>(normalizePlan(planQ));
  const [seats, setSeats] = useState(1);
  const [name, setName] = useState("admin");
  const [email, setEmail] = useState("admin@pandaos.ai");
  const [card, setCard] = useState("4242 4242 4242 4242");
  const [exp, setExp] = useState("12/28");
  const [cvc, setCvc] = useState("123");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const total = useMemo(() => {
    const unit = planMeta[plan].price;
    return unit * seats;
  }, [plan, seats]);

  if (isPending) {
    return (
      <div className="grid min-h-dvh place-items-center bg-[var(--color-bg)]">
        <div className="h-10 w-10 animate-pulse rounded-full bg-[var(--color-surface)]" />
      </div>
    );
  }
  if (!user) return <RedirectToSignIn />;

  function pay(e: React.FormEvent) {
    e.preventDefault();
    if (plan !== "free") {
      const digits = card.replace(/\s/g, "");
      if (digits.length < 12) {
        toast.error("Enter a valid card number");
        return;
      }
    }
    setBusy(true);
    window.setTimeout(() => {
      const last4 = card.replace(/\s/g, "").slice(-4) || "4242";
      completeCheckout({
        plan,
        seats: plan === "free" ? 1 : seats,
        name,
        email,
        cardLast4: last4,
      });
      setTeamPlan(plan);
      logActivity(user?.displayName ?? "admin", "Upgraded plan", plan);
      setBusy(false);
      setDone(true);
      toast.success(
        plan === "free" ? "On Free plan" : `Subscribed to ${planMeta[plan].name}`,
      );
    }, 900);
  }

  return (
    <SiteShell>
      <section className="section-pad pt-8">
        <div className="container-site mx-auto max-w-3xl">
          <p className="text-sm font-medium text-[var(--color-primary)]">
            Checkout
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            {done ? "You're all set" : "Upgrade your workspace"}
          </h1>
          <p className="mt-2 text-sm text-[var(--color-muted)]">
            {done
              ? "Billing is updated. Manage seats anytime under Settings."
              : "Secure checkout for PandaOS seats. Test card: 4242…"}
          </p>

          {done ? (
            <div className="mt-8 rounded-[var(--radius-xl)] border border-[var(--color-primary)]/40 bg-[var(--color-accent-soft)]/30 p-6 text-center">
              <p className="font-semibold">
                {planMeta[plan].name}
                {plan !== "free" ? ` · ${seats} seat${seats > 1 ? "s" : ""}` : ""}
              </p>
              <p className="mt-1 text-sm text-[var(--color-muted)]">
                {plan === "free" ? "$0" : `$${total}/mo`} · {email}
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                <Button onClick={() => navigate({ to: "/workspace" })}>
                  Open workspace
                </Button>
                <Button asChild variant="secondary">
                  <Link to="/settings">Billing in settings</Link>
                </Button>
              </div>
            </div>
          ) : (
            <form
              onSubmit={pay}
              className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.9fr]"
            >
              <div className="space-y-4 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
                <div>
                  <Label>Plan</Label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {(["free", "pro", "team"] as const).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPlan(p)}
                        className={cn(
                          "rounded-[var(--radius-pill)] border px-3 py-1.5 text-xs font-semibold capitalize",
                          plan === p
                            ? "border-[var(--color-primary)] bg-[var(--color-accent-soft)]"
                            : "border-[var(--color-border)] text-[var(--color-muted)]",
                        )}
                      >
                        {planMeta[p].name} · ${planMeta[p].price}
                      </button>
                    ))}
                  </div>
                </div>

                {plan !== "free" ? (
                  <div>
                    <Label htmlFor="seats">Seats</Label>
                    <Input
                      id="seats"
                      type="number"
                      min={1}
                      max={50}
                      className="mt-1.5 max-w-[8rem]"
                      value={seats}
                      onChange={(e) =>
                        setSeats(Number(e.target.value) || 1)
                      }
                    />
                  </div>
                ) : null}

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      className="mt-1.5"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Billing email</Label>
                    <Input
                      id="email"
                      type="email"
                      className="mt-1.5"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                {plan !== "free" ? (
                  <>
                    <div>
                      <Label htmlFor="card">Card number</Label>
                      <Input
                        id="card"
                        className="mt-1.5 font-mono"
                        value={card}
                        onChange={(e) => setCard(e.target.value)}
                        placeholder="4242 4242 4242 4242"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="exp">Expiry</Label>
                        <Input
                          id="exp"
                          className="mt-1.5"
                          value={exp}
                          onChange={(e) => setExp(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvc">CVC</Label>
                        <Input
                          id="cvc"
                          className="mt-1.5"
                          value={cvc}
                          onChange={(e) => setCvc(e.target.value)}
                        />
                      </div>
                    </div>
                  </>
                ) : null}

                <Button type="submit" className="w-full" disabled={busy}>
                  {busy
                    ? "Processing…"
                    : plan === "free"
                      ? "Confirm Free plan"
                      : `Pay $${total}/mo`}
                </Button>
              </div>

              <aside className="h-fit rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5">
                <h2 className="text-sm font-semibold">Order summary</h2>
                <dl className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-[var(--color-muted)]">Plan</dt>
                    <dd className="font-medium">{planMeta[plan].name}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-[var(--color-muted)]">Seats</dt>
                    <dd className="font-medium">
                      {plan === "free" ? 1 : seats}
                    </dd>
                  </div>
                  <div className="flex justify-between border-t border-[var(--color-border)] pt-2">
                    <dt className="text-[var(--color-muted)]">Due today</dt>
                    <dd className="text-lg font-semibold">
                      {plan === "free" ? "$0" : `$${total}`}
                    </dd>
                  </div>
                </dl>
                <p className="mt-4 text-[11px] text-[var(--color-subtle)]">
                  Demo checkout — no real charge. Card data stays in this
                  browser session only.
                </p>
                <Link
                  to="/pricing"
                  className="mt-3 inline-block text-xs text-[var(--color-primary)] hover:underline"
                >
                  ← Back to pricing
                </Link>
              </aside>
            </form>
          )}
        </div>
      </section>
    </SiteShell>
  );
}
