import { useEffect, useState } from "react";
import { Play, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const scenes = [
  {
    id: "connect",
    title: "Connect your stack",
    body: "HubSpot, Slack, Notion, Gmail — one rail of apps the agent can actually use.",
    visual: "connect",
  },
  {
    id: "run",
    title: "Run a multi-step workflow",
    body: "Pipeline → Notion doc → Slack brief → email draft in a single command.",
    visual: "run",
  },
  {
    id: "approve",
    title: "Approve before it ships",
    body: "Write actions pause for one-click approval. You keep control.",
    visual: "approve",
  },
  {
    id: "schedule",
    title: "Schedule & share",
    body: "Save workflows, set daily/weekly cadence, export reports for the team.",
    visual: "schedule",
  },
] as const;

function SceneVisual({ kind }: { kind: (typeof scenes)[number]["visual"] }) {
  if (kind === "connect") {
    return (
      <div className="grid grid-cols-3 gap-2 p-4">
        {["HubSpot", "Slack", "Notion", "Gmail", "Jira", "Stripe"].map((n) => (
          <div
            key={n}
            className="rounded-[var(--radius-lg)] border border-[var(--color-primary)]/40 bg-[var(--color-accent-soft)]/40 px-2 py-3 text-center text-[11px] font-semibold"
          >
            {n}
            <div className="mt-1 text-[10px] text-[var(--color-primary)]">
              Connected
            </div>
          </div>
        ))}
      </div>
    );
  }
  if (kind === "run") {
    return (
      <div className="space-y-2 p-4">
        {["Pull HubSpot pipeline", "Update Notion doc", "Draft Slack brief"].map(
          (s, i) => (
            <div
              key={s}
              className="flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-xs"
            >
              <span className="grid h-5 w-5 place-items-center rounded-full bg-[var(--color-primary)] text-[10px] font-bold text-white">
                {i + 1}
              </span>
              {s}
              <span className="ml-auto text-[var(--color-primary)]">✓</span>
            </div>
          ),
        )}
      </div>
    );
  }
  if (kind === "approve") {
    return (
      <div className="flex flex-col items-center justify-center gap-3 p-6">
        <div className="w-full rounded-[var(--radius-xl)] border border-[var(--color-primary)]/50 bg-[var(--color-accent-soft)]/30 p-4 text-center">
          <div className="text-sm font-semibold">Post summary to #revops</div>
          <div className="mt-1 text-xs text-[var(--color-muted)]">
            Slack · needs approval
          </div>
          <div className="mt-4 flex justify-center gap-2">
            <span className="rounded-[var(--radius-pill)] bg-[var(--color-primary)] px-4 py-1.5 text-xs font-semibold text-white">
              Approve
            </span>
            <span className="rounded-[var(--radius-pill)] border border-[var(--color-border)] px-4 py-1.5 text-xs font-semibold">
              Reject
            </span>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-3 p-4">
      <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-3 text-xs">
        <div className="font-semibold">Weekly HubSpot pipeline</div>
        <div className="mt-1 text-[var(--color-muted)]">
          Schedule · daily · next run armed
        </div>
      </div>
      <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-3 text-xs">
        <div className="font-semibold">Report exported</div>
        <div className="mt-1 text-[var(--color-muted)]">
          pipeline-summary.csv · shared with team
        </div>
      </div>
    </div>
  );
}

export function ProductTourButton({
  className,
  size = "lg",
  variant = "secondary",
}: {
  className?: string;
  size?: "default" | "sm" | "lg";
  variant?: "default" | "secondary" | "ghost";
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        size={size}
        variant={variant}
        className={className}
        onClick={() => setOpen(true)}
      >
        <Play className="h-4 w-4" />
        Watch product tour
      </Button>
      {open ? <ProductTourModal onClose={() => setOpen(false)} /> : null}
    </>
  );
}

export function ProductTourModal({ onClose }: { onClose: () => void }) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    if (!playing) return;
    const t = window.setInterval(() => {
      setIndex((i) => (i + 1) % scenes.length);
    }, 3200);
    return () => window.clearInterval(t);
  }, [playing]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") {
        setPlaying(false);
        setIndex((i) => (i + 1) % scenes.length);
      }
      if (e.key === "ArrowLeft") {
        setPlaying(false);
        setIndex((i) => (i - 1 + scenes.length) % scenes.length);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const scene = scenes[index];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        aria-label="Close tour"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal
        aria-label="Product tour"
        className="relative z-10 w-full max-w-2xl overflow-hidden rounded-[1.25rem] border border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)] shadow-[0_30px_80px_rgba(0,0,0,0.55)]"
      >
        <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-3">
          <div className="text-sm font-semibold">PandaOS product tour</div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-full text-[var(--color-muted)] hover:bg-white/5 hover:text-[var(--color-fg)]"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="aspect-video border-b border-[var(--color-border)] bg-[#05070f]">
          <div className="flex h-full flex-col">
            <div className="flex items-center gap-2 border-b border-white/5 px-4 py-2 text-[11px] text-[var(--color-subtle)]">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--color-primary)]" />
              Live demo · Scene {index + 1}/{scenes.length}
            </div>
            <div className="min-h-0 flex-1">
              <SceneVisual kind={scene.visual} />
            </div>
          </div>
        </div>

        <div className="p-5">
          <h3 className="text-lg font-semibold">{scene.title}</h3>
          <p className="mt-2 text-sm text-[var(--color-muted)]">{scene.body}</p>

          <div className="mt-4 flex gap-1.5">
            {scenes.map((s, i) => (
              <button
                key={s.id}
                type="button"
                aria-label={`Scene ${i + 1}`}
                onClick={() => {
                  setPlaying(false);
                  setIndex(i);
                }}
                className={cn(
                  "h-1.5 flex-1 rounded-full transition-colors",
                  i === index
                    ? "bg-[var(--color-primary)]"
                    : "bg-white/15 hover:bg-white/25",
                )}
              />
            ))}
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setPlaying((p) => !p)}
            >
              {playing ? "Pause" : "Play"}
            </Button>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  setPlaying(false);
                  setIndex((i) => (i - 1 + scenes.length) % scenes.length);
                }}
              >
                Back
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  if (index === scenes.length - 1) {
                    onClose();
                    return;
                  }
                  setPlaying(false);
                  setIndex((i) => i + 1);
                }}
              >
                {index === scenes.length - 1 ? "Done" : "Next"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
