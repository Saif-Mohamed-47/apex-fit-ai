'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function CheckInPage() {
  const [weightKg, setWeightKg] = useState<number | ''>('');
  const [sleepHours, setSleepHours] = useState<number | ''>(7.5);
  const [energyRating, setEnergyRating] = useState<number>(4);
  const [sorenessRating, setSorenessRating] = useState<number>(2);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    fetchCheckInHistory();
  }, []);

  const fetchCheckInHistory = async () => {
    try {
      const res = await fetch('/api/check-ins');
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch {
      // ignore
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (weightKg === '') {
      toast.error('Please enter your current body weight.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/check-ins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weight_kg: Number(weightKg),
          sleep_hours: sleepHours !== '' ? Number(sleepHours) : null,
          energy_rating: energyRating,
          soreness_rating: sorenessRating,
          client_notes: notes,
        }),
      });

      if (res.ok) {
        toast.success('Weekly check-in submitted successfully!');
        setWeightKg('');
        setNotes('');
        fetchCheckInHistory();
      } else {
        toast.error('Failed to submit check-in');
      }
    } catch {
      toast.error('Network error submitting check-in');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0B0D] text-white p-6 md:p-10 font-sans">
      <div className="max-w-3xl mx-auto space-y-8">
        
        <div className="flex justify-between items-center border-b border-white/10 pb-4">
          <div>
            <span className="px-3 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full text-xs font-bold uppercase tracking-wider">
              Trainee Suite
            </span>
            <h1 className="text-3xl font-black mt-1">Weekly Check-in Form</h1>
            <p className="text-xs text-gray-400">Track weight trends, sleep, and send notes to your coach.</p>
          </div>
          <Link href="/dashboard" className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold rounded-xl">
            ← Back to Dashboard
          </Link>
        </div>

        {/* Check-In Form */}
        <form onSubmit={handleSubmit} className="bg-[#141619] border border-white/10 rounded-2xl p-8 space-y-6 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">Current Body Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                placeholder="e.g. 78.5"
                required
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value === '' ? '' : parseFloat(e.target.value))}
                className="w-full bg-[#0A0B0D] border border-white/10 text-white rounded-xl p-3.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">Avg Sleep (hours/night)</label>
              <input
                type="number"
                step="0.5"
                placeholder="e.g. 7.5"
                value={sleepHours}
                onChange={(e) => setSleepHours(e.target.value === '' ? '' : parseFloat(e.target.value))}
                className="w-full bg-[#0A0B0D] border border-white/10 text-white rounded-xl p-3.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">Energy Rating (1-5)</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    type="button"
                    key={val}
                    onClick={() => setEnergyRating(val)}
                    className={`flex-1 py-3 rounded-xl font-bold text-xs border transition-all ${
                      energyRating === val
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                        : 'bg-[#0A0B0D] border-white/10 text-gray-400'
                    }`}
                  >
                    ⚡ {val}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">Muscle Soreness (1-5)</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    type="button"
                    key={val}
                    onClick={() => setSorenessRating(val)}
                    className={`flex-1 py-3 rounded-xl font-bold text-xs border transition-all ${
                      sorenessRating === val
                        ? 'bg-red-500/20 text-red-300 border-red-500/40 shadow-[0_0_10px_rgba(239,68,68,0.3)]'
                        : 'bg-[#0A0B0D] border-white/10 text-gray-400'
                    }`}
                  >
                    💪 {val}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">Notes for your Coach / AI</label>
            <textarea
              rows={3}
              placeholder="How are you feeling this week? Any aches, diet struggles, or PRs?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-[#0A0B0D] border border-white/10 text-white rounded-xl p-3.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-sm"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl text-sm transition-all shadow-[0_0_20px_rgba(59,130,246,0.4)]"
          >
            {submitting ? 'Submitting...' : 'Submit Weekly Check-in →'}
          </button>
        </form>

        {/* Check-In History */}
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-white">Your Check-In History</h3>
          {history.length === 0 ? (
            <p className="text-xs text-gray-500 italic">No check-ins submitted yet.</p>
          ) : (
            <div className="space-y-3">
              {history.map((chk: any) => (
                <div key={chk.id} className="bg-[#141619] border border-white/10 rounded-2xl p-5 flex justify-between items-center text-xs">
                  <div>
                    <p className="font-bold text-white text-sm">Weight: {chk.weight_kg} kg | Sleep: {chk.sleep_hours || '-'} hrs</p>
                    <p className="text-gray-400 mt-1">{chk.client_notes || 'No notes'}</p>
                  </div>
                  <span className="text-[10px] text-gray-400 font-mono">{new Date(chk.logged_at).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
