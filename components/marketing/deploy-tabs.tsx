"use client";

import { type CSSProperties, type KeyboardEvent, type ReactNode, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { BuildArt, PreviewArt, ReleaseArt, RollbackArt } from "@/components/marketing/deploy-art";
import { cn } from "@/lib/utils";

const DURATION = 6500; // ms each tab stays before the next one

const tabs = [
  {
    id: "build",
    title: "Build from any repository",
    text: "Connect GitHub or any Git URL. VPSPilot detects Node.js, Bun, Python, Go, Rust and static sites, or builds your Dockerfile or Compose file.",
  },
  {
    id: "release",
    title: "Releases without downtime",
    text: "A new release takes traffic only after its health check passes, so a broken build never replaces a working one.",
  },
  {
    id: "preview",
    title: "A preview for every pull request",
    text: "Each pull request gets its own address, updated on every push and removed when it closes.",
  },
  {
    id: "rollback",
    title: "Roll back in one click",
    text: "Earlier releases stay on the server, so going back takes seconds instead of a rebuild.",
  },
] as const;

type TabId = (typeof tabs)[number]["id"];

const REDUCED = "(prefers-reduced-motion: reduce)";
const subscribe = (cb: () => void) => {
  const m = window.matchMedia(REDUCED);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
};

/** Deploy features as tabs that advance on their own while in view, each with an animated panel. */
export function DeployTabs() {
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const [hover, setHover] = useState(false);
  const reduced = useSyncExternalStore(subscribe, () => window.matchMedia(REDUCED).matches, () => false);
  const ref = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const select = (i: number, focus = false) => {
    const next = (i + tabs.length) % tabs.length;
    setActive(next);
    if (focus) tabRefs.current[next]?.focus();
  };

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "ArrowRight") select(active + 1, true);
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft") select(active - 1, true);
    else return;
    e.preventDefault();
  };

  const tab = tabs[active];

  return (
    <div
      ref={ref}
      className="grid grid-cols-[minmax(0,1fr)] items-start gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16"
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <div role="tablist" aria-orientation="vertical" aria-label="Deployment features" onKeyDown={onKey} className="flex flex-col">
        {tabs.map((t, i) => {
          const on = i === active;
          return (
            <button
              key={t.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              id={`deploy-tab-${t.id}`}
              type="button"
              role="tab"
              aria-selected={on}
              aria-controls="deploy-panel"
              tabIndex={on ? 0 : -1}
              onClick={() => select(i)}
              className="group relative py-5 text-left"
            >
              <span className="absolute inset-x-0 bottom-0 h-px bg-line" />
              {on && (
                <span
                  key={active}
                  className={cn("absolute bottom-0 left-0 h-px w-full bg-fg", !reduced && "tab-progress")}
                  data-paused={!inView || hover}
                  style={{ "--dur": `${DURATION}ms` } as CSSProperties}
                  onAnimationEnd={() => select(active + 1)}
                />
              )}
              <span
                className={cn(
                  "block text-[20px] font-medium tracking-[-0.02em] transition-colors duration-300 sm:text-[24px]",
                  on ? "text-fg" : "text-subtle group-hover:text-muted",
                )}
              >
                {t.title}
              </span>
              <span
                className={cn(
                  "grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                  on ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                )}
              >
                <span className="overflow-hidden">
                  <span className="block max-w-[440px] pt-2.5 text-[15px] leading-relaxed text-muted">{t.text}</span>
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div id="deploy-panel" role="tabpanel" aria-labelledby={`deploy-tab-${tab.id}`}>
        <Panel key={tab.id} id={tab.id} />
      </div>
    </div>
  );
}

const art: Record<TabId, () => ReactNode> = {
  build: BuildArt,
  release: ReleaseArt,
  preview: PreviewArt,
  rollback: RollbackArt,
};

function Panel({ id }: { id: TabId }) {
  const Art = art[id];
  return (
    <div className="animate-[swap-in_0.5s_cubic-bezier(0.16,1,0.3,1)_both]">
      <Art />
    </div>
  );
}
