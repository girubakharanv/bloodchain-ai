import { baselineFacilities, baselineLinks } from './simulationData';
import type { Facility, TransportLink, SimulationScenario } from './simulationData';

export interface SimulationResult {
  facilities: Facility[];
  links: TransportLink[];
  networkStress: number;
  shortageExposure: number;
  reserveDepletionCount: number;
  affectedHospitals: number;
  highestRiskGroup: string;
  insight: {
    message: string;
    recommendation: string;
    reasons: string[];
    decisionDna: {
      demandImpact: number;
      supplyReduction: number;
      transportDelay: number;
      facilityAvailability: number;
      reserveExposure: number;
    }
  }
}

// Deterministic simulation engine
export const simulateFutureNetwork = (
  timeOffsetHours: number,
  scenario: SimulationScenario
): SimulationResult => {
  // Deep clone baseline to prevent mutating state
  const facilities: Facility[] = JSON.parse(JSON.stringify(baselineFacilities));
  const links: TransportLink[] = JSON.parse(JSON.stringify(baselineLinks));

  // Determine actual demand and collection factors based on time
  const timeFactor = timeOffsetHours / 24; // 1 unit per day
  const effectiveDemandMultiplier = 1 + (scenario.demandMultiplier / 100);
  const effectiveCollectionMultiplier = 1 + (scenario.collectionMultiplier / 100);

  let reserveDepletionCount = 0;
  let affectedHospitals = 0;
  let totalShortage = 0;

  // Process facilities
  facilities.forEach(fac => {
    // Check if facility is offline
    if (scenario.offlineFacilities.includes(fac.id)) {
      fac.status = 'offline';
      fac.inventory = { 'O+': 0, 'O-': 0, 'A+': 0, 'B+': 0 };
      return;
    }

    if (fac.type === 'hospital' && fac.baseDemand) {
      let isStressed = false;
      let isCritical = false;

      // Simulate consumption and check safety reserves
      Object.keys(fac.baseDemand).forEach(group => {
        const consumptionRate = fac.baseDemand![group] * effectiveDemandMultiplier;
        const totalConsumption = consumptionRate * timeFactor;
        
        // Hospital inventory depletes
        fac.inventory[group] = Math.max(0, Math.floor(fac.inventory[group] - totalConsumption));

        // Safety reserve logic (assume safety reserve is 2 days of baseline demand)
        const safetyReserve = fac.baseDemand![group] * 2;
        
        if (fac.inventory[group] === 0) {
          isCritical = true;
          totalShortage += Math.floor(totalConsumption);
        } else if (fac.inventory[group] < safetyReserve) {
          isStressed = true;
          reserveDepletionCount++;
        }
      });

      if (isCritical) {
        fac.status = 'critical';
        affectedHospitals++;
      } else if (isStressed) {
        fac.status = 'watch';
      } else {
        fac.status = 'normal';
      }
    } else if (fac.type === 'blood-bank') {
      // Simulate collection and outgoing distribution drain
      let totalStock = 0;
      Object.keys(fac.inventory).forEach(group => {
        // Simple collection logic
        const collectionRate = 20 * effectiveCollectionMultiplier;
        const distributionRate = 25 * effectiveDemandMultiplier; // Blood banks get drained faster if demand is high
        
        const netChange = (collectionRate - distributionRate) * timeFactor;
        fac.inventory[group] = Math.max(0, Math.floor(fac.inventory[group] + netChange));
        totalStock += fac.inventory[group];
      });

      // Status based on capacity percentage
      if (totalStock < fac.capacity * 0.1) fac.status = 'critical';
      else if (totalStock < fac.capacity * 0.3) fac.status = 'watch';
      else fac.status = 'normal';
    }
  });

  // Process links
  links.forEach(link => {
    if (scenario.offlineFacilities.includes(link.sourceId) || scenario.offlineFacilities.includes(link.targetId)) {
      link.status = 'offline';
    } else if (scenario.transportDelayMinutes > 0) {
      link.status = 'delayed';
    } else {
      link.status = 'normal';
    }
  });

  // Calculate high-level metrics
  let networkStress = 0;
  if (scenario.emergencyMode) {
    networkStress = 85 + Math.random() * 5; // Deterministic pseudo-random is bad, but keeping simple. Actually let's keep it pure:
    networkStress = 88;
  } else {
    const offlinePenalty = scenario.offlineFacilities.length * 25;
    const delayPenalty = scenario.transportDelayMinutes > 0 ? 15 : 0;
    const demandPenalty = scenario.demandMultiplier > 0 ? (scenario.demandMultiplier / 2) : 0;
    const depletionPenalty = reserveDepletionCount * 5;
    
    networkStress = Math.min(100, Math.max(10, 20 + offlinePenalty + delayPenalty + demandPenalty + depletionPenalty));
  }
  
  // Highest risk group is usually O- in our demo when stressed
  const highestRiskGroup = 'O-';
  const shortageExposure = totalShortage;

  // Generate Insights
  let message = "Network operating within expected parameters.";
  let recommendation = "Continue standard logistics monitoring.";
  let reasons = ["Demand matches projected baseline", "No major supply constraints"];
  
  if (networkStress > 70) {
    message = `Demand surge and constraints create elevated ${highestRiskGroup} shortage exposure across ${affectedHospitals} facilities.`;
    recommendation = "Review alternate-source redistribution and prioritize replenishment planning.";
    reasons = [];
    if (scenario.demandMultiplier > 0) reasons.push("Demand surge detected");
    if (reserveDepletionCount > 0) reasons.push("Reserve threshold breached");
    if (scenario.transportDelayMinutes > 0) reasons.push("Transport window constrained");
    if (scenario.offlineFacilities.length > 0) reasons.push("Active facility offline");
  } else if (networkStress > 40) {
    message = "Localized stress detected in network.";
    recommendation = "Monitor affected facilities for reserve depletion.";
    reasons = ["Moderate reserve reduction"];
  }

  // Decision DNA
  const decisionDna = {
    demandImpact: Math.min(100, Math.max(10, (scenario.demandMultiplier * 1.5) + 20)),
    supplyReduction: Math.min(100, scenario.offlineFacilities.length * 40 + (scenario.collectionMultiplier < 0 ? 30 : 10)),
    transportDelay: Math.min(100, (scenario.transportDelayMinutes / 60) * 50 + 10),
    facilityAvailability: scenario.offlineFacilities.length > 0 ? 80 : 15,
    reserveExposure: Math.min(100, reserveDepletionCount * 20 + 10)
  };

  return {
    facilities,
    links,
    networkStress,
    shortageExposure,
    reserveDepletionCount,
    affectedHospitals,
    highestRiskGroup,
    insight: {
      message,
      recommendation,
      reasons,
      decisionDna
    }
  };
};
