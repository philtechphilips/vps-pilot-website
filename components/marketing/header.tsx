"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Icon, type IconName } from "@/components/icons";
import { Logotype } from "@/components/logo";
import { PROJECT_URL } from "@/lib/site";
import { cn } from "@/lib/utils";

const product: { title: string; desc: string; icon: IconName; href: string }[] = [
  { title: "Deployments", desc: "Git, Docker, Compose or systemd", icon: "rocket", href: "/#deploy" },
  { title: "Monitoring", desc: "Metrics, alerts, logs and uptime", icon: "activity", href: "/#monitor" },
  { title: "Databases", desc: "PostgreSQL, MySQL, MariaDB, Redis", icon: "database", href: "/#databases" },
  { title: "Security", desc: "Outbound-only agents and audit log", icon: "shield", href: "/#security" },
];

const links = [
  { label: "Docs", href: "/docs" },
  { label: "Install", href: "/#install" },
  { label: "FAQ", href: "/#faq" },
];

/** Full-width bar: transparent over the hero, frosted with a hairline once the page scrolls. */
export function MarketingHeader() {
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-300",
        scrolled || open ? "border-line bg-bg/75 backdrop-blur-xl" : "border-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1240px] items-center gap-8 px-4 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center" aria-label="VPSPilot home">
          <Logotype className="text-[19px]" />
        </Link>

        <nav className="hidden items-center gap-1 text-[14px] font-medium text-muted md:flex">
          <div className="relative" onMouseEnter={() => setMenu(true)} onMouseLeave={() => setMenu(false)}>
            <button
              type="button"
              className="flex h-9 items-center gap-1 rounded-lg px-3 transition-colors hover:text-fg"
              aria-expanded={menu}
              onClick={() => setMenu((m) => !m)}
            >
              Product <Icon name="chevron-down" size={13} className={cn("transition-transform duration-300", menu && "rotate-180")} />
            </button>
            {menu && (
              <div className="absolute top-full left-0 pt-2">
                <div className="grid w-[520px] animate-fade-up grid-cols-2 gap-1 rounded-2xl border border-line bg-bg-100 p-2 shadow-[0_30px_70px_-20px_rgb(0_0_0/0.35)]">
                  {product.map((p) => (
                    <a key={p.title} href={p.href} onClick={() => setMenu(false)} className="group flex gap-3 rounded-xl p-3 transition-colors hover:bg-ink/[0.05]">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-line bg-bg-200 text-muted transition-colors group-hover:text-fg">
                        <Icon name={p.icon} size={16} />
                      </span>
                      <span>
                        <span className="block text-[14px] text-fg">{p.title}</span>
                        <span className="block text-[13px] font-normal text-muted">{p.desc}</span>
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
          {links.map((l) => (
            <a key={l.label} href={l.href} className="flex h-9 items-center rounded-lg px-3 transition-colors hover:text-fg">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-2 md:flex">
          <a
            href={PROJECT_URL}
            target="_blank"
            rel="noreferrer"
            className="flex h-9 items-center gap-2 rounded-lg px-3 text-[14px] font-medium text-muted transition-colors hover:text-fg"
          >
            <Icon name="github" size={16} /> GitHub
          </a>
          <Link href="/docs/getting-started/install" className="btn-primary flex h-9 items-center rounded-lg px-4 text-[14px] font-medium">
            Get started
          </Link>
        </div>

        <button
          type="button"
          className="ml-auto inline-flex size-10 items-center justify-center rounded-lg border border-line md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <Icon name={open ? "x" : "menu"} />
        </button>
      </div>

      {open && (
        <div className="animate-fade-up border-t border-line px-4 pt-3 pb-5 md:hidden">
          <nav className="flex flex-col">
            {product.map((p) => (
              <a key={p.title} href={p.href} onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-lg px-2 py-3 text-[15px] text-fg">
                <Icon name={p.icon} size={16} className="text-subtle" /> {p.title}
              </a>
            ))}
            <div className="my-2 h-px bg-line" />
            {links.map((l) => (
              <a key={l.label} href={l.href} onClick={() => setOpen(false)} className="rounded-lg px-2 py-3 text-[15px] text-muted">
                {l.label}
              </a>
            ))}
          </nav>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <a href={PROJECT_URL} target="_blank" rel="noreferrer" className="flex h-11 items-center justify-center gap-2 rounded-lg border border-line text-[14px]">
              <Icon name="github" size={16} /> GitHub
            </a>
            <Link href="/docs/getting-started/install" className="btn-primary flex h-11 items-center justify-center rounded-lg text-[14px] font-medium">
              Get started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
