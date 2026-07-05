"use client";

import { useEffect, useRef, useState } from "react";

const BADGE_CSS = `
  #logo, #spline-watermark,
  a[href*="spline.design"], a[href*="splinetool"],
  [id*="watermark"], [class*="watermark"], [class*="logo-badge"] {
    display: none !important;
    opacity: 0 !important;
    pointer-events: none !important;
  }
`;

function injectBadgeKiller(shadow: ShadowRoot) {
  if (shadow.querySelector("#spline-badge-hide")) return;
  const s = document.createElement("style");
  s.id = "spline-badge-hide";
  s.textContent = BADGE_CSS;
  shadow.appendChild(s);
}

export default function SplineViewer() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.type = "module";
    script.src =
      "https://unpkg.com/@splinetool/viewer@1.9.82/build/spline-viewer.js";
    document.head.appendChild(script);

    script.onload = () => {
      if (!ref.current) return;
      const viewer = document.createElement("spline-viewer") as HTMLElement;
      viewer.setAttribute(
        "url",
        "https://prod.spline.design/7CNqumqyYForOYJY/scene.splinecode"
      );
      viewer.setAttribute("loading", "lazy");
      viewer.style.cssText = "width:100%;height:100%;display:block;";
      ref.current.appendChild(viewer);

      /* Watch shadow root and kill badge on every mutation */
      const observer = new MutationObserver(() => {
        const shadow = (viewer as Element).shadowRoot;
        if (shadow) injectBadgeKiller(shadow);
      });
      observer.observe(viewer, { childList: true, subtree: true });

      /* Poll until shadow root exists, kill badge, then reveal */
      const tryKill = setInterval(() => {
        const shadow = (viewer as Element).shadowRoot;
        if (shadow) {
          injectBadgeKiller(shadow);
          /* Wait one more tick so the badge style takes effect before we show */
          setTimeout(() => setVisible(true), 120);
          clearInterval(tryKill);
        }
      }, 80);

      /* Hard fallback — reveal after 4 s even if shadow root never appeared */
      const fallback = setTimeout(() => {
        setVisible(true);
        clearInterval(tryKill);
      }, 4000);

      return () => {
        clearInterval(tryKill);
        clearTimeout(fallback);
        observer.disconnect();
      };
    };

    return () => script.remove();
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Viewer fades in only after badge is confirmed killed */}
      <div
        ref={ref}
        className="w-full h-full transition-opacity duration-700"
        style={{ opacity: visible ? 1 : 0 }}
      />

      {/* Left fade — keeps text readable */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, #010102 0%, #010102 28%, transparent 62%)",
        }}
      />

      {/* Opaque patch over the exact spot Spline puts its badge */}
      <div
        className="absolute bottom-0 left-0 pointer-events-none"
        style={{ width: 200, height: 56, background: "#010102" }}
      />
    </div>
  );
}
