"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

// Soft page transitions (Emil Kowalski's "animate" rules):
//   purpose  = preventing a jarring change between two very different pages
//   tool     = plain CSS transition / animation on opacity (no library, off main thread)
//   timing   = exit 220ms, enter 320ms, strong ease-out cubic-bezier(0.23, 1, 0.32, 1)
// Only the page content fades (elements marked data-page-content); the navbar never moves.
// Opacity only: transform/filter on these wrappers would break their position:fixed children.
const EXIT_MS = 220;

export function usePageExit() {
  const router = useRouter();
  return (href: string) => {
    const root = document.documentElement;
    if (root.hasAttribute("data-leaving")) return;
    router.prefetch(href);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    root.setAttribute("data-leaving", "");
    window.setTimeout(() => router.push(href), reduce ? 0 : EXIT_MS);
  };
}

/** Mounted once in the root layout: clears the "leaving" state when the new page arrives. */
export function PageTransitionReset() {
  const pathname = usePathname();
  useEffect(() => {
    document.documentElement.removeAttribute("data-leaving");
  }, [pathname]);
  return null;
}
