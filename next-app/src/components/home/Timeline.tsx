"use client";

import { motion, type Variants } from "framer-motion";
import { EASE_OUT } from "@/lib/motion";
import timelineData from "@/content/timeline.json";
import { Expertises } from "@/components/home/Expertises";
import ProfileCard from "@/components/home/ProfileCard";

type Entry = (typeof timelineData)[number];

/* One shared stagger for Experience + Education + Awards: the parent reveals once, and every
   heading and row follows in a single sequence instead of each list restarting its own count. */
const listParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};
const listItem: Variants = {
  hidden: { opacity: 0, x: -12 },
  show: { opacity: 1, x: 0, transition: { duration: 0.4, ease: EASE_OUT } },
};

/* ── Timeline row ───────────────────────────────────────── */
function TimelineItem({ entry }: { entry: Entry }) {
  const inner = (
    <div className="group flex gap-4 py-4 px-3 -mx-3 rounded-lg hover:bg-surface-1 transition-colors duration-150">
      <div className="shrink-0 w-9 h-9 rounded-lg bg-surface-2 border border-hairline flex items-center justify-center overflow-hidden">
        {entry.logo ? (
          <img
            src={entry.logo}
            alt={entry.org}
            className="object-contain"
            /* logoSize = optically balanced size: each file is trimmed to its visible mark and sized
               so every logo carries similar visual weight (see images/logos/) */
            style={"logoSize" in entry && entry.logoSize ? { width: entry.logoSize[0], height: entry.logoSize[1] } : { width: 24, height: 24 }}
          />
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 512 512" fill="currentColor" className="text-white">
            <path d="M336,176a80,80,0,0,0,0-160H176a80,80,0,0,0,0,160,80,80,0,0,0,0,160,80,80,0,1,0,80,80V176Z" />
            <circle cx="336" cy="256" r="80" />
          </svg>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-ink text-sm font-medium leading-snug">
              {entry.org}
              {entry.url && (
                <span className="ml-1 opacity-0 group-hover:opacity-50 transition-opacity text-xs">↗</span>
              )}
            </h3>
            <p className="text-ink-subtle text-xs mt-0.5">{entry.role}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-ink-subtle text-xs whitespace-nowrap">{entry.period}</p>
            {entry.location && (
              <p className="text-ink-tertiary text-xs mt-0.5">{entry.location}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <motion.div variants={listItem}>
      {entry.url ? (
        <a href={entry.url} target="_blank" rel="noopener noreferrer" className="block cursor-pointer">
          {inner}
        </a>
      ) : (
        <div className="cursor-default">{inner}</div>
      )}
    </motion.div>
  );
}

/* ── Section ────────────────────────────────────────────── */
export function Timeline() {
  return (
    <section id="about" className="py-24 px-6">
      <div className="max-w-[1280px] mx-auto">
        <div className="grid md:grid-cols-[340px_1fr] gap-16 items-start">

          {/* Left — sticky profile card */}
          <div className="md:sticky md:top-24">
            <motion.div
              className="mx-auto w-fit max-w-full"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: EASE_OUT }}
            >
              <ProfileCard
                avatarUrl="/images/Facetune_12-03-2025-15-19-43.png"
                miniAvatarUrl="/images/lide-avatar.webp"
                name="Lide Li"
                title="Product Designer"
                handle=""
                status="London"
                contactText="Connect"
                showUserInfo={false}
                enableTilt={true}
                enableMobileTilt={false}
                behindGlowEnabled={true}
                behindGlowColor="rgba(180, 180, 180, 0.2)"
                innerGradient="linear-gradient(145deg, #1a1a1a 0%, #0f0f0f 100%)"
                className="profile-card-sm"
                onContactClick={() => window.open("https://www.linkedin.com/in/lideli/", "_blank", "noopener")}
              />
              <a
                href="https://www.linkedin.com/in/lideli/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex w-full items-center justify-center rounded-md border border-hairline bg-surface-1 px-4 py-2 text-sm font-medium text-ink transition-[color,background-color,border-color,transform] duration-150 ease-out active:scale-[0.97] hover:bg-surface-2"
              >
                Connect on LinkedIn
              </a>
            </motion.div>
          </div>

          {/* Right — heading + expertises + timeline */}
          <div>
            <p className="text-ink-subtle text-xs font-medium tracking-eyebrow uppercase mb-5">
              About me
            </p>

            <div className="space-y-4 mb-12 max-w-prose">
              <p className="text-ink-muted text-sm leading-relaxed">
                Trained as an architect at Cambridge, now shipping product and code every day. Lide brings systems-first thinking rooted in architecture, urban planning, HCI, and AI to 0→1 product design.
              </p>
              <p className="text-ink-muted text-sm leading-relaxed">
                He's most excited by human-agent collaboration and spends most of his time designing agentic UX and observability interfaces. He's just as happy opening a PR as he is in Figma, and cares deeply about the full journey from rough idea to shipped product.
              </p>
              <p className="text-ink-muted text-sm leading-relaxed">
                Outside work, he leads{" "}
                <a
                  href="https://friends.figma.com/london/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink hover:text-accent underline underline-offset-2 transition-colors"
                >
                  Friends of Figma London
                </a>{" "}
                and founded{" "}
                <a
                  href="https://www.fouxysquad.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink hover:text-accent underline underline-offset-2 transition-colors"
                >
                  Fouxy Squad
                </a>
                , a design community in London.
              </p>
            </div>

            <Expertises />

            <motion.div
              variants={listParent}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-40px" }}
            >
              {([
                ["Experience", (e: Entry) => e.type === "work" || e.type === "community"],
                ["Education", (e: Entry) => e.type === "education"],
                ["Awards", (e: Entry) => e.type === "award"],
              ] as const).map(([label, match], i, all) => (
                <div key={label} className={i < all.length - 1 ? "mb-10" : undefined}>
                  <motion.p
                    variants={listItem}
                    className="text-ink-subtle text-xs font-medium tracking-eyebrow uppercase mb-4"
                  >
                    {label}
                  </motion.p>
                  {timelineData.filter(match).map((entry) => (
                    <TimelineItem key={entry.id} entry={entry} />
                  ))}
                </div>
              ))}
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
