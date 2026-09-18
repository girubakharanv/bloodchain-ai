export interface DecisionRecord {
  id: string;
  type: string;
  recommendation: string;
  strength: number; // 0-100
  timestamp: string;
  sourceModule: string;
  networkStateContext: string;
}

export type ImpactLevel = 'HIGH' | 'MEDIUM' | 'LOW';
export type DriverClassification = 'PRIMARY DRIVER' | 'SUPPORTING DRIVER' | 'SECONDARY DRIVER' | 'OPPOSING CONSTRAINT' | 'NEUTRAL';

export interface DecisionDriver {
  id: string;
  rank: number;
  name: string;
  impactLevel: ImpactLevel;
  impactScore: number; // 0-100 for visual bar
  description: string;
  direction: 'UP' | 'DOWN' | 'NEUTRAL';
  classification: DriverClassification;
}

export interface DecisionConstraint {
  id: string;
  name: string;
  description: string;
}

export interface DecisionExplanation {
  primaryReason: string;
  supportingReasons: string[];
  constraint: string;
  narrative: string;
  highlightedPhrases: string[];
}

export interface DecisionEvidence {
  moduleId: string;
  moduleName: string;
  contribution: 'PRIMARY' | 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE';
  status: 'ACTIVE' | 'AVAILABLE' | 'UNAVAILABLE';
}

export interface CounterfactualScenario {
  factor: string;
  currentValue: string;
  negativeChange: string;
  positiveChange: string;
  unit: string;
}

export interface CounterfactualResult {
  changedVariable: string;
  previousValue: number | string;
  newValue: number | string;
  previousDecision: string;
  newDecision: string;
  decisionChanged: boolean;
  explanation: string;
}

export interface DecisionAuditEvent {
  id: string;
  timestamp: string;
  step: string;
  status: 'COMPLETED' | 'PENDING' | 'ACTIVE';
}

export interface DecisionEvidenceInput {
  sourceModule: string;
  metric: string;
  value: number | string;
  normalizedImpact: number; // 0-1
  direction: 'increases_priority' | 'decreases_priority' | 'neutral';
  explanation: string;
  timestamp: string;
  sourceId: string;
}

export interface CausalNode {
  id: string;
  type: 'INPUTS' | 'FACTORS' | 'CONSTRAINTS' | 'DECISION';
  title: string;
  value: string;
  impact: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'FINAL';
}

export interface AlternativeDecision {
  recommendation: string;
  strength: number;
  whyRecommendedHigher: string[];
  whyAlternativeLower: string[];
}

export interface DecisionDNAResult {
  decision: DecisionRecord;
  drivers: DecisionDriver[];
  evidence: DecisionEvidence[];
  causalChain: CausalNode[];
  alternative: AlternativeDecision | null;
  counterfactuals: CounterfactualScenario[];
  explanation: DecisionExplanation;
  auditEvents: DecisionAuditEvent[];
  humanReviewRequired: boolean;
}
