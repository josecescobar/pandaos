import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { KeyRound, RefreshCw, X } from "lucide-react";
import { IntegrationMark } from "@/components/brand/integration-mark";
import { Button } from "@/components/ui/button";
import { OAuthConnectModal } from "@/components/workspace/oauth-connect-modal";
import { getIntegrationCapability } from "@/content/integration-capabilities";
import type { Integration } from "@/content/integrations";
import { useOAuthStore } from "@/lib/oauth-store";
import { useWorkspaceStore } from "@/lib/workspace-store";
import { cn } from "@/lib/utils";

export function IntegrationDetail({
  integration,
  connected,
  lastSyncedAt,
  onClose,
  onToggle,
  interactive,
}: {
  integration: Integration;
  connected: boolean;
  lastSyncedAt?: number;
  onClose: () => void;
  onToggle: () => void;
  interactive: boolean;
}) {
  const [oauthOpen, setOauthOpen] = useState(false);
  const syncApp = useWorkspaceStore((s) => s.syncApp);
  const send = useWorkspaceStore((s) => s.send);
  const oauth = useOAuthStore((s) => s.connections[integration.id]);
  const disconnectOAuth = useOAuthStore((s) => s.disconnect);
  const navigate = useNavigate();
  const cap = getIntegrationCapability(integration.id);

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
        <button
          type="button"
          className="absolute inset-0 bg-black/60"
          aria-label="Close"
          onClick={onClose}
        />
        <div className="relative z-10 max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-t-[1.25rem] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5 shadow-2xl sm:rounded-[1.25rem]">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <span
                className="grid h-12 w-12 place-items-center rounded-[14px]"
                style={{ background: `${integration.color}22` }}
              >
                <IntegrationMark id={integration.id} className="h-6 w-6" />
              </span>
              <div>
                <h2 className="text-lg font-semibold">{integration.name}</h2>
                <p className="text-xs text-[var(--color-subtle)]">
                  {integration.category}
                  {connected ? " · Connected" : " · Not connected"}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="grid h-9 w-9 place-items-center rounded-full hover:bg-white/5"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <p className="mt-4 text-sm text-[var(--color-muted)]">
            {integration.description}
          </p>

          {oauth ? (
            <div className="mt-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-3 text-xs">
              <div className="flex items-center gap-1.5 font-semibold text-[var(--color-fg)]">
                <KeyRound className="h-3.5 w-3.5 text-[var(--color-primary)]" />
                OAuth active
              </div>
              <p className="mt-1 text-[var(--color-muted)]">
                {oauth.accountLabel} · {oauth.scopes.length} scopes
              </p>
              <p className="mt-0.5 font-mono text-[10px] text-[var(--color-subtle)]">
                {oauth.tokenPreview}
              </p>
            </div>
          ) : null}

          {connected && lastSyncedAt ? (
            <p className="mt-2 text-xs text-[var(--color-subtle)]">
              Last synced {new Date(lastSyncedAt).toLocaleString()}
            </p>
          ) : null}

          <div className="mt-5 flex flex-wrap gap-2">
            {interactive && !connected ? (
              <Button onClick={() => setOauthOpen(true)}>
                Connect with OAuth
              </Button>
            ) : null}
            {interactive && connected ? (
              <>
                <Button
                  variant="secondary"
                  onClick={() => setOauthOpen(true)}
                >
                  Re-authorize
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    syncApp(integration.id);
                    toast.success(`Synced ${integration.name}`);
                  }}
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Sync now
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    disconnectOAuth(integration.id);
                    onToggle();
                    toast.success(`Disconnected ${integration.name}`);
                  }}
                >
                  Disconnect
                </Button>
              </>
            ) : null}
            {!interactive ? (
              <p className="text-xs text-[var(--color-muted)]">
                Sign in to connect via OAuth.
              </p>
            ) : null}
          </div>

          <section className="mt-6">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--color-subtle)]">
              Actions
            </h3>
            <ul className="mt-2 space-y-1.5">
              {cap.actions.map((a) => (
                <li
                  key={a}
                  className="rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 py-2 text-sm"
                >
                  {a}
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-5">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--color-subtle)]">
              Scopes
            </h3>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {(oauth?.scopes ?? cap.scopes).map((s) => (
                <span
                  key={s}
                  className="rounded-[var(--radius-pill)] bg-white/5 px-2.5 py-1 font-mono text-[10px] text-[var(--color-muted)]"
                >
                  {s}
                </span>
              ))}
            </div>
          </section>

          {cap.objects?.length ? (
            <section className="mt-5">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--color-subtle)]">
                Objects
              </h3>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {cap.objects.map((o) => (
                  <span
                    key={o}
                    className="rounded-[var(--radius-md)] border border-[var(--color-border)] px-2 py-1 text-xs"
                  >
                    {o}
                  </span>
                ))}
              </div>
            </section>
          ) : null}

          <section className="mt-5">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--color-subtle)]">
              Try a prompt
            </h3>
            <div className="mt-2 space-y-2">
              {cap.samplePrompts.map((p) => (
                <button
                  key={p}
                  type="button"
                  disabled={!interactive}
                  onClick={() => {
                    if (!connected) {
                      toast.message("Connect this app first");
                      return;
                    }
                    send(p);
                    toast.success("Running in command center");
                    onClose();
                    navigate({ to: "/workspace" });
                  }}
                  className={cn(
                    "w-full rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 py-2.5 text-left text-xs text-[var(--color-muted)] transition-colors",
                    interactive &&
                      "hover:border-[var(--color-primary)] hover:text-[var(--color-fg)]",
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>

      {oauthOpen ? (
        <OAuthConnectModal
          integration={integration}
          onClose={() => setOauthOpen(false)}
        />
      ) : null}
    </>
  );
}
