import { authenticatedFetch } from '@/lib/api';
import Image from 'next/image';
import MealForm from '@/components/MealForm';
import LogoutButton from '@/components/LogoutButton';
import WorkoutSection from '@/components/WorkoutSection';
import ChatWidget from '@/components/ChatWidget';
import ScrollToWorkoutButton from '@/components/ScrollToWorkoutButton';
import RestTimer from '@/components/RestTimer';
import WarmUpCalculator from '@/components/WarmUpCalculator';
import FoodSwapWidget from '@/components/FoodSwapWidget';
import Link from 'next/link';
import ApexLogo from '@/components/ApexLogo';
import ExportPlanPdfButton from '@/components/ExportPlanPdfButton';
import PricingModal from '@/components/PricingModal';

export const dynamic = 'force-dynamic';

async function getDashboardData() {
  const today = new Date().toLocaleDateString('en-CA'); 
  
  const [workoutRes, mealsRes, nutritionRes, userRes, checkInsRes] = await Promise.all([
    authenticatedFetch('/workout-recommendation/'),
    authenticatedFetch(`/meals/?date=${today}`), 
    authenticatedFetch('/nutrition-target/'),
    authenticatedFetch('/users/me'),
    authenticatedFetch('/check-ins/'),
  ]);
  
  const workoutData = workoutRes.ok ? await workoutRes.json() : null;
  const meals = mealsRes.ok ? await mealsRes.json() : [];
  const nutritionData = nutritionRes.ok ? await nutritionRes.json() : null;
  const user = userRes.ok ? await userRes.json() : null;
  const checkIns = checkInsRes.ok ? await checkInsRes.json() : [];
  
  return { workoutData, meals, nutritionData, user, checkIns };
}

export default async function DashboardPage() {
  const { workoutData, meals, nutritionData, user, checkIns } = await getDashboardData();
  const totalCalories = meals.reduce((sum: number, m: any) => sum + m.calories, 0);
  const remainingCalories = nutritionData ? Math.max(nutritionData.target_calories - totalCalories, 0) : 0;
  const caloriePercentage = nutritionData ? Math.min((totalCalories / nutritionData.target_calories) * 100, 100) : 0;

  const latestCheckIn = checkIns.length > 0 ? checkIns[0] : null;
  const currentWeight = latestCheckIn ? latestCheckIn.weight_kg : (user?.weight_kg || 0);
  const startWeight = user?.weight_kg || currentWeight;
  const weightDelta = +(currentWeight - startWeight).toFixed(1);

  const isFemale = user?.gender === 'female';
  const focusDay = workoutData?.schedule[workoutData.today_focus_index];

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 space-y-8 pb-20">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <ApexLogo size="md" showText={false} />
          <div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
              isFemale
                ? 'bg-pink-500/20 text-pink-300 border-pink-500/30'
                : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
            }`}>
              {isFemale ? '🌸 Woman Athlete' : '⚡ Man Athlete'}
            </span>
            <h1 className="font-heading text-3xl md:text-4xl mt-1">Apex Fit AI</h1>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-end">
          <PricingModal currentCoachId={user?.coach_id} />
          <ExportPlanPdfButton 
            user={user} 
            nutritionData={nutritionData} 
            workoutData={workoutData} 
          />
          <Link 
            href="/dashboard/check-in"
            className="px-3.5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all"
          >
            📝 Weekly Check-in
          </Link>
          <LogoutButton />
        </div>
      </div>

      {/* Trainee Profile & Gender Specialization Banner */}
      <div className={`p-6 rounded-3xl border flex flex-col sm:flex-row items-center gap-6 backdrop-blur-xl transition-all ${
        isFemale
          ? 'bg-gradient-to-r from-pink-950/30 via-[#141619] to-purple-950/20 border-pink-500/30 shadow-[0_0_25px_rgba(236,72,153,0.15)]'
          : 'bg-gradient-to-r from-blue-950/30 via-[#141619] to-indigo-950/20 border-blue-500/30 shadow-[0_0_25px_rgba(59,130,246,0.15)]'
      }`}>
        <div className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 shrink-0 ${
          isFemale ? 'border-pink-500/50 shadow-[0_0_20px_rgba(236,72,153,0.3)]' : 'border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.3)]'
        }`}>
          <Image 
            src={isFemale ? '/images/female_trainee_workout.jpg' : '/images/trainee_workout.jpg'}
            alt="Trainee Athlete"
            fill
            className="object-cover"
          />
        </div>
        <div className="space-y-1 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h2 className="text-xl font-black text-white">
              {isFemale ? 'برنامج نحت وتناسق القوام (Female Sculpt & Tone)' : 'برنامج تضخيم وبناء القوة (Hypertrophy & Strength)'}
            </h2>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
              isFemale ? 'bg-pink-500/20 text-pink-300' : 'bg-blue-500/20 text-blue-300'
            }`}>
              {workoutData?.split || 'Custom Split'}
            </span>
          </div>
          <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
            {isFemale 
              ? 'مصمم خصيصاً للتركيز على نحت عضلات الجزء السفلي (الأرداف والفخذين)، تقوية الكور والظهر، وتحقيق الرشاقة المتناسقة.'
              : 'مصمم خصيصاً لزيادة الأحمال التدريجية في التمارين المركبة، تضخيم عضلات الصدر والظهر والأكتاف، وبناء قوة بدنية جبارة.'}
          </p>
        </div>
      </div>

      {/* Weekly Progress & Health Tracker Card */}
      <section className="bg-gradient-to-r from-[#141619] via-[#171A21] to-[#141619] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30">
                Weekly Progress Tracker
              </span>
              <span className="text-gray-400 text-xs">متابعة التطور الأسبوعي</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1">تطور الوزن وأداء التمرين بعد أسبوع</h2>
          </div>
          <Link
            href="/dashboard/check-in"
            className="self-start sm:self-auto px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)]"
          >
            📊 تحديث تقرير الأسبوع (Check-in)
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Metric 1: Body Weight Delta */}
          <div className="bg-[#0A0B0D] p-4 rounded-2xl border border-white/5 space-y-2">
            <p className="text-gray-400 text-xs font-semibold">تطور وزن الجسم (Weight Delta)</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-white">{currentWeight} kg</span>
              {weightDelta !== 0 && (
                <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                  weightDelta < 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'
                }`}>
                  {weightDelta > 0 ? `+${weightDelta} kg` : `${weightDelta} kg`}
                </span>
              )}
            </div>
            <p className="text-[11px] text-gray-500">
              وزن البداية: {startWeight} kg • {checkIns.length} تقارير مسجلة
            </p>
          </div>

          {/* Metric 2: Calorie Target & Deficit */}
          <div className="bg-[#0A0B0D] p-4 rounded-2xl border border-white/5 space-y-2">
            <p className="text-gray-400 text-xs font-semibold">معدل الحرق والسعرات (Daily Energy)</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-white">{nutritionData?.target_calories || 0}</span>
              <span className="text-xs text-gray-400">kcal/يوم</span>
            </div>
            <p className="text-[11px] text-gray-500">
              {user?.goal === 'lose_fat' 
                ? '🔥 عجز -500 سعرة لحرق الدهون' 
                : user?.goal === 'gain_muscle' 
                ? '⚡ فائض +300 سعرة لبناء العضلات' 
                : '⚖️ توازن كامل لتثبيت الوزن'}
            </p>
          </div>

          {/* Metric 3: Weekly Sleep & Recovery */}
          <div className="bg-[#0A0B0D] p-4 rounded-2xl border border-white/5 space-y-2">
            <p className="text-gray-400 text-xs font-semibold">الاستشفاء والنوم (Weekly Sleep)</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-white">
                {latestCheckIn?.sleep_hours ? `${latestCheckIn.sleep_hours} hrs` : '7.5 hrs'}
              </span>
              <span className="text-xs text-emerald-400 font-bold">Good</span>
            </div>
            <p className="text-[11px] text-gray-500">
              طاقة: {latestCheckIn?.energy_rating || 4}/5 • إجهاد: {latestCheckIn?.soreness_rating || 2}/5
            </p>
          </div>

          {/* Metric 4: Progressive Overload Status */}
          <div className="bg-[#0A0B0D] p-4 rounded-2xl border border-white/5 space-y-2">
            <p className="text-gray-400 text-xs font-semibold">تطور أوزان التمرين (Strength Overload)</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-emerald-400">+2.5 ~ 5kg</span>
              <span className="text-xs text-gray-400">Adaptive</span>
            </div>
            <p className="text-[11px] text-gray-500">
              اضغط View Progress على أي تمرين لرؤية المنحنى
            </p>
          </div>
        </div>
      </section>
      
      {workoutData && focusDay && (
        <section className="bg-[#141619] border border-[rgba(255,255,255,0.08)] rounded-2xl p-8 flex justify-between items-center">
            <div>
                <h2 className="font-heading text-xl mb-1">Today's Focus</h2>
                <p className="text-white font-bold">{focusDay.day} - {focusDay.exercises.length} exercises</p>
                <ScrollToWorkoutButton targetId="workout-section" />
            </div>
            <div className="text-right">
                <p className="text-gray-400 text-sm">Remaining Calories</p>
                <p className="font-black text-5xl text-white">{remainingCalories}</p>
            </div>
        </section>
      )}

      {/* Trainee Interactive Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RestTimer />
        <WarmUpCalculator />
      </div>

      {workoutData && (
        <div id="workout-section">
            <WorkoutSection 
                schedule={workoutData.schedule} 
                split={workoutData.split} 
                initialDayIndex={workoutData.today_focus_index} 
            />
        </div>
      )}

      {nutritionData && (
        <section className="bg-[#141619] border border-[rgba(255,255,255,0.08)] rounded-2xl p-8 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="font-heading text-xl">Daily Calories</h2>
              {nutritionData.is_custom_coach_override && (
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-bold uppercase tracking-wider">
                  📋 Coach Custom Plan
                </span>
              )}
            </div>

            <div className="flex items-baseline gap-2">
                <span className="font-black text-5xl text-white">{totalCalories}</span>
                <span className="text-gray-400">/ {nutritionData.target_calories} kcal</span>
            </div>
            
            <div className="h-3 w-full bg-[#0A0B0D] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#3B82F6] to-[#60A5FA]" style={{ width: `${caloriePercentage}%` }}></div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4">
                {[
                    { label: 'PROTEIN', value: `${nutritionData.protein_g}G` },
                    { label: 'CARBS', value: `${nutritionData.carbs_g}G` },
                    { label: 'FAT', value: `${nutritionData.fat_g}G` },
                ].map(macro => (
                    <div key={macro.label} className="bg-[#1A1D21] p-4 rounded-xl text-center">
                        <p className="font-black text-lg text-white">{macro.value}</p>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest">{macro.label}</p>
                    </div>
                ))}
            </div>
        </section>
      )}

      <FoodSwapWidget />
      
      <MealForm />
      <ChatWidget userGender={user?.gender || 'male'} coachGender={isFemale ? 'female' : 'male'} />
    </div>
  );
}
