import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Archive, Pause, Play, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/workspace/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useProjectsStore, type Project } from "@/lib/projects-store";
import { useWorkspaceStore } from "@/lib/workspace-store";
import { useNotificationsStore } from "@/lib/notifications-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [{ title: "Projects · PandaOS" }],
  }),
  component: ProjectsRoute,
});

const colors = ["#3B82F6", "#22D3EE", "#A78BFA", "#4ADE80", "#F59E0B", "#F472B6"];

function ProjectsRoute() {
  const { user, isPending } = useCurrentUserState();
  const projects = useProjectsStore((s) => s.projects);
  const addProject = useProjectsStore((s) => s.addProject);
  const removeProject = useProjectsStore((s) => s.removeProject);
  const setStatus = useProjectsStore((s) => s.setStatus);
  const send = useWorkspaceStore((s) => s.send);
  const pushNote = useNotificationsStore((s) => s.push);
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState(colors[0]);

  if (isPending) {
    return (
      <div className="grid min-h-dvh place-items-center bg-[var(--color-bg)]">
        <div className="h-10 w-10 animate-pulse rounded-full bg-[var(--color-surface)]" />
      </div>
    );
  }
  if (!user) return <RedirectToSignIn />;

  function create() {
    if (!name.trim()) {
      toast.error("Project name is required");
      return;
    }
    const p = addProject({ name, description, color });
    pushNote({
      title: "Project created",
      body: `${p.name} is ready in your workspace.`,
      kind: "success",
      href: "/projects",
    });
    toast.success(`Created ${p.name}`);
    setName("");
    setDescription("");
    setOpen(false);
  }

  function openInWorkspace(project: Project) {
    navigate({ to: "/workspace" });
    send(
      `Focus project “${project.name}”: ${project.description || "run key operational workflows for this project"}`,
    );
  }

  return (
    <AppShell
      title="Projects"
      actions={
        <Button size="sm" onClick={() => setOpen(true)}>
          <Plus className="h-3.5 w-3.5" />
          New
        </Button>
      }
    >
      <div className="mx-auto max-w-5xl space-y-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Projects</h2>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Group workflows, apps, and context by initiative — then open any
            project in the command center.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {projects.map((p) => (
            <div
              key={p.id}
              className="flex flex-col rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ background: p.color }}
                  />
                  <h3 className="font-semibold">{p.name}</h3>
                </div>
                <span
                  className={cn(
                    "rounded-[var(--radius-pill)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                    p.status === "active" &&
                      "bg-[var(--color-accent-soft)] text-[var(--color-primary)]",
                    p.status === "paused" &&
                      "bg-white/5 text-[var(--color-muted)]",
                    p.status === "archived" &&
                      "bg-white/5 text-[var(--color-subtle)]",
                  )}
                >
                  {p.status}
                </span>
              </div>
              <p className="mt-3 flex-1 text-sm text-[var(--color-muted)]">
                {p.description || "No description"}
              </p>
              <div className="mt-3 text-[11px] text-[var(--color-subtle)]">
                {p.apps.length
                  ? `${p.apps.length} linked apps`
                  : "No apps linked yet"}
                {" · "}
                updated {new Date(p.updatedAt).toLocaleDateString()}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button size="sm" onClick={() => openInWorkspace(p)}>
                  Open
                </Button>
                {p.status === "active" ? (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setStatus(p.id, "paused")}
                  >
                    <Pause className="h-3.5 w-3.5" />
                  </Button>
                ) : p.status === "paused" ? (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setStatus(p.id, "active")}
                  >
                    <Play className="h-3.5 w-3.5" />
                  </Button>
                ) : null}
                {p.status !== "archived" ? (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setStatus(p.id, "archived")}
                  >
                    <Archive className="h-3.5 w-3.5" />
                  </Button>
                ) : null}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    removeProject(p.id);
                    toast.success("Project removed");
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New project</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="proj-name">Name</Label>
              <Input
                id="proj-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Q3 Launch Ops"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="proj-desc">Description</Label>
              <Input
                id="proj-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional"
              />
            </div>
            <div className="grid gap-2">
              <Label>Color</Label>
              <div className="flex flex-wrap gap-2">
                {colors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={cn(
                      "h-7 w-7 rounded-full border-2",
                      color === c
                        ? "border-white"
                        : "border-transparent opacity-80",
                    )}
                    style={{ background: c }}
                    aria-label={`Color ${c}`}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" onClick={create}>
              Create project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
