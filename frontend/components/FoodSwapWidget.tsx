'use client';

import { useState } from 'react';

interface FoodAlternative {
  category: string;
  original: string;
  swap: string;
  macros: string;
  benefit: string;
}

const LOCAL_SWAPS: FoodAlternative[] = [
  {
    category: 'Protein Swap',
    original: '150g Grilled Chicken (35g P, 165 kcal)',
    swap: '140g Canned Tuna in Water (34g P, 150 kcal)',
    macros: '34g Protein | 0g Carbs | 1g Fat',
    benefit: 'Quick, high-protein alternative with zero cooking needed.'
  },
  {
    category: 'Protein Swap',
    original: '150g Grilled Chicken (35g P, 165 kcal)',
    swap: '200g Cottage Cheese / جبنة قريش (24g P, 190 kcal)',
    macros: '24g Protein | 6g Carbs | 8g Fat',
    benefit: 'Slow-digesting casein protein ideal for dinner or breakfast.'
  },
  {
    category: 'Carb Swap',
    original: '200g Cooked Rice (56g C, 260 kcal)',
    swap: '250g Boiled Potatoes / بطاطس مسلوقة (52g C, 220 kcal)',
    macros: '52g Carbs | 4g Protein | 0g Fat',
    benefit: 'Higher satiety index and rich in potassium for muscle pumps.'
  },
  {
    category: 'Carb Swap',
    original: '200g Cooked Rice (56g C, 260 kcal)',
    swap: '70g Whole Oats / شوفان (46g C, 270 kcal)',
    macros: '46g Carbs | 10g Protein | 5g Fat',
    benefit: 'High fiber content for sustained energy release during workouts.'
  }
];

export default function FoodSwapWidget() {
  const [selectedIdx, setSelectedIdx] = useState(0);

  return (
    <div className="bg-[#141619] border border-white/10 rounded-2xl p-5 space-y-4 shadow-xl">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-xl">🥗</span>
          <div>
            <h4 className="font-bold text-sm text-white">Local Meal & Macro Swapper</h4>
            <p className="text-[10px] text-gray-400">Match your macros with Egyptian & Arab staple foods</p>
          </div>
        </div>

        <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full text-[10px] font-bold uppercase">
          Flexible Dieting
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {LOCAL_SWAPS.map((swap, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedIdx(idx)}
            className={`p-2.5 rounded-xl text-left border transition-all text-xs ${
              selectedIdx === idx
                ? 'bg-blue-600/20 border-blue-500/40 text-white shadow-[0_0_15px_rgba(59,130,246,0.2)]'
                : 'bg-[#0A0B0D] border-white/5 text-gray-400 hover:text-white'
            }`}
          >
            <p className="font-bold truncate">{swap.swap.split('(')[0]}</p>
            <p className="text-[10px] text-gray-500 mt-0.5">{swap.category}</p>
          </button>
        ))}
      </div>

      {/* Selected Swap Card */}
      <div className="bg-[#0A0B0D] border border-white/10 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-red-400 line-through">{LOCAL_SWAPS[selectedIdx].original}</span>
          <span className="text-xs text-gray-400">➡️ Swap to</span>
        </div>

        <p className="font-bold text-emerald-400 text-sm">{LOCAL_SWAPS[selectedIdx].swap}</p>

        <div className="flex items-center justify-between text-xs pt-2 border-t border-white/5 text-gray-300">
          <span className="font-mono text-blue-300">{LOCAL_SWAPS[selectedIdx].macros}</span>
        </div>

        <p className="text-[11px] text-gray-400 italic bg-white/5 p-2 rounded-lg">
          💡 {LOCAL_SWAPS[selectedIdx].benefit}
        </p>
      </div>
    </div>
  );
}
