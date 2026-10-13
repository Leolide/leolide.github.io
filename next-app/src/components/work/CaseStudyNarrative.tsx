"use client";

import { useEffect, useState } from "react";
import { caseStudyNarrative, type NarrativeMedia } from "@/content/case-study-narrative";
import { ProtectedImage } from "@/components/ui/protected-image";
import { StatGrid } from "@/components/work/Stats";
import { AnimatePresence, motion } from "framer-motion";
import { EASE_OUT } from "@/lib/motion";

function Media({
  media,
  onOpen,
}: {
  media: NarrativeMedia;
  onOpen: (media: { src: string; alt: string; caption?: string }) => void;
}) {
  if (media.kind === "real") {
    return (
      <figure className="mt-5 rounded-xl border border-hairline bg-surface-1 p-3 sm:p-4">
        <button
          type="button"
          onClick={() => onOpen(media)}
          className="group relative block w-full rounded-md overflow-hidden cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          aria-label={`Zoom in on: ${media.alt}`}
        >
          <ProtectedImage
            src={media.src}
            alt={media.alt}
            wrapperClassName="contents"
            className="w-full h-auto block transition duration-200 ease-out filter brightness-[0.94] contrast-[0.96] saturate-[0.96] group-hover:brightness-[0.55] group-hover:scale-[1.015]"
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-out">
            <span className="flex items-center gap-2 rounded-full bg-black/55 backdrop-blur-sm px-4 py-2 text-white text-xs font-medium tracking-eyebrow uppercase">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M15 3h6v6" />
                <path d="M9 21H3v-6" />
                <path d="M21 3l-7 7" />
                <path d="M3 21l7-7" />
              </svg>
              Click to enlarge
            </span>
          </div>
        </button>
        {media.caption && (
          <figcaption className="text-ink-tertiary text-xs mt-3 px-1">
            {media.caption}
          </figcaption>
        )}
      </figure>
    );
  }

  return (
    <figure className="mt-5 rounded-xl border border-dashed border-hairline-strong bg-surface-1/60">
      <div
        className="aspect-video flex items-center justify-center px-6 py-6 text-center rounded-xl"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, transparent 0 9px, rgba(255,255,255,0.03) 9px 10px)",
        }}
      >
        <div>
          <p className="text-ink-tertiary text-[11px] font-medium tracking-eyebrow uppercase mb-2">
            Drop a screenshot in here
          </p>
          <p className="text-ink-subtle text-xs leading-relaxed max-w-[42ch] mx-auto">
            {media.caption}
          </p>
        </div>
      </div>
    </figure>
  );
}

function MediaGroup({
  media,
  onOpen,
}: {
  media: NarrativeMedia[] | undefined;
  onOpen: (media: { src: string; alt: string; caption?: string }) => void;
}) {
  if (!media || media.length === 0) return null;
  return (
    <div className="space-y-5">
      {media.map((m, i) => (
        <Media key={i} media={m} onOpen={onOpen} />
      ))}
    </div>
  );
}

/** Each block fades up once as it scrolls into view. Small distance, no stagger — quiet on purpose. */
const reveal = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5, ease: EASE_OUT },
} as const;

export function CaseStudyNarrative({ slug }: { slug: string }) {
  const data = caseStudyNarrative[slug];
  const [lightbox, setLightbox] = useState<
    { src: string; alt: string; caption?: string } | null
  >(null);

  useEffect(() => {
    if (!lightbox) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lightbox]);

  if (!data) return null;

  return (
    <div className="mb-12">
      {/* Objective */}
      <div className="mb-12 pb-10 border-b border-hairline">
        <p className="text-ink-tertiary text-xs font-medium tracking-eyebrow uppercase mb-2">
          Objective
        </p>
        <p className="text-ink-muted text-base leading-relaxed max-w-[620px]">
          {data.objective}
        </p>
      </div>

      {/* Sections */}
      <div className="space-y-14">
        {data.sections.map((section) => (
          <motion.section key={section.heading} className="max-w-[640px]" {...reveal}>
            <p className="text-accent text-[11px] font-medium tracking-eyebrow uppercase mb-2">
              {section.sub}
            </p>
            <h3 className="text-ink text-base font-semibold mb-3">
              {section.heading}
            </h3>
            <div className="space-y-3">
              {section.body.map((para, i) => (
                <p key={i} className="text-ink-subtle text-sm leading-relaxed">
                  {para}
                </p>
              ))}
            </div>
            <MediaGroup media={section.media} onOpen={setLightbox} />
          </motion.section>
        ))}
      </div>

      {/* Challenges and Compromises */}
      {data.compromise && (
        <motion.div
          className="mt-14 max-w-[640px] border-l-2 pl-5 py-1"
          style={{ borderColor: "var(--color-accent)" }}
          {...reveal}
        >
          <h3 className="text-accent text-base font-semibold mb-3">
            {data.compromise.heading ?? "Challenges and Compromises"}
          </h3>
          <div className="space-y-3">
            {data.compromise.body.map((para, i) => (
              <p key={i} className="text-ink-subtle text-sm leading-relaxed">
                {para}
              </p>
            ))}
          </div>
          <MediaGroup media={data.compromise.media} onOpen={setLightbox} />
        </motion.div>
      )}

      {/* Outcome */}
      {data.outcome && (
        <div className="mt-14 pt-10 border-t border-hairline-strong">
          <p className="text-ink-tertiary text-xs font-medium tracking-eyebrow uppercase mb-5">
            Outcome
          </p>
          <StatGrid stats={data.outcome.stats} className="mb-6" />
          <div className="space-y-3 max-w-[640px]">
            {data.outcome.body.map((para, i) => (
              <p key={i} className="text-ink-subtle text-sm leading-relaxed">
                {para}
              </p>
            ))}
          </div>
          <MediaGroup media={data.outcome.media} onOpen={setLightbox} />
        </div>
      )}

      {/* Lightbox — click anywhere (image included), Escape, or the close button all dismiss it */}
      <AnimatePresence>
      {lightbox && (
        <motion.div
          key="lightbox"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.2, ease: EASE_OUT } }}
          exit={{ opacity: 0, transition: { duration: 0.15, ease: EASE_OUT } }}
          className="fixed inset-0 z-50 h-dvh w-dvw flex items-center justify-center bg-black/90 p-4 sm:p-8 cursor-zoom-out overflow-hidden"
          style={{ height: "100dvh", width: "100dvw" }}
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
          aria-label={lightbox.alt}
        >
          <button
            type="button"
            onClick={() => setLightbox(null)}
            className="fixed top-4 right-4 sm:top-6 sm:right-6 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M18 6 6 18" />
              <path d="M6 6l12 12" />
            </svg>
          </button>
          <motion.div
            initial={{ scale: 0.96 }}
            animate={{ scale: 1, transition: { duration: 0.25, ease: EASE_OUT } }}
            exit={{ scale: 0.98, transition: { duration: 0.15, ease: EASE_OUT } }}
            className="flex min-h-0 min-w-0 max-h-full max-w-full flex-col items-center gap-4"
          >
            <ProtectedImage
              src={lightbox.src}
              alt={lightbox.alt}
              wrapperClassName="relative block"
              className="max-h-[82vh] max-w-[90vw] w-auto h-auto object-contain rounded-md"
            />
            {lightbox.caption && (
              <p className="max-w-[60ch] px-2 text-center text-xs text-white/60">
                {lightbox.caption}
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
}
