'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';

type OnboardingData = {
  email: string;
  password: string;
  role: 'client' | 'coach';
  coach_invite_code?: string;
  age: number | '';
  weight_kg: number | '';
  height_cm: number | '';
  gender: 'male' | 'female' | '';
  goal: string;
  activity_level: string;
  training_experience_months: number | '';
  days_per_week: number | '';
};

export default function SignupSteps() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<OnboardingData>({
    email: '',
    password: '',
    role: 'client',
    coach_invite_code: '',
    age: '',
    weight_kg: '',
    height_cm: '',
    gender: '',
    goal: 'maintain',
    activity_level: 'moderate',
    training_experience_months: '',
    days_per_week: '',
  });

  const handleUpdate = (field: keyof OnboardingData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateStep1Client = () => {
    const { email, password, age, weight_kg, height_cm, gender } = formData;
    if (!email || !password || age === '' || weight_kg === '' || height_cm === '' || !gender) {
      toast.error('All fields (Email, Password, Age, Weight, Height, Gender) are required.');
      return false;
    }
    if (password.length > 72) {
      toast.error('Password must be 72 characters or less.');
      return false;
    }
    if (typeof age !== 'number' || age < 13 || age > 100) {
      toast.error('Please enter a valid age (13-100).');
      return false;
    }
    return true;
  };

  const validateStep2Client = () => {
    const { training_experience_months, days_per_week } = formData;
    if (training_experience_months === '' || days_per_week === '') {
      toast.error('Please enter training experience and available days.');
      return false;
    }
    if (typeof training_experience_months !== 'number' || training_experience_months < 0) {
      toast.error('Experience must be 0 or greater.');
      return false;
    }
    if (typeof days_per_week !== 'number' || days_per_week < 1 || days_per_week > 7) {
      toast.error('Days per week must be between 1 and 7.');
      return false;
    }
    return true;
  };

  // Trainee Submission Flow
  const handleClientSubmit = async () => {
    if (!validateStep2Client()) return;
    
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success('Account created! Welcome to Apex Fit AI.');
        window.location.href = '/dashboard';
      } else {
        const err = await res.json();
        toast.error(err.error || 'Signup failed');
      }
    } catch {
      toast.error('Network error during registration, please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Coach Fast-Track 1-Step Submission Flow
  const handleCoachSubmit = async () => {
    if (!formData.email || !formData.password || !formData.gender) {
      toast.error('Coach Email, Password, and Coach Type (Man / Woman) are required.');
      return;
    }

    setIsSubmitting(true);
    try {
      const coachPayload = {
        ...formData,
        role: 'coach',
        age: formData.age || 30,
        weight_kg: formData.weight_kg || 75,
        height_cm: formData.height_cm || 175,
        goal: 'maintain',
        activity_level: 'active',
        training_experience_months: 24,
        days_per_week: 5,
      };

      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(coachPayload),
      });

      if (res.ok) {
        toast.success('Coach account created! Welcome to Coach Portal.');
        window.location.href = '/coach/dashboard';
      } else {
        const err = await res.json();
        toast.error(err.error || 'Coach signup failed');
      }
    } catch {
      toast.error('Network error during coach registration, please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Role Selector Tabs */}
      <div className="flex gap-2 p-1.5 bg-[#0A0B0D] rounded-2xl border border-white/10 shadow-inner">
        <button
          type="button"
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            formData.role === 'client' 
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]' 
              : 'text-gray-400 hover:text-white'
          }`}
          onClick={() => {
            handleUpdate('role', 'client');
            setStep(1);
          }}
        >
          🏃 Trainee / المتدرب
        </button>
        <button
          type="button"
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            formData.role === 'coach' 
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]' 
              : 'text-gray-400 hover:text-white'
          }`}
          onClick={() => {
            handleUpdate('role', 'coach');
            setStep(1);
          }}
        >
          📋 Head Coach / المدرب
        </button>
      </div>

      {/* COACH REGISTRATION (Streamlined 1-Step) */}
      {formData.role === 'coach' ? (
        <div className="space-y-4">
          <div className="bg-indigo-950/20 border border-indigo-500/25 p-3.5 rounded-2xl text-xs text-indigo-200">
            <p className="font-bold mb-0.5">👑 تسجيل حساب كابتن مدرب / مدربة</p>
            <p className="text-gray-400 text-[11px] leading-relaxed">
              سجل حسابك كمدرب لإدارة المتدربين، إصدار كود الدعوة، وتحديد الماكروز والجداول الرياضية.
            </p>
          </div>

          <input 
            type="email" 
            placeholder="Coach Email / إيميل الكابتن" 
            value={formData.email} 
            className="w-full bg-[#0A0B0D] border border-white/10 text-white rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
            onChange={(e) => handleUpdate('email', e.target.value)} 
          />

          <input 
            type="password" 
            placeholder="Password / كلمة المرور" 
            maxLength={72} 
            value={formData.password} 
            className="w-full bg-[#0A0B0D] border border-white/10 text-white rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
            onChange={(e) => handleUpdate('password', e.target.value)} 
          />

          <div>
            <label className="block text-[11px] text-gray-400 font-bold uppercase mb-1.5">Coach Persona / نوع المدرب</label>
            <div className="flex bg-[#0A0B0D] border border-white/10 rounded-xl p-1 gap-2">
              <button
                type="button"
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  formData.gender === 'male' ? 'bg-blue-600 text-white shadow-[0_0_10px_rgba(59,130,246,0.4)]' : 'text-gray-400 hover:text-white'
                }`}
                onClick={() => handleUpdate('gender', 'male')}
              >
                👨 Man Coach (كابتن مدرب)
              </button>
              <button
                type="button"
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  formData.gender === 'female' ? 'bg-pink-600 text-white shadow-[0_0_10px_rgba(236,72,153,0.4)]' : 'text-gray-400 hover:text-white'
                }`}
                onClick={() => handleUpdate('gender', 'female')}
              >
                👩 Woman Coach (كابتن مدربة)
              </button>
            </div>
          </div>

          <button 
            type="button"
            onClick={handleCoachSubmit}
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl p-3.5 mt-2 transition-all shadow-[0_0_20px_rgba(99,102,241,0.4)] flex items-center justify-center gap-2"
          >
            {isSubmitting ? 'جاري إنشاء الحساب...' : '🚀 Create Coach Account (إنشاء حساب المدرب)'}
          </button>
        </div>
      ) : step === 1 ? (
        /* TRAINEE STEP 1: Basic Info */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-200">الخطوة 1 من 2: بيانات الحساب والجسم</h3>
            <span className="text-[11px] text-blue-400 font-mono">Step 1/2</span>
          </div>

          <input 
            type="email" 
            placeholder="Email / البريد الإلكتروني" 
            value={formData.email} 
            className="w-full bg-[#0A0B0D] border border-white/10 text-white rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
            onChange={(e) => handleUpdate('email', e.target.value)} 
          />

          <input 
            type="password" 
            placeholder="Password / كلمة المرور" 
            maxLength={72} 
            value={formData.password} 
            className="w-full bg-[#0A0B0D] border border-white/10 text-white rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
            onChange={(e) => handleUpdate('password', e.target.value)} 
          />

          <input 
            type="text" 
            placeholder="كود دعوة الكابتن (اختياري e.g. COACH-XXXX)" 
            value={formData.coach_invite_code} 
            className="w-full bg-[#0A0B0D] border border-blue-500/30 text-blue-300 placeholder-gray-500 rounded-xl p-3 text-xs focus:ring-2 focus:ring-blue-500 outline-none" 
            onChange={(e) => handleUpdate('coach_invite_code', e.target.value)} 
          />

          <div className="grid grid-cols-2 gap-3">
            <input 
              type="number" 
              placeholder="العمر (Age)" 
              value={formData.age} 
              className="bg-[#0A0B0D] border border-white/10 text-white rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
              onChange={(e) => handleUpdate('age', e.target.value === '' ? '' : parseInt(e.target.value))} 
            />

            <div className="flex bg-[#0A0B0D] border border-white/10 rounded-xl p-1 gap-1">
              <button
                type="button"
                className={`flex-1 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                  formData.gender === 'male' ? 'bg-blue-600 text-white shadow-[0_0_10px_rgba(59,130,246,0.4)]' : 'text-gray-400 hover:text-white'
                }`}
                onClick={() => handleUpdate('gender', 'male')}
              >
                👨 Man
              </button>
              <button
                type="button"
                className={`flex-1 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                  formData.gender === 'female' ? 'bg-pink-600 text-white shadow-[0_0_10px_rgba(236,72,153,0.4)]' : 'text-gray-400 hover:text-white'
                }`}
                onClick={() => handleUpdate('gender', 'female')}
              >
                👩 Woman
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input 
              type="number" 
              placeholder="الوزن (Weight kg)" 
              value={formData.weight_kg} 
              className="bg-[#0A0B0D] border border-white/10 text-white rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
              onChange={(e) => handleUpdate('weight_kg', e.target.value === '' ? '' : parseFloat(e.target.value))} 
            />
            <input 
              type="number" 
              placeholder="الطول (Height cm)" 
              value={formData.height_cm} 
              className="bg-[#0A0B0D] border border-white/10 text-white rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
              onChange={(e) => handleUpdate('height_cm', e.target.value === '' ? '' : parseFloat(e.target.value))} 
            />
          </div>

          <button 
            type="button"
            onClick={() => validateStep1Client() && setStep(2)}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl p-3.5 mt-2 transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)] flex items-center justify-center gap-2"
          >
            التالي: الهدف والتمرين (Next Step) →
          </button>
        </div>
      ) : (
        /* TRAINEE STEP 2: Goals & Activity */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-200">الخطوة 2 من 2: الهدف ومعدل النشاط والتفرغ</h3>
            <span className="text-[11px] text-blue-400 font-mono">Step 2/2</span>
          </div>

          {/* Goal Selector */}
          <div>
            <label className="block text-xs text-gray-400 font-bold uppercase mb-1">🎯 الهدف الرياضي (Fitness Goal)</label>
            <select 
              className="w-full bg-[#0A0B0D] border border-white/10 text-white rounded-xl p-3 text-xs md:text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
              value={formData.goal} 
              onChange={(e) => handleUpdate('goal', e.target.value)}
            >
              <option value="lose_fat">🔥 تنشيف وخسارة دهون (Lose Fat / Cut) • عجز 500 سعرة + حماية العضلات</option>
              <option value="gain_muscle">⚡ تضخيم وبناء عضلات (Gain Muscle / Bulk) • فائض 300 سعرة للبناء الصافي</option>
              <option value="maintain">⚖️ ثبات وتحسين اللياقة (Maintain Weight) • توازن سعرات الـ TDEE</option>
            </select>
          </div>

          {/* Activity Level Selector */}
          <div>
            <label className="block text-xs text-gray-400 font-bold uppercase mb-1">🏃 مستوى النشاط اليومي لحساب الحرق (TDEE)</label>
            <select 
              className="w-full bg-[#0A0B0D] border border-white/10 text-white rounded-xl p-3 text-xs md:text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
              value={formData.activity_level} 
              onChange={(e) => handleUpdate('activity_level', e.target.value)}
            >
              <option value="sedentary">🪑 خامل (Sedentary) • عمل مكتبي وقليل الحركة (1.2×)</option>
              <option value="light">🚶 نشاط خفيف (Lightly Active) • تمرين خفيف 1-3 أيام أسبوعياً (1.375×)</option>
              <option value="moderate">🏃 نشاط متوسط (Moderately Active) • تمرين 3-5 أيام أسبوعياً (1.55×)</option>
              <option value="active">🔥 نشاط عالي (Very Active) • تمرين شاق 6-7 أيام أسبوعياً (1.725×)</option>
              <option value="extreme">⚡ نشاط فائق (Extremely Active) • تدريب شاق مرتين يومياً (1.9×)</option>
            </select>
          </div>

          {/* Experience in months */}
          <div>
            <label className="block text-xs text-gray-400 font-bold uppercase mb-1">
              💪 خبرتك في الجيم بالشهور (Experience in Months)
            </label>
            <input 
              type="number" 
              min={0}
              placeholder="مثال: 6 شهور (0-6 مبتدئ، 6-18 متوسط، 18+ متقدم)" 
              value={formData.training_experience_months} 
              className="w-full bg-[#0A0B0D] border border-white/10 text-white rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
              onChange={(e) => handleUpdate('training_experience_months', e.target.value === '' ? '' : parseInt(e.target.value))} 
            />
            <p className="text-[10px] text-gray-500 mt-1">يحدد مستوى التمارين: المبتدئ يركز على التكنيك، المتقدم يركز على زيادة الأحمال.</p>
          </div>

          {/* Days available */}
          <div>
            <label className="block text-xs text-gray-400 font-bold uppercase mb-1">
              📅 أيام التفرغ المتاحة للتمرين أسبوعياً (Days / Week)
            </label>
            <input 
              type="number" 
              min={1} 
              max={7}
              placeholder="مثال: 3 أو 4 أو 5 أيام في الأسبوع" 
              value={formData.days_per_week} 
              className="w-full bg-[#0A0B0D] border border-white/10 text-white rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
              onChange={(e) => handleUpdate('days_per_week', e.target.value === '' ? '' : parseInt(e.target.value))} 
            />
            <p className="text-[10px] text-gray-500 mt-1">
              2-3 أيام: Full Body • 4 أيام: Upper/Lower • 5-6 أيام: Push/Pull/Legs
            </p>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-3 pt-2">
            <button 
              type="button"
              onClick={() => setStep(1)} 
              className="w-1/3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl p-3.5 font-bold text-sm transition-all" 
              disabled={isSubmitting}
            >
              ← رجوع
            </button>
            <button 
              type="button"
              onClick={handleClientSubmit} 
              disabled={isSubmitting}
              className="w-2/3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl p-3.5 transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)] text-sm flex items-center justify-center gap-2" 
            >
              {isSubmitting ? 'جاري بناء الخطة...' : '🚀 إتمام التسجيل وبناء الخطة'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
