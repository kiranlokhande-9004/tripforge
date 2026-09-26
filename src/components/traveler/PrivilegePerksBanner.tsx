import React from 'react';
import { ShieldCheck, Sparkles, Clock, Compass, PhoneCall, Award } from 'lucide-react';

export const PrivilegePerksBanner: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="rounded-3xl bg-gradient-to-r from-[#3a1a22] via-[#522430] to-[#3a1a22] p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#EF9CA7]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[#FFDDE1] text-xs font-semibold tracking-wider uppercase mb-3">
              <Award className="w-3.5 h-3.5 text-[#EF9CA7]" />
              <span>TripForge Bespoke Guarantees</span>
            </div>
            <h3 className="font-cormorant text-3xl sm:text-4xl font-light text-white leading-tight">
              Every Journey Protected by Two-Sided Intelligence
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-white/75 leading-relaxed">
              Unlike ordinary booking aggregators that leave you stranded when plans shift, TripForge pairs autonomous rerouting with certified regional operators on the ground.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:w-[480px] shrink-0">
            <div className="p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#FFDDE1] mb-1">
                <Sparkles className="w-4 h-4 text-[#EF9CA7]" />
                <span>Zero-Fee Dynamic Rerouting</span>
              </div>
              <p className="text-[11px] text-white/70 leading-relaxed">
                Weather or transit delay? TripForge AI instantly recalibrates your day with zero added booking fees.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#FFDDE1] mb-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Verified Local Operators</span>
              </div>
              <p className="text-[11px] text-white/70 leading-relaxed">
                Every chauffeur, hotel suite, and tasting is personally vetted by certified local destination directors.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#FFDDE1] mb-1">
                <Clock className="w-4 h-4 text-[#EF9CA7]" />
                <span>Transparent Cost Architecture</span>
              </div>
              <p className="text-[11px] text-white/70 leading-relaxed">
                No hidden markup or inflated middleman packages. Every line-item is priced with open margins.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#FFDDE1] mb-1">
                <PhoneCall className="w-4 h-4 text-[#FFDDE1]" />
                <span>24/7 Dedicated Concierge Link</span>
              </div>
              <p className="text-[11px] text-white/70 leading-relaxed">
                Direct WhatsApp and voice communication with your assigned regional trip director Tariq & Vanguard team.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
