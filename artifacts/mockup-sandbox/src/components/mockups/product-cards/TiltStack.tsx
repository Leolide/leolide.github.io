import React, { useRef, useState, useEffect, useCallback } from 'react';
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
  revealProgress,
}: {
  project: typeof PROJECTS[0];
  index: number;
  activeIndex: number | null;
  setActiveIndex: (i: number | null) => void;
  revealProgress: number; // 0 = fully stacked, 1 = fully revealed
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

  // Final spread position for this card
  const spreadOffset = (index - 1) * 56;
  const spreadRotation = (index - 1) * 2.5;
  const spreadScale = 1;
  const spreadOpacity = anyActive && !isActive ? 0.6 : 1;

  // Stacked position (all cards on top of each other)
  const stackedOffset = 0;
  const stackedRotation = (index - 1) * 0.5;
  const stackedScale = 1 - (index) * 0.02;
  const stackedOpacity = 1 - (index) * 0.15;

  const currentOffset = stackedOffset + (spreadOffset - stackedOffset) * revealProgress;
  const currentRotation = stackedRotation + (spreadRotation - stackedRotation) * revealProgress;
  const currentScale = stackedScale + (spreadScale - stackedScale) * revealProgress;
  const currentOpacity = stackedOpacity + (spreadOpacity - stackedOpacity) * revealProgress;

  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: 0,
        transform: `translateX(-50%) translateY(${isActive ? -12 : currentOffset}px) rotate(${isActive ? 0 : currentRotation}deg) scale(${isActive ? 1.03 : currentScale})`,
        zIndex: isActive ? 30 : 10 - index,
        width: isActive ? 720 : 640,
        opacity: anyActive ? (isActive ? 1 : 0.6) : currentOpacity,
        transition: isActive
          ? 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)'
          : 'transform 0.15s linear, opacity 0.15s linear, width 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
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
          transition: 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
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
  const [scrollProgress, setScrollProgress] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Section top enters viewport = start
    // Section bottom leaves viewport = end
    const start = windowHeight;
    const end = -rect.height;
    const current = rect.top;

    const rawProgress = (start - current) / (start - end);
    const progress = Math.min(1, Math.max(0, rawProgress));
    setScrollProgress(progress);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Auto-demo mode for iframe preview (no scroll events in iframe)
  useEffect(() => {
    const isIframe = window.self !== window.top;
    if (!isIframe) return;

    let phase = 0; // 0=stacked, 1=spreading, 2=hover cycle, 3=reset
    let progress = 0;
    const interval = setInterval(() => {
      if (phase === 0) {
        progress += 0.01;
        if (progress >= 1) { progress = 1; phase = 1; }
      } else if (phase === 1) {
        setActiveIndex(0);
        setTimeout(() => setActiveIndex(1), 1500);
        setTimeout(() => setActiveIndex(2), 3000);
        setTimeout(() => { setActiveIndex(null); phase = 2; }, 4500);
        phase = -1;
      } else if (phase === 2) {
        setTimeout(() => { progress = 0; phase = 0; }, 2000);
        phase = -1;
      }
      setScrollProgress(progress);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Map overall scroll progress to individual card reveal progress
  // Card 0: 0% - 33%
  // Card 1: 20% - 66%
  // Card 2: 40% - 100%
  const getCardProgress = (index: number) => {
    const cardStart = index * 0.25;
    const cardEnd = cardStart + 0.5;
    if (scrollProgress <= cardStart) return 0;
    if (scrollProgress >= cardEnd) return 1;
    return (scrollProgress - cardStart) / (cardEnd - cardStart);
  };

  return (
    <div style={{
      width: '100%', background: '#000000',
      fontFamily: "'Inter', sans-serif",
      position: 'relative',
    }}>
      <div className="ambient-crosses" />

      {/* Scrollable spacer to give scroll room */}
      <div style={{ height: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{
            color: 'rgba(255,255,255,0.2)', fontSize: 14,
            fontFamily: "'Inter', sans-serif", fontWeight: 300,
            letterSpacing: '0.05em',
          }}>
            Scroll down
          </p>
          <div style={{
            width: 1, height: 40,
            background: 'linear-gradient(to bottom, rgba(255,255,255,0.2), transparent)',
            margin: '16px auto 0',
          }} />
        </div>
      </div>

      <div style={{ width: '100%', maxWidth: 900, margin: '0 auto', position: 'relative', zIndex: 1 }}>
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
            Scroll to reveal each project. Hover to explore.
          </p>
        </div>

        {/* Card stack container - tall for scroll */}
        <div
          ref={sectionRef}
          style={{
            position: 'relative',
            height: activeIndex !== null ? 520 : 420,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            transition: 'height 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
            marginBottom: 200,
          }}
        >
          {PROJECTS.map((project, index) => (
            <StackedCard
              key={project.id}
              project={project}
              index={index}
              activeIndex={activeIndex}
              setActiveIndex={setActiveIndex}
              revealProgress={getCardProgress(index)}
            />
          ))}
        </div>
      </div>

      {/* More scrollable space below */}
      <div style={{ height: '40vh' }} />
    </div>
  );
}
