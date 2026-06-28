"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import worksData from "@/content/works-featured.json";

type Work = (typeof worksData)[number];

function WorkCard({ work, index }: { work: Work; index: number }) {
  const [r, g, b] = work.accent.split(",").map(Number);
  const accentCss = `rgb(${r},${g},${b})`;

  const card = (
    <div
      className="group relative rounded-xl border border-hairline bg-surface-1 overflow-hidden cursor-pointer hover:border-hairline-strong transition-colors"
      style={
        {
          "--card-accent": accentCss,
        } as React.CSSProperties
      }
    >
      {/* Image area */}
      <div
        className="relative aspect-[16/9] bg-surface-2 overflow-hidden"
        style={{ backgroundImage: `url('${work.image}')`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        {/* Glow overlay */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500"
          style={{ background: `radial-gradient(ellipse at center, ${accentCss} 0%, transparent 70%)` }}
        />
        {/* Grid lines (decorative) */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(${accentCss}22 1px, transparent 1px), linear-gradient(90deg, ${accentCss}22 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Card body */}
      <div className="p-6">
        <div className="flex items-center gap-3 mb-3">
          <span
            className="block w-6 h-0.5 rounded-full"
            style={{ backgroundColor: accentCss }}
          />
          <span className="text-ink-subtle text-xs font-medium">{work.date}</span>
        </div>
        <h3 className="text-ink text-lg font-semibold leading-snug tracking-tight mb-2 group-hover:text-white transition-colors">
          {work.title}{" "}
          <span className="opacity-40 group-hover:opacity-100 transition-opacity">↗</span>
        </h3>
        <p className="text-ink-subtle text-sm leading-relaxed mb-4">{work.description}</p>
        <div className="flex flex-wrap gap-2">
          {work.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded text-xs border"
              style={{ borderColor: `${accentCss}40`, color: accentCss }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  if (work.external) {
    return (
      <a href={work.url} target="_blank" rel="noopener noreferrer">
        {card}
      </a>
    );
  }
  if (work.protected) {
    return (
      <Link href={`/work/${work.slug}`}>{card}</Link>
    );
  }
  return <Link href={work.url}>{card}</Link>;
}

export function StackedWorks() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-[1280px] mx-auto">
        <div className="flex items-baseline justify-between mb-12">
          <h2 className="text-2xl font-semibold tracking-tight text-ink">
            Selected Works
          </h2>
          <Link
            href="/work"
            className="text-ink-subtle hover:text-ink text-sm transition-colors"
          >
            View all →
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
          {worksData.map((work, i) => (
            <motion.div
              key={work.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.25, 0, 0, 1] }}
            >
              <WorkCard work={work} index={i} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
