import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [{ title: "Privacy Policy · PandaOS" }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <SiteShell>
      <article className="container-narrow section-pad">
        <Link
          to="/"
          className="text-sm text-[var(--color-muted)] hover:text-[var(--color-fg)]"
        >
          ← Back
        </Link>
        <h1 className="mt-6 text-3xl font-semibold tracking-tight">
          Privacy Policy
        </h1>
        <p className="mt-4 text-sm text-[var(--color-muted)]">
          Last updated: August 9, 2026
        </p>
        <div className="mt-8 space-y-4 text-[15px] leading-relaxed text-[var(--color-muted)]">
          <p>
            PandaOS by Pandata is designed with a local-first, privacy-conscious
            posture. This policy describes how we handle information related to
            our website and product.
          </p>
          <h2 className="pt-4 text-lg font-semibold text-[var(--color-fg)]">
            Account information
          </h2>
          <p>
            When you create an account, we store the name, email, and credentials
            required to authenticate you and operate the product.
          </p>
          <h2 className="pt-4 text-lg font-semibold text-[var(--color-fg)]">
            How we use it
          </h2>
          <p>
            Account data is used to provide access, secure the product, and
            communicate operational updates. We do not sell your personal
            information.
          </p>
          <h2 className="pt-4 text-lg font-semibold text-[var(--color-fg)]">
            Product data principles
          </h2>
          <p>
            Your company data is never used for model training. You may bring
            your own API keys. Sensitive data is designed to stay within your
            controlled environment where local-first deployment is used.
          </p>
          <h2 className="pt-4 text-lg font-semibold text-[var(--color-fg)]">
            Contact
          </h2>
          <p>
            Privacy questions: contact Pandata via the channels listed on
            pandaos.ai.
          </p>
        </div>
      </article>
    </SiteShell>
  );
}
