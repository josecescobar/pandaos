import { useEffect, useRef } from "react";
import {
  Bot,
  Loader2,
  Plug,
  PlugZap,
  Send,
  Sparkles,
  Trash2,
  Workflow,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  promptPresets,
  useWorkspaceStore,
  type ChatMessage,
} from "@/lib/workspace-store";
import { cn } from "@/lib/utils";

function MessageBubble({
  message,
  onAction,
}: {
  message: ChatMessage;
  onAction: (label: string, app?: string) => void;
}) {
  if (message.role === "user") {
    return (
      <div className="ml-auto max-w-[90%] rounded-[1.25rem] rounded-br-md bg-[var(--color-primary)] px-4 py-2.5 text-sm text-white shadow-sm">
        {message.content}
      </div>
    );
  }

  if (message.role === "system") {
    return (
      <div className="mx-auto max-w-[90%] rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white/5 px-3 py-2 text-center text-xs text-[var(--color-muted)]">
        {message.content}
      </div>
    );
  }

  return (
    <div className="mr-auto max-w-[95%] space-y-3">
      <div className="rounded-[1.25rem] rounded-bl-md border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm leading-relaxed text-[var(--color-fg)] shadow-sm">
        <div className="mb-2 flex items-center gap-2 text-xs font-medium text-[var(--color-primary)]">
          <Bot className="h-3.5 w-3.5" />
          PandaOS
        </div>
        {message.content}
      </div>

      {message.table ? (
        <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)]">
          <div className="border-b border-[var(--color-border)] px-3 py-2 text-xs font-semibold text-[var(--color-muted)]">
            {message.table.title}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[420px] text-left text-xs">
              <thead>
                <tr className="border-b border-[var(--color-border)] text-[var(--color-subtle)]">
                  {message.table.columns.map((c) => (
                    <th key={c} className="px-3 py-2 font-medium">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {message.table.rows.map((row, i) => (
                  <tr
                    key={i}
                    className="border-b border-[var(--color-border)]/60 text-[var(--color-fg)]"
                  >
                    {row.map((cell, j) => (
                      <td key={j} className="px-3 py-2">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      {message.insights?.length ? (
        <ul className="space-y-1.5 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-xs text-[var(--color-muted)]">
          {message.insights.map((insight) => (
            <li key={insight} className="flex gap-2">
              <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--color-primary)]" />
              {insight}
            </li>
          ))}
        </ul>
      ) : null}

      {message.actions?.length ? (
        <div className="flex flex-wrap gap-2">
          {message.actions.map((a) => (
            <button
              key={a.label}
              type="button"
              onClick={() => onAction(a.label, a.app)}
              className="min-h-10 rounded-[var(--radius-pill)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-3.5 py-2 text-xs font-medium text-[var(--color-fg)] transition-colors hover:border-[var(--color-primary)] hover:bg-[var(--color-accent-soft)] active:scale-[0.98]"
            >
              {a.label}
              <span className="ml-1.5 text-[var(--color-subtle)]">· {a.app}</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function CommandCenter({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  const apps = useWorkspaceStore((s) => s.apps);
  const messages = useWorkspaceStore((s) => s.messages);
  const input = useWorkspaceStore((s) => s.input);
  const busy = useWorkspaceStore((s) => s.busy);
  const setInput = useWorkspaceStore((s) => s.setInput);
  const toggleApp = useWorkspaceStore((s) => s.toggleApp);
  const send = useWorkspaceStore((s) => s.send);
  const clearChat = useWorkspaceStore((s) => s.clearChat);
  const runAction = useWorkspaceStore((s) => s.runAction);
  const savedWorkflows = useWorkspaceStore((s) => s.savedWorkflows);
  const runWorkflow = useWorkspaceStore((s) => s.runWorkflow);
  const ensureCatalogSynced = useWorkspaceStore((s) => s.ensureCatalogSynced);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ensureCatalogSynced();
  }, [ensureCatalogSynced]);

  useEffect(() => {
    try {
      const pending = sessionStorage.getItem("pandaos-pending-prompt");
      if (pending) {
        sessionStorage.removeItem("pandaos-pending-prompt");
        // slight delay so UI mounts cleanly
        const t = window.setTimeout(() => send(pending), 350);
        return () => window.clearTimeout(t);
      }
    } catch {
      /* ignore */
    }
  }, [send]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, busy]);

  const connected = apps.filter((a) => a.connected);
  const connectedCount = connected.length;
  // Show connected first, then a few disconnected popular for quick toggle
  const railApps = [
    ...connected,
    ...apps.filter((a) => !a.connected).slice(0, 8),
  ].slice(0, 18);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-[var(--radius-2xl)] border border-[var(--color-border-strong)] bg-[var(--color-bg)] shadow-[var(--shadow-card)]",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3 border-b border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-3">
        <div>
          <div className="text-sm font-semibold">Command Center</div>
          <div className="text-[11px] text-[var(--color-subtle)]">
            {connectedCount} apps connected · {apps.length} available
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!compact ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => clearChat()}
              className="hidden sm:inline-flex"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear
            </Button>
          ) : null}
          <Link
            to="/integrations"
            className="inline-flex h-9 items-center gap-1.5 rounded-[var(--radius-pill)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-3 text-xs font-semibold text-[var(--color-fg)] hover:bg-[var(--color-surface-hover)]"
          >
            <Plug className="h-3.5 w-3.5" />
            All apps
          </Link>
        </div>
      </div>

      <div
        className={cn(
          "grid",
          compact
            ? "grid-cols-1"
            : "grid-cols-1 lg:grid-cols-[200px_1fr_200px]",
        )}
      >
        {!compact ? (
          <aside className="hidden max-h-[640px] flex-col border-r border-[var(--color-border)] bg-[var(--color-bg-elevated)] lg:flex">
            <div className="flex items-center gap-2 px-3 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-wide text-[var(--color-subtle)]">
              <PlugZap className="h-3.5 w-3.5" />
              Stack
            </div>
            <div className="flex-1 space-y-1 overflow-y-auto p-2">
              {railApps.map((app) => (
                <button
                  key={app.id}
                  type="button"
                  onClick={() => toggleApp(app.id)}
                  className={cn(
                    "flex w-full items-center justify-between gap-2 rounded-[var(--radius-md)] border px-2.5 py-2 text-left transition-colors",
                    app.connected
                      ? "border-[var(--color-primary)]/40 bg-[var(--color-accent-soft)]"
                      : "border-transparent bg-transparent hover:bg-white/5",
                  )}
                >
                  <div className="min-w-0">
                    <div className="truncate text-xs font-semibold">
                      {app.name}
                    </div>
                    <div className="truncate text-[10px] text-[var(--color-subtle)]">
                      {app.category}
                    </div>
                  </div>
                  <span
                    className={cn(
                      "h-2 w-2 shrink-0 rounded-full",
                      app.connected
                        ? "bg-[var(--color-success)]"
                        : "bg-[var(--color-subtle)]",
                    )}
                  />
                </button>
              ))}
            </div>
            <Link
              to="/integrations"
              className="border-t border-[var(--color-border)] px-3 py-2 text-[11px] font-medium text-[var(--color-primary)] hover:underline"
            >
              Manage {apps.length} integrations →
            </Link>
          </aside>
        ) : null}

        <section className="flex min-h-[480px] flex-col bg-[var(--color-bg)] sm:min-h-[560px]">
          <div className="flex flex-wrap gap-2 border-b border-[var(--color-border)] px-3 py-2.5">
            {promptPresets.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => send(preset.prompt)}
                className="min-h-10 rounded-[var(--radius-pill)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-xs font-medium text-[var(--color-muted)] transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-fg)] active:scale-[0.98]"
              >
                {preset.label}
              </button>
            ))}
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto p-3 sm:p-4">
            {messages.map((m) => (
              <MessageBubble key={m.id} message={m} onAction={runAction} />
            ))}
            {busy ? (
              <div className="flex items-center gap-2 text-xs text-[var(--color-muted)]">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-[var(--color-primary)]" />
                Running across connected systems…
              </div>
            ) : null}
            <div ref={endRef} />
          </div>

          <form
            className="border-t border-[var(--color-border)] p-3"
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
          >
            <div className="flex items-end gap-2 rounded-[var(--radius-xl)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] p-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows={1}
                placeholder="Ask PandaOS to run a workflow across your stack…"
                className="max-h-28 min-h-[44px] flex-1 resize-none bg-transparent px-2 py-2.5 text-base text-[var(--color-fg)] outline-none placeholder:text-[var(--color-subtle)] sm:text-sm"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
              />
              <Button
                type="submit"
                size="icon"
                className="h-11 w-11 shrink-0"
                disabled={busy || !input.trim()}
                aria-label="Send"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </section>

        {!compact ? (
          <aside className="hidden border-l border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-3 lg:block">
            <div className="mb-2 flex items-center gap-2 px-1 text-[11px] font-semibold uppercase tracking-wide text-[var(--color-subtle)]">
              <Workflow className="h-3.5 w-3.5" />
              Saved
            </div>
            <div className="space-y-2">
              {savedWorkflows.slice(0, 6).map((w) => (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => runWorkflow(w.id)}
                  className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-left text-xs font-medium text-[var(--color-fg)] transition-colors hover:border-[var(--color-primary)]"
                >
                  <div className="truncate">{w.name}</div>
                  <div className="mt-0.5 truncate text-[10px] font-normal text-[var(--color-subtle)]">
                    {w.schedule || "manual"} · run
                  </div>
                </button>
              ))}
            </div>
            <Link
              to="/workflows"
              className="mt-4 block px-1 text-[11px] font-medium text-[var(--color-primary)] hover:underline"
            >
              Manage all workflows →
            </Link>
          </aside>
        ) : null}
      </div>
    </div>
  );
}
