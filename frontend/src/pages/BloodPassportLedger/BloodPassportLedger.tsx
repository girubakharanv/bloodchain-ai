import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Fingerprint, Play, AlertTriangle, RefreshCcw } from 'lucide-react';
import { demoUnits, BloodUnit } from './data/bloodPassportData';
import { PassportSearch } from './components/PassportSearch';
import { UnitList } from './components/UnitList';
import { UnitSummary } from './components/UnitSummary';
import { LifecycleTimeline } from './components/LifecycleTimeline';
import { LedgerEventTable } from './components/LedgerEventTable';
import { IntegrityCard } from './components/IntegrityCard';
import { TraceabilityScore } from './components/TraceabilityScore';
import { VerificationResult, verifyLedgerChain } from './utils/ledgerIntegrityEngine';
import { DecisionDNA } from '../SupplyStressSimulator/components/DecisionDNA';
import { PlaybackControls, PlaybackState } from './components/PlaybackControls';
import { UnitIntelligenceSummary } from './components/UnitIntelligenceSummary';
import { CurrentEventCard } from './components/CurrentEventCard';
import { CrossFeatureNavigation } from './components/CrossFeatureNavigation';
import { JourneyLog } from './components/JourneyLog';

export const BloodPassportLedger: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('All');
  const [selectedState, setSelectedState] = useState<string>('All');
  const [selectedSource, setSelectedSource] = useState<string>('All');
  
  const [liveUnits, setLiveUnits] = useState<BloodUnit[]>(JSON.parse(JSON.stringify(demoUnits)));
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(liveUnits[0]?.id || null);
  
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);

  // Playback State
  const [playbackState, setPlaybackState] = useState<PlaybackState>('IDLE');
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [activeEventIndex, setActiveEventIndex] = useState<number>(0);
  const playbackRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const filteredUnits = useMemo(() => {
    return liveUnits.filter(u => {
      if (searchQuery && !u.id.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (selectedGroup !== 'All' && u.bloodGroup !== selectedGroup) return false;
      if (selectedState !== 'All' && u.currentState !== selectedState) return false;
      if (selectedSource !== 'All' && !u.source.includes(selectedSource)) return false;
      return true;
    });
  }, [liveUnits, searchQuery, selectedGroup, selectedState, selectedSource]);

  const selectedUnit = useMemo(() => {
    return liveUnits.find(u => u.id === selectedUnitId) || null;
  }, [liveUnits, selectedUnitId]);

  // When a new unit is selected, reset everything
  useEffect(() => {
    setVerificationResult(null);
    setPlaybackState('IDLE');
    setActiveEventIndex(selectedUnit ? selectedUnit.events.length - 1 : 0);
    if (playbackRef.current) clearInterval(playbackRef.current);
  }, [selectedUnitId, selectedUnit]);

  const verifyLedger = async () => {
    if (!selectedUnit) return;
    setIsVerifying(true);
    await new Promise(r => setTimeout(r, 600)); 
    const result = await verifyLedgerChain(selectedUnit);
    setVerificationResult(result);
    setIsVerifying(false);
  };

  const simulateTamper = () => {
    if (!selectedUnit) return;
    if (selectedUnit.events.length < 2) return;
    
    const newUnits = [...liveUnits];
    const unitIndex = newUnits.findIndex(u => u.id === selectedUnit.id);
    const tamperedUnit = JSON.parse(JSON.stringify(selectedUnit)) as BloodUnit;
    
    const targetEvent = tamperedUnit.events[1];
    targetEvent.location = 'Unknown Offshore Facility'; 
    
    newUnits[unitIndex] = tamperedUnit;
    setLiveUnits(newUnits);
    setVerificationResult(null);
  };

  const restoreLedger = () => {
    setLiveUnits(JSON.parse(JSON.stringify(demoUnits)));
    setVerificationResult(null);
  };

  // Playback logic
  useEffect(() => {
    if (playbackState === 'PLAYING' && selectedUnit) {
      playbackRef.current = setInterval(() => {
        setActiveEventIndex(prev => {
          if (prev >= selectedUnit.events.length - 1) {
            setPlaybackState('COMPLETED');
            return prev;
          }
          return prev + 1;
        });
      }, 1500 / playbackSpeed);
    } else {
      if (playbackRef.current) clearInterval(playbackRef.current);
    }

    return () => {
      if (playbackRef.current) clearInterval(playbackRef.current);
    };
  }, [playbackState, playbackSpeed, selectedUnit]);

  const handlePlay = () => {
    if (!selectedUnit) return;
    if (playbackState === 'COMPLETED' || playbackState === 'IDLE') {
      setActiveEventIndex(0);
    }
    setPlaybackState('PLAYING');
  };

  const handlePause = () => setPlaybackState('PAUSED');
  const handleReplay = () => {
    setActiveEventIndex(0);
    setPlaybackState('PLAYING');
  };
  const handleReset = () => {
    if (selectedUnit) {
      setActiveEventIndex(selectedUnit.events.length - 1);
    }
    setPlaybackState('IDLE');
  };

  // UI mapping logic for playback index
  const displayEventIndex = playbackState === 'IDLE' && selectedUnit 
    ? selectedUnit.events.length - 1 
    : activeEventIndex;

  return (
    <div className="min-h-screen bg-[#fcfcfc] p-4 md:p-8 overflow-x-hidden">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <header className="mb-8">
          <div className="text-[10px] font-bold tracking-[0.2em] text-blood-700 mb-4 uppercase">
            UNIT-LEVEL TRACEABILITY
          </div>
          <h1 className="text-4xl md:text-5xl font-editorial font-bold text-ink-900 mb-2">
            Blood Passport Ledger™
          </h1>
          <p className="text-ink-600 text-sm max-w-xl italic border-l-2 border-blood-600 pl-4">
            "Every unit. Every movement. One traceable story."
          </p>
        </header>

        {/* Hero Concept Card & Controls */}
        <div className="bg-ink-900 border border-ink-800 rounded-2xl shadow-lg p-6 flex flex-col xl:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blood-900/40 via-transparent to-transparent pointer-events-none" />
          
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Fingerprint className="w-5 h-5 text-blood-500" />
              <h2 className="text-xl font-bold text-white tracking-widest uppercase">
                OPERATIONAL TRACEABILITY
              </h2>
            </div>
            <span className="bg-ink-800 text-amber-500 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest">
              TAMPER-EVIDENT LEDGER SIMULATION
            </span>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto relative z-10">
            <button
              onClick={verifyLedger}
              disabled={isVerifying || !selectedUnit || playbackState === 'PLAYING'}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded text-[10px] font-bold tracking-widest uppercase flex items-center gap-2 transition-colors shadow-lg shadow-emerald-900/50"
            >
              <Play className="w-3 h-3" />
              {isVerifying ? 'CHECKING RECORDS...' : 'VERIFY LEDGER'}
            </button>
            <button
              onClick={simulateTamper}
              disabled={isVerifying || !selectedUnit || playbackState === 'PLAYING'}
              className="px-6 py-2.5 border border-amber-500/50 hover:bg-amber-500/10 text-amber-500 rounded text-[10px] font-bold tracking-widest uppercase flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              <AlertTriangle className="w-3 h-3" />
              SIMULATE RECORD TAMPER
            </button>
            <button
              onClick={restoreLedger}
              disabled={playbackState === 'PLAYING'}
              className="px-6 py-2.5 border border-ink-700 hover:bg-ink-800 text-ink-300 rounded text-[10px] font-bold tracking-widest uppercase flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              <RefreshCcw className="w-3 h-3" />
              RESTORE ORIGINAL LEDGER
            </button>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="flex flex-col xl:flex-row gap-6">
          
          {/* Left Column: Search & List */}
          <div className="w-full xl:w-96 flex-shrink-0 flex flex-col gap-6">
            <PassportSearch 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedGroup={selectedGroup}
              setSelectedGroup={setSelectedGroup}
              selectedState={selectedState}
              setSelectedState={setSelectedState}
              selectedSource={selectedSource}
              setSelectedSource={setSelectedSource}
            />
            
            <UnitList 
              units={filteredUnits}
              selectedUnitId={selectedUnitId}
              onSelect={setSelectedUnitId}
            />
          </div>

          {/* Right Column: Passport Canvas */}
          <div className="w-full flex-grow flex flex-col gap-6 min-w-0">
             {selectedUnit ? (
               <>
                 <UnitIntelligenceSummary 
                    unit={selectedUnit} 
                    verificationResult={verificationResult} 
                    activeEventIndex={displayEventIndex} 
                 />
                 
                 <PlaybackControls 
                    playbackState={playbackState}
                    onPlay={handlePlay}
                    onPause={handlePause}
                    onReplay={handleReplay}
                    onReset={handleReset}
                    playbackSpeed={playbackSpeed}
                    setPlaybackSpeed={setPlaybackSpeed}
                 />

                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                   <div className="flex flex-col gap-6">
                     <CurrentEventCard 
                       unit={selectedUnit} 
                       activeEventIndex={displayEventIndex} 
                       verificationResult={verificationResult} 
                       playbackState={playbackState}
                     />
                     
                     <div className="grid grid-cols-2 gap-6 h-full">
                       <IntegrityCard unit={selectedUnit} verificationResult={verificationResult} isVerifying={isVerifying} />
                       <TraceabilityScore score={selectedUnit.traceabilityScore} verificationResult={verificationResult} />
                     </div>
                   </div>
                   <LifecycleTimeline 
                     unit={selectedUnit} 
                     verificationResult={verificationResult} 
                     activeEventIndex={displayEventIndex}
                   />
                 </div>
                 
                 <CrossFeatureNavigation unitId={selectedUnit.id} />

                 <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                   <div className="xl:col-span-1 flex flex-col gap-6">
                     <DecisionDNA 
                        isStressed={verificationResult?.valid === false}
                        decisionDNA={{
                          title: verificationResult ? (verificationResult.valid ? 'Verified' : 'Invalid') : 'Unverified',
                          contributors: { 'Confidence': 100 },
                          reason: verificationResult?.valid ? 'All hashes match.' : 'Mismatch detected.'
                        }}
                     />
                     <JourneyLog unit={selectedUnit} activeEventIndex={displayEventIndex} />
                   </div>
                   <div className="xl:col-span-2">
                     <LedgerEventTable 
                       unit={selectedUnit} 
                       verificationResult={verificationResult} 
                       activeEventIndex={displayEventIndex}
                     />
                   </div>
                 </div>
               </>
             ) : (
               <div className="bg-white border border-ink-200 rounded-2xl p-12 text-center text-ink-500 italic shadow-sm h-[400px] flex items-center justify-center">
                  {searchQuery ? 'UNIT NOT FOUND IN DEMO LEDGER' : 'Select a unit to view its passport.'}
               </div>
             )}
          </div>
        </div>

      </div>
    </div>
  );
};
