import { Link, useRouterState } from "@tanstack/react-router";
import {
  Bot,
  LayoutDashboard,
  Plug,
  Users,
  Workflow,
} from "lucide-react";
import { useWorkspaceStore } from "@/lib/workspace-store";
import { cn } from "@/lib/utils";

const items = [
  { to: "/workspace", label: "Home", icon: LayoutDashboard, exact: true },
  { to: "/workflows", label: "Flows", icon: Workflow },
  { to: "/agents", label: "Agents", icon: Bot },
  { to: "/integrations", label: "Apps", icon: Plug },
  { to: "/team", label: "Team", icon: Users },
] as const;

export function MobileBottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const pending = useWorkspaceStore(
    (s) => s.pendingApprovals.filter((a) => a.status === "pending").length,
  );

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--color-border)] bg-[color-mix(in_oklab,var(--color-bg-elevated)_96%,transparent)] pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden"
      aria-label="Primary"
    >
      <ul className="mx-auto grid max-w-lg grid-cols-5 gap-0 px-1 pt-1">
        {items.map((item) => {
          const active =
            "exact" in item && item.exact
              ? pathname === item.to
              : pathname === item.to || pathname.startsWith(`${item.to}/`);
          const Icon = item.icon;
          const showBadge = item.to === "/workspace" && pending > 0;
          return (
            <li key={item.to}>
              <Link
                to={item.to}
                className={cn(
                  "relative flex min-h-[56px] flex-col items-center justify-center gap-0.5 rounded-[var(--radius-md)] px-1 py-1.5 text-[10px] font-semibold transition-colors",
                  active
                    ? "text-[var(--color-primary)]"
                    : "text-[var(--color-subtle)] active:bg-white/5",
                )}
              >
                <span className="relative">
                  <Icon
                    className={cn(
                      "h-5 w-5",
                      active && "stroke-[2.25px]",
                    )}
                  />
                  {showBadge ? (
                    <span className="absolute -right-2 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-[var(--color-primary)] px-1 text-[9px] font-bold text-white">
                      {pending > 9 ? "9+" : pending}
                    </span>
                  ) : null}
                </span>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
