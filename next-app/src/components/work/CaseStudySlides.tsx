import { caseStudySlides } from "@/content/case-studies";

export function CaseStudySlides({ slug }: { slug: string }) {
  const slides = caseStudySlides[slug];

  if (!slides?.length) {
    return (
      <div className="rounded-xl border border-hairline bg-surface-1 p-8 text-center">
        <p className="text-ink-subtle text-sm">Full content coming soon.</p>
      </div>
    );
  }

  return (
    // Slides are light-mode Figma exports — one dark mat around the whole
    // set plus a slight brightness/contrast trim keeps them from glaring
    // against the page instead of sitting edge-to-edge at full brightness.
    <div className="rounded-xl border border-hairline bg-surface-1 p-3 sm:p-5">
      <div className="rounded-lg overflow-hidden">
        {slides.map((slide) => (
          <img
            key={slide.src}
            src={slide.src}
            alt={slide.alt}
            className="w-full h-auto block"
            style={{ filter: "brightness(0.94) contrast(0.96) saturate(0.96)" }}
          />
        ))}
      </div>
    </div>
  );
}
