import React from 'react';
import { DecisionExplanation as ExplanationData } from '../types/decisionDna';
import { HelpCircle, AlertOctagon, CornerDownRight } from 'lucide-react';

interface DecisionExplanationProps {
  explanation: ExplanationData;
  currentStage?: number;
}

export const DecisionExplanation: React.FC<DecisionExplanationProps> = ({ explanation, currentStage = 7 }) => {
  const isVisible = currentStage >= 5;
  
  // Highlight the important phrases in the narrative
  const renderNarrative = () => {
    let text = explanation.narrative;
    explanation.highlightedPhrases.forEach(phrase => {
      text = text.replace(
        phrase,
        `<span class="bg-blood-50 text-blood-900 font-bold px-1 rounded mx-0.5 border border-blood-100">${phrase}</span>`
      );
    });
    return <div dangerouslySetInnerHTML={{ __html: text }} />;
  };

  return (
    <div className={`bg-white border border-ink-200 rounded-2xl p-8 shadow-sm transition-all duration-700 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-20 translate-y-4 pointer-events-none'
    }`}>
      <div className="flex items-center gap-2 mb-6 border-b border-ink-100 pb-4">
        <HelpCircle className="w-5 h-5 text-ink-400" />
        <h3 className="text-sm font-bold text-ink-900 uppercase tracking-widest">
          WHY THIS DECISION?
        </h3>
      </div>
      
      <div className="text-xl md:text-2xl text-ink-700 leading-relaxed font-editorial italic mb-8 border-l-4 border-blood-400 pl-6">
        " {renderNarrative()} "
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="text-[10px] font-bold text-ink-500 uppercase tracking-widest mb-3">
            PRIMARY REASON
          </div>
          <div className="text-sm font-bold text-ink-900 px-4 py-3 bg-ink-50 rounded-lg border border-ink-200">
            {explanation.primaryReason}
          </div>
        </div>
        
        <div>
          <div className="text-[10px] font-bold text-ink-500 uppercase tracking-widest mb-3">
            SUPPORTING REASONS
          </div>
          <div className="flex flex-col gap-2">
            {explanation.supportingReasons.map((reason, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm text-ink-700">
                <CornerDownRight className="w-4 h-4 text-ink-300" />
                {reason}
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <div className="text-[10px] font-bold text-ink-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
            <AlertOctagon className="w-3 h-3" /> CONSTRAINT
          </div>
          <div className="text-sm font-bold text-blood-700 px-4 py-3 bg-blood-50 rounded-lg border border-blood-200">
            {explanation.constraint}
          </div>
        </div>
      </div>
    </div>
  );
};
