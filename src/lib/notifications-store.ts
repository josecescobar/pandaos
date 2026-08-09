import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AppNotification = {
  id: string;
  title: string;
  body: string;
  kind: "info" | "success" | "warning";
  read: boolean;
  href?: string;
  ts: number;
};

type NotificationsState = {
  items: AppNotification[];
  push: (n: Omit<AppNotification, "id" | "ts" | "read">) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  clear: () => void;
  unreadCount: () => number;
};

const seed: AppNotification[] = [
  {
    id: "n1",
    title: "Pipeline moved",
    body: "3 deals entered Negotiation this week (+22% value).",
    kind: "success",
    read: false,
    href: "/workspace",
    ts: Date.now() - 1000 * 60 * 42,
  },
  {
    id: "n2",
    title: "Integration suggestion",
    body: "Connect Google Analytics to unlock full weekly KPI reports.",
    kind: "warning",
    read: false,
    href: "/integrations",
    ts: Date.now() - 1000 * 60 * 60 * 5,
  },
  {
    id: "n3",
    title: "Workflow saved",
    body: "Gmail → Jira triage is ready to re-run anytime.",
    kind: "info",
    read: true,
    href: "/workflows",
    ts: Date.now() - 1000 * 60 * 60 * 26,
  },
];

export const useNotificationsStore = create<NotificationsState>()(
  persist(
    (set, get) => ({
      items: seed,
      push: (n) =>
        set((s) => ({
          items: [
            {
              ...n,
              id: crypto.randomUUID(),
              ts: Date.now(),
              read: false,
            },
            ...s.items,
          ].slice(0, 50),
        })),
      markRead: (id) =>
        set((s) => ({
          items: s.items.map((i) =>
            i.id === id ? { ...i, read: true } : i,
          ),
        })),
      markAllRead: () =>
        set((s) => ({
          items: s.items.map((i) => ({ ...i, read: true })),
        })),
      clear: () => set({ items: [] }),
      unreadCount: () => get().items.filter((i) => !i.read).length,
    }),
    { name: "pandaos-notifications" },
  ),
);
