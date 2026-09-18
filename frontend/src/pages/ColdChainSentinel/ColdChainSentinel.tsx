import React, { useState, useMemo } from 'react';
import { mockShipments } from '../../data/coldChainData';
import { ColdChainKPIs } from './components/ColdChainKPIs';
import { ShipmentMonitor } from './components/ShipmentMonitor';
import { TemperatureTimeline } from './components/TemperatureTimeline';
import { SensorStatus } from './components/SensorStatus';
import { ShipmentTable } from './components/ShipmentTable';
import { ShipmentDetail } from './components/ShipmentDetail';
import { ChainTimeline } from './components/ChainTimeline';
import { SentinelAlerts } from './components/SentinelAlerts';
import { SensorEventLog } from './components/SensorEventLog';
import { SentinelLogic } from './components/SentinelLogic';
import { calculateSentinelRisk, generateSentinelAlerts, SentinelScoreDetails } from './utils/sentinelRiskEngine';

export const ColdChainSentinel: React.FC = () => {
  const [selectedShipmentId, setSelectedShipmentId] = useState(mockShipments[0].id);

  // Compute intelligence engine scores for all shipments
  const { resultsMap, dynamicAlerts, activeCount, atRiskCount, highestScore, topDriverName } = useMemo(() => {
    const map: Record<string, SentinelScoreDetails> = {};
    let atRisk = 0;
    let maxScore = -1;
    const driverCounts: Record<string, number> = {};

    mockShipments.forEach(s => {
      const details = calculateSentinelRisk(s);
      map[s.id] = details;
      
      if (details.riskLevel === 'HIGH' || details.riskLevel === 'CRITICAL') {
        atRisk++;
      }
      if (details.totalScore > maxScore) {
        maxScore = details.totalScore;
      }
      
      const driverName = details.topDriver.name;
      driverCounts[driverName] = (driverCounts[driverName] || 0) + 1;
    });

    const alerts = generateSentinelAlerts(mockShipments);
    
    // Find most common top driver across the network
    let mostCommonDriver = 'Temperature';
    let maxDriverCount = 0;
    for (const [driver, count] of Object.entries(driverCounts)) {
      if (count > maxDriverCount) {
        maxDriverCount = count;
        mostCommonDriver = driver;
      }
    }

    return { 
      resultsMap: map, 
      dynamicAlerts: alerts,
      activeCount: mockShipments.length,
      atRiskCount: atRisk,
      highestScore: maxScore,
      topDriverName: mostCommonDriver
    };
  }, []);

  const selectedShipment = mockShipments.find(s => s.id === selectedShipmentId) || mockShipments[0];
  const selectedScoreDetails = resultsMap[selectedShipment.id];

  return (
    <div className="min-h-screen bg-[#fcfcfc] p-4 md:p-8 overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <header className="mb-8">
          <div className="text-[10px] font-bold tracking-[0.2em] text-blood-700 mb-4 uppercase">
            COLD-CHAIN INTELLIGENCE
          </div>
          <h1 className="text-4xl md:text-5xl font-editorial font-bold text-ink-900 mb-4">
            Cold Chain Sentinel™
          </h1>
          <p className="text-ink-600 text-sm max-w-xl italic">
            "See the conditions behind every journey."
          </p>
          <div className="mt-2 inline-flex items-center gap-2 px-2 py-1 bg-ink-100 rounded text-[10px] uppercase font-bold tracking-wider text-ink-500">
            Simulated Monitoring
          </div>
        </header>

        {/* KPIs */}
        <ColdChainKPIs 
          activeCount={activeCount}
          atRiskCount={atRiskCount}
          highestScore={highestScore}
          topDriver={topDriverName}
        />

        {/* Main Dashboard Layout */}
        <div className="flex flex-col xl:flex-row gap-6 mb-6">
          
          {/* LEFT: Central Monitoring */}
          <div className="w-full xl:w-2/3 flex flex-col gap-6">
            <div className="h-auto">
              <ShipmentMonitor shipment={selectedShipment} />
            </div>
            <div className="h-[300px]">
              <TemperatureTimeline shipment={selectedShipment} />
            </div>
            <div>
              <SensorStatus shipment={selectedShipment} />
            </div>
          </div>

          {/* RIGHT: Context & Alerts */}
          <div className="w-full xl:w-1/3 flex flex-col gap-6">
            <div className="h-auto">
              <ShipmentDetail 
                shipment={selectedShipment} 
                scoreDetails={selectedScoreDetails} 
              />
            </div>
            <div className="h-[300px]">
              <ChainTimeline shipment={selectedShipment} />
            </div>
            <div className="flex-grow min-h-[250px]">
              <SentinelAlerts alerts={dynamicAlerts} />
            </div>
          </div>

        </div>

        {/* Lower Dashboard Section */}
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-2/3">
            <ShipmentTable 
              shipments={mockShipments} 
              resultsMap={resultsMap}
              selectedId={selectedShipmentId}
              onSelect={setSelectedShipmentId}
            />
          </div>
          <div className="w-full lg:w-1/3 flex flex-col gap-6 mt-6">
            <div className="h-[300px]">
              <SensorEventLog shipment={selectedShipment} />
            </div>
            <div className="h-auto">
              <SentinelLogic details={selectedScoreDetails} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
