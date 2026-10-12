'use client';

import { useState, useEffect, useRef } from 'react';

interface RestTimerProps {
  initialSeconds?: number;
  onFinish?: () => void;
}

export default function RestTimer({ initialSeconds = 90, onFinish }: RestTimerProps) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState(initialSeconds);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [justFinished, setJustFinished] = useState(false);

  // Play realistic athletic gym countdown beep (Web Audio API - no external file required)
  const playBeepSound = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      const createTone = (freq: number, start: number, dur: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.3, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + dur);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + dur);
      };

      // 3 Athletic Gym Beeps: Short, Short, Long High Tone
      createTone(880, now, 0.12);
      createTone(880, now + 0.18, 0.12);
      createTone(1320, now + 0.36, 0.4);

      // Mobile haptic vibration if supported
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate([200, 100, 200, 100, 400]);
      }
    } catch (e) {
      console.log('Audio playback error:', e);
    }
  };

  useEffect(() => {
    let interval: any = null;
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);
    } else if (seconds === 0 && isActive) {
      setIsActive(false);
      setJustFinished(true);
      playBeepSound();
      if (onFinish) onFinish();
    }
    return () => clearInterval(interval);
  }, [isActive, seconds, onFinish, soundEnabled]);

  const startTimer = (dur: number) => {
    setSelectedDuration(dur);
    setSeconds(dur);
    setIsActive(true);
    setJustFinished(false);
  };

  const toggleTimer = () => {
    if (seconds === 0) {
      setSeconds(selectedDuration);
      setIsActive(true);
      setJustFinished(false);
    } else {
      setIsActive(!isActive);
      setJustFinished(false);
    }
  };

  const resetTimer = () => {
    setIsActive(false);
    setSeconds(selectedDuration);
    setJustFinished(false);
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
            <h4 className="font-bold text-sm text-white">عداد الراحة بين المجموعات (Rest Timer)</h4>
            <p className="text-[10px] text-gray-400">تنبيه صوتي ذكي عند انتهاء الراحة للبدء فوراً</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Sound Toggle Button */}
          <button
            type="button"
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              if (!soundEnabled) playBeepSound();
            }}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold border transition-all flex items-center gap-1 ${
              soundEnabled
                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                : 'bg-white/5 text-gray-400 border-white/10'
            }`}
            title="تبديل صوت الصفارة والتنبيه"
          >
            <span>{soundEnabled ? '🔔' : '🔕'}</span>
            <span className="text-[11px] hidden sm:inline">{soundEnabled ? 'الصوت مفعّل' : 'صامت'}</span>
          </button>

          {/* Duration Pills */}
          <div className="flex items-center gap-1 bg-[#0A0B0D] p-1 rounded-xl border border-white/5">
            {[45, 60, 90, 120, 180].map((dur) => (
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
      </div>

      {/* Countdown Card */}
      <div className={`relative bg-[#0A0B0D] border rounded-2xl p-4 flex items-center justify-between transition-all ${
        justFinished
          ? 'border-emerald-500/60 bg-emerald-950/20 shadow-[0_0_20px_rgba(16,185,129,0.3)] animate-pulse'
          : seconds <= 10 && isActive
          ? 'border-amber-500/50 bg-amber-950/10'
          : 'border-white/10'
      }`}>
        <div className="space-y-0.5">
          <p className="text-[11px] font-bold text-gray-400 font-mono uppercase tracking-wider">
            {justFinished ? '🔥 حان وقت المجموعة التالية!' : 'الوقت المتبقي للاستشفاء'}
          </p>
          <p className={`text-4xl font-black font-mono tracking-tight ${
            justFinished
              ? 'text-emerald-400'
              : seconds <= 10 && isActive
              ? 'text-amber-400 animate-pulse'
              : 'text-white'
          }`}>
            {formatTime(seconds)}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTimer}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
              isActive
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30'
                : justFinished
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]'
            }`}
          >
            {isActive ? 'إيقاف مؤقت' : seconds === 0 ? 'بدء راحة جديدة ⏱️' : 'بدء الراحة ⏱️'}
          </button>
          <button
            onClick={resetTimer}
            className="px-3 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 rounded-xl font-bold text-xs"
          >
            إعادة ضبط
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-[#0A0B0D] rounded-full h-1.5 overflow-hidden border border-white/5">
        <div 
          className={`h-full transition-all duration-1000 ease-linear ${
            justFinished
              ? 'bg-emerald-500'
              : seconds <= 10
              ? 'bg-amber-400'
              : 'bg-gradient-to-r from-blue-500 to-indigo-500'
          }`}
          style={{ width: `${progressPct}%` }}
        ></div>
      </div>
    </div>
  );
}
