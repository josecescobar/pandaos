import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/brand/logo";

const links = [
  { to: "/", label: "Business" },
  { to: "/builders", label: "Builders" },
  { to: "/templates", label: "Templates" },
  { to: "/compare", label: "Compare" },
  { to: "/security", label: "Security" },
  { to: "/pricing", label: "Pricing" },
  { to: "/changelog", label: "Changelog" },
  { to: "/login", label: "Sign in" },
  { to: "/terms", label: "Terms" },
  { to: "/privacy", label: "Privacy" },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[#0a1424]">
      <div className="container-site flex flex-col items-center justify-between gap-6 px-5 py-12 sm:flex-row">
        <Logo />
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-[var(--color-muted)]">
          <span className="text-[var(--color-subtle)]">PandaOS by Pandata</span>
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="underline-offset-4 hover:text-[var(--color-fg)] hover:underline"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
