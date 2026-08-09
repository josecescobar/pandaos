import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/brand/logo";
import { SignInButton } from "@/components/brand/sign-in-button";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { cn } from "@/lib/utils";

const marketingLinks = [
  {
    to: "/",
    label: "Business",
    match: (p: string) => p === "/" || p === "/business",
  },
  {
    to: "/builders",
    label: "Builders",
    match: (p: string) => p.startsWith("/builders"),
  },
  {
    to: "/templates",
    label: "Templates",
    match: (p: string) => p.startsWith("/templates"),
  },
  {
    to: "/compare",
    label: "Compare",
    match: (p: string) => p.startsWith("/compare"),
  },
  {
    to: "/security",
    label: "Security",
    match: (p: string) => p.startsWith("/security"),
  },
  {
    to: "/pricing",
    label: "Pricing",
    match: (p: string) => p.startsWith("/pricing") || p.startsWith("/checkout"),
  },
  {
    to: "/changelog",
    label: "Changelog",
    match: (p: string) => p.startsWith("/changelog"),
  },
] as const;

function AuthControls({ mobile = false }: { mobile?: boolean }) {
  const { user, isPending } = useCurrentUserState();

  if (isPending) {
    return (
      <div
        className={cn(
          "animate-pulse rounded-[var(--radius-pill)] bg-white/10",
          mobile ? "h-11 w-full" : "h-9 w-24",
        )}
      />
    );
  }

  return (
    <>
      <SignedOut>
        <SignInButton
          size={mobile ? "default" : "sm"}
          className={mobile ? "w-full" : undefined}
        >
          Sign in
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <div
          className={cn(
            "flex flex-wrap items-center gap-2",
            mobile &&
              "w-full justify-between rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 py-2",
          )}
        >
          <Button
            asChild
            size={mobile ? "default" : "sm"}
            className={mobile ? "w-full" : undefined}
          >
            <Link to="/workspace">Open app</Link>
          </Button>
          {!mobile ? <UserButton /> : null}
          {mobile && user ? (
            <span className="w-full text-center text-xs text-[var(--color-muted)]">
              {user.displayName ?? user.primaryEmail}
            </span>
          ) : null}
        </div>
      </SignedIn>
    </>
  );
}

export function SiteNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[color-mix(in_oklab,var(--color-bg)_88%,transparent)] backdrop-blur-xl pt-[var(--grok-banner-h,0px)]">
      <div className="container-site flex h-16 items-center justify-between gap-4 px-5">
        <Link to="/" className="shrink-0" onClick={() => setOpen(false)}>
          <Logo />
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex">
          {marketingLinks.map((l) => {
            const active = l.match(pathname);
            return (
              <Link
                key={l.to}
                to={l.to}
                className={cn(
                  "rounded-[var(--radius-pill)] px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-white/8 text-[var(--color-fg)]"
                    : "text-[var(--color-muted)] hover:text-[var(--color-fg)]",
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <AuthControls />
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {open ? (
        <div className="border-t border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-5 py-4 md:hidden">
          <div className="flex flex-col gap-2">
            {marketingLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-[var(--radius-md)] px-3 py-3 text-sm font-medium",
                  l.match(pathname)
                    ? "bg-white/8 text-[var(--color-fg)]"
                    : "text-[var(--color-muted)]",
                )}
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-2" onClick={() => setOpen(false)}>
              <AuthControls mobile />
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
