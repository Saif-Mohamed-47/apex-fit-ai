'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ExerciseGuide, getExerciseGuide, ExerciseAlternativeItem } from '@/lib/exerciseGuides';

export default function ExerciseFormGuideModal({
  exerciseName,
  isOpen,
  onClose,
}: {
  exerciseName: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [selectedVariationId, setSelectedVariationId] = useState<'main' | string>('main');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Reset to 'main' when exercise changes or modal opens
  useEffect(() => {
    setSelectedVariationId('main');
  }, [exerciseName, isOpen]);

  if (!isOpen) return null;

  const guide: ExerciseGuide = getExerciseGuide(exerciseName);
  const activeAlternative: ExerciseAlternativeItem | undefined =
    selectedVariationId !== 'main'
      ? guide.alternatives_list.find((alt) => alt.id === selectedVariationId)
      : undefined;

  const isAlt = !!activeAlternative;
  const currentTitle = isAlt ? activeAlternative.arabic_title : guide.arabic_name;
  const currentEnglishTitle = isAlt ? activeAlternative.title : guide.name;
  const currentImage = isAlt ? activeAlternative.image : guide.image;
  const currentTargetMuscle = isAlt ? activeAlternative.target_muscle : guide.target_muscle;
  const currentSteps = isAlt ? activeAlternative.steps : guide.steps;
  const currentMistakes = isAlt ? activeAlternative.mistakes : guide.mistakes;
  const currentSafetyNote = isAlt ? activeAlternative.safety_note : guide.safety_note;

  const handleSelectVariation = (id: 'main' | string) => {
    setSelectedVariationId(id);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        ref={scrollContainerRef}
        className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-[#0E1013] border border-white/15 rounded-3xl shadow-2xl p-5 sm:p-8 space-y-6 text-white custom-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Title and Close Button */}
        <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30">
                🎬 دليل التكنيك والشكل الحركي
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                isAlt
                  ? activeAlternative.category === 'dumbbell'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
              }`}>
                {isAlt ? activeAlternative.category_label : '🎯 التمرين الأساسي المعتمد'}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">{currentTitle}</h3>
            <p className="text-xs text-gray-400 font-mono">{currentEnglishTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center font-bold text-lg transition-colors shrink-0"
            aria-label="Close form guide"
          >
            ✕
          </button>
        </div>

        {/* Quick Switch Tabs: Main Exercise vs Dumbbell vs Machine Alternatives */}
        {guide.alternatives_list && guide.alternatives_list.length > 0 && (
          <div className="bg-[#141619] p-2 rounded-2xl border border-white/10 space-y-2">
            <div className="flex items-center justify-between px-2 pt-1">
              <span className="text-[11px] font-bold text-gray-400">
                🔀 اختر شكل وتكنيك التمرين الذي تريد رؤيته:
              </span>
              <span className="text-[10px] text-blue-400 font-mono">
                اضغط للتبديل الفوري
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {/* Main Exercise Tab */}
              <button
                type="button"
                onClick={() => handleSelectVariation('main')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border ${
                  selectedVariationId === 'main'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-400 shadow-md shadow-blue-500/20'
                    : 'bg-white/5 hover:bg-white/10 text-gray-300 border-white/5'
                }`}
              >
                <span>🎯</span>
                <span className="truncate">التمرين الأساسي</span>
              </button>

              {/* Alternative Tabs */}
              {guide.alternatives_list.map((alt) => {
                const isActive = selectedVariationId === alt.id;
                const isDumbbell = alt.category === 'dumbbell';
                return (
                  <button
                    key={alt.id}
                    type="button"
                    onClick={() => handleSelectVariation(alt.id)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border ${
                      isActive
                        ? isDumbbell
                          ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white border-amber-400 shadow-md shadow-amber-500/20'
                          : 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white border-cyan-400 shadow-md shadow-cyan-500/20'
                        : 'bg-white/5 hover:bg-white/10 text-gray-300 border-white/5'
                    }`}
                  >
                    <span>{isDumbbell ? '🏋️' : '⚙️'}</span>
                    <span className="truncate">{alt.category_label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* If an alternative is currently active, show a helper banner with back button */}
        {isAlt && (
          <div className="bg-purple-950/30 border border-purple-500/30 rounded-2xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-purple-200">
              <span className="text-base">💡</span>
              <div>
                <span>معروض الآن: </span>
                <strong className="text-white">{activeAlternative.arabic_title}</strong>
                <span className="text-purple-300/80 text-[11px] block sm:inline sm:mr-2">
                  (بديل لـ {guide.arabic_name})
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleSelectVariation('main')}
              className="text-xs px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold transition-all shrink-0"
            >
              ↩️ العودة للتمرين الأساسي
            </button>
          </div>
        )}

        {/* Hero Photo / Visual Demonstration of the EXACT selected Exercise */}
        {currentImage && (
          <div className="relative w-full h-64 sm:h-80 rounded-2xl overflow-hidden border border-white/15 shadow-2xl group bg-[#0A0B0D]">
            <Image
              src={currentImage}
              alt={currentEnglishTitle}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent flex flex-col justify-end p-5">
              <div className="flex items-center gap-2 mb-1">
                <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${
                  isAlt ? 'bg-amber-400' : 'bg-emerald-400'
                }`}></span>
                <span className="text-xs sm:text-sm font-bold text-white drop-shadow-md">
                  {isAlt
                    ? `شكل وتكنيك: ${activeAlternative.arabic_title}`
                    : `شكل وتكنيك الأداء الأساسي: ${guide.arabic_name}`}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-gray-300 drop-shadow">
                {isAlt
                  ? `سبب البديل: ${activeAlternative.why_choose}`
                  : `إيقاع الحركة المقترح: ${guide.tempo}`}
              </p>
            </div>
          </div>
        )}

        {/* Target Muscles and Movement Attributes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-[#141619] p-4 rounded-xl border border-white/5 space-y-1">
            <p className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">🎯 العضلة المستهدفة</p>
            <p className="text-xs text-white font-medium">{currentTargetMuscle}</p>
          </div>
          <div className="bg-[#141619] p-4 rounded-xl border border-white/5 space-y-1">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              {isAlt ? '💡 ميزة هذا البديل' : '💪 العضلات المساعدة'}
            </p>
            <p className="text-xs text-gray-300 font-medium">
              {isAlt ? activeAlternative.why_choose : guide.secondary_muscles}
            </p>
          </div>
        </div>

        {/* Step-by-Step Execution Guide for THIS Specific Exercise */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-black text-white flex items-center gap-2">
              <span>📋</span> خطوات وتكنيك الأداء خطوة بخطوة (Step-by-Step Form)
            </h4>
            <span className="text-[11px] text-gray-400 font-mono">
              {isAlt ? activeAlternative.category_label : 'التكنيك القياسي'}
            </span>
          </div>
          <div className="space-y-2.5">
            {currentSteps.map((step, idx) => (
              <div 
                key={idx} 
                className="bg-[#141619] p-4 rounded-xl border border-white/5 hover:border-blue-500/25 transition-all space-y-1.5"
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center justify-center text-[10px] font-black shrink-0">
                    {idx + 1}
                  </span>
                  <p className="text-xs font-bold text-blue-300">{step.phase}</p>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed pr-7">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Breathing Rhythm (For Main) or Core Tip */}
        <div className="bg-blue-950/25 border border-blue-500/25 rounded-xl p-3.5 text-xs text-blue-200 flex items-start gap-2.5">
          <span className="text-base shrink-0">🫁</span>
          <div>
            <strong className="text-white">طريقة التنفس وضبط الضغط البطني: </strong>
            <span>{isAlt ? 'شهيق عميق عند النزول والإطالة ← زفير قوي ومحكوم عند الدفع أو السحب في أصعب نقطة.' : guide.breathing}</span>
          </div>
        </div>

        {/* Common Mistakes to Avoid (Crucial for injury prevention) */}
        <div className="bg-red-950/25 border border-red-500/25 rounded-2xl p-4 space-y-2.5">
          <h4 className="text-xs font-black text-red-300 flex items-center gap-2">
            <span>⚠️</span> أخطاء شائعة احذر منها في هذا التمرين (Mistakes to Avoid):
          </h4>
          <ul className="space-y-1.5 text-xs text-red-200/90 list-disc list-inside">
            {currentMistakes.map((mistake, idx) => (
              <li key={idx} className="leading-relaxed">
                <span>{mistake}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Coach Pro Safety Note */}
        <div className="bg-emerald-950/25 border border-emerald-500/25 rounded-xl p-3.5 text-xs text-emerald-300 flex items-start gap-2.5">
          <span className="text-base shrink-0">🛡️</span>
          <div>
            <strong className="text-white">نصيحة الكوتش لتفادي الإصابة: </strong>
            <span>{currentSafetyNote}</span>
          </div>
        </div>

        {/* Interactive Alternatives Showcase Section */}
        {guide.alternatives_list && guide.alternatives_list.length > 0 && (
          <div className="space-y-4 border-t border-white/10 pt-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <h4 className="text-base font-black text-white flex items-center gap-2">
                <span>🔄</span> جميع بدائل التمرين (بالدمبل وبالأجهزة مع الصور والشكل)
              </h4>
              <span className="text-[11px] text-gray-400">
                اضغط على أي بديل لتكبير صورته وعرض التكنيك الكامل له بالأعلى
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {guide.alternatives_list.map((alt) => {
                const isCurrent = selectedVariationId === alt.id;
                const isDumbbell = alt.category === 'dumbbell';

                return (
                  <div 
                    key={alt.id} 
                    onClick={() => handleSelectVariation(alt.id)}
                    className={`bg-[#141619] rounded-2xl border cursor-pointer transition-all shadow-xl flex flex-col group overflow-hidden ${
                      isCurrent
                        ? 'border-blue-500 ring-2 ring-blue-500/30'
                        : 'border-white/10 hover:border-white/30 hover:bg-[#181a1e]'
                    }`}
                  >
                    {/* Alternative Image */}
                    <div className="relative w-full h-44 sm:h-48 overflow-hidden bg-[#0A0B0D]">
                      <Image
                        src={alt.image}
                        alt={alt.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border shadow-lg ${
                          isDumbbell
                            ? 'bg-amber-500/30 text-amber-300 border-amber-500/50 backdrop-blur-md'
                            : 'bg-cyan-500/30 text-cyan-300 border-cyan-500/50 backdrop-blur-md'
                        }`}>
                          {alt.category_label}
                        </span>
                      </div>
                      {isCurrent && (
                        <div className="absolute top-2.5 left-2.5">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-500 text-black shadow-lg">
                            ✓ معروض حالياً
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                      <div className="space-y-1">
                        <h5 className="font-bold text-sm text-white group-hover:text-blue-300 transition-colors">
                          {alt.arabic_title}
                        </h5>
                        <p className="text-[11px] text-gray-400 font-mono">
                          {alt.title}
                        </p>
                        <p className="text-xs text-gray-300 mt-2 leading-relaxed">
                          {alt.why_choose}
                        </p>
                      </div>

                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectVariation(alt.id);
                          }}
                          className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                            isCurrent
                              ? 'bg-blue-600 text-white'
                              : 'bg-white/10 hover:bg-white/20 text-blue-300 group-hover:text-white'
                          }`}
                        >
                          <span>{isCurrent ? '✓ التكنيك معروض بالأعلى' : '👁️ عرض شكل وتكنيك هذا التمرين'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="pt-2 flex flex-col sm:flex-row gap-2">
          {isAlt && (
            <button
              onClick={() => handleSelectVariation('main')}
              className="w-full sm:w-1/2 py-3 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 font-bold rounded-xl text-xs transition-all"
            >
              ↩️ العودة لشكل وتكنيك التمرين الأساسي
            </button>
          )}
          <button
            onClick={onClose}
            className={`w-full ${isAlt ? 'sm:w-1/2' : ''} py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs transition-all`}
          >
            فهمت التكنيك، جاهز للتمرين ✓
          </button>
        </div>
      </div>
    </div>
  );
}
