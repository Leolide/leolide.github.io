import React, { useRef, useState, useEffect } from "react";
import "./SpotlightGlow.css";

const projects = [
  {
    id: 1,
    title: "Boosting Sales and Enabling Personalized Customer Experiences",
    date: "2024 Aug - Nov",
    description: "Cross-platform clientelling solution enabling personalized lookbooks and recommendations.",
    tags: ["UI/UX Design", "Cross-Platform", "B2B SaaS", "User Research"]
  },
  {
    id: 2,
    title: "User-Centric Strategy Pivot for Debrief AI to Secure Investment",
    date: "2023 Jan - Jul",
    description: "Product design for AI-powered workflow automation, enabling researchers to automate complex scientific tasks.",
    tags: ["UI/UX Design", "AI B2B SaaS", "User Research", "LLM"]
  },
  {
    id: 3,
    title: "Establishing a Design System to Drive Education and Efficiency",
    date: "2024 Feb - Oct",
    description: "Led the redesign and implementation of a comprehensive design system for the clienteling app.",
    tags: ["Design System", "iOS", "B2B SaaS", "Retail"]
  }
];

export function SpotlightGlow() {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    const cards = containerRef.current.querySelectorAll('.spotlight-card');
    cards.forEach((card: Element) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      (card as HTMLElement).style.setProperty('--mouse-x', `${x}px`);
      (card as HTMLElement).style.setProperty('--mouse-y', `${y}px`);
    });
  };

  return (
    <div 
      className="min-h-screen bg-black text-white p-8 md:p-16 flex items-center justify-center font-sans"
      style={{ fontFamily: "'Inter', 'Geist', sans-serif" }}
    >
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        `}
      </style>
      
      <div 
        ref={containerRef}
        onMouseMove={handleMouseMove}
        className="spotlight-wrapper max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {projects.map((project) => (
          <a 
            key={project.id}
            href="#"
            className="spotlight-card flex flex-col group cursor-pointer"
          >
            <div className="relative aspect-square w-full bg-neutral-900 border-b border-white/10 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent mix-blend-overlay" />
              {/* Placeholder image representation */}
              <div className="absolute inset-0 flex items-center justify-center opacity-30 group-hover:opacity-50 transition-opacity">
                <div className="w-24 h-24 rounded-full bg-white/10 blur-2xl" />
              </div>
            </div>
            
            <div className="p-6 flex flex-col flex-grow relative z-10">
              <div className="text-xs font-medium text-neutral-400 mb-3 tracking-wide">
                {project.date}
              </div>
              <h3 className="text-xl font-semibold mb-3 leading-tight text-neutral-100 group-hover:text-white transition-colors">
                {project.title}
              </h3>
              <p className="text-sm text-neutral-400 leading-relaxed mb-8 flex-grow">
                {project.description}
              </p>
              
              <div className="flex flex-wrap gap-2 mt-auto">
                {project.tags.map((tag) => (
                  <span 
                    key={tag} 
                    className="px-2.5 py-1 text-xs font-medium bg-white/5 text-neutral-300 rounded border border-white/5"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
