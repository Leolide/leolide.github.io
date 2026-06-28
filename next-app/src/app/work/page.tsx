import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WorkCard } from "@/components/work/WorkCard";
import worksPro from "@/content/works-pro.json";

export const metadata = {
  title: "Work — Lide Li",
  description: "Product design case studies across AI, SaaS, and enterprise tools.",
};

export default function WorkPage() {
  return (
    <>
      <Navbar />
      <main className="pt-32 pb-24 px-6 min-h-screen">
        <div className="max-w-[1280px] mx-auto">
          {/* Header */}
          <div className="mb-16">
            <p className="text-ink-subtle text-xs font-medium tracking-eyebrow uppercase mb-4">
              Case studies
            </p>
            <h1 className="text-[clamp(32px,5vw,56px)] font-semibold leading-[1.08] tracking-display text-ink">
              Work
            </h1>
          </div>

          {/* Grid */}
          <div className="grid gap-6 sm:grid-cols-2">
            {worksPro.map((work, i) => (
              <WorkCard
                key={work.slug}
                slug={work.slug}
                title={work.title}
                date={work.date}
                description={work.biggerHeading}
                tags={work.tags}
                accent={work.accent}
                image={work.mainImage}
                protected={work.protected}
                index={i}
              />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
