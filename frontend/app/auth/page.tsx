'use client';

import { useState } from 'react';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import SignupSteps from '@/components/SignupSteps';
import ApexLogo from '@/components/ApexLogo';

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password }),
      });

      if (res.ok) {
        window.location.href = '/dashboard';
      } else {
        toast.error('Invalid email or password');
      }
    } catch (error) {
      toast.error('Connection error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen text-white flex items-center justify-center p-4 md:p-8 font-sans overflow-hidden bg-[#0A0B0D]">
      {/* Full Page Background Image */}
      <Image
        src="/images/auth_hero_gym.jpg"
        alt="Full Page Gym Background"
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-35 transform scale-105"
      />

      {/* Ambient Gradient Overlay & Vignette */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#0A0B0D] via-[#0A0B0D]/85 to-[#0A0B0D]/75 backdrop-blur-md"></div>

      {/* Ambient Neon Blobs */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-600/25 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-indigo-600/25 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="relative z-10 max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 bg-[#141619]/85 border border-white/15 rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.9)] backdrop-blur-2xl">
        
        {/* Left Column: Visual Brand Hero */}
        <div className="lg:col-span-6 relative p-8 md:p-12 flex flex-col justify-between overflow-hidden min-h-[450px] lg:min-h-[650px] border-b lg:border-b-0 lg:border-r border-white/10">
          {/* Internal Visual Image */}
          <Image
            src="/images/auth_hero_gym.jpg"
            alt="Gym Aesthetic"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover opacity-50 transform scale-105 hover:scale-100 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B0D] via-[#0A0B0D]/70 to-transparent"></div>

          {/* Top Brand Tag */}
          <div className="relative z-10">
            <ApexLogo size="md" />
          </div>

          {/* Middle Hero Headline */}
          <div className="relative z-10 space-y-4 my-auto py-8">
            <span className="inline-block px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full text-xs font-bold uppercase tracking-wider">
              AI Coach & Coach Portal
            </span>
            <h1 className="text-3xl md:text-5xl font-black leading-tight tracking-tight">
              Transform Your Fitness <br />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">
                With Precision AI.
              </span>
            </h1>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed max-w-md">
              Adaptive progressive overload tracking, real-time macro calculations, and direct coach portal integration.
            </p>

            {/* Feature Bullets */}
            <div className="space-y-2.5 pt-4">
              <div className="flex items-center gap-3 text-xs font-semibold text-gray-200">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 text-[10px]">✓</span>
                Adaptive Weight Increments (+1.0kg Isolation / +2.5kg Compound)
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold text-gray-200">
                <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30 text-[10px]">✓</span>
                SSE Streaming Coach Chat & Weekly Check-ins
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold text-gray-200">
                <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30 text-[10px]">✓</span>
                Dual-Role Access for Trainees & Head Coaches
              </div>
            </div>
          </div>

          {/* Bottom Trust Badge */}
          <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
            <span>🚀 100% Free Local AI Engine</span>
            <span className="font-mono text-emerald-400">● Live Backend Ready</span>
          </div>
        </div>

        {/* Right Column: Auth Card */}
        <div className="lg:col-span-6 p-8 md:p-12 flex flex-col justify-center bg-[#0A0B0D]/90 border-t lg:border-t-0 lg:border-l border-white/10 relative">
          
          <div className="max-w-md w-full mx-auto space-y-8">
            
            {/* Tab Switcher */}
            <div className="flex p-1 bg-[#141619] border border-white/10 rounded-2xl">
              <button 
                className={`flex-1 py-3 text-center rounded-xl font-bold text-sm transition-all duration-300 ${
                  mode === 'login' 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.4)]' 
                    : 'text-gray-400 hover:text-white'
                }`}
                onClick={() => setMode('login')}
              >
                Sign In
              </button>
              <button 
                className={`flex-1 py-3 text-center rounded-xl font-bold text-sm transition-all duration-300 ${
                  mode === 'signup' 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.4)]' 
                    : 'text-gray-400 hover:text-white'
                }`}
                onClick={() => setMode('signup')}
              >
                Create Account
              </button>
            </div>

            {/* Form Section */}
            {mode === 'login' ? (
              <form onSubmit={handleLogin} className="flex flex-col gap-5">
                <div>
                  <h3 className="text-2xl font-black text-white">Welcome Back</h3>
                  <p className="text-xs text-gray-400 mt-1">Enter your credentials to access your dashboard</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">Email Address</label>
                    <input 
                      type="email" 
                      placeholder="name@example.com" 
                      required 
                      className="w-full bg-[#141619] border border-white/10 text-white rounded-xl p-3.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">Password</label>
                    <input 
                      type="password" 
                      placeholder="••••••••" 
                      required 
                      className="w-full bg-[#141619] border border-white/10 text-white rounded-xl p-3.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="w-full py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl text-base transition-all duration-300 shadow-[0_0_25px_rgba(59,130,246,0.4)] mt-2" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Signing In...' : 'Sign In To Account →'}
                </button>
              </form>
            ) : (
              <SignupSteps />
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
