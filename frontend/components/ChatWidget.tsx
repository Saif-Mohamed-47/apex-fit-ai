'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

export interface VerifiedTargets {
  protein_g: number;
  target_calories: number;
  carbs_g: number;
  fat_g: number;
  workout_split: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  targets?: VerifiedTargets;
  flagMismatch?: boolean;
  flagMessage?: string;
}

// Athletic Gym Icons
const DumbbellIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6.5 6.5 11 11" />
    <path d="m21 21-1-1" />
    <path d="m3 3 1 1" />
    <path d="m18 22 4-4" />
    <path d="m2 6 4-4" />
    <path d="m3 10 7-7" />
    <path d="m14 21 7-7" />
  </svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 hover:text-white">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const SendIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
);

const VerifiedTargetsCard = ({ targets }: { targets: VerifiedTargets }) => (
  <div className="mb-2 p-3 bg-[#1E232A] border border-[#3B82F6]/30 rounded-xl text-xs text-gray-200 shadow-md">
    <div className="flex items-center gap-1.5 font-bold text-[#60A5FA] mb-1.5">
      <span className="w-2 h-2 rounded-full bg-[#3B82F6] animate-pulse"></span>
      VERIFIED SYSTEM TARGETS
    </div>
    <div className="grid grid-cols-2 gap-1.5 text-gray-300">
      <div><span className="text-gray-400">Protein:</span> <strong className="text-white">{targets.protein_g}g</strong></div>
      <div><span className="text-gray-400">Calories:</span> <strong className="text-white">{targets.target_calories} kcal</strong></div>
      <div className="col-span-2"><span className="text-gray-400">Split:</span> <strong className="text-white">{targets.workout_split}</strong></div>
    </div>
  </div>
);

export default function ChatWidget({ userGender = 'male', coachGender = 'male' }: { userGender?: string; coachGender?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const stopStreaming = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
  };

  const sendMessage = async (presetText?: string) => {
    const textToSend = presetText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: textToSend };
    const historyPayload = messages.map(m => ({ role: m.role, content: m.content }));
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    if (!presetText) setInput('');
    setIsLoading(true);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    // Create draft assistant message slot
    const assistantIndex = newMessages.length;
    setMessages([...newMessages, { role: 'assistant', content: '' }]);

    try {
      const res = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend, history: historyPayload }),
        signal: controller.signal
      });

      if (!res.ok || !res.body) {
        throw new Error('Streaming connection failed');
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const payload = JSON.parse(line.slice(6).trim());
              
              if (payload.event === 'targets') {
                // Event 1: Verified Targets FIRST
                setMessages(prev => {
                  const copy = [...prev];
                  if (copy[assistantIndex]) {
                    copy[assistantIndex] = { ...copy[assistantIndex], targets: payload.data };
                  }
                  return copy;
                });
              } else if (payload.event === 'chunk') {
                // Token stream chunk
                setMessages(prev => {
                  const copy = [...prev];
                  if (copy[assistantIndex]) {
                    copy[assistantIndex] = {
                      ...copy[assistantIndex],
                      content: copy[assistantIndex].content + payload.content
                    };
                  }
                  return copy;
                });
              } else if (payload.event === 'flag') {
                // Validator flag (only flags, never rewrites text)
                if (payload.mismatch) {
                  setMessages(prev => {
                    const copy = [...prev];
                    if (copy[assistantIndex]) {
                      copy[assistantIndex] = {
                        ...copy[assistantIndex],
                        flagMismatch: true,
                        flagMessage: payload.message
                      };
                    }
                    return copy;
                  });
                }
              }
            } catch (err) {
              console.error('SSE parse error:', err);
            }
          }
        }
      }
    } catch (e: any) {
      if (e.name === 'AbortError') {
        console.log('Stream aborted by user gracefully');
      } else {
        setMessages(prev => {
          const copy = [...prev];
          if (copy[assistantIndex]) {
            copy[assistantIndex] = {
              ...copy[assistantIndex],
              content: copy[assistantIndex].content || 'عذراً، انقطع الاتصال المباشر بالكوتش. حاول مجدداً.'
            };
          }
          return copy;
        });
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const isFemaleCoach = coachGender === 'female';
  const coachImage = isFemaleCoach ? '/images/female_coach_portrait.jpg' : '/images/coach_portrait.jpg';
  const coachTitle = isFemaleCoach ? 'كابتن مدربة AI' : 'كابتن Apex AI';

  const quickPrompts = [
    '🏋️ إيه أحسن بديل لتمرينة البنش برس لو الجهاز مشغول؟',
    '🥗 إزاي أحسب احتياجي اليومي من البروتين بدقة؟',
    '⚡ إزاي أزود أوزاني بأمان بدون إصابات؟',
    '🛡️ حاسس بإرهاق، أتمرن النهاردة ولا آخد راحة؟'
  ];

  return (
    <div 
      id="apex-coach-chat-widget"
      className="fixed z-[9999]"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        left: 'auto',
        top: 'auto',
        zIndex: 9999,
      }}
    >
      {/* Athletic Apex AI Coach Floating Launcher (Far Bottom-Right) */}
      <button 
        type="button"
        onClick={() => setIsOpen(true)}
        className={`group relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#0E1013] border-2 shadow-[0_8px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(59,130,246,0.35)] hover:shadow-[0_8px_35px_rgba(59,130,246,0.6)] flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer ${
          isFemaleCoach 
            ? 'border-pink-500/80 hover:border-pink-400' 
            : 'border-blue-500/80 hover:border-blue-400'
        } ${isOpen ? 'hidden' : 'flex'}`}
        aria-label="تحدث مع كوتش Apex Fit AI"
      >
        {/* Full Coach Portrait Frame */}
        <div className="relative w-full h-full rounded-full overflow-hidden">
          <Image 
            src={coachImage} 
            alt="Coach Avatar" 
            fill 
            className="object-cover group-hover:scale-110 transition-transform duration-300"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
        </div>

        {/* Live Online Glowing Beacon */}
        <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-400 border-2 border-[#0E1013] rounded-full shadow-md animate-pulse"></span>

        {/* Athletic AI Spark Capsule Badge */}
        <span className={`absolute -top-1 -left-1 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-lg border border-white/20 flex items-center gap-0.5 ${
          isFemaleCoach ? 'bg-gradient-to-r from-pink-600 to-rose-600' : 'bg-gradient-to-r from-blue-600 to-indigo-600'
        }`}>
          <span>⚡</span>
          <span>AI</span>
        </span>

        {/* Hover Tooltip (Extends towards the left into empty space) */}
        <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-[#0E1013]/95 border border-white/15 px-3 py-1.5 rounded-xl shadow-2xl whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 backdrop-blur-md hidden sm:block">
          <div className="flex items-center gap-1.5 leading-none">
            <span className="text-xs font-black text-white">{coachTitle}</span>
            <span className="text-[9px] font-bold text-emerald-400">🟢 متصل</span>
          </div>
          <span className="text-[10px] text-gray-300 block mt-1">اضغط للتحدث مع الكوتش</span>
        </div>
      </button>

      {/* Chat Panel Window (Anchored cleanly to Far Bottom-Right) */}
      <div 
        className={`w-[92vw] sm:w-96 bg-[#0E1013] border border-white/15 rounded-3xl shadow-2xl flex flex-col h-[520px] transition-all duration-300 ease-in-out origin-bottom-right overflow-hidden ${
          isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'
        }`}
        style={{
          position: 'absolute',
          bottom: '0',
          right: '0',
        }}
      >
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex justify-between items-center text-white bg-gradient-to-r from-[#171A21] to-[#0E1013]">
          <div className="flex items-center gap-3">
            <div className={`relative w-10 h-10 rounded-full overflow-hidden border-2 shrink-0 ${
              isFemaleCoach ? 'border-pink-500/60 shadow-[0_0_12px_rgba(236,72,153,0.3)]' : 'border-blue-500/60 shadow-[0_0_12px_rgba(59,130,246,0.3)]'
            }`}>
              <Image 
                src={coachImage} 
                alt="Coach Avatar" 
                fill 
                className="object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-tight">
                <span className="text-sm font-black">{coachTitle}</span>
                <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded-full border border-emerald-500/30">Live AI</span>
              </div>
              <p className="text-[10px] text-gray-400 font-normal">
                {userGender === 'female' ? '🌸 برنامج مخصص للمتدربات' : '⚡ برنامج مخصص للمتدربين'}
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={() => setIsOpen(false)} 
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center transition-colors"
            aria-label="إغلاق المحادثة"
          >
            <CloseIcon />
          </button>
        </div>
        
        {/* Messages Stream Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar" ref={scrollRef}>
          {messages.length === 0 && (
            <div className="space-y-3">
              <div className={`p-4 rounded-2xl text-xs border leading-relaxed ${
                userGender === 'female'
                  ? 'bg-pink-950/20 border-pink-500/20 text-pink-100'
                  : 'bg-blue-950/20 border-blue-500/20 text-blue-100'
              }`}>
                <p className="font-black text-sm mb-1.5 flex items-center gap-1.5">
                  <span>{userGender === 'female' ? 'أهلاً بيكي يا بطلة! 💖' : 'أهلاً بيك يا وحش! ⚡'}</span>
                </p>
                <p className="text-gray-300 leading-relaxed">
                  {userGender === 'female'
                    ? 'أنا معاكي خطوة بخطوة؛ اسأليني في أي وقت عن تكنيك التمارين، بدائل الأجهزة، أو تعديل السعرات والماكروز بدقة.'
                    : 'أنا معاك خطوة بخطوة؛ اسألني عن التكنيك الصح، أوزان التمارين، بدائل الأجهزة بالدمبل، أو تظبيط الماكروز والبروتين.'}
                </p>
              </div>

              {/* Quick Prompt Chips */}
              <div className="space-y-1.5 pt-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  💡 أسئلة سريعة للكوتش:
                </p>
                <div className="flex flex-col gap-1.5">
                  {quickPrompts.map((prompt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => sendMessage(prompt)}
                      className="text-right text-xs bg-[#16191F] hover:bg-[#1E232B] text-gray-300 hover:text-white p-2.5 rounded-xl border border-white/5 hover:border-blue-500/30 transition-all text-xs flex items-center justify-between group"
                    >
                      <span className="truncate">{prompt}</span>
                      <span className="text-blue-400 group-hover:translate-x-[-2px] transition-transform text-[11px]">←</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div 
              key={i} 
              className={`p-3.5 rounded-2xl text-xs sm:text-sm max-w-[88%] leading-relaxed ${
                m.role === 'user' 
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white mr-auto shadow-md' 
                  : 'bg-[#16191F] border border-white/10 text-gray-200 ml-auto'
              }`}
            >
              {m.targets && <VerifiedTargetsCard targets={m.targets} />}
              <div className="whitespace-pre-line">{m.content}</div>
              {m.flagMismatch && (
                <div className="mt-2 text-[11px] text-amber-400 bg-amber-950/40 border border-amber-500/30 p-2 rounded-lg flex items-center gap-1.5">
                  <span>⚠️</span>
                  <span>تنبيه تدقيق الماكروز: {m.flagMessage}</span>
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center justify-between text-xs text-blue-300 bg-[#16191F] p-3 rounded-xl border border-blue-500/20 animate-pulse">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping"></span>
                <span>الكوتش بيكتب رده المباشر...</span>
              </div>
              <button 
                type="button"
                onClick={stopStreaming} 
                className="text-red-400 hover:text-red-300 font-bold text-[11px] bg-red-950/40 hover:bg-red-950/70 px-2.5 py-1 rounded-lg border border-red-500/30 transition-colors"
              >
                إيقاف ✕
              </button>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-white/10 flex gap-2 bg-[#121418]">
          <input 
            className="flex-1 bg-[#0A0B0D] text-white px-3.5 py-2.5 rounded-xl text-xs sm:text-sm outline-none border border-white/10 focus:border-blue-500 transition-colors disabled:opacity-50" 
            value={input} 
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="اسأل الكوتش عن تمرينك، أوزانك، أو أكلك..."
            disabled={isLoading}
          />
          <button 
            type="button"
            onClick={() => sendMessage()} 
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold disabled:opacity-50 transition-all flex items-center gap-1.5 shadow-lg shadow-blue-600/30 shrink-0" 
            disabled={isLoading || !input.trim()}
          >
            <span>إرسال</span>
            <SendIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
