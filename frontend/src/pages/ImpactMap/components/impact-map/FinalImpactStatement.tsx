import React from 'react';

interface FinalImpactStatementProps {
  show: boolean;
}

export const FinalImpactStatement: React.FC<FinalImpactStatementProps> = ({ show }) => {
  if (!show) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-ink-950/95 backdrop-blur-sm animate-fade-in pointer-events-none">
      <div className="text-center px-4 max-w-4xl animate-slide-up">
        <h2 className="text-4xl md:text-6xl font-editorial font-bold text-white mb-6 leading-tight">
          FROM REACTIVE INVENTORY <br />
          <span className="text-blood-500">TO PREDICTIVE NETWORK CONTROL</span>
        </h2>
        
        <div className="w-24 h-1 bg-blood-600 mx-auto mb-8" />
        
        <p className="text-xl md:text-2xl font-editorial text-ink-300 italic">
          “BloodChain does not simply show where blood is.<br />
          It models what the network should do next.”
        </p>
      </div>
    </div>
  );
};
