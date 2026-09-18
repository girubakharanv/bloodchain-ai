export type ScenarioType = 
  | 'SCENARIO_A' // Constrained O+ allocation
  | 'SCENARIO_B' // High expiry pressure
  | 'SCENARIO_C' // Transport disruption
  | 'SCENARIO_D' // Cold-chain risk escalation
  | 'SCENARIO_E' // Regional collection shortage
  | 'SCENARIO_F'; // Network stress event

export interface ModuleIntegrationSignal {
  sourceModule: string;
  metric: string;
  value: number | string;
  normalizedImpact: number; // 0.0 to 1.0
  direction: 'increases_priority' | 'decreases_priority' | 'neutral';
  explanation: string;
  isAvailable: boolean;
}

export interface NetworkScenarioState {
  scenarioId: ScenarioType;
  signals: ModuleIntegrationSignal[];
  networkStateContext: string;
  decisionType: string;
  baseRecommendation: string;
  alternativeRecommendation: string;
}

/**
 * Simulates calling existing BloodChain modules and gathering their output metrics.
 * In a real environment, this would call BloodFlow Negotiator, Sentinel, etc.
 * Here we return deterministic signals based on the selected scenario.
 */
export const getIntegratedNetworkState = (scenario: ScenarioType): NetworkScenarioState => {
  const baseSignals: ModuleIntegrationSignal[] = [
    { sourceModule: 'Blood Passport Ledger™', metric: 'Integrity', value: 'Verified', normalizedImpact: 0, direction: 'neutral', explanation: 'All units cryptographically verified.', isAvailable: true }
  ];

  switch (scenario) {
    case 'SCENARIO_A': // Constrained O+ allocation
      return {
        scenarioId: scenario,
        decisionType: 'BloodFlow Allocation',
        baseRecommendation: 'Prioritize O+ allocation to Hospital A',
        alternativeRecommendation: 'Allocate to Hospital B',
        networkStateContext: 'Constrained O+ supply',
        signals: [
          ...baseSignals,
          { sourceModule: 'BloodFlow Negotiator™', metric: 'Inventory deficit', value: '< 2 Days', normalizedImpact: 0.9, direction: 'increases_priority', explanation: 'Hospital A has a larger modeled inventory deficit.', isAvailable: true },
          { sourceModule: 'BloodFlow Negotiator™', metric: 'Urgency', value: 'High', normalizedImpact: 0.85, direction: 'increases_priority', explanation: 'Immediate clinical demand requires expedited replenishment.', isAvailable: true },
          { sourceModule: 'Supply Stress Simulator™', metric: 'Demand pressure', value: '+15%', normalizedImpact: 0.6, direction: 'increases_priority', explanation: 'Forecasted elective surgeries will consume reserves.', isAvailable: true },
          { sourceModule: 'Blood Network Time Machine™', metric: 'Network reserve', value: 'Critical', normalizedImpact: 0.7, direction: 'decreases_priority', explanation: 'Must maintain minimum central buffer for unforeseen trauma.', isAvailable: true },
          { sourceModule: 'Rescue Route Composer™', metric: 'Route fit', value: 'Standard', normalizedImpact: 0.2, direction: 'neutral', explanation: 'Standard routing remains viable.', isAvailable: true },
          { sourceModule: 'Expiry Echo Engine™', metric: 'Expiry risk', value: 'Low', normalizedImpact: 0.1, direction: 'neutral', explanation: 'No immediate expiry risk.', isAvailable: true },
          { sourceModule: 'Cold Chain Sentinel™', metric: 'Context', value: 'N/A', normalizedImpact: 0, direction: 'neutral', explanation: 'Not applicable to this decision.', isAvailable: false },
          { sourceModule: 'Collection Compass™', metric: 'Context', value: 'N/A', normalizedImpact: 0, direction: 'neutral', explanation: 'Not applicable to this decision.', isAvailable: false }
        ]
      };
      
    case 'SCENARIO_B': // High expiry pressure
      return {
        scenarioId: scenario,
        decisionType: 'Expiry Mitigation',
        baseRecommendation: 'Push near-expiry O- to Regional Trauma Center',
        alternativeRecommendation: 'Hold units in Central Hub',
        networkStateContext: 'High expiry risk event',
        signals: [
          ...baseSignals,
          { sourceModule: 'Expiry Echo Engine™', metric: 'Expiry risk', value: 'Critical', normalizedImpact: 0.95, direction: 'increases_priority', explanation: 'Batch of 50 O- units expires in 48 hours.', isAvailable: true },
          { sourceModule: 'BloodFlow Negotiator™', metric: 'Utilization rate', value: 'High', normalizedImpact: 0.8, direction: 'increases_priority', explanation: 'Trauma center has highest probability of consuming units.', isAvailable: true },
          { sourceModule: 'Rescue Route Composer™', metric: 'Transport time', value: '2 hours', normalizedImpact: 0.4, direction: 'decreases_priority', explanation: 'Transit time consumes part of remaining shelf life.', isAvailable: true },
          { sourceModule: 'Blood Network Time Machine™', metric: 'Historical usage', value: 'Consistent', normalizedImpact: 0.6, direction: 'increases_priority', explanation: 'Historical data supports rapid consumption.', isAvailable: true },
          { sourceModule: 'Supply Stress Simulator™', metric: 'Context', value: 'N/A', normalizedImpact: 0, direction: 'neutral', explanation: 'Not applicable.', isAvailable: true },
          { sourceModule: 'Cold Chain Sentinel™', metric: 'Context', value: 'N/A', normalizedImpact: 0, direction: 'neutral', explanation: 'Not applicable.', isAvailable: true },
          { sourceModule: 'Collection Compass™', metric: 'Context', value: 'N/A', normalizedImpact: 0, direction: 'neutral', explanation: 'Not applicable.', isAvailable: true }
        ]
      };

    case 'SCENARIO_C': // Transport disruption
      return {
        scenarioId: scenario,
        decisionType: 'Route Mitigation',
        baseRecommendation: 'Activate aerial drone transport to Clinic North',
        alternativeRecommendation: 'Wait for ground route clearing',
        networkStateContext: 'Ground transport disruption',
        signals: [
          ...baseSignals,
          { sourceModule: 'Rescue Route Composer™', metric: 'Route status', value: 'Blocked', normalizedImpact: 0.9, direction: 'increases_priority', explanation: 'Primary ground highway is impassable.', isAvailable: true },
          { sourceModule: 'BloodFlow Negotiator™', metric: 'Inventory deficit', value: 'Critical', normalizedImpact: 0.85, direction: 'increases_priority', explanation: 'Clinic North stock out imminent.', isAvailable: true },
          { sourceModule: 'Cold Chain Sentinel™', metric: 'Drone temp limits', value: 'Safe', normalizedImpact: 0.7, direction: 'neutral', explanation: 'Drone pods can maintain required temperature.', isAvailable: true },
          { sourceModule: 'Supply Stress Simulator™', metric: 'Cost penalty', value: 'High', normalizedImpact: 0.6, direction: 'decreases_priority', explanation: 'Drone dispatch incurs higher operational cost.', isAvailable: true },
          { sourceModule: 'Expiry Echo Engine™', metric: 'Context', value: 'N/A', normalizedImpact: 0, direction: 'neutral', explanation: 'Not applicable.', isAvailable: true },
          { sourceModule: 'Collection Compass™', metric: 'Context', value: 'N/A', normalizedImpact: 0, direction: 'neutral', explanation: 'Not applicable.', isAvailable: true },
          { sourceModule: 'Blood Network Time Machine™', metric: 'Context', value: 'N/A', normalizedImpact: 0, direction: 'neutral', explanation: 'Not applicable.', isAvailable: true }
        ]
      };

    case 'SCENARIO_D': // Cold-chain risk escalation
      return {
        scenarioId: scenario,
        decisionType: 'Shipment Intervention',
        baseRecommendation: 'Reroute active shipment TR-902 to nearest hub',
        alternativeRecommendation: 'Continue to original destination',
        networkStateContext: 'Active temperature deviation',
        signals: [
          ...baseSignals,
          { sourceModule: 'Cold Chain Sentinel™', metric: 'Temperature trend', value: 'Rising', normalizedImpact: 0.95, direction: 'increases_priority', explanation: 'Container temperature approaching upper safety limit.', isAvailable: true },
          { sourceModule: 'Cold Chain Sentinel™', metric: 'Battery level', value: '12%', normalizedImpact: 0.8, direction: 'increases_priority', explanation: 'Cooling system failure imminent.', isAvailable: true },
          { sourceModule: 'Rescue Route Composer™', metric: 'Distance to destination', value: '3 hours', normalizedImpact: 0.85, direction: 'increases_priority', explanation: 'Original destination cannot be reached before failure.', isAvailable: true },
          { sourceModule: 'Rescue Route Composer™', metric: 'Distance to safe hub', value: '20 mins', normalizedImpact: 0.6, direction: 'neutral', explanation: 'Nearest safe facility is well within time limit.', isAvailable: true },
          { sourceModule: 'BloodFlow Negotiator™', metric: 'Destination impact', value: 'Manageable', normalizedImpact: 0.4, direction: 'decreases_priority', explanation: 'Original destination has sufficient buffer to withstand delay.', isAvailable: true },
          { sourceModule: 'Expiry Echo Engine™', metric: 'Context', value: 'N/A', normalizedImpact: 0, direction: 'neutral', explanation: 'Not applicable.', isAvailable: true },
          { sourceModule: 'Collection Compass™', metric: 'Context', value: 'N/A', normalizedImpact: 0, direction: 'neutral', explanation: 'Not applicable.', isAvailable: true },
          { sourceModule: 'Supply Stress Simulator™', metric: 'Context', value: 'N/A', normalizedImpact: 0, direction: 'neutral', explanation: 'Not applicable.', isAvailable: true }
        ]
      };

    case 'SCENARIO_E': // Regional collection shortage
      return {
        scenarioId: scenario,
        decisionType: 'Collection Strategy',
        baseRecommendation: 'Deploy mobile collection units to Eastern Sector',
        alternativeRecommendation: 'Increase marketing in Central Sector',
        networkStateContext: 'Projected supply gap',
        signals: [
          ...baseSignals,
          { sourceModule: 'Collection Compass™', metric: 'Projected gap', value: 'High', normalizedImpact: 0.9, direction: 'increases_priority', explanation: 'Eastern sector shows severe modeled shortage in 7 days.', isAvailable: true },
          { sourceModule: 'Blood Network Time Machine™', metric: 'Donor density', value: 'Favorable', normalizedImpact: 0.7, direction: 'increases_priority', explanation: 'Historical data shows high response rates in this sector.', isAvailable: true },
          { sourceModule: 'Supply Stress Simulator™', metric: 'Cost', value: 'Elevated', normalizedImpact: 0.5, direction: 'decreases_priority', explanation: 'Mobile deployment is more resource intensive.', isAvailable: true },
          { sourceModule: 'BloodFlow Negotiator™', metric: 'Context', value: 'N/A', normalizedImpact: 0, direction: 'neutral', explanation: 'Not applicable.', isAvailable: false },
          { sourceModule: 'Expiry Echo Engine™', metric: 'Context', value: 'N/A', normalizedImpact: 0, direction: 'neutral', explanation: 'Not applicable.', isAvailable: false },
          { sourceModule: 'Rescue Route Composer™', metric: 'Context', value: 'N/A', normalizedImpact: 0, direction: 'neutral', explanation: 'Not applicable.', isAvailable: false },
          { sourceModule: 'Cold Chain Sentinel™', metric: 'Context', value: 'N/A', normalizedImpact: 0, direction: 'neutral', explanation: 'Not applicable.', isAvailable: false }
        ]
      };

    case 'SCENARIO_F': // Network stress event
      return {
        scenarioId: scenario,
        decisionType: 'Network Resilience',
        baseRecommendation: 'Trigger cross-regional blood borrowing protocol',
        alternativeRecommendation: 'Cancel elective surgeries locally',
        networkStateContext: 'Severe multi-facility stress',
        signals: [
          ...baseSignals,
          { sourceModule: 'Supply Stress Simulator™', metric: 'Stress level', value: 'Critical', normalizedImpact: 0.95, direction: 'increases_priority', explanation: 'Multiple facilities simultaneously reporting critical shortages.', isAvailable: true },
          { sourceModule: 'BloodFlow Negotiator™', metric: 'Local reserves', value: 'Depleted', normalizedImpact: 0.9, direction: 'increases_priority', explanation: 'Local buffers cannot absorb the current shock.', isAvailable: true },
          { sourceModule: 'Rescue Route Composer™', metric: 'Inter-regional transit', value: 'Viable', normalizedImpact: 0.6, direction: 'increases_priority', explanation: 'Neighboring region has routes open for transfer.', isAvailable: true },
          { sourceModule: 'Blood Network Time Machine™', metric: 'Historical precedent', value: 'Rare', normalizedImpact: 0.4, direction: 'decreases_priority', explanation: 'Borrowing protocol incurs high administrative friction.', isAvailable: true },
          { sourceModule: 'Expiry Echo Engine™', metric: 'Context', value: 'N/A', normalizedImpact: 0, direction: 'neutral', explanation: 'Not applicable.', isAvailable: false },
          { sourceModule: 'Collection Compass™', metric: 'Context', value: 'N/A', normalizedImpact: 0, direction: 'neutral', explanation: 'Not applicable.', isAvailable: false },
          { sourceModule: 'Cold Chain Sentinel™', metric: 'Context', value: 'N/A', normalizedImpact: 0, direction: 'neutral', explanation: 'Not applicable.', isAvailable: false }
        ]
      };
      
    default:
      return getIntegratedNetworkState('SCENARIO_A');
  }
};
