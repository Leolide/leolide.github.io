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
    accentLine: "rgba(255, 180, 80, 0.7)",
  },
  {
    id: 1,
    title: "User-Centric Strategy Pivot for Debrief AI to Secure Investment",
    date: "2023 Jan – Jul",
    desc: "Product design for AI-powered workflow automation, enabling researchers to automate complex scientific tasks.",
    tags: ["UI/UX Design", "AI B2B SaaS", "User Research", "LLM"],
    accent: "rgba(100, 180, 255, 0.12)",
    accentLine: "rgba(100, 180, 255, 0.7)",
  },
  {
    id: 2,
    title: "Establishing a Design System to Drive Education and Efficiency",
    date: "2024 Feb – Oct",
    desc: "Led the redesign and implementation of a comprehensive design system for the clienteling app.",
    tags: ["Design System", "iOS", "B2B SaaS", "Retail"],
    accent: "rgba(160, 120, 255, 0.12)",
    accentLine: "rgba(160, 120, 255, 0.7)",
  },
];

const TOTAL = PROJECTS.length;

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function easeOut(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function Card({
  project,
  index,
  spread,
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

  // Sequential relay: each card rises to center, then exits up when next arrives
  // scroll [0,1] divided into TOTAL equal segments
  const seg = 1 / TOTAL;
  const entryStart = index * seg;
  const entryEnd   = entryStart + seg * 0.55;
  const exitStart  = entryStart + seg * 0.7;
  const exitEnd    = entryStart + seg * 1.15;

  const clamp = (v: number) => Math.min(1, Math.max(0, v));
  const entryT = easeOut(clamp((spread - entryStart) / (entryEnd - entryStart)));
  const exitT  = index < TOTAL - 1
    ? easeOut(clamp((spread - exitStart)  / (exitEnd  - exitStart)))
    : 0; // last card never exits

  // Positions
  const stackedY  =  20 + index * 6;   // all start just below center, stacked
  const stackedRot = (index - (TOTAL - 1) / 2) * 1.2;
  const stackedScale = 1 - index * 0.025;
  const centerY   =  0;
  const exitedY   = -780;              // flies off the top

  const baseY     = lerp(stackedY, centerY,  entryT);
  const currentY  = lerp(baseY,    exitedY,  exitT);
  const currentRot   = lerp(stackedRot, 0, entryT);
  const currentScale = lerp(stackedScale, 1, entryT);

  const finalY     = currentY + (isHovered ? -14 : 0);
  const finalScale = currentScale * (isHovered ? 1.02 : 1);
  const finalRot   = isHovered ? 0 : currentRot;
  const finalZ     = isHovered ? 50 : TOTAL - index;
  const finalOpacity = (exitT > 0.05) ? Math.max(0, 1 - exitT * 1.4)
    : anyHovered && !isHovered ? 0.55 : 1;

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
        maxWidth: 780,
        transition: isHovered
          ? 'transform 0.45s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.3s ease'
          : 'opacity 0.3s ease',
        cursor: 'pointer',
        pointerEvents: 'auto',
      }}
      onMouseEnter={() => setHoveredIndex(index)}
      onMouseLeave={() => setHoveredIndex(null)}
    >
      {/* Floating shadow */}
      <div style={{
        position: 'absolute',
        bottom: -18,
        left: '12%',
        right: '12%',
        height: 28,
        background: 'radial-gradient(ellipse, rgba(0,0,0,0.65) 0%, transparent 70%)',
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
          background: 'linear-gradient(155deg, #141414 0%, #0d0d0d 100%)',
          borderRadius: 14,
          border: `1px solid ${isHovered ? 'rgba(255,255,255,0.13)' : 'rgba(255,255,255,0.06)'}`,
          boxShadow: isHovered
            ? `inset 0 1px 0 rgba(255,255,255,0.15), 0 28px 60px rgba(0,0,0,0.75), 0 0 70px ${project.accent}`
            : 'inset 0 1px 0 rgba(255,255,255,0.08), 0 14px 36px rgba(0,0,0,0.55)',
          transition: 'box-shadow 0.45s ease, border-color 0.45s ease',
          overflow: 'hidden',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Cursor glow */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(600px circle at ${mouse.x}% ${mouse.y}%, rgba(255,255,255,0.05), transparent 40%)`,
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.35s ease',
          pointerEvents: 'none',
          zIndex: 10,
          borderRadius: 14,
        }} />

        {/* Mockup panel — top, full width */}
        <div style={{
          width: '100%',
          height: 260,
          flexShrink: 0,
          background: 'rgba(0,0,0,0.45)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Grid */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
            `,
            backgroundSize: '28px 28px',
          }} />

          {/* UI chrome mockup */}
          <div style={{ position: 'absolute', inset: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {/* Top nav bar */}
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
              {[0.18, 0.12, 0.08].map((op, i) => (
                <div key={i} style={{ height: 6, borderRadius: 3, background: `rgba(255,255,255,${op})`, width: i === 0 ? 60 : i === 1 ? 40 : 30 }} />
              ))}
              <div style={{ flex: 1 }} />
              <div style={{ width: 24, height: 24, borderRadius: 6, background: project.accent, border: `1px solid ${project.accentLine.replace('0.7','0.2')}` }} />
            </div>

            {/* Main content area */}
            <div style={{ display: 'flex', gap: 12, flex: 1 }}>
              {/* Left column */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ height: '55%', borderRadius: 8, background: project.accent, border: `1px solid ${project.accentLine.replace('0.7','0.15')}`, position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', bottom: 10, left: 10, right: 10, display: 'flex', flexDirection: 'column', gap: 5 }}>
                    {[0.2, 0.12].map((op, i) => (
                      <div key={i} style={{ height: 5, borderRadius: 2, background: `rgba(255,255,255,${op})`, width: i === 1 ? '65%' : '100%' }} />
                    ))}
                  </div>
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
                  {[0.1, 0.07, 0.05].map((op, i) => (
                    <div key={i} style={{ height: 4, borderRadius: 2, background: `rgba(255,255,255,${op})`, width: i === 1 ? '80%' : i === 2 ? '55%' : '100%' }} />
                  ))}
                </div>
              </div>
              {/* Right column */}
              <div style={{ width: '38%', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[1, 0.6, 0.4].map((scale, i) => (
                  <div key={i} style={{ height: 50, borderRadius: 7, background: `rgba(255,255,255,${0.03 * scale + 0.02})`, border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', padding: '0 10px', gap: 7 }}>
                    <div style={{ width: 18, height: 18, borderRadius: 4, background: i === 0 ? project.accent : 'rgba(255,255,255,0.05)', flexShrink: 0 }} />
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <div style={{ height: 3, borderRadius: 2, background: `rgba(255,255,255,${0.12 - i * 0.03})`, width: '80%' }} />
                      <div style={{ height: 3, borderRadius: 2, background: `rgba(255,255,255,0.05)`, width: '55%' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Accent glow */}
          <div style={{
            position: 'absolute',
            bottom: -30,
            left: '30%',
            width: 160,
            height: 80,
            background: project.accentLine.replace('0.7', isHovered ? '0.2' : '0.07'),
            filter: 'blur(40px)',
            transition: 'background 0.45s ease',
            borderRadius: '50%',
            pointerEvents: 'none',
          }} />
        </div>

        {/* Text content — below image */}
        <div style={{ padding: '24px 28px 26px', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{
              width: 20, height: 2,
              background: project.accentLine,
              borderRadius: 2,
              opacity: isHovered ? 1 : 0.35,
              transition: 'opacity 0.4s ease',
              flexShrink: 0,
            }} />
            <div style={{
              fontSize: 10, fontWeight: 500,
              color: 'rgba(255,255,255,0.28)',
              letterSpacing: '0.1em', textTransform: 'uppercase',
              fontFamily: "'Inter', sans-serif",
            }}>
              {project.date}
            </div>
          </div>

          <h3 style={{
            fontSize: 16,
            fontWeight: 500,
            color: isHovered ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.75)',
            lineHeight: 1.45,
            marginBottom: 10,
            fontFamily: "'Inter', sans-serif",
            transition: 'color 0.3s ease',
          }}>
            {project.title}
            <span style={{
              opacity: isHovered ? 1 : 0,
              display: 'inline-block',
              marginLeft: 6,
              transform: `translate(${isHovered ? 2 : -1}px, ${isHovered ? -2 : 0}px)`,
              transition: 'opacity 0.3s ease, transform 0.3s ease',
              fontSize: 13,
            }}>↗</span>
          </h3>

          <p style={{
            fontSize: 12.5,
            color: 'rgba(255,255,255,0.32)',
            lineHeight: 1.65,
            marginBottom: 16,
            fontFamily: "'Inter', sans-serif",
            fontWeight: 300,
          }}>
            {project.desc}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {project.tags.map(tag => (
              <span key={tag} style={{
                fontSize: 10, fontWeight: 500,
                color: 'rgba(255,255,255,0.32)',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 100, padding: '4px 10px',
                letterSpacing: '0.03em',
                fontFamily: "'Inter', sans-serif",
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
  const [spread, setSpread] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll-driven: use the iframe/page's own scroll
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onScroll = () => {
      const scrollTop = el.scrollTop;
      const maxScroll = el.scrollHeight - el.clientHeight;
      // Animate spread over the middle 70% of scroll range
      const start = maxScroll * 0.08;
      const end = maxScroll * 0.78;
      const t = Math.min(1, Math.max(0, (scrollTop - start) / (end - start)));
      setSpread(t);
    };

    el.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  // Tall container height: enough to let scroll drive the full animation
  const CARD_HEIGHT = 160; // approx card height
  const SPREAD_RANGE = (TOTAL - 1) * 280 + CARD_HEIGHT; // fully spread height
  const stickyH = SPREAD_RANGE + 120; // sticky zone height
  const scrollH = stickyH * 4; // total scroll height gives lots of scroll room

  return (
    <div
      ref={scrollRef}
      style={{
        height: '100vh',
        overflowY: 'scroll',
        background: '#000',
        fontFamily: "'Inter', sans-serif",
        position: 'relative',
        scrollbarWidth: 'none',
      }}
    >
      {/* Subtle grid background */}
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.013) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.013) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      {/* Top scroll buffer */}
      <div style={{ height: '15vh' }} />

      {/* Section header — scrolls away */}
      <div style={{
        textAlign: 'center',
        padding: '0 0 36px',
        position: 'relative',
        zIndex: 1,
      }}>
        <p style={{
          fontSize: 10,
          fontWeight: 500,
          color: 'rgba(255,255,255,0.25)',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          marginBottom: 10,
        }}>
          Selected Works
        </p>
        <h2 style={{
          fontSize: 'clamp(22px, 3.5vw, 40px)',
          fontWeight: 500,
          color: `rgba(255,255,255,${0.4 + spread * 0.45})`,
          letterSpacing: '-0.02em',
          lineHeight: 1.1,
          margin: '0 0 10px',
          transition: 'color 0.1s ease',
        }}>
          Projects that matter
        </h2>
        <p style={{
          fontSize: 12,
          color: `rgba(255,255,255,${0.15 + spread * 0.15})`,
          fontWeight: 300,
          transition: 'color 0.1s ease',
        }}>
          Scroll to reveal ↓
        </p>
      </div>

      {/* Sticky card stack */}
      <div style={{
        position: 'sticky',
        top: '50%',
        transform: 'translateY(-50%)',
        height: stickyH,
        zIndex: 2,
        pointerEvents: 'none',
      }}>
        <div style={{
          position: 'relative',
          height: '100%',
          maxWidth: 760,
          margin: '0 auto',
          padding: '0 32px',
          pointerEvents: 'auto',
        }}>
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
      </div>

      {/* Scroll space that drives the animation */}
      <div style={{ height: scrollH }} />

      {/* Scroll indicator line */}
      <div style={{
        position: 'fixed',
        right: 20,
        top: '50%',
        transform: 'translateY(-50%)',
        width: 2,
        height: 80,
        background: 'rgba(255,255,255,0.06)',
        borderRadius: 2,
        zIndex: 10,
      }}>
        <div style={{
          width: '100%',
          height: `${spread * 100}%`,
          background: 'rgba(255,255,255,0.25)',
          borderRadius: 2,
          transition: 'height 0.05s linear',
        }} />
      </div>
    </div>
  );
}
