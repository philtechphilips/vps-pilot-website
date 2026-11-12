import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * A display heading set line by line; each line rises out of its own mask.
 * `load` plays it on page load (the hero), otherwise when it scrolls into view.
 */
export function Display({ as: Tag = "h2", lines, className, load }: { as?: "h1" | "h2"; lines: ReactNode[]; className?: string; load?: boolean }) {
  return (
    <Tag className={cn("display", className)} {...(load ? { "data-play": "load" } : { "data-reveal": "lines" })}>
      {lines.map((line, i) => (
        <span key={i} className="line">
          <span style={{ "--d": `${i * 90}ms` } as CSSProperties}>{line}</span>
        </span>
      ))}
    </Tag>
  );
}

/** The one monospace word of a display heading, with a blinking cursor after it. */
export function Mono({ children, caret }: { children: ReactNode; caret?: boolean }) {
  return <span className={cn("accent-mono", caret && "caret")}>{children}</span>;
}

/** Small uppercase monospace label. */
export function Label({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn("font-mono text-[11px] tracking-[0.14em] text-subtle uppercase", className)}>{children}</p>;
}
