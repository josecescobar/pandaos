import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Project = {
  id: string;
  name: string;
  description: string;
  color: string;
  status: "active" | "paused" | "archived";
  apps: string[];
  updatedAt: number;
  createdAt: number;
};

type ProjectsState = {
  projects: Project[];
  addProject: (input: {
    name: string;
    description?: string;
    color?: string;
    apps?: string[];
  }) => Project;
  updateProject: (id: string, patch: Partial<Project>) => void;
  removeProject: (id: string) => void;
  setStatus: (id: string, status: Project["status"]) => void;
};

const seed: Project[] = [
  {
    id: "proj-retail",
    name: "Retail Analytics",
    description: "Revenue queries, product ranking, weekly merch digests",
    color: "#3B82F6",
    status: "active",
    apps: ["postgres", "hubspot", "notion"],
    createdAt: Date.now() - 86400000 * 14,
    updatedAt: Date.now() - 86400000 * 1,
  },
  {
    id: "proj-revops",
    name: "RevOps Command",
    description: "Pipeline, KPI packs, leadership briefs",
    color: "#22D3EE",
    status: "active",
    apps: ["hubspot", "ga", "slack", "gmail"],
    createdAt: Date.now() - 86400000 * 21,
    updatedAt: Date.now() - 3600000 * 5,
  },
  {
    id: "proj-support",
    name: "Support Triage",
    description: "Gmail → Jira automation and #support alerts",
    color: "#A78BFA",
    status: "active",
    apps: ["gmail", "jira", "slack"],
    createdAt: Date.now() - 86400000 * 9,
    updatedAt: Date.now() - 86400000 * 2,
  },
];

export const useProjectsStore = create<ProjectsState>()(
  persist(
    (set, get) => ({
      projects: seed,
      addProject: (input) => {
        const project: Project = {
          id: crypto.randomUUID(),
          name: input.name.trim(),
          description: input.description?.trim() || "",
          color: input.color || "#3B82F6",
          status: "active",
          apps: input.apps ?? [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        set((s) => ({ projects: [project, ...s.projects] }));
        return project;
      },
      updateProject: (id, patch) =>
        set((s) => ({
          projects: s.projects.map((p) =>
            p.id === id ? { ...p, ...patch, updatedAt: Date.now() } : p,
          ),
        })),
      removeProject: (id) =>
        set((s) => ({ projects: s.projects.filter((p) => p.id !== id) })),
      setStatus: (id, status) => get().updateProject(id, { status }),
    }),
    { name: "pandaos-projects" },
  ),
);
