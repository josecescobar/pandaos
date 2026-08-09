import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [{ title: "Terms of Service · PandaOS" }],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <SiteShell>
      <article className="container-narrow section-pad prose-invert">
        <Link
          to="/"
          className="text-sm text-[var(--color-muted)] hover:text-[var(--color-fg)]"
        >
          ← Back
        </Link>
        <h1 className="mt-6 text-3xl font-semibold tracking-tight">
          Terms of Service
        </h1>
        <p className="mt-4 text-sm text-[var(--color-muted)]">
          Last updated: August 9, 2026
        </p>
        <div className="mt-8 space-y-4 text-[15px] leading-relaxed text-[var(--color-muted)]">
          <p>
            These Terms of Service govern your access to and use of PandaOS by
            Pandata, including our websites and product workspace.
          </p>
          <p>
            By creating an account or using PandaOS, you agree to these terms.
            If you do not agree, do not use the service.
          </p>
          <h2 className="pt-4 text-lg font-semibold text-[var(--color-fg)]">
            Accounts
          </h2>
          <p>
            You are responsible for safeguarding your credentials and for
            activity under your account. Notify us promptly of any unauthorized
            use.
          </p>
          <h2 className="pt-4 text-lg font-semibold text-[var(--color-fg)]">
            Acceptable use
          </h2>
          <p>
            You will not misuse the service, attempt unauthorized access, or use
            PandaOS in violation of applicable law or third-party terms for
            connected tools.
          </p>
          <h2 className="pt-4 text-lg font-semibold text-[var(--color-fg)]">
            Contact
          </h2>
          <p>
            Questions about these terms: contact Pandata via the channels listed
            on pandaos.ai.
          </p>
        </div>
      </article>
    </SiteShell>
  );
}
