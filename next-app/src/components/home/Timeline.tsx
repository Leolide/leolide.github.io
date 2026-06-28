"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import timelineData from "@/content/timeline.json";

type Entry = (typeof timelineData)[number];

function TimelineItem({ entry, index }: { entry: Entry; index: number }) {
  const inner = (
    <div className="group flex gap-5 py-5 border-b border-hairline last:border-0 cursor-default">
      {/* Logo */}
      <div className="shrink-0 w-10 h-10 rounded-lg bg-surface-2 border border-hairline flex items-center justify-center overflow-hidden">
        {entry.logo ? (
          <img
            src={entry.logo}
            alt={entry.org}
            className="w-7 h-7 object-contain"
          />
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 512 512"
            fill="currentColor"
            className="text-ink-subtle"
          >
            <path d="M336,176a80,80,0,0,0,0-160H176a80,80,0,0,0,0,160,80,80,0,0,0,0,160,80,80,0,1,0,80,80V176Z" />
            <circle cx="336" cy="256" r="80" />
          </svg>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-ink text-base font-medium leading-snug group-hover:text-accent transition-colors">
              {entry.org}
              {entry.url && (
                <span className="ml-1.5 opacity-0 group-hover:opacity-60 transition-opacity text-xs">
                  ↗
                </span>
              )}
            </h3>
            <p className="text-ink-subtle text-sm mt-0.5">{entry.role}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-ink-subtle text-xs font-medium whitespace-nowrap">
              {entry.period}
            </p>
            {entry.location && (
              <p className="text-ink-tertiary text-xs mt-0.5">{entry.location}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const wrapped = entry.url ? (
    <a href={entry.url} target="_blank" rel="noopener noreferrer" className="block">
      {inner}
    </a>
  ) : (
    inner
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.25, 0, 0, 1] }}
    >
      {wrapped}
    </motion.div>
  );
}

export function Timeline() {
  return (
    <section id="about" className="py-24 px-6 border-t border-hairline">
      <div className="max-w-[1280px] mx-auto">
        <div className="grid md:grid-cols-[1fr_2fr] gap-16">
          {/* Left — bio */}
          <div className="space-y-6">
            <div className="rounded-xl overflow-hidden bg-surface-1 border border-hairline aspect-[3/4] max-w-[280px]">
              <img
                src="/images/Facetune_12-03-2025-15-19-43.png"
                alt="Lide Li"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-ink-muted text-base leading-relaxed">
              Lide is a Product Designer who codes, focused on 0→1 AI, SaaS,
              and developer tools.
              <br />
              <br />
              Outside of work, he founded{" "}
              <a
                href="https://www.fouxysquad.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink hover:text-accent underline underline-offset-2 transition-colors"
              >
                Fouxy Squad
              </a>
              , a London-based design community.
            </p>
            <a
              href="https://www.linkedin.com/in/lideli/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-surface-1 hover:bg-surface-2 text-ink text-sm font-medium border border-hairline transition-colors"
            >
              Connect on LinkedIn
            </a>
          </div>

          {/* Right — timeline */}
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-ink mb-8">
              About me
            </h2>
            <p className="text-ink-muted text-lg leading-relaxed mb-10 max-w-prose">
              I create intuitive, meaningful designs that connect people and
              technology. I focus on turning insights into impactful experiences
              that inspire and improve everyday life.
            </p>
            <div className="divide-y divide-hairline">
              {timelineData.map((entry, i) => (
                <TimelineItem key={entry.id} entry={entry} index={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
