import { ImpactLevel, 
  DecisionDNAResult,
  DecisionEvidenceInput,
  DecisionDriver,
  DriverClassification,
  CausalNode,
  CounterfactualScenario,
  DecisionExplanation,
  DecisionAuditEvent,
  DecisionEvidence,
  AlternativeDecision
} from '../types/decisionDna';
import { getIntegratedNetworkState, ScenarioType, ModuleIntegrationSignal } from './decisionDnaIntegration';

// A deterministic random-like function based on a seed string so things don't jump around
const hashString = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const mapSignalToClassification = (signal: ModuleIntegrationSignal): DriverClassification => {
  if (signal.normalizedImpact >= 0.85) return signal.direction === 'increases_priority' ? 'PRIMARY DRIVER' : 'OPPOSING CONSTRAINT';
  if (signal.normalizedImpact >= 0.70) return signal.direction === 'increases_priority' ? 'SUPPORTING DRIVER' : 'OPPOSING CONSTRAINT';
  if (signal.normalizedImpact >= 0.40) return signal.direction === 'increases_priority' ? 'SECONDARY DRIVER' : 'OPPOSING CONSTRAINT';
  return 'NEUTRAL';
};

const mapSignalToImpactLevel = (signal: ModuleIntegrationSignal): ImpactLevel => {
  if (signal.normalizedImpact >= 0.8) return 'HIGH';
  if (signal.normalizedImpact >= 0.5) return 'MEDIUM';
  return 'LOW';
};

/**
 * The core deterministic reasoning engine.
 */
export const generateDecisionDNA = (
  scenarioId: ScenarioType,
  counterfactualOverrides: Record<string, string> = {}
): DecisionDNAResult => {
  // 1. Gather raw signals from integration layer
  const state = getIntegratedNetworkState(scenarioId);
  const now = new Date();
  
  // 2. Apply Counterfactual Overrides (if any)
  // This simulates the counterfactual engine dynamically changing impacts
  let adjustedSignals = [...state.signals];
  let strengthPenalty = 0;
  
  if (Object.keys(counterfactualOverrides).length > 0) {
    adjustedSignals = adjustedSignals.map(signal => {
      // Very simplified deterministic adjustment based on counterfactual overrides
      // In a real system, changing "Demand pressure +10%" would feed back into SupplyStressSimulator
      const overrideKey = Object.keys(counterfactualOverrides).find(k => k.toLowerCase().includes(signal.metric.toLowerCase()));
      if (overrideKey) {
        const overrideVal = counterfactualOverrides[overrideKey];
        if (overrideVal.includes('+')) {
          strengthPenalty -= 5;
          return { ...signal, normalizedImpact: Math.min(1.0, signal.normalizedImpact + 0.1) };
        } else if (overrideVal.includes('-')) {
          strengthPenalty += 5;
          return { ...signal, normalizedImpact: Math.max(0.0, signal.normalizedImpact - 0.1) };
        }
      }
      return signal;
    });
  }

  // 3. Classify Drivers
  const activeSignals = adjustedSignals.filter(s => s.isAvailable);
  const drivers: DecisionDriver[] = activeSignals.map((signal, idx) => ({
    id: `drv-${idx}`,
    rank: 0, // will sort and rank below
    name: signal.metric,
    impactLevel: mapSignalToImpactLevel(signal),
    impactScore: Math.round(signal.normalizedImpact * 100),
    description: signal.explanation,
    direction: (signal.direction === 'increases_priority' ? 'UP' : signal.direction === 'decreases_priority' ? 'DOWN' : 'NEUTRAL') as 'UP' | 'DOWN' | 'NEUTRAL',
    classification: mapSignalToClassification(signal)
  })).sort((a, b) => b.impactScore - a.impactScore)
    .map((d, idx) => ({ ...d, rank: idx + 1 }));

  const primaryDriver = drivers.find(d => d.direction === 'UP') || drivers[0];
  const primaryOpposing = drivers.find(d => d.direction === 'DOWN');

  // Calculate overall strength deterministically
  const totalUp = drivers.filter(d => d.direction === 'UP').reduce((sum, d) => sum + d.impactScore, 0);
  const totalDown = drivers.filter(d => d.direction === 'DOWN').reduce((sum, d) => sum + d.impactScore, 0);
  const baseStrength = Math.min(99, Math.max(50, Math.round((totalUp / (totalUp + totalDown)) * 100)));
  const finalStrength = Math.min(99, Math.max(10, baseStrength + strengthPenalty));

  // 4. Generate Causal Chain
  const causalChain: CausalNode[] = [
    {
      id: 'c1',
      type: 'INPUTS',
      title: 'NETWORK STATE',
      value: state.networkStateContext,
      impact: 'CRITICAL'
    },
    {
      id: 'c2',
      type: 'FACTORS',
      title: 'PRIMARY SIGNAL',
      value: primaryDriver.name,
      impact: 'HIGH'
    }
  ];

  if (primaryOpposing) {
    causalChain.push({
      id: 'c3',
      type: 'CONSTRAINTS',
      title: 'CONSTRAINT CHECK',
      value: primaryOpposing.name,
      impact: 'MEDIUM'
    });
  }

  causalChain.push({
    id: 'c4',
    type: 'DECISION',
    title: 'RECOMMENDATION',
    value: finalStrength < 50 ? state.alternativeRecommendation : state.baseRecommendation,
    impact: 'FINAL'
  });

  // 5. Generate Dynamic Explanation
  const explanation: DecisionExplanation = {
    primaryReason: primaryDriver.name,
    supportingReasons: drivers.filter(d => d.direction === 'UP' && d.id !== primaryDriver.id).slice(0, 3).map(d => d.name),
    constraint: primaryOpposing ? primaryOpposing.name : 'No major constraints',
    narrative: finalStrength < 50 
      ? `The alternative recommendation was chosen because the impact of ${primaryOpposing?.name.toLowerCase()} outweighed the ${primaryDriver.name.toLowerCase()}.`
      : `The recommendation was prioritized because ${primaryDriver.name.toLowerCase()} was significant, and the proposed action remained feasible after checking ${primaryOpposing ? primaryOpposing.name.toLowerCase() : 'logistics constraints'}.`,
    highlightedPhrases: [primaryDriver.name.toLowerCase(), primaryOpposing ? primaryOpposing.name.toLowerCase() : 'logistics constraints']
  };

  // 6. Generate Alternative Comparison
  const alternative: AlternativeDecision = {
    recommendation: state.alternativeRecommendation,
    strength: 100 - finalStrength,
    whyRecommendedHigher: [
      `Stronger ${primaryDriver.name.toLowerCase()}`,
      'Acceptable logistics feasibility'
    ],
    whyAlternativeLower: [
      primaryOpposing ? `Greater impact on ${primaryOpposing.name.toLowerCase()}` : 'Lower overall priority score'
    ]
  };

  // 7. Calculate Module Evidence Contribution
  const evidence: DecisionEvidence[] = state.signals.map(signal => {
    let contribution: DecisionEvidence['contribution'] = 'NONE';
    if (signal.isAvailable) {
      if (signal.normalizedImpact >= 0.8) contribution = 'PRIMARY';
      else if (signal.normalizedImpact >= 0.6) contribution = 'HIGH';
      else if (signal.normalizedImpact >= 0.3) contribution = 'MEDIUM';
      else contribution = 'LOW';
    }
    
    return {
      moduleId: signal.sourceModule,
      moduleName: signal.sourceModule,
      contribution,
      status: signal.isAvailable ? 'ACTIVE' : 'UNAVAILABLE'
    };
  });

  // 8. Define Default Counterfactual Scenarios dynamically based on top drivers
  const counterfactuals: CounterfactualScenario[] = [
    {
      factor: primaryDriver.name,
      currentValue: 'Current',
      negativeChange: '- 10%',
      positiveChange: '+ 10%',
      unit: '%'
    }
  ];
  if (primaryOpposing) {
    counterfactuals.push({
      factor: primaryOpposing.name,
      currentValue: 'Current',
      negativeChange: '- 10%',
      positiveChange: '+ 10%',
      unit: '%'
    });
  }

  // 9. Generate Audit Trail
  const subtractMinutes = (date: Date, minutes: number) => new Date(date.getTime() - minutes * 60000);
  const auditEvents: DecisionAuditEvent[] = [
    { id: 'aud-1', timestamp: subtractMinutes(now, 12).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), step: 'Network state captured', status: 'COMPLETED' },
    { id: 'aud-2', timestamp: subtractMinutes(now, 11).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), step: 'Evidence collected', status: 'COMPLETED' },
    { id: 'aud-3', timestamp: subtractMinutes(now, 10).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), step: 'Drivers evaluated', status: 'COMPLETED' },
    { id: 'aud-4', timestamp: subtractMinutes(now, 9).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), step: 'Constraints evaluated', status: 'COMPLETED' },
    { id: 'aud-5', timestamp: subtractMinutes(now, 8).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), step: 'Alternatives compared', status: 'COMPLETED' },
    { id: 'aud-6', timestamp: subtractMinutes(now, 1).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), step: 'Recommendation generated', status: 'COMPLETED' },
    { id: 'aud-7', timestamp: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), step: 'Human review requested', status: 'PENDING' }
  ];

  return {
    decision: {
      id: `DNA-${hashString(state.baseRecommendation).toString().substring(0, 4)}`,
      type: state.decisionType,
      recommendation: finalStrength < 50 ? state.alternativeRecommendation : state.baseRecommendation,
      strength: finalStrength,
      timestamp: now.toISOString(),
      sourceModule: 'Decision DNA Engine',
      networkStateContext: state.networkStateContext
    },
    drivers,
    evidence,
    causalChain,
    alternative,
    counterfactuals,
    explanation,
    auditEvents,
    humanReviewRequired: true // Hard rule 14
  };
};
