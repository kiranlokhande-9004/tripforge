import React, { useState } from 'react';
import {
  Users,
  Phone,
  ShieldCheck,
  Star,
  MapPin,
  Clock,
  Radio,
  Send,
  CheckCircle2,
  X,
  Compass,
} from 'lucide-react';
import { FieldCoordinator } from './operatorData';

interface CoordinatorsSectionProps {
  coordinators: FieldCoordinator[];
}

export const CoordinatorsSection: React.FC<CoordinatorsSectionProps> = ({ coordinators }) => {
  const [toast, setToast] = useState<string | null>(null);

  const handleDispatchPing = (coord: FieldCoordinator) => {
    setToast(`Priority radio alert sent to ${coord.name} (${coord.region}): "Status Check & Guest VIP Protocol"`);
    setTimeout(() => setToast(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="backdrop-blur-xl bg-white/90 border border-[#EF9CA7]/30 rounded-3xl p-6 sm:p-8 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFDDE1]/60 text-xs font-bold text-[#c85f72] mb-1">
            <Radio className="w-3.5 h-3.5 text-[#c85f72] animate-pulse" />
            <span>FIELD LOGISTICS & CONCIERGE NETWORK</span>
          </div>
          <h2 className="font-cormorant text-3xl font-normal text-[#3a1a22]">
            Ground Coordinators & Field Leads
          </h2>
          <p className="text-xs text-[#3a1a22]/70 mt-1 max-w-xl">
            Direct telemetry with local operations leads stationed at airport hubs, luxury stays, and private docks across India.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-xl bg-white border border-[#EF9CA7]/40 text-xs font-semibold text-[#3a1a22]">
            <span>On-Duty Leads: </span>
            <span className="font-mono text-[#c85f72] font-bold">{coordinators.length}</span>
          </div>
          <div className="px-3.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
            <span>Average Rating: </span>
            <span className="font-mono font-bold">4.94 ★</span>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center justify-between shadow-xs animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold">{toast}</span>
          </div>
          <button onClick={() => setToast(null)} className="text-emerald-700 hover:text-emerald-950">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Grid of Coordinators */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {coordinators.map((c) => {
          const isOnGround = c.currentStatus === 'On Ground';

          return (
            <div
              key={c.id}
              className="backdrop-blur-xl bg-white/95 border border-[#EF9CA7]/30 rounded-3xl p-6 shadow-xs hover:shadow-md hover:border-[#c85f72] transition-all card-hover-physics flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#EF9CA7]/20 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-[#c85f72]">{c.id}</span>
                    <span className="text-[10px] text-[#3a1a22]/50 font-mono">({c.region})</span>
                  </div>
                  <span
                    className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1.5 ${
                      isOnGround
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        : 'bg-blue-100 text-blue-900 border border-blue-300'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>{c.currentStatus}</span>
                  </span>
                </div>

                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-cormorant text-2xl font-medium text-[#3a1a22]">
                      {c.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-[#3a1a22]/70 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-[#c85f72]" />
                      <span>{c.liveLocation}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{c.rating}</span>
                    </div>
                    <span className="text-[10px] text-[#3a1a22]/50">{c.tripsCompleted} Escorts</span>
                  </div>
                </div>

                {/* Current assignment card */}
                <div className="mt-4 p-3.5 rounded-2xl bg-[#FCF8F9] border border-[#EF9CA7]/25 text-xs space-y-1">
                  <span className="text-[10px] font-bold text-[#c85f72] uppercase tracking-wider block">
                    Active Tour Assigned:
                  </span>
                  <div className="font-semibold text-[#3a1a22]">{c.assignedTour}</div>
                  <p className="text-[11px] text-[#3a1a22]/70 leading-relaxed mt-1">
                    {c.currentTask}
                  </p>
                </div>
              </div>

              {/* Action row */}
              <div className="mt-4 pt-3 border-t border-[#EF9CA7]/20 flex items-center justify-between gap-3">
                <a
                  href={`tel:${c.phone}`}
                  className="px-3.5 py-2 rounded-xl bg-white border border-[#EF9CA7]/40 text-[#3a1a22] hover:bg-[#FFDDE1]/40 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-[#c85f72]" />
                  <span>Call Hotline</span>
                </a>

                <button
                  onClick={() => handleDispatchPing(c)}
                  className="px-4 py-2 rounded-xl bg-[#c85f72] hover:bg-[#3a1a22] text-white text-xs font-bold tracking-wide transition-all shadow-xs btn-hover-physics cursor-pointer flex items-center gap-1.5"
                >
                  <Radio className="w-3.5 h-3.5" />
                  <span>Radio Ping</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
