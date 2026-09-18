import React from 'react';

interface LogisticsRouteProps {
  progress: number;
}

export const LogisticsRoute: React.FC<LogisticsRouteProps> = ({ progress }) => {
  return (
    <div className="absolute bottom-12 w-full h-[2px] z-0" style={{ left: 0 }}>
      <div className="absolute top-0 h-full bg-white/10" style={{ left: '50vw', width: '120vw' }} />
      <div 
        className="absolute top-0 h-full bg-blood-500 transition-all duration-300 shadow-[0_0_8px_rgba(239,68,68,0.5)]" 
        style={{ left: '50vw', width: `${progress * 120}vw` }} 
      />
      <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#3a0505] border-2 border-white/20" style={{ left: '50vw' }} />
      <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#3a0505] border-2 border-white/20" style={{ left: '110vw' }} />
      <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#3a0505] border-2 border-white/20" style={{ left: '170vw' }} />
    </div>
  );
};
