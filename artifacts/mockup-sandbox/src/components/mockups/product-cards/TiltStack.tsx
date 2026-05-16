import React, { useRef, useState } from 'react';
import './_tilt.css';

const PROJECTS = [
  {
    id: 1,
    title: "Boosting Sales and Enabling Personalized Customer Experiences",
    date: "2024 Aug - Nov",
    desc: "Cross-platform clientelling solution enabling personalized lookbooks and recommendations.",
    tags: ["UI/UX Design", "Cross-Platform", "B2B SaaS", "User Research"]
  },
  {
    id: 2,
    title: "User-Centric Strategy Pivot for Debrief AI to Secure Investment",
    date: "2023 Jan - Jul",
    desc: "Product design for AI-powered workflow automation, enabling researchers to automate complex scientific tasks.",
    tags: ["UI/UX Design", "AI B2B SaaS", "User Research", "LLM"]
  },
  {
    id: 3,
    title: "Establishing a Design System to Drive Education and Efficiency",
    date: "2024 Feb - Oct",
    desc: "Led the redesign and implementation of a comprehensive design system for the clienteling app.",
    tags: ["Design System", "iOS", "B2B SaaS", "Retail"]
  }
];

function StackedCard({
  project,
  index,
  activeIndex,
  setActiveIndex,
}: {
  project: typeof PROJECTS[0];
  index: number;
  activeIndex: number | null;
  setActiveIndex: (i: number | null) => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 30 });
  const isActive = activeIndex === index;
  const anyActive = activeIndex !== null;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  // Stacked position: fan-out with visible overlap
  const stackOffset = (index - 1) * 56;
  const stackRotation = (index - 1) * 2.5;

  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: 0,
        transform: `translateX(-50%) translateY(${isActive ? -12 : stackOffset}px) rotate(${isActive ? 0 : stackRotation}deg) scale(${isActive ? 1.03 : anyActive && !isActive ? 0.97 : 1})`,
        zIndex: isActive ? 30 : 10 - index,
        width: isActive ? 720 : 640,
        transition: 'all 0.6s cubic-bezier(0.23, 1, 0.32, 1)',
        pointerEvents: 'auto',
      }}
      onMouseEnter={() => setActiveIndex(index)}
      onMouseLeave={() => setActiveIndex(null)}
    >
      {/* Floating shadow */}
      <div
        style={{
          position: 'absolute',
          bottom: isActive ? -30 : -12,
          left: '10%',
          right: '10%',
          height: 40,
          background: isActive
            ? 'radial-gradient(ellipse at center, rgba(0,0,0,0.7) 0%, transparent 70%)'
            : 'radial-gradient(ellipse at center, rgba(0,0,0,0.5) 0%, transparent 70%)',
          filter: isActive ? 'blur(30px)' : 'blur(16px)',
          transition: 'all 0.6s cubic-bezier(0.23, 1, 0.32, 1)',
          pointerEvents: 'none',
          zIndex: -1,
        }}
      />

      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        className="luminous-card"
        style={{
          ['--mouse-x' as string]: `${mousePos.x}%`,
          ['--mouse-y' as string]: `${mousePos.y}%`,
          opacity: anyActive && !isActive ? 0.6 : 1,
        }}
      >
        <div className="luminous-overlay" />

        {/* Thumbnail */}
        <div className="card-thumbnail" style={{ aspectRatio: '16/9' }}>
          <div
            style={{
              position: 'absolute', inset: 0, opacity: 0.04,
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 12v16M12 20h16' stroke='white' stroke-width='0.5' fill='none'/%3E%3C/svg%3E")`,
              backgroundSize: '40px 40px',
            }}
          />
          <div style={{ position: 'absolute', top: 24, left: 24, display: 'flex', gap: 6 }}>
            <div className="dot-indicator" />
            <div className="dot-indicator" style={{ opacity: 0.5 }} />
            <div className="dot-indicator" style={{ opacity: 0.25 }} />
          </div>
          <div
            style={{
              position: 'absolute', top: 24, right: 24,
              width: 28, height: 28,
              border: '1px solid rgba(255,255,255,0.06)', borderRadius: 6,
            }}
          />
          <div
            style={{
              position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)',
              width: 100, height: 1,
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)',
            }}
          />
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div
              style={{
                width: 48, height: 48, borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)',
                boxShadow: '0 0 40px rgba(255,255,255,0.03)',
              }}
            />
          </div>
          <div
            style={{
              position: 'absolute', inset: 0,
              background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.3) 100%)',
            }}
          />
        </div>

        {/* Content */}
        <div style={{ padding: 28, position: 'relative', zIndex: 10 }}>
          <div style={{
            fontSize: 11, fontWeight: 500, color: 'rgba(255,255,255,0.35)',
            marginBottom: 12, letterSpacing: '0.12em', textTransform: 'uppercase',
            fontFamily: "'Inter', sans-serif",
          }}>
            {project.date}
          </div>
          <h3 style={{
            fontSize: isActive ? 18 : 16, fontWeight: 500, color: 'rgba(255,255,255,0.85)',
            lineHeight: 1.4, marginBottom: 12, fontFamily: "'Inter', sans-serif",
            transition: 'font-size 0.4s ease',
          }}>
            {project.title}
          </h3>
          <p style={{
            fontSize: 13, color: 'rgba(255,255,255,0.4)',
            lineHeight: 1.6, marginBottom: 24,
            fontFamily: "'Inter', sans-serif", fontWeight: 300,
          }}>
            {project.desc}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {project.tags.map((tag) => (
              <span key={tag} className="skill-tag" style={{
                padding: '5px 12px', borderRadius: 9999,
                fontSize: 11, fontWeight: 500, color: 'rgba(255,255,255,0.5)',
                whiteSpace: 'nowrap', fontFamily: "'Inter', sans-serif",
              }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function TiltStack() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <div style={{
      minHeight: '100vh', width: '100%', background: '#000000',
      fontFamily: "'Inter', sans-serif",
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '80px 40px', position: 'relative',
    }}>
      <div className="ambient-crosses" />
      <div style={{ width: '100%', maxWidth: 900, position: 'relative', zIndex: 1 }}>
        <div style={{ marginBottom: 80, textAlign: 'center' }}>
          <h2 style={{
            fontSize: '1.5rem', fontWeight: 500,
            color: 'rgba(255,255,255,0.85)', marginBottom: 8,
            letterSpacing: '-0.01em', fontFamily: "'Inter', sans-serif",
          }}>
            Selected Works
          </h2>
          <p style={{
            color: 'rgba(255,255,255,0.3)', fontSize: 14,
            fontFamily: "'Inter', sans-serif", fontWeight: 300,
          }}>
            Hover a card to explore.
          </p>
        </div>

        {/* Card stack container */}
        <div
          style={{
            position: 'relative',
            height: activeIndex !== null ? 520 : 420,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            transition: 'height 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
          }}
        >
          {PROJECTS.map((project, index) => (
            <StackedCard
              key={project.id}
              project={project}
              index={index}
              activeIndex={activeIndex}
              setActiveIndex={setActiveIndex}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
