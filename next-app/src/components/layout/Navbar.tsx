"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Omnibar } from "@/components/layout/Omnibar";
import { AskPanel } from "@/components/ask/AskPanel";
import { usePageExit } from "@/lib/page-transition";

const ASK_PANEL_OPEN_KEY = "ask-panel-open";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Fun", href: "/fun" },
];

// variant="overlay": for pages that sit on a bright/full-bleed background (e.g. the /fun 3D story).
// Always-on dark glass bar + light text and a soft translucent active pill instead of the black one.
export function Navbar({
  extra,
  variant = "default",
}: { extra?: React.ReactNode; variant?: "default" | "overlay" } = {}) {
  const overlay = variant === "overlay";
  const focusRing = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80";
  const itemIdle = overlay
    ? "text-white/80 hover:text-white hover:bg-white/10"
    : "text-ink-subtle hover:text-ink hover:bg-surface-1";
  const itemActive = overlay ? "text-white bg-white/20" : "text-ink bg-surface-2";
  const pathname = usePathname();
  const exitTo = usePageExit();
  const [scrolled, setScrolled] = useState(false);
  const [omniOpen, setOmniOpen] = useState(false);
  // Start closed on server and client alike (SSR can't read localStorage);
  // the saved open state is restored after mount to avoid hydration mismatch.
  const [askOpen, setAskOpen] = useState(false);
  const [restoredOpen, setRestoredOpen] = useState(false);

  useEffect(() => {
    if (window.localStorage.getItem(ASK_PANEL_OPEN_KEY) === "true") {
      setRestoredOpen(true);
      setAskOpen(true);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(ASK_PANEL_OPEN_KEY, askOpen ? "true" : "false");
  }, [askOpen]);

  useEffect(() => {
    // Capture phase so body scrolling (used while the ask panel is docked)
    // is observed too — scroll events don't bubble.
    const handler = () =>
      setScrolled(Math.max(window.scrollY, document.body.scrollTop) > 16);
    window.addEventListener("scroll", handler, { passive: true, capture: true });
    return () => window.removeEventListener("scroll", handler, { capture: true });
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
          overlay
            ? "bg-black/40 backdrop-blur-md border-b border-white/10"
            : scrolled
              ? "bg-canvas/90 backdrop-blur-md"
              : "bg-transparent",
        ].join(" ")}
        style={{ right: "var(--ask-panel-offset-right, 0px)" }}
      >
        <div className="w-full max-w-[1280px] mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className={[
              "text-sm font-medium tracking-tight transition-colors rounded-sm",
              overlay ? "text-white hover:text-white/80" : "text-ink hover:text-ink-muted",
              focusRing,
            ].join(" ")}
          >
            Lide Li
          </Link>

          {/* Nav links */}
          <nav className="flex items-center gap-1">
            {NAV_LINKS.map(({ label, href }) => {
              const active =
                href.startsWith("/#")
                  ? pathname === "/"
                  : pathname === href || pathname.startsWith(href + "/");
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={(e) => {
                    // plain left-click on another page → soft fade-out first; modifier clicks open normally
                    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0 || pathname === href) return;
                    e.preventDefault();
                    exitTo(href);
                  }}
                  aria-current={active ? "page" : undefined}
                  className={[
                    "px-3 py-1.5 rounded-md text-sm transition-colors",
                    active ? itemActive : itemIdle,
                    focusRing,
                  ].join(" ")}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Search + Ask triggers (+ optional page-specific controls) */}
          <div className="flex items-center gap-1">
            {extra}
            <button
              onClick={() => setOmniOpen(true)}
              aria-label="Open search (⌘K)"
              className={["flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors text-sm", itemIdle, focusRing].join(" ")}
            >
              <Search size={14} />
              <span className="hidden sm:inline">Search</span>
              <kbd className={[
                "hidden sm:inline ml-1 text-xs font-mono rounded px-1.5 py-0.5 border",
                overlay ? "text-white/80 bg-white/10 border-white/20" : "text-ink-tertiary bg-surface-2 border-hairline",
              ].join(" ")}>
                ⌘K
              </kbd>
            </button>
            <button
              onClick={() => {
                setRestoredOpen(false);
                setAskOpen((o) => !o);
              }}
              aria-label="Ask about Lide"
              aria-expanded={askOpen}
              className={[
                "flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors text-sm",
                askOpen ? itemActive : itemIdle,
                focusRing,
              ].join(" ")}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent" aria-hidden="true">
                <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" />
              </svg>
              <span className="hidden sm:inline">Ask</span>
            </button>
          </div>
        </div>
      </header>

      <Omnibar open={omniOpen} onOpenChange={setOmniOpen} />
      <AskPanel
        open={askOpen}
        onClose={() => {
          setRestoredOpen(false);
          setAskOpen(false);
        }}
        skipInitialAnimation={restoredOpen}
      />
    </>
  );
}
