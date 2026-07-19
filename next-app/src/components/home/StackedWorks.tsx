"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import worksData from "@/content/works-featured.json";

type Work = (typeof worksData)[number];

function WorkCard({ work, index }: { work: Work; index: number }) {
  const inner = (
    <div
      className="group relative isolate w-full h-full rounded-2xl overflow-hidden"
      style={{
        background: `radial-gradient(ellipse at 50% -10%, rgba(${work.accent},0.12) 0%, transparent 60%), linear-gradient(180deg, #101012 0%, #060607 100%)`,
      }}
    >
      {/* Floating mock image — centered, contained */}
      <div className="absolute inset-0 flex items-center justify-center px-8 pointer-events-none">
        <img
          src={work.image}
          alt={work.title}
          className="w-full object-contain opacity-70 group-hover:opacity-100 transition-all duration-500 group-hover:scale-[1.03] h-[220px] sm:h-[300px] lg:h-[340px]"
          style={{ filter: "drop-shadow(0 8px 40px rgba(0,0,0,0.6))", mixBlendMode: "screen" }}
        />
      </div>

      {/* Top glass bar — tags */}
      <div
        className="absolute top-0 left-0 right-0 flex flex-col items-start gap-3 px-5 py-4 xl:flex-row xl:items-center xl:justify-between"
        style={{
          background: "linear-gradient(to bottom, rgba(10,10,12,0.85) 0%, transparent 100%)",
        }}
      >
        <div className="flex flex-wrap items-center gap-1.5">
          {work.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-sm text-[10px] border border-white/10 text-white/50 font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2 whitespace-nowrap">
          {work.company && (
            <span className="text-white/60 text-xs font-medium">{work.company}</span>
          )}
          <span className="text-white/30 text-xs">{work.date}</span>
        </div>
      </div>

      {/* Bottom glass bar — title + description */}
      <div
        className="absolute bottom-0 left-0 right-0 px-5 py-4"
        style={{
          background: "linear-gradient(to top, rgba(8,8,10,0.95) 0%, rgba(8,8,10,0.6) 50%, transparent 100%)",
        }}
      >
        <h3 className="text-ink text-base font-semibold leading-snug tracking-tight">
          {work.title}
          <span className="ml-1.5 text-sm opacity-0 transition-opacity group-hover:opacity-50">
            {work.external ? "↗" : "→"}
          </span>
        </h3>
        <p className="text-ink-subtle text-xs mt-0.5 leading-relaxed">{work.description}</p>
      </div>
    </div>
  );

  return (
    <motion.div
      className="w-full h-[580px] sm:h-full"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.25, 0, 0, 1] }}
    >
      {work.external ? (
        <a href={work.url} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
          {inner}
        </a>
      ) : (
        <Link href={`/work/${work.slug}`} className="block w-full h-full">
          {inner}
        </Link>
      )}
    </motion.div>
  );
}

function WorkRow({ work, index }: { work: Work; index: number }) {
  const inner = (
    <div className="group flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-4">
        {/* Mock preview — miniature of the card treatment */}
        <div className="h-16 w-28 shrink-0 sm:h-20 sm:w-32">
          <img
            src={work.image}
            alt={work.title}
            className="h-full w-full object-contain opacity-70 transition-all duration-500 group-hover:opacity-100 group-hover:scale-[1.04]"
            style={{ mixBlendMode: "screen" }}
          />
        </div>
        <div className="min-w-0">
          <h3 className="text-ink text-base font-semibold leading-snug tracking-tight">
            {work.title}
            <span className="ml-1.5 text-sm opacity-0 transition-opacity group-hover:opacity-50">
              {work.external ? "↗" : "→"}
            </span>
          </h3>
          <p className="text-ink-subtle text-xs mt-0.5 leading-relaxed">{work.description}</p>
        </div>
      </div>
      <div className="flex flex-col gap-2 whitespace-nowrap sm:items-end sm:pl-6">
        <span className="flex items-center gap-2">
          {work.company && (
            <span className="text-white/60 text-xs font-medium">{work.company}</span>
          )}
          <span className="text-white/30 text-xs">{work.date}</span>
        </span>
        <span className="flex items-center gap-1.5">
          {work.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-sm text-[10px] border border-white/[0.06] text-white/30 font-medium"
            >
              {tag}
            </span>
          ))}
        </span>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: [0.25, 0, 0, 1] }}
    >
      {work.external ? (
        <a href={work.url} target="_blank" rel="noopener noreferrer" className="block">
          {inner}
        </a>
      ) : (
        <Link href={`/work/${work.slug}`} className="block">
          {inner}
        </Link>
      )}
    </motion.div>
  );
}

const PER_VIEW = 2;
const VIEWS = ["cards", "list"] as const;
type View = (typeof VIEWS)[number];

export function StackedWorks() {
  const [view, setView] = useState<View>("cards");
  const [start, setStart] = useState(0);
  const [direction, setDirection] = useState(1);
  const maxStart = worksData.length - PER_VIEW;

  const page = (dir: number) => {
    setDirection(dir);
    setStart((s) => Math.min(maxStart, Math.max(0, s + dir)));
  };

  return (
    <section id="selected-works" className="py-20 px-6">
      <div className="max-w-[1280px] mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-ink-subtle text-xs font-medium tracking-eyebrow">
            Featured projects
          </p>

          {/* Segmented control: card view / list view */}
          <div className="flex rounded-full border border-white/10 p-0.5">
            {VIEWS.map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setView(v)}
                aria-pressed={view === v}
                className={`px-3 py-1 rounded-full text-[11px] font-medium capitalize transition ${
                  view === v
                    ? "bg-white/10 text-white"
                    : "text-white/40 hover:text-white/70"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {view === "list" && (
          <div className="divide-y divide-white/[0.08] border-y border-white/[0.08]">
            {worksData.map((work, i) => (
              <WorkRow key={work.slug} work={work} index={i} />
            ))}
          </div>
        )}

        {view === "cards" && (
          <>
        {/* Mobile: all cards stacked */}
        <div className="grid grid-cols-1 gap-3 sm:hidden">
          {worksData.map((work, i) => (
            <WorkCard key={work.slug} work={work} index={i} />
          ))}
        </div>

        {/* Desktop: two cards at a time, arrows to page through the rest */}
        <div className="hidden sm:block">
          <motion.div
            key={start}
            initial={{ opacity: 0, x: 32 * direction }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, ease: [0.25, 0, 0, 1] }}
            className="grid grid-cols-2 gap-3 h-[480px] lg:h-[520px]"
          >
            {worksData.slice(start, start + PER_VIEW).map((work, i) => (
              <WorkCard key={work.slug} work={work} index={i} />
            ))}
          </motion.div>

          <div className="mt-4 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => page(-1)}
              disabled={start === 0}
              aria-label="Previous projects"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/60 transition hover:border-white/25 hover:text-white disabled:pointer-events-none disabled:opacity-30"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => page(1)}
              disabled={start === maxStart}
              aria-label="Next projects"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/60 transition hover:border-white/25 hover:text-white disabled:pointer-events-none disabled:opacity-30"
            >
              →
            </button>
          </div>
        </div>
          </>
        )}
      </div>
    </section>
  );
}
