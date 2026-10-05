'use client';
import { useState, useRef, useEffect } from 'react';

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

// Icons
const ChatIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
  </svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 hover:text-white">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
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

export default function ChatWidget() {
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

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    const historyPayload = messages.map(m => ({ role: m.role, content: m.content }));
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
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
        body: JSON.stringify({ message: input, history: historyPayload }),
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
              content: copy[assistantIndex].content || 'Sorry, streaming connection was interrupted.'
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

  return (
    <div className="fixed bottom-6 left-6 z-50">
      {/* Launcher Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className={`w-14 h-14 bg-[#3B82F6] rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)] flex items-center justify-center hover:scale-105 transition-all duration-200 ${isOpen ? 'hidden' : 'flex'}`}
      >
        <ChatIcon />
      </button>

      {/* Chat Panel */}
      <div className={`w-88 bg-[#141619] border border-[rgba(255,255,255,0.08)] rounded-2xl shadow-2xl flex flex-col h-[460px] transition-all duration-300 ease-in-out origin-bottom-left ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}>
        <div className="p-4 border-b border-[rgba(255,255,255,0.05)] flex justify-between items-center font-bold text-white">
          <div className="flex items-center gap-2">
            <span>Fitness Coach AI</span>
            <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full border border-green-500/30">SSE Live</span>
          </div>
          <button onClick={() => setIsOpen(false)} className="p-1 rounded-full hover:bg-[rgba(255,255,255,0.1)] transition-colors">
            <CloseIcon />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-3" ref={scrollRef}>
          {messages.map((m, i) => (
            <div key={i} className={`p-3 rounded-lg text-sm max-w-[90%] ${m.role === 'user' ? 'bg-[#3B82F6] text-white ml-auto' : 'bg-[#1A1D21] border border-[rgba(255,255,255,0.08)] text-gray-200'}`}>
              {m.targets && <VerifiedTargetsCard targets={m.targets} />}
              <div>{m.content}</div>
              {m.flagMismatch && (
                <div className="mt-2 text-[11px] text-amber-400 bg-amber-950/40 border border-amber-500/30 p-1.5 rounded flex items-center gap-1">
                  <span>⚠️</span>
                  <span>Unit-adjacent number mismatch flagged: {m.flagMessage}</span>
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-center justify-between text-xs text-gray-400 italic bg-[#1A1D21] p-2 rounded-lg border border-[rgba(255,255,255,0.05)]">
              <span>Coach is typing streaming response...</span>
              <button onClick={stopStreaming} className="not-italic text-red-400 hover:text-red-300 font-bold text-[11px] bg-red-950/50 px-2 py-0.5 rounded border border-red-500/30">
                Stop
              </button>
            </div>
          )}
        </div>

        <div className="p-3 border-t border-[rgba(255,255,255,0.05)] flex gap-2">
          <input 
            className="flex-1 bg-[#0A0B0D] text-white p-2 rounded-lg text-sm outline-none disabled:opacity-50" 
            value={input} 
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="Ask a question..."
            disabled={isLoading}
          />
          <button onClick={sendMessage} className="bg-[#3B82F6] text-white px-4 rounded-lg text-sm font-bold disabled:opacity-50 hover:bg-[#2563EB] transition-colors" disabled={isLoading}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
