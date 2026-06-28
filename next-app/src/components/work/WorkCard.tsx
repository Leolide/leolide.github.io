"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
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

  const inner = (
    <div
      className="group relative rounded-xl border border-hairline bg-surface-1 overflow-hidden hover:border-hairline-strong transition-all duration-300 h-full"
    >
      {/* Image */}
      <div
        className="relative aspect-[16/9] bg-surface-2 overflow-hidden"
        style={{
          backgroundImage: `url('${image}')`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      >
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500"
          style={{
            background: `radial-gradient(ellipse at center, ${accentCss} 0%, transparent 70%)`,
          }}
        />
      </div>

      {/* Body */}
      <div className="p-6">
        <div className="flex items-center gap-3 mb-3">
          <span
            className="block w-6 h-0.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: accentCss }}
          />
          <span className="text-ink-subtle text-xs font-medium">{date}</span>
          {isProtected && (
            <span className="ml-auto text-xs text-ink-tertiary border border-hairline rounded px-1.5 py-0.5">
              Protected
            </span>
          )}
        </div>
        <h3 className="text-ink text-base font-semibold leading-snug tracking-tight mb-2 group-hover:text-white transition-colors">
          {title}{" "}
          <span className="opacity-30 group-hover:opacity-80 transition-opacity">
            ↗
          </span>
        </h3>
        <p className="text-ink-subtle text-sm leading-relaxed mb-4 line-clamp-2">
          {description}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {tags.slice(0, 4).map((tag) => (
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, delay: index * 0.07, ease: [0.25, 0, 0, 1] }}
      className="h-full"
    >
      <Link href={`/work/${slug}`} className="block h-full">
        {inner}
      </Link>
    </motion.div>
  );
}
