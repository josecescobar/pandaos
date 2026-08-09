import { useMemo, useState } from "react";
import {
  integrationsFor,
  type Integration,
  type IntegrationTrack,
} from "@/content/integrations";
import { IntegrationMark } from "@/components/brand/integration-mark";
import { cn } from "@/lib/utils";

function IntegrationCard({
  item,
  active,
  onFocus,
  connected,
  onToggle,
  interactive,
}: {
  item: Integration;
  active: boolean;
  onFocus: () => void;
  connected?: boolean;
  onToggle?: () => void;
  interactive?: boolean;
}) {
  return (
    <button
      type="button"
      onMouseEnter={onFocus}
      onFocus={onFocus}
      onClick={interactive ? onToggle : undefined}
      className={cn(
        "group relative flex h-full w-full flex-col items-start gap-3 rounded-[1.1rem] border bg-[color-mix(in_oklab,#121826_92%,black)] p-4 text-left transition-[border-color,box-shadow,background-color,transform,opacity] duration-200",
        active || connected
          ? "z-[1] scale-[1.02] border-[var(--color-primary)] bg-[#151d2e] shadow-[0_0_0_1px_rgba(59,130,246,0.55),0_18px_50px_rgba(0,0,0,0.45)]"
          : "border-white/[0.07] opacity-80 hover:opacity-100 hover:border-white/15",
        interactive && "cursor-pointer",
      )}
    >
      <div className="flex w-full items-start justify-between gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-[12px] border border-white/10"
          style={{ backgroundColor: `${item.color}18` }}
        >
          <IntegrationMark id={item.id} />
        </div>
        <div className="flex flex-col items-end gap-1">
          {connected ? (
            <span className="rounded-[var(--radius-pill)] bg-[var(--color-accent-soft)] px-2 py-0.5 text-[10px] font-semibold text-[var(--color-primary)]">
              Connected
            </span>
          ) : null}
          <span className="rounded-[var(--radius-pill)] bg-white/5 px-2 py-0.5 text-[10px] font-medium text-[var(--color-subtle)]">
            {item.category}
          </span>
        </div>
      </div>
      <div>
        <div className="text-[15px] font-semibold tracking-tight text-[var(--color-fg)]">
          {item.name}
        </div>
        <p className="mt-1.5 line-clamp-2 text-[12px] leading-relaxed text-[var(--color-muted)]">
          {item.description}
        </p>
      </div>
    </button>
  );
}

export function IntegrationsGrid({
  track,
  className,
  limit,
  connectedIds,
  onToggle,
  interactive = false,
  ids,
}: {
  track: IntegrationTrack;
  className?: string;
  limit?: number;
  connectedIds?: Set<string> | string[];
  onToggle?: (id: string) => void;
  interactive?: boolean;
  /** Optional explicit id order (for ad-faithful showcases) */
  ids?: string[];
}) {
  const items = useMemo(() => {
    let list = integrationsFor(track);
    if (ids?.length) {
      const map = new Map(list.map((i) => [i.id, i]));
      list = ids.map((id) => map.get(id)).filter(Boolean) as Integration[];
    }
    return limit ? list.slice(0, limit) : list;
  }, [track, limit, ids]);

  const [active, setActive] = useState(items[0]?.id ?? "");
  const connected = useMemo(() => {
    if (!connectedIds) return new Set<string>();
    return connectedIds instanceof Set ? connectedIds : new Set(connectedIds);
  }, [connectedIds]);

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3",
        className,
      )}
    >
      {items.map((item) => (
        <IntegrationCard
          key={item.id}
          item={item}
          active={active === item.id}
          onFocus={() => setActive(item.id)}
          connected={connected.has(item.id)}
          interactive={interactive}
          onToggle={() => onToggle?.(item.id)}
        />
      ))}
    </div>
  );
}
