import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  GROK_PROVIDERS,
  authClient,
  authEnabled,
  signIn,
} from "@/lib/auth/client";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createServerFn } from "@tanstack/react-start";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useOnboardingStore, waitForOnboardingHydration, getPostAuthPath } from "@/lib/onboarding-store";

const seedAdmin = createServerFn({ method: "POST" }).handler(async () => {
  const { ensureAdminUser } = await import("@/lib/auth/seed-admin.server");
  await ensureAdminUser();
  return { ok: true as const };
});

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [{ title: "Sign in · PandaOS" }],
  }),
  component: Login,
});

function resolveEmail(identifier: string): string {
  const raw = identifier.trim().toLowerCase();
  if (!raw) return raw;
  if (raw === "admin") return "admin@pandaos.ai";
  if (raw === "ops") return "ops@pandaos.ai";
  if (!raw.includes("@")) return `${raw}@pandaos.ai`;
  return raw;
}

function postAuthPath(): "/onboarding" | "/workspace" {
  return getPostAuthPath();
}

function Login() {
  const navigate = useNavigate();
  const { user, isPending } = useCurrentUserState();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const hydrated = useOnboardingStore((s) => s._hydrated);

  useEffect(() => {
    void waitForOnboardingHydration();
  }, []);

  useEffect(() => {
    if (!isPending && user && hydrated) {
      navigate({ to: postAuthPath() });
    }
  }, [user, isPending, navigate, hydrated]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!authEnabled) {
      toast.error("Sign-in is disabled in this environment.");
      return;
    }
    setSubmitting(true);
    try {
      await seedAdmin();
      await waitForOnboardingHydration();
      const email = resolveEmail(username);
      const result = await authClient.signIn.email({
        email,
        password,
      });
      if (result.error) {
        toast.error(result.error.message || "Invalid username or password.");
        setSubmitting(false);
        return;
      }
      toast.success("Signed in");
      navigate({ to: postAuthPath() });
    } catch (err) {
      console.error(err);
      toast.error("Sign-in failed. Try again.");
      setSubmitting(false);
    }
  }

  if (isPending) {
    return (
      <div className="grid min-h-dvh place-items-center bg-[var(--color-bg)]">
        <div className="h-10 w-10 animate-pulse rounded-full bg-[var(--color-surface)]" />
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-[var(--color-bg)] px-5 pt-[var(--grok-banner-h,0px)]">
      <div className="w-full max-w-md rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-8 shadow-[var(--shadow-card)]">
        <div className="mb-6 flex justify-center">
          <Logo />
        </div>
        <h1 className="text-center text-xl font-semibold">Sign in to PandaOS</h1>
        <p className="mt-2 text-center text-sm text-[var(--color-muted)]">
          New sessions start with a 60-second onboarding.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        <p className="mt-4 text-center text-[11px] text-[var(--color-subtle)]">
          admin / admin123 · ops / ops12345
        </p>

        {authEnabled && GROK_PROVIDERS.length ? (
          <div className="mt-6 space-y-2 border-t border-[var(--color-border)] pt-6">
            {GROK_PROVIDERS.map((p) => (
              <Button
                key={p.providerId}
                type="button"
                variant="secondary"
                className="w-full"
                onClick={() => void signIn(p.providerId)}
              >
                Continue with {p.label}
              </Button>
            ))}
          </div>
        ) : null}

        <p className="mt-6 text-center text-xs text-[var(--color-muted)]">
          <Link to="/" className="underline-offset-4 hover:underline">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
