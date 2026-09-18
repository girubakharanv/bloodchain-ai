import { 
  DecisionRecord, 
  DecisionDriver, 
  DecisionExplanation, 
  DecisionEvidence, 
  CounterfactualScenario, 
  DecisionAuditEvent 
} from '../types/decisionDna';

export const demoDecisionRecord: DecisionRecord = {
  id: 'DNA-ALLOC-0042',
  type: 'BloodFlow Allocation',
  recommendation: 'Prioritize O+ allocation to Hospital A',
  strength: 87,
  timestamp: new Date().toISOString(),
  sourceModule: 'BloodFlow Negotiator™',
  networkStateContext: 'Constrained O+ supply'
};

export const demoDrivers: DecisionDriver[] = [
  {
    id: 'drv-1',
    rank: 1,
    name: 'Hospital urgency',
    impactLevel: 'HIGH',
    impactScore: 92,
    description: 'Immediate clinical demand requires expedited replenishment.',
    direction: 'UP',
    classification: 'PRIMARY DRIVER'
  },
  {
    id: 'drv-2',
    rank: 2,
    name: 'Local inventory deficit',
    impactLevel: 'HIGH',
    impactScore: 85,
    description: 'Current stock is below the 2-day operational threshold.',
    direction: 'UP',
    classification: 'PRIMARY DRIVER'
  },
  {
    id: 'drv-3',
    rank: 3,
    name: 'Predicted demand pressure',
    impactLevel: 'MEDIUM',
    impactScore: 68,
    description: 'Forecasted elective surgeries will consume current reserves.',
    direction: 'UP',
    classification: 'PRIMARY DRIVER'
  },
  {
    id: 'drv-4',
    rank: 4,
    name: 'Network reserve protection',
    impactLevel: 'MEDIUM',
    impactScore: 60,
    description: 'Must maintain minimum central buffer for unforeseen trauma.',
    direction: 'DOWN',
    classification: 'OPPOSING CONSTRAINT'
  },
  {
    id: 'drv-5',
    rank: 5,
    name: 'Logistics feasibility',
    impactLevel: 'LOW',
    impactScore: 35,
    description: 'Standard routing remains viable without expedited transport.',
    direction: 'NEUTRAL',
    classification: 'NEUTRAL'
  }
];

export const demoExplanation: DecisionExplanation = {
  narrative: 'Hospital A received higher allocation priority because its modeled inventory deficit and urgency were greater while the proposed allocation remained within the protected network reserve.',
  highlightedPhrases: ['higher allocation priority', 'modeled inventory deficit', 'protected network reserve'],
  primaryReason: 'Inventory deficit',
  supportingReasons: [
    'Urgency',
    'Demand pressure',
    'Reserve protection'
  ],
  constraint: 'Limited O+ availability'
};

export const demoEvidenceModules: DecisionEvidence[] = [
  {
    moduleId: 'mod-1',
    moduleName: 'Expiry Echo Engine™',
    contribution: 'MEDIUM',
    status: 'AVAILABLE'
  },
  {
    moduleId: 'mod-2',
    moduleName: 'Blood Network Time Machine™',
    contribution: 'LOW',
    status: 'AVAILABLE'
  },
  {
    moduleId: 'mod-3',
    moduleName: 'BloodFlow Negotiator™',
    contribution: 'PRIMARY',
    status: 'ACTIVE'
  },
  {
    moduleId: 'mod-4',
    moduleName: 'Rescue Route Composer™',
    contribution: 'MEDIUM',
    status: 'AVAILABLE'
  },
  {
    moduleId: 'mod-5',
    moduleName: 'Cold Chain Sentinel™',
    contribution: 'NONE',
    status: 'UNAVAILABLE'
  },
  {
    moduleId: 'mod-6',
    moduleName: 'Collection Compass™',
    contribution: 'LOW',
    status: 'AVAILABLE'
  },
  {
    moduleId: 'mod-7',
    moduleName: 'Supply Stress Simulator™',
    contribution: 'HIGH',
    status: 'AVAILABLE'
  },
  {
    moduleId: 'mod-8',
    moduleName: 'Blood Passport Ledger™',
    contribution: 'NONE',
    status: 'UNAVAILABLE'
  }
];

export const demoCounterfactuals: CounterfactualScenario[] = [
  {
    factor: 'Demand pressure',
    currentValue: 'Current',
    negativeChange: '- 10%',
    positiveChange: '+ 10%',
    unit: '%'
  },
  {
    factor: 'Hospital inventory',
    currentValue: 'Current',
    negativeChange: '- 5 units',
    positiveChange: '+ 5 units',
    unit: 'units'
  },
  {
    factor: 'Network reserve',
    currentValue: 'Current',
    negativeChange: '- 5 units',
    positiveChange: '+ 5 units',
    unit: 'units'
  }
];

// Generate deterministic timestamps for the audit trail
const now = new Date();
const subtractMinutes = (date: Date, minutes: number) => new Date(date.getTime() - minutes * 60000);

export const demoAuditTrail: DecisionAuditEvent[] = [
  {
    id: 'aud-1',
    timestamp: subtractMinutes(now, 12).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    step: 'Decision created',
    status: 'COMPLETED'
  },
  {
    id: 'aud-2',
    timestamp: subtractMinutes(now, 11).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    step: 'Network state captured',
    status: 'COMPLETED'
  },
  {
    id: 'aud-3',
    timestamp: subtractMinutes(now, 10).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    step: 'Factors evaluated',
    status: 'COMPLETED'
  },
  {
    id: 'aud-4',
    timestamp: subtractMinutes(now, 9).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    step: 'Constraints checked',
    status: 'COMPLETED'
  },
  {
    id: 'aud-5',
    timestamp: subtractMinutes(now, 8).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    step: 'Recommendation generated',
    status: 'COMPLETED'
  },
  {
    id: 'aud-6',
    timestamp: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    step: 'Human review',
    status: 'PENDING'
  }
];
