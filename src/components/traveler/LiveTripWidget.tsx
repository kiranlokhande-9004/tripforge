import React, { useState } from 'react';
import { Radio, Calendar, MapPin, Clock, Car, Bed, ShieldCheck, CheckCircle2, Navigation, PhoneCall, Sparkles } from 'lucide-react';
import { TripData, ItineraryItem, TripBookingItem } from './data';

interface LiveTripWidgetProps {
  trip: TripData;
  itinerary: ItineraryItem[];
  bookings: TripBookingItem[];
}

export const LiveTripWidget: React.FC<LiveTripWidgetProps> = ({
  trip,
  itinerary,
  bookings,
}) => {
  const [mode, setMode] = useState<'countdown' | 'active'>('countdown');

  return (
    <section id="live-trip-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="rounded-3xl bg-gradient-to-br from-[#FFF5F6] via-white to-[#FFDDE1]/40 p-6 sm:p-9 border border-[#EF9CA7]/40 shadow-lg">
        {/* Header & Mode Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EF9CA7]/30 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold tracking-wider uppercase mb-2">
              <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
              <span>LIVE TRIP ENGINE</span>
            </div>
            <h2 className="font-cormorant text-3xl sm:text-4xl font-normal text-[#3a1a22]">
              {mode === 'countdown' ? 'Your trip begins in 17 days' : 'Active Live Trip: Day 02 in Goa'}
            </h2>
            <p className="text-xs sm:text-sm text-[#3a1a22]/70 mt-1">
              Departure: <span className="font-semibold text-[#3a1a22]">{trip.startDate}</span> from {trip.origin} Chhatrapati Shivaji Maharaj T2.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => setMode(mode === 'countdown' ? 'active' : 'countdown')}
              className={`px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all shadow-xs cursor-pointer flex items-center gap-1.5 ${
                mode === 'active'
                  ? 'bg-emerald-600 text-white shadow-emerald-200'
                  : 'bg-[#c85f72] hover:bg-[#3a1a22] text-white'
              }`}
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>{mode === 'countdown' ? 'SIMULATE ACTIVE IN-TRIP' : 'SWITCH TO COUNTDOWN'}</span>
            </button>
          </div>
        </div>

        {mode === 'countdown' ? (
          /* COUNTDOWN VIEW */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-white border border-[#EF9CA7]/30 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-semibold text-[#c85f72] block mb-1">
                  Current Status
                </span>
                <div className="font-semibold text-[#3a1a22]">Itinerary Staged & Pre-cleared</div>
                <div className="text-[11px] text-[#3a1a22]/60 mt-0.5">Online Check-in Opens 10 Oct</div>
              </div>
              <div className="mt-3 pt-2 border-t border-[#EF9CA7]/20 text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Verified by Vanguard</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#EF9CA7]/30 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-semibold text-[#c85f72] block mb-1">
                  Next Milestone
                </span>
                <div className="font-semibold text-[#3a1a22]">Flight 6E-289 Departure (10:15 AM)</div>
                <div className="text-[11px] text-[#3a1a22]/60 mt-0.5">Terminal 2 VIP Fast Track Lane</div>
              </div>
              <div className="mt-3 pt-2 border-t border-[#EF9CA7]/20 text-[10px] text-[#3a1a22]/60">
                Gate assignment arrives 24h prior
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#EF9CA7]/30 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-semibold text-[#c85f72] block mb-1">
                  Transport Standby
                </span>
                <div className="font-semibold text-[#3a1a22]">Sedan Chauffeur Assigned</div>
                <div className="text-[11px] text-[#3a1a22]/60 mt-0.5">Driver: Tariq (Plate QA-8812)</div>
              </div>
              <div className="mt-3 pt-2 border-t border-[#EF9CA7]/20 text-[10px] text-[#c85f72] font-semibold flex items-center gap-1">
                <PhoneCall className="w-3 h-3" />
                <span>Direct WhatsApp Linked</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#EF9CA7]/30 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-semibold text-[#c85f72] block mb-1">
                  Concierge Hotline
                </span>
                <div className="font-semibold text-[#3a1a22]">Vanguard Standby Team</div>
                <div className="text-[11px] text-[#c85f72] mt-0.5">24/7 Dedicated Trip Coordinator</div>
              </div>
              <div className="mt-3 pt-2 border-t border-[#EF9CA7]/20 text-[10px] text-emerald-700 font-semibold">
                Priority Line: +91 9820-FORGE
              </div>
            </div>
          </div>
        ) : (
          /* ACTIVE IN-TRIP VIEW */
          <div className="space-y-6 animate-fadeIn">
            {/* Live Progress Bar */}
            <div className="p-4 rounded-2xl bg-white border border-emerald-200 space-y-2">
              <div className="flex justify-between text-xs font-semibold text-[#3a1a22]">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>Day 02 of 05 in Progress (40% Complete)</span>
                </span>
                <span className="font-mono text-[#c85f72]">Panaji Heritage Zone · 29°C Clear</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-[#FFDDE1] overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-500 to-[#c85f72] h-full rounded-full w-[45%]" />
              </div>
            </div>

            {/* In-Trip Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-white border border-emerald-300 shadow-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] uppercase font-bold text-emerald-800">
                    Current Activity
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-bold">
                    Now
                  </span>
                </div>
                <div className="font-semibold text-sm text-[#3a1a22]">
                  Fontainhas Latin Quarter Walking Tour
                </div>
                <div className="text-[11px] text-[#3a1a22]/70 mt-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#c85f72]" />
                  <span>Panaji Latin Quarter Galleries</span>
                </div>
                <div className="mt-3 text-[10px] text-emerald-700 font-semibold">
                  Guide: Master Historian Antonio
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#EF9CA7]/30">
                <span className="text-[10px] uppercase font-bold text-[#c85f72] block mb-1">
                  Next Activity
                </span>
                <div className="font-semibold text-sm text-[#3a1a22]">
                  Private Goan-Portuguese Tasting Luncheon
                </div>
                <div className="text-[11px] text-[#3a1a22]/70 mt-1 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#c85f72]" />
                  <span>01:00 PM (15 mins walk / chauffeur)</span>
                </div>
                <div className="mt-3 text-[10px] text-[#3a1a22]/60">
                  Table reserved under: Clara Voyager
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#EF9CA7]/30">
                <span className="text-[10px] uppercase font-bold text-[#c85f72] block mb-1">
                  Standby Chauffeur
                </span>
                <div className="font-semibold text-sm text-[#3a1a22]">
                  Tariq (Plate QA-8812)
                </div>
                <div className="text-[11px] text-[#3a1a22]/70 mt-1 flex items-center gap-1">
                  <Car className="w-3 h-3 text-amber-500" />
                  <span>Parked 2 mins away at Church Square</span>
                </div>
                <div className="mt-3 text-[10px] text-emerald-700 font-semibold">
                  Air conditioning pre-cooled
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#EF9CA7]/30">
                <span className="text-[10px] uppercase font-bold text-[#c85f72] block mb-1">
                  Tonight's Residence
                </span>
                <div className="font-semibold text-sm text-[#3a1a22]">
                  Azora Heritage Sea Villa
                </div>
                <div className="text-[11px] text-[#3a1a22]/70 mt-1 flex items-center gap-1">
                  <Bed className="w-3 h-3 text-[#c85f72]" />
                  <span>Private Oceanview Suite #4</span>
                </div>
                <div className="mt-3 text-[10px] text-[#c85f72] font-semibold">
                  Turndown service scheduled 8 PM
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
