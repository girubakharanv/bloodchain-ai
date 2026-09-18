import React from 'react';

interface BloodBankProps {
  progress: number;
}

export const BloodBank: React.FC<BloodBankProps> = ({ progress }) => {
  const isCollecting = progress > 0.3;
  const fillProgress = Math.max(0, Math.min(1, (progress - 0.3) / 0.15));
  const isVerified = progress > 0.45;
  const isReady = progress > 0.5;

  return (
    <div className="absolute bottom-12 h-[400px] flex items-end z-10" style={{ left: '60vw' }}>
      
      <div className="absolute -top-16 left-1/2 -translate-x-1/2 flex flex-col items-center">
        <div className="text-[10px] font-bold text-blood-400 tracking-[0.2em]">02</div>
        <div className="text-xl font-bold text-white uppercase tracking-widest whitespace-nowrap drop-shadow-lg">Blood Bank</div>
      </div>

      <svg viewBox="0 0 300 300" className="w-[350px] h-[350px] drop-shadow-2xl">
        <path d="M20 300 L20 100 L150 50 L280 100 L280 300 Z" className="fill-white/5 stroke-white/20 stroke-[2px]" />
        <path d="M40 300 L40 120 L150 80 L260 120 L260 300 Z" className="fill-blood-900/40" />
        <g transform="translate(150, 150)">
          <rect x="-10" y="-30" width="20" height="60" className="fill-blood-500" />
          <rect x="-30" y="-10" width="60" height="20" className="fill-blood-500" />
        </g>
        <path d="M120 300 L120 230 C120 210, 180 210, 180 230 L180 300 Z" className="fill-black/40" />
      </svg>

      <div className="absolute -right-48 bottom-12 w-48 h-64 flex flex-col items-center justify-end">
        <div className={`bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-3 w-full transition-opacity duration-500 ${isCollecting ? 'opacity-100' : 'opacity-0'}`}>
          <div className="text-[8px] font-bold uppercase tracking-widest text-paper-100 mb-2 flex justify-between">
            <span>Collection</span>
            <span className={isReady ? 'text-green-400' : 'text-blood-400'}>{isReady ? 'Ready' : 'In Progress'}</span>
          </div>
          
          <div className="flex justify-center my-3 relative">
            <svg viewBox="0 0 60 80" className="w-16 h-20">
              <path d="M15 10 L45 10 L50 70 C50 75, 45 80, 30 80 C15 80, 10 75, 10 70 Z" className="fill-white/20 stroke-white/40 stroke-2" />
              <clipPath id="fillClip">
                <rect x="0" y={80 - (fillProgress * 70)} width="60" height="80" />
              </clipPath>
              <path d="M15 10 L45 10 L50 70 C50 75, 45 80, 30 80 C15 80, 10 75, 10 70 Z" className="fill-blood-600" clipPath="url(#fillClip)" />
              <path d="M30 0 L30 10" className="stroke-white/40 stroke-2" />
            </svg>
            <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-10 bg-blood-500 origin-top transition-transform duration-300 ${isCollecting && !isReady ? 'scale-y-100' : 'scale-y-0'}`} />
          </div>

          <div className={`transition-opacity duration-300 ${isVerified ? 'opacity-100' : 'opacity-0'}`}>
            <div className="text-[9px] text-white/70">Type: <span className="font-bold text-white">O+</span></div>
            <div className="text-[9px] text-white/70">Unit: <span className="font-mono text-white">BC-O+-1042</span></div>
            <div className="text-[9px] font-bold text-green-400 mt-1 uppercase tracking-widest">Unit Verified</div>
          </div>
        </div>
      </div>
    </div>
  );
};
