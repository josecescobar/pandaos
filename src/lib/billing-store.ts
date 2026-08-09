import { create } from "zustand";
import { persist } from "zustand/middleware";

export type BillingPlan = "free" | "pro" | "team";

export type PaymentMethod = {
  brand: string;
  last4: string;
  exp: string;
};

export type Invoice = {
  id: string;
  date: number;
  amount: string;
  plan: BillingPlan;
  status: "paid" | "open";
};

type BillingState = {
  plan: BillingPlan;
  seats: number;
  paymentMethod: PaymentMethod | null;
  invoices: Invoice[];
  customerEmail: string;
  customerName: string;
  setCustomer: (name: string, email: string) => void;
  setSeats: (n: number) => void;
  completeCheckout: (input: {
    plan: BillingPlan;
    seats: number;
    name: string;
    email: string;
    cardLast4: string;
  }) => void;
  cancelToFree: () => void;
};

export const planMeta: Record<
  BillingPlan,
  { name: string; price: number; period: string }
> = {
  free: { name: "Free", price: 0, period: "forever" },
  pro: { name: "Pro", price: 49, period: "per seat / mo" },
  team: { name: "Team", price: 79, period: "per seat / mo" },
};

export const useBillingStore = create<BillingState>()(
  persist(
    (set) => ({
      plan: "pro",
      seats: 1,
      paymentMethod: null,
      invoices: [],
      customerEmail: "admin@pandaos.ai",
      customerName: "admin",
      setCustomer: (name, email) =>
        set({ customerName: name, customerEmail: email }),
      setSeats: (n) => set({ seats: Math.max(1, Math.min(50, n)) }),
      completeCheckout: ({ plan, seats, name, email, cardLast4 }) => {
        const price = planMeta[plan].price * seats;
        const invoice: Invoice = {
          id: `inv_${Date.now().toString(36)}`,
          date: Date.now(),
          amount: plan === "free" ? "$0" : `$${price}`,
          plan,
          status: "paid",
        };
        set((s) => ({
          plan,
          seats,
          customerName: name,
          customerEmail: email,
          paymentMethod:
            plan === "free"
              ? s.paymentMethod
              : {
                  brand: "Visa",
                  last4: cardLast4,
                  exp: "12/28",
                },
          invoices: [invoice, ...s.invoices].slice(0, 20),
        }));
      },
      cancelToFree: () =>
        set((s) => ({
          plan: "free" as const,
          seats: 1,
          invoices: [
            {
              id: `inv_${Date.now().toString(36)}`,
              date: Date.now(),
              amount: "$0",
              plan: "free" as const,
              status: "paid" as const,
            },
            ...s.invoices,
          ].slice(0, 20),
        })),
    }),
    { name: "pandaos-billing-v1" },
  ),
);
