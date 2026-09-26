import React, { useState } from 'react';
import { Calendar, Users, Wallet, CheckCircle2, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { TripData } from './data';

interface MyTripsPortfolioProps {
  currentTrip: TripData;
  otherTrips: TripData[];
  onSelectTrip: (trip: TripData) => void;
}

export const MyTripsPortfolio: React.FC<MyTripsPortfolioProps> = ({
  currentTrip,
  otherTrips,
  onSelectTrip,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const allTrips: TripData[] = [currentTrip, ...otherTrips];

  const categories = [
    'All',
    'Upcoming',
    'Planning',
    'Pending Approval',
    'Confirmed',
    'Ongoing',
    'Completed',
  ];

  const filteredTrips = activeCategory === 'All'
    ? allTrips
    : allTrips.filter((t) => {
        if (activeCategory === 'Upcoming') return t.status === 'Confirmed' || t.status === 'Ongoing';
        if (activeCategory === 'Pending Approval') return t.status === 'Pending Operator Approval';
        return t.status.toLowerCase() === activeCategory.toLowerCase();
      });

  return (
    <section id="my-trips-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="bg-white rounded-3xl p-6 sm:p-9 border border-[#EF9CA7]/30 shadow-lg">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EF9CA7]/30 mb-6">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#c85f72] block mb-1">
              Travel Portfolio
            </span>
            <h2 className="font-cormorant text-3xl sm:text-4xl font-normal text-[#3a1a22]">
              My Trips
            </h2>
            <p className="text-xs sm:text-sm text-[#3a1a22]/70 mt-1">
              Your historical, ongoing, and planned journeys orchestrated through TripForge.
            </p>
          </div>

          <span className="px-3.5 py-1 rounded-full bg-[#FFDDE1] text-[#c85f72] text-xs font-semibold self-start sm:self-auto">
            {allTrips.length} Total Journeys
          </span>
        </div>

        {/* Category Tabs */}
        <div className="mb-6 flex flex-wrap items-center gap-1.5 pb-2 overflow-x-auto">
          {categories.map((cat) => {
            const active = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  active
                    ? 'bg-[#c85f72] text-white font-semibold shadow-xs'
                    : 'bg-[#FCF8F9] hover:bg-[#FFDDE1]/40 text-[#3a1a22]/80 border border-[#EF9CA7]/30'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Trips Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map((t) => {
            const isCurrentlyActive = t.id === currentTrip.id;
            return (
              <div
                key={t.id}
                className={`rounded-2xl border overflow-hidden bg-[#FCF8F9] flex flex-col justify-between shadow-xs hover:shadow-md transition-all ${
                  isCurrentlyActive ? 'border-[#c85f72] ring-2 ring-[#c85f72]/20' : 'border-[#EF9CA7]/30'
                }`}
              >
                <div>
                  <div className="h-40 w-full relative overflow-hidden bg-[#FFDDE1]/40">
                    <img
                      src={t.coverImage}
                      alt={t.destination}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span className="bg-black/70 backdrop-blur-md text-white text-[10px] font-mono px-2 py-0.5 rounded">
                        {t.status}
                      </span>
                      {isCurrentlyActive && (
                        <span className="bg-[#c85f72] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-xs">
                          In Workspace
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-5">
                    <h4 className="font-cormorant text-2xl font-medium text-[#3a1a22] leading-tight">
                      {t.origin} → {t.destination}
                    </h4>

                    <div className="text-xs text-[#3a1a22]/70 mt-2 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#c85f72]" />
                      <span>{t.startDate} – {t.endDate}</span>
                    </div>

                    <div className="text-xs text-[#3a1a22]/70 mt-1 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#c85f72]" />
                      <span>{t.travelerType} · {t.style}</span>
                    </div>

                    <div className="mt-3 pt-3 border-t border-[#EF9CA7]/20 flex items-center justify-between">
                      <span className="text-[10px] uppercase font-semibold text-[#3a1a22]/50">
                        Total Budget
                      </span>
                      <span className="font-mono text-xs font-bold text-[#c85f72]">
                        ₹{t.totalBudget.toLocaleString()}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3 space-y-1">
                      <div className="flex justify-between text-[10px] text-[#3a1a22]/60 font-semibold">
                        <span>Progress</span>
                        <span>{t.progress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#FFDDE1] rounded-full overflow-hidden">
                        <div
                          style={{ width: `${t.progress}%` }}
                          className="bg-gradient-to-r from-[#EF9CA7] to-[#c85f72] h-full rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button
                    onClick={() => {
                      onSelectTrip(t);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`w-full py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                      isCurrentlyActive
                        ? 'bg-[#c85f72] text-white shadow-xs'
                        : 'bg-white hover:bg-[#FFDDE1]/40 border border-[#EF9CA7]/50 text-[#3a1a22]'
                    }`}
                  >
                    <span>{isCurrentlyActive ? 'Current Workspace' : 'Load into Workspace'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
