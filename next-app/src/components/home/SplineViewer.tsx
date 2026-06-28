"use client";

import { useEffect, useRef } from "react";

export default function SplineViewer() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.type = "module";
    script.src =
      "https://unpkg.com/@splinetool/viewer@1.9.82/build/spline-viewer.js";
    document.head.appendChild(script);

    script.onload = () => {
      if (!ref.current) return;
      const viewer = document.createElement("spline-viewer") as HTMLElement & {
        url: string;
      };
      viewer.setAttribute(
        "url",
        "https://prod.spline.design/7CNqumqyYForOYJY/scene.splinecode"
      );
      viewer.setAttribute("loading", "lazy");
      viewer.style.cssText = "width:100%;height:100%;";
      ref.current.appendChild(viewer);

      /* hide the Spline badge */
      const observer = new MutationObserver(() => {
        const shadow = viewer.shadowRoot;
        if (!shadow) return;
        if (!shadow.querySelector("#spline-badge-hide")) {
          const s = document.createElement("style");
          s.id = "spline-badge-hide";
          s.textContent = "#logo { display: none !important; }";
          shadow.appendChild(s);
          observer.disconnect();
        }
      });
      observer.observe(viewer, { childList: true, subtree: true });
    };

    return () => {
      script.remove();
    };
  }, []);

  return (
    <div
      ref={ref}
      className="absolute right-0 top-0 w-[55%] h-full"
      aria-hidden="true"
    />
  );
}
