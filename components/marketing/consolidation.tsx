import type { CSSProperties } from "react";
import { Icon, type IconName } from "@/components/icons";
import { Label } from "@/components/marketing/display";
import { LogoMark } from "@/components/logo";
import { cn } from "@/lib/utils";

// Why VPSPilot, as one picture: the tools a VPS is usually run with, tangled
// on the left, flowing into the control plane and coming out in order on the
// right. Drawn on a 1080×480 stage; animations wait for the reveal.

const BEFORE: { label: string; icon: IconName; mono?: boolean; err?: boolean; x: number; y: number; r: number }[] = [
  { label: "ssh root@web-1", icon: "terminal", mono: true, x: 150, y: 78, r: -5 },
  { label: "crontab -e", icon: "clock", mono: true, x: 292, y: 148, r: 4 },
  { label: "nginx.conf + certbot", icon: "globe", mono: true, x: 140, y: 216, r: 3 },
  { label: "pm2 logs", icon: "activity", mono: true, x: 300, y: 290, r: -4 },
  { label: "backup.sh, did it run?", icon: "archive", x: 156, y: 360, r: 5 },
  { label: "passwords.txt", icon: "file-text", err: true, x: 294, y: 424, r: -3 },
];

const AFTER: { label: string; detail: string; icon: IconName }[] = [
  { label: "Servers", detail: "4 online", icon: "server" },
  { label: "Deploys from Git", detail: "zero downtime", icon: "rocket" },
  { label: "Domains", detail: "HTTPS on", icon: "globe" },
  { label: "Logs and metrics", detail: "one place", icon: "activity" },
  { label: "Backups", detail: "restore-tested", icon: "archive" },
  { label: "Secrets", detail: "encrypted", icon: "lock" },
];

const CORE = { x: 560, y: 248 };
const ROW = { x: 770, w: 280, h: 46, y0: 96, step: 62 };
const rowY = (i: number) => ROW.y0 + i * ROW.step;

const inPath = (b: (typeof BEFORE)[number]) => `M${b.x + 112} ${b.y} C ${b.x + 200} ${b.y} ${CORE.x - 160} ${CORE.y} ${CORE.x - 86} ${CORE.y}`;
const outPath = (i: number) => `M${CORE.x + 86} ${CORE.y} C ${CORE.x + 150} ${CORE.y} ${ROW.x - 90} ${rowY(i)} ${ROW.x} ${rowY(i)}`;
const TANGLE = ["M150 100 Q 60 160 140 200", "M300 170 Q 380 230 300 272", "M156 380 Q 40 300 120 236", "M294 404 Q 400 350 310 312"];

const d = (ms: number): CSSProperties => ({ "--d": `${ms}ms` }) as CSSProperties;
const show = (ms: number): CSSProperties => ({ animation: "show 500ms ease both", animationDelay: `${ms}ms` });

function Stage() {
  return (
    <svg viewBox="0 0 1080 480" className="hidden h-auto w-full lg:block" fill="none" aria-hidden="true">
      <defs>
        <radialGradient id="why-core">
          <stop offset="0" className="[stop-color:var(--color-accent)]" stopOpacity="0.45" />
          <stop offset="1" className="[stop-color:var(--color-accent)]" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="why-mess">
          <stop offset="0" className="[stop-color:var(--color-err)]" stopOpacity="0.12" />
          <stop offset="1" className="[stop-color:var(--color-err)]" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="220" cy="250" rx="230" ry="220" fill="url(#why-mess)" />
      <circle cx={CORE.x} cy={CORE.y} r="200" fill="url(#why-core)" />

      <text x="40" y="22" fontSize="11" letterSpacing="1.6" className="fill-subtle font-mono">
        BEFORE
      </text>
      <text x={ROW.x} y="58" fontSize="11" letterSpacing="1.6" className="fill-subtle font-mono">
        WITH VPSPILOT
      </text>

      {/* The context you carry between tools. */}
      {TANGLE.map((p, i) => (
        <path key={p} d={p} strokeWidth="1.5" strokeDasharray="4 5" className="dash-flow stroke-err" strokeOpacity="0.55" style={{ animationDuration: `${1.4 + i * 0.3}s` }} />
      ))}

      <g strokeWidth="1.3" strokeDasharray="3 6" className="stroke-line-strong">
        {BEFORE.map((b) => (
          <path key={b.label} d={inPath(b)} />
        ))}
      </g>
      <g strokeWidth="1.5" className="stroke-accent" strokeOpacity="0.55">
        {AFTER.map((a, i) => (
          <path key={a.label} d={outPath(i)} />
        ))}
      </g>

      <g className="packets fill-accent">
        {BEFORE.map((b, i) => (
          <rect key={b.label} x="-3" y="-3" width="6" height="6" rx="1.5">
            <animateMotion dur="2.2s" begin={`${i * 0.37}s`} repeatCount="indefinite" path={inPath(b)} />
          </rect>
        ))}
        {AFTER.map((a, i) => (
          <rect key={a.label} x="-3" y="-3" width="6" height="6" rx="1.5">
            <animateMotion dur="1.8s" begin={`${1.1 + i * 0.37}s`} repeatCount="indefinite" path={outPath(i)} />
          </rect>
        ))}
      </g>

      {/* Before: scattered and tilted, drifting a little. */}
      {BEFORE.map((b, i) => (
        <g key={b.label} transform={`translate(${b.x} ${b.y}) rotate(${b.r})`}>
          <g className="svg-float" style={{ ...d(i * 420), animationDuration: `${5 + (i % 3)}s` }}>
            <rect x="-112" y="-22" width="224" height="44" rx="12" className="fill-bg-100 stroke-line-strong" />
            <g transform="translate(-96 -7)" className={b.err ? "text-err" : "text-subtle"}>
              <Icon name={b.icon} size={14} />
            </g>
            <text x="-74" y="4.5" fontSize={b.mono ? 12 : 13} className={cn("fill-fg", b.mono && "font-mono")}>
              {b.label}
            </text>
          </g>
        </g>
      ))}

      {/* The control plane. */}
      <g className="packets">
        {[0, 1].map((k) => (
          <circle key={k} cx={CORE.x} cy={CORE.y} r="86" strokeWidth="1.2" className="stroke-accent">
            <animate attributeName="r" values="86;150" dur="3s" begin={`${k * 1.5}s`} repeatCount="indefinite" />
            <animate attributeName="stroke-opacity" values="0.5;0" dur="3s" begin={`${k * 1.5}s`} repeatCount="indefinite" />
          </circle>
        ))}
      </g>
      <rect x={CORE.x - 86} y={CORE.y - 86} width="172" height="172" rx="40" className="fill-bg-100 stroke-accent" strokeWidth="1.5" />
      <g transform={`translate(${CORE.x - 26} ${CORE.y - 44})`} className="text-fg">
        <LogoMark size={52} />
      </g>
      <text x={CORE.x} y={CORE.y + 40} textAnchor="middle" fontSize="16" fontWeight="600" className="fill-fg">
        VPSPilot
      </text>
      <text x={CORE.x} y={CORE.y + 60} textAnchor="middle" fontSize="10" letterSpacing="1.4" className="fill-subtle font-mono">
        YOUR CONTROL PLANE
      </text>

      {/* After: one aligned row per job, lighting up as the work arrives. */}
      {AFTER.map((a, i) => {
        const y = rowY(i);
        return (
          <g key={a.label} className="play-on-reveal" style={show(600 + i * 220)}>
            <rect x={ROW.x} y={y - ROW.h / 2} width={ROW.w} height={ROW.h} rx="12" className="fill-bg-100 stroke-line-strong" />
            <g transform={`translate(${ROW.x + 16} ${y - 7})`} className={i === 5 ? "text-ok" : "text-accent-fg"}>
              <Icon name={a.icon} size={14} />
            </g>
            <text x={ROW.x + 40} y={y + 4.5} fontSize="13.5" fontWeight="500" className="fill-fg">
              {a.label}
            </text>
            <text x={ROW.x + ROW.w - 16} y={y + 4.5} textAnchor="end" fontSize="12" className="fill-subtle">
              {a.detail}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/** Narrow screens: the same story, top to bottom. */
function Stacked() {
  return (
    <div className="flex flex-col items-center lg:hidden" aria-hidden="true">
      <Label>Before</Label>
      <div className="mt-4 flex max-w-[460px] flex-wrap justify-center gap-2">
        {BEFORE.map((b) => (
          <span
            key={b.label}
            className="inline-flex items-center gap-2 rounded-xl border border-line-strong bg-bg-100 px-3 py-2 text-[12.5px]"
            style={{ rotate: `${b.r * 0.6}deg` }}
          >
            <Icon name={b.icon} size={13} className={b.err ? "text-err" : "text-subtle"} />
            <span className={cn(b.mono && "font-mono text-[12px]")}>{b.label}</span>
          </span>
        ))}
      </div>
      <svg width="12" height="56" viewBox="0 0 12 56" className="my-3">
        <path d="M6 0V56" className="stroke-line-strong" strokeDasharray="3 5" strokeWidth="1.2" />
      </svg>
      <div className="flex flex-col items-center rounded-3xl border border-accent bg-bg-100 px-10 py-6 shadow-[0_0_60px_-10px_var(--color-accent)]">
        <LogoMark size={36} />
        <p className="mt-3 text-[15px] font-semibold">VPSPilot</p>
      </div>
      <svg width="12" height="56" viewBox="0 0 12 56" className="my-3">
        <path d="M6 0V56" className="stroke-accent" strokeWidth="1.5" />
      </svg>
      <div className="w-full max-w-[380px] space-y-2">
        {AFTER.map((a, i) => (
          <div key={a.label} className="flex items-center gap-3 rounded-xl border border-line-strong bg-bg-100 px-4 py-3 text-[13.5px]">
            <Icon name={a.icon} size={14} className={i === 5 ? "text-ok" : "text-accent-fg"} />
            <span className="flex-1 font-medium">{a.label}</span>
            <span className="text-[12.5px] text-subtle">{a.detail}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Consolidation() {
  return (
    <section className="mx-auto w-full max-w-[1320px] px-3 pt-16 sm:px-5 sm:pt-24">
      <div className="relative overflow-hidden rounded-[28px] bg-bg-200 px-5 py-16 sm:py-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[70%] bg-[radial-gradient(ellipse_at_top,color-mix(in_oklab,var(--color-accent)_16%,transparent),transparent_65%)]"
        />
        <div className="relative mx-auto max-w-[780px] text-center">
          <div data-reveal>
            <Label>Why VPSPilot</Label>
          </div>
          <h2 data-reveal style={d(80)} className="mt-5 text-[clamp(32px,4.6vw,54px)] leading-[1.06] font-semibold tracking-[-0.035em] text-balance">
            From a dozen terminals to one control plane
          </h2>
          <p data-reveal style={d(160)} className="mx-auto mt-5 max-w-[660px] text-[17px] leading-relaxed text-muted">
            SSH sessions, crontabs, hand-copied nginx configs, backup scripts nobody checks and a passwords file. VPSPilot puts all of it in one
            dashboard you host yourself, with every change in the audit log.
          </p>
        </div>
        <div data-reveal className="relative mx-auto mt-14 max-w-[1080px] sm:mt-16">
          <Stage />
          <Stacked />
        </div>
      </div>
    </section>
  );
}
