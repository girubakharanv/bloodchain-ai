import React, { useState, useMemo, useEffect, useRef } from 'react';
import { mockCollectionData, BloodGroup, HorizonHours } from '../../data/collectionCompassData';
import { calculateCollectionIntelligence, rankCollectionPriorities, CollectionPriorityScore } from './utils/collectionCompassEngine';

import { CollectionKPIs } from './components/CollectionKPIs';
import { CollectionPriorityMap } from './components/CollectionPriorityMap';
import { PriorityHeatmap } from './components/PriorityHeatmap';
import { ForecastChart } from './components/ForecastChart';
import { CollectionGap } from './components/CollectionGap';
import { CollectionPlanningTable } from './components/CollectionPlanningTable';
import { CollectionCompassCard } from './components/CollectionCompassCard';
import { DecisionDNA } from './components/DecisionDNA';
import { CollectionScenario } from './components/CollectionScenario';

export const CollectionCompass: React.FC = () => {
  const [horizon, setHorizon] = useState<HorizonHours>(72);
  const [bloodGroup, setBloodGroup] = useState<BloodGroup | 'All'>('All');
  const [selectedRegion, setSelectedRegion] = useState<string>('Madurai');
  
  // SIMULATION STATE
  const [isSimulationMode, setIsSimulationMode] = useState<boolean>(false);
  const [capacityModifier, setCapacityModifier] = useState<number>(0);
  const [demandModifier, setDemandModifier] = useState<number>(0);
  const [inventoryModifier, setInventoryModifier] = useState<number>(0);
  const [demoStage, setDemoStage] = useState<number>(0); // 0=Baseline, 1=Demand, 2=Inventory, 3=Capacity, 4=Reassessment

  // Refs for the demo sequence timeouts
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // When leaving simulation mode, reset everything
  useEffect(() => {
    if (!isSimulationMode) {
      handleReset();
    }
  }, [isSimulationMode]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(clearTimeout);
    };
  }, []);

  // When changing regions manually, reset modifiers if not in demo script
  const handleRegionSelect = (r: string) => {
    setSelectedRegion(r);
    if (demoStage === 0) {
      setCapacityModifier(0);
      setDemandModifier(0);
      setInventoryModifier(0);
    }
  };

  const currentRegionData = mockCollectionData.find(r => r.name === selectedRegion) || mockCollectionData[0];

  // BASELINE: Calculate the network without any modifiers to act as our "BEFORE" snapshot
  const baselineNetworkData = useMemo(() => {
    return mockCollectionData.map(r => ({
      region: r,
      score: calculateCollectionIntelligence(r, bloodGroup, horizon, 0, 0, 0)
    }));
  }, [bloodGroup, horizon]);

  // Calculate the network WITH modifiers
  const { networkData, totalForecast, totalGap, highPriorityCount, topPriorityRegionData } = useMemo(() => {
    let forecast = 0;
    let gap = 0;
    let highCount = 0;
    
    const calculatedNetwork = mockCollectionData.map(r => {
      // In simulation mode, we apply the modifiers to the selected region
      const isActiveRegion = isSimulationMode && (r.name === selectedRegion || demoStage > 0);
      
      // If we're running the network stress test (demoStage > 0), apply it everywhere to see rank shifting
      const applyToAll = demoStage > 0;
      
      const capMod = (isActiveRegion || applyToAll) ? capacityModifier : 0;
      const demMod = (isActiveRegion || applyToAll) ? demandModifier : 0;
      const invMod = (isActiveRegion || applyToAll) ? inventoryModifier : 0;
      
      const score = calculateCollectionIntelligence(r, bloodGroup, horizon, capMod, demMod, invMod);
      
      forecast += score.forecastDemand;
      gap += score.projectedGap;
      if (score.level === 'HIGH' || score.level === 'CRITICAL') highCount++;
      
      return { region: r, score };
    });

    const ranked = rankCollectionPriorities(calculatedNetwork.map(n => n.score));
    const topScore = ranked[0];
    const topPriority = calculatedNetwork.find(n => n.score === topScore);

    return {
      networkData: calculatedNetwork,
      totalForecast: forecast,
      totalGap: gap,
      highPriorityCount: highCount,
      topPriorityRegionData: topPriority
    };
  }, [horizon, bloodGroup, capacityModifier, demandModifier, inventoryModifier, selectedRegion, isSimulationMode, demoStage]);

  // Current selected region specific intelligence (AFTER)
  const currentRegionScore = networkData.find(d => d.region.name === selectedRegion)?.score;
  // Current selected region baseline intelligence (BEFORE)
  const originalRegionScore = baselineNetworkData.find(d => d.region.name === selectedRegion)?.score;

  // Top baseline region to track if the priority actually moved
  const rankedBaseline = rankCollectionPriorities(baselineNetworkData.map(n => n.score));
  const topBaselineScore = rankedBaseline[0];
  const topBaselineRegion = baselineNetworkData.find(n => n.score === topBaselineScore);
  const priorityDidMove = isSimulationMode && topPriorityRegionData?.region.name !== topBaselineRegion?.region.name;

  // Formatting for UI
  const horizonLabel = horizon === 168 ? '7 DAYS' : `${horizon} HOURS`;
  const heroRegion = topPriorityRegionData?.region.name || 'UNKNOWN';

  // Prepare heatmap data
  const heatmapData = mockCollectionData.map(r => {
    const groups = {} as Record<BloodGroup, string>;
    const allGroups: BloodGroup[] = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];
    allGroups.forEach(bg => {
      // Heatmap uses modifiers if in simulation mode and region is active, or if stress testing
      const isActive = isSimulationMode && (r.name === selectedRegion || demoStage > 0);
      const capMod = isActive ? capacityModifier : 0;
      const demMod = isActive ? demandModifier : 0;
      const invMod = isActive ? inventoryModifier : 0;
      
      groups[bg] = calculateCollectionIntelligence(r, bg, horizon, capMod, demMod, invMod).level;
    });
    return { region: r.name, groups };
  });

  // --- SCENARIO CONTROLLER ---
  
  const handleReset = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    setCapacityModifier(0);
    setDemandModifier(0);
    setInventoryModifier(0);
    setDemoStage(0);
    // Restore the highest priority region based on baseline
    if (topBaselineRegion) setSelectedRegion(topBaselineRegion.region.name);
  };

  const simulateDemandSurge = () => {
    setIsSimulationMode(true);
    handleReset();
    setDemandModifier(20);
    setDemoStage(1);
  };

  const simulateCapacityDrop = () => {
    setIsSimulationMode(true);
    handleReset();
    setCapacityModifier(Math.floor(-currentRegionData.baseCollectionCapacity * 0.4));
    setDemoStage(3);
  };

  const simulateNetworkStress = () => {
    setIsSimulationMode(true);
    handleReset();
    setDemandModifier(20);
    setInventoryModifier(-20);
    setCapacityModifier(Math.floor(-currentRegionData.baseCollectionCapacity * 0.3));
    setDemoStage(4);
  };

  const playDemoSequence = () => {
    setIsSimulationMode(true);
    handleReset();
    
    // Step 0: Baseline
    setDemoStage(0);

    // Step 1: Demand Surge (+20%) at 2s
    timeoutsRef.current.push(setTimeout(() => {
      setDemandModifier(20);
      setDemoStage(1);
    }, 2000));

    // Step 2: Inventory Drop (-20%) at 4s
    timeoutsRef.current.push(setTimeout(() => {
      setInventoryModifier(-20);
      setDemoStage(2);
    }, 4000));

    // Step 3: Capacity Drop (-30%) at 6s
    timeoutsRef.current.push(setTimeout(() => {
      setCapacityModifier(Math.floor(-currentRegionData.baseCollectionCapacity * 0.3));
      setDemoStage(3);
    }, 6000));

    // Step 4: Reassessment at 8s
    timeoutsRef.current.push(setTimeout(() => {
      setDemoStage(4);
      // Let the UI find the new highest priority region and auto-select it
      // Using set timeout 0 to ensure the state has settled
      setTimeout(() => {
        // Find the new top region
        const newCalc = mockCollectionData.map(r => ({
          region: r,
          score: calculateCollectionIntelligence(r, bloodGroup, horizon, 
            Math.floor(-r.baseCollectionCapacity * 0.3), 20, -20)
        }));
        const newRanked = rankCollectionPriorities(newCalc.map(n => n.score));
        const newTop = newCalc.find(n => n.score === newRanked[0]);
        if (newTop) {
          setSelectedRegion(newTop.region.name);
        }
      }, 500);
    }, 8000));
  };


  return (
    <div className="min-h-screen bg-[#fcfcfc] p-4 md:p-8 overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <header className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="text-[10px] font-bold tracking-[0.2em] text-blood-700 mb-4 uppercase flex items-center gap-2">
                Predictive Collection Intelligence
                {isSimulationMode && <span className="bg-amber-500 text-white px-2 py-0.5 rounded text-[8px] animate-pulse">PLANNING SIMULATION</span>}
              </div>
              <h1 className="text-4xl md:text-5xl font-editorial font-bold text-ink-900 mb-2">
                Collection Compass™
              </h1>
              <p className="text-ink-600 text-sm max-w-xl italic border-l-2 border-blood-600 pl-4">
                "Change the future. Watch collection priorities move."
              </p>
            </div>
            
            {/* Control Panel */}
            <div className="flex gap-4">
              <select 
                value={horizon} 
                onChange={(e) => setHorizon(Number(e.target.value) as HorizonHours)}
                className="bg-white border border-ink-200 text-ink-900 text-xs font-bold uppercase tracking-wider rounded px-3 py-2 outline-none focus:border-blood-500 transition-colors"
              >
                <option value={24}>24 Hours</option>
                <option value={48}>48 Hours</option>
                <option value={72}>72 Hours</option>
                <option value={168}>7 Days</option>
              </select>
              <select 
                value={bloodGroup} 
                onChange={(e) => setBloodGroup(e.target.value as BloodGroup | 'All')}
                className="bg-white border border-ink-200 text-ink-900 text-xs font-bold uppercase tracking-wider rounded px-3 py-2 outline-none focus:border-blood-500 transition-colors"
              >
                <option value="All">All Groups</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>
          </div>

          {/* Hero Intelligence Statement */}
          <div className={`mt-8 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between shadow-lg relative overflow-hidden gap-6 transition-all duration-1000 ${
            isSimulationMode ? 'bg-amber-950 border border-amber-900' : 'bg-ink-900 border border-ink-800'
          }`}>
            <div className={`absolute top-0 right-0 w-64 h-full pointer-events-none transition-colors duration-1000 ${
              isSimulationMode ? 'bg-[linear-gradient(90deg,transparent,rgba(245,158,11,0.15))]' : 'bg-[linear-gradient(90deg,transparent,rgba(185,28,28,0.1))]'
            }`} />
            <div className="max-w-2xl relative z-10">
              {priorityDidMove ? (
                <div className="text-[10px] uppercase font-bold tracking-widest text-amber-500 mb-2 animate-fade-in">Priority Shift Detected</div>
              ) : (
                <div className="text-[10px] uppercase font-bold tracking-widest text-ink-400 mb-2">Next Collection Priority</div>
              )}
              <h2 className="text-3xl font-editorial font-bold text-white mb-2 uppercase">{heroRegion} REGION</h2>
              <p className="text-ink-200 text-sm leading-relaxed">
                {topPriorityRegionData?.score.recommendation}
              </p>
            </div>
            <div className="flex gap-6 text-right relative z-10 w-full md:w-auto justify-end">
               <div>
                  <div className="text-[10px] uppercase font-bold tracking-widest text-ink-500 mb-1">Priority</div>
                  <div className={`text-xl font-bold ${topPriorityRegionData?.score.level === 'CRITICAL' ? 'text-blood-500' : topPriorityRegionData?.score.level === 'HIGH' ? 'text-blood-400' : 'text-amber-500'}`}>
                    {topPriorityRegionData?.score.level}
                  </div>
               </div>
               <div>
                  <div className="text-[10px] uppercase font-bold tracking-widest text-ink-500 mb-1">Window</div>
                  <div className="text-xl font-bold text-white whitespace-nowrap">{horizonLabel}</div>
               </div>
            </div>
          </div>
        </header>

        {/* KPIs */}
        <CollectionKPIs 
          totalForecast={totalForecast}
          totalGap={totalGap}
          highPriorityRegions={highPriorityCount}
          planningHorizon={horizonLabel}
        />

        {/* Top Layout: Map & Intelligence */}
        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          <div className="w-full lg:w-1/3 h-[450px]">
            <CollectionPriorityMap 
              regionData={networkData.map(d => ({ name: d.region.name, priority: d.score.level, score: d.score.totalScore }))}
              selectedRegion={selectedRegion}
              onSelect={handleRegionSelect}
            />
          </div>
          <div className="w-full lg:w-2/3 flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[450px]">
              <div className="h-full">
                <CollectionCompassCard 
                  region={selectedRegion}
                  horizonLabel={horizonLabel}
                  bloodGroup={bloodGroup}
                  scoreData={currentRegionScore!}
                  originalScoreData={originalRegionScore}
                  isSimulationMode={isSimulationMode}
                />
              </div>
              <div className="h-full">
                <DecisionDNA 
                  scoreData={currentRegionScore!} 
                  originalScoreData={originalRegionScore}
                  region={selectedRegion}
                  bloodGroup={bloodGroup}
                  isSimulationMode={isSimulationMode}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Middle Layout: Charts & Scenario */}
        <div className="flex flex-col xl:flex-row gap-6 mb-6">
          <div className="w-full xl:w-8/12 flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <ForecastChart 
                  points={bloodGroup === 'All' ? currentRegionData.forecastCurve['O+'] /* Fallback visualization for demo */ : currentRegionData.forecastCurve[bloodGroup as BloodGroup]} 
                  horizon={horizon} 
                  isSimulationMode={isSimulationMode}
                  demandModifier={demandModifier}
                  inventoryModifier={inventoryModifier}
                />
              </div>
              <div className="md:col-span-1">
                <CollectionGap 
                  gap={currentRegionScore?.projectedGap || 0} 
                  originalGap={originalRegionScore?.projectedGap}
                  isSimulationMode={isSimulationMode}
                />
              </div>
            </div>
            
            <PriorityHeatmap 
              data={heatmapData}
              selectedGroup={bloodGroup}
              onSelectGroup={setBloodGroup}
            />
          </div>

          <div className="w-full xl:w-4/12 flex flex-col gap-6">
            <CollectionScenario 
              isSimulationMode={isSimulationMode}
              setIsSimulationMode={setIsSimulationMode}
              currentCapacity={currentRegionData.baseCollectionCapacity}
              modifier={capacityModifier}
              onModifierChange={setCapacityModifier}
              demandModifier={demandModifier}
              onDemandModifierChange={setDemandModifier}
              inventoryModifier={inventoryModifier}
              onInventoryModifierChange={setInventoryModifier}
              demoStage={demoStage}
              onPlayDemo={playDemoSequence}
              onReset={handleReset}
              onStressNetwork={simulateNetworkStress}
              onDemandSurge={simulateDemandSurge}
              onCapacityDrop={simulateCapacityDrop}
            />
          </div>
        </div>

        {/* Bottom Layout: Planning Table */}
        <CollectionPlanningTable 
          data={networkData.map((d, i) => {
            const isRanked = demoStage > 0;
            return {
              region: d.region.name,
              forecastDemand: d.score.forecastDemand,
              currentStock: d.score.currentStock,
              collectionCapacity: d.score.collectionCapacityPeriod,
              projectedGap: d.score.projectedGap,
              priority: d.score.level,
              primaryDriver: d.score.primaryDriver
            };
          }).sort((a, b) => {
            // If in active simulation reassessment, sort by gap/priority logically.
            // Using gap as proxy for simplicity in the table to show visual re-ordering.
            return a.projectedGap - b.projectedGap;
          })}
          selectedRegion={selectedRegion}
          onSelect={handleRegionSelect}
        />

      </div>
    </div>
  );
};
