'use client';

import { useState } from 'react';

interface ExportPlanPdfButtonProps {
  user: any;
  nutritionData: any;
  workoutData: any;
}

export default function ExportPlanPdfButton({
  user,
  nutritionData,
  workoutData,
}: ExportPlanPdfButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const isFemale = user?.gender === 'female';
  const targetCalories = nutritionData?.target_calories || 2200;
  const proteinG = nutritionData?.protein_g || 160;
  const carbsG = nutritionData?.carbs_g || 220;
  const fatG = nutritionData?.fat_g || 65;
  const isOverridden = nutritionData?.is_custom_coach_override;

  const handlePrint = () => {
    window.print();
  };

  const schedule = workoutData?.schedule || [];
  const splitName = workoutData?.workout_split || 'Push / Pull / Legs';

  const goalTranslations: Record<string, string> = {
    lose_fat: 'تنشيف وحرق الدهون (Cutting & Fat Loss)',
    gain_muscle: 'تضخيم وبناء عضلات صافية (Lean Bulking)',
    maintain: 'ثبات الوزن وتحسين اللياقة والقوة (Maintenance)',
  };

  const todayDateStr = new Date().toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <>
      {/* Trigger Button on Dashboard */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs flex items-center gap-2 border border-white/15 transition-all shadow-sm shrink-0"
        title="تصدير خطة التمرين والدايت كـ PDF"
      >
        <span>📄</span>
        <span className="hidden sm:inline">تصدير الخطة PDF</span>
        <span className="sm:hidden">PDF</span>
      </button>

      {/* Printable Plan Modal & Print Container */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-[#0E1013] border border-white/15 rounded-3xl shadow-2xl p-5 sm:p-8 space-y-6 text-white custom-scrollbar">
            
            {/* Top Toolbar (Hidden on print) */}
            <div className="no-print flex items-center justify-between pb-4 border-b border-white/10 gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">📄</span>
                <div>
                  <h3 className="font-black text-lg text-white">معاينة ملف الـ PDF الرياضي</h3>
                  <p className="text-xs text-gray-400">احفظ نسختك المطبوعة أو حمّلها على موبايلك بضغطة واحدة</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black rounded-xl text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2"
                >
                  <span>🖨️</span>
                  <span>طباعة / حفظ كـ PDF الآن</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center font-bold text-lg transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Printable Document Body */}
            <div id="apex-printable-plan" className="space-y-6 p-4 sm:p-6 bg-[#121418] rounded-2xl border border-white/10 text-white">
              
              {/* Document Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-white/15 gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                      APEX FIT AI
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40">
                      خطة رياضية معتمدة
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                    البرنامج التدريبي والغذائي المتكامل
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    تاريخ الإصدار: {todayDateStr} | كود المتدرب: #{user?.id || 'APEX-101'}
                  </p>
                </div>

                <div className="bg-[#0A0B0D] p-3 rounded-xl border border-white/10 text-right space-y-0.5 min-w-[180px]">
                  <p className="text-xs font-bold text-white">المتدرب: {user?.email?.split('@')[0] || 'البطل'}</p>
                  <p className="text-[11px] text-gray-300">الوزن: {user?.weight_kg || 80} كجم | الطول: {user?.height_cm || 178} سم</p>
                  <p className="text-[11px] text-blue-400 font-semibold">{goalTranslations[user?.goal] || user?.goal || 'تنشيف'}</p>
                </div>
              </div>

              {/* Section 1: Nutrition & Macros Targets */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-base text-white flex items-center gap-2">
                    <span>🥗</span> خطة التغذية والماكروز اليومية (Daily Nutrition & Macros)
                  </h4>
                  {isOverridden && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      ✓ معدلة بمعرفة الكوتش الخاص
                    </span>
                  )}
                </div>

                {/* Macro Badges Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-[#1A1D24] p-3.5 rounded-xl border border-white/10 text-center">
                    <p className="text-2xl font-black text-white">{targetCalories}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">السعرات (KCAL)</p>
                  </div>
                  <div className="bg-[#1A1D24] p-3.5 rounded-xl border border-blue-500/30 text-center">
                    <p className="text-2xl font-black text-blue-400">{proteinG}g</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">البروتين (PROTEIN)</p>
                  </div>
                  <div className="bg-[#1A1D24] p-3.5 rounded-xl border border-amber-500/30 text-center">
                    <p className="text-2xl font-black text-amber-300">{carbsG}g</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">الكارب (CARBS)</p>
                  </div>
                  <div className="bg-[#1A1D24] p-3.5 rounded-xl border border-emerald-500/30 text-center">
                    <p className="text-2xl font-black text-emerald-400">{fatG}g</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">الدهون الصحية (FAT)</p>
                  </div>
                </div>

                {/* Nutrition Cues */}
                <div className="bg-[#0A0B0D] p-3.5 rounded-xl border border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-300">
                  <div>• <strong>توزيع الوجبات:</strong> 3 وجبات رئيسية + وجبة سناك / بعد التمرين مع 30-40 جم بروتين بكل وجبة.</div>
                  <div>• <strong>شرب الماء:</strong> 3.5 إلى 4 لتر يومياً لضمان كفاءة الحرق ونقل المغذيات العضلية.</div>
                </div>
              </div>

              {/* Section 2: Complete Workout Routine */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-base text-white flex items-center gap-2">
                    <span>🏋️</span> جدول التمارين المخصص ({splitName})
                  </h4>
                  <span className="text-xs text-gray-400 font-mono">
                    {user?.days_per_week || 4} أيام تدريب أسبوعياً
                  </span>
                </div>

                <div className="space-y-4">
                  {schedule.map((day: any, dIdx: number) => (
                    <div key={dIdx} className="bg-[#181B21] rounded-xl border border-white/10 overflow-hidden">
                      <div className="bg-[#20242C] px-4 py-2.5 flex items-center justify-between border-b border-white/10">
                        <span className="font-bold text-sm text-white">
                          اليوم {dIdx + 1}: {day.day_name} ({day.focus})
                        </span>
                        <span className="text-[11px] text-blue-300 font-mono">
                          {day.exercises?.length || 0} تمارين
                        </span>
                      </div>

                      <div className="p-3">
                        <table className="w-full text-right text-xs">
                          <thead>
                            <tr className="text-gray-400 border-b border-white/10 pb-2">
                              <th className="py-1.5 font-bold">التمرين</th>
                              <th className="py-1.5 font-bold">العضلة المستهدفة</th>
                              <th className="py-1.5 font-bold">المجموعات والتكرارات</th>
                              <th className="py-1.5 font-bold">البديل المتاح (دمبل / جهاز)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                            {day.exercises?.map((ex: any, eIdx: number) => (
                              <tr key={eIdx} className="hover:bg-white/5">
                                <td className="py-2.5 font-bold text-white">{ex.exercise_name}</td>
                                <td className="py-2.5 text-gray-300">{ex.target_muscle}</td>
                                <td className="py-2.5 font-mono text-blue-300 font-bold">{ex.sets_reps}</td>
                                <td className="py-2.5 text-purple-300/90 text-[11px]">{ex.alternative || 'تمرين بديل متاح'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 3: Coach Safety & Recovery Commandments */}
              <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-4 text-xs space-y-1.5 text-emerald-200">
                <p className="font-bold text-emerald-300 flex items-center gap-1.5">
                  <span>🛡️</span> وصايا الكوتش للاستشفاء وزيادة الكتلة العضلية بأمان:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px] text-gray-300">
                  <div>1. <strong>النوم العميق:</strong> 7 إلى 8.5 ساعات ليلاً لإفراز هرمون النمو والاستشفاء.</div>
                  <div>2. <strong>الزيادة التدريجية:</strong> زود وزناً أو تكراراً واحداً أسبوعياً فقط مع تثبيت التكنيك.</div>
                  <div>3. <strong>الراحة بين المجموعات:</strong> 90 إلى 120 ثانية في التمارين المركبة للحفاظ على القوة.</div>
                </div>
              </div>

              {/* Document Footer */}
              <div className="pt-4 border-t border-white/10 flex justify-between items-center text-[10px] text-gray-400">
                <span>Apex Fit AI Platform — All Rights Reserved 2026</span>
                <span>Generated by AI Coach System & Certified Training Engine</span>
              </div>
            </div>

            {/* Bottom Actions (Hidden on Print) */}
            <div className="no-print pt-2 flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="w-full sm:w-1/2 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs transition-all shadow-lg"
              >
                🖨️ حفظ وتنزيل كـ PDF الآن
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-full sm:w-1/2 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs transition-all"
              >
                إغلاق المعاينة
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
