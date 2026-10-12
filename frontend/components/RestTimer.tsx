'use client';

import { useState, useEffect } from 'react';

interface RestTimerProps {
  initialSeconds?: number;
  onFinish?: () => void;
}

export default function RestTimer({ initialSeconds = 90, onFinish }: RestTimerProps) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState(initialSeconds);

  useEffect(() => {
    let interval: any = null;
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);
    } else if (seconds === 0 && isActive) {
      setIsActive(false);
      if (onFinish) onFinish();
    }
    return () => clearInterval(interval);
  }, [isActive, seconds, onFinish]);

  const startTimer = (dur: number) => {
    setSelectedDuration(dur);
    setSeconds(dur);
    setIsActive(true);
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setSeconds(selectedDuration);
  };

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const progressPct = ((selectedDuration - seconds) / selectedDuration) * 100;

  return (
    <div className="bg-[#141619] border border-white/10 rounded-2xl p-5 space-y-4 shadow-xl">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-xl">⏱️</span>
          <div>
            <h4 className="font-bold text-sm text-white">In-Gym Rest Timer</h4>
            <p className="text-[10px] text-gray-400">Automatic set recovery countdown</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-[#0A0B0D] p-1 rounded-xl border border-white/5">
          {[60, 90, 120, 180].map((dur) => (
            <button
              key={dur}
              onClick={() => startTimer(dur)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                selectedDuration === dur && isActive
                  ? 'bg-blue-600 text-white shadow-[0_0_10px_rgba(59,130,246,0.4)]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {dur < 60 ? `${dur}s` : `${dur / 60}m`}
            </button>
          ))}
        </div>
      </div>

      {/* Countdown Circle Progress */}
      <div className="relative bg-[#0A0B0D] border border-white/10 rounded-xl p-4 flex items-center justify-between">
        <div className="space-y-0.5">
          <p className="text-xs text-gray-400 font-mono uppercase">Time Remaining</p>
          <p className={`text-4xl font-black font-mono tracking-tight ${seconds <= 10 && isActive ? 'text-amber-400 animate-pulse' : 'text-white'}`}>
            {formatTime(seconds)}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTimer}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
              isActive
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30'
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]'
            }`}
          >
            {isActive ? 'Pause' : seconds === 0 ? 'Restart' : 'Start Rest'}
          </button>
          <button
            onClick={resetTimer}
            className="px-3 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 rounded-xl font-bold text-xs"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-[#0A0B0D] rounded-full h-1.5 overflow-hidden border border-white/5">
        <div 
          className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full transition-all duration-1000 ease-linear"
          style={{ width: `${progressPct}%` }}
        ></div>
      </div>
    </div>
  );
}
