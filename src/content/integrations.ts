export type IntegrationCategory =
  | "CRM"
  | "Communication"
  | "Productivity"
  | "Data"
  | "Development"
  | "Marketing"
  | "Support"
  | "Finance";

export type IntegrationTrack = "business" | "builders" | "all";

export type Integration = {
  id: string;
  name: string;
  description: string;
  category: IntegrationCategory;
  tracks: Array<"business" | "builders">;
  color: string;
  popular?: boolean;
  keywords?: string[];
};

/** Full PandaOS integration catalog — ad stack + expanded enterprise set */
export const integrations: Integration[] = [
  // —— From the ad (business stack) ——
  {
    id: "hubspot",
    name: "HubSpot",
    description: "CRM contacts, deals, tickets, and company management",
    category: "CRM",
    tracks: ["business", "builders"],
    color: "#FF7A59",
    popular: true,
  },
  {
    id: "notion",
    name: "Notion",
    description: "Docs, databases, wikis, and team knowledge",
    category: "Productivity",
    tracks: ["business", "builders"],
    color: "#FFFFFF",
    popular: true,
  },
  {
    id: "gmail",
    name: "Gmail",
    description: "AI-native email with drag-to-chat and smart actions",
    category: "Communication",
    tracks: ["business", "builders"],
    color: "#EA4335",
    popular: true,
  },
  {
    id: "google-calendar",
    name: "Google Calendar",
    description: "View and manage calendar events",
    category: "Productivity",
    tracks: ["business", "builders"],
    color: "#4285F4",
    popular: true,
  },
  {
    id: "github",
    name: "GitHub",
    description: "Source control, pull requests, issues, actions, and releases",
    category: "Development",
    tracks: ["business", "builders"],
    color: "#FFFFFF",
    popular: true,
  },
  {
    id: "postgresql",
    name: "PostgreSQL",
    description: "Query databases and operational data naturally",
    category: "Data",
    tracks: ["business", "builders"],
    color: "#336791",
    popular: true,
    keywords: ["postgres", "sql", "database"],
  },
  {
    id: "slack",
    name: "Slack",
    description: "View channels, send messages, and follow threads",
    category: "Communication",
    tracks: ["business", "builders"],
    color: "#E01E5A",
    popular: true,
  },
  {
    id: "teams",
    name: "Microsoft Teams",
    description: "Chats, channels, messages, and threaded replies",
    category: "Communication",
    tracks: ["business"],
    color: "#6264A7",
    popular: true,
  },
  {
    id: "jira",
    name: "Jira",
    description: "Track issues, sprints, and boards",
    category: "Productivity",
    tracks: ["business", "builders"],
    color: "#2684FF",
    popular: true,
  },
  {
    id: "asana",
    name: "Asana",
    description: "Project and task management with boards, lists, and timelines",
    category: "Productivity",
    tracks: ["business"],
    color: "#F06A6A",
    popular: true,
  },
  {
    id: "trello",
    name: "Trello",
    description: "Boards, lists, and cards for lightweight project tracking",
    category: "Productivity",
    tracks: ["business"],
    color: "#0079BF",
    popular: true,
  },
  {
    id: "confluence",
    name: "Confluence",
    description: "Browse spaces, pages, and search team documentation",
    category: "Productivity",
    tracks: ["business"],
    color: "#2684FF",
    popular: true,
  },
  {
    id: "outlook",
    name: "Microsoft Outlook",
    description: "Summarize inboxes for leadership teams",
    category: "Communication",
    tracks: ["business"],
    color: "#0078D4",
    popular: true,
  },
  {
    id: "ga",
    name: "Google Analytics",
    description: "Website traffic, user behavior, and conversion metrics",
    category: "Data",
    tracks: ["business"],
    color: "#F9AB00",
    popular: true,
    keywords: ["analytics", "traffic"],
  },
  {
    id: "google-ads",
    name: "Google Ads",
    description: "Campaign management, reporting, and ad performance",
    category: "Marketing",
    tracks: ["business"],
    color: "#4285F4",
    popular: true,
  },

  // —— Expanded enterprise / ops ——
  {
    id: "salesforce",
    name: "Salesforce",
    description: "Enterprise CRM, opportunities, accounts, and service cloud",
    category: "CRM",
    tracks: ["business"],
    color: "#00A1E0",
  },
  {
    id: "pipedrive",
    name: "Pipedrive",
    description: "Sales pipeline, deals, and activity tracking",
    category: "CRM",
    tracks: ["business"],
    color: "#017737",
  },
  {
    id: "zendesk",
    name: "Zendesk",
    description: "Support tickets, macros, and customer conversations",
    category: "Support",
    tracks: ["business"],
    color: "#03363D",
  },
  {
    id: "intercom",
    name: "Intercom",
    description: "Customer messaging, help center, and product tours",
    category: "Support",
    tracks: ["business"],
    color: "#6AFDEF",
  },
  {
    id: "linear",
    name: "Linear",
    description: "Issue tracking built for high-velocity product teams",
    category: "Development",
    tracks: ["business", "builders"],
    color: "#5E6AD2",
  },
  {
    id: "airtable",
    name: "Airtable",
    description: "Flexible databases, bases, and operational spreadsheets",
    category: "Productivity",
    tracks: ["business", "builders"],
    color: "#18BFFF",
  },
  {
    id: "google-drive",
    name: "Google Drive",
    description: "Files, shared drives, and document search",
    category: "Productivity",
    tracks: ["business", "builders"],
    color: "#4285F4",
  },
  {
    id: "dropbox",
    name: "Dropbox",
    description: "Cloud files, shared folders, and paper docs",
    category: "Productivity",
    tracks: ["business"],
    color: "#0061FF",
  },
  {
    id: "zoom",
    name: "Zoom",
    description: "Meetings, recordings, and calendar sync",
    category: "Communication",
    tracks: ["business"],
    color: "#2D8CFF",
  },
  {
    id: "discord",
    name: "Discord",
    description: "Connect communities with CRM and support workflows",
    category: "Communication",
    tracks: ["business", "builders"],
    color: "#5865F2",
  },
  {
    id: "stripe",
    name: "Stripe",
    description: "Payments, subscriptions, invoices, and revenue metrics",
    category: "Finance",
    tracks: ["business", "builders"],
    color: "#635BFF",
  },
  {
    id: "quickbooks",
    name: "QuickBooks",
    description: "Accounting, expenses, and financial reporting",
    category: "Finance",
    tracks: ["business"],
    color: "#2CA01C",
  },
  {
    id: "snowflake",
    name: "Snowflake",
    description: "Cloud data warehouse queries and analytics",
    category: "Data",
    tracks: ["business"],
    color: "#29B5E8",
  },
  {
    id: "bigquery",
    name: "BigQuery",
    description: "Google Cloud analytics warehouse and SQL",
    category: "Data",
    tracks: ["business"],
    color: "#4285F4",
  },
  {
    id: "shopify",
    name: "Shopify",
    description: "Orders, products, customers, and store performance",
    category: "CRM",
    tracks: ["business"],
    color: "#96BF48",
  },
  {
    id: "meta-ads",
    name: "Meta Ads",
    description: "Facebook & Instagram campaign performance",
    category: "Marketing",
    tracks: ["business"],
    color: "#0668E1",
  },
  {
    id: "linkedin-ads",
    name: "LinkedIn Ads",
    description: "B2B campaign reporting and lead gen forms",
    category: "Marketing",
    tracks: ["business"],
    color: "#0A66C2",
  },
  {
    id: "figma",
    name: "Figma",
    description: "Design files, comments, and handoff context",
    category: "Productivity",
    tracks: ["business", "builders"],
    color: "#F24E1E",
  },
  {
    id: "monday",
    name: "monday.com",
    description: "Work OS boards, timelines, and automations",
    category: "Productivity",
    tracks: ["business"],
    color: "#FF3D57",
  },
  {
    id: "clickup",
    name: "ClickUp",
    description: "Tasks, docs, goals, and team dashboards",
    category: "Productivity",
    tracks: ["business"],
    color: "#7B68EE",
  },

  // —— Builders ——
  {
    id: "supabase",
    name: "Supabase",
    description: "Database explorer, SQL execution, auth users, and RLS",
    category: "Data",
    tracks: ["builders", "business"],
    color: "#3ECF8E",
  },
  {
    id: "vercel",
    name: "Vercel",
    description: "Deployments, build logs, environment variables, and previews",
    category: "Development",
    tracks: ["builders"],
    color: "#FFFFFF",
  },
  {
    id: "aws",
    name: "AWS",
    description: "Cloud resources, CloudWatch signals, and infra context",
    category: "Development",
    tracks: ["builders"],
    color: "#FF9900",
  },
  {
    id: "docker",
    name: "Docker",
    description: "Containers, images, and deployment environments",
    category: "Development",
    tracks: ["builders"],
    color: "#2496ED",
  },
  {
    id: "sentry",
    name: "Sentry",
    description: "Error tracking, performance, and release health",
    category: "Development",
    tracks: ["builders", "business"],
    color: "#362D59",
  },
  {
    id: "datadog",
    name: "Datadog",
    description: "Infrastructure monitoring, logs, and APM",
    category: "Development",
    tracks: ["builders"],
    color: "#632CA6",
  },
];

export const integrationCategories: IntegrationCategory[] = [
  "CRM",
  "Communication",
  "Productivity",
  "Data",
  "Development",
  "Marketing",
  "Support",
  "Finance",
];

export function integrationsFor(track: IntegrationTrack) {
  if (track === "all") return integrations;
  return integrations.filter((i) => i.tracks.includes(track));
}

export function getIntegration(id: string) {
  return integrations.find((i) => i.id === id);
}

/** Default connected set for a fresh workspace (matches product demo depth) */
export const defaultConnectedIds = [
  "hubspot",
  "notion",
  "slack",
  "gmail",
  "jira",
  "postgresql",
  "google-calendar",
  "github",
] as const;
