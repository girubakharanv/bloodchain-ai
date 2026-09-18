import React from 'react';
import { Play, Pause, RotateCcw, SkipBack } from 'lucide-react';

export type PlaybackState = 'IDLE' | 'PLAYING' | 'PAUSED' | 'COMPLETED';

interface PlaybackControlsProps {
  playbackState: PlaybackState;
  onPlay: () => void;
  onPause: () => void;
  onReplay: () => void;
  onReset: () => void;
  playbackSpeed: number;
  setPlaybackSpeed: (speed: number) => void;
}

export const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  playbackState,
  onPlay,
  onPause,
  onReplay,
  onReset,
  playbackSpeed,
  setPlaybackSpeed
}) => {
  return (
    <div className="bg-ink-900 border border-ink-800 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <h3 className="text-[10px] font-bold text-ink-400 uppercase tracking-widest mr-4">
          JOURNEY PLAYBACK
        </h3>
        
        {playbackState === 'IDLE' || playbackState === 'PAUSED' ? (
          <button
            onClick={onPlay}
            className="w-10 h-10 rounded-full bg-blood-600 hover:bg-blood-500 text-white flex items-center justify-center transition-colors shadow-lg shadow-blood-900/50"
          >
            <Play className="w-4 h-4 ml-1" />
          </button>
        ) : playbackState === 'PLAYING' ? (
          <button
            onClick={onPause}
            className="w-10 h-10 rounded-full border border-blood-500 text-blood-500 hover:bg-blood-950 flex items-center justify-center transition-colors"
          >
            <Pause className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={onReplay}
            className="w-10 h-10 rounded-full border border-ink-600 text-ink-300 hover:bg-ink-800 flex items-center justify-center transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}
        
        <button
          onClick={onReset}
          className="w-10 h-10 rounded-full text-ink-500 hover:text-ink-300 flex items-center justify-center transition-colors"
          title="Reset to Original"
        >
          <SkipBack className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-4 border-l border-ink-800 pl-4">
        <span className="text-[10px] font-bold text-ink-500 uppercase tracking-widest">
          SPEED
        </span>
        <div className="flex bg-ink-950 rounded-lg p-1 border border-ink-800">
          {[0.5, 1, 2].map(speed => (
            <button
              key={speed}
              onClick={() => setPlaybackSpeed(speed)}
              className={`px-3 py-1 rounded text-[10px] font-bold transition-colors ${
                playbackSpeed === speed 
                  ? 'bg-ink-800 text-white' 
                  : 'text-ink-500 hover:text-ink-300'
              }`}
            >
              {speed}×
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
