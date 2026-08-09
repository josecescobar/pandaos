export const security = {
  meta: {
    title: "Security · PandaOS",
    description:
      "How PandaOS handles data ownership, retention, access control, and compliance roadmap including SOC 2 and DPA.",
  },
  hero: {
    title: "Security & trust",
    body: "PandaOS is built for operators who need AI that can act across systems without giving up control of company data.",
  },
  pillars: [
    {
      title: "Your data stays yours",
      body: "Customer content is never used to train public foundation models. You control what agents can read and write.",
    },
    {
      title: "Bring your own keys",
      body: "Use OpenAI, Anthropic, Gemini, or custom endpoints. Model traffic can stay under your commercial terms.",
    },
    {
      title: "Human-in-the-loop writes",
      body: "Posting, creating tickets, and sending email require approval before completion — not silent automation.",
    },
    {
      title: "Least-privilege integrations",
      body: "Connect only the apps you need. Disconnect anytime. Scope is visible in the integrations catalog.",
    },
  ],
  compliance: [
    {
      title: "SOC 2 Type II",
      status: "Roadmap",
      detail:
        "Controls mapping in progress for security, availability, and confidentiality. Target: enterprise readiness package.",
    },
    {
      title: "GDPR / DPA",
      status: "Available",
      detail:
        "Data Processing Addendum available for Team and Enterprise. Contact sales for countersigned DPA.",
    },
    {
      title: "Data residency",
      status: "Enterprise",
      detail:
        "Private / local-first deployment options for teams that require data to remain in controlled environments.",
    },
    {
      title: "SSO & audit logs",
      status: "Enterprise",
      detail:
        "SSO, role-based admin, and exportable audit trails for who ran, approved, or rejected agent actions.",
    },
  ],
  retention: [
    {
      title: "Workspace state",
      body: "Workflows, chat, and connection preferences persist in your browser session for the product shell. Export anytime as JSON.",
    },
    {
      title: "Auth sessions",
      body: "Signed-in sessions follow standard secure cookie / bearer practices for the deployment environment.",
    },
    {
      title: "Deletion",
      body: "Clear chat, disconnect apps, reset onboarding, or import a blank export to wipe local workspace state. Account deletion on request.",
    },
  ],
  contact:
    "Security questionnaires and DPA: security@pandaos.ai · Enterprise: sales@pandaos.ai",
} as const;
