import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  defaultConnectedIds,
  integrations,
  type Integration,
} from "@/content/integrations";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  kind?: "text" | "table" | "actions";
  table?: {
    title: string;
    columns: string[];
    rows: string[][];
  };
  insights?: string[];
  actions?: { label: string; app: string }[];
  ts?: number;
};

export type ConnectedApp = {
  id: string;
  name: string;
  category: string;
  connected: boolean;
  description: string;
  color: string;
  lastSyncedAt?: number;
};

export type SavedWorkflow = {
  id: string;
  name: string;
  prompt: string;
  apps: string[];
  createdAt: number;
  lastRunAt?: number;
  schedule?: "manual" | "daily" | "weekly";
};

export type ActivityItem = {
  id: string;
  label: string;
  detail?: string;
  ts: number;
};

export type PendingApproval = {
  id: string;
  label: string;
  app: string;
  status: "pending" | "approved" | "rejected";
  createdAt: number;
  resolvedAt?: number;
};

function actionNeedsApproval(label: string): boolean {
  const l = label.toLowerCase();
  if (l.includes("save as workflow")) return false;
  if (l.startsWith("connect ")) return false;
  if (l === "hubspot pipeline summary") return false;
  if (l.includes("run on schedule")) return false;
  return /post|create|email|notify|schedule|slack|jira|send|update|digest|brief/.test(
    l,
  );
}

function fromCatalog(
  connectedSet: Set<string>,
  prev?: ConnectedApp[],
): ConnectedApp[] {
  const prevMap = new Map((prev ?? []).map((a) => [a.id, a]));
  return integrations.map((i: Integration) => {
    const was = prevMap.get(i.id);
    const connected = connectedSet.has(i.id);
    return {
      id: i.id,
      name: i.name,
      category: i.category,
      description: i.description,
      color: i.color,
      connected,
      lastSyncedAt: connected
        ? (was?.lastSyncedAt ?? Date.now())
        : undefined,
    };
  });
}

function buildDefaultApps(): ConnectedApp[] {
  return fromCatalog(new Set(defaultConnectedIds));
}

/** Normalize legacy ids from older localStorage snapshots */
function migrateAppId(id: string): string {
  if (id === "postgres") return "postgresql";
  if (id === "calendar") return "google-calendar";
  return id;
}

export const promptPresets = [
  {
    id: "pipeline",
    label: "HubSpot pipeline",
    prompt: "Summarize this week's HubSpot pipeline by stage and owner",
    requires: ["hubspot"],
  },
  {
    id: "revenue",
    label: "Top products by revenue",
    prompt:
      "Show me the top 10 products by revenue, broken down by brand and category",
    requires: ["postgresql"],
  },
  {
    id: "gmail-jira",
    label: "Gmail → Jira",
    prompt:
      "Turn open support emails into Jira tasks and list what you would create",
    requires: ["gmail", "jira"],
  },
  {
    id: "kpi",
    label: "Weekly KPIs",
    prompt: "Generate a weekly KPI report from HubSpot and Google Analytics",
    requires: ["hubspot", "ga"],
  },
  {
    id: "standup",
    label: "Leadership brief",
    prompt:
      "Summarize leadership-critical items from Outlook/Gmail for Monday standup",
    requires: ["gmail"],
  },
  {
    id: "asana",
    label: "Asana board status",
    prompt: "Summarize Asana project board status and overdue tasks",
    requires: ["asana"],
  },
  {
    id: "stripe",
    label: "Stripe revenue",
    prompt: "Show Stripe MRR, failed payments, and top customers this week",
    requires: ["stripe"],
  },
] as const;

const welcome: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Welcome to PandaOS. Your business stack lives here — CRM, docs, email, data, and workflows in one command center. Pick a preset or ask anything.",
  kind: "text",
  ts: Date.now(),
};

function missingApps(apps: ConnectedApp[], required: string[]): ConnectedApp[] {
  return required
    .map((id) => apps.find((a) => a.id === id || a.id === migrateAppId(id)))
    .filter((a): a is ConnectedApp => !!a && !a.connected);
}

function isConnected(apps: ConnectedApp[], id: string) {
  const a = apps.find((x) => x.id === id || x.id === migrateAppId(id));
  return !!a?.connected;
}

function respondTo(prompt: string, apps: ConnectedApp[]): ChatMessage {
  const p = prompt.toLowerCase();
  const id = crypto.randomUUID();
  const ts = Date.now();

  let required: string[] = [];
  if (p.includes("hubspot") || p.includes("pipeline")) required.push("hubspot");
  if (p.includes("salesforce")) required.push("salesforce");
  if (p.includes("jira")) required.push("jira");
  if (p.includes("linear")) required.push("linear");
  if (p.includes("asana")) required.push("asana");
  if (p.includes("trello")) required.push("trello");
  if (
    p.includes("gmail") ||
    (p.includes("email") && !p.includes("outlook")) ||
    p.includes("inbox")
  )
    required.push("gmail");
  if (p.includes("outlook")) required.push("outlook");
  if (p.includes("slack")) required.push("slack");
  if (p.includes("teams")) required.push("teams");
  if (p.includes("analytics") || p.includes("kpi")) {
    if (p.includes("hubspot") || p.includes("kpi") || p.includes("weekly"))
      required.push("hubspot", "ga");
    else required.push("ga");
  }
  if (
    p.includes("product") ||
    p.includes("revenue") ||
    p.includes("postgres") ||
    p.includes("postgresql") ||
    p.includes("sql")
  )
    required.push("postgresql");
  if (p.includes("stripe") || p.includes("mrr")) required.push("stripe");
  if (p.includes("shopify")) required.push("shopify");
  if (p.includes("google ads") || p.includes("ad performance"))
    required.push("google-ads");
  if (p.includes("zendesk")) required.push("zendesk");
  if (p.includes("notion")) required.push("notion");
  if (p.includes("confluence")) required.push("confluence");
  if (p.includes("github")) required.push("github");
  if (p.includes("snowflake") || p.includes("bigquery")) {
    if (p.includes("snowflake")) required.push("snowflake");
    if (p.includes("bigquery")) required.push("bigquery");
  }

  if (p.includes("focus project")) required = [];

  // dedupe
  required = [...new Set(required)];

  const missing = missingApps(apps, required);
  if (missing.length > 0) {
    return {
      id,
      role: "assistant",
      content: `Connect these apps first: ${missing.map((m) => m.name).join(", ")}. Toggle them under Integrations, then re-run.`,
      kind: "actions",
      actions: missing.map((m) => ({
        label: `Connect ${m.name}`,
        app: m.name,
      })),
      ts,
    };
  }

  if (p.includes("focus project")) {
    const nameMatch = prompt.match(/“([^”]+)”|"([^"]+)"/);
    const name = nameMatch?.[1] || nameMatch?.[2] || "this project";
    return {
      id,
      role: "assistant",
      content: `Project “${name}” is in focus. Recommended runbook for the next 15 minutes:`,
      kind: "table",
      table: {
        title: `${name} · runbook`,
        columns: ["Step", "Action", "App", "Owner"],
        rows: [
          ["1", "Pull latest metrics", "Connected stack", "You"],
          ["2", "Flag blockers", "Slack", "Ops"],
          ["3", "Update status doc", "Notion", "You"],
          ["4", "Schedule follow-up", "Calendar", "You"],
        ],
      },
      insights: [
        "Open a saved workflow from the right rail to execute step 1.",
        "Export any table from Reports as Markdown for leadership.",
      ],
      actions: [
        { label: "HubSpot pipeline summary", app: "HubSpot" },
        { label: "Save as workflow", app: "PandaOS" },
      ],
      ts,
    };
  }

  if (p.includes("asana")) {
    return {
      id,
      role: "assistant",
      content: "Pulled Asana board health across active projects.",
      kind: "table",
      table: {
        title: "Asana board status",
        columns: ["Project", "Open", "Overdue", "Owner"],
        rows: [
          ["Q3 Launch", "24", "3", "M. Ortiz"],
          ["Customer Onboarding", "11", "1", "A. Chen"],
          ["Website Redesign", "18", "0", "J. Park"],
        ],
      },
      actions: [
        { label: "Post digest to Slack", app: "Slack" },
        { label: "Save as workflow", app: "PandaOS" },
      ],
      ts,
    };
  }

  if (p.includes("stripe") || p.includes("mrr")) {
    return {
      id,
      role: "assistant",
      content: "Stripe revenue snapshot for the last 7 days.",
      kind: "table",
      table: {
        title: "Stripe revenue",
        columns: ["Metric", "Value", "Δ"],
        rows: [
          ["MRR", "$84,200", "+4.2%"],
          ["Failed payments", "12", "-3"],
          ["New subs", "47", "+9"],
          ["Churned", "6", "flat"],
        ],
      },
      insights: ["3 failed invoices over $2k need dunning follow-up."],
      actions: [
        { label: "Email finance", app: "Gmail" },
        { label: "Save as workflow", app: "PandaOS" },
      ],
      ts,
    };
  }

  if (p.includes("shopify")) {
    return {
      id,
      role: "assistant",
      content: "Shopify store performance for this week.",
      kind: "table",
      table: {
        title: "Shopify snapshot",
        columns: ["Metric", "Value", "Note"],
        rows: [
          ["Orders", "312", "+11%"],
          ["AOV", "$68", "+$4"],
          ["Top SKU", "Baseball Cap", "41 units"],
        ],
      },
      actions: [
        { label: "Sync to Notion", app: "Notion" },
        { label: "Save as workflow", app: "PandaOS" },
      ],
      ts,
    };
  }

  if (p.includes("zendesk")) {
    return {
      id,
      role: "assistant",
      content: "Zendesk queue health and SLA risk.",
      kind: "table",
      table: {
        title: "Zendesk queue",
        columns: ["Queue", "Open", "SLA risk", "Owner"],
        rows: [
          ["Tier 1", "48", "Low", "Support"],
          ["Billing", "12", "Med", "Finance"],
          ["Enterprise", "7", "High", "CSM"],
        ],
      },
      actions: [
        { label: "Notify #support", app: "Slack" },
        { label: "Save as workflow", app: "PandaOS" },
      ],
      ts,
    };
  }

  if (p.includes("google ads") || p.includes("ad performance")) {
    return {
      id,
      role: "assistant",
      content: "Google Ads campaign performance this week.",
      kind: "table",
      table: {
        title: "Google Ads",
        columns: ["Campaign", "Spend", "Conv.", "CPA"],
        rows: [
          ["Brand Search", "$4.2k", "86", "$49"],
          ["Competitor", "$2.1k", "22", "$95"],
          ["Retargeting", "$1.4k", "31", "$45"],
        ],
      },
      actions: [
        { label: "Post to #growth", app: "Slack" },
        { label: "Save as workflow", app: "PandaOS" },
      ],
      ts,
    };
  }

  if (p.includes("github")) {
    return {
      id,
      role: "assistant",
      content: "GitHub delivery pulse across open PRs and CI.",
      kind: "table",
      table: {
        title: "GitHub pulse",
        columns: ["Repo", "Open PRs", "CI fails", "Review lag"],
        rows: [
          ["pandaos-web", "6", "1", "14h"],
          ["ops-workers", "3", "0", "6h"],
          ["integrations", "9", "2", "22h"],
        ],
      },
      actions: [
        { label: "Notify #eng", app: "Slack" },
        { label: "Save as workflow", app: "PandaOS" },
      ],
      ts,
    };
  }

  if (p.includes("pipeline") || (p.includes("hubspot") && !p.includes("kpi"))) {
    return {
      id,
      role: "assistant",
      content:
        "Pulled live deal stages from HubSpot. Here's this week's pipeline snapshot.",
      kind: "table",
      table: {
        title: "Pipeline by stage",
        columns: ["Stage", "Deals", "Value", "Owner focus"],
        rows: [
          ["Discovery", "18", "$142k", "A. Chen"],
          ["Proposal", "11", "$286k", "M. Ortiz"],
          ["Negotiation", "7", "$410k", "J. Park"],
          ["Closed Won", "4", "$192k", "Team"],
        ],
      },
      insights: [
        "Negotiation value is up 22% week-over-week.",
        "3 deals over $50k need stakeholder review before Friday.",
      ],
      actions: [
        {
          label: "Post summary to #revops",
          app: isConnected(apps, "slack") ? "Slack" : "Teams",
        },
        { label: "Update Notion pipeline doc", app: "Notion" },
        { label: "Save as workflow", app: "PandaOS" },
      ],
      ts,
    };
  }

  if (p.includes("product") || p.includes("revenue") || p.includes("top 10")) {
    return {
      id,
      role: "assistant",
      content: "Queried connected retail data and ranked products by revenue.",
      kind: "table",
      table: {
        title: "Top products by revenue",
        columns: ["Product", "Brand", "Units", "Revenue"],
        rows: [
          ["Baseball Cap", "Brand D", "28", "$840"],
          ["Sneakers", "Brand C", "22", "$550"],
          ["Jacket", "Brand E", "16", "$520"],
          ["Women's Jeans", "Brand B", "20", "$500"],
          ["Men's T-shirt", "Brand A", "18", "$360"],
        ],
      },
      insights: [
        "Baseball Cap is ~50% ahead of #2 on revenue.",
        "Clothing holds 3 of the top 5 slots.",
      ],
      actions: [
        { label: "Create board summary", app: "Notion" },
        { label: "Email report to leadership", app: "Gmail" },
        { label: "Save as workflow", app: "PandaOS" },
      ],
      ts,
    };
  }

  if (
    p.includes("jira") ||
    p.includes("gmail") ||
    p.includes("triage") ||
    (p.includes("email") && p.includes("task"))
  ) {
    return {
      id,
      role: "assistant",
      content:
        "Scanned support inbox and drafted Jira issues for actionable threads.",
      kind: "table",
      table: {
        title: "Proposed Jira tasks",
        columns: ["From", "Subject", "Priority", "Project"],
        rows: [
          ["client@acme.com", "SSO timeout on mobile", "High", "SUPPORT"],
          ["ops@north.io", "Export CSV missing fields", "Med", "DATA"],
          ["ceo@startup.co", "Invoice mismatch March", "High", "BILLING"],
        ],
      },
      actions: [
        { label: "Create 3 issues in Jira", app: "Jira" },
        { label: "Notify #support", app: "Slack" },
        { label: "Save as workflow", app: "PandaOS" },
      ],
      ts,
    };
  }

  if (
    p.includes("kpi") ||
    p.includes("analytics") ||
    p.includes("weekly digest") ||
    (p.includes("weekly") && !p.includes("asana"))
  ) {
    return {
      id,
      role: "assistant",
      content:
        "Combined HubSpot closed-won with GA sessions into a weekly KPI pack.",
      kind: "table",
      table: {
        title: "Weekly KPIs",
        columns: ["Metric", "This week", "Δ", "Note"],
        rows: [
          ["Closed revenue", "$192k", "+14%", "4 deals"],
          ["Qualified leads", "86", "+6%", "Paid + partner"],
          ["Site sessions", "24.1k", "-3%", "Seasonal dip"],
          ["Win rate", "18%", "+2pp", "Best in 8 weeks"],
        ],
      },
      actions: [
        { label: "Save to Notion KPIs", app: "Notion" },
        { label: "Schedule Slack digest", app: "Slack" },
        { label: "Save as workflow", app: "PandaOS" },
      ],
      ts,
    };
  }

  if (p.includes("standup") || p.includes("leadership") || p.includes("outlook")) {
    return {
      id,
      role: "assistant",
      content: "Prioritized leadership-critical threads for Monday standup.",
      kind: "table",
      table: {
        title: "Inbox brief",
        columns: ["Thread", "From", "Urgency", "Ask"],
        rows: [
          ["Q3 board deck review", "CFO", "High", "Approve numbers"],
          ["Enterprise renewal Acme", "AE", "High", "Discount approval"],
          ["Security questionnaire", "IT", "Med", "Assign owner"],
        ],
      },
      actions: [
        { label: "Post brief to #leadership", app: "Slack" },
        { label: "Add to calendar notes", app: "Calendar" },
        { label: "Save as workflow", app: "PandaOS" },
      ],
      ts,
    };
  }

  const connectedNames = apps
    .filter((a) => a.connected)
    .slice(0, 6)
    .map((a) => a.name)
    .join(", ");

  return {
    id,
    role: "assistant",
    content: `Workflow ready across ${connectedNames || "your stack"} for: “${prompt.slice(0, 120)}${prompt.length > 120 ? "…" : ""}”`,
    kind: "actions",
    insights: [
      "Context is shared across every connected CRM, doc, and messaging tool.",
      "Save this as a reusable workflow from the Actions panel.",
    ],
    actions: [
      { label: "Save as workflow", app: "PandaOS" },
      { label: "Run on schedule", app: "Calendar" },
    ],
    ts,
  };
}

type WorkspaceState = {
  apps: ConnectedApp[];
  messages: ChatMessage[];
  input: string;
  busy: boolean;
  savedWorkflows: SavedWorkflow[];
  activity: ActivityItem[];
  lastPrompt: string | null;
  pendingApprovals: PendingApproval[];
  setInput: (v: string) => void;
  toggleApp: (id: string) => void;
  syncApp: (id: string) => void;
  connectAppByName: (name: string) => void;
  connectAllPopular: () => void;
  disconnectAll: () => void;
  send: (text?: string) => void;
  clearChat: () => void;
  runAction: (label: string, app?: string) => void;
  saveWorkflow: (name?: string) => void;
  deleteWorkflow: (id: string) => void;
  runWorkflow: (id: string) => void;
  setSchedule: (id: string, schedule: SavedWorkflow["schedule"]) => void;
  approve: (id: string) => void;
  reject: (id: string) => void;
  ensureCatalogSynced: () => void;
  replaceFromImport: (partial: {
    apps?: ConnectedApp[];
    savedWorkflows?: SavedWorkflow[];
    messages?: ChatMessage[];
    activity?: ActivityItem[];
    lastPrompt?: string | null;
    pendingApprovals?: PendingApproval[];
  }) => void;
};

function pushActivity(
  activity: ActivityItem[],
  label: string,
  detail?: string,
): ActivityItem[] {
  return [
    { id: crypto.randomUUID(), label, detail, ts: Date.now() },
    ...activity,
  ].slice(0, 40);
}

function syncApps(apps: ConnectedApp[]): ConnectedApp[] {
  const connected = new Set(
    apps.filter((a) => a.connected).map((a) => migrateAppId(a.id)),
  );
  return fromCatalog(connected, apps);
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set, get) => ({
      apps: buildDefaultApps(),
      messages: [welcome],
      input: "",
      busy: false,
      pendingApprovals: [],
      savedWorkflows: [
        {
          id: "wf-pipeline",
          name: "Weekly HubSpot pipeline",
          prompt: "Summarize this week's HubSpot pipeline by stage and owner",
          apps: ["hubspot", "slack", "notion"],
          createdAt: Date.now() - 86400000 * 3,
          lastRunAt: Date.now(),
          schedule: "weekly",
        },
        {
          id: "wf-triage",
          name: "Gmail → Jira triage",
          prompt:
            "Turn open support emails into Jira tasks and list what you would create",
          apps: ["gmail", "jira", "slack"],
          createdAt: Date.now() - 86400000 * 7,
          lastRunAt: Date.now(),
          schedule: "daily",
        },
        {
          id: "wf-stripe",
          name: "Stripe revenue pulse",
          prompt: "Show Stripe MRR, failed payments, and top customers this week",
          apps: ["stripe", "slack"],
          createdAt: Date.now() - 86400000 * 2,
          lastRunAt: Date.now(),
          schedule: "daily",
        },
      ],
      activity: [
        {
          id: "a1",
          label: "Workspace ready",
          detail: `${defaultConnectedIds.length} apps pre-connected`,
          ts: Date.now(),
        },
      ],
      lastPrompt: null,
      ensureCatalogSynced: () =>
        set((s) => ({ apps: syncApps(s.apps) })),
      setInput: (v) => set({ input: v }),
      toggleApp: (id) =>
        set((s) => {
          const nid = migrateAppId(id);
          const apps = s.apps.map((a) =>
            a.id === nid
              ? {
                  ...a,
                  connected: !a.connected,
                  lastSyncedAt: !a.connected ? Date.now() : undefined,
                }
              : a,
          );
          const synced = syncApps(apps);
          const app = synced.find((a) => a.id === nid);
          return {
            apps: synced,
            activity: pushActivity(
              s.activity,
              app?.connected
                ? `Connected ${app.name}`
                : `Disconnected ${app?.name ?? id}`,
            ),
          };
        }),
      syncApp: (id) =>
        set((s) => {
          const nid = migrateAppId(id);
          return {
            apps: s.apps.map((a) =>
              a.id === nid && a.connected
                ? { ...a, lastSyncedAt: Date.now() }
                : a,
            ),
            activity: pushActivity(
              s.activity,
              "Synced app",
              s.apps.find((a) => a.id === nid)?.name,
            ),
          };
        }),
      connectAppByName: (name) => {
        const app = get().apps.find(
          (a) => a.name.toLowerCase() === name.toLowerCase(),
        );
        if (app && !app.connected) get().toggleApp(app.id);
      },
      connectAllPopular: () =>
        set((s) => {
          const popular = new Set(
            integrations.filter((i) => i.popular).map((i) => i.id),
          );
          const connected = new Set([
            ...s.apps.filter((a) => a.connected).map((a) => a.id),
            ...popular,
          ]);
          return {
            apps: fromCatalog(connected, s.apps),
            activity: pushActivity(s.activity, "Connected popular apps"),
          };
        }),
      disconnectAll: () =>
        set((s) => ({
          apps: fromCatalog(new Set(), s.apps),
          activity: pushActivity(s.activity, "Disconnected all apps"),
        })),
      clearChat: () =>
        set((s) => ({
          messages: [welcome],
          activity: pushActivity(s.activity, "Cleared chat"),
        })),
      saveWorkflow: (name) => {
        const prompt = get().lastPrompt;
        if (!prompt) return;
        const wf: SavedWorkflow = {
          id: crypto.randomUUID(),
          name: name || prompt.slice(0, 48),
          prompt,
          apps: get()
            .apps.filter((a) => a.connected)
            .map((a) => a.id)
            .slice(0, 12),
          createdAt: Date.now(),
          schedule: "manual",
        };
        set((s) => ({
          savedWorkflows: [wf, ...s.savedWorkflows],
          activity: pushActivity(s.activity, "Saved workflow", wf.name),
          messages: [
            ...s.messages,
            {
              id: crypto.randomUUID(),
              role: "system",
              content: `Saved workflow: ${wf.name}`,
              kind: "text",
              ts: Date.now(),
            },
          ],
        }));
      },
      deleteWorkflow: (id) =>
        set((s) => ({
          savedWorkflows: s.savedWorkflows.filter((w) => w.id !== id),
          activity: pushActivity(s.activity, "Deleted workflow"),
        })),
      setSchedule: (id, schedule) =>
        set((s) => ({
          savedWorkflows: s.savedWorkflows.map((w) =>
            w.id === id
              ? { ...w, schedule, lastRunAt: Date.now() }
              : w,
          ),
          activity: pushActivity(s.activity, "Updated schedule", schedule),
        })),
      runWorkflow: (id) => {
        const wf = get().savedWorkflows.find((w) => w.id === id);
        if (!wf) return;
        set((s) => ({
          savedWorkflows: s.savedWorkflows.map((w) =>
            w.id === id ? { ...w, lastRunAt: Date.now() } : w,
          ),
        }));
        get().send(wf.prompt);
      },
      runAction: (label, app) => {
        if (label.toLowerCase().includes("save as workflow")) {
          get().saveWorkflow();
          return;
        }
        if (label.toLowerCase() === "hubspot pipeline summary") {
          get().send(
            "Summarize this week's HubSpot pipeline by stage and owner",
          );
          return;
        }
        if (label.toLowerCase().startsWith("connect ")) {
          const name = label.replace(/^Connect\s+/i, "");
          get().connectAppByName(name);
          set((s) => ({
            messages: [
              ...s.messages,
              {
                id: crypto.randomUUID(),
                role: "system",
                content: `${name} connected. Re-run your prompt to continue.`,
                kind: "text",
                ts: Date.now(),
              },
            ],
          }));
          return;
        }
        if (label.toLowerCase().includes("run on schedule")) {
          get().saveWorkflow();
          const latest = get().savedWorkflows[0];
          if (latest) get().setSchedule(latest.id, "daily");
          set((s) => ({
            messages: [
              ...s.messages,
              {
                id: crypto.randomUUID(),
                role: "system",
                content: "Scheduled daily run for the latest workflow.",
                kind: "text",
                ts: Date.now(),
              },
            ],
          }));
          return;
        }

        if (actionNeedsApproval(label)) {
          const approval: PendingApproval = {
            id: crypto.randomUUID(),
            label,
            app: app || "PandaOS",
            status: "pending",
            createdAt: Date.now(),
          };
          set((s) => ({
            pendingApprovals: [approval, ...s.pendingApprovals].slice(0, 30),
            messages: [
              ...s.messages,
              {
                id: crypto.randomUUID(),
                role: "system",
                content: `Approval required: ${label} · ${approval.app}. Review in Approvals.`,
                kind: "text",
                ts: Date.now(),
              },
            ],
            activity: pushActivity(s.activity, "Pending approval", label),
          }));
          return;
        }

        set((s) => ({
          messages: [
            ...s.messages,
            {
              id: crypto.randomUUID(),
              role: "system",
              content: `Completed: ${label}`,
              kind: "text",
              ts: Date.now(),
            },
          ],
          activity: pushActivity(s.activity, label),
        }));
      },
      approve: (id) => {
        const item = get().pendingApprovals.find((a) => a.id === id);
        if (!item || item.status !== "pending") return;
        set((s) => ({
          pendingApprovals: s.pendingApprovals.map((a) =>
            a.id === id
              ? { ...a, status: "approved" as const, resolvedAt: Date.now() }
              : a,
          ),
          messages: [
            ...s.messages,
            {
              id: crypto.randomUUID(),
              role: "system",
              content: `Approved & completed: ${item.label}`,
              kind: "text",
              ts: Date.now(),
            },
          ],
          activity: pushActivity(s.activity, "Approved", item.label),
        }));
      },
      reject: (id) => {
        const item = get().pendingApprovals.find((a) => a.id === id);
        if (!item || item.status !== "pending") return;
        set((s) => ({
          pendingApprovals: s.pendingApprovals.map((a) =>
            a.id === id
              ? { ...a, status: "rejected" as const, resolvedAt: Date.now() }
              : a,
          ),
          messages: [
            ...s.messages,
            {
              id: crypto.randomUUID(),
              role: "system",
              content: `Rejected: ${item.label}`,
              kind: "text",
              ts: Date.now(),
            },
          ],
          activity: pushActivity(s.activity, "Rejected", item.label),
        }));
      },
      replaceFromImport: (partial) => {
        set((s) => ({
          apps: partial.apps ?? s.apps,
          savedWorkflows: partial.savedWorkflows ?? s.savedWorkflows,
          messages: partial.messages ?? s.messages,
          activity: partial.activity ?? s.activity,
          lastPrompt:
            partial.lastPrompt !== undefined ? partial.lastPrompt : s.lastPrompt,
          pendingApprovals: partial.pendingApprovals ?? s.pendingApprovals,
        }));
        get().ensureCatalogSynced();
      },
      send: (text) => {
        const value = (text ?? get().input).trim();
        if (!value || get().busy) return;
        // ensure catalog is full before resolving requirements
        get().ensureCatalogSynced();
        const userMsg: ChatMessage = {
          id: crypto.randomUUID(),
          role: "user",
          content: value,
          kind: "text",
          ts: Date.now(),
        };
        set((s) => ({
          messages: [...s.messages, userMsg],
          input: "",
          busy: true,
          lastPrompt: value,
          activity: pushActivity(
            s.activity,
            "Ran workflow",
            value.slice(0, 60),
          ),
        }));
        window.setTimeout(() => {
          const reply = respondTo(value, get().apps);
          set((s) => ({
            messages: [...s.messages, reply],
            busy: false,
          }));
        }, 650);
      },
    }),
    {
      name: "pandaos-workspace-v4",
      partialize: (s) => ({
        apps: s.apps,
        savedWorkflows: s.savedWorkflows,
        activity: s.activity.slice(0, 20),
        messages: s.messages.slice(-40),
        lastPrompt: s.lastPrompt,
        pendingApprovals: s.pendingApprovals
          .filter((a) => a.status === "pending")
          .slice(0, 20),
      }),
      onRehydrateStorage: () => (state) => {
        state?.ensureCatalogSynced();
      },
    },
  ),
);
