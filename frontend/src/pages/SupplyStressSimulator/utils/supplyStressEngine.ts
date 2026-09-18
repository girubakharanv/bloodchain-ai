import { baseNetworkNodes, bloodGroups, groupDistribution, FacilityNode, BloodGroup, StressLevel } from '../data/supplyStressData';

export interface StressModifiers {
  demand: number; // percentage (-100 to 100)
  supply: number; // percentage (-100 to 100)
  collection: number; // percentage (-100 to 100)
  transportDelay: number; // minutes
  facilityOutage: number; // count
  expiryPressure: number; // percentage (0 to 100)
}

export interface FacilityStressResult {
  nodeId: string;
  name: string;
  inventoryPressure: StressLevel;
  demandPressure: StressLevel;
  transportPressure: StressLevel;
  expiryPressure: StressLevel;
  overallStress: StressLevel;
  overallScore: number; // 0-100
  isOffline: boolean;
}

export interface BloodGroupStressResult {
  group: BloodGroup;
  supply: StressLevel;
  demand: StressLevel;
  gap: number;
  stress: StressLevel;
  stressScore: number;
}

export interface EngineResult {
  networkResilience: number; // 0-100
  shortageExposure: number; // percentage
  stressedFacilities: number; // count
  bottlenecks: { id: string; name: string; score: number; reason: string }[];
  weakestLink: { name: string; impact: string; reason: string } | null;
  facilityStress: FacilityStressResult[];
  bloodGroupStress: BloodGroupStressResult[];
  primaryStressor: string;
  decisionDNA: { title: string; contributors: Record<string, number>; reason: string };
  stressPropagation: string[];
}

const getStressLevel = (score: number): StressLevel => {
  if (score < 25) return 'LOW';
  if (score < 50) return 'WATCH';
  if (score < 75) return 'HIGH';
  return 'CRITICAL';
};

// ---------------------------------------------------------
// MODULAR CALCULATION FUNCTIONS
// ---------------------------------------------------------

const calculateFacilityStress = (
  node: FacilityNode,
  modifiers: StressModifiers,
  isOffline: boolean
): FacilityStressResult => {
  
  if (isOffline) {
    return {
      nodeId: node.id,
      name: node.name,
      inventoryPressure: 'CRITICAL',
      demandPressure: 'CRITICAL',
      transportPressure: 'CRITICAL',
      expiryPressure: 'CRITICAL',
      overallStress: 'CRITICAL',
      overallScore: 100,
      isOffline: true
    };
  }

  const modDemand = node.baseDemand * (1 + modifiers.demand / 100);
  const modSupply = node.baseInventory * (1 + modifiers.supply / 100);
  const modCollection = node.baseCapacity * (1 + modifiers.collection / 100);

  // Inventory Pressure
  // If supply is much lower than demand, pressure is high
  let invScore = 0;
  if (modSupply < modDemand * 0.5) invScore = 100;
  else if (modSupply < modDemand * 0.8) invScore = 75;
  else if (modSupply < modDemand * 1.2) invScore = 40;
  else invScore = 10;
  
  // Demand Pressure
  let demScore = 0;
  if (modDemand > node.baseDemand * 1.5) demScore = 100;
  else if (modDemand > node.baseDemand * 1.2) demScore = 75;
  else if (modDemand > node.baseDemand * 1.0) demScore = 40;
  else demScore = 10;

  // Collection Pressure
  let colScore = 0;
  if (modifiers.collection < -50) colScore = 100;
  else if (modifiers.collection < -20) colScore = 75;
  else if (modifiers.collection < 0) colScore = 40;
  else colScore = 10;

  // Transport Pressure
  let transScore = Math.min(100, (modifiers.transportDelay / 180) * 100);
  if (transScore === 0) transScore = 10;

  // Expiry Pressure
  let expScore = Math.min(100, modifiers.expiryPressure);
  if (expScore === 0) expScore = 10;

  // Operational Status (5% weight)
  const opsScore = 0; // It's online

  // Weighted Score Calculation
  // Inv 30%, Dem 25%, Col 15%, Trans 15%, Exp 10%, Ops 5%
  const overallScore = Math.min(100, Math.round(
    (invScore * 0.30) + 
    (demScore * 0.25) + 
    (colScore * 0.15) + 
    (transScore * 0.15) + 
    (expScore * 0.10) +
    (opsScore * 0.05)
  ));

  return {
    nodeId: node.id,
    name: node.name,
    inventoryPressure: getStressLevel(invScore),
    demandPressure: getStressLevel(demScore),
    transportPressure: getStressLevel(transScore),
    expiryPressure: getStressLevel(expScore),
    overallStress: getStressLevel(overallScore),
    overallScore,
    isOffline: false
  };
};


const calculateNetworkRedundancy = (nodes: FacilityNode[], offlineNodeIds: Set<string>): number => {
  // Simple heuristic: how many supply nodes (BB/CC) are still online?
  const supplyNodes = nodes.filter(n => (n.type === 'BLOOD_BANK' || n.type === 'COLLECTION_CENTER') && !offlineNodeIds.has(n.id));
  const totalSupplyNodes = nodes.filter(n => n.type === 'BLOOD_BANK' || n.type === 'COLLECTION_CENTER').length;
  
  if (totalSupplyNodes === 0) return 0;
  return Math.round((supplyNodes.length / totalSupplyNodes) * 100);
};


// Run a core simulation pass to get the baseline resilience
const calculateCoreSimulation = (nodes: FacilityNode[], modifiers: StressModifiers, offlineNodeIds: Set<string>) => {
  let totalModDemand = 0;
  let totalModSupply = 0;
  let totalExpectedCollection = 0;

  nodes.forEach(node => {
    if (offlineNodeIds.has(node.id)) return;
    totalModDemand += node.baseDemand * (1 + modifiers.demand / 100);
    totalModSupply += node.baseInventory * (1 + modifiers.supply / 100);
    totalExpectedCollection += node.baseCapacity * (1 + modifiers.collection / 100);
  });

  // Calculate Shortage Exposure
  // Projected Available = Current + Expected + Incoming(N/A global) - Expiry - Supply Reduction
  const modeledExpiryDrop = totalModSupply * (modifiers.expiryPressure / 100);
  const projectedAvailableSupply = totalModSupply + totalExpectedCollection - modeledExpiryDrop;
  
  const shortfall = Math.max(0, totalModDemand - projectedAvailableSupply);
  const shortageExposure = totalModDemand > 0 ? Math.round((shortfall / totalModDemand) * 100) : 0;

  // Calculate Facilities
  const facilityStress = nodes.map(node => calculateFacilityStress(node, modifiers, offlineNodeIds.has(node.id)));
  
  // Network Redundancy
  const redundancyScore = calculateNetworkRedundancy(nodes, offlineNodeIds);

  // Network Resilience
  // Supply coverage 30%, Demand coverage 20%, Facility health 15%, Transport connectivity 15%, Collection capacity 10%, Expiry exposure 5%, Network redundancy 5%
  
  const supplyCoverageScore = Math.max(0, 100 - (shortfall / totalModDemand * 100 || 0)); // How much demand is covered
  const demandCoverageScore = modifiers.demand > 0 ? Math.max(0, 100 - modifiers.demand) : 100;
  
  const avgFacilityScore = facilityStress.length > 0 ? (facilityStress.reduce((acc, f) => acc + f.overallScore, 0) / facilityStress.length) : 100;
  const facilityHealthScore = 100 - avgFacilityScore;
  
  const transportConnectivityScore = Math.max(0, 100 - ((modifiers.transportDelay / 180) * 100));
  
  const totalBaseCapacity = nodes.reduce((acc, n) => acc + n.baseCapacity, 0);
  const colCapPercentage = totalBaseCapacity > 0 ? (totalExpectedCollection / totalBaseCapacity) * 100 : 0;
  const collectionCapacityScore = Math.max(0, Math.min(100, colCapPercentage));
  
  const expiryExposureScore = Math.max(0, 100 - modifiers.expiryPressure);

  const rawResilience = 
    (supplyCoverageScore * 0.30) +
    (demandCoverageScore * 0.20) +
    (facilityHealthScore * 0.15) +
    (transportConnectivityScore * 0.15) +
    (collectionCapacityScore * 0.10) +
    (expiryExposureScore * 0.05) +
    (redundancyScore * 0.05);

  const resilience = Math.max(0, Math.min(100, Math.round(rawResilience)));

  return {
    resilience,
    shortageExposure: Math.min(100, shortageExposure),
    facilityStress,
    projectedAvailableSupply,
    totalModDemand
  };
};

const calculateStressPropagation = (modifiers: StressModifiers, offlineNodeIds: Set<string>): string[] => {
  const propagation = ["Baseline state"];
  
  if (offlineNodeIds.size > 0) {
    propagation.push("Facility offline");
    propagation.push("Network fragmentation");
  }
  
  if (modifiers.supply < 0) {
    propagation.push("Local supply constraint");
    propagation.push("Downstream inventory pressure");
  }
  
  if (modifiers.demand > 0) {
    propagation.push("Demand surge detected");
    propagation.push("Increased allocation pressure");
  }
  
  if (modifiers.transportDelay > 0) {
    propagation.push("Transport corridor delay");
    propagation.push("Isolated facility pressure");
  }
  
  if (modifiers.collection < 0) {
    propagation.push("Collection capacity impaired");
    propagation.push("Future supply bottleneck");
  }
  
  if (modifiers.expiryPressure > 0) {
    propagation.push("High expiry pressure");
    propagation.push("Usable inventory collapse");
  }
  
  // Aggregate
  if (propagation.length > 3) {
    propagation.push("Compounded network exposure");
  }
  
  propagation.push("Network reassessment");
  
  // Keep it concise, take top 5-6 events
  if (propagation.length > 6) {
     return [
       propagation[0], 
       propagation[1], 
       propagation[2], 
       "Compounded network pressure",
       propagation[propagation.length - 2],
       propagation[propagation.length - 1]
     ];
  }

  return propagation;
};


// ---------------------------------------------------------
// MAIN ENGINE EXPORT
// ---------------------------------------------------------

export const runStressSimulation = (modifiers: StressModifiers): EngineResult => {
  
  // 1. Initial Outage Determination
  const sortedByCapacity = [...baseNetworkNodes].sort((a, b) => b.baseCapacity - a.baseCapacity);
  const primaryOfflineIds = new Set<string>();
  for(let i=0; i < Math.min(modifiers.facilityOutage, sortedByCapacity.length); i++) {
    primaryOfflineIds.add(sortedByCapacity[i].id);
  }

  // 2. Base Network Calculation
  const baseSim = calculateCoreSimulation(baseNetworkNodes, modifiers, primaryOfflineIds);

  // 3. Blood Group Stress Matrix
  const bloodGroupStress: BloodGroupStressResult[] = bloodGroups.map(bg => {
    const fraction = groupDistribution[bg];
    const bgSupply = baseSim.projectedAvailableSupply * fraction;
    const bgDemand = baseSim.totalModDemand * fraction;
    const gap = Math.round(bgSupply - bgDemand);
    
    let stressScore = 0;
    if (gap < -bgDemand * 0.2) stressScore = 90; // CRITICAL
    else if (gap < 0) stressScore = 70; // HIGH
    else if (gap < bgDemand * 0.2) stressScore = 40; // WATCH
    else stressScore = 10; // LOW

    return {
      group: bg,
      supply: getStressLevel(gap < 0 ? 90 : 20),
      demand: getStressLevel(modifiers.demand > 0 ? 80 : 30),
      gap,
      stress: getStressLevel(stressScore),
      stressScore
    };
  });

  // 4. Identify Bottlenecks
  const bottlenecks = [];
  const topBgStresses = [...bloodGroupStress].sort((a,b) => b.stressScore - a.stressScore);
  if (topBgStresses[0].stressScore >= 75) {
    bottlenecks.push({
      id: 'bg-1',
      name: `${topBgStresses[0].group} Supply Corridor`,
      score: topBgStresses[0].stressScore,
      reason: "Demand pressure is increasing faster than available regional supply."
    });
  }
  
  if (modifiers.collection < -20) {
    bottlenecks.push({
      id: 'col-1',
      name: "Regional Collection Capacity",
      score: Math.min(100, Math.abs(modifiers.collection) * 1.5),
      reason: "Simulation constraint on collection nodes restricts inventory replenishment."
    });
  }
  
  if (modifiers.transportDelay > 60) {
    bottlenecks.push({
      id: 'trans-1',
      name: "Inter-facility Transport",
      score: Math.min(100, (modifiers.transportDelay / 180) * 100),
      reason: "Logistics delay forces facilities to rely exclusively on local buffer stock."
    });
  }

  // 5. Weakest Link Detection (Combinatorial Simulation)
  let weakestLink = null;
  
  if (primaryOfflineIds.size > 0) {
    // If we already forced an outage via sliders, that IS the weakest link logically
    const firstOffline = baseNetworkNodes.find(n => primaryOfflineIds.has(n.id));
    weakestLink = {
      name: firstOffline?.name || "Offline Infrastructure",
      impact: 'CRITICAL',
      reason: "Simulated facility outages have removed critical capacity from the network."
    };
  } else {
    // Determine weakest link by taking each online node offline and measuring resilience drop
    let maxDrop = 0;
    let weakestNode: any = null;
    
    // Only simulate dropping major hubs to save computation
    const candidateNodes = baseNetworkNodes.filter(n => n.type === 'BLOOD_BANK' || n.type === 'COLLECTION_CENTER');
    
    candidateNodes.forEach(node => {
      const simOfflineIds = new Set<string>([node.id]);
      const simResult = calculateCoreSimulation(baseNetworkNodes, modifiers, simOfflineIds);
      
      const resilienceDrop = baseSim.resilience - simResult.resilience;
      if (resilienceDrop > maxDrop) {
        maxDrop = resilienceDrop;
        weakestNode = node;
      }
    });

    if (weakestNode && maxDrop > 0) {
      weakestLink = {
        name: weakestNode.name,
        impact: maxDrop >= 15 ? 'CRITICAL' : maxDrop >= 5 ? 'HIGH' : 'MODERATE',
        reason: "High downstream dependency means reduced capacity at this node creates pressure across multiple connected facilities."
      };
    } else {
       weakestLink = null;
    }
  }

  // 6. Stress Propagation
  const stressPropagation = calculateStressPropagation(modifiers, primaryOfflineIds);

  // 7. Decision DNA / Why is the network stressed?
  const stressors = [
    { name: 'Demand Surge', val: modifiers.demand > 0 ? modifiers.demand : 0 },
    { name: 'Supply Reduction', val: modifiers.supply < 0 ? Math.abs(modifiers.supply) : 0 },
    { name: 'Transport Delay', val: Math.round((modifiers.transportDelay / 180) * 100) },
    { name: 'Collection Disruption', val: modifiers.collection < 0 ? Math.abs(modifiers.collection) : 0 },
    { name: 'Facility Outage', val: Math.round((modifiers.facilityOutage / baseNetworkNodes.length) * 100) },
    { name: 'Expiry Pressure', val: modifiers.expiryPressure }
  ];

  const sortedStressors = [...stressors].sort((a, b) => b.val - a.val);
  const primaryStressor = sortedStressors[0].val > 0 ? sortedStressors[0].name : 'Baseline Operations';
  
  let dnaReason = "Network is operating within normal baseline limits.";
  if (baseSim.resilience < 80) {
    if (primaryStressor === 'Demand Surge') {
      dnaReason = "Network resilience declined primarily because modeled demand coverage is insufficient.";
    } else if (primaryStressor === 'Supply Reduction') {
      dnaReason = "Network resilience declined because available supply reserves were heavily reduced.";
    } else if (primaryStressor === 'Transport Delay') {
      dnaReason = "Logistics disruption has artificially reduced network flexibility, forcing localized shortages.";
    } else if (primaryStressor === 'Facility Outage') {
      dnaReason = "Loss of critical nodes has fragmented the network, drastically compounding exposure.";
    } else if (primaryStressor === 'Collection Disruption') {
      dnaReason = "The inability to replenish stock through collection has severely compromised forward planning.";
    } else if (primaryStressor === 'Expiry Pressure') {
      dnaReason = "Significant portions of current inventory are compromised due to shelf-life constraints.";
    }
  }

  const contributors: Record<string, number> = {};
  if (modifiers.demand > 0) contributors['Demand Pressure'] = modifiers.demand;
  if (modifiers.supply < 0) contributors['Supply Reduction'] = Math.abs(modifiers.supply);
  if (modifiers.transportDelay > 0) contributors['Transport Pressure'] = Math.round((modifiers.transportDelay / 180) * 100);
  if (modifiers.collection < 0) contributors['Collection Pressure'] = Math.abs(modifiers.collection);
  if (modifiers.facilityOutage > 0) contributors['Facility Outage'] = Math.round((modifiers.facilityOutage / baseNetworkNodes.length) * 100);
  if (modifiers.expiryPressure > 0) contributors['Expiry Pressure'] = modifiers.expiryPressure;

  return {
    networkResilience: baseSim.resilience,
    shortageExposure: baseSim.shortageExposure,
    stressedFacilities: baseSim.facilityStress.filter(f => f.overallScore >= 50).length,
    bottlenecks,
    weakestLink,
    facilityStress: baseSim.facilityStress,
    bloodGroupStress,
    primaryStressor,
    stressPropagation,
    decisionDNA: {
      title: "WHY IS THE NETWORK STRESSED?",
      contributors,
      reason: dnaReason
    }
  };
};
