import React, { useRef, useState, useEffect } from 'react';
import './_tilt.css';

const PROJECTS = [
  {
    id: 0,
    title: "Boosting Sales and Enabling Personalized Customer Experiences",
    date: "2024 Aug – Nov",
    desc: "Cross-platform clientelling solution enabling personalized lookbooks and recommendations.",
    tags: ["UI/UX Design", "Cross-Platform", "B2B SaaS", "User Research"],
    accent: "rgba(255, 180, 80, 0.12)",
    accentLine: "rgba(255, 180, 80, 0.6)",
  },
  {
    id: 1,
    title: "User-Centric Strategy Pivot for Debrief AI to Secure Investment",
    date: "2023 Jan – Jul",
    desc: "Product design for AI-powered workflow automation, enabling researchers to automate complex scientific tasks.",
    tags: ["UI/UX Design", "AI B2B SaaS", "User Research", "LLM"],
    accent: "rgba(100, 180, 255, 0.12)",
    accentLine: "rgba(100, 180, 255, 0.6)",
  },
  {
    id: 2,
    title: "Establishing a Design System to Drive Education and Efficiency",
    date: "2024 Feb – Oct",
    desc: "Led the redesign and implementation of a comprehensive design system for the clienteling app.",
    tags: ["Design System", "iOS", "B2B SaaS", "Retail"],
    accent: "rgba(160, 120, 255, 0.12)",
    accentLine: "rgba(160, 120, 255, 0.6)",
  },
];

const TOTAL = PROJECTS.length;

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function Card({
  project,
  index,
  spread,        // 0 = tightly stacked, 1 = fully spread
  hoveredIndex,
  setHoveredIndex,
}: {
  project: typeof PROJECTS[0];
  index: number;
  spread: number;
  hoveredIndex: number | null;
  setHoveredIndex: (i: number | null) => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 50, y: 40 });
  const isHovered = hoveredIndex === index;
  const anyHovered = hoveredIndex !== null;

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    setMouse({
      x: ((e.clientX - r.left) / r.width) * 100,
      y: ((e.clientY - r.top) / r.height) * 100,
    });
  };

  // Stacked state: slight fan, each card peeks behind
  const stackedY    = index * 6;           // peek below
  const stackedRot  = (index - 1) * 1.2;  // slight fan
  const stackedScale = 1 - index * 0.025;
  const stackedZ    = TOTAL - index;

  // Spread state: evenly distributed vertically
  const gap = 180;
  const spreadY    = index * gap - (TOTAL - 1) * gap / 2;
  const spreadRot  = 0;
  const spreadScale = 1;
  const spreadZ    = TOTAL - index;

  const t = easeInOut(spread);

  const currentY     = lerp(stackedY, spreadY, t);
  const currentRot   = lerp(stackedRot, spreadRot, t);
  const currentScale = lerp(stackedScale, spreadScale, t);

  // Hover lift
  const hoverY = isHovered ? -16 : 0;
  const hoverScale = isHovered ? 1.025 : 1;
  const hoverZ = isHovered ? 50 : spreadZ;

  const finalY     = currentY + hoverY;
  const finalScale = currentScale * hoverScale;
  const finalRot   = isHovered ? 0 : currentRot;
  const finalZ     = hoverZ;
  const finalOpacity = anyHovered && !isHovered ? 0.5 : 1;

  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: `translate(-50%, calc(-50% + ${finalY}px)) rotate(${finalRot}deg) scale(${finalScale})`,
        zIndex: finalZ,
        opacity: finalOpacity,
        width: '100%',
        maxWidth: 700,
        transition: isHovered
          ? 'transform 0.45s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.3s ease'
          : `transform ${spread > 0 && spread < 1 ? '0.05s linear' : '0.45s cubic-bezier(0.23, 1, 0.32, 1)'}, opacity 0.3s ease`,
        cursor: 'pointer',
        pointerEvents: 'auto',
      }}
      onMouseEnter={() => setHoveredIndex(index)}
      onMouseLeave={() => setHoveredIndex(null)}
    >
      {/* Floating shadow */}
      <div style={{
        position: 'absolute',
        bottom: -20,
        left: '15%',
        right: '15%',
        height: 30,
        background: 'radial-gradient(ellipse, rgba(0,0,0,0.6) 0%, transparent 70%)',
        filter: `blur(${isHovered ? 28 : 14}px)`,
        transition: 'filter 0.45s ease',
        pointerEvents: 'none',
        zIndex: -1,
      }} />

      {/* Card surface */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        style={{
          background: 'linear-gradient(160deg, #141414 0%, #0d0d0d 100%)',
          borderRadius: 14,
          border: `1px solid ${isHovered ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.06)'}`,
          boxShadow: isHovered
            ? `inset 0 1px 0 rgba(255,255,255,0.14), 0 32px 64px rgba(0,0,0,0.7), 0 0 80px ${project.accent}`
            : 'inset 0 1px 0 rgba(255,255,255,0.07), 0 16px 40px rgba(0,0,0,0.5)',
          transition: 'box-shadow 0.45s ease, border-color 0.45s ease',
          overflow: 'hidden',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          gap: 0,
        }}
      >
        {/* Cursor glow overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(500px circle at ${mouse.x}% ${mouse.y}%, rgba(255,255,255,0.05), transparent 40%)`,
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.3s ease',
          pointerEvents: 'none',
          zIndex: 10,
          borderRadius: 14,
        }} />

        {/* Text content */}
        <div style={{ padding: '32px 32px 32px 36px', flex: 1, minWidth: 0, position: 'relative', zIndex: 2 }}>
          {/* Accent top line */}
          <div style={{
            width: 28,
            height: 2,
            background: project.accentLine,
            borderRadius: 2,
            marginBottom: 16,
            opacity: isHovered ? 1 : 0.4,
            transition: 'opacity 0.4s ease',
          }} />

          <div style={{
            fontSize: 11,
            fontWeight: 500,
            color: 'rgba(255,255,255,0.3)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: 10,
            fontFamily: "'Inter', sans-serif",
          }}>
            {project.date}
          </div>

          <h3 style={{
            fontSize: 15,
            fontWeight: 500,
            color: isHovered ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.75)',
            lineHeight: 1.45,
            marginBottom: 12,
            fontFamily: "'Inter', sans-serif",
            transition: 'color 0.3s ease',
          }}>
            {project.title}{' '}
            <span style={{
              opacity: isHovered ? 1 : 0,
              display: 'inline-block',
              transform: `translate(${isHovered ? 2 : -2}px, ${isHovered ? -2 : 0}px)`,
              transition: 'opacity 0.3s ease, transform 0.3s ease',
              fontSize: 13,
            }}>↗</span>
          </h3>

          <p style={{
            fontSize: 12,
            color: 'rgba(255,255,255,0.35)',
            lineHeight: 1.65,
            marginBottom: 20,
            fontFamily: "'Inter', sans-serif",
            fontWeight: 300,
          }}>
            {project.desc}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {project.tags.map(tag => (
              <span key={tag} style={{
                fontSize: 10,
                fontWeight: 500,
                color: 'rgba(255,255,255,0.35)',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 100,
                padding: '4px 10px',
                letterSpacing: '0.03em',
                fontFamily: "'Inter', sans-serif",
              }}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Mockup panel */}
        <div style={{
          width: 220,
          flexShrink: 0,
          alignSelf: 'stretch',
          background: 'rgba(0,0,0,0.4)',
          borderLeft: '1px solid rgba(255,255,255,0.04)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Grid pattern */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
            `,
            backgroundSize: '24px 24px',
          }} />

          {/* UI chrome lines */}
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', padding: 20, gap: 8, justifyContent: 'center' }}>
            {[0.18, 0.12, 0.08, 0.06].map((op, i) => (
              <div key={i} style={{
                height: i === 0 ? 8 : 5,
                borderRadius: 4,
                background: `rgba(255,255,255,${op})`,
                width: i === 2 ? '60%' : i === 3 ? '40%' : '100%',
              }} />
            ))}
            <div style={{ height: 40, borderRadius: 6, background: `${project.accent}`, marginTop: 8, border: `1px solid ${project.accentLine.replace('0.6', '0.2')}` }} />
            {[0.06, 0.04].map((op, i) => (
              <div key={i} style={{
                height: 5,
                borderRadius: 4,
                background: `rgba(255,255,255,${op})`,
                width: i === 1 ? '75%' : '100%',
              }} />
            ))}
          </div>

          {/* Glow from accent */}
          <div style={{
            position: 'absolute',
            bottom: -30,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 120,
            height: 80,
            background: project.accentLine.replace('0.6', isHovered ? '0.25' : '0.1'),
            filter: 'blur(40px)',
            transition: 'background 0.4s ease',
            borderRadius: '50%',
          }} />
        </div>
      </div>
    </div>
  );
}

export function TiltStack() {
  const [spread, setSpread] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [phase, setPhase] = useState<'stacking' | 'spreading' | 'hovering' | 'pausing'>('stacking');
  const [hoverStep, setHoverStep] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number | null>(null);

  // Scroll-driven on non-iframe
  useEffect(() => {
    const isIframe = window.self !== window.top;
    if (isIframe) return;

    const scrollEl = document.documentElement;

    const onScroll = () => {
      const section = sectionRef.current;
      if (!section) return;
      // Sticky zone: section is 300vh tall, sticky panel stays in middle
      const rect = section.getBoundingClientRect();
      const sectionH = section.offsetHeight;
      const scrolled = -rect.top;
      const zone = sectionH - window.innerHeight;
      const t = Math.min(1, Math.max(0, scrolled / zone));
      setSpread(t);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Auto-demo loop for iframe
  useEffect(() => {
    const isIframe = window.self !== window.top;
    if (!isIframe) return;

    let s = 0;
    let dir = 1;
    let p: typeof phase = 'spreading';
    let hStep = 0;
    let hTimeout: ReturnType<typeof setTimeout> | null = null;
    let pauseTimeout: ReturnType<typeof setTimeout> | null = null;

    const tick = () => {
      if (p === 'spreading') {
        s = Math.min(1, s + 0.008);
        setSpread(s);
        if (s >= 1) {
          p = 'hovering';
          hStep = 0;
          hTimeout = setTimeout(doHover, 600);
          return;
        }
      } else if (p === 'stacking') {
        s = Math.max(0, s - 0.01);
        setSpread(s);
        if (s <= 0) {
          p = 'pausing';
          pauseTimeout = setTimeout(() => { p = 'spreading'; }, 1200);
          return;
        }
      }
      animRef.current = requestAnimationFrame(tick);
    };

    const doHover = () => {
      if (hStep < TOTAL) {
        setHoveredIndex(hStep);
        hStep++;
        hTimeout = setTimeout(() => {
          setHoveredIndex(null);
          hTimeout = setTimeout(doHover, 400);
        }, 1000);
      } else {
        setHoveredIndex(null);
        p = 'stacking';
        animRef.current = requestAnimationFrame(tick);
      }
    };

    animRef.current = requestAnimationFrame(tick);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      if (hTimeout) clearTimeout(hTimeout);
      if (pauseTimeout) clearTimeout(pauseTimeout);
    };
  }, []);

  const containerH = 500 + (TOTAL - 1) * 180; // enough room for spread

  return (
    <div style={{
      background: '#000',
      minHeight: '100vh',
      fontFamily: "'Inter', sans-serif",
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Subtle grid */}
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      {/* Header */}
      <div style={{
        textAlign: 'center',
        padding: '80px 0 48px',
        position: 'relative',
        zIndex: 2,
      }}>
        <p style={{
          fontSize: 11,
          fontWeight: 500,
          color: 'rgba(255,255,255,0.3)',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          marginBottom: 12,
        }}>
          Selected Works
        </p>
        <h2 style={{
          fontSize: 'clamp(28px, 4vw, 48px)',
          fontWeight: 500,
          color: 'rgba(255,255,255,0.85)',
          letterSpacing: '-0.02em',
          lineHeight: 1.1,
          margin: '0 0 16px',
        }}>
          Projects that matter
        </h2>
        <p style={{
          fontSize: 13,
          color: 'rgba(255,255,255,0.3)',
          fontWeight: 300,
        }}>
          {window.self !== window.top ? 'Watch the demo →' : 'Scroll to reveal each project'}
        </p>
      </div>

      {/* Card stack area */}
      <div
        ref={sectionRef}
        style={{
          position: 'relative',
          zIndex: 2,
          height: containerH,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '0 48px',
        }}
      >
        {PROJECTS.map((project, index) => (
          <Card
            key={project.id}
            project={project}
            index={index}
            spread={spread}
            hoveredIndex={hoveredIndex}
            setHoveredIndex={setHoveredIndex}
          />
        ))}
      </div>

      {/* Scroll hint (non-iframe) */}
      {window.self !== window.top ? null : (
        <div style={{ textAlign: 'center', padding: '48px 0 80px', position: 'relative', zIndex: 2 }}>
          <div style={{ width: 1, height: 40, background: 'linear-gradient(to bottom, rgba(255,255,255,0.15), transparent)', margin: '0 auto' }} />
        </div>
      )}
    </div>
  );
}
