import React from 'react';

interface HospitalProps {
  progress: number;
}

export const Hospital: React.FC<HospitalProps> = ({ progress }) => {
  const isArrived = progress >= 0.85;
  const isConfirmed = progress >= 0.95;

  return (
    <div className="absolute bottom-12 h-[500px] flex items-end z-10" style={{ left: '170vw' }}>
      
      <div className="absolute -top-16 left-1/2 -translate-x-1/2 flex flex-col items-center">
        <div className="text-[10px] font-bold text-blood-400 tracking-[0.2em]">04</div>
        <div className="text-xl font-bold text-white uppercase tracking-widest whitespace-nowrap drop-shadow-lg">Hospital</div>
      </div>

      <div className="w-[450px] h-[450px] relative">
        <svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMax meet" className="w-full h-full drop-shadow-2xl overflow-visible">
          
          {/* Background Ambient Glow when arrived */}
          <circle cx="200" cy="250" r="150" className={`fill-blood-600/20 blur-3xl transition-opacity duration-1000 ${isArrived ? 'opacity-100' : 'opacity-0'}`} />

          {/* Left Wing */}
          <rect x="40" y="240" width="80" height="160" className="fill-black/30 stroke-white/20 stroke-[1px] backdrop-blur-sm" />
          <rect x="40" y="240" width="80" height="160" className="fill-[url(#glass-gradient)]" />
          
          {/* Right Wing */}
          <rect x="280" y="200" width="80" height="200" className="fill-black/30 stroke-white/20 stroke-[1px] backdrop-blur-sm" />
          <rect x="280" y="200" width="80" height="200" className="fill-[url(#glass-gradient)]" />
          
          {/* Main Tower */}
          <rect x="120" y="80" width="160" height="320" className="fill-black/40 stroke-white/20 stroke-[1px] backdrop-blur-md" />
          
          {/* Grid/Windows */}
          <g className="stroke-white/10" strokeWidth="1">
            {/* Left Wing Grid */}
            <line x1="40" y1="280" x2="120" y2="280" />
            <line x1="40" y1="320" x2="120" y2="320" />
            <line x1="40" y1="360" x2="120" y2="360" />
            <line x1="80" y1="240" x2="80" y2="400" />
            
            {/* Right Wing Grid */}
            <line x1="280" y1="240" x2="360" y2="240" />
            <line x1="280" y1="280" x2="360" y2="280" />
            <line x1="280" y1="320" x2="360" y2="320" />
            <line x1="280" y1="360" x2="360" y2="360" />
            <line x1="320" y1="200" x2="320" y2="400" />

            {/* Main Tower Grid */}
            <line x1="120" y1="120" x2="280" y2="120" />
            <line x1="120" y1="160" x2="280" y2="160" />
            <line x1="120" y1="200" x2="280" y2="200" />
            <line x1="120" y1="240" x2="280" y2="240" />
            <line x1="120" y1="280" x2="280" y2="280" />
            <line x1="120" y1="320" x2="280" y2="320" />
            <line x1="120" y1="360" x2="280" y2="360" />
            <line x1="160" y1="80" x2="160" y2="400" />
            <line x1="200" y1="80" x2="200" y2="400" />
            <line x1="240" y1="80" x2="240" y2="400" />
          </g>
          
          {/* Medical Cross */}
          <g transform="translate(170, 100)" className={`transition-all duration-1000 delay-300 ${isArrived ? 'drop-shadow-[0_0_15px_rgba(239,68,68,1)]' : 'drop-shadow-none'}`}>
            <rect x="20" y="0" width="20" height="60" className={`transition-colors duration-1000 ${isArrived ? 'fill-blood-500' : 'fill-white/20'}`} />
            <rect x="0" y="20" width="60" height="20" className={`transition-colors duration-1000 ${isArrived ? 'fill-blood-500' : 'fill-white/20'}`} />
          </g>

          {/* Entrance */}
          <path d="M160 400 L160 340 C160 310, 240 310, 240 340 L240 400 Z" className="fill-black/80 stroke-white/20" />
          
          {/* AI Scanning Beam (Shoots up when arrived) */}
          <line 
            x1="200" y1="400" x2="200" y2="80" 
            className="stroke-blood-500 stroke-[2px] transition-all duration-[1500ms] ease-out shadow-[0_0_10px_rgba(239,68,68,1)]" 
            style={{ 
              strokeDasharray: '320', 
              strokeDashoffset: isArrived ? '0' : '320',
              opacity: isArrived ? 1 : 0
            }} 
          />
          
          {/* Data Nodes blinking when confirmed */}
          <g className={`transition-opacity duration-300 ${isConfirmed ? 'opacity-100 animate-[pulse_1s_infinite]' : 'opacity-0'}`}>
            <circle cx="140" cy="140" r="3" className="fill-green-400" />
            <circle cx="260" cy="180" r="3" className="fill-green-400" />
            <circle cx="140" cy="260" r="3" className="fill-green-400" />
            <circle cx="260" cy="300" r="3" className="fill-green-400" />
          </g>

          {/* Wing Server Lights (Activate on arrival) */}
          <g className={`transition-opacity duration-1000 delay-500 ${isArrived ? 'opacity-100' : 'opacity-0'}`}>
             <rect x="55" y="295" width="10" height="10" className="fill-white/40 shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
             <rect x="95" y="335" width="10" height="10" className="fill-white/40 shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
             <rect x="295" y="255" width="10" height="10" className="fill-blood-500/80 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
             <rect x="335" y="335" width="10" height="10" className="fill-blood-500/80 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
          </g>
          
          <defs>
            <linearGradient id="glass-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.05)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className={`absolute top-1/2 -left-32 -translate-y-1/2 w-48 transition-opacity duration-1000 ${isArrived ? 'opacity-100' : 'opacity-0'}`}>
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-4">
          <div className="text-[10px] uppercase tracking-widest text-white/50 mb-2">Hospital Receiving</div>
          <div className="flex items-center gap-2 mb-4">
             <div className="w-2 h-2 rounded-full bg-blood-500 animate-pulse" />
             <span className="text-xs font-bold text-white uppercase tracking-widest">Active</span>
          </div>
          
          <div className={`transition-all duration-1000 ${isConfirmed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="pt-3 border-t border-white/20 flex flex-col gap-1">
              <span className="text-[8px] text-green-400 uppercase tracking-[0.2em] font-bold">Delivery Confirmed</span>
              <span className="text-[10px] font-mono text-white">UNIT BC-O+-1042</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
