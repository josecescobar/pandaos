import { create } from "zustand";
import { persist } from "zustand/middleware";

export type OnboardingRole =
  | "revops"
  | "founder"
  | "support"
  | "builder";

export type OnboardingState = {
  completed: boolean;
  role: OnboardingRole | null;
  appsConnected: boolean;
  templateRun: boolean;
  step: number;
  _hydrated: boolean;
  setRole: (role: OnboardingRole) => void;
  setAppsConnected: (v: boolean) => void;
  setTemplateRun: (v: boolean) => void;
  setStep: (step: number) => void;
  complete: () => void;
  reset: () => void;
  needsOnboarding: () => boolean;
  setHydrated: (v: boolean) => void;
};

export const roleConfig: Record<
  OnboardingRole,
  {
    label: string;
    description: string;
    apps: string[];
    templateId: string;
    templatePrompt: string;
  }
> = {
  revops: {
    label: "RevOps / Growth",
    description: "Pipeline, KPIs, CRM, leadership digests",
    apps: ["hubspot", "slack", "notion", "ga", "gmail"],
    templateId: "pipeline",
    templatePrompt:
      "Summarize this week's HubSpot pipeline by stage and owner",
  },
  founder: {
    label: "Founder / Operator",
    description: "Department of One — inbox, deploys, follow-up",
    apps: ["gmail", "github", "slack", "notion", "google-calendar"],
    templateId: "standup",
    templatePrompt:
      "Summarize leadership-critical items from Outlook/Gmail for Monday standup",
  },
  support: {
    label: "Support / Ops",
    description: "Triage email into tickets and alerts",
    apps: ["gmail", "jira", "slack", "zendesk", "notion"],
    templateId: "triage",
    templatePrompt:
      "Turn open support emails into Jira tasks and list what you would create",
  },
  builder: {
    label: "Builder / Eng",
    description: "Code, deploys, agents, product delivery",
    apps: ["github", "vercel", "slack", "linear", "postgresql"],
    templateId: "github",
    templatePrompt: "Show GitHub delivery pulse across open PRs and CI",
  },
};

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      completed: false,
      role: null,
      appsConnected: false,
      templateRun: false,
      step: 0,
      _hydrated: false,
      setHydrated: (v) => set({ _hydrated: v }),
      setRole: (role) => set({ role, step: Math.max(get().step, 1) }),
      setAppsConnected: (v) =>
        set({
          appsConnected: v,
          step: v ? Math.max(get().step, 2) : get().step,
        }),
      setTemplateRun: (v) =>
        set({
          templateRun: v,
          step: v ? Math.max(get().step, 3) : get().step,
        }),
      setStep: (step) => set({ step }),
      complete: () =>
        set({
          completed: true,
          step: 4,
          appsConnected: true,
          templateRun: true,
        }),
      reset: () =>
        set({
          completed: false,
          role: null,
          appsConnected: false,
          templateRun: false,
          step: 0,
        }),
      needsOnboarding: () => !get().completed,
    }),
    {
      name: "pandaos-onboarding-v1",
      partialize: (s) => ({
        completed: s.completed,
        role: s.role,
        appsConnected: s.appsConnected,
        templateRun: s.templateRun,
        step: s.step,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);

/** Resolve post-auth destination after onboarding store has hydrated. */
export function getPostAuthPath(): "/onboarding" | "/workspace" {
  return useOnboardingStore.getState().completed ? "/workspace" : "/onboarding";
}

export async function waitForOnboardingHydration(timeoutMs = 2000) {
  if (useOnboardingStore.getState()._hydrated) return;
  await new Promise<void>((resolve) => {
    const finish = () => {
      useOnboardingStore.getState().setHydrated(true);
      resolve();
    };
    if (useOnboardingStore.persist.hasHydrated()) {
      finish();
      return;
    }
    const unsub = useOnboardingStore.persist.onFinishHydration(() => {
      unsub();
      finish();
    });
    window.setTimeout(finish, timeoutMs);
  });
}

if (typeof window !== "undefined") {
  useOnboardingStore.persist.onFinishHydration(() => {
    useOnboardingStore.getState().setHydrated(true);
  });
  if (useOnboardingStore.persist.hasHydrated()) {
    useOnboardingStore.getState().setHydrated(true);
  }
}
