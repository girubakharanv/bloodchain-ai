import React from 'react';

interface DeliveryVehicleProps {
  progress: number;
}

export const DeliveryVehicle: React.FC<DeliveryVehicleProps> = ({ progress }) => {
  const isMoving = progress > 0.55 && progress < 0.85;
  const isArrived = progress >= 0.85;
  const travelProgress = Math.max(0, Math.min(1, (progress - 0.55) / 0.30));
  const posX = 110 + (travelProgress * 40);

  return (
    <div 
      className="absolute bottom-12 w-[300px] flex flex-col items-center justify-end z-30"
      style={{ left: `${posX}vw`, transition: 'left 0.1s linear' }}
    >
      <div className={`absolute -top-16 bg-white/10 backdrop-blur-md border border-white/20 rounded p-2 flex flex-col items-center transition-opacity duration-500 ${progress > 0.5 ? 'opacity-100' : 'opacity-0'}`}>
        <div className="text-[8px] font-bold tracking-widest text-white uppercase mb-1">
          {isArrived ? 'Delivery Complete' : isMoving ? 'In Transit' : 'Dispatching'}
        </div>
        <div className="flex gap-4">
          <div className="flex flex-col items-center">
            <span className="text-[8px] text-white/50 uppercase">Temp</span>
            <span className="text-[10px] font-mono text-green-400">4.8°C</span>
          </div>
          <div className="flex flex-col items-center border-l border-white/20 pl-4">
            <span className="text-[8px] text-white/50 uppercase">Unit</span>
            <span className="text-[10px] font-mono text-white">BC-O+-1042</span>
          </div>
        </div>
      </div>

      <svg viewBox="0 0 250 103" className="w-full h-auto overflow-visible">
        {/* Force viewBox bounds in all browsers */}
        <rect x="0" y="0" width="250" height="103" fill="transparent" />
        {/* Speed Lines */}
        <g className={`transition-opacity duration-300 ${isMoving ? 'opacity-100' : 'opacity-0'}`}>
          <line x1="0" y1="95" x2="40" y2="95" stroke="#ffffff" strokeOpacity="0.4" strokeWidth="2" strokeLinecap="round" className="animate-[speedLine_0.4s_linear_infinite]" />
          <line x1="-20" y1="85" x2="20" y2="85" stroke="#ffffff" strokeOpacity="0.2" strokeWidth="2" strokeLinecap="round" className="animate-[speedLine_0.6s_linear_infinite_0.2s]" />
          <line x1="10" y1="75" x2="30" y2="75" stroke="#ffffff" strokeOpacity="0.3" strokeWidth="2" strokeLinecap="round" className="animate-[speedLine_0.5s_linear_infinite_0.1s]" />
        </g>

        <g className={isMoving ? 'animate-[vehicleBounce_0.4s_infinite_ease-in-out]' : ''} style={{ transformOrigin: '100px 85px' }}>
          {/* Main Body */}
          <path d="M15 85 L10 50 L20 15 C30 5, 45 5, 60 5 L130 5 C150 5, 160 20, 175 45 L195 65 L195 85 Z" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
          
          {/* Back detail */}
          <rect x="10" y="55" width="5" height="15" fill="#dc2626" />
          
          {/* Headlight */}
          <path d="M190 70 L195 70 L195 75 L190 75 Z" fill="#fde047" />
          <path d="M195 70 L240 60 L240 90 L195 75 Z" fill="url(#headlight-grad)" className={`transition-opacity duration-300 ${isMoving ? 'opacity-100' : 'opacity-0'}`} />

          {/* Windows */}
          <path d="M120 15 L145 15 L165 45 L120 45 Z" fill="#0f172a" />
          <path d="M85 15 L110 15 L110 45 L85 45 Z" fill="#0f172a" />
          
          {/* Blood Cross */}
          <g transform="translate(45, 25)">
            <rect x="-5" y="-12" width="10" height="24" fill="#dc2626" />
            <rect x="-12" y="-5" width="24" height="10" fill="#dc2626" />
          </g>
          
          {/* Ambulance Stripe */}
          <path d="M15 65 L188 65 L190 70 L15 70 Z" fill="#dc2626" />
        </g>
        
        {/* Wheels */}
        <g>
          {/* Back Wheel */}
          <circle cx="45" cy="85" r="16" fill="#0f172a" stroke="#cbd5e1" strokeWidth="2" />
          <g className={isMoving ? 'animate-[wheelSpin_0.4s_linear_infinite]' : ''} style={{ transformOrigin: '45px 85px' }}>
            <circle cx="45" cy="85" r="9" fill="#94a3b8" />
            <circle cx="45" cy="85" r="8" fill="none" stroke="#f8fafc" strokeWidth="2" strokeDasharray="6 4" />
          </g>
          <circle cx="45" cy="85" r="4" fill="#334155" />

          {/* Front Wheel */}
          <circle cx="155" cy="85" r="16" fill="#0f172a" stroke="#cbd5e1" strokeWidth="2" />
          <g className={isMoving ? 'animate-[wheelSpin_0.4s_linear_infinite]' : ''} style={{ transformOrigin: '155px 85px' }}>
            <circle cx="155" cy="85" r="9" fill="#94a3b8" />
            <circle cx="155" cy="85" r="8" fill="none" stroke="#f8fafc" strokeWidth="2" strokeDasharray="6 4" />
          </g>
          <circle cx="155" cy="85" r="4" fill="#334155" />
        </g>

        <defs>
          <linearGradient id="headlight-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(253, 224, 71, 0.6)" />
            <stop offset="100%" stopColor="rgba(253, 224, 71, 0)" />
          </linearGradient>
        </defs>

        <style>{`
          @keyframes vehicleBounce { 
            0%, 100% { transform: translateY(0) rotate(0deg); } 
            50% { transform: translateY(3px) rotate(0.5deg); } 
          }
          @keyframes wheelSpin { 
            0% { transform: rotate(0deg); } 
            100% { transform: rotate(360deg); } 
          }
          @keyframes speedLine {
            0% { transform: translateX(20px); opacity: 0; }
            50% { opacity: 1; }
            100% { transform: translateX(-40px); opacity: 0; }
          }
        `}</style>
      </svg>
    </div>
  );
};
