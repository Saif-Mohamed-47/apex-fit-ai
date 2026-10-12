'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import LogoutButton from '@/components/LogoutButton';
import ApexLogo from '@/components/ApexLogo';

interface ClientSummary {
  id: number;
  email: string;
  full_name?: string | null;
  phone_number?: string | null;
  goal: string;
  weight_kg: number;
  last_log_date: string | null;
  has_custom_macros: boolean;
  gender?: string;
  joined_date?: string;
  subscription_tier?: string;
  subscription_expires_at?: string;
  duration_days?: number;
}

interface ClientDetail {
  client: {
    id: number;
    email: string;
    full_name?: string | null;
    phone_number?: string | null;
    gender?: string;
    age: number;
    weight_kg: number;
    height_cm: number;
    goal: string;
    activity_level: string;
    training_experience_months: number;
    days_per_week: number;
    custom_macros: {
      calories: number;
      protein_g: number;
      carbs_g: number;
      fat_g: number;
    } | null;
  };
  recent_workouts: any[];
  recent_checkins: any[];
}

const AVATAR_PRESETS = [
  { id: 'preset_1', title: 'كابتن كمال أجسام (Olympia Champion)', src: '/images/landing_hero_bodybuilder.jpg', gender: 'male' },
  { id: 'preset_2', title: 'كابتن لياقة وتدريب بدني (Elite Fitness Pro)', src: '/images/coach_portrait.jpg', gender: 'male' },
  { id: 'preset_3', title: 'كابتن قوة بدنية وتمرين أثقال (Power Athlete)', src: '/images/trainee_workout.jpg', gender: 'male' },
  { id: 'preset_4', title: 'كابتن ماستر تدريب وأداء (Performance Master)', src: '/images/coach_athlete_collaboration.jpg', gender: 'both' },
  { id: 'preset_5', title: 'كابتن مدربة لياقة ورشاقة (Elite Female Coach)', src: '/images/female_coach_portrait.jpg', gender: 'female' },
  { id: 'preset_6', title: 'كابتن تدريب وظيفي وتنسيق قوام (Pro Athlete)', src: '/images/female_trainee_workout.jpg', gender: 'female' },
];

export default function CoachDashboardPage() {
  const [activeTab, setActiveTab] = useState<'clients' | 'profile' | 'license'>('clients');
  const [clients, setClients] = useState<ClientSummary[]>([]);
  const [inviteCode, setInviteCode] = useState<string>('');
  const [isCoachActive, setIsCoachActive] = useState<boolean>(false);
  const [coachGender, setCoachGender] = useState<'male' | 'female'>('male');
  const [coachBio, setCoachBio] = useState<string>('');
  const [coachAvatarUrl, setCoachAvatarUrl] = useState<string>('');
  const [coachRating, setCoachRating] = useState<number>(4.9);
  const [coachRatingCount, setCoachRatingCount] = useState<number>(18);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Avatar Selection & Upload Modal
  const [avatarModal, setAvatarModal] = useState(false);
  const [selectedAvatarPreview, setSelectedAvatarPreview] = useState<string>('');
  const [savingAvatar, setSavingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Add Client Form Modal
  const [addClientModal, setAddClientModal] = useState(false);
  const [newClientEmail, setNewClientEmail] = useState('');
  const [addingClient, setAddingClient] = useState(false);

  // License Activation Form
  const [activationModal, setActivationModal] = useState(false);
  const [activationMethod, setActivationMethod] = useState<'vodafone_cash' | 'card'>('vodafone_cash');
  const [activationPhone, setActivationPhone] = useState('01012345678');
  const [activatingLicense, setActivatingLicense] = useState(false);

  // Saving Bio State
  const [savingBio, setSavingBio] = useState(false);

  // Client Details Modal
  const [selectedClient, setSelectedClient] = useState<ClientDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Custom Macro Form Modal
  const [editMacroModal, setEditMacroModal] = useState<ClientSummary | null>(null);
  const [customCalories, setCustomCalories] = useState<number>(2200);
  const [customProtein, setCustomProtein] = useState<number>(180);
  const [customCarbs, setCustomCarbs] = useState<number>(220);
  const [customFat, setCustomFat] = useState<number>(60);
  const [submittingMacros, setSubmittingMacros] = useState(false);

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('يرجى اختيار ملف صورة صالح (JPG, PNG, WebP).');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      toast.error('حجم الصورة كبير جداً، يرجى اختيار صورة أصغر من 15 ميجابايت.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 800;
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > MAX_SIZE) {
            height = Math.round((height * MAX_SIZE) / width);
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width = Math.round((width * MAX_SIZE) / height);
            height = MAX_SIZE;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.88);
        setSelectedAvatarPreview(compressedDataUrl);
        toast.success('تم تحميل الصورة بنجاح! اضغط حفظ لتطبيقها 📸');
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  };

  const handleSaveAvatar = async (urlToSave: string) => {
    if (!urlToSave) return;
    setSavingAvatar(true);
    try {
      const res = await fetch('/api/coach/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatar_url: urlToSave }),
      });
      if (res.ok) {
        setCoachAvatarUrl(urlToSave);
        toast.success('تم حفظ وتحديث صورتك الشخصية بنجاح! 📸');
        setAvatarModal(false);
      } else {
        toast.error('فشل حفظ الصورة الشخصية');
      }
    } catch {
      toast.error('خطأ في الاتصال بالسيرفر');
    } finally {
      setSavingAvatar(false);
    }
  };

  useEffect(() => {
    fetchCoachData();
  }, []);

  const fetchCoachData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Coach Profile & Gender
      try {
        const meRes = await fetch('/api/me');
        if (meRes.ok) {
          const meData = await meRes.json();
          if (meData.gender === 'female') {
            setCoachGender('female');
          } else {
            setCoachGender('male');
          }
          setIsCoachActive(!!meData.is_coach_active);
          setCoachBio(meData.coach_bio || '');
          setCoachAvatarUrl(meData.coach_avatar_url || '');
          if (meData.coach_rating) setCoachRating(meData.coach_rating);
          if (meData.coach_rating_count) setCoachRatingCount(meData.coach_rating_count);
        }
      } catch (e) {
        console.warn('Could not load coach profile:', e);
      }

      // 2. Fetch Invite Code & License Status
      try {
        const codeRes = await fetch('/api/coach/invite-code');
        if (codeRes.ok) {
          const data = await codeRes.json();
          setInviteCode(data.invite_code || '');
          if (data.is_active !== undefined) {
            setIsCoachActive(!!data.is_active);
          }
        }
      } catch (e) {
        console.warn('Error fetching invite code:', e);
      }

      // 3. Fetch Clients Roster
      const clientsRes = await fetch('/api/coach/clients');
      if (clientsRes.ok) {
        const data = await clientsRes.json();
        setClients(data);
      } else {
        toast.error('فشل تحميل قائمة المتدربين');
      }
    } catch (err) {
      toast.error('خطأ في الاتصال بسيرفر الكوتش');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyInviteCode = () => {
    if (!inviteCode) {
      toast.error('يجب تفعيل اشتراك المدرب أولاً لإصدار كود المتدربين');
      return;
    }
    navigator.clipboard.writeText(inviteCode);
    toast.success(`تم نسخ كود الدعوة: ${inviteCode}`);
  };

  const handleActivateCoachLicense = async () => {
    setActivatingLicense(true);
    try {
      const res = await fetch('/api/coach/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payment_method: activationMethod,
          sender_phone: activationPhone,
          transfer_ref: 'ACT-' + Math.floor(Math.random() * 900000 + 100000),
        }),
      });

      if (!res.ok) {
        throw new Error('فشلت معالجة تفعيل رخصة المدرب');
      }

      const data = await res.json();
      setIsCoachActive(true);
      setInviteCode(data.invite_code);
      setActivationModal(false);
      toast.success('تم تفعيل رخصة المدرب وإصدار كود المتدربين بنجاح! 🎉');
      fetchCoachData();
    } catch (err: any) {
      toast.error(err.message || 'حدث خطأ في عملية التفعيل');
    } finally {
      setActivatingLicense(false);
    }
  };

  const handleSaveBio = async () => {
    setSavingBio(true);
    try {
      const res = await fetch('/api/coach/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bio: coachBio,
          avatar_url: coachAvatarUrl,
        }),
      });

      if (res.ok) {
        toast.success('تم حفظ النبذة التعريفية والملف الشخصي بنجاح! 💾');
      } else {
        toast.error('فشل حفظ التعديلات');
      }
    } catch {
      toast.error('خطأ في الاتصال بالسيرفر');
    } finally {
      setSavingBio(false);
    }
  };

  const handleAddClientByEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientEmail.trim()) {
      toast.error('برجاء كتابة البريد الإلكتروني للمتدرب');
      return;
    }

    setAddingClient(true);
    try {
      const res = await fetch('/api/coach/clients/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newClientEmail }),
      });

      if (res.ok) {
        toast.success(`تمت إضافة المتدرب ${newClientEmail} لقائمتك بنجاح! 🚀`);
        setNewClientEmail('');
        setAddClientModal(false);
        fetchCoachData();
      } else {
        const err = await res.json();
        toast.error(err.error || 'فشلت إضافة المتدرب');
      }
    } catch {
      toast.error('خطأ في الاتصال بالسيرفر');
    } finally {
      setAddingClient(false);
    }
  };

  const handleRemoveClient = async (client: ClientSummary) => {
    const confirmRemove = window.confirm(`هل أنت متأكد من إلغاء اشتراك وطرد المتدرب ${client.email} من قائمتك؟`);
    if (!confirmRemove) return;

    try {
      const res = await fetch(`/api/coach/clients/${client.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast.success(`تم إزالة المتدرب ${client.email} من قائمتك.`);
        setClients(prev => prev.filter(c => c.id !== client.id));
      } else {
        toast.error('فشل إزالة المتدرب');
      }
    } catch {
      toast.error('خطأ في الاتصال بالسيرفر');
    }
  };

  const handleOpenClientDetails = async (clientSummary: ClientSummary) => {
    setDetailLoading(true);
    try {
      const res = await fetch(`/api/coach/clients/${clientSummary.id}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedClient(data);
      } else {
        toast.error('فشل تحميل تفاصيل المتدرب');
      }
    } catch {
      toast.error('خطأ في الاتصال بالسيرفر');
    } finally {
      setDetailLoading(false);
    }
  };

  const handleOpenMacroEditor = (clientSummary: ClientSummary) => {
    setEditMacroModal(clientSummary);
    setCustomCalories(2200);
    setCustomProtein(180);
    setCustomCarbs(220);
    setCustomFat(60);
  };

  const handleSaveMacroOverride = async () => {
    if (!editMacroModal) return;
    setSubmittingMacros(true);
    try {
      const res = await fetch(`/api/coach/clients/${editMacroModal.id}/override-macros`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          custom_calories: customCalories,
          custom_protein_g: customProtein,
          custom_carbs_g: customCarbs,
          custom_fat_g: customFat,
        }),
      });

      if (res.ok) {
        toast.success(`تم تعيين خطة الماكروز المخصصة للمتدرب ${editMacroModal.email}`);
        setEditMacroModal(null);
        fetchCoachData();
      } else {
        toast.error('فشل حفظ الماكروز');
      }
    } catch {
      toast.error('خطأ في حفظ الماكروز');
    } finally {
      setSubmittingMacros(false);
    }
  };

  const handleResetMacroOverride = async (clientId: number) => {
    try {
      const res = await fetch(`/api/coach/clients/${clientId}/override-macros`, {
        method: 'DELETE',
      });
      if (res.ok) {
        toast.success('تمت استعادة حسابات الذكاء الاصطناعي التلقائية');
        setEditMacroModal(null);
        fetchCoachData();
      } else {
        toast.error('فشل إعادة ضبط الماكروز');
      }
    } catch {
      toast.error('خطأ في إعادة الضبط');
    }
  };

  // Remaining days calculator helper
  const getRemainingDays = (expiryStr?: string) => {
    if (!expiryStr) return 30;
    const expiry = new Date(expiryStr);
    const now = new Date();
    const diffTime = expiry.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const filteredClients = clients.filter(c => 
    c.email.toLowerCase().includes(search.toLowerCase()) || 
    c.goal.toLowerCase().includes(search.toLowerCase())
  );

  const isFemaleCoach = coachGender === 'female';
  const defaultAvatar = isFemaleCoach ? '/images/female_coach_portrait.jpg' : '/images/coach_portrait.jpg';
  const currentAvatar = coachAvatarUrl || defaultAvatar;

  return (
    <div className={`min-h-screen text-white p-4 sm:p-6 md:p-10 font-sans transition-colors duration-500 ${
      isFemaleCoach ? 'bg-[#0E0B12]' : 'bg-[#0A0B0E]'
    }`} dir="rtl">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header Banner with Gender Persona Theme */}
        <header className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 shadow-2xl border transition-all duration-300 ${
          isFemaleCoach
            ? 'bg-gradient-to-r from-[#171220] via-[#20152B] to-[#171220] border-pink-500/30 shadow-[0_0_50px_rgba(236,72,153,0.15)]'
            : 'bg-gradient-to-r from-[#10141C] via-[#151C28] to-[#10141C] border-blue-500/30 shadow-[0_0_50px_rgba(59,130,246,0.15)]'
        }`}>
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
            
            <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-right">
              {/* Profile Avatar Frame (Click to change) */}
              <div 
                onClick={() => {
                  setSelectedAvatarPreview(currentAvatar);
                  setAvatarModal(true);
                }}
                className={`relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden border-2 transition-all duration-300 shrink-0 cursor-pointer group shadow-2xl ${
                  isFemaleCoach 
                    ? 'border-pink-500 hover:border-pink-400 shadow-[0_0_30px_rgba(236,72,153,0.4)]' 
                    : 'border-blue-500 hover:border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.4)]'
                }`}
                title="اضغط هنا لتغيير الصورة الشخصية (من هاتفك/كمبيوترك أو أفتار جاهز)"
              >
                <Image 
                  src={currentAvatar} 
                  alt="Coach Avatar" 
                  fill 
                  priority
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Camera Hover Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 text-white">
                  <span className="text-xl">📷</span>
                  <span className="text-[10px] font-black">تغيير الصورة</span>
                </div>
                <span className="absolute bottom-1.5 right-1.5 w-4 h-4 rounded-full bg-emerald-400 border-2 border-[#10141C] animate-pulse"></span>
              </div>

              <div>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                  <span className={`px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border flex items-center gap-1.5 ${
                    isFemaleCoach
                      ? 'bg-pink-500/20 text-pink-300 border-pink-500/40 shadow-[0_0_15px_rgba(236,72,153,0.25)]'
                      : 'bg-blue-500/20 text-blue-300 border-blue-500/40 shadow-[0_0_15px_rgba(59,130,246,0.25)]'
                  }`}>
                    <span>{isFemaleCoach ? '🌸' : '👨'}</span>
                    <span>{isFemaleCoach ? 'كابتن مدربة معتمدة • Women Division' : 'كابتن مدرب معتمد • Men Division'}</span>
                  </span>

                  <div className="flex items-center gap-1.5">
                    <ApexLogo size="sm" showText={false} />
                    <span className="text-gray-300 font-bold text-xs">Apex Fit AI Pro Suite</span>
                  </div>

                  {/* Division Badge (Fixed by coach gender - no switcher) */}
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${
                    isFemaleCoach 
                      ? 'bg-pink-950/40 text-pink-300 border-pink-500/30' 
                      : 'bg-blue-950/40 text-blue-300 border-blue-500/30'
                  }`}>
                    <span>{isFemaleCoach ? 'قسم السيدات' : 'قسم الرجال'}</span>
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black mt-2 text-white">
                  {isFemaleCoach ? 'لوحة تحكم الكابتن المدربة والبطلات' : 'لوحة تحكم الكابتن المدرب والأبطال'}
                </h1>
                <p className="text-gray-300 text-xs sm:text-sm mt-1 max-w-xl">
                  {isFemaleCoach 
                    ? 'إدارة متدربات قسم الرشاقة وتنسيق القوام، متابعة الأوزان، وتعيين الماكروز الدقيقة.'
                    : 'إدارة أبطال كمال الأجسام والقوة البدنية، مراقبة الزيادة التدريجية في الأوزان، وضبط الماكروز.'}
                </p>
              </div>
            </div>

            {/* Invite Code Status / Activation Badge */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
              {isCoachActive ? (
                <div className="bg-[#07090C]/90 border border-emerald-500/40 rounded-2xl p-4 flex items-center justify-between gap-4 shadow-xl w-full sm:w-auto">
                  <div>
                    <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-bold uppercase tracking-wider">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                      <span>كود المتدربين النشط</span>
                    </div>
                    <p className="font-mono text-xl font-black text-white mt-0.5 tracking-wider">{inviteCode}</p>
                  </div>
                  <button
                    onClick={handleCopyInviteCode}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl text-xs transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] shrink-0"
                  >
                    نسخ الكود 📋
                  </button>
                </div>
              ) : (
                <div className="bg-amber-950/30 border border-amber-500/40 rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-xl w-full sm:w-auto">
                  <div>
                    <p className="text-xs text-amber-300 font-bold">🔒 رخصة الكود غير مفعلة</p>
                    <p className="text-[10px] text-gray-300">سدد رسوم اشتراك المدرب لإصدار كودك</p>
                  </div>
                  <button
                    onClick={() => setActivationModal(true)}
                    className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-black rounded-xl text-xs shadow-lg transition-all shrink-0"
                  >
                    تفعيل الرخصة ⚡
                  </button>
                </div>
              )}

              <LogoutButton />
            </div>

          </div>
        </header>

        {/* Global Navigation Tabs */}
        <div className="flex border-b border-white/10 gap-2 text-sm font-bold">
          <button
            onClick={() => setActiveTab('clients')}
            className={`pb-3 px-4 border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'clients'
                ? isFemaleCoach ? 'border-pink-500 text-pink-400' : 'border-blue-500 text-blue-400'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <span>📋</span>
            <span>قائمة المتدربين والاشتراكات ({clients.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 px-4 border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'profile'
                ? isFemaleCoach ? 'border-pink-500 text-pink-400' : 'border-blue-500 text-blue-400'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <span>👑</span>
            <span>ملفي الشخصي والنبذة والتقييم</span>
          </button>

          <button
            onClick={() => setActiveTab('license')}
            className={`pb-3 px-4 border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'license'
                ? isFemaleCoach ? 'border-pink-500 text-pink-400' : 'border-blue-500 text-blue-400'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <span>⚡</span>
            <span>رخصة الكود والاشتراك الشهري</span>
          </button>
        </div>

        {/* TAB 1: CLIENTS ROSTER & SUBSCRIPTIONS */}
        {activeTab === 'clients' && (
          <section className="space-y-6">
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <input 
                  type="text" 
                  placeholder="بحث في المتدربين بالإيميل أو الهدف..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full sm:w-80 bg-[#12151B] border border-white/10 text-white rounded-xl px-4 py-3 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => setAddClientModal(true)}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs text-white shadow-lg transition-all flex items-center gap-2 ${
                    isFemaleCoach 
                      ? 'bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 shadow-pink-600/30' 
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 shadow-blue-600/30'
                  }`}
                >
                  <span>➕</span>
                  <span>إضافة متدرب جديد بالإيميل</span>
                </button>
              </div>
            </div>

            {loading ? (
              <div className="py-20 text-center text-gray-400">
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                جاري تحميل قائمة المتدربين...
              </div>
            ) : filteredClients.length === 0 ? (
              <div className="bg-[#12151B] border border-white/10 rounded-3xl p-12 text-center text-gray-400 space-y-4">
                <p className="text-2xl font-black text-white">لا يوجد متدربين مرتبطين بك حالياً</p>
                <p className="text-xs sm:text-sm max-w-md mx-auto text-gray-300 leading-relaxed">
                  شارك كود دعوتك الفريد <span className="text-blue-400 font-mono font-bold bg-blue-950/40 px-2 py-0.5 rounded border border-blue-500/30">{inviteCode || 'كود غير مفعل'}</span> مع المتدرب عند تسجيل حسابه، أو اضغط زر <strong className="text-white">إضافة متدرب بالإيميل</strong> لربطه بحسابك فوراً!
                </p>
                <button
                  onClick={() => setAddClientModal(true)}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg mt-2 inline-flex items-center gap-1.5"
                >
                  <span>➕ إضافة أول متدرب الآن</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredClients.map((client) => {
                  const remainingDays = getRemainingDays(client.subscription_expires_at);
                  const isExpired = remainingDays <= 0;

                  return (
                    <div 
                      key={client.id}
                      className={`bg-[#12151B] border rounded-3xl p-6 space-y-5 transition-all duration-300 hover:-translate-y-1 shadow-xl relative overflow-hidden ${
                        client.gender === 'female' ? 'hover:border-pink-500/50' : 'hover:border-blue-500/50'
                      } ${isExpired ? 'border-red-500/30' : 'border-white/10'}`}
                    >
                      {/* Trainee Card Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3.5 min-w-0 flex-1">
                          <div className={`w-14 h-14 rounded-2xl overflow-hidden relative border shrink-0 ${
                            client.gender === 'female' 
                              ? 'border-pink-500/50 shadow-[0_0_15px_rgba(236,72,153,0.3)]' 
                              : 'border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                          }`}>
                            <Image 
                              src={client.gender === 'female' ? '/images/female_trainee_workout.jpg' : '/images/trainee_workout.jpg'} 
                              alt="Trainee Avatar" 
                              fill 
                              className="object-cover"
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="font-black text-white text-base truncate">
                              {client.full_name && client.full_name.trim() !== '' ? client.full_name : client.email.split('@')[0]}
                            </p>
                            <div className="flex flex-col text-[11px] text-gray-400 mt-0.5 space-y-0.5">
                              <span className="truncate text-gray-300 font-mono flex items-center gap-1">
                                ✉️ {client.email}
                              </span>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-emerald-400 font-mono font-bold flex items-center gap-1">
                                  📱 {client.phone_number ? client.phone_number : 'بدون رقم هاتف'}
                                </span>
                                {client.phone_number && (
                                  <a
                                    href={`https://wa.me/${client.phone_number.replace(/[^0-9]/g, '')}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-[10px] bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full inline-flex items-center gap-1 transition-all"
                                    title="مراسلة المتدرب على واتساب"
                                  >
                                    💬 واتساب
                                  </a>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <span className={`px-2 py-0.5 rounded-md text-[10px] font-black ${
                                client.gender === 'female'
                                  ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30'
                                  : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                              }`}>
                                {client.gender === 'female' ? '🌸 بطلة' : '⚡ بطل'}
                              </span>
                              <span className="text-[10px] text-gray-400 bg-white/5 px-2 py-0.5 rounded border border-white/5 font-semibold">
                                {client.goal === 'lose_fat' ? 'تنشيف' : client.goal === 'gain_muscle' ? 'تضخيم' : 'لياقة وثبات'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Expel / Remove Client Action */}
                        <button
                          type="button"
                          onClick={() => handleRemoveClient(client)}
                          title="طرد / إلغاء اشتراك المتدرب"
                          className="w-8 h-8 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-500/30 flex items-center justify-center transition-all hover:scale-105 shrink-0"
                        >
                          ✕
                        </button>
                      </div>

                      {/* Subscription Tracking Pill */}
                      <div className="p-3 bg-[#0B0D11] border border-white/5 rounded-2xl space-y-2 text-xs">
                        <div className="flex items-center justify-between text-gray-300">
                          <span className="text-gray-400">تاريخ الاشتراك:</span>
                          <strong className="text-white font-mono">{client.joined_date || 'اليوم'}</strong>
                        </div>
                        <div className="flex items-center justify-between text-gray-300">
                          <span className="text-gray-400">ينتهي في:</span>
                          <strong className="text-white font-mono">{client.subscription_expires_at || 'بعد 30 يوم'}</strong>
                        </div>
                        <div className="pt-1.5 border-t border-white/5 flex items-center justify-between">
                          <span className="text-gray-400">حالة الاشتراك:</span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                            isExpired 
                              ? 'bg-red-500/20 text-red-300 border border-red-500/40' 
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          }`}>
                            {isExpired ? '🔴 انتهى الاشتراك' : `🟢 متبقي ${remainingDays} يوم`}
                          </span>
                        </div>
                      </div>

                      {/* Body Metrics Summary */}
                      <div className="grid grid-cols-2 gap-3 text-xs text-gray-400">
                        <div className="bg-[#0E1116] p-2.5 rounded-xl border border-white/5">
                          <p className="text-[10px]">الوزن الحالي</p>
                          <p className="font-black text-white text-sm mt-0.5">{client.weight_kg} كجم</p>
                        </div>
                        <div className="bg-[#0E1116] p-2.5 rounded-xl border border-white/5">
                          <p className="text-[10px]">آخر تمرين مسجل</p>
                          <p className="font-black text-white text-sm mt-0.5">{client.last_log_date || 'لا يوجد تسجيل'}</p>
                        </div>
                      </div>

                      {/* Card Action Buttons */}
                      <div className="pt-2 flex items-center gap-2">
                        <button
                          onClick={() => handleOpenMacroEditor(client)}
                          className={`flex-1 py-2.5 px-3 rounded-xl font-black text-xs transition-all ${
                            client.has_custom_macros 
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                              : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
                          }`}
                        >
                          {client.has_custom_macros ? '✏️ تعديل الماكروز' : '➕ تعيين ماكروز الكوتش'}
                        </button>

                        <button
                          onClick={() => handleOpenClientDetails(client)}
                          className="py-2.5 px-3.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 rounded-xl font-bold text-xs transition-all"
                        >
                          التفاصيل
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* TAB 2: COACH PROFILE, BIO & RATING */}
        {activeTab === 'profile' && (
          <section className="max-w-4xl mx-auto space-y-8">
            <div className="bg-[#12151B] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
              
              <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-white/10">
                <div 
                  onClick={() => {
                    setSelectedAvatarPreview(currentAvatar);
                    setAvatarModal(true);
                  }}
                  className={`relative w-28 h-28 rounded-3xl overflow-hidden border-2 shrink-0 cursor-pointer group shadow-2xl ${
                    isFemaleCoach ? 'border-pink-500 hover:border-pink-400' : 'border-blue-500 hover:border-blue-400'
                  }`}
                  title="اضغط هنا لتغيير صورتك الشخصية"
                >
                  <Image src={currentAvatar} alt="Coach Avatar" fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 text-white">
                    <span className="text-xl">📷</span>
                    <span className="text-[10px] font-black">تغيير الصورة</span>
                  </div>
                </div>

                <div className="space-y-2 text-center sm:text-right">
                  <h2 className="text-2xl font-black text-white">
                    {isFemaleCoach ? 'ملف الكابتن المدربة' : 'ملف الكابتن المدرب'}
                  </h2>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                    <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full text-xs font-black flex items-center gap-1">
                      <span>⭐</span>
                      <span>{coachRating.toFixed(1)} / 5.0 ({coachRatingCount} تقييم متدرب)</span>
                    </span>
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/40 rounded-full text-xs font-bold">
                      🏆 معتمد رسمياً
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">
                    هذا الملف يظهر لمتدربيك ويحدد هويتك التدريبية والخبرات الرياضية المسجلة.
                  </p>
                </div>
              </div>

              {/* Photo & Avatar Controls */}
              <div className="space-y-3 bg-[#0A0B0E] p-5 rounded-2xl border border-white/10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <label className="block text-xs font-black text-white uppercase tracking-wider">
                      📸 الصورة الشخصية للكوتش (Avatar Photo)
                    </label>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      ارفع صورتك من جهازك أو هاتفك المحمول، أو اختر أفتار رياضي جاهز بضغطة زر.
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedAvatarPreview(currentAvatar);
                        setAvatarModal(true);
                      }}
                      className={`px-4 py-2.5 rounded-xl font-black text-xs text-white shadow-lg transition-all flex items-center gap-1.5 ${
                        isFemaleCoach
                          ? 'bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 shadow-pink-600/30'
                          : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 shadow-blue-600/30'
                      }`}
                    >
                      <span>📷</span>
                      <span>تغيير الصورة أو اختيار أفتار</span>
                    </button>

                    {coachAvatarUrl && (
                      <button
                        type="button"
                        onClick={() => handleSaveAvatar('')}
                        className="px-3 py-2.5 bg-white/10 hover:bg-white/20 text-xs rounded-xl text-gray-300 font-bold transition-all"
                      >
                        استعادة الافتراضية
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Bio & Credentials Input */}
              <div className="space-y-3">
                <label className="block text-xs font-black text-gray-300 uppercase tracking-wider">
                  📝 نبذة تعريفية عنك (Bio & الشهادات الرياضية)
                </label>
                <textarea
                  rows={4}
                  value={coachBio}
                  onChange={(e) => setCoachBio(e.target.value)}
                  placeholder="اكتب نبذة عنك، شهادات التدريب الحاصل عليها (مثل ISSA, ACE)، سنوات خبرتك في بطولات كمال الأجسام والفتنس، وفلسفتك التدريبية لتظهر لجميع لاعبيك..."
                  className="w-full bg-[#0A0B0E] border border-white/10 text-white rounded-2xl p-4 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 outline-none leading-relaxed"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveBio}
                  disabled={savingBio}
                  className={`px-8 py-3 rounded-xl font-black text-xs text-white shadow-lg transition-all flex items-center gap-2 ${
                    isFemaleCoach
                      ? 'bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 shadow-pink-600/30'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 shadow-blue-600/30'
                  }`}
                >
                  <span>💾</span>
                  <span>{savingBio ? 'جاري الحفظ...' : 'حفظ النبذة والملف الشخصي'}</span>
                </button>
              </div>

            </div>
          </section>
        )}

        {/* TAB 3: LICENSE ACTIVATION & INVITE CODE */}
        {activeTab === 'license' && (
          <section className="max-w-3xl mx-auto space-y-6">
            <div className={`rounded-3xl p-8 border shadow-2xl space-y-6 ${
              isCoachActive 
                ? 'bg-[#101915] border-emerald-500/40 shadow-emerald-500/10' 
                : 'bg-[#181313] border-amber-500/40 shadow-amber-500/10'
            }`}>
              <div className="flex items-center gap-4">
                <span className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0 ${
                  isCoachActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                }`}>
                  {isCoachActive ? '👑' : '🔒'}
                </span>
                <div>
                  <h3 className="text-2xl font-black text-white">
                    {isCoachActive ? 'رخصة المدرب معتمدة ونشطة' : 'تفعيل رخصة إصدار كود المتدربين'}
                  </h3>
                  <p className="text-xs text-gray-300 mt-1">
                    {isCoachActive 
                      ? 'كود المتدربين الخاص بك مفعل عالمياً ويسمح بربط عدد غير محدود من اللاعبين.' 
                      : 'الكود مغلق حالياً. يتطلب سداد اشتراك رخصة المدرب الشهري (399 ج.م) لإصدار كودك.'}
                  </p>
                </div>
              </div>

              {isCoachActive ? (
                <div className="p-6 bg-[#080D0B] border border-emerald-500/30 rounded-2xl space-y-4">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <p className="text-xs text-gray-400">كود الدعوة الفريد الخاص بك:</p>
                      <p className="text-3xl font-black font-mono text-emerald-400 mt-1">{inviteCode}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleCopyInviteCode}
                        className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-all shadow-lg"
                      >
                        نسخ الكود 📋
                      </button>
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-400 border-t border-white/5 pt-3 leading-relaxed">
                    💡 يضع المتدرب هذا الكود عند إنشاء حسابه الجديد في خانة (كود دعوة الكابتن)، وسيظهر فوراً في لوحة تحكمك مع إمكانية تعديل خطة أكله وتمرينه.
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="p-5 bg-[#0C0A0A] border border-amber-500/25 rounded-2xl space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-400">رسوم رخصة المدرب المعتمد:</span>
                      <strong className="text-amber-400 text-lg font-black font-mono">399 ج.م / شهر</strong>
                    </div>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      تتضمن الرخصة: إصدار كود دعوة فريد، ربط ومتابعة متدربين بلا حدود، تعديل الماكروز يدويًا، ولوحة تحليلات للأوزان والفحوصات الأسبوعية.
                    </p>
                  </div>

                  <button
                    onClick={() => setActivationModal(true)}
                    className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-black text-sm rounded-2xl shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
                  >
                    <span>⚡ سداد الاشتراك وتفعيل كود المتدربين الآن</span>
                  </button>
                </div>
              )}
            </div>
          </section>
        )}

      </div>

      {/* Modal: Add Trainee by Email */}
      {addClientModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-[#141619] border border-white/15 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-white/10">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <span>➕</span>
                <span>إضافة متدرب جديد لقائمتك</span>
              </h3>
              <button onClick={() => setAddClientModal(false)} className="text-gray-400 hover:text-white font-bold text-lg">✕</button>
            </div>

            <form onSubmit={handleAddClientByEmail} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5">
                  البريد الإلكتروني للمتدرب المسجل
                </label>
                <input
                  type="email"
                  value={newClientEmail}
                  onChange={(e) => setNewClientEmail(e.target.value)}
                  placeholder="trainee@example.com"
                  className="w-full bg-[#0A0B0D] border border-white/10 text-white rounded-xl p-3 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  يجب أن يكون المتدرب قد سجل حسابه مسبقاً على منصة Apex Fit AI.
                </p>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  disabled={addingClient}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs rounded-xl shadow-lg transition-all"
                >
                  {addingClient ? 'جاري الإضافة...' : 'تأكيد الإضافة للقائمة 🚀'}
                </button>
                <button
                  type="button"
                  onClick={() => setAddClientModal(false)}
                  className="px-4 py-3 bg-white/10 hover:bg-white/15 text-gray-300 font-bold text-xs rounded-xl"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: License Activation Checkout */}
      {activationModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-[#141619] border border-white/15 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-white/10">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <span>👑</span>
                <span>تفعيل رخصة واشتراك المدرب</span>
              </h3>
              <button onClick={() => setActivationModal(false)} className="text-gray-400 hover:text-white font-bold text-lg">✕</button>
            </div>

            <div className="space-y-4">
              <div className="flex bg-[#0A0B0D] p-1 rounded-xl border border-white/10 gap-2">
                <button
                  type="button"
                  onClick={() => setActivationMethod('vodafone_cash')}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                    activationMethod === 'vodafone_cash' ? 'bg-red-600 text-white shadow' : 'text-gray-400'
                  }`}
                >
                  فودافون كاش (Vodafone Cash)
                </button>
                <button
                  type="button"
                  onClick={() => setActivationMethod('card')}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                    activationMethod === 'card' ? 'bg-blue-600 text-white shadow' : 'text-gray-400'
                  }`}
                >
                  فيزا / كارت بنكي (Card)
                </button>
              </div>

              {activationMethod === 'vodafone_cash' ? (
                <div className="bg-red-950/20 border border-red-500/30 p-4 rounded-xl text-xs space-y-2">
                  <p className="text-red-300 font-bold">طريقة التحويل:</p>
                  <p className="text-gray-300 leading-relaxed">
                    حول مبلغ <strong className="text-white">399 ج.م</strong> لمحفظة فودافون كاش رقم: <strong className="text-red-300 font-mono text-sm">01012345678</strong>
                  </p>
                  <input
                    type="tel"
                    placeholder="رقم الموبايل المحول منه..."
                    value={activationPhone}
                    onChange={(e) => setActivationPhone(e.target.value)}
                    className="w-full bg-[#0A0B0D] border border-white/10 text-white rounded-lg p-2.5 text-xs outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              ) : (
                <div className="bg-blue-950/20 border border-blue-500/30 p-4 rounded-xl text-xs space-y-2">
                  <p className="text-blue-300 font-bold">الدفع بالفيزا / ماستركارد:</p>
                  <input
                    type="text"
                    placeholder="رقم الكارت (16 رقم)..."
                    defaultValue="4111 2222 3333 4444"
                    className="w-full bg-[#0A0B0D] border border-white/10 text-white rounded-lg p-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
              )}

              <button
                type="button"
                onClick={handleActivateCoachLicense}
                disabled={activatingLicense}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-black text-xs rounded-xl shadow-lg transition-all"
              >
                {activatingLicense ? 'جاري معالجة التفعيل...' : 'تأكيد الدفع وإصدار كود الدعوة فوراً 🎉'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Custom Macro Target Form */}
      {editMacroModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-[#141619] border border-white/15 rounded-3xl max-w-lg w-full p-8 space-y-6 shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div>
                <h3 className="text-xl font-bold text-white">تعيين أهداف الماكروز للمتدرب</h3>
                <p className="text-xs text-gray-400">{editMacroModal.email}</p>
              </div>
              <button 
                onClick={() => setEditMacroModal(null)} 
                className="text-gray-400 hover:text-white font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-300 font-bold block mb-1">السعرات الحرارية اليومية (Calories kcal)</label>
                <input 
                  type="number" 
                  value={customCalories} 
                  onChange={e => setCustomCalories(Number(e.target.value))}
                  className="w-full bg-[#0A0B0D] border border-white/10 text-white rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-blue-400 font-bold block mb-1">بروتين (غرام)</label>
                  <input 
                    type="number" 
                    value={customProtein} 
                    onChange={e => setCustomProtein(Number(e.target.value))}
                    className="w-full bg-[#0A0B0D] border border-white/10 text-white rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-amber-400 font-bold block mb-1">كاربوهيدرات (غرام)</label>
                  <input 
                    type="number" 
                    value={customCarbs} 
                    onChange={e => setCustomCarbs(Number(e.target.value))}
                    className="w-full bg-[#0A0B0D] border border-white/10 text-white rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-red-400 font-bold block mb-1">دهون (غرام)</label>
                  <input 
                    type="number" 
                    value={customFat} 
                    onChange={e => setCustomFat(Number(e.target.value))}
                    className="w-full bg-[#0A0B0D] border border-white/10 text-white rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={handleSaveMacroOverride}
                  disabled={submittingMacros}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
                >
                  {submittingMacros ? 'جاري الحفظ...' : 'تطبيق الخطة فورياً'}
                </button>

                {editMacroModal.has_custom_macros && (
                  <button
                    type="button"
                    onClick={() => handleResetMacroOverride(editMacroModal.id)}
                    className="px-4 py-3 bg-red-950/40 hover:bg-red-950/70 text-red-400 border border-red-500/30 rounded-xl text-xs font-bold transition-all"
                  >
                    استعادة AI
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Client Workout & Check-In Details */}
      {selectedClient && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-[#141619] border border-white/15 rounded-3xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl custom-scrollbar">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div>
                <h3 className="text-xl font-bold text-white">
                  {selectedClient.client.full_name || selectedClient.client.email.split('@')[0]}
                </h3>
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-400 font-mono">
                  <span>✉️ {selectedClient.client.email}</span>
                  {selectedClient.client.phone_number && (
                    <span className="text-emerald-400 font-bold">📱 {selectedClient.client.phone_number}</span>
                  )}
                </div>
              </div>
              <button 
                onClick={() => setSelectedClient(null)} 
                className="text-gray-400 hover:text-white font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-bold text-blue-400">آخر التمارين المسجلة</h4>
              {selectedClient.recent_workouts.length === 0 ? (
                <p className="text-xs text-gray-400">لم يسجل المتدرب أي تمارين بعد.</p>
              ) : (
                <div className="space-y-2">
                  {selectedClient.recent_workouts.map((w: any, idx: number) => (
                    <div key={idx} className="bg-[#0A0B0D] p-3 rounded-xl border border-white/5 flex items-center justify-between text-xs">
                      <span className="font-bold text-white">{w.exercise_name}</span>
                      <span className="text-gray-300 font-mono">{w.actual_weight_kg} كجم × {w.actual_reps} عدات</span>
                      <span className="text-gray-400 text-[10px]">{new Date(w.logged_at).toLocaleDateString('ar-EG')}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Avatar Photo Selection & Direct Upload */}
      {avatarModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-[#141619] border border-white/15 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center pb-3 border-b border-white/10">
              <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                <span>📸</span>
                <span>تغيير صورة الكابتن (رفع من الجهاز أو اختيار أفتار)</span>
              </h3>
              <button 
                onClick={() => setAvatarModal(false)} 
                className="text-gray-400 hover:text-white font-bold text-lg"
              >
                ✕
              </button>
            </div>

            {/* Current Active / Selected Preview */}
            <div className="flex flex-col sm:flex-row items-center gap-5 p-4 bg-[#0A0B0E] border border-white/10 rounded-2xl">
              <div className={`relative w-24 h-24 rounded-2xl overflow-hidden border-2 shrink-0 ${
                isFemaleCoach ? 'border-pink-500' : 'border-blue-500'
              }`}>
                <Image 
                  src={selectedAvatarPreview || currentAvatar} 
                  alt="Preview Avatar" 
                  fill 
                  className="object-cover" 
                />
              </div>
              <div className="space-y-1 text-center sm:text-right flex-1">
                <p className="text-sm font-black text-white">معاينة صورتك المختارة</p>
                <p className="text-xs text-gray-400">
                  يمكنك رفع صورة شخصية لك من جهازك (موبايل أو كمبيوتر) أو اختيار أفتار رياضي من المعرض أدناه.
                </p>
                <button
                  type="button"
                  onClick={() => handleSaveAvatar(selectedAvatarPreview || currentAvatar)}
                  disabled={savingAvatar}
                  className={`mt-2 px-5 py-2 rounded-xl text-xs font-black text-white shadow-lg transition-all ${
                    isFemaleCoach
                      ? 'bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 shadow-pink-600/30'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 shadow-blue-600/30'
                  }`}
                >
                  {savingAvatar ? 'جاري الحفظ...' : '💾 تأكيد وحفظ هذه الصورة'}
                </button>
              </div>
            </div>

            {/* Section 1: Upload from Device */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-gray-300 uppercase tracking-wider flex items-center gap-2">
                  <span>📁</span>
                  <span>رفع صورة من هاتفك أو جهازك (Camera / Files)</span>
                </label>
              </div>

              <input 
                type="file" 
                ref={fileInputRef} 
                accept="image/*" 
                onChange={handleImageFileUpload} 
                className="hidden" 
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-4 px-4 bg-gradient-to-r from-white/5 to-white/10 hover:from-white/10 hover:to-white/15 border-2 border-dashed border-white/20 hover:border-blue-500/60 rounded-2xl text-xs sm:text-sm font-bold text-white transition-all flex flex-col items-center justify-center gap-2 group"
              >
                <span className="text-2xl group-hover:scale-110 transition-transform">📱 / 💻</span>
                <span>اضغط هنا لاختيار صورة من هاتفك أو جهاز الكمبيوتر</span>
                <span className="text-[11px] text-gray-400 font-normal">يدعم التقاط بالكاميرا أو اختيار من المعرض JPG, PNG, WebP</span>
              </button>
            </div>

            {/* Section 2: Presets Grid */}
            <div className="space-y-3">
              <label className="text-xs font-black text-gray-300 uppercase tracking-wider flex items-center gap-2">
                <span>⚡</span>
                <span>أو اختر من الأفاتارات الرياضية الجاهزة للمدربين:</span>
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {AVATAR_PRESETS.map((preset) => {
                  const isSelected = (selectedAvatarPreview || currentAvatar) === preset.src;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setSelectedAvatarPreview(preset.src)}
                      className={`relative rounded-2xl overflow-hidden border-2 text-right p-1.5 transition-all group flex flex-col gap-1.5 bg-[#0B0D11] ${
                        isSelected 
                          ? isFemaleCoach ? 'border-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.4)] ring-2 ring-pink-500/40' : 'border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.4)] ring-2 ring-blue-500/40'
                          : 'border-white/10 hover:border-white/30'
                      }`}
                    >
                      <div className="relative w-full h-24 rounded-xl overflow-hidden bg-black/50">
                        <Image 
                          src={preset.src} 
                          alt={preset.title} 
                          fill 
                          className="object-cover group-hover:scale-105 transition-transform duration-300" 
                        />
                        {isSelected && (
                          <span className="absolute top-1.5 right-1.5 bg-emerald-500 text-black text-[10px] font-black px-1.5 py-0.5 rounded-md shadow">
                            ✓ مختار
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] font-bold text-gray-200 truncate px-1">{preset.title}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-2 flex gap-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => handleSaveAvatar(selectedAvatarPreview || currentAvatar)}
                disabled={savingAvatar}
                className={`flex-1 py-3 rounded-xl font-black text-xs text-white shadow-lg transition-all ${
                  isFemaleCoach
                    ? 'bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500'
                }`}
              >
                {savingAvatar ? 'جاري الحفظ...' : 'تأكيد وحفظ الصورة 💾'}
              </button>
              <button
                type="button"
                onClick={() => setAvatarModal(false)}
                className="px-5 py-3 bg-white/10 hover:bg-white/15 text-gray-300 font-bold text-xs rounded-xl"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
