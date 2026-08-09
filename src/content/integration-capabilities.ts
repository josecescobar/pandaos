export type IntegrationCapability = {
  id: string;
  actions: string[];
  scopes: string[];
  samplePrompts: string[];
  objects?: string[];
};

const defaults: Omit<IntegrationCapability, "id"> = {
  actions: ["Read records", "Search", "Draft updates"],
  scopes: ["read", "write (approval required)"],
  samplePrompts: ["Summarize latest activity", "List open items"],
};

const byId: Record<string, Omit<IntegrationCapability, "id">> = {
  hubspot: {
    actions: [
      "Pipeline by stage",
      "Deal owner rollup",
      "Create note (approval)",
      "Update deal stage (approval)",
    ],
    scopes: ["crm.objects.deals.read", "crm.objects.contacts.read", "crm.write"],
    samplePrompts: [
      "Summarize this week's HubSpot pipeline by stage and owner",
      "List stalled deals in Negotiation",
    ],
    objects: ["Deals", "Contacts", "Companies", "Tickets"],
  },
  notion: {
    actions: ["Search pages", "Update database row", "Create page (approval)"],
    scopes: ["pages.read", "databases.read", "pages.write"],
    samplePrompts: [
      "Update Notion weekly pipeline doc with latest numbers",
      "Search Notion for Q3 board prep",
    ],
    objects: ["Pages", "Databases"],
  },
  gmail: {
    actions: ["Triage inbox", "Draft reply", "Send email (approval)"],
    scopes: ["gmail.readonly", "gmail.compose"],
    samplePrompts: [
      "Turn open support emails into Jira tasks",
      "Draft leadership email with pipeline summary",
    ],
    objects: ["Threads", "Labels"],
  },
  slack: {
    actions: ["Post message (approval)", "Search channels", "Draft brief"],
    scopes: ["channels:read", "chat:write"],
    samplePrompts: [
      "Post pipeline summary to #revops",
      "Draft standup brief for #leadership",
    ],
    objects: ["Channels", "Messages"],
  },
  jira: {
    actions: ["List issues", "Create issue (approval)", "Update priority"],
    scopes: ["read:jira-work", "write:jira-work"],
    samplePrompts: [
      "Create Jira tasks from support email triage",
      "Show open high-priority bugs",
    ],
    objects: ["Issues", "Projects"],
  },
  stripe: {
    actions: ["MRR snapshot", "Failed payments", "Top customers"],
    scopes: ["read"],
    samplePrompts: [
      "Show Stripe MRR, failed payments, and top customers this week",
    ],
    objects: ["Customers", "Invoices", "Subscriptions"],
  },
  github: {
    actions: ["Open PRs", "CI status", "Release notes draft"],
    scopes: ["repo", "read:org"],
    samplePrompts: ["Show GitHub delivery pulse across open PRs and CI"],
    objects: ["PRs", "Issues", "Actions"],
  },
  vercel: {
    actions: ["List deployments", "Promote preview (approval)", "Rollback"],
    scopes: ["deployments:read", "deployments:write"],
    samplePrompts: ["Show production deploy status and active previews"],
    objects: ["Projects", "Deployments"],
  },
  supabase: {
    actions: ["Query tables", "Check RLS", "List auth users (read)"],
    scopes: ["database.read"],
    samplePrompts: ["Query Supabase for weekly active users"],
    objects: ["Tables", "Auth"],
  },
  postgresql: {
    actions: ["Natural language SQL", "Explain plan", "Top tables"],
    scopes: ["read"],
    samplePrompts: [
      "Show me the top 10 products by revenue, broken down by brand and category",
    ],
    objects: ["Tables", "Views"],
  },
  salesforce: {
    actions: ["Opportunity rollup", "Account search", "Task create (approval)"],
    scopes: ["api", "refresh_token"],
    samplePrompts: ["Summarize Salesforce opportunities closing this month"],
    objects: ["Opportunities", "Accounts", "Leads"],
  },
  linear: {
    actions: ["List issues", "Create issue (approval)", "Cycle health"],
    scopes: ["read", "write"],
    samplePrompts: ["Show open Linear issues by priority"],
    objects: ["Issues", "Projects", "Cycles"],
  },
  ga: {
    actions: ["Sessions", "Conversions", "Channel mix"],
    scopes: ["analytics.readonly"],
    samplePrompts: [
      "Generate a weekly KPI report from HubSpot and Google Analytics",
    ],
    objects: ["Properties", "Reports"],
  },
  "google-ads": {
    actions: ["Campaign spend", "CPA", "Conversions"],
    scopes: ["adwords.readonly"],
    samplePrompts: ["Show Google Ads campaign performance and CPA this week"],
    objects: ["Campaigns", "Ad groups"],
  },
  asana: {
    actions: ["Board status", "Overdue tasks", "Assign (approval)"],
    scopes: ["default"],
    samplePrompts: ["Summarize Asana project board status and overdue tasks"],
    objects: ["Projects", "Tasks"],
  },
};

export function getIntegrationCapability(id: string): IntegrationCapability {
  const base = byId[id] ?? defaults;
  return { id, ...base };
}
