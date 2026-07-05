"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import worksData from "@/content/works-featured.json";

type Work = (typeof worksData)[number];

function WorkCard({ work, index }: { work: Work; index: number }) {
  const inner = (
    <div
      className="group relative w-full h-full rounded-2xl overflow-hidden"
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
        className="absolute top-0 left-0 right-0 px-5 py-4 flex items-center justify-between"
        style={{
          background: "linear-gradient(to bottom, rgba(10,10,12,0.85) 0%, transparent 100%)",
        }}
      >
        <div className="flex items-center gap-1.5">
          {work.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-sm text-[10px] border border-white/10 text-white/50 font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2">
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
          {work.external && (
            <span className="ml-1.5 opacity-0 group-hover:opacity-50 transition-opacity text-sm">↗</span>
          )}
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

export function StackedWorks() {
  return (
    <section id="selected-works" className="py-20 px-6">
      <div className="max-w-[1280px] mx-auto">
        <p className="text-ink-subtle text-xs font-medium tracking-eyebrow mb-6">
          Featured projects
        </p>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:h-[480px] lg:h-[520px]">
          {worksData.map((work, i) => (
            <WorkCard key={work.slug} work={work} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
