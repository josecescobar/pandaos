import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Bot,
  FileBarChart2,
  FolderKanban,
  LayoutDashboard,
  LayoutTemplate,
  Plug,
  Search,
  Settings,
  Users,
  Workflow,
} from "lucide-react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useWorkspaceStore } from "@/lib/workspace-store";
import { useProjectsStore } from "@/lib/projects-store";
import { galleryTemplates } from "@/content/templates-gallery";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const send = useWorkspaceStore((s) => s.send);
  const workflows = useWorkspaceStore((s) => s.savedWorkflows);
  const runWorkflow = useWorkspaceStore((s) => s.runWorkflow);
  const projects = useProjectsStore((s) => s.projects);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function go(to: string) {
    setOpen(false);
    navigate({ to });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="hidden h-9 items-center gap-2 rounded-[var(--radius-pill)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-3 text-xs text-[var(--color-muted)] transition-colors hover:text-[var(--color-fg)] md:inline-flex"
      >
        <Search className="h-3.5 w-3.5" />
        Search
        <kbd className="rounded border border-[var(--color-border)] px-1.5 py-0.5 text-[10px] text-[var(--color-subtle)]">
          ⌘K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-fg)]">
          <CommandInput placeholder="Jump to a page, run a workflow…" />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Navigate">
              <CommandItem onSelect={() => go("/workspace")}>
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Command Center
              </CommandItem>
              <CommandItem onSelect={() => go("/templates")}>
                <LayoutTemplate className="mr-2 h-4 w-4" />
                Templates
              </CommandItem>
              <CommandItem onSelect={() => go("/projects")}>
                <FolderKanban className="mr-2 h-4 w-4" />
                Projects
              </CommandItem>
              <CommandItem onSelect={() => go("/workflows")}>
                <Workflow className="mr-2 h-4 w-4" />
                Workflows
              </CommandItem>
              <CommandItem onSelect={() => go("/team")}>
                <Users className="mr-2 h-4 w-4" />
                Team
              </CommandItem>
              <CommandItem onSelect={() => go("/agents")}>
                <Bot className="mr-2 h-4 w-4" />
                Agents
              </CommandItem>
              <CommandItem onSelect={() => go("/reports")}>
                <FileBarChart2 className="mr-2 h-4 w-4" />
                Reports
              </CommandItem>
              <CommandItem onSelect={() => go("/integrations")}>
                <Plug className="mr-2 h-4 w-4" />
                Integrations
              </CommandItem>
              <CommandItem onSelect={() => go("/settings")}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Templates">
              {galleryTemplates.slice(0, 6).map((t) => (
                <CommandItem
                  key={t.id}
                  onSelect={() => {
                    setOpen(false);
                    navigate({ to: "/workspace" });
                    send(t.prompt);
                  }}
                >
                  {t.name}
                </CommandItem>
              ))}
            </CommandGroup>
            {workflows.length ? (
              <>
                <CommandSeparator />
                <CommandGroup heading="Saved workflows">
                  {workflows.slice(0, 6).map((w) => (
                    <CommandItem
                      key={w.id}
                      onSelect={() => {
                        setOpen(false);
                        navigate({ to: "/workspace" });
                        runWorkflow(w.id);
                      }}
                    >
                      {w.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            ) : null}
            {projects.length ? (
              <>
                <CommandSeparator />
                <CommandGroup heading="Projects">
                  {projects.slice(0, 6).map((p) => (
                    <CommandItem key={p.id} onSelect={() => go("/projects")}>
                      {p.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            ) : null}
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
