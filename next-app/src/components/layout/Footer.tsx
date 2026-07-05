import Link from "next/link";

const SOCIAL = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/lideli/" },
  { label: "X", href: "https://x.com/lidethemaker" },
];

export function Footer() {
  return (
    <footer className="bg-canvas pt-16 pb-10 px-6">
      <div className="max-w-[1280px] mx-auto">
        {/* CTA */}
        <p className="text-ink-subtle text-sm mb-3">Let&rsquo;s chat:</p>
        <a
          href="mailto:lideli.leo@gmail.com"
          className="group inline-flex items-center gap-3 text-ink hover:text-accent transition-colors"
        >
          <span className="text-2xl font-medium tracking-tight">
            lideli.leo@gmail.com
          </span>
          <span className="opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all">
            ↗
          </span>
        </a>

        {/* Bottom row */}
        <div className="mt-12 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <p className="text-ink-tertiary text-xs">
            © {new Date().getFullYear()} Lide Li
          </p>
          <div className="flex gap-5">
            {SOCIAL.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink-subtle hover:text-ink text-sm transition-colors"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
