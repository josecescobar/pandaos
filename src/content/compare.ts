export const compare = {
  meta: {
    title: "PandaOS vs Lindy, Zapier Agents & ChatGPT · Compare",
    description:
      "See how PandaOS compares to Lindy, Zapier Agents, and plain ChatGPT for business operations and builders.",
  },
  hero: {
    title: "Not another chat tab.",
    titleAccent: "An operations OS.",
    body: "Lindy optimizes for an executive assistant. Zapier Agents optimize for app automation. ChatGPT optimizes for answers. PandaOS is the command center that runs workflows across your stack with human approvals.",
  },
  columns: [
    { id: "pandaos", name: "PandaOS", highlight: true },
    { id: "lindy", name: "Lindy" },
    { id: "zapier", name: "Zapier Agents" },
    { id: "chatgpt", name: "ChatGPT" },
  ] as const,
  rows: [
    {
      feature: "Primary job",
      pandaos: "Cross-app command center",
      lindy: "AI executive assistant",
      zapier: "AI teammates on zaps",
      chatgpt: "General Q&A + tools",
    },
    {
      feature: "CRM + docs + email + data in one run",
      pandaos: "Yes — designed for it",
      lindy: "Partial (EA workflows)",
      zapier: "Via app actions",
      chatgpt: "Manual / plugins",
    },
    {
      feature: "Human approval before writes",
      pandaos: "Built-in gates",
      lindy: "Varies",
      zapier: "Workflow design",
      chatgpt: "You copy-paste",
    },
    {
      feature: "Reusable + scheduled workflows",
      pandaos: "Yes",
      lindy: "Templates / agents",
      zapier: "Strong",
      chatgpt: "Limited",
    },
    {
      feature: "Template gallery with sample output",
      pandaos: "Yes",
      lindy: "Task-focused",
      zapier: "Agent templates",
      chatgpt: "GPTs / prompts",
    },
    {
      feature: "Team workspace + activity",
      pandaos: "Yes",
      lindy: "Team plans",
      zapier: "Strong",
      chatgpt: "Workspace plans",
    },
    {
      feature: "Builder track (code → deploy → reply)",
      pandaos: "First-class",
      lindy: "No",
      zapier: "Limited",
      chatgpt: "Coding help only",
    },
    {
      feature: "BYOK / model choice",
      pandaos: "Yes",
      lindy: "Product-managed",
      zapier: "Product-managed",
      chatgpt: "OpenAI stack",
    },
    {
      feature: "Local-first / private deploy path",
      pandaos: "Yes (enterprise)",
      lindy: "SaaS",
      zapier: "SaaS",
      chatgpt: "SaaS",
    },
    {
      feature: "Best for",
      pandaos: "Ops + DoO founders",
      lindy: "Inbox & calendar",
      zapier: "App automations",
      chatgpt: "Ad-hoc reasoning",
    },
  ],
  takeaways: [
    {
      title: "Choose Lindy if…",
      body: "You mainly want an EA for email, meetings, and personal admin.",
    },
    {
      title: "Choose Zapier Agents if…",
      body: "You already live in Zapier and want AI nodes across 9,000 apps.",
    },
    {
      title: "Choose ChatGPT if…",
      body: "You need flexible reasoning and are fine orchestrating tools yourself.",
    },
    {
      title: "Choose PandaOS if…",
      body: "You need one command center for CRM, tickets, docs, data, and deploys — with approvals, schedules, and team ops.",
    },
  ],
} as const;
