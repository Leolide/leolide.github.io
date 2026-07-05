"use client";

import dynamic from "next/dynamic";

const SplineViewer = dynamic(() => import("@/components/home/SplineViewer"), {
  ssr: false,
  loading: () => <div className="w-full h-full" />,
});

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-14 overflow-hidden">
      {/* Spline background — desktop only, interactive */}
      <div className="absolute inset-0 hidden md:block">
        <SplineViewer />
      </div>

      {/* Bottom fade — dissolves hero into canvas, no pointer capture */}
      <div
        className="absolute bottom-0 inset-x-0 h-40 pointer-events-none z-10 select-none"
        style={{ background: "linear-gradient(to bottom, transparent 0%, #010102 100%)" }}
      />

      {/* Content — outer wrapper passes through so Spline on the right stays interactive */}
      <div className="relative z-20 max-w-[1280px] mx-auto px-6 w-full py-24 pointer-events-none">
        <div className="max-w-[560px] pointer-events-auto">
          {/* Headline — no redundant eyebrow or "Lide is a Product Designer" prefix */}
          <h1 className="text-[clamp(22px,2.3vw,32px)] font-semibold leading-[1.2] tracking-tight text-ink mb-5">
            Crafting experiences that blend{" "}
            <span className="text-gradient-brand">Design, Data, and AI</span>
          </h1>

          {/* Sub */}
          <p className="text-ink-muted text-base leading-relaxed mb-8">
            Lide currently works for{" "}
            <a
              href="https://www.palantir.com/uk/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink hover:text-accent transition-colors underline underline-offset-2"
            >
              Palantir
            </a>
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3 items-center">
            <a
              href="#selected-works"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-surface-1 hover:bg-surface-2 text-ink text-sm font-medium border border-hairline transition-colors"
            >
              View my work
            </a>
            <a
              href="https://www.linkedin.com/in/lideli/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-surface-1 hover:bg-surface-2 text-ink text-sm font-medium border border-hairline transition-colors"
            >
              Connect on LinkedIn
            </a>
          </div>

          {/* Social dock */}
          <div className="flex gap-3 mt-10">
            <a
              href="https://www.linkedin.com/in/lideli/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-hairline bg-surface-1 hover:bg-surface-2 text-ink-subtle hover:text-ink transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 90 90" fill="currentColor">
                <path d="M1.48 29.91h18.657v60.01H1.48V29.91zM10.809.08c5.963 0 10.809 4.846 10.809 10.819 0 5.967-4.846 10.813-10.809 10.813C4.832 21.712 0 16.866 0 10.899 0 4.926 4.832.08 10.809.08"/>
                <path d="M31.835 29.91h17.89v8.206h.255c2.49-4.72 8.576-9.692 17.647-9.692C86.514 28.424 90 40.849 90 57.007V89.92H71.357V60.737c0-6.961-.121-15.912-9.692-15.912-9.706 0-11.187 7.587-11.187 15.412V89.92H31.835V29.91z"/>
              </svg>
            </a>
            <a
              href="https://x.com/lidethemaker"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X / Twitter"
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-hairline bg-surface-1 hover:bg-surface-2 text-ink-subtle hover:text-ink transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
