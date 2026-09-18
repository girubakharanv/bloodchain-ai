import React from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import { ImpactScenarioData } from '../../types/impactMap';

interface ImpactStoryProps {
  story: ImpactScenarioData['story'];
  show?: boolean;
}

export const ImpactStory: React.FC<ImpactStoryProps> = ({ story, show = true }) => {
  return (
    <div className={`bg-ink-900 border border-ink-800 rounded-2xl p-8 md:p-12 shadow-xl relative overflow-hidden text-white h-full flex flex-col justify-between transition-all duration-1000 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
      <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blood-800/30 via-transparent to-transparent pointer-events-none" />
      
      <div className="relative z-10 mb-12">
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="w-5 h-5 text-blood-500" />
          <h3 className="text-sm font-bold text-white uppercase tracking-widest">
            {story.title}
          </h3>
        </div>
        
        <div className="text-xl md:text-3xl font-editorial leading-relaxed text-ink-200 border-l-4 border-blood-500 pl-6">
          "{story.narrative}"
        </div>
      </div>
      
      <div className="relative z-10 bg-ink-950 border border-ink-800 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        {['PREDICT', 'SIMULATE', 'DECIDE', 'VERIFY', 'LEARN'].map((step, idx, arr) => (
          <React.Fragment key={idx}>
            <div className={`text-[10px] md:text-xs font-bold uppercase tracking-widest flex items-center gap-2 ${
              idx === arr.length - 1 ? 'text-blood-400' : 'text-ink-400'
            }`}>
              {idx === arr.length - 1 && <CheckCircle2 className="w-4 h-4 text-blood-500" />}
              {step}
            </div>
            {idx < arr.length - 1 && (
              <div className="w-px h-6 bg-ink-800 hidden sm:block" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
