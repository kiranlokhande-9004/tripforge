import React, { useState } from 'react';
import { Compass, MapPin, ArrowLeft, Mail, Lock, KeyRound, ChevronRight, CheckCircle2 } from 'lucide-react';
import { AmbientBackground } from './motion/AmbientBackground';

interface SignInPageProps {
  onNavigate: (path: string) => void;
}

type RoleMode = 'none' | 'traveler' | 'operator';

export const SignInPage: React.FC<SignInPageProps> = ({ onNavigate }) => {
  const [activeRole, setActiveRole] = useState<RoleMode>('none');

  // Traveler form state
  const [travelerEmail, setTravelerEmail] = useState('clara.voyager@tripforge.com');
  const [travelerPassword, setTravelerPassword] = useState('••••••••••••');
  const [travelerLoading, setTravelerLoading] = useState(false);

  // Operator form state
  const [operatorEmail, setOperatorEmail] = useState('alex.operations@tripforge.com');
  const [operatorPassword, setOperatorPassword] = useState('••••••••••••');
  const [operatorId, setOperatorId] = useState('OP-4920');
  const [operatorLoading, setOperatorLoading] = useState(false);

  const handleTravelerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTravelerLoading(true);
    setTimeout(() => {
      setTravelerLoading(false);
      onNavigate('/traveler');
    }, 400);
  };

  const handleOperatorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOperatorLoading(true);
    setTimeout(() => {
      setOperatorLoading(false);
      onNavigate('/operator');
    }, 400);
  };

  return (
    <div className="relative min-h-screen w-full overflow-y-auto bg-gradient-to-br from-[#FFF5F6] via-[#FFDDE1]/60 to-[#FCE6E9] text-[#3a1a22] flex flex-col justify-between p-6 md:p-10 font-inter">
      {/* Ambient moving clouds & cinematic depth */}
      <AmbientBackground variant="signin" />

      {/* Top Bar with Back Button & Brand */}
      <header className="relative z-10 max-w-6xl w-full mx-auto flex items-center justify-between">
        <button
          onClick={() => onNavigate('/')}
          className="group inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/70 hover:bg-white/95 border border-[#EF9CA7]/40 shadow-sm backdrop-blur-md transition-all duration-300 text-xs sm:text-sm font-medium text-[#3a1a22] hover:text-[#c85f72] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 text-[#c85f72]" />
          <span>Back to TripForge</span>
        </button>

        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('/');
          }}
          className="font-cormorant text-2xl sm:text-3xl font-medium tracking-[0.14em] text-[#3a1a22] hover:text-[#c85f72] transition-colors"
        >
          TripForge
        </a>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 max-w-5xl w-full mx-auto my-auto py-10">
        <div className="text-center mb-10 md:mb-14">
          <span className="inline-block px-3.5 py-1 rounded-full bg-white/80 border border-[#EF9CA7]/40 text-[#c85f72] text-[11px] font-semibold tracking-[0.25em] uppercase mb-3 shadow-xs">
            Portal Access
          </span>
          <h1 className="font-cormorant text-4xl sm:text-5xl md:text-6xl font-light text-[#3a1a22] tracking-wide">
            Sign In to TripForge
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-[#3a1a22]/70 max-w-md mx-auto">
            Select your role to access your bespoke travel experience or manage luxury itineraries.
          </p>
        </div>

        {/* TWO FLOATING GLASSMORPHISM CARDS SIDE BY SIDE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start">
          {/* CARD 1: TRAVELER */}
          <div
            className={`relative rounded-3xl transition-all duration-500 ease-out border backdrop-blur-xl shadow-xl overflow-hidden ${
              activeRole === 'traveler'
                ? 'bg-white/90 border-[#c85f72] ring-2 ring-[#c85f72]/20 shadow-[0_20px_50px_rgba(200,95,114,0.22)] md:scale-[1.02]'
                : activeRole === 'operator'
                ? 'bg-white/55 border-white/80 opacity-70 hover:opacity-100 hover:bg-white/75'
                : 'bg-white/70 hover:bg-white/85 border-white/80 hover:border-[#EF9CA7] hover:shadow-[0_15px_35px_rgba(200,95,114,0.15)] hover:-translate-y-1'
            }`}
          >
            {/* Soft pink highlight badge */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#EF9CA7]/20 to-transparent rounded-bl-full pointer-events-none" />

            <div className="p-8 sm:p-9">
              {/* Card Header & Icon */}
              <div
                onClick={() => {
                  if (activeRole !== 'traveler') setActiveRole('traveler');
                }}
                className={`flex items-start gap-4 ${
                  activeRole === 'none' ? 'cursor-pointer' : ''
                }`}
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FFDDE1] to-[#EF9CA7]/40 border border-white flex items-center justify-center shrink-0 shadow-sm text-[#c85f72]">
                  <Compass className="w-7 h-7" strokeWidth={1.75} />
                </div>
                <div className="flex-1">
                  <h2 className="font-cormorant text-3xl font-medium text-[#3a1a22] leading-tight">
                    Traveler
                  </h2>
                  <p className="font-inter text-xs sm:text-sm text-[#3a1a22]/70 mt-1">
                    Plan your journey your way
                  </p>
                </div>
              </div>

              {/* Collapsed State Prompt (when activeRole !== 'traveler') */}
              {activeRole !== 'traveler' && (
                <div className="mt-8">
                  <button
                    onClick={() => setActiveRole('traveler')}
                    className="w-full group py-3 px-5 rounded-2xl bg-gradient-to-r from-white/90 to-[#FFDDE1]/60 hover:from-[#EF9CA7]/30 hover:to-[#FFDDE1]/80 border border-[#EF9CA7]/40 flex items-center justify-between text-xs sm:text-sm font-medium tracking-wide text-[#3a1a22] hover:text-[#c85f72] transition-all duration-300 shadow-xs cursor-pointer"
                  >
                    <span>Enter as Traveler</span>
                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1 text-[#c85f72]" />
                  </button>
                </div>
              )}

              {/* Expanded State: Traveler Login Form */}
              {activeRole === 'traveler' && (
                <form onSubmit={handleTravelerSubmit} className="mt-6 space-y-4 animate-fadeIn">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold tracking-wider text-[#3a1a22]/80 uppercase">
                      Email Address
                    </label>
                    <div className="relative flex items-center">
                      <Mail className="absolute left-3.5 w-4 h-4 text-[#c85f72]/60" />
                      <input
                        type="email"
                        required
                        value={travelerEmail}
                        onChange={(e) => setTravelerEmail(e.target.value)}
                        placeholder="traveler@example.com"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/80 border border-[#EF9CA7]/60 focus:border-[#c85f72] focus:ring-2 focus:ring-[#c85f72]/20 focus:outline-none text-xs sm:text-sm text-[#3a1a22] placeholder-[#3a1a22]/40 transition-all shadow-inner"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold tracking-wider text-[#3a1a22]/80 uppercase">
                      Password
                    </label>
                    <div className="relative flex items-center">
                      <Lock className="absolute left-3.5 w-4 h-4 text-[#c85f72]/60" />
                      <input
                        type="password"
                        required
                        value={travelerPassword}
                        onChange={(e) => setTravelerPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/80 border border-[#EF9CA7]/60 focus:border-[#c85f72] focus:ring-2 focus:ring-[#c85f72]/20 focus:outline-none text-xs sm:text-sm text-[#3a1a22] placeholder-[#3a1a22]/40 transition-all shadow-inner"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={travelerLoading}
                      className="w-full py-3 px-5 rounded-xl bg-[#c85f72] hover:bg-[#3a1a22] text-white font-inter text-xs tracking-widest uppercase font-semibold transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-[#c85f72]/25 cursor-pointer flex items-center justify-center gap-2"
                    >
                      {travelerLoading ? (
                        <span>Authenticating...</span>
                      ) : (
                        <>
                          <span>Sign In as Traveler</span>
                          <ChevronRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>

                  {/* Actions: switch back to selection or back to landing */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#c85f72]/10 text-xs">
                    <button
                      type="button"
                      onClick={() => setActiveRole('none')}
                      className="text-[#3a1a22]/60 hover:text-[#c85f72] transition-colors cursor-pointer"
                    >
                      Choose other role
                    </button>
                    <button
                      type="button"
                      onClick={() => onNavigate('/')}
                      className="text-[#c85f72] hover:underline font-medium cursor-pointer"
                    >
                      Back to TripForge
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* CARD 2: TOUR OPERATOR */}
          <div
            className={`relative rounded-3xl transition-all duration-500 ease-out border backdrop-blur-xl shadow-xl overflow-hidden ${
              activeRole === 'operator'
                ? 'bg-white/90 border-[#c85f72] ring-2 ring-[#c85f72]/20 shadow-[0_20px_50px_rgba(200,95,114,0.22)] md:scale-[1.02]'
                : activeRole === 'traveler'
                ? 'bg-white/55 border-white/80 opacity-70 hover:opacity-100 hover:bg-white/75'
                : 'bg-white/70 hover:bg-white/85 border-white/80 hover:border-[#EF9CA7] hover:shadow-[0_15px_35px_rgba(200,95,114,0.15)] hover:-translate-y-1'
            }`}
          >
            {/* Soft pink highlight badge */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#EF9CA7]/20 to-transparent rounded-bl-full pointer-events-none" />

            <div className="p-8 sm:p-9">
              {/* Card Header & Icon */}
              <div
                onClick={() => {
                  if (activeRole !== 'operator') setActiveRole('operator');
                }}
                className={`flex items-start gap-4 ${
                  activeRole === 'none' ? 'cursor-pointer' : ''
                }`}
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FFDDE1] to-[#EF9CA7]/40 border border-white flex items-center justify-center shrink-0 shadow-sm text-[#c85f72]">
                  <MapPin className="w-7 h-7" strokeWidth={1.75} />
                </div>
                <div className="flex-1">
                  <h2 className="font-cormorant text-3xl font-medium text-[#3a1a22] leading-tight">
                    Tour Operator
                  </h2>
                  <p className="font-inter text-xs sm:text-sm text-[#3a1a22]/70 mt-1">
                    Manage personalized journeys with ease
                  </p>
                </div>
              </div>

              {/* Collapsed State Prompt (when activeRole !== 'operator') */}
              {activeRole !== 'operator' && (
                <div className="mt-8">
                  <button
                    onClick={() => setActiveRole('operator')}
                    className="w-full group py-3 px-5 rounded-2xl bg-gradient-to-r from-white/90 to-[#FFDDE1]/60 hover:from-[#EF9CA7]/30 hover:to-[#FFDDE1]/80 border border-[#EF9CA7]/40 flex items-center justify-between text-xs sm:text-sm font-medium tracking-wide text-[#3a1a22] hover:text-[#c85f72] transition-all duration-300 shadow-xs cursor-pointer"
                  >
                    <span>Enter as Operator</span>
                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1 text-[#c85f72]" />
                  </button>
                </div>
              )}

              {/* Expanded State: Operator Login Form */}
              {activeRole === 'operator' && (
                <form onSubmit={handleOperatorSubmit} className="mt-6 space-y-3.5 animate-fadeIn">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold tracking-wider text-[#3a1a22]/80 uppercase">
                      Work Email
                    </label>
                    <div className="relative flex items-center">
                      <Mail className="absolute left-3.5 w-4 h-4 text-[#c85f72]/60" />
                      <input
                        type="email"
                        required
                        value={operatorEmail}
                        onChange={(e) => setOperatorEmail(e.target.value)}
                        placeholder="operator@tripforge.com"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/80 border border-[#EF9CA7]/60 focus:border-[#c85f72] focus:ring-2 focus:ring-[#c85f72]/20 focus:outline-none text-xs sm:text-sm text-[#3a1a22] placeholder-[#3a1a22]/40 transition-all shadow-inner"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold tracking-wider text-[#3a1a22]/80 uppercase">
                      Password
                    </label>
                    <div className="relative flex items-center">
                      <Lock className="absolute left-3.5 w-4 h-4 text-[#c85f72]/60" />
                      <input
                        type="password"
                        required
                        value={operatorPassword}
                        onChange={(e) => setOperatorPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/80 border border-[#EF9CA7]/60 focus:border-[#c85f72] focus:ring-2 focus:ring-[#c85f72]/20 focus:outline-none text-xs sm:text-sm text-[#3a1a22] placeholder-[#3a1a22]/40 transition-all shadow-inner"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold tracking-wider text-[#3a1a22]/80 uppercase">
                      Operator ID
                    </label>
                    <div className="relative flex items-center">
                      <KeyRound className="absolute left-3.5 w-4 h-4 text-[#c85f72]/60" />
                      <input
                        type="text"
                        required
                        value={operatorId}
                        onChange={(e) => setOperatorId(e.target.value)}
                        placeholder="e.g. OP-7821"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/80 border border-[#EF9CA7]/60 focus:border-[#c85f72] focus:ring-2 focus:ring-[#c85f72]/20 focus:outline-none text-xs sm:text-sm text-[#3a1a22] placeholder-[#3a1a22]/40 transition-all shadow-inner uppercase tracking-wider font-mono text-[13px]"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={operatorLoading}
                      className="w-full py-3 px-5 rounded-xl bg-[#c85f72] hover:bg-[#3a1a22] text-white font-inter text-xs tracking-widest uppercase font-semibold transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-[#c85f72]/25 cursor-pointer flex items-center justify-center gap-2"
                    >
                      {operatorLoading ? (
                        <span>Authenticating...</span>
                      ) : (
                        <>
                          <span>Sign In as Operator</span>
                          <ChevronRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>

                  {/* Actions: switch back to selection or back to landing */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#c85f72]/10 text-xs">
                    <button
                      type="button"
                      onClick={() => setActiveRole('none')}
                      className="text-[#3a1a22]/60 hover:text-[#c85f72] transition-colors cursor-pointer"
                    >
                      Choose other role
                    </button>
                    <button
                      type="button"
                      onClick={() => onNavigate('/')}
                      className="text-[#c85f72] hover:underline font-medium cursor-pointer"
                    >
                      Back to TripForge
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer info note */}
      <footer className="relative z-10 text-center py-4">
        <p className="text-[11px] text-[#3a1a22]/40 tracking-wider uppercase">
          TripForge Ecosystem • Modular Auth Staged for Supabase
        </p>
      </footer>
    </div>
  );
};
