import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getIntegrationCapability } from "@/content/integration-capabilities";

export type OAuthConnection = {
  integrationId: string;
  accountLabel: string;
  scopes: string[];
  connectedAt: number;
  tokenPreview: string;
  status: "active" | "expired" | "revoked";
};

type OAuthState = {
  connections: Record<string, OAuthConnection>;
  connect: (input: {
    integrationId: string;
    accountLabel: string;
    scopes: string[];
  }) => void;
  disconnect: (integrationId: string) => void;
  get: (integrationId: string) => OAuthConnection | undefined;
};

function tokenPreview() {
  const a = Math.random().toString(36).slice(2, 8);
  const b = Math.random().toString(36).slice(2, 10);
  return `pk_live_${a}…${b}`;
}

export const useOAuthStore = create<OAuthState>()(
  persist(
    (set, get) => ({
      connections: {},
      connect: ({ integrationId, accountLabel, scopes }) => {
        const cap = getIntegrationCapability(integrationId);
        set((s) => ({
          connections: {
            ...s.connections,
            [integrationId]: {
              integrationId,
              accountLabel,
              scopes: scopes.length ? scopes : cap.scopes,
              connectedAt: Date.now(),
              tokenPreview: tokenPreview(),
              status: "active",
            },
          },
        }));
      },
      disconnect: (integrationId) =>
        set((s) => {
          const next = { ...s.connections };
          delete next[integrationId];
          return { connections: next };
        }),
      get: (integrationId) => get().connections[integrationId],
    }),
    { name: "pandaos-oauth-v1" },
  ),
);
