"use client";

import { motion } from "framer-motion";

const EXPERTISES = [
  {
    num: "01",
    title: "0→1 Product Design",
    desc: "Thrives as the only or founding designer. Moves fast from ambiguity to shipped AI products.",
  },
  {
    num: "02",
    title: "Design Engineering",
    desc: "Ships production code, not just specs. Builds design systems and component libraries end-to-end.",
  },
  {
    num: "03",
    title: "AI & Agentic Workflow Design",
    desc: "Monitoring, orchestration and observability across multi-agent, long-running and pro-code agent systems.",
  },
  {
    num: "04",
    title: "Community Building",
    desc: "Founded Fouxy Squad, now hundreds of members in London. Leads Friends of Figma London.",
  },
];

export function Expertises() {
  return (
    <div className="mb-14">
      <p className="text-ink-subtle text-xs font-medium tracking-eyebrow uppercase mb-6">
        Expertises
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {EXPERTISES.map((item, i) => (
          <motion.div
            key={item.num}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: i * 0.06, ease: [0.25, 0, 0, 1] }}
            className="rounded-xl border border-hairline bg-surface-1 p-4 flex flex-col gap-2"
          >
            <span className="text-ink-tertiary text-xs font-mono">{item.num}</span>
            <div>
              <h3 className="text-ink text-sm font-semibold leading-snug tracking-tight mb-1">
                {item.title}
              </h3>
              <p className="text-ink-subtle text-xs leading-relaxed">{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
