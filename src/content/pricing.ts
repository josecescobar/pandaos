export const pricing = {
  title: "Pricing that beats another headcount",
  body: "Most teams compare PandaOS to hiring ops help or duct-taping five tools. Start free, upgrade when the whole team lives here.",
  contrast: {
    title: "The real alternative isn’t another chat tab",
    items: [
      {
        label: "Junior ops hire",
        price: "$4,500+/mo",
        note: "Onboarding, management, one timezone",
      },
      {
        label: "Zapier + 5 tools + ChatGPT",
        price: "$200–600/mo",
        note: "Still fragmented · no shared command center",
      },
      {
        label: "PandaOS Pro",
        price: "$49/seat",
        note: "One OS for CRM, docs, email, data, workflows",
        highlight: true,
      },
    ],
  },
  plans: [
    {
      id: "free",
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Prove it on your real stack in an afternoon.",
      cta: "Start free",
      featured: false,
      features: [
        "Up to 5 connected apps",
        "Command center + core workflows",
        "3 saved workflows",
        "Template gallery access",
        "Community support",
      ],
    },
    {
      id: "pro",
      name: "Pro",
      price: "$49",
      period: "per seat / mo",
      description: "For operators running daily cross-app workflows.",
      cta: "Start Pro",
      featured: true,
      features: [
        "Unlimited connected apps",
        "Unlimited saved + scheduled workflows",
        "Reports export + notifications",
        "BYOK model keys",
        "Priority support",
      ],
    },
    {
      id: "team",
      name: "Team",
      price: "$79",
      period: "per seat / mo",
      description: "Shared workspace for RevOps, support, and founders.",
      cta: "Start Team",
      featured: false,
      features: [
        "Everything in Pro",
        "Shared projects & team activity",
        "Invite seats & roles",
        "Admin controls",
        "Onboarding playbooks",
      ],
    },
  ],
  enterpriseNote:
    "Need SSO, private deploy, or a custom DPA? Contact sales — Enterprise is available annually.",
} as const;
