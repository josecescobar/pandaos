export const changelog = {
  meta: {
    title: "Changelog & roadmap · PandaOS",
    description:
      "What shipped in PandaOS and what’s next on the public roadmap.",
  },
  hero: {
    title: "Changelog & roadmap",
    body: "Transparent product progress — shipped features, design partners, and what’s next for the AI command center.",
  },
  shipped: [
    {
      version: "0.9",
      date: "Aug 2026",
      title: "Polish, OAuth flow & billing",
      items: [
        "OAuth-style connect wizard with scopes and account binding",
        "Checkout for Free / Pro / Team with invoices",
        "Product tour, deeper integration details, brand marks",
        "Import/export workspace JSON",
      ],
    },
    {
      version: "0.8",
      date: "Aug 2026",
      title: "Trust & growth surfaces",
      items: [
        "Security trust center + SOC 2 roadmap",
        "Compare page vs Lindy, Zapier Agents, ChatGPT",
        "Design partner social proof",
        "Mobile bottom nav and larger touch targets",
      ],
    },
    {
      version: "0.7",
      date: "Aug 2026",
      title: "Enterprise-depth ops",
      items: [
        "Approval gates for write actions",
        "Scheduled workflow runs while app is open",
        "Agent detail pages with goals, tools, history",
        "Team invites and activity feed",
      ],
    },
    {
      version: "0.6",
      date: "Aug 2026",
      title: "First 60 seconds",
      items: [
        "Role-based onboarding",
        "Public template gallery",
        "Command center + 40+ integrations catalog",
        "Admin access (no waitlist)",
      ],
    },
  ],
  roadmap: [
    {
      status: "Now",
      color: "text-[var(--color-primary)] bg-[var(--color-accent-soft)]",
      items: [
        "Production OAuth with real provider apps (HubSpot, Google, Slack)",
        "Stripe Billing live mode for seats",
        "Audit log export for approvals",
      ],
    },
    {
      status: "Next",
      color: "text-amber-300 bg-amber-500/10",
      items: [
        "SOC 2 Type II controls package",
        "SSO (SAML/OIDC) for Team+",
        "Background schedule workers (server-side)",
      ],
    },
    {
      status: "Later",
      color: "text-violet-300 bg-violet-500/10",
      items: [
        "Private / local-first deploy images",
        "Custom agent builder UI",
        "Marketplace of partner templates",
      ],
    },
  ],
} as const;
