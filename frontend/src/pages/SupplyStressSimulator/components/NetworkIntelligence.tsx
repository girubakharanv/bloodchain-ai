import React from 'react';
import { EngineResult } from '../utils/supplyStressEngine';
import { BrainCircuit, Compass, Clock, MapPin, Network, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NetworkIntelligenceProps {
  baseline: EngineResult;
  active: EngineResult;
}

export const NetworkIntelligence: React.FC<NetworkIntelligenceProps> = ({ baseline, active }) => {
  const weakestLink = active.weakestLink?.name || 'None detected';
  const bottleneck = active.bottlenecks[0]?.name || 'None detected';

  const resilienceDiff = active.networkResilience - baseline.networkResilience;
  const shortageDiff = active.shortageExposure - baseline.shortageExposure;

  return (
    <div className="bg-ink-900 border border-ink-800 rounded-2xl shadow-xl overflow-hidden h-full flex flex-col relative animate-fade-in-up">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blood-900/40 via-transparent to-transparent pointer-events-none" />
      
      <div className="px-6 py-5 border-b border-ink-800/80 flex items-center gap-3">
        <BrainCircuit className="w-5 h-5 text-amber-500" />
        <h3 className="text-sm font-bold text-white uppercase tracking-[0.2em]">
          Network Intelligence
        </h3>
      </div>
      
      <div className="p-6 flex-grow flex flex-col relative z-10 overflow-y-auto">
        
        <div className="mb-8">
          <p className="text-lg md:text-xl font-editorial font-bold text-white leading-relaxed">
            "The network's primary vulnerability is <span className="text-blood-400">{weakestLink}</span>, where reduced capacity creates the largest downstream resilience impact."
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-ink-800/50 rounded-lg p-4 border border-ink-800">
            <div className="text-[9px] uppercase font-bold tracking-widest text-ink-500 mb-1">Primary Stressor</div>
            <div className="text-sm font-bold text-amber-500">{active.primaryStressor}</div>
          </div>
          <div className="bg-ink-800/50 rounded-lg p-4 border border-ink-800">
            <div className="text-[9px] uppercase font-bold tracking-widest text-ink-500 mb-1">Weakest Link</div>
            <div className="text-sm font-bold text-blood-400">{weakestLink}</div>
          </div>
          <div className="bg-ink-800/50 rounded-lg p-4 border border-ink-800">
            <div className="text-[9px] uppercase font-bold tracking-widest text-ink-500 mb-1">Bottleneck</div>
            <div className="text-sm font-bold text-amber-400">{bottleneck}</div>
          </div>
          <div className="bg-ink-800/50 rounded-lg p-4 border border-ink-800 flex items-center justify-between">
            <div>
              <div className="text-[9px] uppercase font-bold tracking-widest text-ink-500 mb-1">Resilience</div>
              <div className="text-xl font-editorial font-bold text-white">{active.networkResilience}</div>
            </div>
            <div className={`text-xs font-bold ${resilienceDiff < 0 ? 'text-blood-500' : 'text-emerald-500'}`}>
              {resilienceDiff < 0 ? '' : '+'}{resilienceDiff}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-8">
           <div className="bg-ink-950 rounded-lg p-4 border border-ink-800">
              <h4 className="text-[10px] uppercase font-bold tracking-widest text-ink-500 mb-4 text-center border-b border-ink-800 pb-2">Network Before</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm"><span className="text-ink-400">Resilience</span><span className="text-ink-200 font-bold">{baseline.networkResilience}</span></div>
                <div className="flex justify-between text-sm"><span className="text-ink-400">Shortage Exp.</span><span className="text-ink-200 font-bold">{baseline.shortageExposure}%</span></div>
                <div className="flex justify-between text-sm"><span className="text-ink-400">Stressed Facs.</span><span className="text-ink-200 font-bold">{baseline.stressedFacilities}</span></div>
                <div className="flex justify-between text-sm"><span className="text-ink-400">Bottlenecks</span><span className="text-ink-200 font-bold">{baseline.bottlenecks.length}</span></div>
              </div>
           </div>
           
           <div className="bg-ink-950 rounded-lg p-4 border border-ink-800 relative">
              <div className="absolute top-1/2 -left-4 -translate-y-1/2 w-8 h-8 rounded-full bg-ink-800 flex items-center justify-center border border-ink-700 z-10">
                <ArrowRightIcon className="w-4 h-4 text-ink-400" />
              </div>
              <h4 className="text-[10px] uppercase font-bold tracking-widest text-amber-500 mb-4 text-center border-b border-ink-800 pb-2">Network After</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm"><span className="text-ink-400">Resilience</span><span className="text-amber-500 font-bold">{active.networkResilience}</span></div>
                <div className="flex justify-between text-sm"><span className="text-ink-400">Shortage Exp.</span><span className="text-blood-400 font-bold">{active.shortageExposure}%</span></div>
                <div className="flex justify-between text-sm"><span className="text-ink-400">Stressed Facs.</span><span className="text-amber-500 font-bold">{active.stressedFacilities}</span></div>
                <div className="flex justify-between text-sm"><span className="text-ink-400">Bottlenecks</span><span className="text-amber-500 font-bold">{active.bottlenecks.length}</span></div>
              </div>
           </div>
        </div>

        <div className="mt-auto pt-6 border-t border-ink-800">
          <h4 className="text-[9px] font-bold text-ink-500 mb-4 uppercase tracking-widest">
            Cross-Feature Action Plans
          </h4>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Link to="/collection-compass" className="bg-ink-800/30 hover:bg-ink-800 border border-ink-800 hover:border-ink-600 rounded-lg p-3 flex flex-col items-center justify-center text-center gap-2 transition-colors group">
              <Compass className="w-5 h-5 text-ink-400 group-hover:text-white transition-colors" />
              <span className="text-[10px] font-bold text-ink-300 uppercase tracking-wider leading-tight">View Collection<br/>Pressure</span>
            </Link>
            <div className="bg-ink-800/30 hover:bg-ink-800 border border-ink-800 hover:border-ink-600 rounded-lg p-3 flex flex-col items-center justify-center text-center gap-2 transition-colors group cursor-pointer opacity-50">
              <Clock className="w-5 h-5 text-ink-400 group-hover:text-white transition-colors" />
              <span className="text-[10px] font-bold text-ink-300 uppercase tracking-wider leading-tight">View Expiry<br/>Pressure</span>
            </div>
            <div className="bg-ink-800/30 hover:bg-ink-800 border border-ink-800 hover:border-ink-600 rounded-lg p-3 flex flex-col items-center justify-center text-center gap-2 transition-colors group cursor-pointer opacity-50">
              <Network className="w-5 h-5 text-ink-400 group-hover:text-white transition-colors" />
              <span className="text-[10px] font-bold text-ink-300 uppercase tracking-wider leading-tight">View Network<br/>Future</span>
            </div>
            <Link to="/rescue-route" className="bg-ink-800/30 hover:bg-ink-800 border border-ink-800 hover:border-ink-600 rounded-lg p-3 flex flex-col items-center justify-center text-center gap-2 transition-colors group">
              <MapPin className="w-5 h-5 text-ink-400 group-hover:text-white transition-colors" />
              <span className="text-[10px] font-bold text-ink-300 uppercase tracking-wider leading-tight">View Route<br/>Options</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

const ArrowRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);
