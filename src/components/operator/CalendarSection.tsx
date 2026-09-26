import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Car,
  Bed,
  Sparkles,
  Plane,
  ChevronLeft,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { CalendarEvent } from './operatorData';

interface CalendarSectionProps {
  events: CalendarEvent[];
}

export const CalendarSection: React.FC<CalendarSectionProps> = ({ events }) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const days = Array.from(new Set(events.map((e) => e.dayLabel)));

  const filteredEvents = filterCategory === 'all'
    ? events
    : events.filter((e) => e.category === filterCategory);

  const getCategoryBadge = (cat: CalendarEvent['category']) => {
    switch (cat) {
      case 'checkin':
      case 'checkout':
        return { label: 'Lodging Turnaround', bg: 'bg-purple-100 text-purple-900 border-purple-200' };
      case 'transit':
        return { label: 'Chauffeur Transit', bg: 'bg-blue-100 text-blue-900 border-blue-200' };
      case 'vip':
        return { label: 'VIP Curated Slot', bg: 'bg-amber-100 text-amber-900 border-amber-200' };
      default:
        return { label: 'Guided Activity', bg: 'bg-emerald-100 text-emerald-900 border-emerald-200' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="backdrop-blur-xl bg-white/90 border border-[#EF9CA7]/30 rounded-3xl p-6 sm:p-8 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFDDE1]/60 text-xs font-bold text-[#c85f72] mb-1">
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>OPERATIONAL TIMELINE & TURNAROUNDS</span>
          </div>
          <h2 className="font-cormorant text-3xl font-normal text-[#3a1a22]">
            Daily Dispatch & Transit Calendar
          </h2>
          <p className="text-xs text-[#3a1a22]/70 mt-1 max-w-xl">
            Multi-destination master schedule coordinating simultaneous airport arrivals, chauffeur escorts, and hotel check-in buffers.
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-2">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-white border border-[#EF9CA7]/40 text-xs font-semibold text-[#3a1a22] focus:outline-none focus:border-[#c85f72]"
          >
            <option value="all">All Dispatches</option>
            <option value="transit">Chauffeur & Airport Transits</option>
            <option value="checkin">Hotel Check-ins</option>
            <option value="vip">VIP Experiences</option>
            <option value="activity">Activities</option>
          </select>
        </div>
      </div>

      {/* Daily Gantt-Style Timeline */}
      <div className="space-y-6">
        {days.map((day) => {
          const dayEvents = filteredEvents.filter((e) => e.dayLabel === day);
          if (dayEvents.length === 0) return null;

          return (
            <div
              key={day}
              className="backdrop-blur-xl bg-white/95 border border-[#EF9CA7]/30 rounded-3xl p-6 shadow-xs space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#EF9CA7]/20">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#c85f72]" />
                  <h3 className="font-cormorant text-2xl font-semibold text-[#3a1a22]">{day}</h3>
                </div>
                <span className="text-[11px] font-mono text-[#3a1a22]/60">
                  {dayEvents.length} Dispatches Scheduled
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {dayEvents.map((evt) => {
                  const badge = getCategoryBadge(evt.category);

                  return (
                    <div
                      key={evt.id}
                      className="p-4 rounded-2xl bg-[#FCF8F9] hover:bg-white border border-[#EF9CA7]/25 hover:border-[#c85f72] transition-all card-hover-physics flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${badge.bg}`}>
                            {badge.label}
                          </span>
                          <span className="text-[10px] font-mono font-bold text-[#c85f72]">
                            {evt.timeSlot}
                          </span>
                        </div>

                        <h4 className="font-semibold text-xs text-[#3a1a22] leading-snug">
                          {evt.title}
                        </h4>
                        <div className="flex items-center gap-1.5 text-[11px] text-[#3a1a22]/70 mt-1">
                          <MapPin className="w-3 h-3 text-[#c85f72] shrink-0" />
                          <span className="truncate">{evt.location}</span>
                        </div>
                      </div>

                      <div className="mt-3 pt-2 border-t border-[#EF9CA7]/20 flex items-center justify-between text-[10px]">
                        <span className="text-[#3a1a22]/60">{evt.travelerName}</span>
                        <span className="font-semibold text-emerald-800">{evt.status}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
