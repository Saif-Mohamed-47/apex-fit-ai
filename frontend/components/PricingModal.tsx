'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

interface PricingModalProps {
  currentCoachId?: number | null;
  onSuccess?: () => void;
}

export default function PricingModal({ currentCoachId, onSuccess }: PricingModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'pro' | 'vip_coach'>('vip_coach');
  const [step, setStep] = useState<'plans' | 'checkout' | 'success'>('plans');
  const [paymentMethod, setPaymentMethod] = useState<'vodafone_cash' | 'card'>('vodafone_cash');

  // Form Fields
  const [senderPhone, setSenderPhone] = useState('');
  const [transferRef, setTransferRef] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<any>(null);

  const handleSelectPlan = (plan: 'pro' | 'vip_coach') => {
    setSelectedPlan(plan);
    setStep('checkout');
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload: any = {
        plan_id: selectedPlan,
        payment_method: paymentMethod,
      };

      if (paymentMethod === 'vodafone_cash') {
        if (!senderPhone.trim()) {
          toast.error('برجاء كتابة رقم الهاتف المحول منه');
          setIsSubmitting(false);
          return;
        }
        payload.sender_phone = senderPhone;
        payload.transfer_ref = transferRef || 'VF-' + Math.floor(Math.random() * 900000 + 100000);
      } else {
        if (!cardNumber.trim() || cardNumber.length < 16) {
          toast.error('برجاء إدخال رقم كارت صحيح مكون من 16 رقم');
          setIsSubmitting(false);
          return;
        }
        payload.card_number = cardNumber.slice(-4);
        payload.card_expiry = cardExpiry || '12/28';
      }

      const res = await fetch('/api/payments/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('فشلت معالجة عملية الدفع');
      }

      const data = await res.json();
      setSuccessData(data);
      setStep('success');
      toast.success('تم تأكيد الدفع وتفعيل الباقة بنجاح! 🎉');
      if (onSuccess) onSuccess();
    } catch (err: any) {
      toast.error(err.message || 'حدث خطأ في عملية الدفع');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetModal = () => {
    setIsOpen(false);
    setStep('plans');
    setSuccessData(null);
  };

  return (
    <>
      {/* Trigger Button on Dashboard Header */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="px-3.5 py-2.5 bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 text-amber-300 font-bold rounded-xl text-xs flex items-center gap-1.5 border border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.2)] transition-all shrink-0"
      >
        <span>👑</span>
        <span className="hidden sm:inline">باقات الاشتراك والمدرب VIP</span>
        <span className="sm:hidden">باقات VIP</span>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-[#0E1013] border border-white/15 rounded-3xl shadow-2xl p-5 sm:p-8 space-y-6 text-white custom-scrollbar">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <span className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center text-xl shrink-0">
                  👑
                </span>
                <div>
                  <h3 className="font-black text-xl text-white">باقات اشتراك Apex Fit AI</h3>
                  <p className="text-xs text-gray-400">طوّر مستواك الرياضي مع الذكاء الاصطناعي أو كوتش خاص VIP</p>
                </div>
              </div>
              <button
                type="button"
                onClick={resetModal}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center font-bold text-lg transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Step 1: Plan Selection Cards */}
            {step === 'plans' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Plan 1: Apex Pro Athlete */}
                  <div className="bg-[#141619] rounded-2xl border border-blue-500/40 p-5 flex flex-col justify-between space-y-4 shadow-xl hover:border-blue-400 transition-all group">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30">
                          ⚡ باقة المحترفين (Pro)
                        </span>
                        <div className="text-right">
                          <span className="text-2xl font-black text-white">199</span>
                          <span className="text-xs text-gray-400 font-bold"> ج.م/شهر</span>
                        </div>
                      </div>

                      <h4 className="font-black text-base text-white">Apex Pro Athlete</h4>
                      <p className="text-xs text-gray-400">للمتدرب الجاد الذي يريد أقصى استفادة من الذكاء الاصطناعي والتتبع الذكي.</p>

                      <ul className="space-y-2 text-xs text-gray-300 pt-2 border-t border-white/5">
                        <li className="flex items-center gap-2">
                          <span className="text-blue-400 font-bold">✓</span>
                          <span>كوتش ذكاء اصطناعي غير محدود 24/7</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-blue-400 font-bold">✓</span>
                          <span>مكتبة صور التمارين والبدائل الكاملة (دمبل وأجهزة)</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-blue-400 font-bold">✓</span>
                          <span>تصدير خطة التمارين والتغذية كـ PDF غير محدود</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-blue-400 font-bold">✓</span>
                          <span>عداد الراحة الذكي المزود بتنبيهات صوتية حية</span>
                        </li>
                      </ul>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSelectPlan('pro')}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition-all shadow-lg shadow-blue-600/30"
                    >
                      اشترك الآن في Pro (199 ج.م)
                    </button>
                  </div>

                  {/* Plan 2: Private 1-on-1 VIP Coach (Most Popular) */}
                  <div className="bg-gradient-to-b from-[#1C1814] to-[#141619] rounded-2xl border-2 border-amber-500/60 p-5 flex flex-col justify-between space-y-4 shadow-2xl relative group">
                    <div className="absolute -top-3 right-5">
                      <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-lg">
                        ⭐ الأكثر طلباً للمحترفين
                      </span>
                    </div>

                    <div className="space-y-3 pt-1">
                      <div className="flex justify-between items-start">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          👑 كوتش خاص VIP مباشر
                        </span>
                        <div className="text-right">
                          <span className="text-2xl font-black text-amber-300">499</span>
                          <span className="text-xs text-gray-400 font-bold"> ج.م/شهر</span>
                        </div>
                      </div>

                      <h4 className="font-black text-base text-white">Private Coach 1-on-1</h4>
                      <p className="text-xs text-gray-400">تدريب برايفت حقيقي مع مدرب معتمد يتابعك ويعدل لك خطتك أسبوعياً.</p>

                      <ul className="space-y-2 text-xs text-gray-300 pt-2 border-t border-white/5">
                        <li className="flex items-center gap-2 text-amber-300 font-bold">
                          <span>✓</span>
                          <span>تفعيل كود مدرب خاص فورياً وتلقائياً (COACH-VIP)</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-amber-400 font-bold">✓</span>
                          <span>متابعة أسبوعية وتعديل مباشر للسعرات والماكروز</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-amber-400 font-bold">✓</span>
                          <span>مراجعة أسبوعية لصور التطور وقياسات الجسم</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-amber-400 font-bold">✓</span>
                          <span>شامل كافة مميزات باقة Pro والـ AI بالكامل</span>
                        </li>
                      </ul>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSelectPlan('vip_coach')}
                      className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-black rounded-xl text-xs transition-all shadow-lg shadow-amber-500/30"
                    >
                      احصل على كوتش خاص VIP (499 ج.م)
                    </button>
                  </div>
                </div>

                <div className="bg-[#121418] p-3.5 rounded-xl border border-white/5 text-center text-xs text-gray-400">
                  🔒 جميع المعاملات مشفرة وآمنة 100% مع ضمان استرجاع خلال 14 يوماً.
                </div>
              </div>
            )}

            {/* Step 2: Checkout & Payment Methods */}
            {step === 'checkout' && (
              <form onSubmit={handleCheckout} className="space-y-6">
                <div className="bg-[#141619] p-4 rounded-2xl border border-white/10 flex justify-between items-center">
                  <div>
                    <span className="text-xs text-gray-400">الباقة المختارة:</span>
                    <h4 className="font-black text-sm text-white">
                      {selectedPlan === 'vip_coach' ? '👑 كوتش خاص VIP (Private 1-on-1)' : '⚡ باقة المحترفين Apex Pro'}
                    </h4>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-black text-amber-300">
                      {selectedPlan === 'vip_coach' ? '499 ج.م' : '199 ج.م'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setStep('plans')}
                      className="block text-[11px] text-blue-400 underline mt-0.5"
                    >
                      تغيير الباقة
                    </button>
                  </div>
                </div>

                {/* Choose Payment Method */}
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-gray-300">
                    اختر وسيلة الدفع المناسبة لك:
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('vodafone_cash')}
                      className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                        paymentMethod === 'vodafone_cash'
                          ? 'border-red-500 bg-red-950/20 text-white shadow-lg shadow-red-500/10'
                          : 'border-white/10 bg-[#141619] text-gray-400 hover:text-white'
                      }`}
                    >
                      <span className="text-2xl">📱</span>
                      <span className="font-bold text-xs">فودافون كاش / إنستاباي</span>
                      <span className="text-[10px] text-gray-400">أو أي محفظة إلكترونية</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                        paymentMethod === 'card'
                          ? 'border-blue-500 bg-blue-950/20 text-white shadow-lg shadow-blue-500/10'
                          : 'border-white/10 bg-[#141619] text-gray-400 hover:text-white'
                      }`}
                    >
                      <span className="text-2xl">💳</span>
                      <span className="font-bold text-xs">البطاقة البنكية (فيزا / ماستر)</span>
                      <span className="text-[10px] text-gray-400">Debit / Credit Card</span>
                    </button>
                  </div>
                </div>

                {/* Payment Fields: Vodafone Cash */}
                {paymentMethod === 'vodafone_cash' && (
                  <div className="space-y-4 bg-[#141619] p-4 rounded-2xl border border-red-500/30">
                    <div className="bg-red-950/30 p-3 rounded-xl border border-red-500/20 text-xs text-red-200 space-y-1">
                      <p className="font-bold">🔴 تعليمات التحويل عبر فودافون كاش أو إنستاباي:</p>
                      <p>
                        حوّل المبلغ (<strong className="text-white">{selectedPlan === 'vip_coach' ? '499 ج.م' : '199 ج.م'}</strong>) إلى رقم المحفظة المعتمد:
                      </p>
                      <div className="p-2 bg-black/40 rounded-lg text-center font-mono font-black text-sm text-amber-300 tracking-wider">
                        01023456789
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-300">رقم الهاتف الذي قمت بالتحويل منه:</label>
                      <input
                        type="tel"
                        value={senderPhone}
                        onChange={(e) => setSenderPhone(e.target.value)}
                        placeholder="010XXXXXXXX"
                        className="w-full bg-[#0A0B0D] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-red-500"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-300">الرقم المرجعي للتحويل (اختياري):</label>
                      <input
                        type="text"
                        value={transferRef}
                        onChange={(e) => setTransferRef(e.target.value)}
                        placeholder="Ref ID أو رقم الرسالة"
                        className="w-full bg-[#0A0B0D] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-red-500"
                      />
                    </div>
                  </div>
                )}

                {/* Payment Fields: Card */}
                {paymentMethod === 'card' && (
                  <div className="space-y-4 bg-[#141619] p-4 rounded-2xl border border-blue-500/30">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-300">رقم البطاقة (16 رقم):</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                        placeholder="4123 4567 8901 2345"
                        className="w-full bg-[#0A0B0D] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono outline-none focus:border-blue-500"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-300">تاريخ الانتهاء (MM/YY):</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value.slice(0, 5))}
                          placeholder="08/28"
                          className="w-full bg-[#0A0B0D] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono outline-none focus:border-blue-500"
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-300">رمز الأمان (CVC):</label>
                        <input
                          type="password"
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, '').slice(0, 3))}
                          placeholder="123"
                          className="w-full bg-[#0A0B0D] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono outline-none focus:border-blue-500"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit Action */}
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black rounded-xl text-xs transition-all shadow-lg shadow-emerald-600/30 disabled:opacity-50"
                  >
                    {isSubmitting ? 'جاري تأكيد الدفع...' : `تأكيد الدفع (${selectedPlan === 'vip_coach' ? '499 ج.م' : '199 ج.م'}) ✓`}
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep('plans')}
                    className="py-3.5 px-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs"
                  >
                    رجوع
                  </button>
                </div>
              </form>
            )}

            {/* Step 3: Success Screen */}
            {step === 'success' && (
              <div className="text-center space-y-5 py-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center text-3xl mx-auto animate-bounce">
                  ✓
                </div>

                <div className="space-y-1">
                  <h4 className="text-xl font-black text-white">مبروك يا بطل! تم تفعيل اشتراكك بنجاح</h4>
                  <p className="text-xs text-gray-400">رقم المعاملة: {successData?.transaction_id || 'APEX-TXN-101'}</p>
                </div>

                {successData?.assigned_coach_code && (
                  <div className="bg-amber-950/30 border border-amber-500/40 rounded-2xl p-4 text-center space-y-2 max-w-md mx-auto">
                    <p className="text-xs font-bold text-amber-300">
                      👑 كود المدرب الخاص المعتمد لك:
                    </p>
                    <div className="p-3 bg-black/60 rounded-xl font-mono text-lg font-black text-white border border-amber-500/30 tracking-widest select-all">
                      {successData.assigned_coach_code}
                    </div>
                    <p className="text-[11px] text-gray-300">
                      تم ربط حسابك تلقائياً مع الكوتش في الداشبورد للمتابعة وتعديل السعرات!
                    </p>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => {
                    resetModal();
                    window.location.reload();
                  }}
                  className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl text-xs transition-all shadow-lg"
                >
                  الدخول إلى الداشبورد المطورة 🚀
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
