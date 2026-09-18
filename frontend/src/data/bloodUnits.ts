export interface BloodUnit {
  id: string;
  bloodGroup: string;
  component: string;
  collectionDate: string;
  expiryDate: string;
  hoursRemaining: number;
  predictedUtilization: 'Low' | 'Medium' | 'High';
  expiryRiskScore: number;
  rescueOpportunityScore: number;
  facilityId: string;
  predictedDemandNearby: number;
}

const generateId = () => `BC-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

export const demoBloodUnits: BloodUnit[] = [
  {
    id: 'BC-O+-1042',
    bloodGroup: 'O+',
    component: 'PRBC',
    collectionDate: '2023-10-01T08:00:00Z',
    expiryDate: '2023-11-12T08:00:00Z',
    hoursRemaining: 42,
    predictedUtilization: 'Low',
    expiryRiskScore: 87,
    rescueOpportunityScore: 91,
    facilityId: 'FAC-001',
    predictedDemandNearby: 3,
  },
  {
    id: 'BC-A+-2081',
    bloodGroup: 'A+',
    component: 'PRBC',
    collectionDate: '2023-10-10T08:00:00Z',
    expiryDate: '2023-11-21T08:00:00Z',
    hoursRemaining: 18,
    predictedUtilization: 'Medium',
    expiryRiskScore: 74,
    rescueOpportunityScore: 45,
    facilityId: 'FAC-001',
    predictedDemandNearby: 0,
  },
  {
    id: 'BC-B+-3117',
    bloodGroup: 'B+',
    component: 'PRBC',
    collectionDate: '2023-10-05T08:00:00Z',
    expiryDate: '2023-11-16T08:00:00Z',
    hoursRemaining: 72,
    predictedUtilization: 'High',
    expiryRiskScore: 24,
    rescueOpportunityScore: 12,
    facilityId: 'FAC-001',
    predictedDemandNearby: 1,
  },
  {
    id: 'BC-AB+-4172',
    bloodGroup: 'AB+',
    component: 'PRBC',
    collectionDate: '2023-10-15T08:00:00Z',
    expiryDate: '2023-11-26T08:00:00Z',
    hoursRemaining: 31,
    predictedUtilization: 'Low',
    expiryRiskScore: 91,
    rescueOpportunityScore: 88,
    facilityId: 'FAC-001',
    predictedDemandNearby: 2,
  },
  // Adding more units for realistic scale
  ...Array.from({ length: 46 }).map((_, i) => {
    const hoursRemaining = Math.floor(Math.random() * 168); // up to 7 days
    const predictedUtilization: 'Low' | 'Medium' | 'High' = Math.random() > 0.6 ? 'High' : Math.random() > 0.3 ? 'Medium' : 'Low';
    
    // Logic for demo risk score
    let riskScore = 100 - (hoursRemaining / 1.68);
    if (predictedUtilization === 'Low') riskScore += 20;
    if (predictedUtilization === 'High') riskScore -= 30;
    
    // Logic for demo rescue score
    const nearbyDemand = Math.floor(Math.random() * 5);
    let rescueScore = riskScore * 0.5 + (nearbyDemand * 10);
    if (predictedUtilization === 'High') rescueScore -= 40;

    return {
      id: generateId(),
      bloodGroup: ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'][Math.floor(Math.random() * 8)],
      component: ['PRBC', 'PLASMA', 'PLATELETS'][Math.floor(Math.random() * 3)],
      collectionDate: new Date().toISOString(),
      expiryDate: new Date(Date.now() + hoursRemaining * 3600000).toISOString(),
      hoursRemaining: hoursRemaining,
      predictedUtilization,
      expiryRiskScore: Math.min(100, Math.max(0, Math.floor(riskScore))),
      rescueOpportunityScore: Math.min(100, Math.max(0, Math.floor(rescueScore))),
      facilityId: 'FAC-001',
      predictedDemandNearby: nearbyDemand,
    };
  })
];

export const calculateSummaryMetrics = (units: BloodUnit[], demandModifier: number = 0) => {
  // Apply the demand modifier to the simulation
  const simulatedUnits = units.map(unit => {
    // If demand increases, utilization might go up (Low -> Medium, Medium -> High)
    // If demand decreases, utilization goes down
    let simulatedRisk = unit.expiryRiskScore;
    let simulatedUtilization = unit.predictedUtilization;
    
    if (demandModifier > 0) {
      simulatedRisk = Math.max(0, unit.expiryRiskScore - demandModifier);
      if (demandModifier > 20 && simulatedUtilization === 'Low') simulatedUtilization = 'Medium';
    } else if (demandModifier < 0) {
      simulatedRisk = Math.min(100, unit.expiryRiskScore + Math.abs(demandModifier));
      if (demandModifier < -20 && simulatedUtilization === 'High') simulatedUtilization = 'Medium';
    }
    
    return {
      ...unit,
      simulatedRisk,
      simulatedUtilization
    };
  });

  const unitsAtRisk = simulatedUnits.filter(u => u.simulatedRisk > 70).length;
  const rescueOpportunities = simulatedUnits.filter(u => u.rescueOpportunityScore > 75).length;
  
  // Calculate a generic utilization percentage based on demand modifier
  const baseUtilization = 68;
  const predictedUtilizationPct = Math.min(99, Math.max(12, baseUtilization + (demandModifier * 0.5)));

  const criticalWithin48h = simulatedUnits.filter(u => u.hoursRemaining <= 48 && u.simulatedRisk > 80).length;

  return {
    unitsAtRisk,
    rescueOpportunities,
    predictedUtilizationPct: Math.round(predictedUtilizationPct),
    criticalWithin48h,
    simulatedUnits
  };
};
