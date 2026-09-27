import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { Shield, Lock, Mail, ArrowRight, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

export function Login() {
  const { login } = useApp();
  const { t } = useLanguage();

  const [email, setEmail] = useState('vet@ahd.mh.gov.in');
  const [password, setPassword] = useState('vet1234');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const success = login(email, password);
      if (!success) {
        setError('Invalid credentials. Use demo credentials provided below.');
        setLoading(false);
      }
    }, 400);
  };

  const handleQuickDemoLogin = () => {
    setEmail('vet@ahd.mh.gov.in');
    setPassword('vet1234');
    login('vet@ahd.mh.gov.in', 'vet1234');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#fbf9f4] relative overflow-hidden">
      {/* Background organic curves reminiscent of Kintsugi pottery restoration */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="grad1" cx="20%" cy="20%" r="60%">
              <stop offset="0%" stopColor="#216d53" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#fbf9f4" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#grad1)" />
          <path d="M-100,200 Q400,600 1200,100 T2400,800" fill="none" stroke="#216d53" strokeWidth="1" strokeDasharray="6,8" opacity="0.2" />
        </svg>
      </div>

      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200/90 overflow-hidden z-10">
        {/* Top Header with Kintsugi Care Logo & SIH 2026 Badge */}
        <div className="bg-[#216d53] text-white p-6 pb-7 text-center relative">
          {/* SIH Logo Badge in top corner */}
          <div className="absolute top-4 right-4 bg-white/15 backdrop-blur-xs px-2 py-1 rounded-xl border border-white/20">
            <img 
              src="/sih_2026_logo_transparent.png" 
              alt="Smart India Hackathon 2026" 
              className="h-5 object-contain"
            />
          </div>

          {/* Copied Kintsugi Care Logo Emblem */}
          <div className="w-16 h-16 mx-auto rounded-3xl bg-white p-2.5 shadow-lg mb-3 flex items-center justify-center">
            <img 
              src="/kintsugi_care_icon_transparent.png" 
              alt="Kintsugi Care Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          
          <div className="inline-block px-3 py-0.5 rounded-full bg-white/15 text-[10px] font-extrabold tracking-wider uppercase mb-1">
            Veterinarian Portal • AI-Assisted Triage
          </div>
          <h2 className="text-2xl font-black tracking-tight">Kintsugi Care</h2>
          <p className="text-xs text-white/90 font-medium mt-0.5">
            From Early Signals to Timely Action
          </p>
          <p className="text-[10px] text-white/70 mt-1 max-w-xs mx-auto">
            An Integrated AI-powered Livestock Health Intelligence & Response Platform
          </p>
        </div>

        {/* Stakeholder Integration Banner */}
        <div className="bg-emerald-950 text-white px-4 py-2 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-wider">
          <span className="text-yellow-300">Farmers</span>
          <span>•</span>
          <span className="text-white font-extrabold underline decoration-yellow-300">Veterinarians</span>
          <span>•</span>
          <span className="text-yellow-300">Government</span>
        </div>

        {/* Form Container */}
        <div className="p-7">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                Official Veterinarian Email / Username
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vet@ahd.mh.gov.in"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#216d53]/30 focus:border-[#216d53] transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-stone-700">
                  Password
                </label>
                <span className="text-[11px] text-stone-400">Default: vet1234</span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#216d53]/30 focus:border-[#216d53] transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-[#216d53] text-white font-bold text-sm hover:bg-[#164e3b] shadow-md shadow-[#216d53]/20 flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Veterinarian Portal'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Access Box for SIH Judges */}
          <div className="mt-6 pt-5 border-t border-stone-100">
            <div className="p-3.5 rounded-2xl bg-[#eaf3ee]/70 border border-[#216d53]/20">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-[#164e3b] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#216d53]" />
                  SIH 2026 Demonstration Access
                </span>
                <span className="text-[10px] font-extrabold text-[#216d53] bg-white px-2 py-0.5 rounded-md border border-[#216d53]/20">
                  Ready
                </span>
              </div>
              <p className="text-[11px] text-stone-600 leading-snug mb-2.5 font-medium">
                Live case intake & GIS outbreak surveillance for Maharashtra Veterinary Surveillance Division.
              </p>
              <button
                type="button"
                onClick={handleQuickDemoLogin}
                className="w-full py-2 px-3 rounded-xl bg-white border border-[#216d53]/30 text-[#216d53] hover:bg-[#216d53] hover:text-white font-bold text-xs shadow-2xs transition-all cursor-pointer"
              >
                1-Click Demo Sign-in
              </button>
            </div>
          </div>
        </div>

        {/* Footer with SIH Slide Motto */}
        <div className="bg-stone-50 px-6 py-3 border-t border-stone-100 text-center text-[10.5px] text-stone-600 font-semibold">
          Healthier Livestock | Safer Communities | A Stronger India 🇮🇳
        </div>
      </div>
    </div>
  );
}

export default Login;
