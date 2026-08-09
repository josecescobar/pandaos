import { useWorkspaceStore } from "@/lib/workspace-store";
import { useProjectsStore } from "@/lib/projects-store";
import { useAgentsStore } from "@/lib/agents-store";
import { useTeamStore } from "@/lib/team-store";
import { useOnboardingStore } from "@/lib/onboarding-store";

export type WorkspaceExport = {
  version: 1;
  exportedAt: string;
  workspace: {
    apps: ReturnType<typeof useWorkspaceStore.getState>["apps"];
    savedWorkflows: ReturnType<
      typeof useWorkspaceStore.getState
    >["savedWorkflows"];
    messages: ReturnType<typeof useWorkspaceStore.getState>["messages"];
    activity: ReturnType<typeof useWorkspaceStore.getState>["activity"];
    lastPrompt: string | null;
    pendingApprovals: ReturnType<
      typeof useWorkspaceStore.getState
    >["pendingApprovals"];
  };
  projects: ReturnType<typeof useProjectsStore.getState>["projects"];
  agents: {
    enabled: Record<string, boolean>;
    runs: ReturnType<typeof useAgentsStore.getState>["runs"];
  };
  team: {
    teamName: string;
    plan: ReturnType<typeof useTeamStore.getState>["plan"];
    members: ReturnType<typeof useTeamStore.getState>["members"];
  };
  onboarding: {
    completed: boolean;
    role: ReturnType<typeof useOnboardingStore.getState>["role"];
  };
};

export function buildExport(): WorkspaceExport {
  const ws = useWorkspaceStore.getState();
  const projects = useProjectsStore.getState();
  const agents = useAgentsStore.getState();
  const team = useTeamStore.getState();
  const onboarding = useOnboardingStore.getState();

  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    workspace: {
      apps: ws.apps,
      savedWorkflows: ws.savedWorkflows,
      messages: ws.messages.slice(-40),
      activity: ws.activity.slice(0, 40),
      lastPrompt: ws.lastPrompt,
      pendingApprovals: ws.pendingApprovals,
    },
    projects: projects.projects,
    agents: {
      enabled: agents.enabled,
      runs: agents.runs.slice(0, 50),
    },
    team: {
      teamName: team.teamName,
      plan: team.plan,
      members: team.members,
    },
    onboarding: {
      completed: onboarding.completed,
      role: onboarding.role,
    },
  };
}

export function downloadExport() {
  const data = buildExport();
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `pandaos-export-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importExport(data: unknown): { ok: true } | { ok: false; error: string } {
  try {
    const raw = data as WorkspaceExport;
    if (!raw || raw.version !== 1 || !raw.workspace) {
      return { ok: false, error: "Invalid export file (expected version 1)" };
    }

    useWorkspaceStore.getState().replaceFromImport({
      apps: raw.workspace.apps,
      savedWorkflows: raw.workspace.savedWorkflows,
      messages: raw.workspace.messages,
      activity: raw.workspace.activity,
      lastPrompt: raw.workspace.lastPrompt,
      pendingApprovals: raw.workspace.pendingApprovals,
    });

    if (raw.projects) {
      useProjectsStore.setState({ projects: raw.projects });
    }
    if (raw.agents) {
      useAgentsStore.setState({
        enabled: raw.agents.enabled ?? {},
        runs: raw.agents.runs ?? [],
      });
    }
    if (raw.team) {
      useTeamStore.setState({
        teamName: raw.team.teamName,
        plan: raw.team.plan,
        members: raw.team.members,
      });
    }
    if (raw.onboarding) {
      useOnboardingStore.setState({
        completed: raw.onboarding.completed,
        role: raw.onboarding.role,
      });
    }

    return { ok: true };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Import failed",
    };
  }
}
