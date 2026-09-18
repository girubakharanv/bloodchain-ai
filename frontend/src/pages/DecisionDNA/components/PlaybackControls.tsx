import React from 'react';
import { Play, Pause, RotateCcw, MonitorPlay, FastForward } from 'lucide-react';

interface PlaybackControlsProps {
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onJuryDemo: () => void;
  playbackSpeed: number;
  onSpeedChange: (speed: number) => void;
}

export const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  isPlaying,
  onPlay,
  onPause,
  onReset,
  onJuryDemo,
  playbackSpeed,
  onSpeedChange
}) => {
  return (
    <div className="flex flex-wrap items-center gap-4 bg-ink-900 border border-ink-800 rounded-xl p-4 shadow-lg animate-fade-in">
      <div className="flex items-center gap-2 border-r border-ink-800 pr-4">
        {isPlaying ? (
          <button 
            onClick={onPause}
            className="w-10 h-10 rounded-full bg-ink-800 hover:bg-ink-700 flex items-center justify-center text-white transition-colors"
          >
            <Pause className="w-4 h-4 fill-current" />
          </button>
        ) : (
          <button 
            onClick={onPlay}
            className="w-10 h-10 rounded-full bg-blood-600 hover:bg-blood-500 flex items-center justify-center text-white shadow-[0_0_15px_rgba(220,38,38,0.4)] transition-all"
          >
            <Play className="w-4 h-4 fill-current ml-1" />
          </button>
        )}
        
        <button 
          onClick={onReset}
          className="w-10 h-10 rounded-full bg-ink-950 border border-ink-800 hover:border-ink-600 flex items-center justify-center text-ink-400 hover:text-white transition-colors"
          title="Reset Sequence"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-2 border-r border-ink-800 pr-4">
        <MonitorPlay className="w-4 h-4 text-ink-500" />
        <span className="text-[10px] font-bold tracking-widest text-ink-500 uppercase">
          Trace Controls
        </span>
      </div>
      
      <div className="flex items-center gap-1">
        {[0.5, 1, 2].map(speed => (
          <button
            key={speed}
            onClick={() => onSpeedChange(speed)}
            className={`px-3 py-1.5 rounded text-[10px] font-bold tracking-widest transition-colors ${
              playbackSpeed === speed 
                ? 'bg-ink-800 text-white' 
                : 'text-ink-500 hover:text-ink-300'
            }`}
          >
            {speed}x
          </button>
        ))}
        {playbackSpeed === 2 && <FastForward className="w-3 h-3 text-ink-500 ml-1" />}
      </div>

      <div className="ml-auto pl-4">
        <button 
          onClick={onJuryDemo}
          className="px-4 py-2 border border-blood-500/50 bg-blood-900/20 hover:bg-blood-900/40 text-blood-400 hover:text-blood-300 rounded text-[10px] font-bold tracking-widest uppercase transition-colors flex items-center gap-2"
        >
          <MonitorPlay className="w-4 h-4" />
          JURY DEMO
        </button>
      </div>
    </div>
  );
};
