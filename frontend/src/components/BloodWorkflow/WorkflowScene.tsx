import React from 'react';
import { DonorCharacter } from './DonorCharacter';
import { BloodBank } from './BloodBank';
import { DeliveryVehicle } from './DeliveryVehicle';
import { Hospital } from './Hospital';
import { LogisticsRoute } from './LogisticsRoute';
import { intelligenceSignals } from './workflowData';

interface WorkflowSceneProps {
  progress: number;
}

export const WorkflowScene: React.FC<WorkflowSceneProps> = ({ progress }) => {
  const panX = -(progress * 140); 

  return (
    <div className="w-full h-[60vh] md:h-[70vh] relative">
      
      <div 
        className="absolute inset-y-0 left-0 w-[240vw] h-full transition-transform duration-300 ease-out"
        style={{ transform: `translateX(${panX}vw)` }}
      >
        
        <div className="absolute bottom-12 w-full h-[1px] bg-white/10" />

        {intelligenceSignals.map((signal, idx) => {
          const isVisible = progress > signal.progress - 0.1;
          return (
            <div 
              key={idx}
              className={`absolute bottom-32 flex flex-col items-center transition-all duration-1000 ${isVisible ? 'opacity-100 -translate-y-4' : 'opacity-0 translate-y-0'}`}
              style={{ left: `${(signal.progress * 140) + 20}vw` }}
            >
              <div className="w-[1px] h-12 bg-gradient-to-t from-blood-500/0 to-blood-500/50 mb-2" />
              <div className="text-[8px] font-bold tracking-[0.3em] uppercase text-blood-400 bg-blood-900/30 px-3 py-1 rounded-full border border-blood-500/30 backdrop-blur-sm">
                {signal.label}
              </div>
            </div>
          );
        })}

        <LogisticsRoute progress={progress} />
        <DonorCharacter progress={progress} />
        <BloodBank progress={progress} />
        <DeliveryVehicle progress={progress} />
        <Hospital progress={progress} />

        <div className={`absolute top-4 flex flex-col items-center justify-center transition-all duration-1000 delay-300 ${progress > 0.95 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ left: '170vw', width: '450px' }}>
           <h3 className="font-editorial text-3xl md:text-4xl font-bold text-white mb-2 text-center drop-shadow-xl">Every drop has a journey.</h3>
           <p className="text-paper-100/70 text-sm md:text-base text-center drop-shadow-lg">BloodChain AI makes that journey predictable.</p>
        </div>

      </div>
    </div>
  );
};
