import React, { useState } from 'react';
import { Search, MapPin, Calendar, Users, Sparkles, ChevronDown } from 'lucide-react';

interface HeroSearchBarProps {
  onSearch: (params: { destination: string; travelers: number; style: string }) => void;
  onOpenWizard: (dest?: string) => void;
}

export const HeroSearchBar: React.FC<HeroSearchBarProps> = ({ onSearch, onOpenWizard }) => {
  const [destination, setDestination] = useState('Goa');
  const [duration, setDuration] = useState('5 Days');
  const [travelers, setTravelers] = useState(2);
  const [style, setStyle] = useState('Luxury & Cultural');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const quickDestinations = ['Goa', 'Udaipur', 'Kerala', 'Shimla', 'Bali', 'Swiss Alps'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ destination, travelers, style });
    onOpenWizard(destination);
  };

  return (
    <div className="mt-8 bg-white/95 backdrop-blur-xl rounded-3xl p-3 sm:p-4 border border-[#EF9CA7]/40 shadow-xl max-w-4xl">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
        {/* Destination input */}
        <div className="lg:col-span-4 p-2.5 rounded-2xl bg-[#FCF8F9] hover:bg-[#FFF5F6] border border-[#EF9CA7]/30 transition-colors">
          <label className="text-[10px] font-bold uppercase tracking-wider text-[#c85f72] flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            Where to?
          </label>
          <div className="relative mt-1">
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="e.g. Goa, Udaipur..."
              className="w-full bg-transparent text-xs font-semibold text-[#3a1a22] focus:outline-none placeholder-[#3a1a22]/40"
            />
          </div>
        </div>

        {/* Duration / Dates */}
        <div className="lg:col-span-3 p-2.5 rounded-2xl bg-[#FCF8F9] hover:bg-[#FFF5F6] border border-[#EF9CA7]/30 transition-colors">
          <label className="text-[10px] font-bold uppercase tracking-wider text-[#c85f72] flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            When & Length
          </label>
          <select
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full bg-transparent text-xs font-semibold text-[#3a1a22] focus:outline-none cursor-pointer mt-1"
          >
            <option value="3 Days">3 Days · Weekend</option>
            <option value="5 Days">5 Days · Bespoke</option>
            <option value="7 Days">7 Days · Grand Tour</option>
            <option value="10 Days">10+ Days · Expedition</option>
          </select>
        </div>

        {/* Travelers & Style */}
        <div className="lg:col-span-2 p-2.5 rounded-2xl bg-[#FCF8F9] hover:bg-[#FFF5F6] border border-[#EF9CA7]/30 transition-colors">
          <label className="text-[10px] font-bold uppercase tracking-wider text-[#c85f72] flex items-center gap-1">
            <Users className="w-3 h-3" />
            Guests
          </label>
          <select
            value={travelers}
            onChange={(e) => setTravelers(Number(e.target.value))}
            className="w-full bg-transparent text-xs font-semibold text-[#3a1a22] focus:outline-none cursor-pointer mt-1"
          >
            <option value={1}>1 Solo Explorer</option>
            <option value={2}>2 Couple / Pair</option>
            <option value={4}>4 Family / Small Group</option>
            <option value={6}>6+ Custom Group</option>
          </select>
        </div>

        {/* Forge Action Button */}
        <div className="lg:col-span-3">
          <button
            type="submit"
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-[#c85f72] to-[#3a1a22] hover:from-[#3a1a22] hover:to-[#c85f72] text-white text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#FFDDE1]" />
            <span>FORGE JOURNEY</span>
          </button>
        </div>
      </form>

      {/* Quick destination tags */}
      <div className="mt-2.5 pt-2 border-t border-[#EF9CA7]/20 flex flex-wrap items-center gap-1.5 text-[11px] text-[#3a1a22]/70 px-1">
        <span className="font-semibold text-[#c85f72]">Trending:</span>
        {quickDestinations.map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => setDestination(d)}
            className={`px-2.5 py-0.5 rounded-full transition-all cursor-pointer ${
              destination.toLowerCase() === d.toLowerCase()
                ? 'bg-[#c85f72] text-white font-semibold shadow-xs'
                : 'bg-[#FFDDE1]/50 hover:bg-[#FFDDE1] text-[#3a1a22]'
            }`}
          >
            {d}
          </button>
        ))}
      </div>
    </div>
  );
};
