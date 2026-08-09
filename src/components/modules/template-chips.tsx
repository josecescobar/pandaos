import { useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { cn } from "@/lib/utils";

export const landingTemplates = [
  {
    id: "pipeline",
    label: "HubSpot pipeline summary",
    prompt: "Summarize this week's HubSpot pipeline by stage and owner",
  },
  {
    id: "triage",
    label: "Gmail → Jira triage",
    prompt:
      "Turn open support emails into Jira tasks and list what you would create",
  },
  {
    id: "kpi",
    label: "Weekly KPI pack",
    prompt: "Generate a weekly KPI report from HubSpot and Google Analytics",
  },
  {
    id: "stripe",
    label: "Stripe revenue pulse",
    prompt: "Show Stripe MRR, failed payments, and top customers this week",
  },
  {
    id: "standup",
    label: "Leadership inbox brief",
    prompt:
      "Summarize leadership-critical items from Outlook/Gmail for Monday standup",
  },
] as const;

export const PENDING_PROMPT_KEY = "pandaos-pending-prompt";

export function TemplateChips({
  className,
  align = "center",
}: {
  className?: string;
  align?: "center" | "left";
}) {
  const navigate = useNavigate();
  const { user } = useCurrentUserState();

  function run(prompt: string) {
    try {
      sessionStorage.setItem(PENDING_PROMPT_KEY, prompt);
    } catch {
      /* ignore */
    }
    navigate({ to: user ? "/workspace" : "/login" });
  }

  return (
    <div
      className={cn(
        "flex flex-wrap gap-2",
        align === "center" && "justify-center",
        className,
      )}
    >
      {landingTemplates.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => run(t.prompt)}
          className="group inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-3 py-2 text-xs font-medium text-[var(--color-fg)] transition-colors hover:border-[var(--color-primary)] hover:bg-[var(--color-accent-soft)]"
        >
          {t.label}
          <ArrowRight className="h-3 w-3 text-[var(--color-subtle)] transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--color-primary)]" />
        </button>
      ))}
    </div>
  );
}
