'use client';
import { useState } from 'react';
import WorkoutLogger from './WorkoutLogger';
import ProgressChart from './ProgressChart';
import ExerciseFormGuideModal from './ExerciseFormGuideModal';
import { getIcon } from '@/lib/exerciseIcons';

export default function WorkoutSection({ 
  schedule, 
  split, 
  initialDayIndex = 0 
}: { 
  schedule: any[], 
  split: string, 
  initialDayIndex?: number 
}) {
  const [activeDayIndex, setActiveDayIndex] = useState(initialDayIndex);
  const [expandedExercise, setExpandedExercise] = useState<string | null>(null);
  const [expandedProgress, setExpandedProgress] = useState<string | null>(null);
  const [selectedGuideExercise, setSelectedGuideExercise] = useState<string | null>(null);

  if (!schedule || schedule.length === 0) return <p className="text-gray-400">Unable to load workout plan.</p>;

  return (
    <div className="bg-[#141619] border border-[rgba(255,255,255,0.08)] rounded-2xl p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h2 className="font-heading text-2xl text-white">Workout: {split}</h2>
        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-bold">
          🛡️ Form & Safety Verified
        </span>
      </div>

      {/* Safety & Injury Prevention Guidance Banner */}
      <div className="p-3.5 rounded-xl bg-blue-950/20 border border-blue-500/20 text-xs text-blue-200 flex items-start gap-2.5">
        <span className="text-base shrink-0">💡</span>
        <div className="leading-relaxed">
          <strong className="text-white">بروتوكول الأمان وتجنب الإصابات: </strong>
          احرص دائماً على أداء مجموعتين تسخين تصاعدي بأوزان خفيفة قبل أول تمرين مركب، مع الحفاظ على استقامة العمود الفقري وثبات الكور (Core Bracing).
        </div>
      </div>
      
      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {schedule.map((day, i) => (
          <button
            key={i}
            onClick={() => setActiveDayIndex(i)}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
              activeDayIndex === i 
                ? 'bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]' 
                : 'bg-[#1A1D21] text-gray-400 hover:text-white'
            }`}
          >
            {day.day}
          </button>
        ))}
      </div>

      {/* Exercises */}
      <div className="space-y-4">
        {schedule[activeDayIndex].exercises.map((ex: any, j: number) => {
          const IconComponent = getIcon(ex.exercise_name);
          return (
            <div key={j} className="bg-[#1A1D21] p-5 rounded-2xl border border-[rgba(255,255,255,0.06)] hover:border-blue-500/30 transition-all space-y-3">
              <div className="flex justify-between items-center cursor-pointer" onClick={() => setExpandedExercise(expandedExercise === ex.exercise_name ? null : ex.exercise_name)}>
                <div className="flex items-center gap-3">
                  <div className="text-[#3B82F6] w-9 h-9 flex items-center justify-center bg-blue-500/10 rounded-xl">
                    <IconComponent />
                  </div>
                  <div>
                    <p className="font-bold text-white text-base">{ex.exercise_name}</p>
                    <p className="text-[11px] text-gray-400 uppercase tracking-wider">{ex.target_muscle}</p>
                  </div>
                </div>
                <div className="text-right flex items-center gap-2 sm:gap-3 flex-wrap justify-end">
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedGuideExercise(ex.exercise_name);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/15 hover:bg-blue-500/25 text-blue-300 border border-blue-500/30 text-xs font-bold transition-all shadow-sm"
                  >
                    <span>🎬</span>
                    <span className="hidden sm:inline">شكل وتكنيك التمرين</span>
                    <span className="sm:hidden">التكنيك</span>
                  </button>
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedProgress(expandedProgress === ex.exercise_name ? null : ex.exercise_name);
                    }}
                    className="text-xs text-[#3B82F6] hover:text-white transition-colors underline decoration-blue-500/40"
                  >
                    {expandedProgress === ex.exercise_name ? 'Hide Progress' : 'View Progress'}
                  </button>
                  <p className="font-black text-lg text-white bg-white/5 px-3 py-1 rounded-lg border border-white/5">{ex.sets_reps}</p>
                </div>
              </div>

              {/* Form, Alternative & Injury Prevention Guidance */}
              {(ex.tip || ex.starting_weight_note || ex.alternative) && (
                <div className="pt-2.5 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                  {ex.tip && (
                    <div className="flex items-center gap-2 text-emerald-300/90 bg-emerald-950/20 px-2.5 py-1.5 rounded-lg border border-emerald-500/20">
                      <span>🛡️</span>
                      <span><strong>تكنيك الأمان:</strong> {ex.tip}</span>
                    </div>
                  )}
                  {ex.starting_weight_note && (
                    <div className="flex items-center gap-2 text-amber-300/90 bg-amber-950/20 px-2.5 py-1.5 rounded-lg border border-amber-500/20">
                      <span>⚖️</span>
                      <span><strong>الوزن المناسب:</strong> {ex.starting_weight_note}</span>
                    </div>
                  )}
                  {ex.alternative && (
                    <div className="md:col-span-2 flex items-center justify-between gap-2 text-purple-300/90 bg-purple-950/20 px-3 py-2 rounded-lg border border-purple-500/20">
                      <div className="flex items-center gap-2">
                        <span>🔄</span>
                        <span><strong>البدائل المتاحة (دمبل / جهاز):</strong> {ex.alternative}</span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedGuideExercise(ex.exercise_name);
                        }}
                        className="text-[11px] font-bold text-purple-300 hover:text-white underline shrink-0 transition-colors"
                      >
                        عرض صور وتكنيك البدائل ↗
                      </button>
                    </div>
                  )}
                </div>
              )}

              {expandedExercise === ex.exercise_name && (
                <WorkoutLogger exercise_name={ex.exercise_name} />
              )}
              {expandedProgress === ex.exercise_name && (
                <ProgressChart exercise_name={ex.exercise_name} />
              )}
            </div>
          );
        })}
      </div>

      {/* Exercise Form & Technique Modal */}
      {selectedGuideExercise && (
        <ExerciseFormGuideModal
          exerciseName={selectedGuideExercise}
          isOpen={!!selectedGuideExercise}
          onClose={() => setSelectedGuideExercise(null)}
        />
      )}
    </div>
  );
}
