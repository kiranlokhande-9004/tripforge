import React from 'react';
import { Sparkles, Calendar, MapPin, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { SeasonalCollection, SEASONAL_COLLECTIONS } from './data';

interface SeasonalCollectionsSectionProps {
  onSelectCollection: (col: SeasonalCollection) => void;
}

export const SeasonalCollectionsSection: React.FC<SeasonalCollectionsSectionProps> = ({
  onSelectCollection,
}) => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#c85f72] block mb-1">
            Editor's Curated Horizons
          </span>
          <h2 className="font-cormorant text-3xl sm:text-4xl font-normal text-[#3a1a22]">
            Seasonal Bespoke Collections
          </h2>
          <p className="text-xs sm:text-sm text-[#3a1a22]/70 mt-1 max-w-xl">
            Complete high-concept journeys conceptualized by our certified master operators. Fully customizable in your TripForge workspace.
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-[#c85f72] font-semibold tracking-wider uppercase">
          <Sparkles className="w-4 h-4" />
          <span>Every Collection is 100% Modifiable</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {SEASONAL_COLLECTIONS.map((col) => (
          <div
            key={col.id}
            className="group rounded-3xl bg-white border border-[#EF9CA7]/30 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="relative h-56 w-full overflow-hidden bg-[#FFDDE1]/40">
                <img
                  src={col.image}
                  alt={col.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-[#c85f72] tracking-wider uppercase shadow-xs">
                  {col.theme}
                </div>

                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <div className="text-[11px] font-medium text-white/80 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#EF9CA7]" />
                    <span>{col.destination}</span>
                    <span className="text-white/40">•</span>
                    <span>{col.duration}</span>
                  </div>
                  <h3 className="font-cormorant text-2xl font-medium leading-tight mt-0.5">
                    {col.title}
                  </h3>
                </div>
              </div>

              <div className="p-5">
                <p className="text-xs text-[#3a1a22]/75 leading-relaxed">
                  {col.subtitle}
                </p>

                {/* Highlights list */}
                <div className="mt-4 pt-4 border-t border-[#EF9CA7]/20 space-y-2">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#c85f72]">
                    Signature Inclusions:
                  </div>
                  {col.highlights.map((h, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-[#3a1a22]/80">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-3 border-t border-[#EF9CA7]/20 flex items-center justify-between text-xs text-[#3a1a22]/70">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#c85f72]" />
                    <span>Lead Operator:</span>
                  </span>
                  <span className="font-semibold text-[#3a1a22]">{col.operator}</span>
                </div>
              </div>
            </div>

            <div className="p-5 pt-0">
              <div className="pt-3 border-t border-[#EF9CA7]/20 flex items-center justify-between mb-3">
                <div>
                  <span className="text-[10px] text-[#3a1a22]/50 uppercase tracking-wider block">
                    Starting Blueprint
                  </span>
                  <span className="font-mono text-base font-bold text-[#c85f72]">
                    ₹{col.price.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-[#3a1a22]/60"> / couple</span>
                </div>
                <span className="text-[10px] text-[#3a1a22]/60 font-mono">5-Star Verified</span>
              </div>

              <button
                type="button"
                onClick={() => onSelectCollection(col)}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#FFF5F6] to-[#FFDDE1]/80 hover:from-[#c85f72] hover:to-[#3a1a22] hover:text-white border border-[#EF9CA7]/50 text-[#3a1a22] text-xs font-semibold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <span>Customize This Blueprint</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
