export const builders = {
  meta: {
    title: "PandaOS — Command Center for the Department of One",
    description:
      "When you are the founder, PM, builder, and support team, the problem is not just workload — it is fragmentation. One AI command center for code, email, deploy, and automation.",
  },
  hero: {
    title: "The First Command Center",
    titleAccent: "For the “Department of One”",
    titleEnd: "",
    bodyLead:
      "When you are the founder, PM, builder, and support team, the problem is not just workload. It is fragmentation.",
    body: "PandaOS gives you one command center for the messy middle of modern work: inbox, browser, code, terminal, deployments, and follow-up — all connected by AI that can actually act.",
    cta: "Sign in",
    pills: ["Code", "Email", "Deploy", "Automation"] as const,
    checklist: [
      "Replace app juggling with one execution layer",
      "Stay in flow across tasks that usually live in separate tools",
      "Watch agents work and step in anytime",
      "Keep control while moving much faster",
    ],
  },
  agents: [
    {
      tag: "A",
      name: "/claude-api",
      body: "Build apps with the Claude API or Anthropic SDK, TRIGGER with code",
      color: "#3B82F6",
    },
    {
      tag: "B",
      name: "/database-optimizes",
      body: "Optimizes database queries and improves performance…",
      color: "#A78BFA",
    },
    {
      tag: "C",
      name: "/devops-engineer",
      body: "Create Dockerfiles, configures CI/CD pipelines, writes Kubern…",
      color: "#22D3EE",
    },
    {
      tag: "D",
      name: "/code-documenter",
      body: "Generates, formats, and validates technical documentation — including",
      color: "#4ADE80",
    },
    {
      tag: "E",
      name: "/create-adaptive-composable",
      body: "Create a library-grade Vue composable that accepts maybe-reactive",
      color: "#C084FC",
    },
  ],
  agency: {
    title: "Ship Like a",
    titleAccent: "100-Person Agency.",
    titleEnd: "Work Like a Solo Founder.",
    body: "PandaOS is for builders doing the work of multiple people at once. Run multi-step workflows across multiple projects from one AI workstation — without a giant stack of disconnected tools.",
    checklist: [
      "Manage more projects without losing track",
      "Automate repetitive execution across your stack",
      "Keep everything visible and controllable in one workspace",
      "Increase output without adding headcount",
    ],
  },
  vibe: {
    title: "Vibe Coding Is Easy.",
    titleAccent: "Vibe Operating Is the Bottleneck.",
    sub: "Build · Test · Fix · Deploy · Reply",
    body: "PandaOS is built for everything around the build: checking the browser, querying data, running commands, updating environments, deploying changes, and replying to the client — all from one desktop.",
    checklist: [
      "Go from request to fix without losing context",
      "Keep the browser, terminal, code, and deploy flow in one place",
      "Reduce the operational drag around shipping",
      'Move faster from "it works" to "it\'s live"',
    ],
  },
  features: {
    title: "Everything in one place",
    items: [
      {
        title: "A better interface for modern work",
        body: "Stop forcing terminals and scattered tabs. A beautiful environment for modern building.",
      },
      {
        title: "Multi-project orchestration",
        body: "Manage repos, projects, and scripts simultaneously without losing terminal, browser, or agent state.",
      },
      {
        title: "Reusable agent workflows",
        body: "Save the way you work so recurring tasks and agent setups run faster every time.",
      },
      {
        title: "Persistent project memory",
        body: "A local knowledge graph that learns your infra and workflows so you never re-explain your stack.",
      },
      {
        title: "AI-native dev environment",
        body: "Code, edit, and debug with an LLM that has full context — not just the open file.",
      },
      {
        title: "Connected app ecosystem",
        body: "Let AI work across GitHub, Vercel, email, Supabase, Slack, and deploy flows.",
      },
    ],
  },
  integrations: {
    title: "Your tools, finally working together",
    body: "Connect Supabase, Vercel, GitHub, Gmail, and the rest of your builder stack into one AI operating environment.",
  },
  cta: {
    title: "Open your command center",
    body: "Sign in and run Code · Email · Deploy · Automation from one place — no waitlist.",
    cta: "Sign in",
  },
} as const;
