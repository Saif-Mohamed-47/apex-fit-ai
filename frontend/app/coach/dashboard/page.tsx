'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import LogoutButton from '@/components/LogoutButton';
import ApexLogo from '@/components/ApexLogo';

interface ClientSummary {
  id: number;
  email: string;
  goal: string;
  weight_kg: number;
  last_log_date: string | null;
  has_custom_macros: boolean;
  gender?: string;
}

interface ClientDetail {
  client: {
    id: number;
    email: string;
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

export default function CoachDashboardPage() {
  const [clients, setClients] = useState<ClientSummary[]>([]);
  const [inviteCode, setInviteCode] = useState<string>('');
  const [coachGender, setCoachGender] = useState<'male' | 'female'>('male');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Modal states
  const [selectedClient, setSelectedClient] = useState<ClientDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [editMacroModal, setEditMacroModal] = useState<ClientSummary | null>(null);
  
  // Custom Macro Form
  const [customCalories, setCustomCalories] = useState<number>(2200);
  const [customProtein, setCustomProtein] = useState<number>(180);
  const [customCarbs, setCustomCarbs] = useState<number>(220);
  const [customFat, setCustomFat] = useState<number>(60);
  const [submittingMacros, setSubmittingMacros] = useState(false);

  useEffect(() => {
    fetchCoachData();
  }, []);

  const fetchCoachData = async () => {
    setLoading(true);
    try {
      // Fetch Coach Profile / Gender
      try {
        const meRes = await fetch('/api/me');
        if (meRes.ok) {
          const meData = await meRes.json();
          if (meData.gender === 'female') {
            setCoachGender('female');
          }
        }
      } catch (e) {
        console.warn('Could not load coach profile:', e);
      }

      // Fetch Invite Code
      const codeRes = await fetch('/api/coach/invite-code');
      if (codeRes.ok) {
        const data = await codeRes.json();
        setInviteCode(data.invite_code || '');
      }

      // Fetch Clients Roster
      const clientsRes = await fetch('/api/coach/clients');
      if (clientsRes.ok) {
        const data = await clientsRes.json();
        setClients(data);
      } else {
        toast.error('Failed to load clients roster');
      }
    } catch (err) {
      toast.error('Network error loading coach portal');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyInviteCode = () => {
    if (!inviteCode) return;
    navigator.clipboard.writeText(inviteCode);
    toast.success(`Invite Code copied: ${inviteCode}`);
  };

  const handleOpenClientDetails = async (clientSummary: ClientSummary) => {
    setDetailLoading(true);
    try {
      const res = await fetch(`/api/coach/clients/${clientSummary.id}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedClient(data);
      } else {
        toast.error('Failed to load trainee details');
      }
    } catch {
      toast.error('Error opening trainee details');
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
        toast.success(`Custom macro plan assigned to ${editMacroModal.email}`);
        setEditMacroModal(null);
        fetchCoachData();
      } else {
        toast.error('Failed to save macro plan');
      }
    } catch {
      toast.error('Network error saving macro override');
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
        toast.success('Reset to AI automated calculations');
        setEditMacroModal(null);
        fetchCoachData();
      } else {
        toast.error('Failed to reset macros');
      }
    } catch {
      toast.error('Network error resetting macros');
    }
  };

  const filteredClients = clients.filter(c => 
    c.email.toLowerCase().includes(search.toLowerCase()) || 
    c.goal.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0A0B0D] text-white p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Top Header Banner */}
        <header className="relative overflow-hidden bg-gradient-to-r from-[#141619] via-[#1A1D24] to-[#141619] border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            
            <div className="flex items-center gap-6">
              <div className={`relative w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                coachGender === 'female' 
                  ? 'border-pink-500/50 shadow-[0_0_25px_rgba(236,72,153,0.3)]' 
                  : 'border-blue-500/50 shadow-[0_0_25px_rgba(59,130,246,0.3)]'
              }`}>
                <Image 
                  src={coachGender === 'female' ? '/images/female_coach_portrait.jpg' : '/images/coach_portrait.jpg'} 
                  alt="Coach Avatar" 
                  fill 
                  className="object-cover"
                />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                    coachGender === 'female'
                      ? 'bg-pink-500/20 text-pink-300 border-pink-500/30'
                      : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                  }`}>
                    {coachGender === 'female' ? '👑 Head Coach • كابتن مدربة' : '⚡ Head Coach • كابتن مدرب'}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <ApexLogo size="sm" showText={false} />
                    <span className="text-gray-300 font-bold text-xs">Apex Fit AI Suite</span>
                  </div>

                  {/* Interactive Coach Mode Toggle */}
                  <div className="flex items-center bg-[#0A0B0D] border border-white/10 rounded-full p-1 text-xs">
                    <button
                      type="button"
                      onClick={() => setCoachGender('male')}
                      className={`px-2.5 py-0.5 rounded-full font-bold transition-all ${
                        coachGender === 'male'
                          ? 'bg-blue-600 text-white shadow'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      👨 Man Coach
                    </button>
                    <button
                      type="button"
                      onClick={() => setCoachGender('female')}
                      className={`px-2.5 py-0.5 rounded-full font-bold transition-all ${
                        coachGender === 'female'
                          ? 'bg-pink-600 text-white shadow'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      👩 Woman Coach
                    </button>
                  </div>
                </div>

                <h1 className="text-3xl font-black mt-2 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                  {coachGender === 'female' ? 'لوحة تحكم المدربة والمشتركات' : 'لوحة تحكم المدرب والمتدربين'}
                </h1>
                <p className="text-gray-400 text-sm mt-1">
                  {coachGender === 'female'
                    ? 'إدارة وتخصيص برامج التمرين للفتيات والشباب، متابعة الأوزان، وضبط الماكروز باحترافية.'
                    : 'إدارة ومتابعة جداول المتدربين، تطوير الأحمال التدريجية، وتعيين خطط التغذية الدقيقة.'}
                </p>
              </div>
            </div>

            {/* Invite Code Box & Logout */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="bg-[#0A0B0D]/80 border border-white/10 rounded-2xl p-4 flex items-center gap-4 shadow-inner">
                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">Your Trainee Invite Code</p>
                  <p className="font-mono text-xl font-black text-blue-400">{inviteCode || 'GENERATING...'}</p>
                </div>
                <button
                  onClick={handleCopyInviteCode}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs transition-all shadow-[0_0_15px_rgba(59,130,246,0.4)]"
                >
                  Copy Link
                </button>
              </div>
              <LogoutButton />
            </div>

          </div>
        </header>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-[#141619] border border-white/10 rounded-2xl p-6 flex items-center justify-between hover:border-blue-500/40 transition-all">
            <div>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Total Trainees</p>
              <p className="text-4xl font-black mt-2 text-white">{clients.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/30 rounded-xl flex items-center justify-center text-blue-400 font-bold text-xl">
              👥
            </div>
          </div>

          <div className="bg-[#141619] border border-white/10 rounded-2xl p-6 flex items-center justify-between hover:border-emerald-500/40 transition-all">
            <div>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Custom Macro Plans</p>
              <p className="text-4xl font-black mt-2 text-emerald-400">
                {clients.filter(c => c.has_custom_macros).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-center text-emerald-400 font-bold text-xl">
              🥗
            </div>
          </div>

          <div className="bg-[#141619] border border-white/10 rounded-2xl p-6 flex items-center justify-between hover:border-amber-500/40 transition-all">
            <div>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Active This Week</p>
              <p className="text-4xl font-black mt-2 text-amber-400">
                {clients.filter(c => c.last_log_date !== null).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-center text-amber-400 font-bold text-xl">
              🔥
            </div>
          </div>

          <div className="bg-[#141619] border border-white/10 rounded-2xl p-6 flex items-center justify-between hover:border-indigo-500/40 transition-all">
            <div>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Compliance Rate</p>
              <p className="text-4xl font-black mt-2 text-indigo-400">96%</p>
            </div>
            <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/30 rounded-xl flex items-center justify-center text-indigo-400 font-bold text-xl">
              ⚡
            </div>
          </div>
        </div>

        {/* Trainees Roster Section */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <span>Client Roster</span>
              <span className="px-3 py-1 bg-white/10 text-gray-300 text-xs rounded-full font-mono">
                {filteredClients.length} clients
              </span>
            </h2>

            <input 
              type="text" 
              placeholder="Search trainees by email or goal..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-80 bg-[#141619] border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>

          {loading ? (
            <div className="py-20 text-center text-gray-400">
              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              Loading trainee roster...
            </div>
          ) : filteredClients.length === 0 ? (
            <div className="bg-[#141619] border border-white/10 rounded-2xl p-12 text-center text-gray-400 space-y-4">
              <p className="text-xl font-bold text-white">No trainees found under this coach code</p>
              <p className="text-sm max-w-md mx-auto">
                Share your invite code <span className="text-blue-400 font-mono">{inviteCode}</span> with trainees when they sign up to automatically link them to your dashboard!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClients.map((client) => (
                <div 
                  key={client.id}
                  className="bg-[#141619] border border-white/10 hover:border-blue-500/50 rounded-2xl p-6 space-y-5 transition-all duration-300 hover:-translate-y-1 shadow-lg"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-2xl overflow-hidden relative border ${
                        client.gender === 'female' 
                          ? 'border-pink-500/40 shadow-[0_0_15px_rgba(236,72,153,0.25)]' 
                          : 'border-blue-500/40 shadow-[0_0_15px_rgba(59,130,246,0.25)]'
                      }`}>
                        <Image 
                          src={client.gender === 'female' ? '/images/female_trainee_workout.jpg' : '/images/trainee_workout.jpg'} 
                          alt="Trainee Avatar" 
                          fill 
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-white text-base truncate max-w-[140px]">{client.email}</p>
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            client.gender === 'female'
                              ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30'
                              : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          }`}>
                            {client.gender === 'female' ? '🌸 Woman' : '⚡ Man'}
                          </span>
                        </div>
                        <span className="inline-block mt-1 px-2.5 py-0.5 bg-white/5 text-gray-300 border border-white/10 rounded-md text-[10px] font-bold uppercase tracking-wider">
                          {client.goal.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/5 text-xs text-gray-400">
                    <div>
                      <p>Current Weight</p>
                      <p className="font-bold text-white text-sm mt-0.5">{client.weight_kg} kg</p>
                    </div>
                    <div>
                      <p>Last Active</p>
                      <p className="font-bold text-white text-sm mt-0.5">{client.last_log_date || 'No logs yet'}</p>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleOpenMacroEditor(client)}
                      className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs transition-all ${
                        client.has_custom_macros 
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                          : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
                      }`}
                    >
                      {client.has_custom_macros ? '✏️ Custom Plan Active' : '➕ Assign Custom Plan'}
                    </button>

                    <button
                      onClick={() => handleOpenClientDetails(client)}
                      className="py-2.5 px-3 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 rounded-xl font-bold text-xs transition-all"
                    >
                      Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>

      {/* Modal: Custom Macro Editor */}
      {editMacroModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-[#141619] border border-white/15 rounded-3xl max-w-lg w-full p-8 space-y-6 shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div>
                <h3 className="text-xl font-bold text-white">Assign Custom Macro Target</h3>
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
                <label className="block text-xs text-gray-300 font-bold uppercase mb-1">Target Calories (kcal)</label>
                <input 
                  type="number" 
                  value={customCalories}
                  onChange={(e) => setCustomCalories(Number(e.target.value))}
                  className="w-full bg-[#0A0B0D] border border-white/10 rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-gray-300 font-bold uppercase mb-1">Protein (g)</label>
                  <input 
                    type="number" 
                    value={customProtein}
                    onChange={(e) => setCustomProtein(Number(e.target.value))}
                    className="w-full bg-[#0A0B0D] border border-white/10 rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-300 font-bold uppercase mb-1">Carbs (g)</label>
                  <input 
                    type="number" 
                    value={customCarbs}
                    onChange={(e) => setCustomCarbs(Number(e.target.value))}
                    className="w-full bg-[#0A0B0D] border border-white/10 rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-300 font-bold uppercase mb-1">Fat (g)</label>
                  <input 
                    type="number" 
                    value={customFat}
                    onChange={(e) => setCustomFat(Number(e.target.value))}
                    className="w-full bg-[#0A0B0D] border border-white/10 rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="bg-[#0A0B0D] p-3 rounded-xl border border-white/5 text-xs text-gray-400 flex justify-between">
                <span>Calculated Energy Total:</span>
                <span className="font-bold text-white">{customProtein * 4 + customCarbs * 4 + customFat * 9} kcal</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-white/10">
              <button
                onClick={handleSaveMacroOverride}
                disabled={submittingMacros}
                className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)]"
              >
                {submittingMacros ? 'Saving...' : 'Save Coach Override'}
              </button>

              {editMacroModal.has_custom_macros && (
                <button
                  onClick={() => handleResetMacroOverride(editMacroModal.id)}
                  className="py-3 px-4 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 font-bold rounded-xl transition-all"
                >
                  Reset AI
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Client Detail Overview */}
      {selectedClient && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-[#141619] border border-white/15 rounded-3xl max-w-2xl w-full p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl overflow-hidden relative border ${
                  selectedClient.client.gender === 'female' ? 'border-pink-500/40 shadow-[0_0_15px_rgba(236,72,153,0.3)]' : 'border-blue-500/40 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                }`}>
                  <Image 
                    src={selectedClient.client.gender === 'female' ? '/images/female_trainee_workout.jpg' : '/images/trainee_workout.jpg'} 
                    alt="Trainee Avatar" 
                    fill 
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-white">{selectedClient.client.email}</h3>
                    <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold ${
                      selectedClient.client.gender === 'female'
                        ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30'
                        : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    }`}>
                      {selectedClient.client.gender === 'female' ? '🌸 Woman • Glute & Sculpt Priority' : '⚡ Man • Compound Strength'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Goal: {selectedClient.client.goal} | Weight: {selectedClient.client.weight_kg} kg | Experience: {selectedClient.client.training_experience_months} mos | Days: {selectedClient.client.days_per_week}/wk
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedClient(null)} 
                className="text-gray-400 hover:text-white font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-sm text-gray-300 uppercase mb-3">Recent Check-In Submissions</h4>
                {selectedClient.recent_checkins.length === 0 ? (
                  <p className="text-xs text-gray-500 italic">No check-ins submitted yet.</p>
                ) : (
                  <div className="space-y-2">
                    {selectedClient.recent_checkins.map((chk: any) => (
                      <div key={chk.id} className="bg-[#0A0B0D] p-3 rounded-xl border border-white/5 text-xs flex justify-between items-center">
                        <div>
                          <p className="font-bold text-white">Weight: {chk.weight_kg} kg | Sleep: {chk.sleep_hours || '-'} hrs</p>
                          <p className="text-gray-400 mt-0.5">{chk.client_notes || 'No notes'}</p>
                        </div>
                        <span className="text-[10px] text-gray-500">{new Date(chk.logged_at).toLocaleDateString()}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h4 className="font-bold text-sm text-gray-300 uppercase mb-3">Recent Workout Logs</h4>
                {selectedClient.recent_workouts.length === 0 ? (
                  <p className="text-xs text-gray-500 italic">No workouts logged yet.</p>
                ) : (
                  <div className="space-y-2">
                    {selectedClient.recent_workouts.map((w: any) => (
                      <div key={w.id} className="bg-[#0A0B0D] p-3 rounded-xl border border-white/5 text-xs flex justify-between items-center">
                        <div>
                          <p className="font-bold text-white">{w.exercise_name}</p>
                          <p className="text-gray-400 mt-0.5">{w.actual_weight_kg} kg × {w.actual_reps} reps (Set {w.set_number})</p>
                        </div>
                        <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded text-[10px] uppercase font-bold">{w.difficulty_rating}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
