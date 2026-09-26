import React, { useState } from 'react';
import {
  Plane,
  Car,
  Phone,
  ShieldCheck,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  Send,
  Bed,
  Sparkles,
  X,
} from 'lucide-react';
import { ActiveTour } from './operatorData';

interface ActiveToursSectionProps {
  activeTours: ActiveTour[];
  onTriggerDisruptionForTour?: (tourId: string) => void;
}

export const ActiveToursSection: React.FC<ActiveToursSectionProps> = ({
  activeTours,
  onTriggerDisruptionForTour,
}) => {
  const [selectedTour, setSelectedTour] = useState<ActiveTour | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleBroadcast = (tour: ActiveTour, type: string) => {
    setToastMsg(`Message dispatched to ${tour.coordinatorName} & Chauffeur (${tour.chauffeurPlate}): "${type}"`);
    setTimeout(() => setToastMsg(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="backdrop-blur-xl bg-white/90 border border-[#EF9CA7]/30 rounded-3xl p-6 sm:p-8 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>LIVE FLIGHT & CHAUFFEUR TELEMETRY</span>
          </div>
          <h2 className="font-cormorant text-3xl font-normal text-[#3a1a22]">
            Active Tours Running in the Field
          </h2>
          <p className="text-xs text-[#3a1a22]/70 mt-1 max-w-xl">
            Live operational oversight across Goa, Rajasthan, and Himachal. Track ground coordinators, chauffeur status, and guest experiences in real-time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-xl bg-white border border-[#EF9CA7]/40 text-xs font-semibold text-[#3a1a22]">
            <span>Active Guests: </span>
            <span className="font-mono text-[#c85f72] font-bold">8 Pax</span>
          </div>
          <div className="px-3.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
            <span>On-Time Dispatch: </span>
            <span className="font-mono font-bold">100%</span>
          </div>
        </div>
      </div>

      {/* Toast Alert */}
      {toastMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center justify-between shadow-xs animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold">{toastMsg}</span>
          </div>
          <button onClick={() => setToastMsg(null)} className="text-emerald-700 hover:text-emerald-950">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Active Tours Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {activeTours.map((tour) => {
          const isGoa = tour.id.includes('GOA');

          return (
            <div
              key={tour.id}
              className="backdrop-blur-xl bg-white/95 border border-[#EF9CA7]/30 rounded-3xl p-6 shadow-sm hover:shadow-md hover:border-[#c85f72] transition-all card-hover-physics flex flex-col justify-between"
            >
              <div>
                {/* Header & Status */}
                <div className="flex items-center justify-between pb-3 border-b border-[#EF9CA7]/20 mb-3">
                  <span className="text-[10px] font-mono text-[#c85f72] font-bold">
                    {tour.id}
                  </span>
                  <span
                    className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${
                      tour.status === 'Disruption Alert'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
                        : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    }`}
                  >
                    {tour.status}
                  </span>
                </div>

                {/* Traveler & Destination */}
                <h3 className="font-cormorant text-2xl font-medium text-[#3a1a22]">
                  {tour.travelerName}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-[#3a1a22]/70 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-[#c85f72]" />
                  <span>{tour.destination}</span>
                </div>

                {/* Progress bar */}
                <div className="mt-3 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-[#3a1a22]">
                      Day {tour.currentDay} of {tour.totalDays}
                    </span>
                    <span className="text-[#3a1a22]/60 font-mono">{tour.completionProgress}% Complete</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#FFDDE1] via-[#EF9CA7] to-[#c85f72] rounded-full transition-all duration-500"
                      style={{ width: `${tour.completionProgress}%` }}
                    />
                  </div>
                </div>

                {/* Current & Next Activity */}
                <div className="mt-4 p-3.5 rounded-2xl bg-[#FCF8F9] border border-[#EF9CA7]/25 space-y-2 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-[#c85f72] uppercase tracking-wider block">
                      Current Live Stop:
                    </span>
                    <div className="font-semibold text-[#3a1a22] mt-0.5">{tour.currentStop}</div>
                  </div>

                  <div className="pt-1.5 border-t border-[#EF9CA7]/20">
                    <span className="text-[10px] font-bold text-[#3a1a22]/60 uppercase tracking-wider block">
                      Next Scheduled Transit:
                    </span>
                    <div className="text-[11px] text-[#3a1a22]/80 mt-0.5">{tour.nextTransit}</div>
                  </div>
                </div>

                {/* Field Logistics (Coordinator & Chauffeur) */}
                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-[#EF9CA7]/20">
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
                      <div>
                        <span className="text-[10px] text-[#3a1a22]/50 block">Ground Lead</span>
                        <span className="font-semibold text-[#3a1a22]">{tour.coordinatorName}</span>
                      </div>
                    </div>
                    <a
                      href={`tel:${tour.coordinatorPhone}`}
                      className="p-1.5 rounded-lg bg-[#FFDDE1]/60 text-[#c85f72] hover:bg-[#c85f72] hover:text-white transition-colors"
                      title="Direct Hotline"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-[#EF9CA7]/20">
                    <div className="flex items-center gap-2">
                      <Car className="w-3.5 h-3.5 text-[#c85f72]" />
                      <div>
                        <span className="text-[10px] text-[#3a1a22]/50 block">Fleet Escort</span>
                        <span className="font-mono font-semibold text-[#3a1a22]">{tour.chauffeurPlate}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-medium text-emerald-700">GPS Active</span>
                  </div>

                  <div className="p-2 rounded-xl bg-white border border-[#EF9CA7]/20 text-[11px] flex items-center gap-2">
                    <Bed className="w-3.5 h-3.5 text-[#c85f72]" />
                    <span className="truncate">{tour.hotelName} ({tour.roomType})</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-3 border-t border-[#EF9CA7]/20 flex items-center gap-2">
                <button
                  onClick={() => handleBroadcast(tour, 'Concierge VIP Checkup Request')}
                  className="flex-1 py-2 rounded-xl bg-[#FCF8F9] hover:bg-white border border-[#EF9CA7]/40 text-[#3a1a22] text-xs font-semibold tracking-wide transition-all cursor-pointer text-center"
                >
                  Ping Team
                </button>
                <button
                  onClick={() => handleBroadcast(tour, 'Itinerary status confirmed on track')}
                  className="px-4 py-2 rounded-xl bg-[#c85f72] hover:bg-[#3a1a22] text-white text-xs font-bold tracking-wide transition-all cursor-pointer shadow-xs btn-hover-physics"
                >
                  Verify Status
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
