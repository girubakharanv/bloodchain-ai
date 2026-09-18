export interface BloodRequest {
  id: string;
  facilityId: string;
  facilityName: string;
  bloodGroup: string;
  component: string;
  requestedUnits: number;
  localStock: number;
  predictedDemand: 'High' | 'Medium' | 'Low';
  urgency: 'Emergency' | 'Critical' | 'Scheduled';
  requiredWithinHours: number;
}

export interface NetworkSupply {
  bloodGroup: string;
  component: string;
  totalAvailable: number;
  reserveUnits: number;
  allocatableUnits: number;
}

export interface AllocationWeights {
  urgency: number;
  stockDeficit: number;
  predictedDemand: number;
  timeWindow: number;
  networkImpact: number;
}

export interface AllocationResult {
  requestId: string;
  allocatedUnits: number;
  priorityScore: number;
  reasons: string[];
}

export interface AllocationPlan {
  allocations: AllocationResult[];
  totalAllocated: number;
  reserveProtected: boolean;
  networkBalanceScore: number;
  unfulfilledDemand: number;
}

export const defaultWeights: AllocationWeights = {
  urgency: 0.30,
  stockDeficit: 0.25,
  predictedDemand: 0.20,
  timeWindow: 0.15,
  networkImpact: 0.10
};

export const demoSupply: NetworkSupply = {
  bloodGroup: 'O+',
  component: 'PRBC',
  totalAvailable: 40,
  reserveUnits: 10,
  allocatableUnits: 30
};

export const demoRequests: BloodRequest[] = [
  {
    id: 'req-1',
    facilityId: 'hosp-a',
    facilityName: 'Hospital A',
    bloodGroup: 'O+',
    component: 'PRBC',
    requestedUnits: 18,
    localStock: 4,
    predictedDemand: 'High',
    urgency: 'Emergency',
    requiredWithinHours: 2
  },
  {
    id: 'req-2',
    facilityId: 'hosp-b',
    facilityName: 'Hospital B',
    bloodGroup: 'O+',
    component: 'PRBC',
    requestedUnits: 16,
    localStock: 6,
    predictedDemand: 'Medium',
    urgency: 'Critical',
    requiredWithinHours: 6
  },
  {
    id: 'req-3',
    facilityId: 'hosp-c',
    facilityName: 'Hospital C',
    bloodGroup: 'O+',
    component: 'PRBC',
    requestedUnits: 12,
    localStock: 14,
    predictedDemand: 'Low',
    urgency: 'Scheduled',
    requiredWithinHours: 24
  }
];
