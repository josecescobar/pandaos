import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function Checklist({
  items,
  className,
}: {
  items: readonly string[];
  className?: string;
}) {
  return (
    <ul className={cn("grid gap-3", className)}>
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 text-[var(--color-fg)]">
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-[6px] bg-[var(--color-success)] text-white">
            <Check className="h-3.5 w-3.5" strokeWidth={3} />
          </span>
          <span className="text-[15px] leading-snug">{item}</span>
        </li>
      ))}
    </ul>
  );
}
