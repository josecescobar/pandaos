import { createFileRoute } from "@tanstack/react-router";
import { Download, FileText } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/workspace/app-shell";
import { Button } from "@/components/ui/button";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useWorkspaceStore, type ChatMessage } from "@/lib/workspace-store";
import { useNotificationsStore } from "@/lib/notifications-store";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [{ title: "Reports · PandaOS" }],
  }),
  component: ReportsRoute,
});

function messageToMarkdown(m: ChatMessage): string {
  const lines: string[] = [];
  lines.push(`## ${m.table?.title || "PandaOS report"}`);
  lines.push("");
  lines.push(m.content);
  lines.push("");
  if (m.table) {
    lines.push(`| ${m.table.columns.join(" | ")} |`);
    lines.push(`| ${m.table.columns.map(() => "---").join(" | ")} |`);
    for (const row of m.table.rows) {
      lines.push(`| ${row.join(" | ")} |`);
    }
    lines.push("");
  }
  if (m.insights?.length) {
    lines.push("### Insights");
    for (const i of m.insights) lines.push(`- ${i}`);
    lines.push("");
  }
  lines.push(`_Generated ${new Date(m.ts || Date.now()).toLocaleString()}_`);
  return lines.join("\n");
}

function ReportsRoute() {
  const { user, isPending } = useCurrentUserState();
  const messages = useWorkspaceStore((s) => s.messages);
  const pushNote = useNotificationsStore((s) => s.push);

  const reports = messages
    .filter((m) => m.role === "assistant" && m.table)
    .slice()
    .reverse();

  if (isPending) {
    return (
      <div className="grid min-h-dvh place-items-center bg-[var(--color-bg)]">
        <div className="h-10 w-10 animate-pulse rounded-full bg-[var(--color-surface)]" />
      </div>
    );
  }
  if (!user) return <RedirectToSignIn />;

  function download(m: ChatMessage) {
    const md = messageToMarkdown(m);
    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(m.table?.title || "pandaos-report").toLowerCase().replace(/\s+/g, "-")}.md`;
    a.click();
    URL.revokeObjectURL(url);
    pushNote({
      title: "Report exported",
      body: `${m.table?.title || "Report"} downloaded as Markdown.`,
      kind: "success",
      href: "/reports",
    });
    toast.success("Report downloaded");
  }

  function copy(m: ChatMessage) {
    void navigator.clipboard.writeText(messageToMarkdown(m));
    toast.success("Copied Markdown to clipboard");
  }

  return (
    <AppShell title="Reports">
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Reports</h2>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Table outputs from the command center become exportable reports.
            Run a workflow to generate more.
          </p>
        </div>

        <div className="space-y-3">
          {reports.map((m) => (
            <div
              key={m.id}
              className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-[12px] bg-[var(--color-accent-soft)] text-[var(--color-primary)]">
                  <FileText className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold">
                    {m.table?.title || "Report"}
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-[var(--color-muted)]">
                    {m.content}
                  </p>
                  <div className="mt-2 text-[11px] text-[var(--color-subtle)]">
                    {m.table?.rows.length ?? 0} rows
                    {m.ts ? ` · ${new Date(m.ts).toLocaleString()}` : ""}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button size="sm" onClick={() => download(m)}>
                      <Download className="h-3.5 w-3.5" />
                      Export Markdown
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => copy(m)}>
                      Copy
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {reports.length === 0 ? (
            <div className="rounded-[var(--radius-xl)] border border-dashed border-[var(--color-border-strong)] p-10 text-center text-sm text-[var(--color-muted)]">
              No reports yet. Run a pipeline or KPI workflow in the command
              center to generate one.
            </div>
          ) : null}
        </div>
      </div>
    </AppShell>
  );
}
