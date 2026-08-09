import { useMemo, useState } from "react";
import { Check, Loader2, Shield } from "lucide-react";
import { toast } from "sonner";
import { IntegrationMark } from "@/components/brand/integration-mark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getIntegrationCapability } from "@/content/integration-capabilities";
import type { Integration } from "@/content/integrations";
import { useOAuthStore } from "@/lib/oauth-store";
import { useWorkspaceStore } from "@/lib/workspace-store";
import { cn } from "@/lib/utils";

type Step = "consent" | "authorizing" | "done";

export function OAuthConnectModal({
  integration,
  onClose,
  onConnected,
}: {
  integration: Integration;
  onClose: () => void;
  onConnected?: () => void;
}) {
  const cap = getIntegrationCapability(integration.id);
  const connectOAuth = useOAuthStore((s) => s.connect);
  const toggleApp = useWorkspaceStore((s) => s.toggleApp);
  const apps = useWorkspaceStore((s) => s.apps);
  const syncApp = useWorkspaceStore((s) => s.syncApp);

  const defaultScopes = useMemo(() => new Set(cap.scopes), [cap.scopes]);
  const [selected, setSelected] = useState<Set<string>>(defaultScopes);
  const [account, setAccount] = useState(
    `${integration.id.replace(/-/g, ".")}@company.com`,
  );
  const [step, setStep] = useState<Step>("consent");

  function toggleScope(scope: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(scope)) next.delete(scope);
      else next.add(scope);
      return next;
    });
  }

  function authorize() {
    if (!selected.size) {
      toast.error("Select at least one scope");
      return;
    }
    setStep("authorizing");
    window.setTimeout(() => {
      const scopes = [...selected];
      connectOAuth({
        integrationId: integration.id,
        accountLabel: account.trim() || "workspace account",
        scopes,
      });
      const app = apps.find((a) => a.id === integration.id);
      if (app && !app.connected) toggleApp(integration.id);
      else syncApp(integration.id);
      setStep("done");
      toast.success(`${integration.name} authorized`);
      onConnected?.();
    }, 1400);
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        aria-label="Close OAuth"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal
        aria-label={`Connect ${integration.name}`}
        className="relative z-10 w-full max-w-md overflow-hidden rounded-[1.25rem] border border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)] shadow-2xl"
      >
        <div className="flex items-center gap-3 border-b border-[var(--color-border)] px-5 py-4">
          <span
            className="grid h-10 w-10 place-items-center rounded-[12px]"
            style={{ background: `${integration.color}22` }}
          >
            <IntegrationMark id={integration.id} className="h-5 w-5" />
          </span>
          <div>
            <div className="text-sm font-semibold">
              Connect {integration.name}
            </div>
            <div className="text-[11px] text-[var(--color-subtle)]">
              OAuth 2.0 · PandaOS authorization
            </div>
          </div>
        </div>

        {step === "consent" ? (
          <div className="space-y-4 p-5">
            <div className="flex items-start gap-2 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-3 text-xs text-[var(--color-muted)]">
              <Shield className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-primary)]" />
              PandaOS requests access to act on your behalf. Write actions still
              require in-app approval.
            </div>

            <div>
              <Label htmlFor="oauth-account">Account</Label>
              <Input
                id="oauth-account"
                className="mt-1.5"
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                placeholder="you@company.com"
              />
            </div>

            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-[var(--color-subtle)]">
                Scopes
              </div>
              <ul className="mt-2 space-y-1.5">
                {cap.scopes.map((scope) => {
                  const on = selected.has(scope);
                  return (
                    <li key={scope}>
                      <button
                        type="button"
                        onClick={() => toggleScope(scope)}
                        className={cn(
                          "flex w-full items-center gap-2 rounded-[var(--radius-md)] border px-3 py-2 text-left text-xs font-mono",
                          on
                            ? "border-[var(--color-primary)]/50 bg-[var(--color-accent-soft)]/40 text-[var(--color-fg)]"
                            : "border-[var(--color-border)] text-[var(--color-muted)]",
                        )}
                      >
                        <span
                          className={cn(
                            "grid h-4 w-4 place-items-center rounded border",
                            on
                              ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                              : "border-[var(--color-border)]",
                          )}
                        >
                          {on ? <Check className="h-3 w-3" /> : null}
                        </span>
                        {scope}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="flex gap-2 pt-1">
              <Button className="flex-1" onClick={authorize}>
                Authorize
              </Button>
              <Button variant="secondary" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </div>
        ) : null}

        {step === "authorizing" ? (
          <div className="flex flex-col items-center gap-3 px-5 py-12 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-[var(--color-primary)]" />
            <p className="text-sm font-medium">
              Redirecting to {integration.name}…
            </p>
            <p className="text-xs text-[var(--color-muted)]">
              Completing OAuth handshake
            </p>
          </div>
        ) : null}

        {step === "done" ? (
          <div className="flex flex-col items-center gap-3 px-5 py-10 text-center">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-[var(--color-primary)] text-white">
              <Check className="h-6 w-6" strokeWidth={3} />
            </span>
            <p className="text-sm font-semibold">
              {integration.name} connected
            </p>
            <p className="text-xs text-[var(--color-muted)]">
              Account {account} · {selected.size} scopes granted
            </p>
            <Button className="mt-2" onClick={onClose}>
              Done
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
