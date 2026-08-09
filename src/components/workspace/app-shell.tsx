import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { AppSidebar } from "@/components/workspace/app-sidebar";
import { CommandPalette } from "@/components/workspace/command-palette";
import { MobileBottomNav } from "@/components/workspace/mobile-bottom-nav";
import { NotificationsBell } from "@/components/workspace/notifications-bell";
import { ScheduleRunner } from "@/components/workspace/schedule-runner";
import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/brand/logo";

export function AppShell({
  children,
  title,
  actions,
}: {
  children: ReactNode;
  title?: string;
  actions?: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-dvh overflow-x-hidden bg-[var(--color-bg)] pt-[var(--grok-banner-h,0px)]">
      <ScheduleRunner />
      <div className="hidden w-60 shrink-0 lg:block">
        <div className="sticky top-[var(--grok-banner-h,0px)] h-[calc(100dvh-var(--grok-banner-h,0px))]">
          <AppSidebar />
        </div>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/60"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-[min(18rem,88vw)] shadow-2xl">
            <AppSidebar onNavigate={() => setOpen(false)} />
          </div>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col overflow-x-hidden">
        <header className="sticky top-[var(--grok-banner-h,0px)] z-30 flex h-14 items-center justify-between gap-3 border-b border-[var(--color-border)] bg-[color-mix(in_oklab,var(--color-bg)_90%,transparent)] px-3 backdrop-blur-xl sm:px-4 lg:px-6">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-11 w-11 shrink-0 lg:hidden"
              aria-label="Open menu"
              onClick={() => setOpen(true)}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <Link to="/workspace" className="flex items-center gap-2 lg:hidden">
              <LogoMark className="h-7 w-7" />
            </Link>
            {title ? (
              <h1 className="truncate text-sm font-semibold tracking-tight sm:text-base">
                {title}
              </h1>
            ) : null}
          </div>
          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <CommandPalette />
            <NotificationsBell />
            <div className="hidden items-center gap-2 sm:flex">{actions}</div>
          </div>
        </header>
        <main className="min-w-0 flex-1 p-3 pb-24 sm:p-6 sm:pb-6 lg:pb-6">
          {children}
        </main>
        <MobileBottomNav />
      </div>
    </div>
  );
}
