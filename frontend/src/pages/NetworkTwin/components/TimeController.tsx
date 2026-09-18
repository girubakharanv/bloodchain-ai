import React from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface TimeControllerProps {
  timeOffsetHours: number;
  setTimeOffsetHours: (val: number) => void;
  isPlaying: boolean;
  setIsPlaying: (val: boolean) => void;
  playbackSpeed: number;
  setPlaybackSpeed: (val: number) => void;
  onReset: () => void;
}

export const TimeController: React.FC<TimeControllerProps> = ({
  timeOffsetHours,
  setTimeOffsetHours,
  isPlaying,
  setIsPlaying,
  playbackSpeed,
  setPlaybackSpeed,
  onReset
}) => {
  const maxHours = 168; // 7 days

  return (
    <div className="bg-white border border-ink-200/40 rounded shadow-sm p-6 w-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xs font-bold text-ink-400 uppercase tracking-widest mb-1">Simulation Time</h3>
          <div className="text-2xl font-editorial font-bold text-ink-900">
            {timeOffsetHours === 0 ? 'NOW' : `+${timeOffsetHours} HOURS`}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
           <div className="flex items-center bg-ink-50 rounded p-1 mr-2">
             {[0.5, 1, 2].map(speed => (
               <button 
                 key={speed}
                 onClick={() => setPlaybackSpeed(speed)}
                 className={`px-2 py-1 text-[10px] font-bold rounded transition-colors ${playbackSpeed === speed ? 'bg-white text-ink-900 shadow-sm' : 'text-ink-400 hover:text-ink-700'}`}
               >
                 {speed}x
               </button>
             ))}
           </div>
           
           <button 
             onClick={() => setIsPlaying(!isPlaying)}
             className="w-10 h-10 rounded-full bg-blood-50 hover:bg-blood-100 text-blood-700 flex items-center justify-center transition-colors"
           >
             {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
           </button>
           
           <button 
             onClick={onReset}
             className="w-10 h-10 rounded-full border border-ink-200 hover:bg-ink-50 text-ink-600 flex items-center justify-center transition-colors"
             title="Reset Time"
           >
             <RotateCcw size={18} />
           </button>
        </div>
      </div>

      <div className="relative pt-4">
        {/* Timeline track */}
        <input 
          type="range"
          min="0"
          max={maxHours}
          value={timeOffsetHours}
          onChange={(e) => setTimeOffsetHours(parseInt(e.target.value))}
          className="w-full h-1 bg-ink-200 rounded-lg appearance-none cursor-pointer accent-blood-600"
        />
        
        {/* Markers */}
        <div className="flex justify-between mt-3 text-[10px] font-bold text-ink-400">
          <span>NOW</span>
          <span>+24H</span>
          <span>+48H</span>
          <span>+72H</span>
          <span>+7D</span>
        </div>
      </div>
    </div>
  );
};
