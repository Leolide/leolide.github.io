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

      {/* Lightweight still inspired by the Spline scene for phones and small tablets */}
      <div className="absolute inset-0 md:hidden" aria-hidden="true">
        <img
          src="/mobile-hero-fallback.webp"
          alt=""
          className="h-full w-full object-cover object-center opacity-50"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(1,1,2,0.92) 0%, rgba(1,1,2,0.62) 46%, rgba(1,1,2,0.12) 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(1,1,2,0.28) 0%, transparent 42%, #010102 100%)",
          }}
        />
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

          {/* Primary CTA */}
          <div className="flex flex-wrap gap-3 items-center">
            <a
              href="#selected-works"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-surface-1 hover:bg-surface-2 text-ink text-sm font-medium border border-hairline transition-[color,background-color,border-color,transform] duration-150 ease-out active:scale-[0.97]"
            >
              View my work
            </a>
            <a
              href="#about"
              className="inline-flex items-center gap-2 rounded-md border border-hairline bg-surface-1 px-4 py-2 text-sm font-medium text-ink transition-[color,background-color,border-color,transform] duration-150 ease-out active:scale-[0.97] hover:bg-surface-2"
            >
              About me
            </a>
          </div>

          {/* Social dock */}
          <div className="flex gap-3 mt-10">
            <a
              href="https://www.linkedin.com/in/lideli/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-hairline bg-surface-1 hover:bg-surface-2 text-ink-subtle hover:text-ink transition-[color,background-color,border-color,transform] duration-150 ease-out active:scale-[0.97]"
            >
              <svg width="14" height="14" viewBox="0 0 90 90" fill="currentColor">
                <path d="M1.48 29.91h18.657v60.01H1.48V29.91zM10.809.08c5.963 0 10.809 4.846 10.809 10.819 0 5.967-4.846 10.813-10.809 10.813C4.832 21.712 0 16.866 0 10.899 0 4.926 4.832.08 10.809.08"/>
                <path d="M31.835 29.91h17.89v8.206h.255c2.49-4.72 8.576-9.692 17.647-9.692C86.514 28.424 90 40.849 90 57.007V89.92H71.357V60.737c0-6.961-.121-15.912-9.692-15.912-9.706 0-11.187 7.587-11.187 15.412V89.92H31.835V29.91z"/>
              </svg>
            </a>
            <a
              href="https://github.com/Leolide"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-hairline bg-surface-1 hover:bg-surface-2 text-ink-subtle hover:text-ink transition-[color,background-color,border-color,transform] duration-150 ease-out active:scale-[0.97]"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.53-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.69 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z"/>
              </svg>
            </a>
            <a
              href="https://x.com/lidethemaker"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X / Twitter"
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-hairline bg-surface-1 hover:bg-surface-2 text-ink-subtle hover:text-ink transition-[color,background-color,border-color,transform] duration-150 ease-out active:scale-[0.97]"
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
