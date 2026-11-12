import type { CSSProperties, ReactNode } from "react";

// Small animated pictures set inside display headings (sized in em by .glyph).
// Drawn on a 72-unit tile; motion comes from the .glyph-* classes in globals.css.

export type GlyphName = "server" | "branch" | "pulse" | "database" | "shield" | "terminal";

const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

function Tile({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 72 72" className="glyph" aria-hidden="true" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="1" width="70" height="70" rx="18" className="fill-bg-200 stroke-line-strong" strokeWidth="1.5" />
      {children}
    </svg>
  );
}

export function Glyph({ name }: { name: GlyphName }) {
  switch (name) {
    case "server":
      return (
        <Tile>
          {[15, 31, 47].map((y, i) => (
            <g key={y}>
              <rect x="15" y={y} width="42" height="11" rx="3.5" className="stroke-fg" strokeWidth="2.4" />
              <circle cx="22" cy={y + 5.5} r="2" className="glyph-led fill-ok" style={d(i * 350)} />
              <circle cx="28.5" cy={y + 5.5} r="2" className="glyph-led fill-accent" style={d(i * 350 + 700)} />
              <path d={`M38 ${y + 5.5}H50`} className="stroke-subtle" strokeWidth="2.2" />
            </g>
          ))}
        </Tile>
      );
    case "branch":
      return (
        <Tile>
          <path d="M26 14V58" className="stroke-fg" strokeWidth="2.6" />
          <path d="M26 48C26 36 46 40 46 26V20" className="glyph-trace stroke-accent" strokeWidth="2.6" pathLength={100} />
          <circle cx="26" cy="50" r="4.5" className="fill-bg-200 stroke-fg" strokeWidth="2.6" />
          <circle cx="26" cy="22" r="4.5" className="fill-bg-200 stroke-fg" strokeWidth="2.6" />
          <circle cx="46" cy="18" r="4.5" className="glyph-led fill-accent" />
        </Tile>
      );
    case "pulse":
      return (
        <Tile>
          <path d="M12 38H24L29 26L36 50L42 18L47 38H60" className="stroke-line-strong" strokeWidth="2.6" />
          <path d="M12 38H24L29 26L36 50L42 18L47 38H60" className="glyph-trace stroke-accent" strokeWidth="2.8" pathLength={100} />
        </Tile>
      );
    case "database":
      return (
        <Tile>
          <ellipse cx="36" cy="20" rx="17" ry="6" className="stroke-fg" strokeWidth="2.4" />
          <path d="M19 20V52C19 55.3 26.6 58 36 58S53 55.3 53 52V20" className="stroke-fg" strokeWidth="2.4" />
          <path d="M19 31C19 34.3 26.6 37 36 37S53 34.3 53 31" className="glyph-trace stroke-accent" strokeWidth="2.4" pathLength={100} />
          <path d="M19 42C19 45.3 26.6 48 36 48S53 45.3 53 42" className="glyph-trace stroke-accent" strokeWidth="2.4" pathLength={100} style={d(500)} />
        </Tile>
      );
    case "shield":
      return (
        <Tile>
          <path d="M36 12L55 19V35C55 47 46.5 55.5 36 60C25.5 55.5 17 47 17 35V19L36 12Z" className="stroke-fg" strokeWidth="2.4" />
          <path d="M27 36L33.5 42.5L46 29" className="glyph-trace stroke-accent" strokeWidth="3" pathLength={100} />
        </Tile>
      );
    case "terminal":
      return (
        <Tile>
          <path d="M18 26L28 36L18 46" className="stroke-fg" strokeWidth="3" />
          <path d="M33 48H52" className="glyph-led stroke-accent" strokeWidth="3.4" />
        </Tile>
      );
  }
}
