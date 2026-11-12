import { LogoMark } from "@/components/logo";

// Monitoring, as data moves: agents report out to the control plane over
// HTTPS, and alerts go from there to wherever the team is. Packets travel the
// paths with SMIL (no JS); .packets is hidden with reduced motion.

const servers = [
  { y: 100, name: "web-1", os: "Ubuntu 24.04", spark: "0,10 8,7 16,9 24,4 32,6 40,2" },
  { y: 220, name: "db-1", os: "Debian 12", spark: "0,6 8,8 16,5 24,7 32,3 40,5" },
  { y: 340, name: "edge-jnb-01", os: "Ubuntu 22.04", spark: "0,9 8,9 16,6 24,8 32,7 40,4" },
];
const channels = [
  { y: 70, name: "EMAIL" },
  { y: 170, name: "SLACK" },
  { y: 270, name: "TELEGRAM" },
  { y: 370, name: "WEBHOOK" },
];

const inPath = (y: number) => `M282 ${y} C 392 ${y} 372 220 478 220`;
const outPath = (y: number) => `M722 220 C 828 220 818 ${y} 943 ${y}`;

export function FlowDiagram() {
  return (
    <>
      <svg viewBox="0 0 1200 440" className="hidden h-auto w-full lg:block" role="img" aria-label="Servers report to the control plane, which sends alerts by email, Slack, Telegram and webhook">
        <defs>
          <radialGradient id="cp-glow">
            <stop offset="0%" className="[stop-color:var(--color-accent)]" stopOpacity="0.32" />
            <stop offset="100%" className="[stop-color:var(--color-accent)]" stopOpacity="0" />
          </radialGradient>
          {servers.map((s, n) => (
            <path key={s.name} id={`flow-in-${n}`} d={inPath(s.y)} />
          ))}
          {channels.map((c, n) => (
            <path key={c.name} id={`flow-out-${n}`} d={outPath(c.y)} />
          ))}
        </defs>

        <circle cx="600" cy="220" r="210" fill="url(#cp-glow)" />

        <g fill="none" strokeWidth="1.2" strokeDasharray="3 5" className="stroke-line-strong">
          {servers.map((s) => (
            <path key={s.name} d={inPath(s.y)} />
          ))}
          {channels.map((c) => (
            <path key={c.name} d={outPath(c.y)} />
          ))}
        </g>

        <g className="packets fill-accent">
          {servers.map((s, n) =>
            [0, 1].map((k) => (
              <rect key={`${s.name}-${k}`} x="-3" y="-3" width="6" height="6" rx="1">
                <animateMotion dur="2.8s" begin={`${n * 0.7 + k * 1.4}s`} repeatCount="indefinite" calcMode="spline" keyTimes="0;1" keySplines="0.45 0 0.55 1">
                  <mpath href={`#flow-in-${n}`} />
                </animateMotion>
              </rect>
            )),
          )}
          {channels.map((c, n) => (
            <rect key={c.name} x="-3" y="-3" width="6" height="6" rx="1">
              <animateMotion dur="3.2s" begin={`${1.2 + n * 0.8}s`} repeatCount="indefinite" calcMode="spline" keyTimes="0;1" keySplines="0.45 0 0.55 1">
                <mpath href={`#flow-out-${n}`} />
              </animateMotion>
            </rect>
          ))}
        </g>

        <g className="fill-subtle font-mono" fontSize="10.5" letterSpacing="1.6">
          <text x="380" y="424" textAnchor="middle">
            OUTBOUND HTTPS
          </text>
          <text x="832" y="424" textAnchor="middle">
            ALERTS
          </text>
        </g>

        {servers.map((s, n) => (
          <g key={s.name} transform={`translate(60 ${s.y - 32})`}>
            <rect width="222" height="64" rx="14" className="fill-bg-100 stroke-line" strokeWidth="1" />
            <circle cx="22" cy="32" r="4" className="glyph-led fill-ok" style={{ animationDelay: `${n * 400}ms` }} />
            <text x="38" y="29" fontSize="15" fontWeight="500" className="fill-fg">
              {s.name}
            </text>
            <text x="38" y="46" fontSize="10" letterSpacing="1.2" className="fill-subtle font-mono">
              {s.os.toUpperCase()}
            </text>
            <polyline points={s.spark} transform="translate(164 26)" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="stroke-accent" />
          </g>
        ))}

        <g transform="translate(480 145)">
          <rect width="240" height="150" rx="22" className="fill-bg-100 stroke-line-strong" strokeWidth="1" />
          <g transform="translate(104 28)" className="text-fg">
            <LogoMark size={32} />
          </g>
          <text x="120" y="96" textAnchor="middle" fontSize="16" fontWeight="600" className="fill-fg">
            Control plane
          </text>
          <text x="120" y="118" textAnchor="middle" fontSize="10" letterSpacing="1.2" className="fill-subtle font-mono">
            PILOT.EXAMPLE.COM
          </text>
        </g>

        {channels.map((c) => (
          <g key={c.name} transform={`translate(945 ${c.y - 24})`}>
            <rect width="190" height="48" rx="12" className="fill-bg-100 stroke-line" strokeWidth="1" />
            <rect x="18" y="20" width="8" height="8" rx="2" className="fill-accent" />
            <text x="40" y="28.5" fontSize="11" letterSpacing="1.6" className="fill-fg font-mono">
              {c.name}
            </text>
          </g>
        ))}
      </svg>

      {/* Narrow screens: the same flow, top to bottom. */}
      <div className="flex flex-col items-center lg:hidden" aria-hidden="true">
        <div className="flex flex-wrap justify-center gap-2">
          {servers.map((s) => (
            <span key={s.name} className="inline-flex items-center gap-2 rounded-xl border border-line bg-bg-100 px-3 py-2 text-[13px] font-medium">
              <span className="size-1.5 rounded-full bg-ok" />
              {s.name}
            </span>
          ))}
        </div>
        <Wire />
        <div className="flex flex-col items-center rounded-2xl border border-line-strong bg-bg-100 px-8 py-5 text-center">
          <LogoMark size={26} />
          <p className="mt-2 text-[15px] font-semibold">Control plane</p>
        </div>
        <Wire />
        <div className="flex flex-wrap justify-center gap-2">
          {channels.map((c) => (
            <span key={c.name} className="rounded-xl border border-line bg-bg-100 px-3 py-2 font-mono text-[11px] tracking-[0.12em]">
              {c.name}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}

function Wire() {
  return (
    <svg width="12" height="56" viewBox="0 0 12 56" className="my-2" aria-hidden="true">
      <path d="M6 0V56" className="stroke-line-strong" strokeDasharray="3 5" strokeWidth="1.2" />
      <g className="packets fill-accent">
        <rect x="3" y="-3" width="6" height="6" rx="1">
          <animate attributeName="y" from="-3" to="53" dur="1.6s" repeatCount="indefinite" />
        </rect>
      </g>
    </svg>
  );
}
