import { create } from "zustand";
import { persist } from "zustand/middleware";
import { agentsCatalog } from "@/content/agents";

export type AgentRun = {
  id: string;
  agentId: string;
  prompt: string;
  ts: number;
  status: "ok" | "failed";
};

type AgentsState = {
  enabled: Record<string, boolean>;
  runs: AgentRun[];
  toggle: (id: string) => void;
  setEnabled: (id: string, on: boolean) => void;
  isEnabled: (id: string) => boolean;
  logRun: (agentId: string, prompt: string) => void;
  runsFor: (agentId: string) => AgentRun[];
};

const defaultEnabled = Object.fromEntries(
  agentsCatalog.map((a) => [a.id, a.defaultEnabled !== false]),
);

export const useAgentsStore = create<AgentsState>()(
  persist(
    (set, get) => ({
      enabled: defaultEnabled,
      runs: [],
      toggle: (id) =>
        set((s) => ({
          enabled: { ...s.enabled, [id]: !s.enabled[id] },
        })),
      setEnabled: (id, on) =>
        set((s) => ({
          enabled: { ...s.enabled, [id]: on },
        })),
      isEnabled: (id) => get().enabled[id] !== false,
      logRun: (agentId, prompt) =>
        set((s) => ({
          runs: [
            {
              id: crypto.randomUUID(),
              agentId,
              prompt,
              ts: Date.now(),
              status: "ok" as const,
            },
            ...s.runs,
          ].slice(0, 100),
        })),
      runsFor: (agentId) => get().runs.filter((r) => r.agentId === agentId),
    }),
    { name: "pandaos-agents-v1" },
  ),
);
