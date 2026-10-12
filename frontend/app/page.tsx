'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ApexLogo from '@/components/ApexLogo';

export default function LandingPage() {
  const [activeSplitTab, setActiveSplitTab] = useState<'ppl' | 'upper_lower' | 'arnold' | 'full_body'>('ppl');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const splitsData = {
    ppl: {
      title: 'بوش / بول / ليجز (Push / Pull / Legs)',
      subtitle: 'التقسيمة الأكثر فاعلية عالمياً للاعبي كمال الأجسام لبناء الكتلة العضلية وضمان الاستشفاء التام.',
      days: [
        { name: 'يوم 1: Push (دفع)', focus: 'صدر، أكتاف أمامية وجانبية، ترايسبس', icon: '💥' },
        { name: 'يوم 2: Pull (سحب)', focus: 'ظهر كامل، ترابيس، بايسبس، كتف خلفي', icon: '⚡' },
        { name: 'يوم 3: Legs (أرجل)', focus: 'عضلات فخذ أمامية، خلفيات، سمانة، بطن', icon: '🦵' },
        { name: 'يوم 4: راحة أو تكرار الدورة', focus: 'استشفاء عضلي، كارديو خفيف، نوم كافي', icon: '🛡️' },
      ],
      badge: 'الأكثر شعبية للأبطال 🔥',
    },
    upper_lower: {
      title: 'أبر / لور (Upper / Lower Split)',
      subtitle: 'مثالي لمن يتمرن 4 أيام أسبوعياً مع تركيز مضاعف على القوة والتحميل الدوري للأوزان.',
      days: [
        { name: 'يوم 1: Upper A', focus: 'صدر مستوي، سحب ظهر بار، ضغط كتف', icon: '🏋️' },
        { name: 'يوم 2: Lower A', focus: 'سكوات ثقيل، رومانيان ديدليفت، سمانة', icon: '🦵' },
        { name: 'يوم 3: Upper B', focus: 'بنش مائل دمبل، تجديف كيبل، تجميع باي وتراي', icon: '💪' },
        { name: 'يوم 4: Lower B', focus: 'ليج بريس، هيب ثرست، طعنات دمبل', icon: '⚡' },
      ],
      badge: 'مناسب لـ 4 أيام تمرين ⏱️',
    },
    arnold: {
      title: 'أرنولد سبليت (Arnold Golden Era)',
      subtitle: 'نظام أساطير العصر الذهبي للتركيز على التناسق العضلي والبمب الخارق (Chest & Back).',
      days: [
        { name: 'يوم 1: صدر + ظهر', focus: 'سوبر سيت تاريخي للصدر والظهر مع أقصى ضخ دم', icon: '🏆' },
        { name: 'يوم 2: أكتاف + ذراعين', focus: 'بايسبس، ترايسبس، وأكتاف ثلاثية الأبعاد', icon: '💥' },
        { name: 'يوم 3: أرجل + بطن', focus: 'تمارين مكثفة لأسفل الجسم مع تكرارات عالية', icon: '🦵' },
      ],
      badge: 'للمستوى المتقدم 👑',
    },
    full_body: {
      title: 'فول بودي (Full Body System)',
      subtitle: 'مثالي للمبتدئين أو أصحاب الجداول المزدحمة (3 أيام أسبوعياً) لتحفيز تخليق البروتين العضلي.',
      days: [
        { name: 'يوم 1: تمرين كامل A', focus: 'سكوات + بنش برس + سحب ظهر أرضي', icon: '🎯' },
        { name: 'يوم 2: راحة استشفائية', focus: 'تغذية متكاملة وحساب ماكروز دقيق', icon: '🥗' },
        { name: 'يوم 3: تمرين كامل B', focus: 'ديدليفت + ضغط عسكري + طعنات بالدمبل', icon: '🔥' },
      ],
      badge: 'مثالي للمبتدئين 🌟',
    },
  };

  const exerciseShowcase = [
    {
      name: 'بنش برس بالبار (Barbell Bench Press)',
      target: 'عضلات الصدر، الكتف الأمامي، والترايسبس',
      sets: '3 - 4 مجموعات × 6 - 10 عدات',
      image: '/images/exercises/bench_press.jpg',
      badge: 'بناء الكتلة والقوة',
    },
    {
      name: 'ديدليفت كمال الأجسام (Deadlift)',
      target: 'السلسلة الخلفية، الظهر السفلي، والهامسترنجز',
      sets: '3 مجموعات × 5 - 8 عدات',
      image: '/images/exercises/deadlift.jpg',
      badge: 'القوة الانفجارية',
    },
    {
      name: 'سكوات حر بالبار (Barbell Back Squat)',
      target: 'عضلات الكوادز، المؤخرة، والجذع',
      sets: '4 مجموعات × 6 - 10 عدات',
      image: '/images/exercises/squat.jpg',
      badge: 'عمود التدريب الأساسي',
    },
    {
      name: 'أرنولد برس للأكتاف (Arnold Press)',
      target: 'الرؤوس الثلاثة لعضلات الكتف',
      sets: '3 مجموعات × 10 - 12 عدة',
      image: '/images/exercises/arnold_press.jpg',
      badge: 'شكل ثلاثي الأبعاد',
    },
    {
      name: 'هيب ثرست بالأوزان (Barbell Hip Thrust)',
      target: 'الجلوتس، أوتار الركبة، وأسفل الظهر',
      sets: '4 مجموعات × 8 - 12 عدة',
      image: '/images/exercises/hip_thrust.jpg',
      badge: 'مخصص للأبطال والبطلات',
    },
    {
      name: 'تفتيح الصدر بالكابل (Cable Flyes)',
      target: 'عضلات الصدر الداخلية وعزل الألياف',
      sets: '3 مجموعات × 12 - 15 عدة',
      image: '/images/exercises/cable_flyes.jpg',
      badge: 'عزل وبمب عضلي خارق',
    },
  ];

  const faqs = [
    {
      q: 'هل Apex Fit AI بديل للكوتش البشري بتاعي في الجيم؟',
      a: 'إطلاقاً! Apex Fit AI تم تصميمه عمداً ليكون "مساعداً ذكياً" للكوتش والمتدرب معاً. الكوتش البشري هو صاحب العين الخبيرة في تصحيح التكنيك وتوفير الأمان والدعم النفسي. مهمة Apex Fit AI هي إعفاء الكوتش والمتدرب من إجهاد الحسابات الرياضية: حساب السعرات الدقيقة والماكروز، واقتراح بدائل التمارين عند انشغال الأجهزة، وتتبع زيادة الأوزان بالأرقام، وتوفير بوابة خاصة للكوتش يدخل يتابعك ويعدل خطتك منها بضغطة زر.',
    },
    {
      q: 'إزاي كوتشي في الجيم يقدر يتابعني من خلال المنصة؟',
      a: 'المنصة فيها "بوابة المدربين (Coach Portal)". الكوتش بيسجل حسابه ويولد كود دعوة فريد (مثال: COACH-AHMED-101). بمجرد ما المتدرب يربط حسابه بكود الكوتش، يقدر الكوتش يفتح لوحة تحكم حية يشوف فيها أوزانك، التمارين اللي سجلتها، وماكروز أكلك، ويقدر يعدل لك السعرات والماكروز مباشرة من شاشته.',
    },
    {
      q: 'هل البرامج مخصصة للبنات والشباب ولا كلها زي بعض؟',
      a: 'مخصصة 100%! النظام عند التسجيل بيحدد جنس المتدرب، وزنه، طوله، وهدفه الدقيق (تضخيم، تنشيف، فتنس، بناء قوام رياضي). برامج المتدربات بتركز على تمارين تشكيل القوام، التغذية المتوازنة، مع واجهة وكوتش AI مؤنث، وبرامج الشباب بتركز على زيادة الأحمال وبناء الكتل العضلية المتناسقة.',
    },
    {
      q: 'لو رحت الجيم ولقيت الجهاز المكتوب في الخطة مشغول أعمل إيه؟',
      a: 'دي واحدة من أقوى ميزات Apex Fit AI! تقدر تفتح الشات مع كوتش الـ AI فوراً وتقوله: "جهاز البنش المائل مشغول، إيه أحسن بديل بالدمبل؟"، وهيجاوبك فوراً بالبديل المتطابق ميكانيكياً مع نفس عدد المجموعات والعدات لتكمل تمرينك بدون تضييع دقيقة واحدة.',
    },
    {
      q: 'هل لازم أدفع عشان أستخدم المنصة ولا في باقة مجانية؟',
      a: 'تقدر تبدأ تدريبك مجاناً فوراً! الباقة المجانية بتوفر لك جدول تمرين كامل، حاسبة التغذية والماكروز بدقة، مؤقت الراحة الصوتي، وتصدير الخطة PDF، مع 5 استشارات يومية مجانية مع كوتش الـ AI تتجدد كل 24 ساعة. وبإمكانك الترقية لباقة Pro أو VIP مع كوتش خاص في أي وقت.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#07080A] text-white font-sans selection:bg-blue-600 selection:text-white" dir="rtl">
      {/* 1. Global Sticky Glassmorphic Navbar */}
      <nav className="sticky top-0 z-50 bg-[#0A0B0E]/85 backdrop-blur-xl border-b border-white/10 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <ApexLogo size="md" showText={true} />
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-gray-300">
            <a href="#about" className="hover:text-blue-400 transition-colors">عن المنصة</a>
            <a href="#coach-partner" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
              <span>🤝</span>
              <span className="font-bold text-amber-300">مساعد الكوتش</span>
            </a>
            <a href="#features" className="hover:text-blue-400 transition-colors">الترسانة الذكية</a>
            <a href="#splits" className="hover:text-blue-400 transition-colors">أنظمة التمرين</a>
            <a href="#exercises" className="hover:text-blue-400 transition-colors">معمل التمارين</a>
            <a href="#pricing" className="hover:text-blue-400 transition-colors">الباقات</a>
            <a href="#faq" className="hover:text-blue-400 transition-colors">الأسئلة الشائعة</a>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link 
              href="/auth" 
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
            >
              تسجيل الدخول
            </Link>
            <Link 
              href="/auth?mode=signup" 
              className="px-5 py-2.5 rounded-xl text-xs font-black text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 border border-blue-400/30 shadow-[0_0_20px_rgba(59,130,246,0.35)] hover:shadow-[0_0_25px_rgba(59,130,246,0.55)] transition-all flex items-center gap-1.5"
            >
              <span>انضم للأبطال ⚡</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center gap-2">
            <Link 
              href="/auth"
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 text-white"
            >
              دخول
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-white/5 text-gray-400 hover:text-white"
              aria-label="القائمة"
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#0E1014] border-b border-white/10 p-5 space-y-3 text-sm font-medium">
            <a href="#about" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-gray-300">عن المنصة</a>
            <a href="#coach-partner" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-amber-300 font-bold">🤝 مساعد الكوتش (مش بديل)</a>
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-gray-300">الميزات التكنولوجية</a>
            <a href="#splits" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-gray-300">أنظمة التدريب</a>
            <a href="#exercises" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-gray-300">معمل التمارين</a>
            <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-gray-300">الباقات والاشتراكات</a>
            <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-gray-300">الأسئلة الشائعة</a>
            <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
              <Link href="/auth" className="w-full text-center py-2.5 rounded-xl bg-white/10 font-bold text-xs">تسجيل الدخول</Link>
              <Link href="/auth?mode=signup" className="w-full text-center py-2.5 rounded-xl bg-blue-600 font-bold text-xs">ابدأ الآن كبطل جديد</Link>
            </div>
          </div>
        )}
      </nav>

      {/* 2. Hero Section: Cinematic Heavy Iron Atmosphere */}
      <header className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-8 pb-20">
        {/* Background Real Hero Photo */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/landing_hero_bodybuilder.jpg"
            alt="Elite bodybuilder lifting heavy weights in gym"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-45 transform scale-102"
          />
          {/* Gradients to blend seamless dark iron aesthetic */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#07080A] via-[#07080A]/70 to-[#07080A]/85"></div>
          <div className="absolute inset-0 bg-radial-at-c from-transparent via-[#07080A]/40 to-[#07080A]"></div>
        </div>

        {/* Floating Neon Backlights */}
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-blue-600/20 rounded-full blur-[140px] pointer-events-none"></div>
        <div className="absolute bottom-1/3 -left-20 w-96 h-96 bg-amber-600/15 rounded-full blur-[140px] pointer-events-none"></div>

        {/* Content Container */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-8">
          {/* Top Athletic Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-900/40 via-blue-600/20 to-indigo-900/40 border border-blue-500/30 text-blue-300 text-xs font-bold shadow-[0_0_20px_rgba(59,130,246,0.2)] animate-pulse">
            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
            <span>الجيل الجديد من منصات التدريب وكمال الأجسام الذكية</span>
            <span>⚡</span>
          </div>

          {/* Main Hero Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.15] text-white">
            وحش في الجيم.. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">
              دقيق في علم التدريب.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-3xl mx-auto text-base sm:text-xl text-gray-300 font-normal leading-relaxed">
            منصتك الرياضية المتكاملة لحساب الماكروز والسعرات بدقة الغرام، تفصيل جداول التدريب بزيادة تدريجية في الأحمال (Progressive Overload)، ومتابعة لايف خطوة بخطوة.
          </p>

          {/* The Core Non-Replacement Statement Badge */}
          <div className="max-w-2xl mx-auto p-4 sm:p-5 rounded-2xl bg-[#0F1217]/90 border border-amber-500/40 shadow-[0_0_25px_rgba(245,158,11,0.15)] flex items-center justify-center gap-3">
            <span className="text-2xl sm:text-3xl shrink-0">🛡️</span>
            <p className="text-xs sm:text-sm text-amber-200 font-bold leading-relaxed text-right sm:text-center">
              <strong className="text-white block sm:inline">Apex Fit AI مساعد ذكي لك ولكوتشك البشري — </strong>
              مش بديل عن الكوتش إطلاقاً؛ إحنا بنشيل عنه صداع الحسابات عشان يركز على توجيهك وتحفيزك!
            </p>
          </div>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/auth?mode=signup"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-base shadow-[0_0_30px_rgba(59,130,246,0.4)] hover:shadow-[0_0_40px_rgba(59,130,246,0.6)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 group"
            >
              <span>ابدأ فورمة أحلامك مجاناً</span>
              <span className="group-hover:translate-x-[-3px] transition-transform">←</span>
            </Link>

            <a
              href="#coach-partner"
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-[#14161B] hover:bg-[#1C1F26] border border-white/15 hover:border-amber-500/40 text-gray-200 hover:text-white font-bold text-sm transition-all flex items-center justify-center gap-2"
            >
              <span>🤝 كيف يساعد الكوتش؟</span>
            </a>

            <Link
              href="/auth"
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 font-bold text-sm transition-all flex items-center justify-center gap-1.5"
            >
              <span>تسجيل الدخول</span>
            </Link>
          </div>

          {/* Real Live Metrics Ticker */}
          <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
            <div className="bg-[#101216]/80 border border-white/10 p-3 sm:p-4 rounded-2xl">
              <div className="text-2xl sm:text-3xl font-black text-blue-400 font-mono">+25,000</div>
              <div className="text-[11px] sm:text-xs text-gray-400 font-medium">جلسة تمرين تم تحليلها</div>
            </div>
            <div className="bg-[#101216]/80 border border-white/10 p-3 sm:p-4 rounded-2xl">
              <div className="text-2xl sm:text-3xl font-black text-cyan-400 font-mono">99.4%</div>
              <div className="text-[11px] sm:text-xs text-gray-400 font-medium">دقة حساب الماكروز والسعرات</div>
            </div>
            <div className="bg-[#101216]/80 border border-white/10 p-3 sm:p-4 rounded-2xl">
              <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">100%</div>
              <div className="text-[11px] sm:text-xs text-gray-400 font-medium">توافق مع الكوتش البشري</div>
            </div>
            <div className="bg-[#101216]/80 border border-white/10 p-3 sm:p-4 rounded-2xl">
              <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">24/7</div>
              <div className="text-[11px] sm:text-xs text-gray-400 font-medium">دعم وبدائل تمارين فورية</div>
            </div>
          </div>
        </div>
      </header>

      {/* 3. Dedicated Strategic Section: "مساعد الكوتش.. مش بديل للكوتش" */}
      <section id="coach-partner" className="py-24 bg-[#0B0D11] border-y border-white/10 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Visual Image Side: Real Coach Mentoring Athlete */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-3xl overflow-hidden border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.8)] group">
                <Image
                  src="/images/coach_athlete_collaboration.jpg"
                  alt="Professional fitness coach mentoring bodybuilder athlete in gym with tablet"
                  width={800}
                  height={500}
                  className="object-cover w-full h-auto group-hover:scale-103 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D11] via-transparent to-transparent"></div>

                {/* Floating Overlay Badge on the Photo */}
                <div className="absolute bottom-4 right-4 left-4 p-4 rounded-2xl bg-[#0E1015]/90 border border-amber-500/30 backdrop-blur-md flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center text-xl shrink-0">
                    👑
                  </span>
                  <div>
                    <h4 className="text-xs font-black text-white">المدرب في الصدارة.. والـ AI سلاحه السري</h4>
                    <p className="text-[11px] text-gray-300">تحليلات دقيقة لأوزان كل تمرينة لتمكين الكوتش من اتخاذ القرار الصح.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Editorial Content Side */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold">
                <span>🤝 فلسفة Apex Fit AI الحقيقية</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
                ليه الذكاء الاصطناعي <br />
                <span className="text-amber-400">عمره ما هيكون بديل للكوتش البشري؟</span>
              </h2>

              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                في عالم الجيم والحديد، مفيش خوارزمية في العالم تقدر تعوض <strong>العين الفنية للكوتش البشري</strong> وهو واقف جنبك على البنش، يعدل لك زاوية كوعك، أو يصرخ في وشك عشان تجيب آخر عدتين هما اللي بيكبروا العضلة فعلاً.
              </p>

              {/* 3 Pillars */}
              <div className="space-y-4 pt-2">
                <div className="p-4 rounded-2xl bg-[#14161C] border border-white/10 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center text-lg shrink-0">
                    📐
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">شيلنا عن الكوتش إجهاد الأرقام (Zero Math Fatigue)</h3>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                      الكوتش مش آلة حاسبة. الـ AI بيحسب سعراتك بالجرام، ويقترح أوزان الـ Overload، عشان الكوتش يوفر طاقته لمتابعة الفورمة والتوجيه المباشر.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#14161C] border border-white/10 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center text-lg shrink-0">
                    🛡️
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">بوابة متطورة للمدربين (Coach Portal)</h3>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                      أي مدرب يقدر يولد كود دعوة خاص به، ويربط لاعبيه في شاشة واحدة، ويعدل ماكروز وجداول التمارين لكل متدرب في ثوانٍ.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#14161C] border border-white/10 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-lg shrink-0">
                    🚀
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">مساعد طوارئ للمتدرب داخل صالة الجيم</h3>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                      الكوتش مش فاضي 24 ساعة يرد عليك في نص الليل أو لو لقيت جهاز مشغول؛ كوتش الـ AI بيرد فوراً ببدائل آمنة معتمدة رياضياً.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap gap-3">
                <Link
                  href="/auth"
                  className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs transition-all shadow-lg shadow-amber-500/20 flex items-center gap-1.5"
                >
                  <span>دخول الكباتن والمدربين 👑</span>
                </Link>
                <a
                  href="#splits"
                  className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 font-bold text-xs transition-all"
                >
                  استكشف أنظمة التدريب المتاحة ←
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Complete Athletic Arsenal (الترسانة التقنية) */}
      <section id="features" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold">
            <span>⚡ القوة التكنولوجية لكمال الأجسام</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white">
            كل ما تحتاجه للوصول لقمة مستواك
          </h2>
          <p className="text-gray-400 text-sm sm:text-base">
            أدوات علمية متقدمة مصممة من واقع خبرات أبطال الجيم ومدربي اللياقة المعتمدين.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="p-7 rounded-3xl bg-[#0F1116] border border-white/10 hover:border-blue-500/40 transition-all duration-300 group hover:-translate-y-1 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center text-2xl mb-5 group-hover:scale-110 transition-transform">
              🏋️
            </div>
            <h3 className="text-lg font-black text-white mb-2">جداول تدريب مخصصة للهدف</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              توزيع مدروس للمجموعات والعدات بحسب مستواك وأيام تمرينك: Push/Pull/Legs، Upper/Lower، أو Arnold Split، مع تخصيص كامل للشباب أو البنات.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-7 rounded-3xl bg-[#0F1116] border border-white/10 hover:border-blue-500/40 transition-all duration-300 group hover:-translate-y-1 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center text-2xl mb-5 group-hover:scale-110 transition-transform">
              🥗
            </div>
            <h3 className="text-lg font-black text-white mb-2">حساب الماكروز بدقة الغرام</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              حساب الـ TDEE الفعلي، وتوزيع البروتين والكاربوهيدرات والدهون الصحية بدقة حسابية مع بدائل أكل ذكية لو ناقصك بروتين في يومك.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-7 rounded-3xl bg-[#0F1116] border border-white/10 hover:border-blue-500/40 transition-all duration-300 group hover:-translate-y-1 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-2xl mb-5 group-hover:scale-110 transition-transform">
              📈
            </div>
            <h3 className="text-lg font-black text-white mb-2">الزيادة التدريجية في الأحمال</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              محرك ذكي (Progressive Overload) يقترح عليك أوزان وعدات مجموعتك التالية بناءً على أداء آخر تمرين لمنع الثبات العضلي وكسر الأرقام.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="p-7 rounded-3xl bg-[#0F1116] border border-white/10 hover:border-blue-500/40 transition-all duration-300 group hover:-translate-y-1 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center text-2xl mb-5 group-hover:scale-110 transition-transform">
              💬
            </div>
            <h3 className="text-lg font-black text-white mb-2">كوتش ذكاء اصطناعي 24/7</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              مساعدك اللحظي في الجيم: اسأله عن بدائل الأجهزة المزدحمة بالدمبل، أو تكنيك التمارين، أو تظبيط وجبة قبل التمرين في أي وقت.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="p-7 rounded-3xl bg-[#0F1116] border border-white/10 hover:border-blue-500/40 transition-all duration-300 group hover:-translate-y-1 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center text-2xl mb-5 group-hover:scale-110 transition-transform">
              ⏱️
            </div>
            <h3 className="text-lg font-black text-white mb-2">مؤقت راحة ذكي بنغمات تنبيه</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              عداد تنازلي للراحة بين المجموعات مع 3 نغمات تنبيه صوتية واهتزاز هابتك للموبايل يضمن دخولك في المجموعة التالية بأقصى تركيز.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="p-7 rounded-3xl bg-[#0F1116] border border-white/10 hover:border-blue-500/40 transition-all duration-300 group hover:-translate-y-1 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center text-2xl mb-5 group-hover:scale-110 transition-transform">
              📄
            </div>
            <h3 className="text-lg font-black text-white mb-2">تصدير الخطة كـ PDF فخم</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              اطبع جدول تمرينك والدايت بالكامل بضغطة زر في ملف PDF رياضي شيك تقدر تحتفظ بيه على موبايلك أوفلاين في الجيم أو تطبعه ورقة.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Interactive Workout Splits Showcase */}
      <section id="splits" className="py-20 bg-[#0B0D11] border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">أنظمة التدريب المعتمدة</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white">اختر نظام التمرين المناسب لوقتك ومستواك</h2>
            <p className="text-xs sm:text-sm text-gray-400">تقدر تغير نظامك في أي وقت والكوتش هيحدث لك الأيام والتمارين أوتوماتيكياً.</p>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            {(['ppl', 'upper_lower', 'arnold', 'full_body'] as const).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveSplitTab(key)}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all ${
                  activeSplitTab === key
                    ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.5)] scale-105'
                    : 'bg-[#14161C] text-gray-400 hover:text-white border border-white/10 hover:border-white/20'
                }`}
              >
                {splitsData[key].title.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* Active Tab Card */}
          <div className="max-w-4xl mx-auto bg-[#101217] border border-white/15 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-white/10">
              <div>
                <span className="text-xs font-bold text-blue-400">{splitsData[activeSplitTab].badge}</span>
                <h3 className="text-2xl font-black text-white mt-1">{splitsData[activeSplitTab].title}</h3>
                <p className="text-xs text-gray-400 mt-1">{splitsData[activeSplitTab].subtitle}</p>
              </div>
              <Link
                href="/auth?mode=signup"
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shrink-0 shadow-md"
              >
                اختر هذا الجدول ⚡
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {splitsData[activeSplitTab].days.map((day, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-[#171A21] border border-white/10 flex items-start gap-3">
                  <span className="text-2xl shrink-0">{day.icon}</span>
                  <div>
                    <h4 className="font-bold text-white text-sm">{day.name}</h4>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">{day.focus}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. Visual Exercise Lab (معمل التمارين الواقعية) */}
      <section id="exercises" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">معمل التمارين وكور كمال الأجسام</span>
          <h2 className="text-3xl sm:text-5xl font-black text-white">تمارين أساسية مدعومة بالشرح العلمي</h2>
          <p className="text-xs sm:text-sm text-gray-400">
            كل تمرين في المنصة مزود بصور توضيحية لتكنيك الأداء، العضلات المستهدفة، ومعدلات الأوزان المقترحة.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exerciseShowcase.map((ex, idx) => (
            <div key={idx} className="bg-[#0E1015] border border-white/10 rounded-3xl overflow-hidden shadow-xl hover:border-blue-500/40 transition-all group">
              <div className="relative h-56 w-full overflow-hidden">
                <Image
                  src={ex.image}
                  alt={ex.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E1015] via-transparent to-transparent"></div>
                <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-black bg-blue-600/90 text-white backdrop-blur-md shadow-md">
                  {ex.badge}
                </span>
              </div>
              <div className="p-5 space-y-2">
                <h3 className="font-black text-white text-base group-hover:text-blue-300 transition-colors">
                  {ex.name}
                </h3>
                <p className="text-xs text-gray-400">
                  <span className="text-gray-300 font-semibold">العضلات المستهدفة: </span>{ex.target}
                </p>
                <div className="pt-2 flex items-center justify-between text-xs border-t border-white/10 text-gray-300">
                  <span>البروتوكول المقترح:</span>
                  <strong className="text-blue-400 font-mono">{ex.sets}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Comparison Matrix: Why Apex Fit AI? */}
      <section className="py-20 bg-[#0B0D11] border-y border-white/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center space-y-3 mb-12">
            <h2 className="text-3xl font-black text-white">مقارنة: لماذا يختار الأبطال Apex Fit AI؟</h2>
            <p className="text-xs text-gray-400">الفرق بين التدريب العشوائي، التطبيقات الجاهزة، والنظام العلمي التكاملي.</p>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-white/10 bg-[#0E1015] shadow-2xl">
            <table className="w-full text-right text-xs sm:text-sm">
              <thead className="bg-[#151820] text-gray-300 border-b border-white/10">
                <tr>
                  <th className="p-4 sm:p-5 font-bold">الميزة الرياضية</th>
                  <th className="p-4 sm:p-5 font-black text-blue-400 bg-blue-600/10 border-x border-blue-500/20 text-center">
                    Apex Fit AI + الكوتش
                  </th>
                  <th className="p-4 sm:p-5 font-bold text-gray-400 text-center">التطبيقات العامة القديمة</th>
                  <th className="p-4 sm:p-5 font-bold text-gray-400 text-center">التدريب العشوائي الفردي</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-gray-300">
                <tr>
                  <td className="p-4 font-semibold">بوابة حية لربط كوتشك وتعديل الخطة لايف</td>
                  <td className="p-4 text-center font-bold text-emerald-400 bg-blue-600/5 border-x border-blue-500/20">✅ نعم (Coach Portal)</td>
                  <td className="p-4 text-center text-rose-400">❌ لا يوجد</td>
                  <td className="p-4 text-center text-rose-400">❌ لا يوجد</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold">حساب الماكروز بالجرام حسب التعديلات اليومية</td>
                  <td className="p-4 text-center font-bold text-emerald-400 bg-blue-600/5 border-x border-blue-500/20">✅ حساب فوري دقيق</td>
                  <td className="p-4 text-center text-amber-400">⚠️ تقديرات عشوائية</td>
                  <td className="p-4 text-center text-rose-400">❌ بالبركة والإحساس</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold">بدائل فورية بالدمبل عند انشغال أجهزة الجيم</td>
                  <td className="p-4 text-center font-bold text-emerald-400 bg-blue-600/5 border-x border-blue-500/20">✅ كوتش AI يرد بلحظتها</td>
                  <td className="p-4 text-center text-rose-400">❌ جداول ثابتة بي دي إف</td>
                  <td className="p-4 text-center text-rose-400">❌ تمرين بديل غير مدروس</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold">زيادة دورية محسوبة في الأوزان (Overload)</td>
                  <td className="p-4 text-center font-bold text-emerald-400 bg-blue-600/5 border-x border-blue-500/20">✅ خوارزمية ذكية متقدمة</td>
                  <td className="p-4 text-center text-rose-400">❌ تسجيل يدوي صامت</td>
                  <td className="p-4 text-center text-rose-400">❌ ثبات مزمن في المستوى</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold">مؤقت راحة صوتي واهتزاز هابتك بين المجموعات</td>
                  <td className="p-4 text-center font-bold text-emerald-400 bg-blue-600/5 border-x border-blue-500/20">✅ مدمج 3 نغمات واهتزاز</td>
                  <td className="p-4 text-center text-amber-400">⚠️ مؤقت صامت عادي</td>
                  <td className="p-4 text-center text-rose-400">❌ فتح السوشيال ميديا ونسيان الوقت</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 8. Pricing & Subscription Plans */}
      <section id="pricing" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">باقات شفافة وبسيطة</span>
          <h2 className="text-3xl sm:text-5xl font-black text-white">اختر خطة انطلاقك نحو البطولة</h2>
          <p className="text-xs sm:text-sm text-gray-400">
            ابدأ مجاناً أو انضم للمحترفين وباقات الـ VIP مع كوتش خاص معتمد.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Plan 1: Free */}
          <div className="rounded-3xl bg-[#0E1015] border border-white/10 p-7 flex flex-col justify-between space-y-6 shadow-xl">
            <div className="space-y-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-gray-300">
                الباقة المجانية
              </span>
              <div>
                <span className="text-4xl font-black text-white">0</span>
                <span className="text-xs text-gray-400 font-bold"> ج.م / مجاناً للأبد</span>
              </div>
              <p className="text-xs text-gray-400">لكل بطل عايز يبدأ تدريب منظم ويحسب سعراته بدون تكلفة.</p>
              <ul className="space-y-2.5 text-xs text-gray-300 pt-2 border-t border-white/10">
                <li className="flex items-center gap-2"><span>✓</span> <span>جدول تدريب متكامل للهدف</span></li>
                <li className="flex items-center gap-2"><span>✓</span> <span>حساب السعرات والماكروز بالجرام</span></li>
                <li className="flex items-center gap-2"><span>✓</span> <span>5 استشارات AI يومياً (تتجدد كل 24 ساعة)</span></li>
                <li className="flex items-center gap-2"><span>✓</span> <span>مؤقت الراحة الصوتي وتصدير PDF</span></li>
              </ul>
            </div>
            <Link
              href="/auth?mode=signup"
              className="w-full text-center py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all"
            >
              ابدأ مجاناً الآن
            </Link>
          </div>

          {/* Plan 2: Pro (Featured) */}
          <div className="rounded-3xl bg-[#12151C] border-2 border-blue-500 p-7 flex flex-col justify-between space-y-6 shadow-[0_0_40px_rgba(59,130,246,0.25)] relative">
            <span className="absolute -top-3.5 right-6 px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg">
              الأكثر طلباً 🔥
            </span>
            <div className="space-y-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                باقة المحترفين (Apex Pro)
              </span>
              <div>
                <span className="text-4xl font-black text-white">199</span>
                <span className="text-xs text-gray-400 font-bold"> ج.م / شهر</span>
              </div>
              <p className="text-xs text-gray-400">للاعب الجيم الجاد اللي عايز كوتش AI غير محدود وبدائل لحظية.</p>
              <ul className="space-y-2.5 text-xs text-gray-200 pt-2 border-t border-white/10">
                <li className="flex items-center gap-2 text-blue-300"><span>✓</span> <strong>شات ذكاء اصطناعي غير محدود (بلا كوتة)</strong></li>
                <li className="flex items-center gap-2"><span>✓</span> <span>تحليل أوزان الـ Progressive Overload المتقدم</span></li>
                <li className="flex items-center gap-2"><span>✓</span> <span>بدائل فورية للأجهزة والأكل بالجرام</span></li>
                <li className="flex items-center gap-2"><span>✓</span> <span>أولوية المعالجة الفائقة في الردود</span></li>
              </ul>
            </div>
            <Link
              href="/auth?mode=signup"
              className="w-full text-center py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs transition-all shadow-lg shadow-blue-600/30"
            >
              اشترك في Apex Pro ⚡
            </Link>
          </div>

          {/* Plan 3: VIP Coach */}
          <div className="rounded-3xl bg-[#14120E] border border-amber-500/40 p-7 flex flex-col justify-between space-y-6 shadow-xl">
            <div className="space-y-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                كوتش بشري VIP + ذكاء اصطناعي
              </span>
              <div>
                <span className="text-4xl font-black text-white">499</span>
                <span className="text-xs text-gray-400 font-bold"> ج.م / شهر</span>
              </div>
              <p className="text-xs text-gray-400">التجربة الكاملة: مدرب بشري معتمد يتابعك عبر المنصة + AI غير محدود.</p>
              <ul className="space-y-2.5 text-xs text-gray-300 pt-2 border-t border-white/10">
                <li className="flex items-center gap-2 text-amber-300"><span>✓</span> <strong>ربط مباشر بمدرب معتمد (Coach Portal)</strong></li>
                <li className="flex items-center gap-2 text-amber-300"><span>✓</span> <span>مراجعة أسبوعية للصور والوزن (Check-in)</span></li>
                <li className="flex items-center gap-2"><span>✓</span> <span>تعديل السعرات والتمارين بواسطة كوتشك</span></li>
                <li className="flex items-center gap-2"><span>✓</span> <span>ذكاء اصطناعي غير محدود 24/7</span></li>
              </ul>
            </div>
            <Link
              href="/auth?mode=signup"
              className="w-full text-center py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs transition-all shadow-lg shadow-amber-500/20"
            >
              انضم لباقة الكوتش VIP 👑
            </Link>
          </div>
        </div>
      </section>

      {/* 9. FAQ Accordion Section */}
      <section id="faq" className="py-20 bg-[#0B0D11] border-t border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center space-y-3 mb-12">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">إجابات واضحة</span>
            <h2 className="text-3xl font-black text-white">الأسئلة الشائعة</h2>
            <p className="text-xs text-gray-400">كل ما تريد معرفته عن المنصة وكيف تخدمك وتخدم مدربك.</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div 
                key={idx}
                className="rounded-2xl bg-[#101217] border border-white/10 overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                  className="w-full p-5 text-right flex items-center justify-between text-sm sm:text-base font-bold text-white hover:text-blue-300 transition-colors"
                >
                  <span>{faq.q}</span>
                  <span className="text-blue-400 text-lg mr-2 font-mono shrink-0">
                    {expandedFaq === idx ? '−' : '+'}
                  </span>
                </button>
                {expandedFaq === idx && (
                  <div className="p-5 pt-0 text-xs sm:text-sm text-gray-300 leading-relaxed border-t border-white/5 bg-[#0C0E12]/50">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. Final Heroic Call to Action */}
      <section className="py-24 relative overflow-hidden bg-gradient-to-b from-[#0B0D11] to-[#07080A] border-t border-white/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-8 relative z-10">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center text-3xl shadow-[0_0_30px_rgba(59,130,246,0.3)]">
            ⚡
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white">
            جاهز تكسر أرقامك القياسية وتبني فورمة تفتخر بيها؟
          </h2>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-gray-300">
            انضم الآن لآلاف الأبطال والمدربين الذين يعتمدون على Apex Fit AI في تنظيم تدريبهم، حساب ماكروز أكلهم، وقيادة رحلتهم الرياضية بأعلى دقة علمية.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/auth?mode=signup"
              className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-base shadow-[0_0_35px_rgba(59,130,246,0.5)] transition-all hover:scale-105"
            >
              انضم الآن مجاناً 🚀
            </Link>
            <Link
              href="/auth"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-gray-200 font-bold text-sm transition-all"
            >
              تسجيل الدخول للحساب
            </Link>
          </div>
        </div>
      </section>

      {/* 11. Footer */}
      <footer className="py-12 bg-[#050608] border-t border-white/10 text-xs text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <ApexLogo size="sm" showText={true} />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-gray-400 text-xs">
            <a href="#about" className="hover:text-white transition-colors">عن المنصة</a>
            <a href="#coach-partner" className="hover:text-amber-300 transition-colors">مساعد الكوتش</a>
            <a href="#features" className="hover:text-white transition-colors">الميزات</a>
            <a href="#splits" className="hover:text-white transition-colors">جداول التدريب</a>
            <a href="#pricing" className="hover:text-white transition-colors">الباقات</a>
            <Link href="/auth" className="hover:text-white transition-colors">تسجيل الدخول</Link>
          </div>

          <div className="text-gray-400 text-center md:text-left font-mono">
            © {new Date().getFullYear()} Apex Fit AI. Designed for elite athletes & coaches.
          </div>
        </div>
      </footer>
    </div>
  );
}
