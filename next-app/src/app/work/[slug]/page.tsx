import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PasswordGate } from "@/components/work/PasswordGate";
import { CaseStudySlides } from "@/components/work/CaseStudySlides";
import { caseStudySlides } from "@/content/case-studies";
import worksPro from "@/content/works-pro.json";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return worksPro.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const work = worksPro.find((w) => w.slug === slug);
  if (!work) return {};
  return {
    title: `${work.biggerHeading} — Lide Li`,
    description: work.title,
  };
}

export default async function WorkDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const work = worksPro.find((w) => w.slug === slug);
  if (!work) notFound();

  return (
    <>
      <Navbar />
      <main className="pt-28 pb-24 px-6 min-h-screen">
        <div className="max-w-[900px] mx-auto">

          {/* Title */}
          <p className="text-ink-subtle text-xs font-medium tracking-eyebrow uppercase mb-4">
            {work.date}
          </p>
          <h1 className="text-[clamp(28px,4vw,44px)] font-semibold leading-[1.1] tracking-tight text-ink mb-4">
            {work.biggerHeading}
          </h1>
          <p className="text-ink-subtle text-sm leading-relaxed mb-6 max-w-[600px]">
            {work.title}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {work.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-md text-xs border border-hairline text-ink-subtle"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Info columns */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12 pb-12 border-b border-hairline">
            {work.meta.map((item) => (
              <div key={item.label}>
                <p className="text-ink-tertiary text-xs mb-1">{item.label}</p>
                <p className="text-ink-subtle text-sm">{item.value}</p>
              </div>
            ))}
          </div>

          {/* Hero mock card */}
          <div
            className="relative w-full rounded-2xl overflow-hidden mb-10"
            style={{
              height: "clamp(280px, 40vw, 500px)",
              background: `radial-gradient(ellipse at 50% -10%, rgba(${work.accent},0.10) 0%, transparent 60%), linear-gradient(180deg, #101012 0%, #060607 100%)`,
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center px-8 py-12">
              <img
                src={work.coverImage}
                alt={work.biggerHeading}
                className="w-full h-full object-contain"
                style={{
                  filter: "drop-shadow(0 10px 40px rgba(0,0,0,0.5))",
                }}
              />
            </div>
          </div>

          {/* Case study content */}
          {work.protected ? (
            <PasswordGate slug={work.slug} />
          ) : (
            caseStudySlides[work.slug] && <CaseStudySlides slug={work.slug} />
          )}

        </div>
      </main>
      <Footer />
    </>
  );
}
