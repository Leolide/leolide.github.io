"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface WorkCardProps {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  accent: string;
  image: string;
  protected?: boolean;
  index?: number;
}

export function WorkCard({
  slug,
  title,
  date,
  description,
  tags,
  accent,
  image,
  protected: isProtected,
  index = 0,
}: WorkCardProps) {
  const [r, g, b] = accent.split(",").map(Number);
  const accentCss = `rgb(${r},${g},${b})`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.4, delay: index * 0.07, ease: [0.25, 0, 0, 1] }}
    >
      <Link href={`/work/${slug}`} className="group block rounded-xl border border-hairline bg-surface-1 overflow-hidden hover:border-hairline-strong transition-colors duration-200">
        {/* Image — compact fixed height */}
        <div
          className="relative h-48 bg-surface-2 overflow-hidden"
          style={{
            backgroundImage: `url('${image}')`,
            backgroundSize: "cover",
            backgroundPosition: "center top",
          }}
        >
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-15 transition-opacity duration-500"
            style={{
              background: `radial-gradient(ellipse at center, ${accentCss} 0%, transparent 70%)`,
            }}
          />
        </div>

        {/* Body */}
        <div className="p-5">
          <div className="flex items-center gap-2.5 mb-3">
            <span
              className="block w-5 h-0.5 rounded-full shrink-0"
              style={{ backgroundColor: accentCss }}
            />
            <span className="text-ink-subtle text-xs font-medium">{date}</span>
            {isProtected && (
              <span className="ml-auto text-[10px] text-ink-tertiary border border-hairline rounded px-1.5 py-0.5">
                Protected
              </span>
            )}
          </div>

          <h3 className="text-ink text-sm font-semibold leading-snug tracking-tight mb-2 group-hover:text-white transition-colors">
            {description}{" "}
            <span className="opacity-30 group-hover:opacity-70 transition-opacity">↗</span>
          </h3>

          <div className="flex flex-wrap gap-1.5 mt-3">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded text-[11px] border"
                style={{ borderColor: `${accentCss}40`, color: accentCss }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
