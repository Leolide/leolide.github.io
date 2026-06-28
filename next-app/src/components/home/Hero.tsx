"use client";

import dynamic from "next/dynamic";
import Link from "next/link";

const SplineViewer = dynamic(() => import("@/components/home/SplineViewer"), {
  ssr: false,
  loading: () => <div className="w-full h-full" />,
});

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-14 overflow-hidden">
      {/* Spline — desktop only */}
      <div className="absolute inset-0 hidden md:block pointer-events-none">
        <SplineViewer />
      </div>

      <div className="relative z-10 max-w-[1280px] mx-auto px-6 w-full py-24">
        <div className="max-w-[640px]">
          {/* Eyebrow */}
          <p className="text-ink-subtle text-xs font-medium tracking-eyebrow uppercase mb-6">
            Product Designer
          </p>

          {/* Headline */}
          <h1 className="text-[clamp(40px,6vw,68px)] font-semibold leading-[1.05] tracking-display text-ink mb-6">
            Lide is a Product Designer crafting experiences that blend{" "}
            <span className="text-accent">Design, Data, and AI</span>
          </h1>

          {/* Sub */}
          <p className="text-ink-muted text-lg leading-relaxed mb-10 max-w-[480px]">
            Currently at{" "}
            <a
              href="https://www.palantir.com/uk/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink hover:text-accent transition-colors underline underline-offset-2"
            >
              Palantir
            </a>
            , building tools for agentic workflows and observability.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3 items-center">
            <Link
              href="/work"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-accent hover:bg-accent-hover text-white text-sm font-medium transition-colors"
            >
              View work
            </Link>
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
          <div className="flex gap-4 mt-10">
            <a
              href="https://www.linkedin.com/in/lideli/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-ink-subtle hover:text-ink transition-colors text-sm"
            >
              LinkedIn
            </a>
            <a
              href="https://x.com/lidethemaker"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X"
              className="text-ink-subtle hover:text-ink transition-colors text-sm"
            >
              X
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
