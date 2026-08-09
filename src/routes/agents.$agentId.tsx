import { useMemo } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { AppShell } from "@/components/workspace/app-shell";
import { Button } from "@/components/ui/button";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { getAgent } from "@/content/agents";
import { useAgentsStore } from "@/lib/agents-store";
import { useWorkspaceStore } from "@/lib/workspace-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/agents/$agentId")({
  head: ({ params }) => {
    const agent = getAgent(params.agentId);
    return {
      meta: [{ title: `${agent?.name ?? "Agent"} · PandaOS` }],
    };
  },
  component: AgentDetailRoute,
});

function AgentDetailRoute() {
  const { agentId } = Route.useParams();
  const agent = getAgent(agentId);
  const { user, isPending } = useCurrentUserState();
  const enabledMap = useAgentsStore((s) => s.enabled);
  const toggle = useAgentsStore((s) => s.toggle);
  const logRun = useAgentsStore((s) => s.logRun);
  const allRuns = useAgentsStore((s) => s.runs);
  const runs = useMemo(
    () => allRuns.filter((r) => r.agentId === agentId),
    [allRuns, agentId],
  );
  const send = useWorkspaceStore((s) => s.send);
  const apps = useWorkspaceStore((s) => s.apps);
  const navigate = useNavigate();
  const on = enabledMap[agentId] !== false;

  if (isPending) {
    return (
      <div className="grid min-h-dvh place-items-center bg-[var(--color-bg)]">
        <div className="h-10 w-10 animate-pulse rounded-full bg-[var(--color-surface)]" />
      </div>
    );
  }
  if (!user) return <RedirectToSignIn />;

  if (!agent) {
    return (
      <AppShell title="Agent">
        <div className="mx-auto max-w-lg text-center">
          <p className="text-[var(--color-muted)]">Agent not found.</p>
          <Button asChild className="mt-4">
            <Link to="/agents">Back to agents</Link>
          </Button>
        </div>
      </AppShell>
    );
  }

  const toolApps = agent.tools.map((id) => {
    const app = apps.find((a) => a.id === id);
    return { id, name: app?.name ?? id, connected: !!app?.connected };
  });

  return (
    <AppShell title={agent.name}>
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span
              className="grid h-12 w-12 place-items-center rounded-[14px] text-sm font-bold text-white"
              style={{ background: agent.color }}
            >
              {agent.tag}
            </span>
            <div>
              <h2 className="font-mono text-xl font-semibold">{agent.name}</h2>
              <p className="text-sm text-[var(--color-muted)]">{agent.title}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              role="switch"
              aria-checked={on}
              onClick={() => toggle(agent.id)}
              className={cn(
                "relative h-6 w-11 rounded-full transition-colors",
                on ? "bg-[var(--color-primary)]" : "bg-white/15",
              )}
            >
              <span
                className={cn(
                  "absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform",
                  on ? "left-5" : "left-0.5",
                )}
              />
            </button>
            <span className="text-xs text-[var(--color-muted)]">
              {on ? "Enabled" : "Disabled"}
            </span>
          </div>
        </div>

        <p className="text-sm leading-relaxed text-[var(--color-muted)]">
          {agent.body}
        </p>

        <section className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <h3 className="text-sm font-semibold">Goals</h3>
          <ul className="mt-3 space-y-2 text-sm text-[var(--color-muted)]">
            {agent.goals.map((g) => (
              <li key={g} className="flex gap-2">
                <span className="text-[var(--color-primary)]">✓</span>
                {g}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <h3 className="text-sm font-semibold">Tools</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {toolApps.map((t) => (
              <span
                key={t.id}
                className={cn(
                  "rounded-[var(--radius-pill)] border px-2.5 py-1 text-xs font-medium",
                  t.connected
                    ? "border-[var(--color-primary)]/40 bg-[var(--color-accent-soft)] text-[var(--color-fg)]"
                    : "border-[var(--color-border)] text-[var(--color-subtle)]",
                )}
              >
                {t.name}
                {t.connected ? " · on" : " · off"}
              </span>
            ))}
          </div>
          <Button asChild size="sm" variant="secondary" className="mt-4">
            <Link to="/integrations">Manage integrations</Link>
          </Button>
        </section>

        <section className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold">Run history</h3>
            <Button
              size="sm"
              disabled={!on}
              onClick={() => {
                logRun(agent.id, agent.prompt);
                navigate({ to: "/workspace" });
                send(agent.prompt);
                toast.success(`Launched ${agent.name}`);
              }}
            >
              Run agent
            </Button>
          </div>
          <ul className="mt-4 space-y-2">
            {runs.length === 0 ? (
              <li className="text-sm text-[var(--color-muted)]">
                No runs yet. Launch to populate history.
              </li>
            ) : (
              runs.slice(0, 12).map((r) => (
                <li
                  key={r.id}
                  className="flex justify-between gap-3 border-b border-[var(--color-border)] py-2 text-xs last:border-0"
                >
                  <span className="truncate text-[var(--color-muted)]">
                    {r.prompt}
                  </span>
                  <time className="shrink-0 text-[var(--color-subtle)]">
                    {new Date(r.ts).toLocaleString()}
                  </time>
                </li>
              ))
            )}
          </ul>
        </section>

        <Button asChild variant="ghost" size="sm">
          <Link to="/agents">← All agents</Link>
        </Button>
      </div>
    </AppShell>
  );
}
