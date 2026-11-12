import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { BrandChip, type Brand } from "@/components/brand-chip";
import { CommandPill } from "@/components/copy-button";
import { Icon, type IconName } from "@/components/icons";
import { CountUp } from "@/components/marketing/count-up";
import { DeployTabs } from "@/components/marketing/deploy-tabs";
import { Display, Label, Mono } from "@/components/marketing/display";
import { BackupVisual, QueryVisual, UsersVisual } from "@/components/marketing/feature-visuals";
import { FlowDiagram } from "@/components/marketing/flow-diagram";
import { Glyph } from "@/components/marketing/glyphs";
import { HeroField } from "@/components/marketing/hero-field";
import { TerminalMock } from "@/components/marketing/mocks";
import { ProblemSolution } from "@/components/marketing/problem-solution";
import { PROJECT_URL } from "@/lib/site";
import { cn } from "@/lib/utils";

// Installs the control plane (dashboard, API, database, HTTPS) on Ubuntu/Debian.
const INSTALL =
  "curl -fsSL https://raw.githubusercontent.com/philtechphilips/VPS-PIlot-BE/main/deploy/install.sh | sudo bash -s -- --domain pilot.example.com";

const wrap = "mx-auto w-full max-w-[1240px] px-4 sm:px-6";
const section = "scroll-mt-20 pt-32 sm:pt-48";
const lead = "text-[17px] leading-relaxed text-muted sm:text-[19px]";
const heading = "text-[clamp(40px,7.2vw,100px)]";

/** Stagger delay for reveal animations. */
const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

export default function HomePage() {
  return (
    <>
      <Hero />
      <ProblemSolution />
      <Deploy />
      <Facts />
      <Monitor />
      <Databases />
      <Security />
      <Install />
      <Faq />
      <Closing />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Shared bits                                                         */
/* ------------------------------------------------------------------ */

function Primary({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="btn-primary group inline-flex h-11 items-center gap-2 rounded-lg pr-4 pl-5 text-[15px] font-medium">
      {children}
      <Icon name="arrow-right" size={15} className="transition-transform duration-300 group-hover:translate-x-0.5" />
    </Link>
  );
}

function GitHubButton({ label = "Star on GitHub" }: { label?: string }) {
  return (
    <a
      href={PROJECT_URL}
      target="_blank"
      rel="noreferrer"
      className="inline-flex h-11 items-center gap-2 rounded-lg border border-line-strong bg-ink/[0.03] px-5 text-[15px] font-medium text-fg transition-colors hover:bg-ink/[0.07]"
    >
      <Icon name="github" size={16} /> {label}
    </a>
  );
}

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

const facts = [
  { label: "License", value: "Apache-2.0" },
  { label: "Install", value: "One command" },
  { label: "Inbound ports", value: "None" },
];

function Hero() {
  return (
    <section className="relative -mt-16 overflow-hidden pt-16">
      <HeroField className="[mask-image:radial-gradient(ellipse_80%_75%_at_55%_45%,black_25%,transparent_78%)]" />
      <div className={cn(wrap, "relative pt-14 sm:pt-24")}>
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-[580px]">
            <p className="appear text-[19px] leading-[1.45] text-muted sm:text-[21px]" style={d(80)}>
              <span className="text-fg">The open-source control plane</span> for the servers you already own. Deploy apps, watch every server and run your
              databases from one dashboard you host yourself.
            </p>
            <div className="appear mt-8 flex flex-wrap gap-3" style={d(200)}>
              <Primary href="/docs/getting-started/install">Get started</Primary>
              <GitHubButton />
            </div>
          </div>
          <dl className="appear grid grid-cols-3 gap-6 sm:gap-10 lg:pt-1.5" style={d(320)}>
            {facts.map((f) => (
              <div key={f.label}>
                <dt className="font-mono text-[11px] tracking-[0.14em] text-subtle uppercase">{f.label}</dt>
                <dd className="mt-2 text-[15px] font-medium sm:text-[16px]">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <Display
          as="h1"
          load
          className="mt-16 text-[clamp(40px,9.6vw,144px)] sm:mt-24"
          lines={[
            "Put your servers",
            <>
              on <Glyph name="server" />
              <Mono caret>autopilot</Mono>
            </>,
          ]}
        />
      </div>
      <StackMarquee />
    </section>
  );
}

const stack: Brand[] = ["Ubuntu", "Debian", "Docker", "Node.js", "Next.js", "Bun", "Python", "FastAPI", "Go", "Rust", "PostgreSQL", "MySQL", "MariaDB", "Redis"];

function StackMarquee() {
  return (
    <div className={cn(wrap, "relative mt-20 sm:mt-28")}>
      <div className="appear flex items-center gap-10" style={d(700)}>
        <Label className="hidden shrink-0 leading-5 sm:block">
          Runs the stack
          <br />
          you already use
        </Label>
        <div className="marquee marquee-mask min-w-0 flex-1 overflow-hidden py-2">
          <div className="marquee-track gap-12 pr-12">
            {[...stack, ...stack].map((b, n) => (
              <span
                key={n}
                aria-hidden={n >= stack.length || undefined}
                className="inline-flex items-center gap-2.5 text-[15px] font-medium whitespace-nowrap text-muted opacity-70 grayscale transition duration-300 hover:text-fg hover:opacity-100 hover:grayscale-0"
              >
                <BrandChip name={b} size={24} className="rounded-md" />
                {b}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Deploy                                                              */
/* ------------------------------------------------------------------ */

function Deploy() {
  return (
    <section id="deploy" className={cn(wrap, section)}>
      <Label>01 · Deploy</Label>
      <Display
        className={cn("mt-6", heading)}
        lines={[
          "Push to deploy.",
          <>
            Never <Glyph name="terminal" />
            <Mono>ssh</Mono> in.
          </>,
        ]}
      />
      <p data-reveal className={cn("mt-8 max-w-[580px]", lead)}>
        VPSPilot builds, health-checks and releases your apps on servers you already pay for. Docker, Compose, Node.js or Python, straight from
        Git.
      </p>
      <div className="mt-14 sm:mt-20">
        <DeployTabs />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Facts                                                               */
/* ------------------------------------------------------------------ */

function Stat({ value, label, text, delay = 0 }: { value: number; label: string; text: string; delay?: number }) {
  return (
    <div data-reveal style={d(delay)} className="flex flex-col justify-between gap-10 rounded-2xl border border-line bg-bg-100 p-8 sm:p-10">
      <p className="flex items-start text-[88px] leading-[0.85] font-semibold tracking-[-0.05em] sm:text-[104px]">
        <span aria-hidden="true" className="mt-2 mr-3 size-3 shrink-0 rounded-[3px] bg-accent" />
        <CountUp value={value} />
      </p>
      <div>
        <p className="text-[17px] font-medium">{label}</p>
        <p className="mt-1.5 text-[15px] leading-relaxed text-muted">{text}</p>
      </div>
    </div>
  );
}

function Facts() {
  return (
    <section className={cn(wrap, section)}>
      <div className="grid gap-4 lg:grid-cols-3">
        <div data-reveal className="relative flex min-h-[340px] flex-col justify-between overflow-hidden rounded-2xl bg-accent p-8 text-white sm:p-10 lg:col-span-2">
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-25 [background-image:radial-gradient(rgb(255_255_255)_1px,transparent_1.2px)] [background-size:20px_20px] [mask-image:linear-gradient(to_top,black,transparent_75%)]"
          />
          <p className="relative font-mono text-[11px] tracking-[0.14em] uppercase opacity-75">By design</p>
          <p className="relative mt-10 max-w-[640px] text-[26px] leading-[1.22] font-medium tracking-[-0.025em] sm:text-[36px]">
            If the control plane goes down, your apps keep running. The agents catch up when it&apos;s back.
          </p>
        </div>
        <Stat value={0} label="Inbound ports" text="Agents dial out over HTTPS, so nothing new listens on your servers." delay={120} />
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <Stat value={1} label="Command to install" text="Dashboard, API, database and HTTPS on one Ubuntu or Debian server." />
        <Stat value={4} label="Database engines" text="PostgreSQL, MySQL, MariaDB and Redis, created or registered." delay={120} />
        <Stat value={6} label="Stacks without a Dockerfile" text="Node.js, Bun, Python, Go, Rust and static sites are detected and built." delay={240} />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Monitor                                                             */
/* ------------------------------------------------------------------ */

const watch: { icon: IconName; title: string; text: string }[] = [
  { icon: "activity", title: "Live metrics and logs", text: "CPU, memory, disk and network for every server, and app logs you can search across all of them." },
  { icon: "bell", title: "Alert rules", text: "A disk filling up, an app logging errors, a site failing its uptime check: set the threshold once." },
  { icon: "calendar", title: "A weekly report", text: "Uptime, deploys, errors, security findings and disk growth, in one email every week." },
];

function Monitor() {
  return (
    <section id="monitor" className={cn(wrap, section, "text-center")}>
      <Label>02 · Monitor</Label>
      <Display
        className={cn("mt-6", heading)}
        lines={[
          "Know before",
          <>
            your <Glyph name="pulse" />
            <Mono>users</Mono> do
          </>,
        ]}
      />
      <p data-reveal className={cn("mx-auto mt-8 max-w-[620px]", lead)}>
        Every server reports its health. Set a rule once and hear about it by email, Slack, Telegram or webhook the moment it trips.
      </p>
      <div data-reveal className="mt-16 sm:mt-20">
        <FlowDiagram />
      </div>
      <div className="mt-16 grid gap-10 text-left sm:mt-20 md:grid-cols-3">
        {watch.map((w, n) => (
          <div key={w.title} data-reveal style={d(n * 120)} className="border-t border-line pt-6">
            <Icon name={w.icon} size={18} className="text-accent-fg" />
            <h3 className="mt-4 text-[18px] font-medium">{w.title}</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-muted">{w.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Databases                                                           */
/* ------------------------------------------------------------------ */

function Card({ title, text, visual, delay }: { title: string; text: string; visual: ReactNode; delay: number }) {
  return (
    <div data-reveal style={d(delay)}>
      <div data-spot className="relative h-[280px] overflow-hidden rounded-2xl border border-line bg-bg-200">
        {visual}
      </div>
      <h3 className="mt-6 text-[19px] font-medium tracking-[-0.01em]">{title}</h3>
      <p className="mt-2 text-[15px] leading-relaxed text-muted">{text}</p>
    </div>
  );
}

function Databases() {
  return (
    <section id="databases" className={cn(wrap, section)}>
      <Label>03 · Databases</Label>
      <Display
        className={cn("mt-6", heading)}
        lines={[
          "Your databases,",
          <>
            in <Glyph name="database" />
            <Mono>one tab</Mono>
          </>,
        ]}
      />
      <p data-reveal className={cn("mt-8 max-w-[600px]", lead)}>
        Create or register PostgreSQL, MySQL, MariaDB and Redis. Query them, manage their users and keep encrypted backups that are restored to
        prove they work.
      </p>
      <div className="mt-16 grid gap-x-6 gap-y-14 sm:mt-20 md:grid-cols-3">
        <Card title="Query and browse" text="Run SQL from the browser, with read-only roles for the people who only need to look." visual={<QueryVisual />} delay={0} />
        <Card title="Backups that restore" text="Encrypted, on your schedule, to S3, R2, Backblaze or Google Drive, and restored to check them." visual={<BackupVisual />} delay={120} />
        <Card title="Users and access" text="Create logins, scope them to one database and rotate their passwords in a click." visual={<UsersVisual />} delay={240} />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Security                                                            */
/* ------------------------------------------------------------------ */

const guards: { icon: IconName; title: string; text: string }[] = [
  { icon: "network", title: "Outbound-only agents", text: "Agents dial out over HTTPS. Your servers open no new port." },
  { icon: "terminal", title: "Typed jobs, never a shell", text: "Every action is a fixed operation with checked inputs, run by a small root helper." },
  { icon: "fingerprint", title: "Two-factor and roles", text: "Authenticator or email codes, recovery codes, and admin and viewer roles." },
  { icon: "file-text", title: "An audit log of everything", text: "Who did what, to which server or app, and how it went." },
  { icon: "lock", title: "Secrets encrypted at rest", text: "Environment values, database passwords and backup keys, encrypted with your key." },
  { icon: "shield-check", title: "Vulnerability checks", text: "Every app's dependencies and OS packages, checked daily against OSV.dev." },
];

function Security() {
  return (
    <section id="security" className={cn(wrap, section)}>
      <div className="grid gap-8 lg:grid-cols-2 lg:items-end">
        <div>
          <Label>04 · Security</Label>
          <Display
            className={cn("mt-6", heading)}
            lines={[
              "Secure by",
              <>
                <Glyph name="shield" />
                <Mono>default</Mono>
              </>,
            ]}
          />
        </div>
        <p data-reveal className={cn("max-w-[480px] lg:justify-self-end lg:pb-3", lead)}>
          Your control plane holds the keys to every server, so it is built like it.
        </p>
      </div>
      <div className="mt-16 grid border-t border-line sm:mt-20 sm:grid-cols-2 lg:grid-cols-3">
        {guards.map((g, n) => (
          <div
            key={g.title}
            data-reveal
            style={d((n % 3) * 100)}
            className="border-b border-line py-8 sm:px-8 sm:odd:border-r lg:odd:border-r-0 lg:[&:not(:nth-child(3n))]:border-r"
          >
            <Icon name={g.icon} size={20} className="text-accent-fg" />
            <h3 className="mt-5 text-[18px] font-medium">{g.title}</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-muted">{g.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Install                                                             */
/* ------------------------------------------------------------------ */

function Install() {
  return (
    <section id="install" className={cn(wrap, section)}>
      <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_1fr]">
        <div className="min-w-0">
          <Label>05 · Install</Label>
          <Display
            className="mt-6 text-[clamp(40px,6.4vw,88px)]"
            lines={[
              "One command,",
              <>
                five <Mono caret>minutes</Mono>
              </>,
            ]}
          />
          <p data-reveal className={cn("mt-8 max-w-[520px]", lead)}>
            Install the control plane on a fresh Ubuntu or Debian server, create the owner account, then add each server with a single-use token.
          </p>
          <div data-reveal className="mt-8">
            <CommandPill command={INSTALL} className="w-full max-w-[560px] rounded-lg bg-bg-100" />
            <div className="mt-6 flex flex-wrap gap-3">
              <Primary href="/docs/getting-started/install">Read the install guide</Primary>
            </div>
          </div>
        </div>
        <div data-reveal data-motion="tilt" className="min-w-0">
          <TerminalMock />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* FAQ and closing                                                     */
/* ------------------------------------------------------------------ */

const faqs = [
  {
    q: "Where does VPSPilot run?",
    a: "On a server you own. The installer sets up the dashboard, API, database and HTTPS on one Ubuntu or Debian machine, and that machine can host apps too.",
  },
  {
    q: "Do I need to open any ports on my servers?",
    a: "No. The agent on each server makes outbound HTTPS requests to your control plane and never listens for connections.",
  },
  {
    q: "What can I deploy?",
    a: "Anything with a Dockerfile or a Compose file, plus Node.js and Python apps that run natively under systemd. Static sites work too.",
  },
  {
    q: "What happens if the control plane goes down?",
    a: "Your apps keep running. Agents retry quietly and catch up when the control plane is back, and each job is checked against the server's real state.",
  },
  {
    q: "Is it free?",
    a: "Yes. VPSPilot is open source under the Apache License 2.0 and self-hosted, so you only pay for the servers you already rent.",
  },
];

function Faq() {
  return (
    <section id="faq" className={cn(wrap, section)}>
      <div className="grid gap-12 lg:grid-cols-[1fr_1.35fr] lg:gap-20">
        <div>
          <Label>FAQ</Label>
          <Display className="mt-6 text-[clamp(40px,5.6vw,76px)]" lines={["Questions,", <Mono key="a">answered</Mono>]} />
          <p data-reveal className="mt-8 text-[16px] leading-relaxed text-muted">
            Something else?{" "}
            <Link href="/docs" className="text-fg underline decoration-line-strong underline-offset-4 hover:decoration-fg">
              Read the docs
            </Link>{" "}
            or{" "}
            <a href={`${PROJECT_URL}/issues`} target="_blank" rel="noreferrer" className="text-fg underline decoration-line-strong underline-offset-4 hover:decoration-fg">
              open an issue
            </a>
            .
          </p>
        </div>
        <div data-reveal className="faq divide-y divide-line border-y border-line">
          {faqs.map((f) => (
            <details key={f.q} className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-[17px] font-medium transition-colors hover:text-fg [&::-webkit-details-marker]:hidden">
                {f.q}
                <Icon name="plus" size={18} className="shrink-0 text-subtle transition-transform duration-300 group-open:rotate-45" />
              </summary>
              <p className="max-w-[600px] pb-6 text-[15px] leading-relaxed text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function Closing() {
  return (
    <section className={cn(wrap, "py-32 text-center sm:py-48")}>
      <Display
        className="text-[clamp(44px,8.4vw,124px)]"
        lines={[
          "Your servers,",
          <>
            your <Glyph name="branch" />
            <Mono caret>rules</Mono>
          </>,
        ]}
      />
      <p data-reveal className={cn("mx-auto mt-8 max-w-[520px]", lead)}>
        Open source and self-hosted, on servers you control.
      </p>
      <div data-reveal className="mt-10 flex flex-wrap justify-center gap-3">
        <Primary href="/docs/getting-started/install">Get started</Primary>
        <GitHubButton />
      </div>
    </section>
  );
}
