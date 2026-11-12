import type { CSSProperties, ReactNode } from "react";
import { Icon, type IconName } from "@/components/icons";
import { cn } from "@/lib/utils";

// Product pictures for the databases tiles: one card that runs off the tile's
// bottom-right edge and fades out. Animations wait for the tile's reveal
// (.play-on-reveal inside [data-reveal]).

const d = (ms: number, extra?: Record<string, string | number>) => ({ "--d": `${ms}ms`, ...extra }) as CSSProperties;

function Bleed({ icon, title, aside, children }: { icon: IconName; title: string; aside?: ReactNode; children: ReactNode }) {
  return (
    <div className="absolute inset-0 pt-7 pl-7 [mask-image:linear-gradient(to_bottom,black_74%,transparent)]">
      <div className="h-[calc(100%+24px)] w-[calc(100%+24px)] rounded-tl-xl border-t border-l border-line-strong bg-bg-100 pr-12 shadow-[0_24px_60px_-30px_rgb(0_0_0/0.5)]">
        <div className="flex items-center gap-2.5 border-b border-line py-3.5 pl-4 text-[13px]">
          <Icon name={icon} size={14} className="text-subtle" />
          <span className="min-w-0 flex-1 truncate font-medium">{title}</span>
          {aside}
        </div>
        <div className="pl-4">{children}</div>
      </div>
    </div>
  );
}

const accounts = [
  ["ana@acme.io", "Team", "$49"],
  ["li@kite.dev", "Pro", "$19"],
  ["sam@odd.co", "Team", "$49"],
];

export function QueryVisual() {
  return (
    <Bleed
      icon="database"
      title="pg-main · storefront"
      aside={<span className="rounded-full bg-ok/10 px-2 py-0.5 text-[11px] font-medium text-ok">Read-only</span>}
    >
      <p className="pt-4 font-mono text-[12.5px]">
        <span className="play-on-reveal typed" style={d(250, { "--n": 37, "--dur": "1.1s" })}>
          <span className="text-syn-kw">SELECT</span> email, plan, mrr <span className="text-syn-kw">FROM</span> accounts
        </span>
      </p>
      <div className="mt-4 text-[13px]">
        {accounts.map((r, n) => (
          <div key={r[0]} className="play-on-reveal appear flex items-center gap-4 border-t border-line py-2.5" style={d(1450 + n * 140)}>
            <span className="min-w-0 flex-1 truncate">{r[0]}</span>
            <span className="text-muted">{r[1]}</span>
            <span className="w-9 text-right font-medium">{r[2]}</span>
          </div>
        ))}
      </div>
    </Bleed>
  );
}

const backups = [
  { at: "Tuesday, 02:00", size: "186 MB" },
  { at: "Wednesday, 02:00", size: "191 MB" },
];

function Restored({ delay }: { delay?: number }) {
  return (
    <span
      className={cn("inline-flex shrink-0 items-center gap-1.5 text-[12.5px] text-ok", delay !== undefined && "play-on-reveal appear")}
      style={delay !== undefined ? d(delay) : undefined}
    >
      <Icon name="check-circle" size={14} /> Restored
    </span>
  );
}

export function BackupVisual() {
  return (
    <Bleed icon="archive" title="Nightly backups · pg-main" aside={<span className="text-[12px] text-subtle">S3</span>}>
      <div className="text-[13px]">
        {backups.map((b, n) => (
          <div key={b.at} className="play-on-reveal appear flex items-center gap-3 border-b border-line py-2.5" style={d(200 + n * 160)}>
            <span className="min-w-0 flex-1">
              <span className="block truncate">{b.at}</span>
              <span className="block text-[12px] text-subtle">{b.size}</span>
            </span>
            <Restored />
          </div>
        ))}
        <div className="play-on-reveal appear flex items-center gap-3 py-2.5" style={d(550)}>
          <span className="min-w-0 flex-1">
            <span className="block truncate">Thursday, 02:00</span>
            <span className="mt-1.5 block h-1 max-w-[120px] overflow-hidden rounded-full bg-ink/[0.07]">
              <span
                className="play-on-reveal block h-full origin-left rounded-full bg-accent"
                style={{ animation: "grow-x 1800ms cubic-bezier(0.65, 0, 0.35, 1) both", animationDelay: "700ms" }}
              />
            </span>
          </span>
          <Restored delay={2500} />
        </div>
      </div>
    </Bleed>
  );
}

const logins = [
  { name: "storefront_app", access: "Read & write", tone: "bg-accent/12 text-accent-fg" },
  { name: "metabase", access: "Read-only", tone: "bg-ok/10 text-ok" },
  { name: "ana", access: "Read-only", tone: "bg-ok/10 text-ok" },
];

export function UsersVisual() {
  return (
    <Bleed icon="users" title="Logins · pg-main">
      <div className="text-[13px]">
        {logins.map((u, n) => (
          <div key={u.name} className="play-on-reveal appear flex items-center gap-3 border-b border-line py-2.5" style={d(200 + n * 170)}>
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-ink/[0.07] text-[11px] font-semibold text-muted uppercase">
              {u.name[0]}
            </span>
            <span className="min-w-0 flex-1 truncate">{u.name}</span>
            <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[11.5px] font-medium", u.tone)}>{u.access}</span>
          </div>
        ))}
        <div className="play-on-reveal appear flex items-center gap-2.5 py-3 text-muted" style={d(1100)}>
          <Icon name="key" size={14} className="text-accent-fg" />
          <span className="truncate">Password rotated for metabase</span>
        </div>
      </div>
    </Bleed>
  );
}
