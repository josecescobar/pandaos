import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-8 w-8 drop-shadow-[0_0_12px_rgba(59,130,246,0.35)]", className)}
      aria-hidden
    >
      <rect width="40" height="40" rx="10" fill="#0B1220" />
      <rect
        x="1"
        y="1"
        width="38"
        height="38"
        rx="9"
        stroke="url(#panda-ring)"
        strokeWidth="1.25"
      />
      <defs>
        <linearGradient id="panda-ring" x1="0" y1="0" x2="40" y2="40">
          <stop stopColor="#60A5FA" />
          <stop offset="1" stopColor="#3B82F6" stopOpacity="0.45" />
        </linearGradient>
      </defs>
      <path
        d="M13.5 25c0-5.2 2.9-9 6.5-9s6.5 3.8 6.5 9c0 1.6-.65 2.9-1.6 3.5-.8.5-1.8.65-2.9.65h-4c-1.1 0-2.1-.15-2.9-.65-.95-.6-1.6-1.9-1.6-3.5z"
        fill="#F4F7FB"
      />
      <circle cx="15" cy="15" r="3.4" fill="#F4F7FB" />
      <circle cx="25" cy="15" r="3.4" fill="#F4F7FB" />
      <circle cx="15.3" cy="15.3" r="1.25" fill="#0B1220" />
      <circle cx="25.3" cy="15.3" r="1.25" fill="#0B1220" />
      <ellipse cx="20" cy="23.8" rx="1.35" ry="1" fill="#0B1220" />
    </svg>
  );
}

export function Logo({
  className,
  showByline = true,
}: {
  className?: string;
  showByline?: boolean;
}) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <LogoMark />
      <div className="leading-tight">
        <div className="text-[15px] font-semibold tracking-tight text-[var(--color-fg)]">
          PandaOS
        </div>
        {showByline ? (
          <div className="text-[11px] text-[var(--color-subtle)]">
            by Pandata
          </div>
        ) : null}
      </div>
    </div>
  );
}
