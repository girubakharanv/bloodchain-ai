import React, { useEffect, useRef, useState } from 'react';
import { workflowStages } from './workflowData';
import { WorkflowScene } from './WorkflowScene';

export const BloodWorkflow: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const scrollableDistance = rect.height - window.innerHeight;
      let scrollY = -rect.top;
      
      if (scrollY < 0) scrollY = 0;
      if (scrollY > scrollableDistance) scrollY = scrollableDistance;

      let currentProgress = scrollY / scrollableDistance;
      if (isNaN(currentProgress)) currentProgress = 0;
      
      setProgress(currentProgress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const activeStage = workflowStages.find(
    stage => progress >= stage.startProgress && progress <= stage.endProgress
  ) || workflowStages[workflowStages.length - 1];

  return (
    <section ref={containerRef} className="relative w-full" style={{ height: '2000vh' }}>
      
      <div className="sticky top-0 w-full h-screen bg-[#3a0505] overflow-hidden flex flex-col font-sans">
        
        <div className="absolute inset-0 z-0 pointer-events-none opacity-40 mix-blend-overlay" 
             style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a0101]/60 via-transparent to-[#1a0101]/80 z-0 pointer-events-none" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blood-600/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blood-800/10 rounded-full blur-[120px] pointer-events-none" />

        <header className="relative z-20 w-full px-6 py-8 flex justify-between items-center text-paper-100">
          <div className="font-bold tracking-tight text-xl">BLOODCHAIN <span className="font-light">AI</span></div>
          <div className="hidden md:flex gap-8 text-xs font-bold tracking-[0.2em] uppercase text-paper-100/70">
            <span>Workflow</span>
            <span>Intelligence</span>
            <span>Impact</span>
          </div>
          <button className="text-xs font-bold uppercase tracking-widest px-4 py-2 border border-paper-100/30 rounded-full hover:bg-white/10 transition-colors">
            Explore Network
          </button>
        </header>

        <div className="relative z-20 px-6 md:px-12 pt-8 pointer-events-none">
          <span className="text-[10px] font-bold tracking-[0.2em] text-blood-400 uppercase mb-4 block">
            The Journey of a Single Drop
          </span>
          <h2 className="font-editorial text-4xl md:text-5xl font-bold text-white mb-2 leading-tight">
            From donor <br/> to delivery.
          </h2>
          <p className="text-sm md:text-base text-paper-100/70 max-w-sm">
            Every drop moves through a chain of people, decisions and logistics.
          </p>
        </div>

        <div className="flex-1 w-full relative z-10 flex items-center mt-12 md:mt-0">
          <WorkflowScene progress={progress} />
        </div>

        <div className="relative z-20 w-full px-6 py-8 pb-12">
          <div className="max-w-4xl mx-auto flex justify-between items-center relative pointer-events-none">
            <div className="absolute top-1/2 left-0 w-full h-px bg-white/10 -z-10" />
            <div className="absolute top-1/2 left-0 h-px bg-blood-400 -z-10 transition-all duration-300" style={{ width: `${progress * 100}%` }} />
            
            {workflowStages.map((stage) => {
              const isActive = activeStage.id === stage.id;
              const isPassed = progress > stage.endProgress;
              return (
                <div key={stage.id} className="flex flex-col items-center gap-2">
                  <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${isActive || isPassed ? 'bg-blood-400 shadow-[0_0_10px_rgba(248,113,113,0.5)]' : 'bg-white/20'}`} />
                  <span className={`hidden md:block text-[9px] font-bold tracking-widest uppercase transition-colors duration-300 ${isActive ? 'text-white' : 'text-white/40'}`}>
                    {stage.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
