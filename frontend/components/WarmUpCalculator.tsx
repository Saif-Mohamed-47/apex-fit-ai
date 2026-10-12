'use client';

import { useState } from 'react';

export default function WarmUpCalculator() {
  const [workingWeight, setWorkingWeight] = useState<number>(100);
  const [barWeight, setBarWeight] = useState<number>(20);
  const [isOpen, setIsOpen] = useState(false);

  const calculateWarmupSets = (target: number, bar: number) => {
    if (target <= bar) return [];
    
    const set1 = bar; // Barbell only
    const set2 = Math.round((target * 0.5) / 2.5) * 2.5; // 50%
    const set3 = Math.round((target * 0.7) / 2.5) * 2.5; // 70%
    const set4 = Math.round((target * 0.85) / 2.5) * 2.5; // 85%

    return [
      { set: 'Warm-up 1', weight: set1, reps: 10, pct: 'Barbell' },
      { set: 'Warm-up 2', weight: Math.max(bar, set2), reps: 6, pct: '50% 1RM' },
      { set: 'Warm-up 3', weight: Math.max(bar, set3), reps: 4, pct: '70% 1RM' },
      { set: 'Warm-up 4', weight: Math.max(bar, set4), reps: 2, pct: '85% Acclimation' },
    ];
  };

  const warmupSets = calculateWarmupSets(workingWeight, barWeight);

  return (
    <div className="bg-[#141619] border border-white/10 rounded-2xl p-5 space-y-4 shadow-xl">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-xl">🔥</span>
          <div>
            <h4 className="font-bold text-sm text-white">Warm-Up Pyramid Calculator</h4>
            <p className="text-[10px] text-gray-400">Prevent injuries & prime nervous system</p>
          </div>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-3 py-1.5 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-xl font-bold text-xs hover:bg-blue-500/20 transition-all"
        >
          {isOpen ? 'Hide Calculator' : 'Calculate Warm-Ups'}
        </button>
      </div>

      {isOpen && (
        <div className="space-y-4 pt-2 border-t border-white/10">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-400 font-bold uppercase mb-1">Working Weight (kg)</label>
              <input
                type="number"
                value={workingWeight}
                onChange={(e) => setWorkingWeight(Number(e.target.value))}
                className="w-full bg-[#0A0B0D] border border-white/10 rounded-xl p-2.5 text-white font-bold text-sm outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 font-bold uppercase mb-1">Bar Weight (kg)</label>
              <input
                type="number"
                value={barWeight}
                onChange={(e) => setBarWeight(Number(e.target.value))}
                className="w-full bg-[#0A0B0D] border border-white/10 rounded-xl p-2.5 text-white font-bold text-sm outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-bold text-gray-300 uppercase tracking-wider">Recommended Progression</p>
            {warmupSets.map((s, idx) => (
              <div key={idx} className="bg-[#0A0B0D] p-3 rounded-xl border border-white/5 flex justify-between items-center text-xs">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center text-[10px]">
                    #{idx + 1}
                  </span>
                  <div>
                    <span className="font-bold text-white text-sm">{s.weight} kg</span>
                    <span className="text-gray-400 ml-2">× {s.reps} reps</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 bg-white/5 text-gray-400 rounded text-[10px] uppercase font-mono">{s.pct}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
