import React from 'react';
import './_gradient-border.css';

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

export function GradientBorder() {
  return (
    <div className="min-h-screen bg-black text-white p-8 md:p-16 flex items-center justify-center font-satoshi">
      <div className="max-w-7xl mx-auto w-full">
        
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-2">Selected Works</h2>
          <p className="text-zinc-400">A collection of recent product design case studies.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <a 
              href={`#project-${project.id}`} 
              key={project.id}
              className="group block outline-none"
            >
              <div className="gradient-card-wrapper h-full">
                <div className="gradient-card-inner">
                  {/* Thumbnail */}
                  <div className="aspect-square gradient-image-placeholder relative overflow-hidden">
                    {/* Decorative element inside placeholder */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-30 group-hover:opacity-60 transition-opacity duration-500">
                       <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                        <polyline points="21 15 16 10 5 21"></polyline>
                      </svg>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="text-xs font-medium tracking-wider text-zinc-500 uppercase mb-3">
                      {project.date}
                    </div>
                    
                    <h3 className="text-xl font-semibold mb-3 leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#ff6b00] group-hover:to-[#e52e71] transition-all duration-300">
                      {project.title}
                    </h3>
                    
                    <p className="text-zinc-400 text-sm leading-relaxed mb-6 flex-grow">
                      {project.description}
                    </p>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-zinc-800/50">
                      {project.tags.map(tag => (
                        <span 
                          key={tag} 
                          className="px-2.5 py-1 text-xs font-medium bg-zinc-900 text-zinc-300 rounded-full border border-zinc-800/80"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
