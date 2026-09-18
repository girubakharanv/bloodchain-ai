import { RegionData, BloodGroup, HorizonHours } from '../../../data/collectionCompassData';

export interface CollectionPriorityScore {
  totalScore: number;
  level: 'LOW' | 'WATCH' | 'HIGH' | 'CRITICAL';
  projectedGap: number;
  forecastDemand: number;
  currentStock: number;
  collectionCapacityPeriod: number;
  demandMomentumText: 'RISING' | 'STABLE' | 'FALLING';
  drivers: {
    forecastDemandGrowth: number;
    currentStockDeficit: number;
    expiryExposure: number;
    collectionCapacity: number;
    regionalPressure: number;
    demandMomentum: number;
  };
  primaryDriver: string;
  recommendation: string;
  reason: string;
}

const COLLECTION_WEIGHTS = {
  demand: 0.25,
  inventory: 0.20,
  gap: 0.20,
  expiry: 0.10,
  momentum: 0.10,
  capacity: 0.10,
  network: 0.05
};

// Configurable planning floor: minimum baseline inventory buffer needed to avoid pressure
const PLANNING_FLOOR = 350; 

export const getCollectionPriorityLevel = (score: number): 'LOW' | 'WATCH' | 'HIGH' | 'CRITICAL' => {
  if (score < 25) return 'LOW';
  if (score < 50) return 'WATCH';
  if (score < 75) return 'HIGH';
  return 'CRITICAL';
};

const calculateDemandPressure = (forecast: number, inventory: number): number => {
  if (inventory <= 0) return 100;
  const ratio = forecast / inventory;
  if (ratio <= 0.5) return 10;
  if (ratio <= 1.0) return 40;
  if (ratio <= 1.5) return 75;
  return 100;
};

const calculateInventoryPressure = (inventory: number, group: string): number => {
  // Use a simpler floor logic proportional to the group if specified, else raw aggregate
  const floor = group === 'All' ? PLANNING_FLOOR : PLANNING_FLOOR / 8;
  if (inventory > floor * 1.5) return 10;
  if (inventory > floor) return 30;
  if (inventory > floor * 0.5) return 75;
  return 100;
};

const calculateCollectionCapacityPressure = (required: number, capacity: number): number => {
  if (capacity <= 0) return 100;
  const ratio = required / capacity;
  if (ratio < 0.8) return 10;
  if (ratio <= 1.0) return 40;
  if (ratio <= 1.2) return 75;
  return 100;
};

const calculateDemandMomentum = (region: RegionData, group: BloodGroup | 'All', horizon: HorizonHours): { text: 'RISING' | 'STABLE' | 'FALLING', score: number } => {
  const curve = group === 'All' ? region.forecastCurve['O+'] : region.forecastCurve[group];
  const relevantPoints = curve.filter(p => p.hoursOffset > 0 && p.hoursOffset <= horizon);
  
  if (relevantPoints.length < 2) return { text: 'STABLE', score: 25 };

  let rises = 0;
  let falls = 0;
  for (let i = 1; i < relevantPoints.length; i++) {
    if (relevantPoints[i].forecastDemand > relevantPoints[i-1].forecastDemand) rises++;
    else if (relevantPoints[i].forecastDemand < relevantPoints[i-1].forecastDemand) falls++;
  }

  if (rises > falls && rises > 0) return { text: 'RISING', score: 100 };
  if (falls > rises && falls > 0) return { text: 'FALLING', score: 10 };
  return { text: 'STABLE', score: 40 };
};

const generateCollectionDecisionDNA = (
  region: string, 
  group: string, 
  primaryDriver: string, 
  momentumText: string, 
  projectedGap: number
): string => {
  const g = group === 'All' ? 'overall' : group;
  let text = `${region} is prioritized because `;

  if (primaryDriver === 'Forecast Demand Pressure' && momentumText === 'RISING') {
    text += `forecast ${g} demand is rising while projected available inventory remains below the planning requirement.`;
  } else if (primaryDriver === 'Current Inventory Pressure') {
    text += `current ${g} inventory is critically approaching the operational planning floor.`;
  } else if (primaryDriver === 'Projected Collection Gap' && projectedGap < 0) {
    text += `projected demand exceeds expected collection capacity, creating a severe operational gap.`;
  } else if (primaryDriver === 'Expiry Pressure') {
    text += `substantial inventory is exposed to expiry risk without sufficient planned demand absorption.`;
  } else if (primaryDriver === 'Demand Momentum') {
    text += `${g} demand is showing an accelerating upward trajectory across the planning horizon.`;
  } else if (primaryDriver === 'Collection Capacity Pressure') {
    text += `base collection capacity is insufficient to meet the projected ${g} requirements.`;
  } else {
    text += `forecast ${g} demand and current constraints require operational review.`;
  }

  return text;
};

export const calculateCollectionIntelligence = (
  region: RegionData, 
  group: BloodGroup | 'All', 
  horizon: HorizonHours,
  capacityModifier: number = 0,
  demandModifier: number = 0,
  inventoryModifier: number = 0
): CollectionPriorityScore => {
  
  const days = horizon / 24;
  const dailyCapacity = Math.max(0, region.baseCollectionCapacity + capacityModifier);
  const totalCapacity = dailyCapacity * days;
  const actualCollectionYield = group === 'All' ? totalCapacity : Math.floor(totalCapacity / 8);

  let currentStock = 0;
  let baseForecastDemand = 0;

  if (group === 'All') {
    currentStock = Object.values(region.currentStock).reduce((a, b) => a + b, 0);
    baseForecastDemand = Object.values(region.forecastDemand[horizon]).reduce((a, b) => a + b, 0);
  } else {
    currentStock = region.currentStock[group];
    baseForecastDemand = region.forecastDemand[horizon][group];
  }

  // Apply modifiers
  const modifiedForecastDemand = Math.round(baseForecastDemand * (1 + (demandModifier / 100)));
  const modifiedStock = Math.round(currentStock * (1 + (inventoryModifier / 100)));

  // PROJECTED GAP
  const projectedGap = modifiedStock + actualCollectionYield - modifiedForecastDemand;

  // COMPONENT SCORES (0-100 normalized)
  const demandScore = calculateDemandPressure(modifiedForecastDemand, modifiedStock);
  const inventoryScore = calculateInventoryPressure(modifiedStock, group);
  const gapScore = projectedGap < 0 ? Math.min(100, Math.abs(projectedGap)) : 10;
  const expiryScore = Math.min(100, region.expiryExposure * 2);
  const capacityScore = calculateCollectionCapacityPressure(modifiedForecastDemand, actualCollectionYield);
  const { text: momentumText, score: momentumScore } = calculateDemandMomentum(region, group, horizon);
  const networkScore = region.regionalPressureScore;

  // APPLY WEIGHTS
  const weightedDemand = demandScore * COLLECTION_WEIGHTS.demand;
  const weightedInventory = inventoryScore * COLLECTION_WEIGHTS.inventory;
  const weightedGap = gapScore * COLLECTION_WEIGHTS.gap;
  const weightedExpiry = expiryScore * COLLECTION_WEIGHTS.expiry;
  const weightedMomentum = momentumScore * COLLECTION_WEIGHTS.momentum;
  const weightedCapacity = capacityScore * COLLECTION_WEIGHTS.capacity;
  const weightedNetwork = networkScore * COLLECTION_WEIGHTS.network;

  const totalScore = Math.max(0, Math.min(100, Math.round(
    weightedDemand + weightedInventory + weightedGap + weightedExpiry + weightedMomentum + weightedCapacity + weightedNetwork
  )));

  const level = getCollectionPriorityLevel(totalScore);

  const driversObj = {
    'Forecast Demand Pressure': weightedDemand,
    'Current Inventory Pressure': weightedInventory,
    'Projected Collection Gap': weightedGap,
    'Expiry Pressure': weightedExpiry,
    'Demand Momentum': weightedMomentum,
    'Collection Capacity Pressure': weightedCapacity,
    'Regional Network Pressure': weightedNetwork
  };

  // Find primary driver
  let primaryDriver = 'Forecast Demand Pressure';
  let maxVal = driversObj['Forecast Demand Pressure'];
  for (const [k, v] of Object.entries(driversObj)) {
    if (v > maxVal) {
      maxVal = v;
      primaryDriver = k;
    }
  }

  const reason = generateCollectionDecisionDNA(region.name, group, primaryDriver, momentumText, projectedGap);
  
  const horizonLabel = horizon === 168 ? '7 DAYS' : `${horizon} HOURS`;
  const recommendation = `Prioritize collection planning for ${group === 'All' ? 'overall stock' : group} in ${region.name} over the next ${horizonLabel.toLowerCase()}. Review by authorized blood-bank personnel.`;

  return {
    totalScore,
    level,
    projectedGap,
    forecastDemand: modifiedForecastDemand,
    currentStock: modifiedStock,
    collectionCapacityPeriod: actualCollectionYield,
    demandMomentumText: momentumText,
    drivers: {
      forecastDemandGrowth: Math.round(weightedDemand),
      currentStockDeficit: Math.round(weightedInventory),
      expiryExposure: Math.round(weightedExpiry),
      collectionCapacity: Math.round(weightedCapacity),
      regionalPressure: Math.round(weightedNetwork),
      demandMomentum: Math.round(weightedMomentum)
    },
    primaryDriver,
    recommendation,
    reason
  };
};

export const rankCollectionPriorities = (results: CollectionPriorityScore[]) => {
  return [...results].sort((a, b) => b.totalScore - a.totalScore);
};
