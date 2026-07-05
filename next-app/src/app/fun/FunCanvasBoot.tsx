"use client";

import { useEffect } from "react";

type FunCanvasWindow = Window & {
  __funCanvasInit?: () => void;
  __funCanvasCleanup?: () => void;
};

/**
 * The canvas engine (/fun-canvas.js) only executes once per hard load, so
 * after client-side navigation back to /fun the fresh DOM would sit
 * uninitialised. This re-runs init on every mount (idempotent — the script
 * guards against double-init) and strips the body classes on unmount so the
 * rest of the site can scroll again.
 */
export function FunCanvasBoot() {
  useEffect(() => {
    const w = window as FunCanvasWindow;
    w.__funCanvasInit?.();
    return () => {
      w.__funCanvasCleanup?.();
    };
  }, []);

  return null;
}
