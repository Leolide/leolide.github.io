"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Omnibar } from "@/components/layout/Omnibar";

const NAV_LINKS = [
  { label: "Work", href: "/work" },
  { label: "About", href: "/#about" },
  { label: "Fun", href: "/fun" },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [omniOpen, setOmniOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOmniOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <header
        className={[
          "fixed top-0 inset-x-0 z-50 h-14 flex items-center transition-colors duration-300",
          scrolled
            ? "bg-canvas/90 border-b border-hairline backdrop-blur-md"
            : "bg-transparent",
        ].join(" ")}
      >
        <div className="w-full max-w-[1280px] mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="text-ink text-sm font-medium tracking-tight hover:text-ink-muted transition-colors"
          >
            Lide Li
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ label, href }) => {
              const active =
                href.startsWith("/#")
                  ? pathname === "/"
                  : pathname === href || pathname.startsWith(href + "/");
              return (
                <Link
                  key={href}
                  href={href}
                  className={[
                    "px-3 py-1.5 rounded-md text-sm transition-colors",
                    active
                      ? "text-ink bg-surface-2"
                      : "text-ink-subtle hover:text-ink hover:bg-surface-1",
                  ].join(" ")}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Search trigger */}
          <button
            onClick={() => setOmniOpen(true)}
            aria-label="Open search (⌘K)"
            className="flex items-center gap-2 px-3 py-1.5 rounded-md text-ink-subtle hover:text-ink hover:bg-surface-1 transition-colors text-sm"
          >
            <Search size={14} />
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden sm:inline ml-1 text-xs text-ink-tertiary font-mono bg-surface-2 border border-hairline rounded px-1.5 py-0.5">
              ⌘K
            </kbd>
          </button>
        </div>
      </header>

      <Omnibar open={omniOpen} onOpenChange={setOmniOpen} />
    </>
  );
}
