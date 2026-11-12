import type { CSSProperties, ReactNode } from "react";

// Illustrations for the deploy tabs, drawn on a 640×480 stage. Each one is
// remounted when its tab opens, so its CSS delays and SMIL timeline replay.

const show = (ms: number, dur = 500): CSSProperties => ({ animation: `show ${dur}ms ease both`, animationDelay: `${ms}ms` });
const hide = (ms: number, dur = 400): CSSProperties => ({ animation: `fade-out ${dur}ms ease both`, animationDelay: `${ms}ms` });
const dim = (ms: number): CSSProperties => ({ animation: "dim 600ms ease both", animationDelay: `${ms}ms` });
const draw = (ms: number): CSSProperties => ({ "--d": `${ms}ms` }) as CSSProperties;

/** Dot grid and accent glow behind every illustration, fading out at the edges. */
function Stage({ id, glow, children }: { id: string; glow: [number, number]; children: ReactNode }) {
  return (
    <svg viewBox="0 0 640 480" className="h-auto w-full" fill="none" aria-hidden="true">
      <defs>
        <pattern id={`${id}-dots`} width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="10" cy="10" r="1" className="fill-ink" opacity="0.13" />
        </pattern>
        <radialGradient id={`${id}-fade`}>
          <stop offset="0.3" stopColor="white" />
          <stop offset="1" stopColor="black" />
        </radialGradient>
        <mask id={`${id}-mask`} maskUnits="userSpaceOnUse" x="0" y="0" width="640" height="480">
          <rect width="640" height="480" fill={`url(#${id}-fade)`} />
        </mask>
        <radialGradient id={`${id}-glow`}>
          <stop offset="0" className="[stop-color:var(--color-accent)]" stopOpacity="0.38" />
          <stop offset="1" className="[stop-color:var(--color-accent)]" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="640" height="480" fill={`url(#${id}-dots)`} mask={`url(#${id}-mask)`} />
      <circle cx={glow[0]} cy={glow[1]} r="210" fill={`url(#${id}-glow)`} />
      {children}
    </svg>
  );
}

/** Small uppercase monospace label in a rounded chip, centered on x. */
function Chip({ x, y, label, tone = "fill-muted", style }: { x: number; y: number; label: string; tone?: string; style?: CSSProperties }) {
  const w = label.length * 7.4 + 24;
  return (
    <g style={style}>
      <rect x={x - w / 2} y={y - 12} width={w} height="24" rx="7" className="fill-bg-100 stroke-line-strong" />
      <text x={x} y={y + 3.8} textAnchor="middle" fontSize="10.5" letterSpacing="1.4" className={`font-mono ${tone}`}>
        {label}
      </text>
    </g>
  );
}

/** A moving square along a path, `n` of them spaced over `dur`. */
function Packets({ path, dur, n = 2, begin = 0, className = "fill-accent" }: { path: string; dur: number; n?: number; begin?: number; className?: string }) {
  return (
    <g className={`packets ${className}`}>
      {Array.from({ length: n }, (_, k) => (
        <rect key={k} x="-3" y="-3" width="6" height="6" rx="1.5">
          <animateMotion dur={`${dur}s`} begin={`${begin + (k * dur) / n}s`} repeatCount="indefinite" path={path} />
        </rect>
      ))}
    </g>
  );
}

/** A path that draws itself in (masked, so dashes survive). */
function DrawPath({ id, d, delay, className, dashed, width = 2 }: { id: string; d: string; delay: number; className: string; dashed?: boolean; width?: number }) {
  return (
    <>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="640" height="480">
        <path d={d} pathLength={100} stroke="white" strokeWidth={width + 6} strokeLinecap="round" className="draw" style={draw(delay)} />
      </mask>
      <path d={d} mask={`url(#${id})`} strokeWidth={width} strokeLinecap="round" strokeDasharray={dashed ? "4 6" : undefined} className={className} />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Build: the stacks it detects, flowing into one image                */
/* ------------------------------------------------------------------ */

const GRID: (string | null)[][] = [
  ["vite", "astro", "react", null, "svelte", "vue", "angular"],
  ["express", "nodejs", "nextjs", "bun", "python", "django", "flask"],
  ["nuxt", "nestjs", "html5", null, "rust", "fastapi", null],
  [null, "svelte", "docker", null, "go", "react", "vite"],
  ["astro", null, "flask", "nextjs", null, "express", null],
];
const tile = (c: number, r: number) => ({ x: 50 + c * 80, y: 50 + r * 80 });
// Detected stacks, routed through the gutters into the image tile.
const ROUTES = [
  { from: [1, 1], d: "M160 190V200H272" },
  { from: [4, 1], d: "M400 190V200H368" },
  { from: [2, 3], d: "M240 290V280H272" },
  { from: [4, 3], d: "M400 290V280H368" },
] as const;

export function BuildArt() {
  return (
    <Stage id="art-build" glow={[320, 240]}>
      <g mask="url(#art-build-mask)">
        {GRID.flatMap((row, r) =>
          row.map((brand, c) => {
            if (c === 3 && r === 2) return null;
            const { x, y } = tile(c, r);
            const lit = ROUTES.some((rt) => rt.from[0] === c && rt.from[1] === r);
            return (
              <g key={`${c}-${r}`}>
                <rect x={x} y={y} width="60" height="60" rx="16" className="fill-bg-100 stroke-line" />
                {brand && (
                  <>
                    <rect x={x + 12} y={y + 12} width="36" height="36" rx="10" fill="white" />
                    <image href={`/brands/${brand}.svg`} x={x + 18} y={y + 18} width="24" height="24" />
                  </>
                )}
                {lit && <rect x={x - 3} y={y - 3} width="66" height="66" rx="19" strokeWidth="1.5" className="glyph-led stroke-accent" style={{ animationDelay: `${c * 180}ms` }} />}
              </g>
            );
          }),
        )}
      </g>

      {ROUTES.map((rt, i) => (
        <g key={rt.d}>
          <DrawPath id={`art-build-r${i}`} d={rt.d} delay={200 + i * 150} className="stroke-accent" width={1.5} />
          <Packets path={rt.d} dur={1.6} n={2} begin={0.9 + i * 0.2} />
        </g>
      ))}

      {/* The image: a box, lit from the top. */}
      <rect x="272" y="192" width="96" height="96" rx="24" className="fill-bg-100 stroke-accent" strokeWidth="1.5" />
      <g strokeLinejoin="round" strokeWidth="1.6">
        <path d="M320 212L344 224L320 236L296 224Z" className="fill-accent stroke-accent" />
        <path d="M296 224L320 236V262L296 250Z" className="fill-bg-300 stroke-fg" />
        <path d="M344 224L320 236V262L344 250Z" className="fill-bg-200 stroke-fg" />
      </g>
      <Chip x={320} y={322} label="IMAGE · 41S" tone="fill-fg" style={show(1300)} />
      <Chip x={160} y={116} label="DETECTED" style={show(700)} />
    </Stage>
  );
}

/* ------------------------------------------------------------------ */
/* Release: traffic moves to v42 once it's healthy                     */
/* ------------------------------------------------------------------ */

const IN = "M136 240H262";
const TO_OLD = "M338 240C392 240 382 150 435 150";
const TO_NEW = "M338 240C392 240 382 330 435 330";

function Release({ y, version, sha }: { y: number; version: string; sha: string }) {
  return (
    <>
      <rect x="435" y={y - 32} width="150" height="64" rx="16" className="fill-bg-100 stroke-line-strong" />
      <text x="457" y={y - 3} fontSize="18" fontWeight="600" className="fill-fg">
        {version}
      </text>
      <text x="457" y={y + 15} fontSize="10.5" letterSpacing="1" className="fill-subtle font-mono">
        {sha}
      </text>
    </>
  );
}

export function ReleaseArt() {
  return (
    <Stage id="art-release" glow={[330, 250]}>
      <g strokeWidth="1.5" strokeDasharray="4 6" className="stroke-line-strong">
        <path d={IN} />
        <path d={TO_OLD} />
        <path d={TO_NEW} />
      </g>
      <Packets path={IN} dur={1.1} n={3} />
      <g style={hide(2600)}>
        <Packets path={TO_OLD} dur={1.3} n={3} begin={0.5} />
      </g>
      <g style={show(2700)}>
        <path d={TO_NEW} strokeWidth="1.5" className="stroke-accent" />
        <Packets path={TO_NEW} dur={1.3} n={3} begin={0.2} />
      </g>

      {/* Your domain */}
      <circle cx="100" cy="240" r="36" className="fill-bg-100 stroke-line-strong" />
      <g className="stroke-fg" strokeWidth="1.6">
        <circle cx="100" cy="240" r="14" />
        <ellipse cx="100" cy="240" rx="6" ry="14" />
        <path d="M86 240H114" />
      </g>
      <text x="100" y="300" textAnchor="middle" fontSize="10" letterSpacing="1.2" className="fill-subtle font-mono">
        SHOP.EXAMPLE.COM
      </text>

      {/* The proxy */}
      <rect x="262" y="202" width="76" height="76" rx="20" className="fill-bg-100 stroke-line-strong" />
      <g className="stroke-fg" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M284 230H316M308 222L316 230L308 238" />
        <path d="M316 252H284M292 244L284 252L292 260" />
      </g>
      <text x="300" y="300" textAnchor="middle" fontSize="10" letterSpacing="1.2" className="fill-subtle font-mono">
        PROXY
      </text>

      <g style={dim(2900)}>
        <Release y={150} version="v41" sha="9B2F71D" />
      </g>
      <Chip x={510} y={98} label="LIVE" tone="fill-ok" style={hide(2600)} />

      <circle cx="510" cy="330" r="90" fill="url(#art-release-glow)" style={show(2700)} />
      <Release y={330} version="v42" sha="A1C9E3F" />
      <rect x="435" y="298" width="150" height="64" rx="16" strokeWidth="1.5" className="stroke-accent" style={show(2700)} />
      <Chip x={510} y={398} label="LIVE" tone="fill-ok" style={show(2800)} />

      {/* Health checks on v42 before it takes traffic. */}
      <text x="437" y="275" fontSize="10" letterSpacing="1.2" className="fill-subtle font-mono">
        HEALTH
      </text>
      {[0, 1, 2].map((k) => (
        <g key={k} style={show(700 + k * 550, 300)}>
          <circle cx={517 + k * 22} cy="271" r="8" className="fill-ok" />
          <path d={`M${513 + k * 22} 271l3 3 5-6`} stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      ))}
    </Stage>
  );
}

/* ------------------------------------------------------------------ */
/* Preview: each branch gets its own address                           */
/* ------------------------------------------------------------------ */

const BRANCHES = [
  { from: 90, y: 110, pr: 218, d: "M90 360C90 250 210 110 360 110" },
  { from: 170, y: 190, pr: 217, d: "M170 360C170 280 260 190 360 190" },
  { from: 250, y: 270, pr: 216, d: "M250 360C250 310 300 270 360 270" },
];

export function PreviewArt() {
  return (
    <Stage id="art-preview" glow={[430, 200]}>
      <path d="M40 360H600" strokeWidth="2" className="stroke-line-strong" />
      {[90, 170, 250, 330, 470, 560].map((x) => (
        <circle key={x} cx={x} cy="360" r="6" strokeWidth="2" className="fill-bg-100 stroke-fg" />
      ))}
      <text x="40" y="392" fontSize="10.5" letterSpacing="1.4" className="fill-subtle font-mono">
        MAIN
      </text>

      {BRANCHES.map((b, i) => {
        const closed = b.pr === 216;
        return (
          <g key={b.pr} style={closed ? dim(3300) : undefined}>
            <DrawPath id={`art-preview-b${i}`} d={b.d} delay={200 + i * 380} className="stroke-accent" />
            <g style={show(900 + i * 380)}>
              <text x="352" y={b.y - 30} textAnchor="end" fontSize="10.5" letterSpacing="1" className="fill-subtle font-mono">
                #{b.pr}
              </text>
              <rect x="360" y={b.y - 22} width="250" height="44" rx="12" className="fill-bg-100 stroke-line-strong" />
              <g className="stroke-subtle" strokeWidth="1.3">
                <circle cx="381" cy={b.y} r="7" />
                <path d={`M374 ${b.y}H388M381 ${b.y - 7}C377 ${b.y - 3} 377 ${b.y + 3} 381 ${b.y + 7}M381 ${b.y - 7}C385 ${b.y - 3} 385 ${b.y + 3} 381 ${b.y + 7}`} />
              </g>
              <text x="397" y={b.y + 4} fontSize="11.5" className="fill-fg font-mono">
                pr-{b.pr}.shop.example.com
              </text>
              <circle cx="590" cy={b.y} r="4" className={closed ? "fill-accent" : "fill-ok"} />
            </g>
            {closed && <path d={`M397 ${b.y}H566`} strokeWidth="1.5" pathLength={100} className="draw stroke-fg" style={draw(3300)} />}
          </g>
        );
      })}
      <Chip x={486} y={318} label="PR CLOSED · REMOVED" style={show(3400)} />
    </Stage>
  );
}

/* ------------------------------------------------------------------ */
/* Rollback: the live marker rewinds to the previous release           */
/* ------------------------------------------------------------------ */

const CX = 320;
const CY = 250;
const R = 150;
const RING = ["v38", "v39", "v40", "v41", "v42"].map((v, i) => {
  const a = ((160 - i * 35) * Math.PI) / 180;
  return { v, x: CX + R * Math.cos(a), y: CY - R * Math.sin(a), lx: CX + 184 * Math.cos(a), ly: CY - 184 * Math.sin(a) + 4 };
});
const v41 = RING[3];
const v42 = RING[4];
const REWIND = `M${v42.x} ${v42.y}A${R} ${R} 0 0 0 ${v41.x} ${v41.y}`;

export function RollbackArt() {
  return (
    <Stage id="art-rollback" glow={[CX, CY]}>
      <defs>
        <linearGradient id="art-rollback-ring" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.45" stopColor="white" />
          <stop offset="0.85" stopColor="black" />
        </linearGradient>
        <mask id="art-rollback-ring-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="640" height="480">
          <rect x="140" y="80" width="360" height="340" fill="url(#art-rollback-ring)" />
        </mask>
      </defs>
      <circle cx={CX} cy={CY} r={R} strokeWidth="1.5" strokeDasharray="4 6" className="stroke-line-strong" mask="url(#art-rollback-ring-mask)" />

      <DrawPath id="art-rollback-arc" d={REWIND} delay={1500} className="stroke-accent" width={3} />

      {RING.map((n) => (
        <g key={n.v}>
          <circle cx={n.x} cy={n.y} r="8" strokeWidth="2" className="fill-bg-100 stroke-line-strong" />
          <text x={n.lx} y={n.ly} textAnchor="middle" fontSize="12" fontWeight="500" className={n.v === "v41" || n.v === "v42" ? "fill-fg" : "fill-subtle"}>
            {n.v}
          </text>
        </g>
      ))}
      <circle cx={v42.x} cy={v42.y} r="8" className="fill-err" style={show(500)} />

      {/* The live marker: on v42, then rewinds to v41. */}
      <g>
        <circle r="22" fill="url(#art-rollback-glow)" />
        <circle r="11" className="fill-accent stroke-bg-100" strokeWidth="3" />
        <animateMotion dur="2.6s" begin="0s" fill="freeze" path={REWIND} keyPoints="0;0;1" keyTimes="0;0.62;1" calcMode="spline" keySplines="0 0 1 1;0.65 0 0.35 1" />
      </g>

      <g style={hide(2500)}>
        <text x={CX} y={CY + 4} textAnchor="middle" fontSize="44" fontWeight="600" letterSpacing="-1.5" className="fill-fg">
          v42
        </text>
        <text x={CX} y={CY + 32} textAnchor="middle" fontSize="10.5" letterSpacing="1.4" className="fill-err font-mono" style={show(500)}>
          5XX ERRORS
        </text>
      </g>
      <g style={show(2600)}>
        <text x={CX} y={CY + 4} textAnchor="middle" fontSize="44" fontWeight="600" letterSpacing="-1.5" className="fill-fg">
          v41
        </text>
        <text x={CX} y={CY + 32} textAnchor="middle" fontSize="10.5" letterSpacing="1.4" className="fill-ok font-mono">
          LIVE · BACK IN 4S
        </text>
      </g>
      <Chip x={CX} y={CY + 110} label="NO REBUILD" style={show(2900)} />
    </Stage>
  );
}
