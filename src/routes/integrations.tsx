import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/workspace/app-shell";
import { IntegrationDetail } from "@/components/workspace/integration-detail";
import { SiteShell } from "@/components/layout/site-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  integrationCategories,
  integrations,
  type Integration,
  type IntegrationCategory,
} from "@/content/integrations";
import { useWorkspaceStore } from "@/lib/workspace-store";
import { SignInButton } from "@/components/brand/sign-in-button";
import { IntegrationMark } from "@/components/brand/integration-mark";
import { cn } from "@/lib/utils";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useNotificationsStore } from "@/lib/notifications-store";

export const Route = createFileRoute("/integrations")({
  head: () => ({
    meta: [
      { title: "Integrations · PandaOS" },
      {
        name: "description",
        content:
          "Connect HubSpot, Notion, Slack, Gmail, Jira, Salesforce, Stripe, and 40+ tools into one AI workspace.",
      },
    ],
  }),
  component: IntegrationsRoute,
});

function IntegrationsRoute() {
  const apps = useWorkspaceStore((s) => s.apps);
  const toggleApp = useWorkspaceStore((s) => s.toggleApp);
  const connectAllPopular = useWorkspaceStore((s) => s.connectAllPopular);
  const ensureCatalogSynced = useWorkspaceStore((s) => s.ensureCatalogSynced);
  const pushNote = useNotificationsStore((s) => s.push);
  const { user, isPending } = useCurrentUserState();

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<IntegrationCategory | "All">("All");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    ensureCatalogSynced();
  }, [ensureCatalogSynced]);

  const connectedIds = useMemo(
    () => new Set(apps.filter((a) => a.connected).map((a) => a.id)),
    [apps],
  );
  const connectedCount = connectedIds.size;
  const selected = integrations.find((i) => i.id === selectedId) ?? null;
  const selectedApp = apps.find((a) => a.id === selectedId);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return integrations.filter((i) => {
      if (category !== "All" && i.category !== category) return false;
      if (!q) return true;
      const hay =
        `${i.name} ${i.description} ${i.category} ${(i.keywords || []).join(" ")}`.toLowerCase();
      return hay.includes(q);
    });
  }, [query, category]);

  function onToggle(id: string) {
    if (!user && !isPending) {
      toast.error("Sign in to manage integrations.");
      return;
    }
    const was = connectedIds.has(id);
    toggleApp(id);
    const name = integrations.find((i) => i.id === id)?.name ?? id;
    toast.success(was ? `Disconnected ${name}` : `Connected ${name}`);
    if (!was) {
      pushNote({
        title: `${name} connected`,
        body: "Open details to sync, view scopes, and try sample prompts.",
        kind: "success",
        href: "/integrations",
      });
    }
  }

  const content = (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-sm font-medium text-[var(--color-primary)]">
            Integrations
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Your tools, working together
          </h1>
          <p className="mt-3 max-w-2xl text-[var(--color-muted)]">
            Open any app for actions, scopes, objects, and sample prompts —
            then connect and sync. {integrations.length} integrations ready.
          </p>
          <p className="mt-2 text-sm text-[var(--color-subtle)]">
            {connectedCount} of {integrations.length} connected
          </p>
        </div>
        {user ? (
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              onClick={() => {
                connectAllPopular();
                toast.success("Connected popular apps");
              }}
            >
              Connect popular
            </Button>
            <Button asChild size="sm" variant="secondary">
              <Link to="/workspace">Open workspace</Link>
            </Button>
          </div>
        ) : (
          <SignInButton>Sign in to connect</SignInButton>
        )}
      </div>

      <div className="mt-8">
        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-subtle)]" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search HubSpot, Stripe, Jira…"
            className="pl-9"
          />
        </div>
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        {(["All", ...integrationCategories] as const).map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            className={cn(
              "min-h-10 shrink-0 rounded-[var(--radius-pill)] border px-3 py-1.5 text-xs font-medium transition-colors",
              category === c
                ? "border-[var(--color-primary)] bg-[var(--color-accent-soft)] text-[var(--color-fg)]"
                : "border-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-fg)]",
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-6">
        <FilteredGrid
          items={filtered}
          connectedIds={connectedIds}
          apps={apps}
          onSelect={setSelectedId}
        />
      </div>

      {!user ? (
        <div className="mt-12 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 text-center">
          <h3 className="font-semibold">Sign in to connect your stack</h3>
          <p className="mt-2 text-sm text-[var(--color-muted)]">
            Use admin credentials, then run workflows across every connected
            app.
          </p>
          <div className="mt-5">
            <SignInButton>Sign in</SignInButton>
          </div>
        </div>
      ) : null}

      {selected ? (
        <IntegrationDetail
          integration={selected}
          connected={connectedIds.has(selected.id)}
          lastSyncedAt={selectedApp?.lastSyncedAt}
          interactive={!!user}
          onClose={() => setSelectedId(null)}
          onToggle={() => onToggle(selected.id)}
        />
      ) : null}
    </div>
  );

  if (user) {
    return <AppShell title="Integrations">{content}</AppShell>;
  }

  return (
    <SiteShell>
      <section className="section-pad pt-10">
        <div className="container-site">{content}</div>
      </section>
    </SiteShell>
  );
}

function FilteredGrid({
  items,
  connectedIds,
  apps,
  onSelect,
}: {
  items: Integration[];
  connectedIds: Set<string>;
  apps: { id: string; lastSyncedAt?: number }[];
  onSelect: (id: string) => void;
}) {
  if (!items.length) {
    return (
      <div className="rounded-[var(--radius-xl)] border border-dashed border-[var(--color-border-strong)] p-10 text-center text-sm text-[var(--color-muted)]">
        No integrations match your filters.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => {
        const connected = connectedIds.has(item.id);
        const synced = apps.find((a) => a.id === item.id)?.lastSyncedAt;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item.id)}
            className={cn(
              "flex h-full w-full flex-col items-start gap-3 rounded-[var(--radius-lg)] border bg-[var(--color-surface)] p-4 text-left transition-[border-color,box-shadow] duration-200 hover:border-[var(--color-border-strong)]",
              connected
                ? "border-[var(--color-primary)] shadow-[0_0_0_1px_var(--color-primary),0_12px_40px_rgba(59,130,246,0.12)]"
                : "border-[var(--color-border)]",
            )}
          >
            <div className="flex w-full items-start justify-between gap-2">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-[12px] border border-white/10"
                style={{ backgroundColor: `${item.color}18` }}
              >
                <IntegrationMark id={item.id} />
              </div>
              <div className="flex items-center gap-1.5">
                {connected ? (
                  <span className="rounded-[var(--radius-pill)] bg-[var(--color-accent-soft)] px-2 py-0.5 text-[10px] font-semibold text-[var(--color-primary)]">
                    Connected
                  </span>
                ) : null}
                <span className="rounded-[var(--radius-pill)] bg-white/5 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[var(--color-subtle)]">
                  {item.category}
                </span>
              </div>
            </div>
            <div>
              <div className="text-sm font-semibold">{item.name}</div>
              <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[var(--color-muted)]">
                {item.description}
              </p>
              {connected ? (
                <p className="mt-2 text-[10px] text-[var(--color-subtle)]">
                  Ready · open for sync & scopes
                </p>
              ) : null}
            </div>
            <span className="mt-auto text-[11px] font-medium text-[var(--color-primary)]">
              View details →
            </span>
          </button>
        );
      })}
    </div>
  );
}
