import React from 'react';

interface DonorCharacterProps {
  progress: number;
}

export const DonorCharacter: React.FC<DonorCharacterProps> = ({ progress }) => {
  const isWalking = progress > 0.05 && progress < 0.25;
  const walkProgress = Math.max(0, Math.min(1, (progress - 0.05) / 0.20));
  const posX = 10 + (walkProgress * 40);

  return (
    <div 
      className="absolute bottom-12 w-20 h-40 flex flex-col items-center justify-end z-20"
      style={{ 
        left: `${posX}vw`,
        transition: 'left 0.1s linear'
      }}
    >
      <div className="absolute -top-12 flex flex-col items-center">
        <div className={`text-[9px] font-bold tracking-widest text-white uppercase bg-white/10 px-2 py-1 rounded backdrop-blur-md mb-2 transition-opacity duration-500 ${progress > 0 ? 'opacity-100' : 'opacity-0'}`}>
          Donation Registered
        </div>
        <div className="text-[10px] font-bold text-blood-400 tracking-[0.2em]">01</div>
        <div className="text-sm font-bold text-white uppercase tracking-widest whitespace-nowrap">Blood Donor</div>
      </div>

      <svg viewBox="0 0 100 185" preserveAspectRatio="xMidYMax meet" className={`w-full h-full drop-shadow-2xl ${isWalking ? "animate-[donorBounce_0.3s_infinite_alternate_ease-in-out]" : ""}`}>
        {/* Head */}
        <circle cx="50" cy="30" r="15" className="fill-paper-100" />
        
        {/* Body */}
        <path d="M40 50 Q50 45 60 50 L65 110 L35 110 Z" className="fill-paper-100" />
        
        {/* Back Arm */}
        <path d="M40 55 L30 90" stroke="rgba(255,255,255,0.7)" strokeWidth="6" strokeLinecap="round" className={isWalking ? "animate-[armSwingBack_0.6s_infinite_alternate_ease-in-out]" : ""} style={{ transformOrigin: '40px 55px' }} />
        
        {/* Legs */}
        <path d="M42 110 L40 180" stroke="rgba(255,255,255,0.8)" strokeWidth="8" strokeLinecap="round" className={isWalking ? "animate-[legWalkLeft_0.6s_infinite_alternate_ease-in-out]" : ""} style={{ transformOrigin: '42px 110px' }} />
        <path d="M58 110 L60 180" stroke="white" strokeWidth="8" strokeLinecap="round" className={isWalking ? "animate-[legWalkRight_0.6s_infinite_alternate_ease-in-out]" : ""} style={{ transformOrigin: '58px 110px' }} />
        
        {/* Front Arm */}
        <path d="M60 55 L70 95" stroke="white" strokeWidth="6" strokeLinecap="round" className={isWalking ? "animate-[armSwingFront_0.6s_infinite_alternate_ease-in-out]" : ""} style={{ transformOrigin: '60px 55px' }} />
      </svg>

      <style>{`
        @keyframes donorBounce { 0% { transform: translateY(0); } 100% { transform: translateY(3px); } }
        @keyframes armSwingFront { 0% { transform: rotate(-25deg); } 100% { transform: rotate(25deg); } }
        @keyframes armSwingBack { 0% { transform: rotate(25deg); } 100% { transform: rotate(-25deg); } }
        @keyframes legWalkLeft { 0% { transform: rotate(-20deg); } 100% { transform: rotate(20deg); } }
        @keyframes legWalkRight { 0% { transform: rotate(20deg); } 100% { transform: rotate(-20deg); } }
      `}</style>
    </div>
  );
};
