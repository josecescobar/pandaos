import { useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Check, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import {
  roleConfig,
  useOnboardingStore,
  type OnboardingRole,
} from "@/lib/onboarding-store";
import { useWorkspaceStore } from "@/lib/workspace-store";
import { useTeamStore } from "@/lib/team-store";
import { useNotificationsStore } from "@/lib/notifications-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [{ title: "Get started · PandaOS" }],
  }),
  component: OnboardingRoute,
});

const roles = Object.entries(roleConfig) as [
  OnboardingRole,
  (typeof roleConfig)[OnboardingRole],
][];

function OnboardingRoute() {
  const { user, isPending } = useCurrentUserState();
  const navigate = useNavigate();
  const completed = useOnboardingStore((s) => s.completed);
  const hydrated = useOnboardingStore((s) => s._hydrated);
  const role = useOnboardingStore((s) => s.role);
  const step = useOnboardingStore((s) => s.step);
  const setRole = useOnboardingStore((s) => s.setRole);
  const setAppsConnected = useOnboardingStore((s) => s.setAppsConnected);
  const setTemplateRun = useOnboardingStore((s) => s.setTemplateRun);
  const complete = useOnboardingStore((s) => s.complete);
  const apps = useWorkspaceStore((s) => s.apps);
  const toggleApp = useWorkspaceStore((s) => s.toggleApp);
  const send = useWorkspaceStore((s) => s.send);
  const ensureCatalogSynced = useWorkspaceStore((s) => s.ensureCatalogSynced);
  const logActivity = useTeamStore((s) => s.logActivity);
  const pushNote = useNotificationsStore((s) => s.push);

  const [busy, setBusy] = useState(false);
  const [uiStep, setUiStep] = useState(0);

  const config = role ? roleConfig[role] : null;

  const connectedForRole = useMemo(() => {
    if (!config) return 0;
    return config.apps.filter((id) =>
      apps.find((a) => a.id === id && a.connected),
    ).length;
  }, [apps, config]);

  if (isPending || !hydrated) {
    return (
      <div className="grid min-h-dvh place-items-center bg-[var(--color-bg)]">
        <div className="h-10 w-10 animate-pulse rounded-full bg-[var(--color-surface)]" />
      </div>
    );
  }
  if (!user) return <RedirectToSignIn />;

  if (completed) {
    navigate({ to: "/workspace" });
    return null;
  }

  function connectRoleApps() {
    if (!config) return;
    ensureCatalogSynced();
    for (const id of config.apps) {
      const app = useWorkspaceStore.getState().apps.find((a) => a.id === id);
      if (app && !app.connected) toggleApp(id);
    }
    setAppsConnected(true);
    toast.success(`Connected ${config.apps.length} apps for ${config.label}`);
    setUiStep(2);
  }

  function runTemplate() {
    if (!config) return;
    setBusy(true);
    // ensure GA/stripe etc for templates that need them
    for (const id of config.apps) {
      const app = useWorkspaceStore.getState().apps.find((a) => a.id === id);
      if (app && !app.connected) toggleApp(id);
    }
    if (config.templateId === "kpi") {
      const ga = useWorkspaceStore.getState().apps.find((a) => a.id === "ga");
      if (ga && !ga.connected) toggleApp("ga");
    }
    send(config.templatePrompt);
    setTemplateRun(true);
    logActivity(
      user?.displayName ?? "You",
      "Ran onboarding workflow",
      config.label,
    );
    window.setTimeout(() => {
      setBusy(false);
      setUiStep(3);
    }, 900);
  }

  function finish() {
    complete();
    pushNote({
      title: "You're set up",
      body: `Role: ${config?.label ?? "Operator"}. Your command center is ready.`,
      kind: "success",
      href: "/workspace",
    });
    toast.success("Onboarding complete");
    navigate({ to: "/workspace" });
  }

  const steps = ["Role", "Connect", "Run", "Done"];

  return (
    <div className="min-h-dvh bg-[var(--color-bg)] pt-[var(--grok-banner-h,0px)]">
      <div className="mx-auto max-w-2xl px-5 py-10">
        <Logo />
        <p className="mt-8 text-sm font-medium text-[var(--color-primary)]">
          First 60 seconds
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          Get value before you explore
        </h1>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          Pick how you work → connect the stack → run one real workflow.
        </p>

        <ol className="mt-8 flex gap-2">
          {steps.map((label, i) => (
            <li
              key={label}
              className={cn(
                "flex-1 rounded-[var(--radius-pill)] px-2 py-1.5 text-center text-[11px] font-semibold",
                uiStep >= i
                  ? "bg-[var(--color-accent-soft)] text-[var(--color-primary)]"
                  : "bg-white/5 text-[var(--color-subtle)]",
              )}
            >
              {label}
            </li>
          ))}
        </ol>

        {/* Step 0: role */}
        {uiStep === 0 ? (
          <div className="mt-8 space-y-3">
            {roles.map(([id, r]) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setRole(id);
                  setUiStep(1);
                }}
                className={cn(
                  "w-full rounded-[var(--radius-xl)] border p-4 text-left transition-colors",
                  role === id
                    ? "border-[var(--color-primary)] bg-[var(--color-accent-soft)]"
                    : "border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-border-strong)]",
                )}
              >
                <div className="font-semibold">{r.label}</div>
                <div className="mt-1 text-sm text-[var(--color-muted)]">
                  {r.description}
                </div>
              </button>
            ))}
          </div>
        ) : null}

        {/* Step 1: connect */}
        {uiStep === 1 && config ? (
          <div className="mt-8 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
            <h2 className="text-lg font-semibold">Connect your stack</h2>
            <p className="mt-2 text-sm text-[var(--color-muted)]">
              We’ll enable the apps {config.label} needs most. You can change
              anything later.
            </p>
            <ul className="mt-5 space-y-2">
              {config.apps.map((id) => {
                const app = apps.find((a) => a.id === id);
                return (
                  <li
                    key={id}
                    className="flex items-center justify-between rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 py-2 text-sm"
                  >
                    <span>{app?.name ?? id}</span>
                    <span className="text-[11px] text-[var(--color-subtle)]">
                      {app?.category}
                    </span>
                  </li>
                );
              })}
            </ul>
            <div className="mt-6 flex flex-wrap gap-2">
              <Button onClick={connectRoleApps}>
                Connect {config.apps.length} apps
              </Button>
              <Button variant="ghost" onClick={() => setUiStep(0)}>
                Back
              </Button>
            </div>
          </div>
        ) : null}

        {/* Step 2: run template */}
        {uiStep === 2 && config ? (
          <div className="mt-8 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
            <h2 className="text-lg font-semibold">Run your first workflow</h2>
            <p className="mt-2 text-sm text-[var(--color-muted)]">
              {config.templatePrompt}
            </p>
            <p className="mt-3 text-xs text-[var(--color-subtle)]">
              {connectedForRole}/{config.apps.length} role apps connected
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Button onClick={runTemplate} disabled={busy}>
                {busy ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Running…
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Run workflow
                  </>
                )}
              </Button>
              <Button variant="ghost" onClick={() => setUiStep(1)}>
                Back
              </Button>
            </div>
          </div>
        ) : null}

        {/* Step 3: celebrate */}
        {uiStep === 3 ? (
          <div className="mt-8 rounded-[var(--radius-xl)] border border-[var(--color-primary)] bg-[var(--color-accent-soft)]/30 p-6 text-center">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[var(--color-primary)] text-white">
              <Check className="h-6 w-6" strokeWidth={3} />
            </div>
            <h2 className="mt-4 text-xl font-semibold">You’re live</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-[var(--color-muted)]">
              First workflow is in your command center. Open reports anytime to
              export tables. Invite teammates when you’re ready.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <Button onClick={finish}>Open command center</Button>
              <Button
                variant="secondary"
                onClick={() => {
                  finish();
                  navigate({ to: "/reports" });
                }}
              >
                View reports
              </Button>
            </div>
          </div>
        ) : null}

        <p className="mt-10 text-center text-xs text-[var(--color-subtle)]">
          Step {Math.min(uiStep + 1, 4)} of 4
          {step > 0 ? ` · progress saved` : ""}
        </p>
      </div>
    </div>
  );
}
