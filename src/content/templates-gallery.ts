export type GalleryTemplate = {
  id: string;
  name: string;
  description: string;
  apps: string[];
  category: "RevOps" | "Support" | "Leadership" | "Finance" | "Engineering";
  prompt: string;
  sample: {
    title: string;
    columns: string[];
    rows: string[][];
  };
};

export const galleryTemplates: GalleryTemplate[] = [
  {
    id: "pipeline",
    name: "HubSpot pipeline summary",
    description:
      "Stage-by-stage deal snapshot with owner focus and week-over-week callouts.",
    apps: ["HubSpot", "Slack", "Notion"],
    category: "RevOps",
    prompt: "Summarize this week's HubSpot pipeline by stage and owner",
    sample: {
      title: "Pipeline by stage",
      columns: ["Stage", "Deals", "Value"],
      rows: [
        ["Discovery", "18", "$142k"],
        ["Proposal", "11", "$286k"],
        ["Negotiation", "7", "$410k"],
      ],
    },
  },
  {
    id: "triage",
    name: "Gmail → Jira triage",
    description:
      "Scan support mail and draft prioritized Jira issues ready to create.",
    apps: ["Gmail", "Jira", "Slack"],
    category: "Support",
    prompt:
      "Turn open support emails into Jira tasks and list what you would create",
    sample: {
      title: "Proposed Jira tasks",
      columns: ["From", "Subject", "Priority"],
      rows: [
        ["client@acme.com", "SSO timeout", "High"],
        ["ops@north.io", "CSV export", "Med"],
      ],
    },
  },
  {
    id: "kpi",
    name: "Weekly KPI pack",
    description: "Closed-won + traffic + win-rate pack for Monday leadership.",
    apps: ["HubSpot", "Google Analytics", "Notion"],
    category: "RevOps",
    prompt: "Generate a weekly KPI report from HubSpot and Google Analytics",
    sample: {
      title: "Weekly KPIs",
      columns: ["Metric", "This week", "Δ"],
      rows: [
        ["Closed revenue", "$192k", "+14%"],
        ["Site sessions", "24.1k", "-3%"],
      ],
    },
  },
  {
    id: "stripe",
    name: "Stripe revenue pulse",
    description: "MRR, failed payments, and churn signals in one table.",
    apps: ["Stripe", "Slack", "Gmail"],
    category: "Finance",
    prompt: "Show Stripe MRR, failed payments, and top customers this week",
    sample: {
      title: "Stripe revenue",
      columns: ["Metric", "Value", "Δ"],
      rows: [
        ["MRR", "$84,200", "+4.2%"],
        ["Failed payments", "12", "-3"],
      ],
    },
  },
  {
    id: "standup",
    name: "Leadership inbox brief",
    description: "Prioritized threads for Monday standup — urgency and ask.",
    apps: ["Gmail", "Outlook", "Slack"],
    category: "Leadership",
    prompt:
      "Summarize leadership-critical items from Outlook/Gmail for Monday standup",
    sample: {
      title: "Inbox brief",
      columns: ["Thread", "Urgency", "Ask"],
      rows: [
        ["Board deck review", "High", "Approve numbers"],
        ["Acme renewal", "High", "Discount"],
      ],
    },
  },
  {
    id: "asana",
    name: "Asana board health",
    description: "Open vs overdue tasks by project with owners.",
    apps: ["Asana", "Slack"],
    category: "Support",
    prompt: "Summarize Asana project board status and overdue tasks",
    sample: {
      title: "Asana board status",
      columns: ["Project", "Open", "Overdue"],
      rows: [
        ["Q3 Launch", "24", "3"],
        ["Onboarding", "11", "1"],
      ],
    },
  },
  {
    id: "github",
    name: "GitHub delivery pulse",
    description: "Open PRs, CI fails, and review lag across repos.",
    apps: ["GitHub", "Slack", "Linear"],
    category: "Engineering",
    prompt: "Show GitHub delivery pulse across open PRs and CI",
    sample: {
      title: "GitHub pulse",
      columns: ["Repo", "Open PRs", "CI fails"],
      rows: [
        ["pandaos-web", "6", "1"],
        ["ops-workers", "3", "0"],
      ],
    },
  },
  {
    id: "ads",
    name: "Google Ads performance",
    description: "Spend, conversions, and CPA by campaign this week.",
    apps: ["Google Ads", "Slack", "HubSpot"],
    category: "RevOps",
    prompt: "Show Google Ads campaign performance and CPA this week",
    sample: {
      title: "Google Ads",
      columns: ["Campaign", "Spend", "CPA"],
      rows: [
        ["Brand Search", "$4.2k", "$49"],
        ["Retargeting", "$1.4k", "$45"],
      ],
    },
  },
];

export function getGalleryTemplate(id: string) {
  return galleryTemplates.find((t) => t.id === id);
}
