import { Link, useRouterState } from "@tanstack/react-router";
import {
  Bot,
  FileBarChart2,
  FolderKanban,
  LayoutDashboard,
  LayoutTemplate,
  Plug,
  Settings,
  Sparkles,
  Users,
  Workflow,
} from "lucide-react";
import { LogoMark } from "@/components/brand/logo";
import { UserButton } from "@/lib/auth/gates";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/workspace", label: "Command Center", icon: LayoutDashboard, exact: true },
  { to: "/projects", label: "Projects", icon: FolderKanban },
  { to: "/workflows", label: "Workflows", icon: Workflow },
  { to: "/templates", label: "Templates", icon: LayoutTemplate },
  { to: "/agents", label: "Agents", icon: Bot },
  { to: "/reports", label: "Reports", icon: FileBarChart2 },
  { to: "/team", label: "Team", icon: Users },
  { to: "/integrations", label: "Integrations", icon: Plug },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside className="flex h-full w-full flex-col border-r border-[var(--color-border)] bg-[var(--color-bg-elevated)]">
      <Link
        to="/workspace"
        onClick={onNavigate}
        className="flex items-center gap-2.5 border-b border-[var(--color-border)] px-4 py-4"
      >
        <LogoMark className="h-8 w-8" />
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold">PandaOS</div>
          <div className="truncate text-[11px] text-[var(--color-subtle)]">
            Operations workspace
          </div>
        </div>
      </Link>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {nav.map((item) => {
          const active =
            "exact" in item && item.exact
              ? pathname === item.to
              : pathname === item.to || pathname.startsWith(`${item.to}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-2.5 rounded-[var(--radius-md)] px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-[var(--color-accent-soft)] text-[var(--color-fg)]"
                  : "text-[var(--color-muted)] hover:bg-white/5 hover:text-[var(--color-fg)]",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-[var(--color-border)] p-3">
        <div className="mb-3 flex items-start gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-3 text-xs text-[var(--color-muted)]">
          <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--color-primary)]" />
          <span>Invite teammates under Team. Press ⌘K to jump.</span>
        </div>
        <UserButton />
        <Link
          to="/"
          onClick={onNavigate}
          className="mt-3 block text-center text-[11px] text-[var(--color-subtle)] hover:text-[var(--color-muted)]"
        >
          ← Marketing site
        </Link>
      </div>
    </aside>
  );
}
