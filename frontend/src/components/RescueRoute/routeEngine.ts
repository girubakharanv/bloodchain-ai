import { RouteOption, RouteRequest } from '../../data/routeData';

export interface WhatIfModifiers {
  transportAddedMin: number;
  stockReducedUnits: number;
  expiryReducedHours: number;
}

export interface RouteScoreDetails {
  total: number;
  timeScore: number;
  stockScore: number;
  expiryScore: number;
  riskScore: number;
  distanceScore: number;
  isFeasible: boolean;
  issues: string[];
}

// Weights
const WEIGHTS = {
  TIME: 0.30,
  STOCK: 0.25,
  EXPIRY: 0.20,
  RISK: 0.15,
  DISTANCE: 0.10
};

export function calculateTimeScore(travelTimeMinutes: number, requiredWithinMinutes: number): { score: number, issue?: string } {
  if (travelTimeMinutes > requiredWithinMinutes) {
    return { score: 0, issue: 'TIME WINDOW AT RISK' };
  }
  
  // Linear scale where half the required time gives 100%, approaching limit gives lower.
  // Example: Required 120, Travel 24. Ratio = 24/120 = 0.2
  const ratio = travelTimeMinutes / requiredWithinMinutes;
  
  let score = 100;
  if (ratio > 0.5) {
    // 0.5 -> 100, 1.0 -> 50
    score = 100 - ((ratio - 0.5) * 100);
  }
  
  return { score: Math.round(score) };
}

export function calculateStockScore(availableStock: number, requestedQuantity: number): { score: number, issue?: string } {
  if (availableStock < requestedQuantity) {
    return { score: 0, issue: 'INSUFFICIENT STOCK' };
  }
  
  // If we have enough, it's 100. More doesn't necessarily add value but we could add a tiny margin.
  // We'll keep it simple: if you have the stock, you get 100.
  return { score: 100 };
}

export function calculateExpiryScore(expiryHours: number, travelTimeMinutes: number, requestedWindowMinutes: number): { score: number, issue?: string } {
  const travelHours = travelTimeMinutes / 60;
  const requestedWindowHours = requestedWindowMinutes / 60;
  
  // The blood needs to be viable during travel and for a reasonable time after delivery
  const marginHours = expiryHours - travelHours;
  
  if (marginHours < 24) {
    return { score: Math.max(0, marginHours * (100/24)), issue: 'EXPIRY SIGNAL: Source contains inventory approaching its expiry window.' };
  }
  
  return { score: 100 };
}

export function calculateTransportRiskScore(riskLevel: 'LOW' | 'MEDIUM' | 'HIGH'): number {
  switch (riskLevel) {
    case 'LOW': return 100;
    case 'MEDIUM': return 65;
    case 'HIGH': return 30;
    default: return 50;
  }
}

export function calculateDistanceScore(distanceKm: number, minDistance: number, maxDistance: number): number {
  if (maxDistance === minDistance) return 100; // Only one route or all same
  
  // Normalize: 100 for minDistance, 50 for maxDistance
  const range = maxDistance - minDistance;
  const normalized = (distanceKm - minDistance) / range; // 0 to 1
  
  return Math.round(100 - (normalized * 50));
}

export function calculateRouteFit(
  option: RouteOption, 
  request: RouteRequest, 
  minDist: number, 
  maxDist: number, 
  modifiers: WhatIfModifiers = { transportAddedMin: 0, stockReducedUnits: 0, expiryReducedHours: 0 }
): RouteScoreDetails {
  
  const actualTravelMin = option.travelTimeMinutes + modifiers.transportAddedMin;
  const actualStock = Math.max(0, option.availableUnits - modifiers.stockReducedUnits);
  const actualExpiry = Math.max(0, option.expiryHours - modifiers.expiryReducedHours);
  
  const requestedMin = request.destination.timeConstraintMinutes || 120;
  const requestedQty = request.destination.requestedUnits || 0;

  const timeResult = calculateTimeScore(actualTravelMin, requestedMin);
  const stockResult = calculateStockScore(actualStock, requestedQty);
  const expiryResult = calculateExpiryScore(actualExpiry, actualTravelMin, requestedMin);
  const riskScore = calculateTransportRiskScore(option.risk);
  const distanceScore = calculateDistanceScore(option.distanceKm, minDist, maxDist);

  let isFeasible = true;
  const issues: string[] = [];
  
  if (timeResult.issue) { issues.push(timeResult.issue); isFeasible = false; }
  if (stockResult.issue) { issues.push(stockResult.issue); isFeasible = false; }
  if (expiryResult.issue) { issues.push(expiryResult.issue); } // Expiry signal doesn't necessarily make it unfeasible unless 0
  if (actualExpiry <= actualTravelMin / 60) {
    issues.push('INVENTORY EXPIRES IN TRANSIT');
    isFeasible = false;
  }

  const total = Math.round(
    (timeResult.score * WEIGHTS.TIME) +
    (stockResult.score * WEIGHTS.STOCK) +
    (expiryResult.score * WEIGHTS.EXPIRY) +
    (riskScore * WEIGHTS.RISK) +
    (distanceScore * WEIGHTS.DISTANCE)
  );

  return {
    total,
    timeScore: timeResult.score,
    stockScore: stockResult.score,
    expiryScore: expiryResult.score,
    riskScore,
    distanceScore,
    isFeasible,
    issues
  };
}

export function recommendBestRoute(
  routes: RouteOption[], 
  request: RouteRequest,
  modifiers: WhatIfModifiers = { transportAddedMin: 0, stockReducedUnits: 0, expiryReducedHours: 0 }
): { rankedRoutes: { route: RouteOption, details: RouteScoreDetails }[], bestRoute: RouteOption | null, networkConstraint: boolean } {
  
  const distances = routes.map(r => r.distanceKm);
  const minDist = Math.min(...distances);
  const maxDist = Math.max(...distances);

  const evaluated = routes.map(route => {
    return {
      route,
      details: calculateRouteFit(route, request, minDist, maxDist, modifiers)
    };
  });

  // Sort descending by score
  evaluated.sort((a, b) => b.details.total - a.details.total);

  const feasibleRoutes = evaluated.filter(e => e.details.isFeasible);
  const bestRoute = feasibleRoutes.length > 0 ? feasibleRoutes[0].route : null;
  const networkConstraint = feasibleRoutes.length === 0;

  return { rankedRoutes: evaluated, bestRoute, networkConstraint };
}

export function generateRouteReasons(details: RouteScoreDetails): string[] {
  const reasons: string[] = [];

  if (!details.isFeasible) {
    if (details.issues.includes('INSUFFICIENT STOCK')) {
      reasons.push('✗ Insufficient available inventory to satisfy request.');
    }
    if (details.issues.includes('TIME WINDOW AT RISK')) {
      reasons.push('✗ Estimated travel time exceeds the required delivery window.');
    }
    return reasons;
  }

  if (details.stockScore === 100) {
    reasons.push('✓ Sufficient suitable inventory available.');
  }
  
  if (details.timeScore > 80) {
    reasons.push('✓ Well within requested delivery window.');
  } else if (details.timeScore > 50) {
    reasons.push('✓ Meets delivery window requirements.');
  }

  if (details.riskScore === 100) {
    reasons.push('✓ Low transport-risk classification.');
  } else if (details.riskScore === 65) {
    reasons.push('⚠ Medium transport risk accepted.');
  }

  if (details.expiryScore === 100) {
    reasons.push('✓ Expiry window provides adequate logistics margin.');
  } else {
    reasons.push('⚠ Inventory nearing expiry window (authorized review recommended).');
  }

  if (details.total >= 80) {
    reasons.push('✓ Better overall route fit than alternatives.');
  }

  return reasons;
}
