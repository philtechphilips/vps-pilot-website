import Link from "next/link";
import { Icon } from "@/components/icons";
import { Logotype } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { PROJECT_URL } from "@/lib/site";

const columns = [
  {
    title: "Product",
    links: [
      { label: "Deployments", href: "/#deploy" },
      { label: "Monitoring", href: "/#monitor" },
      { label: "Databases", href: "/#databases" },
      { label: "Security", href: "/#security" },
    ],
  },
  {
    title: "Docs",
    links: [
      { label: "Install guide", href: "/docs/getting-started/install" },
      { label: "First deploy", href: "/docs/getting-started/first-deploy" },
      { label: "Agent protocol", href: "/docs/reference/agent#agent-protocol" },
      { label: "Threat model", href: "/docs/concepts/security" },
    ],
  },
  {
    title: "Project",
    links: [
      { label: "GitHub", href: PROJECT_URL },
      { label: "Releases", href: `${PROJECT_URL}/releases` },
      { label: "Changelog", href: `${PROJECT_URL}/commits/main` },
      { label: "Security policy", href: `${PROJECT_URL}/security/policy` },
      { label: "License", href: `${PROJECT_URL}/blob/main/LICENSE` },
    ],
  },
];

export function MarketingFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-line">
      <div className="mx-auto max-w-[1240px] px-4 pt-16 sm:px-6">
        <div className="grid gap-12 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Logotype className="text-[20px]" />
            <p className="mt-4 max-w-60 text-[14px] leading-relaxed text-muted">The open-source control plane for the servers you already own.</p>
            <a
              href={PROJECT_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex h-9 items-center gap-2 rounded-lg border border-line px-3 text-[13px] font-medium text-muted transition-colors hover:border-line-strong hover:text-fg"
            >
              <Icon name="github" size={15} /> Star on GitHub
            </a>
          </div>
          {columns.map((c) => (
            <div key={c.title}>
              <h3 className="font-mono text-[11px] tracking-[0.14em] text-subtle uppercase">{c.title}</h3>
              <ul className="mt-5 space-y-3 text-[14px]">
                {c.links.map((l) => (
                  <li key={l.label}>
                    {l.href.startsWith("http") ? (
                      <a href={l.href} target="_blank" rel="noreferrer" className="text-fg/80 transition-colors hover:text-fg">
                        {l.label}
                      </a>
                    ) : (
                      <Link href={l.href} className="text-fg/80 transition-colors hover:text-fg">
                        {l.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-line py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[11px] tracking-[0.14em] text-subtle uppercase">© 2026 VPSPilot · Apache-2.0</p>
          <ThemeToggle />
        </div>
      </div>

      {/* The wordmark, cut off by the page edge. */}
      <div aria-hidden="true" className="pointer-events-none mx-auto -mb-[3.2vw] max-w-[1240px] px-4 select-none sm:px-6">
        <Logotype className="block w-full text-center text-[17.5vw] leading-none text-ink/[0.05] min-[1420px]:text-[248px]" />
      </div>
    </footer>
  );
}
