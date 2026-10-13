"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { usePageExit } from "@/lib/page-transition";

const BACK_HREF = "/#selected-works";

/** Lives in the fixed navbar (via Navbar's `back` slot), so it's always on screen. */
export function BackLink() {
  const exitTo = usePageExit();

  return (
    <>
      <span aria-hidden="true" className="hidden sm:inline text-ink-tertiary text-sm">/</span>
      <Link
        href={BACK_HREF}
        onClick={(e) => {
          // plain left-click → soft page exit first, same as the navbar links; modifier clicks open normally
          if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
          e.preventDefault();
          exitTo(BACK_HREF);
        }}
        className="group inline-flex items-center gap-1 rounded-sm text-sm text-ink-subtle hover:text-ink transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80"
      >
        {/* Desktop reads as a breadcrumb ("Lide Li / Projects"), so no arrow there.
            On mobile the name is hidden, so the arrow carries the "back" meaning. */}
        <ArrowLeft
          className="sm:hidden h-3.5 w-3.5 transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:-translate-x-0.5"
          aria-hidden="true"
        />
        Projects
      </Link>
    </>
  );
}
