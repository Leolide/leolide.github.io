import React, { useRef, useState, useEffect } from 'react';
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

function TiltCard({ project }: { project: typeof PROJECTS[0] }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [{ rx, ry }, setRot] = useState({ rx: 0, ry: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotateY = ((x - cx) / cx) * 15; // Max 15deg
    const rotateX = ((cy - y) / cy) * 15;
    
    setRot({ rx: rotateX, ry: rotateY });
  };

  const handleMouseEnter = () => setIsHovered(true);
  
  const handleMouseLeave = () => {
    setIsHovered(false);
    setRot({ rx: 0, ry: 0 });
  };

  return (
    <div className="perspective-container flex-1 min-w-[300px] max-w-[400px]">
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="tilt-card relative flex flex-col h-full rounded-2xl bg-[#111] border border-white/10 overflow-hidden cursor-pointer transition-all duration-200 ease-out hover:border-white/30"
        style={{
          transform: isHovered 
            ? `rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.05, 1.05, 1.05)` 
            : 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
          boxShadow: isHovered 
            ? `0 20px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)` 
            : '0 4px 20px rgba(0,0,0,0.5)',
        }}
      >
        {/* Shine effect */}
        <div 
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-20"
          style={{
            background: `radial-gradient(circle at ${isHovered ? `${rx * 5 + 50}% ${ry * 5 + 50}%` : '50% 0%'}, rgba(255,255,255,0.1) 0%, transparent 60%)`,
            opacity: isHovered ? 1 : 0
          }}
        />

        {/* Thumbnail */}
        <div className="relative aspect-square w-full overflow-hidden bg-[#050505]">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent mix-blend-overlay" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/[0.03] via-transparent to-transparent" />
          
          {/* Decorative elements in thumbnail */}
          <div className="absolute top-4 left-4 flex gap-1.5">
            <div className="w-2 h-2 rounded-full bg-white/20" />
            <div className="w-2 h-2 rounded-full bg-white/20" />
            <div className="w-2 h-2 rounded-full bg-white/20" />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-1 z-10 bg-gradient-to-b from-[#111] to-[#0a0a0a]">
          <div className="text-xs font-medium text-white/40 mb-3 tracking-wider uppercase">
            {project.date}
          </div>
          
          <h3 className="text-xl font-semibold text-white leading-tight mb-3">
            {project.title}
          </h3>
          
          <p className="text-sm text-white/60 leading-relaxed mb-6 flex-1">
            {project.desc}
          </p>
          
          <div className="flex flex-wrap gap-2 mt-auto">
            {project.tags.map((tag) => (
              <span 
                key={tag} 
                className="px-2.5 py-1 rounded-full text-xs font-medium bg-white/5 text-white/70 border border-white/5 whitespace-nowrap"
              >
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
  return (
    <div className="min-h-screen bg-black w-full flex items-center justify-center p-8 font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&display=swap');
        .font-sans { font-family: 'Geist', sans-serif; }
      `}</style>
      
      <div className="w-full max-w-7xl mx-auto">
        <div className="mb-12">
          <h2 className="text-3xl font-semibold text-white mb-2 tracking-tight">Selected Works</h2>
          <p className="text-white/50">Hover to explore projects.</p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-0 justify-center items-center perspective-[2000px] lg:-space-x-12">
          {PROJECTS.map((project, i) => (
            <div 
              key={project.id} 
              className="transition-all duration-300 ease-out hover:z-50 focus-within:z-50"
              style={{
                zIndex: PROJECTS.length - i,
                transform: `scale(${1 - (i * 0.05)})`,
                transformOrigin: 'left center'
              }}
            >
              <TiltCard project={project} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
