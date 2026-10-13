"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";
import { EASE_OUT } from "@/lib/motion";
import { fetchDownloads, formatPlus, type DownloadPeriod } from "@/lib/npm-downloads";

export type Stat = {
  value: string;
  label: string;
  /** Optional live source; the baked-in `value` is shown until it loads (and if it fails). */
  live?: { package: string; period: string; since?: string };
};

/** Counts a stat like "5,500+" or "57%" up from zero the first time it's seen.
 *  Renders the final value on the server / without JS; writes to the DOM directly
 *  (no per-frame React state). Reduced-motion visitors just see the number. */
export function StatValue({
  value,
  className = "text-ink text-2xl sm:text-3xl font-semibold tracking-tight",
}: {
  value: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const shown = useRef(0); // the number currently on screen, so a live update animates from here
  const [initial] = useState(value); // React only ever renders the first value; updates go via the DOM
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const match = value.match(/^([^\d]*)([\d,]+(?:\.\d+)?)(.*)$/);
  const target = match ? parseFloat(match[2].replace(/,/g, "")) : NaN;
  const prefix = match?.[1] ?? "";
  const suffix = match?.[3] ?? "";
  const reduce = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const animated = !Number.isNaN(target) && !reduce;

  useEffect(() => {
    if (animated && ref.current && !inView) ref.current.textContent = `${prefix}0${suffix}`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!animated) {
      el.textContent = value;
      return;
    }
    if (!inView) return;
    const controls = animate(shown.current, target, {
      duration: shown.current === 0 ? 1.1 : 0.6,
      ease: EASE_OUT,
      onUpdate: (v) => {
        shown.current = v;
        el.textContent = `${prefix}${Math.round(v).toLocaleString("en-US")}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [inView, target, prefix, suffix, animated, value]);

  return (
    <div ref={ref} className={`${className} tabular-nums`}>
      {initial}
    </div>
  );
}

const PERIODS: DownloadPeriod[] = ["total", "last-month", "last-week"];

/** Shows the baked-in value immediately, then swaps in the live npm number once it arrives. */
function LiveStat({ value, live }: { value: string; live: NonNullable<Stat["live"]> }) {
  const [current, setCurrent] = useState(value);

  useEffect(() => {
    const period = PERIODS.find((p) => p === live.period);
    if (!period) return;
    let cancelled = false;
    fetchDownloads(live.package, period, live.since).then((n) => {
      if (!cancelled && n) setCurrent(formatPlus(n));
    });
    return () => {
      cancelled = true;
    };
  }, [live.package, live.period, live.since]);

  return <StatValue value={current} />;
}

/** The three-up number row used by a case study's Outcome and its public headline numbers. */
export function StatGrid({ stats, className = "" }: { stats: Stat[]; className?: string }) {
  return (
    <div className={`grid grid-cols-3 gap-x-6 sm:gap-x-10 border-t border-hairline ${className}`}>
      {stats.map((stat) => (
        <div key={stat.label} className="py-5 pr-4 border-r border-hairline last:border-r-0 last:pr-0">
          {stat.live ? <LiveStat value={stat.value} live={stat.live} /> : <StatValue value={stat.value} />}
          <div className="text-ink-tertiary text-xs mt-1 leading-snug">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
