"use client";

import { type CSSProperties, useEffect, useRef, useState } from "react";
import { Icon, type IconName } from "@/components/icons";
import { LogoMark } from "@/components/logo";
import { cn } from "@/lib/utils";

type Mode = "problem" | "solution";

// Chips on a 960×400 stage. As the problem they lie scattered and tilted;
// as the solution they line up inside the VPSPilot card.
const CARD = { x: 270, w: 420 };
const CHIP = { problem: 236, solution: CARD.w - 32 };

const TOOLS: {
  problem: { label: string; icon: IconName; mono?: boolean; tone?: string };
  solution: { label: string; detail: string; icon: IconName };
  at: { x: number; y: number; r: number };
}[] = [
  { problem: { label: "ssh root@web-1", icon: "terminal", mono: true }, solution: { label: "Servers", detail: "4 online", icon: "server" }, at: { x: 30, y: 36, r: -6 } },
  { problem: { label: "crontab -e", icon: "clock", mono: true }, solution: { label: "Cron jobs", detail: "scheduled", icon: "clock" }, at: { x: 660, y: 10, r: 5 } },
  { problem: { label: "nginx.conf + certbot", icon: "globe", mono: true }, solution: { label: "Domains", detail: "HTTPS on", icon: "globe" }, at: { x: 352, y: 146, r: 2 } },
  { problem: { label: "pm2 logs", icon: "activity", mono: true }, solution: { label: "Logs and metrics", detail: "one place", icon: "activity" }, at: { x: 694, y: 226, r: -4 } },
  { problem: { label: "backup.sh, did it run?", icon: "archive" }, solution: { label: "Backups", detail: "restore-tested", icon: "archive" }, at: { x: 70, y: 262, r: 4 } },
  { problem: { label: "passwords.txt", icon: "file-text", tone: "text-err" }, solution: { label: "Secrets", detail: "encrypted", icon: "lock" }, at: { x: 404, y: 330, r: -3 } },
];

// Red dashes between the scattered tools: the context you carry between them.
const TANGLE = ["M150 60 Q 300 30 470 168", "M780 34 Q 900 140 812 248", "M190 286 Q 280 200 400 182", "M520 352 Q 690 340 760 270"];

const COPY: Record<Mode, { title: string; body: string }> = {
  problem: {
    title: "Your servers live in a dozen terminals",
    body: "An SSH session per server, cron jobs nobody remembers, nginx configs copied by hand, backup scripts that may not have run, and the production passwords in a text file.",
  },
  solution: {
    title: "One control plane for all of it",
    body: "Deploys, cron jobs, domains, logs, backups and secrets in one dashboard you host yourself, with every change in the audit log.",
  },
};

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

export function ProblemSolution() {
  const [mode, setMode] = useState<Mode>("problem");
  const touched = useRef(false);
  const stage = useRef<HTMLDivElement>(null);

  // Shows the solution once on its own, a few seconds after the section comes into view.
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const io = new IntersectionObserver(
      ([e]) => {
        clearTimeout(timer);
        if (e.isIntersecting && !touched.current) {
          timer = setTimeout(() => {
            if (!touched.current) setMode("solution");
            touched.current = true;
            io.disconnect();
          }, 3200);
        }
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      clearTimeout(timer);
      io.disconnect();
    };
  }, []);

  const pick = (m: Mode) => {
    touched.current = true;
    setMode(m);
  };
  const solved = mode === "solution";

  return (
    <section className="mx-auto w-full max-w-[1320px] px-3 pt-16 sm:px-5 sm:pt-24">
      <div className="rounded-[28px] bg-bg-200 px-5 py-16 sm:py-24">
        <div data-reveal className="flex justify-center">
          <div role="tablist" aria-label="Before and after VPSPilot" className="relative grid grid-cols-2 rounded-full bg-bg p-1 shadow-[inset_0_0_0_1px_var(--color-line)]">
            <span
              aria-hidden="true"
              className="absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full bg-bg-300 transition-transform duration-500"
              style={{ transform: solved ? "translateX(100%)" : "none", transitionTimingFunction: EASE }}
            />
            {(["problem", "solution"] as Mode[]).map((m) => (
              <button
                key={m}
                type="button"
                role="tab"
                aria-selected={mode === m}
                onClick={() => pick(m)}
                className={cn(
                  "relative rounded-full px-5 py-1.5 text-[14px] capitalize transition-colors",
                  mode === m ? "text-fg" : "text-muted hover:text-fg",
                )}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-8 min-h-[200px] max-w-[780px] text-center sm:min-h-[180px]">
          <div key={mode} className="animate-[swap-in_0.5s_cubic-bezier(0.16,1,0.3,1)_both]">
            <h2 className="text-[clamp(32px,4.6vw,52px)] leading-[1.06] font-semibold tracking-[-0.035em] text-balance">{COPY[mode].title}</h2>
            <p className="mx-auto mt-5 max-w-[640px] text-[17px] leading-relaxed text-muted">{COPY[mode].body}</p>
          </div>
        </div>

        <div ref={stage} className="relative mx-auto mt-8 hidden h-[400px] w-[960px] lg:block" aria-hidden="true">
          {/* The VPSPilot card the tools settle into. */}
          <div
            className="absolute top-0 h-[400px] rounded-2xl border border-line-strong bg-bg-100 shadow-[0_30px_80px_-30px_rgb(0_0_0/0.45)] transition-[opacity,scale] duration-700"
            style={{ left: CARD.x, width: CARD.w, opacity: solved ? 1 : 0, scale: solved ? "1" : "0.92", transitionTimingFunction: EASE }}
          >
            <div className="flex h-[52px] items-center gap-2.5 border-b border-line px-4 text-[13.5px] font-medium">
              <LogoMark size={16} /> VPSPilot
              <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-ok/10 px-2.5 py-0.5 text-[11.5px] font-normal text-ok">
                <span className="size-1.5 rounded-full bg-current" /> All healthy
              </span>
            </div>
          </div>

          {!solved && (
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 960 400" fill="none">
              <defs>
                {TANGLE.map((d, i) => (
                  <mask key={d} id={`tangle-${i}`} maskUnits="userSpaceOnUse" x="0" y="0" width="960" height="400">
                    <path d={d} pathLength={100} stroke="white" strokeWidth="6" className="draw" style={{ "--d": `${200 + i * 200}ms` } as CSSProperties} />
                  </mask>
                ))}
              </defs>
              {TANGLE.map((d, i) => (
                <path key={d} d={d} mask={`url(#tangle-${i})`} className="stroke-err" strokeOpacity="0.5" strokeWidth="1.5" strokeDasharray="5 5" />
              ))}
            </svg>
          )}

          {TOOLS.map((t, i) => {
            const side = solved ? t.solution : t.problem;
            const x = solved ? CARD.x + 16 : t.at.x;
            const y = solved ? 68 + i * 54 : t.at.y;
            const r = solved ? 0 : t.at.r;
            return (
              <div
                key={t.problem.label}
                className="absolute top-0 left-0 flex h-[46px] items-center gap-2.5 rounded-xl border border-line bg-bg-100 px-3.5 text-[13.5px] shadow-[0_2px_10px_rgb(0_0_0/0.12)]"
                style={{
                  width: solved ? CHIP.solution : CHIP.problem,
                  transform: `translate(${x}px, ${y}px) rotate(${r}deg)`,
                  transition: `transform 0.85s ${EASE} ${i * 55}ms, width 0.85s ${EASE} ${i * 55}ms`,
                }}
              >
                <span key={mode} className="flex min-w-0 flex-1 animate-[swap-in_0.4s_ease_both] items-center gap-2.5">
                  <Icon
                    name={side.icon}
                    size={15}
                    className={cn("shrink-0", solved ? (i === 5 ? "text-ok" : "text-accent-fg") : (t.problem.tone ?? "text-subtle"))}
                  />
                  <span className={cn("truncate", !solved && t.problem.mono && "font-mono text-[12.5px]")}>{side.label}</span>
                  {solved && <span className="ml-auto shrink-0 text-[12.5px] text-subtle">{t.solution.detail}</span>}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
