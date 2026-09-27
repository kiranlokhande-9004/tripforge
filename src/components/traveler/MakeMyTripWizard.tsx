import React, { useState } from 'react';
import {
  X,
  Sparkles,
  MapPin,
  Calendar,
  Users,
  Wallet,
  Compass,
  Bed,
  Car,
  Heart,
  Check,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { TripData } from './data';
import { LocationSearch } from './LocationSearch';
import { TripMap } from './TripMap';

interface MakeMyTripWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onTripGenerated: (newTrip: TripData) => void;
  initialDestination?: string;
  initialOrigin?: string;
}

export const MakeMyTripWizard: React.FC<MakeMyTripWizardProps> = ({
  isOpen,
  onClose,
  onTripGenerated,
  initialDestination = 'Goa',
  initialOrigin = 'Mumbai',
}) => {
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingStage, setGeneratingStage] = useState(0);

  // Form Fields
  const [destination, setDestination] = useState(initialDestination);
  const [origin, setOrigin] = useState(initialOrigin);
  const [originLocation, setOriginLocation] = useState<{
  name: string;
  lng: number;
  lat: number;
} | null>(null);

const [destinationLocation, setDestinationLocation] = useState<{
  name: string;
  lng: number;
  lat: number;
} | null>(null);
  const [startDate, setStartDate] = useState('12 Oct');
  const [endDate, setEndDate] = useState('17 Oct, 2026');
  const [travelers, setTravelers] = useState(2);
  const [budget, setBudget] = useState('50000');

  const [travelStyle, setTravelStyle] = useState<string>('Luxury');
  const [accommodation, setAccommodation] = useState<string>('Villa');
  const [transportation, setTransportation] = useState<string>('Private Car');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'Beach',
    'Food',
    'Culture',
  ]);
  const [specialRequirements, setSpecialRequirements] = useState(
    'Private chef breakfast and sunset ocean view guaranteed.'
  );

  const styleOptions = [
    'Relaxed',
    'Adventure',
    'Luxury',
    'Budget',
    'Family',
    'Cultural',
    'Food',
    'Romantic',
  ];

  const accommodationOptions = [
    { label: 'Hotel', desc: 'Curated 5-star & boutique service' },
    { label: 'Resort', desc: 'All-inclusive seaside & mountain properties' },
    { label: 'Villa', desc: 'Private estate with personal butler' },
    { label: 'Homestay', desc: 'Authentic local heritage hosting' },
    { label: 'Hostel', desc: 'Social vibe & minimalist suites' },
  ];

  const transportationOptions = [
    { label: 'Flight', desc: 'Direct scheduled aviation' },
    { label: 'Private Car', desc: 'Chauffeured sedan or SUV on standby' },
    { label: 'Train', desc: 'Panoramic express or luxury rail' },
    { label: 'Rental Car', desc: 'Self-drive luxury vehicle' },
    { label: 'Bus', desc: 'Comfort inter-city sleeper' },
  ];

  const interestOptions = [
    'Beach',
    'Mountain',
    'Food',
    'Culture',
    'History',
    'Shopping',
    'Nature',
    'Adventure',
    'Nightlife',
  ];

  const toggleInterest = (item: string) => {
    if (selectedInterests.includes(item)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== item));
    } else {
      setSelectedInterests([...selectedInterests, item]);
    }
  };

  const generationStages = [
    'Understanding preferences & party size...',
    'Optimizing route & golden hour sequencing...',
    'Balancing budget & luxury inventory...',
    'Finalizing bespoke blueprint with local operator...',
  ];

  if (!isOpen) return null;
  const calculateTripDays = (start: string, end: string) => {
  try {
    const startYear = start.match(/\d{4}/)?.[0] || '2026';
    const endYear = end.match(/\d{4}/)?.[0] || startYear;

    const startDateObj = new Date(`${start}, ${startYear}`);
    const endDateObj = new Date(`${end}, ${endYear}`);

    const difference =
      endDateObj.getTime() - startDateObj.getTime();

    const days =
      Math.ceil(difference / (1000 * 60 * 60 * 24)) + 1;

    return days > 0 ? days : 1;
  } catch {
    return 1;
  }
};

  const handleGenerate = () => {
    setIsGenerating(true);
    setGeneratingStage(0);

    const stageTimer1 = setTimeout(() => setGeneratingStage(1), 350);
    const stageTimer2 = setTimeout(() => setGeneratingStage(2), 700);
    const stageTimer3 = setTimeout(() => setGeneratingStage(3), 1050);

    setTimeout(() => {
      clearTimeout(stageTimer1);
      clearTimeout(stageTimer2);
      clearTimeout(stageTimer3);
      setIsGenerating(false);
      const newTrip: TripData = {
        id: `TF-${destination.toUpperCase().slice(0, 3)}-${Date.now().toString().slice(-4)}`,
        title: `Bespoke ${destination} Expedition`,
        origin: origin || 'Mumbai',
        destination: destination,
        startDate: startDate,
        endDate: endDate,
        duration: `${calculateTripDays(startDate, endDate)} Days · ${Math.max(
  calculateTripDays(startDate, endDate) - 1,
  0
)} Nights`,
        travelers: travelers,
        travelerType: `${travelers} Adults`,
        totalBudget: Number(budget) || 50000,
        status: 'Planning',
        progress: 35,
        coverImage:
          'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
        operatorName: 'Assigned Local Specialist',
        operatorId: 'OP-PENDING',
        hotel: `${accommodation} in ${destination}`,
        transport: transportation,
        style: travelStyle,
        interests: selectedInterests,
      };
      onTripGenerated(newTrip);
      onClose();
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-3xl border border-[#EF9CA7]/40 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-[#EF9CA7]/30 flex items-center justify-between bg-gradient-to-r from-[#FFF5F6] to-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FFDDE1] text-[#c85f72] flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-semibold text-[#c85f72] tracking-[0.2em] uppercase block">
                TripForge Customizer
              </span>
              <h3 className="font-cormorant text-2xl font-medium text-[#3a1a22] leading-tight">
                Make My Trip
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs font-mono font-medium text-[#c85f72] bg-[#FFDDE1]/60 px-2.5 py-1 rounded-full">
              Step {step} of 3
            </span>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-[#3a1a22]/50 hover:text-[#c85f72] hover:bg-[#FFDDE1]/40 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Animated Step Progress Bar */}
        <div className="w-full bg-[#FFDDE1]/40 h-1 overflow-hidden">
          <div
            style={{ width: `${(step / 3) * 100}%` }}
            className="h-full bg-gradient-to-r from-[#EF9CA7] to-[#c85f72] transition-all duration-500 ease-out"
          />
        </div>

        {/* AI Multi-Stage Generation State Overlay */}
        {isGenerating && (
          <div className="absolute inset-0 z-50 bg-white/95 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center animate-fadeIn">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#EF9CA7] to-[#FFDDE1] p-0.5 shadow-lg mb-6 animate-pulse-subtle">
              <div className="w-full h-full rounded-3xl bg-white flex items-center justify-center text-[#c85f72]">
                <Sparkles className="w-8 h-8 animate-spin text-[#c85f72]" style={{ animationDuration: '4s' }} />
              </div>
            </div>

            <span className="text-[11px] font-semibold text-[#c85f72] tracking-[0.25em] uppercase block mb-1">
              TripForge AI Orchestration
            </span>
            <h3 className="font-cormorant text-3xl font-medium text-[#3a1a22] mb-3">
              Shaping Your Bespoke Journey
            </h3>
            
            <p className="text-xs text-[#3a1a22]/70 max-w-sm mb-6 h-5 transition-opacity duration-300">
              {generationStages[generatingStage]}
            </p>

            <div className="w-64 h-2 bg-[#FFDDE1] rounded-full overflow-hidden mb-6 shadow-inner">
              <div
                style={{ width: `${((generatingStage + 1) / 4) * 100}%` }}
                className="h-full bg-gradient-to-r from-[#EF9CA7] to-[#c85f72] transition-all duration-350 ease-out rounded-full"
              />
            </div>

            <div className="space-y-2 text-left max-w-xs text-xs text-[#3a1a22]/80">
              {generationStages.map((stg, i) => (
                <div key={stg} className="flex items-center gap-2">
                  <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-bold transition-colors ${
                    i < generatingStage ? 'bg-emerald-500 text-white' : i === generatingStage ? 'bg-[#c85f72] text-white animate-pulse' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {i < generatingStage ? '✓' : i + 1}
                  </div>
                  <span className={i === generatingStage ? 'font-semibold text-[#3a1a22]' : 'text-[#3a1a22]/60'}>
                    {stg.replace('...', '')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Wizard Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
          {/* STEP 1: Core Logistics */}
          {step === 1 && (
            <div key="step-1" className="space-y-5 animate-step-in">
              <div>
                <h4 className="font-cormorant text-2xl font-normal text-[#3a1a22]">
                  Where & When will your journey take you?
                </h4>
                <p className="text-xs text-[#3a1a22]/70 mt-0.5">
                  Define your route, timeline, and travel party.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  <LocationSearch
    label="Origin City"
    value={originLocation}
    placeholder="Search origin — Mumbai, Delhi..."
    onSelect={(location) => {
      setOriginLocation(location);
      setOrigin(location.name);
    }}
  />

  <LocationSearch
    label="Destination"
    value={destinationLocation}
    placeholder="Search destination — Goa, Kerala..."
    onSelect={(location) => {
      setDestinationLocation(location);
      setDestination(location.name);
    }}
  />
</div>
{(originLocation || destinationLocation) && (
  <div className="mt-4">
    <div className="flex items-center justify-between mb-2">
      <div>
        <div className="text-xs font-semibold text-[#3a1a22] uppercase tracking-wider">
          Route Intelligence
        </div>

        <div className="text-[10px] text-[#3a1a22]/60 mt-0.5">
          Live route, traffic & destination weather
        </div>
      </div>

      <div className="text-[9px] uppercase tracking-wider text-[#c85f72] font-semibold">
        LIVE
      </div>
    </div>

    <TripMap
      origin={originLocation}
      destination={destinationLocation}
    />
  </div>
)}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#3a1a22] uppercase tracking-wider mb-1.5">
                    Travel Dates
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 absolute left-3 top-3 text-[#c85f72]" />
                    <input
                      type="text"
                      value={`${startDate} – ${endDate}`}
                      onChange={(e) => {
                        const parts = e.target.value.split('–');
                        setStartDate(parts[0]?.trim() || '12 Oct');
                        setEndDate(parts[1]?.trim() || '17 Oct, 2026');
                      }}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#EF9CA7]/50 text-xs sm:text-sm text-[#3a1a22] bg-[#FCF8F9] focus:outline-none focus:border-[#c85f72]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3a1a22] uppercase tracking-wider mb-1.5">
                    Travelers Count
                  </label>
                  <div className="relative flex items-center">
                    <Users className="w-4 h-4 absolute left-3 text-[#c85f72]" />
                    <select
                      value={travelers}
                      onChange={(e) => setTravelers(Number(e.target.value))}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#EF9CA7]/50 text-xs sm:text-sm text-[#3a1a22] bg-[#FCF8F9] focus:outline-none focus:border-[#c85f72]"
                    >
                      <option value={1}>1 Solo Explorer</option>
                      <option value={2}>2 Adults (Couple / Friends)</option>
                      <option value={4}>4 Travelers (Family / Group)</option>
                      <option value={6}>6+ Large Entourage</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3a1a22] uppercase tracking-wider mb-1.5">
                  Target Budget (INR ₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 font-bold text-sm text-[#c85f72]">₹</span>
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="e.g. 50000"
                    className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-[#EF9CA7]/50 text-xs sm:text-sm text-[#3a1a22] bg-[#FCF8F9] focus:outline-none focus:border-[#c85f72] font-mono"
                  />
                </div>
                <div className="flex gap-2 mt-2">
                  {['35000', '50000', '75000', '120000'].map((b) => (
                    <button
                      type="button"
                      key={b}
                      onClick={() => setBudget(b)}
                      className="px-2.5 py-1 rounded-lg bg-[#FFDDE1]/40 hover:bg-[#FFDDE1] text-[11px] font-mono text-[#c85f72] border border-[#EF9CA7]/30 transition-colors cursor-pointer"
                    >
                      ₹{Number(b).toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Style, Accommodation & Transport */}
          {step === 2 && (
            <div key="step-2" className="space-y-6 animate-step-in">
              <div>
                <h4 className="font-cormorant text-2xl font-normal text-[#3a1a22]">
                  How would you love to travel?
                </h4>
                <p className="text-xs text-[#3a1a22]/70 mt-0.5">
                  Choose your pacing vibe, lodging category, and transportation mode.
                </p>
              </div>

              {/* Travel Style */}
              <div>
                <label className="block text-xs font-semibold text-[#3a1a22] uppercase tracking-wider mb-2">
                  Travel Style
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {styleOptions.map((st) => (
                    <button
                      type="button"
                      key={st}
                      onClick={() => setTravelStyle(st)}
                      className={`p-2.5 rounded-xl text-xs font-medium text-center border transition-all cursor-pointer ${
                        travelStyle === st
                          ? 'bg-[#c85f72] text-white border-[#c85f72] shadow-xs'
                          : 'bg-[#FCF8F9] border-[#EF9CA7]/40 text-[#3a1a22] hover:bg-[#FFDDE1]/40'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Accommodation */}
              <div>
                <label className="block text-xs font-semibold text-[#3a1a22] uppercase tracking-wider mb-2">
                  Preferred Accommodation
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {accommodationOptions.slice(0, 3).map((acc) => (
                    <button
                      type="button"
                      key={acc.label}
                      onClick={() => setAccommodation(acc.label)}
                      className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                        accommodation === acc.label
                          ? 'bg-[#FFDDE1]/70 border-[#c85f72] ring-1 ring-[#c85f72]'
                          : 'bg-[#FCF8F9] border-[#EF9CA7]/30 hover:border-[#EF9CA7]'
                      }`}
                    >
                      <div className="text-xs font-semibold text-[#3a1a22]">{acc.label}</div>
                      <div className="text-[10px] text-[#3a1a22]/60 mt-0.5">{acc.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Transportation */}
              <div>
                <label className="block text-xs font-semibold text-[#3a1a22] uppercase tracking-wider mb-2">
                  Transportation Mode
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {transportationOptions.slice(0, 3).map((tr) => (
                    <button
                      type="button"
                      key={tr.label}
                      onClick={() => setTransportation(tr.label)}
                      className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                        transportation === tr.label
                          ? 'bg-[#FFDDE1]/70 border-[#c85f72] ring-1 ring-[#c85f72]'
                          : 'bg-[#FCF8F9] border-[#EF9CA7]/30 hover:border-[#EF9CA7]'
                      }`}
                    >
                      <div className="text-xs font-semibold text-[#3a1a22]">{tr.label}</div>
                      <div className="text-[10px] text-[#3a1a22]/60 mt-0.5">{tr.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Interests & Special Requirements */}
          {step === 3 && (
            <div key="step-3" className="space-y-6 animate-step-in">
              <div>
                <h4 className="font-cormorant text-2xl font-normal text-[#3a1a22]">
                  Fine-tune your bespoke experiences
                </h4>
                <p className="text-xs text-[#3a1a22]/70 mt-0.5">
                  Select interests and add any custom requests for our operators.
                </p>
              </div>

              {/* Interests Multi-Select */}
              <div>
                <label className="block text-xs font-semibold text-[#3a1a22] uppercase tracking-wider mb-2">
                  Interests & Passions
                </label>
                <div className="flex flex-wrap gap-2">
                  {interestOptions.map((item) => {
                    const isSelected = selectedInterests.includes(item);
                    return (
                      <button
                        type="button"
                        key={item}
                        onClick={() => toggleInterest(item)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-[#c85f72] text-white shadow-xs'
                            : 'bg-white border border-[#EF9CA7]/40 text-[#3a1a22]/75 hover:bg-[#FFDDE1]/40'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3" />}
                        <span>{item}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Special Requirements */}
              <div>
                <label className="block text-xs font-semibold text-[#3a1a22] uppercase tracking-wider mb-1.5">
                  Special Requirements & Preferences
                </label>
                <textarea
                  rows={3}
                  value={specialRequirements}
                  onChange={(e) => setSpecialRequirements(e.target.value)}
                  placeholder="Dietary requirements, anniversary celebrations, wheelchair access, photography guides..."
                  className="w-full p-3 rounded-xl border border-[#EF9CA7]/50 text-xs sm:text-sm text-[#3a1a22] bg-[#FCF8F9] focus:outline-none focus:border-[#c85f72] leading-relaxed resize-none"
                />
              </div>

              {/* Summary Pill Preview */}
              <div className="p-4 rounded-2xl bg-[#FFF5F6] border border-[#EF9CA7]/30 text-xs text-[#3a1a22]/80 space-y-1">
                <div className="font-semibold text-[#c85f72] uppercase tracking-wider text-[10px]">
                  Custom Trip Blueprint
                </div>
                <div>
                  Route: <span className="font-medium text-[#3a1a22]">{origin} → {destination}</span> ({startDate} – {endDate})
                </div>
                <div>
                  Party: <span className="font-medium text-[#3a1a22]">{travelers} Guests</span> · Budget: <span className="font-medium font-mono text-[#c85f72]">₹{Number(budget).toLocaleString()}</span>
                </div>
                <div>
                  Style: <span className="font-medium text-[#3a1a22]">{travelStyle}</span> · Stay: <span className="font-medium text-[#3a1a22]">{accommodation}</span> · Transit: <span className="font-medium text-[#3a1a22]">{transportation}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Wizard Footer Controls */}
        <div className="px-6 py-4 border-t border-[#EF9CA7]/30 bg-[#FCF8F9] flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#3a1a22] hover:bg-[#FFDDE1]/40 border border-[#EF9CA7]/40 flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>
          ) : (
            <button
              onClick={onClose}
              className="text-xs text-[#3a1a22]/60 hover:text-[#c85f72] cursor-pointer"
            >
              Cancel
            </button>
          )}

          {step < 3 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              className="px-5 py-2.5 rounded-xl bg-[#c85f72] hover:bg-[#3a1a22] text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm"
            >
              <span>Continue</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="px-6 py-2.5 rounded-xl bg-[#c85f72] hover:bg-[#3a1a22] text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors shadow-md hover:shadow-lg disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isGenerating ? 'Synthesizing with Gemini...' : 'Generate My Trip'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
