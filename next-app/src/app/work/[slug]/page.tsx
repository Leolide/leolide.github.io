import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
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

  const [r, g, b] = work.accent.split(",").map(Number);
  const accentCss = `rgb(${r},${g},${b})`;

  return (
    <>
      <Navbar />
      <main className="pt-32 pb-24 px-6 min-h-screen">
        <div className="max-w-[900px] mx-auto">
          {/* Eyebrow */}
          <p className="text-ink-subtle text-xs font-medium tracking-eyebrow uppercase mb-4">
            {work.date}
          </p>

          {/* Accent line + title */}
          <div className="flex items-center gap-4 mb-6">
            <span
              className="block w-8 h-0.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: accentCss }}
            />
            <h1 className="text-[clamp(28px,4vw,48px)] font-semibold leading-[1.1] tracking-tight text-ink">
              {work.title}
            </h1>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-12">
            {work.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-md text-xs border"
                style={{ borderColor: `${accentCss}50`, color: accentCss }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Hero image */}
          <div className="rounded-xl overflow-hidden border border-hairline mb-12">
            <img
              src={work.coverImage}
              alt={work.biggerHeading}
              className="w-full object-cover"
            />
          </div>

          {/* Protected notice */}
          {work.protected && (
            <div className="rounded-xl border border-hairline bg-surface-1 p-8 text-center">
              <p className="text-ink-subtle text-sm mb-2">
                This case study is password protected.
              </p>
              <p className="text-ink-tertiary text-xs">
                Reach out at{" "}
                <a
                  href="mailto:lideli.leo@gmail.com"
                  className="text-ink-subtle hover:text-ink underline transition-colors"
                >
                  lideli.leo@gmail.com
                </a>{" "}
                to request access.
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
