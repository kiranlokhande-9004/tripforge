import React, { useState } from 'react';
import { Bed, Star, ShieldCheck, Plus, Check, MapPin, Sparkles, ChevronRight } from 'lucide-react';
import { CuratedStay, CURATED_STAYS, TripBookingItem } from './data';

interface CuratedStaysSectionProps {
  onAddStayToTrip: (stay: CuratedStay) => void;
  bookedStayNames?: string[];
}

export const CuratedStaysSection: React.FC<CuratedStaysSectionProps> = ({
  onAddStayToTrip,
  bookedStayNames = [],
}) => {
  const [filterType, setFilterType] = useState<string>('All');
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  const categories = ['All', 'Portuguese Heritage Villa', 'Royal Lake Palace', 'Waterfront Eco-Resort', 'Colonial Cedar Lodge'];

  const filteredStays = filterType === 'All'
    ? CURATED_STAYS
    : CURATED_STAYS.filter((s) => s.type.toLowerCase().includes(filterType.toLowerCase()));

  const handleAdd = (stay: CuratedStay) => {
    onAddStayToTrip(stay);
    setAddedIds((prev) => new Set(prev).add(stay.id));
    setTimeout(() => {
      setAddedIds((prev) => {
        const next = new Set(prev);
        next.delete(stay.id);
        return next;
      });
    }, 2500);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#c85f72] block mb-1">
            Bespoke Accommodations
          </span>
          <h2 className="font-cormorant text-3xl sm:text-4xl font-normal text-[#3a1a22]">
            Curated Stays & Private Sanctuaries
          </h2>
          <p className="text-xs sm:text-sm text-[#3a1a22]/70 mt-1 max-w-2xl">
            Handpicked heritage estates and architect-designed private villas, pre-negotiated by verified local operators with VIP concierge privileges.
          </p>
        </div>

        {/* Filter chips */}
        <div className="flex flex-wrap gap-1.5 self-start md:self-auto">
          {['All', 'Heritage Villas', 'Lake Palaces', 'Eco Lodges'].map((tab) => {
            const active = (tab === 'All' && filterType === 'All') ||
              (tab === 'Heritage Villas' && filterType.includes('Villa')) ||
              (tab === 'Lake Palaces' && filterType.includes('Palace')) ||
              (tab === 'Eco Lodges' && filterType.includes('Eco'));
            return (
              <button
                key={tab}
                onClick={() => {
                  if (tab === 'All') setFilterType('All');
                  else if (tab === 'Heritage Villas') setFilterType('Portuguese Heritage Villa');
                  else if (tab === 'Lake Palaces') setFilterType('Royal Lake Palace');
                  else if (tab === 'Eco Lodges') setFilterType('Waterfront Eco-Resort');
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  active
                    ? 'bg-[#c85f72] text-white shadow-xs font-semibold'
                    : 'bg-white border border-[#EF9CA7]/40 text-[#3a1a22]/80 hover:bg-[#FFDDE1]/40'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStays.map((stay) => {
          const isAdded = addedIds.has(stay.id) || bookedStayNames.some((n) => n.toLowerCase().includes(stay.name.toLowerCase()));
          return (
            <div
              key={stay.id}
              className="group rounded-3xl bg-white border border-[#EF9CA7]/30 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Photo & badges */}
                <div className="relative h-52 w-full overflow-hidden bg-[#FFDDE1]/30">
                  <img
                    src={stay.image}
                    alt={stay.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-white/95 backdrop-blur-md text-[10px] font-bold text-[#c85f72] tracking-wider uppercase shadow-xs">
                      {stay.tag}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#3a1a22]/80 backdrop-blur-md text-[10px] font-semibold text-white tracking-wider uppercase">
                      {stay.destination}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
                    <div className="flex items-center gap-1 text-xs font-bold bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-lg">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{stay.rating}</span>
                      <span className="text-white/70 font-normal">({stay.reviewsCount})</span>
                    </div>
                    <span className="text-[11px] font-semibold text-[#FFDDE1] flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{stay.operatorBadge}</span>
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-5">
                  <div className="text-[11px] text-[#c85f72] font-semibold uppercase tracking-wider mb-1">
                    {stay.type}
                  </div>
                  <h3 className="font-cormorant text-2xl font-medium text-[#3a1a22] leading-tight">
                    {stay.name}
                  </h3>

                  {/* Amenities */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {stay.amenities.map((amenity) => (
                      <span
                        key={amenity}
                        className="px-2 py-0.5 rounded-md bg-[#FCF8F9] border border-[#EF9CA7]/25 text-[10px] text-[#3a1a22]/80 font-medium"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer price & action */}
              <div className="p-5 pt-0">
                <div className="pt-3 border-t border-[#EF9CA7]/20 flex items-center justify-between mb-3">
                  <div>
                    <span className="text-[10px] text-[#3a1a22]/50 uppercase tracking-wider block">
                      Nightly Rate
                    </span>
                    <span className="font-mono text-base font-bold text-[#c85f72]">
                      ₹{stay.pricePerNight.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-[#3a1a22]/60"> / suite</span>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    VIP Upgrade Included
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleAdd(stay)}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
                    isAdded
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white hover:bg-[#c85f72] hover:text-white border border-[#EF9CA7]/60 text-[#3a1a22]'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Stay Linked to Trip</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5 text-[#c85f72] group-hover:text-white" />
                      <span>Add Stay to Trip</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
