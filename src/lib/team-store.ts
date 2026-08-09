import { create } from "zustand";
import { persist } from "zustand/middleware";

export type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: "owner" | "admin" | "member";
  status: "active" | "invited";
  joinedAt: number;
};

export type TeamActivity = {
  id: string;
  memberId: string;
  memberName: string;
  action: string;
  detail?: string;
  ts: number;
};

type TeamState = {
  teamName: string;
  plan: "free" | "pro" | "team";
  members: TeamMember[];
  activity: TeamActivity[];
  setTeamName: (name: string) => void;
  setPlan: (plan: TeamState["plan"]) => void;
  invite: (input: { name: string; email: string; role?: TeamMember["role"] }) => TeamMember | null;
  removeMember: (id: string) => void;
  acceptInvite: (id: string) => void;
  logActivity: (memberName: string, action: string, detail?: string) => void;
};

const seedMembers: TeamMember[] = [
  {
    id: "owner-admin",
    name: "admin",
    email: "admin@pandaos.ai",
    role: "owner",
    status: "active",
    joinedAt: Date.now() - 86400000 * 30,
  },
];

export const useTeamStore = create<TeamState>()(
  persist(
    (set, get) => ({
      teamName: "PandaOS Ops",
      plan: "pro",
      members: seedMembers,
      activity: [
        {
          id: "ta1",
          memberId: "owner-admin",
          memberName: "admin",
          action: "Created workspace",
          detail: "PandaOS Ops",
          ts: Date.now() - 86400000 * 3,
        },
      ],
      setTeamName: (name) => set({ teamName: name.trim() || "PandaOS Ops" }),
      setPlan: (plan) => set({ plan }),
      invite: ({ name, email, role = "member" }) => {
        const normalized = email.trim().toLowerCase();
        if (!normalized || !normalized.includes("@")) return null;
        if (get().members.some((m) => m.email === normalized)) return null;
        const member: TeamMember = {
          id: crypto.randomUUID(),
          name: name.trim() || normalized.split("@")[0],
          email: normalized,
          role,
          status: "invited",
          joinedAt: Date.now(),
        };
        set((s) => ({
          members: [...s.members, member],
          activity: [
            {
              id: crypto.randomUUID(),
              memberId: member.id,
              memberName: member.name,
              action: "Invited to team",
              detail: member.email,
              ts: Date.now(),
            },
            ...s.activity,
          ].slice(0, 50),
        }));
        return member;
      },
      removeMember: (id) =>
        set((s) => ({
          members: s.members.filter((m) => m.id !== id || m.role === "owner"),
        })),
      acceptInvite: (id) =>
        set((s) => ({
          members: s.members.map((m) =>
            m.id === id ? { ...m, status: "active" as const } : m,
          ),
        })),
      logActivity: (memberName, action, detail) =>
        set((s) => ({
          activity: [
            {
              id: crypto.randomUUID(),
              memberId: "local",
              memberName,
              action,
              detail,
              ts: Date.now(),
            },
            ...s.activity,
          ].slice(0, 50),
        })),
    }),
    { name: "pandaos-team-v1" },
  ),
);
