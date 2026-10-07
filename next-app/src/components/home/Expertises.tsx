"use client";


const EXPERTISES = [
  {
    num: "01",
    title: "0→1 Product Design",
    desc: "Thrives as the only or founding designer. Moves fast from ambiguity to shipped AI products.",
  },
  {
    num: "02",
    title: "Design Engineering",
    desc: "Ships production code, not just specs. Builds design systems and component libraries end-to-end.",
  },
  {
    num: "03",
    title: "AI & Agentic Workflow Design",
    desc: "Monitoring, orchestration and observability across multi-agent, long-running and pro-code agent systems.",
  },
  {
    num: "04",
    title: "Community Building",
    desc: "Founded Fouxy Squad, now hundreds of members in London. Leads Friends of Figma London.",
  },
];

export function Expertises() {
  return (
    <div className="mb-14">
      <p className="text-ink-subtle text-xs font-medium tracking-eyebrow uppercase mb-6">
        Expertises
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {EXPERTISES.map((item) => (
          <div
            key={item.num}
            className="rounded-xl border border-hairline bg-surface-1 p-4 flex flex-col gap-2"
          >
            <span className="text-ink-tertiary text-xs font-mono">{item.num}</span>
            <div>
              <h3 className="text-ink text-sm font-semibold leading-snug tracking-tight mb-1">
                {item.title}
              </h3>
              <p className="text-ink-subtle text-xs leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
