export type AgentDef = {
  id: string;
  tag: string;
  name: string;
  title: string;
  body: string;
  color: string;
  track: "business" | "builders";
  goals: string[];
  tools: string[];
  prompt: string;
  defaultEnabled?: boolean;
};

export const agentsCatalog: AgentDef[] = [
  {
    id: "revops-digest",
    tag: "R",
    name: "/revops-digest",
    title: "RevOps Digest",
    body: "Pulls HubSpot pipeline + GA sessions into a leadership-ready weekly digest.",
    color: "#3B82F6",
    track: "business",
    goals: [
      "Summarize closed-won and pipeline health",
      "Surface KPI deltas week-over-week",
      "Prepare leadership-ready narrative",
    ],
    tools: ["hubspot", "ga", "notion", "slack"],
    prompt: "Generate a weekly KPI report from HubSpot and Google Analytics",
    defaultEnabled: true,
  },
  {
    id: "support-triage",
    tag: "S",
    name: "/support-triage",
    title: "Support Triage",
    body: "Turns open support emails into prioritized Jira issues and Slack alerts.",
    color: "#A78BFA",
    track: "business",
    goals: [
      "Scan inbox for actionable support threads",
      "Draft Jira issues with priority",
      "Notify #support when ready",
    ],
    tools: ["gmail", "jira", "slack"],
    prompt:
      "Turn open support emails into Jira tasks and list what you would create",
    defaultEnabled: true,
  },
  {
    id: "pipeline-watch",
    tag: "P",
    name: "/pipeline-watch",
    title: "Pipeline Watch",
    body: "Summarizes deal stages, flags stalled opportunities, posts to #revops.",
    color: "#22D3EE",
    track: "business",
    goals: [
      "Stage-by-stage deal snapshot",
      "Flag negotiation risks",
      "Brief #revops",
    ],
    tools: ["hubspot", "slack", "notion"],
    prompt: "Summarize this week's HubSpot pipeline by stage and owner",
    defaultEnabled: true,
  },
  {
    id: "leadership-brief",
    tag: "L",
    name: "/leadership-brief",
    title: "Leadership Brief",
    body: "Prioritizes inbox threads and calendar asks for Monday standup.",
    color: "#4ADE80",
    track: "business",
    goals: [
      "Rank leadership-critical threads",
      "Capture asks and urgency",
      "Post standup brief",
    ],
    tools: ["gmail", "outlook", "slack", "google-calendar"],
    prompt:
      "Summarize leadership-critical items from Outlook/Gmail for Monday standup",
    defaultEnabled: true,
  },
  {
    id: "claude-api",
    tag: "A",
    name: "/claude-api",
    title: "Claude API Builder",
    body: "Build apps with the Claude API or Anthropic SDK, TRIGGER with code.",
    color: "#3B82F6",
    track: "builders",
    goals: ["Scaffold API clients", "Wire auth", "Document integration points"],
    tools: ["github", "vercel", "postgresql"],
    prompt: "Show GitHub delivery pulse across open PRs and CI",
    defaultEnabled: true,
  },
  {
    id: "database-optimizes",
    tag: "B",
    name: "/database-optimizes",
    title: "Database Optimizer",
    body: "Optimizes database queries and improves performance.",
    color: "#A78BFA",
    track: "builders",
    goals: ["Find slow queries", "Suggest indexes", "Report query cost"],
    tools: ["postgresql", "supabase", "snowflake"],
    prompt:
      "Show me the top 10 products by revenue, broken down by brand and category",
    defaultEnabled: true,
  },
  {
    id: "devops-engineer",
    tag: "C",
    name: "/devops-engineer",
    title: "DevOps Engineer",
    body: "Create Dockerfiles, configures CI/CD pipelines, writes Kubernetes manifests.",
    color: "#22D3EE",
    track: "builders",
    goals: ["CI green checks", "Deploy readiness", "Rollback paths"],
    tools: ["github", "vercel", "docker", "aws"],
    prompt: "Show GitHub delivery pulse across open PRs and CI",
    defaultEnabled: true,
  },
  {
    id: "code-documenter",
    tag: "D",
    name: "/code-documenter",
    title: "Code Documenter",
    body: "Generates, formats, and validates technical documentation.",
    color: "#4ADE80",
    track: "builders",
    goals: ["API docs", "Runbooks", "Changelog drafts"],
    tools: ["github", "notion", "confluence"],
    prompt: "Summarize this week's HubSpot pipeline by stage and owner",
    defaultEnabled: false,
  },
];

export function getAgent(id: string) {
  return agentsCatalog.find((a) => a.id === id);
}
