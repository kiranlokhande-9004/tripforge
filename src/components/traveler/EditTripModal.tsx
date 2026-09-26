import React, { useState } from 'react';
import {
  X,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Building,
  Car,
  Clock,
  DollarSign,
  Send,
  CheckCircle2,
} from 'lucide-react';
import { TripData } from './data';

interface EditTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: TripData;
  onUpdateTrip: (updated: Partial<TripData>) => void;
}

export const EditTripModal: React.FC<EditTripModalProps> = ({
  isOpen,
  onClose,
  trip,
  onUpdateTrip,
}) => {
  const [destination, setDestination] = useState(trip.destination);
  const [dates, setDates] = useState(`${trip.startDate} – ${trip.endDate}`);
  const [hotel, setHotel] = useState(trip.hotel);
  const [transport, setTransport] = useState(trip.transport);
  const [budget, setBudget] = useState(trip.totalBudget.toString());
  const [style, setStyle] = useState(trip.style);

  // Simulated dependency engine state
  const [hasChangedHotel, setHasChangedHotel] = useState(false);
  const [isSubmittingToOperator, setIsSubmittingToOperator] = useState(false);
  const [changeRequested, setChangeRequested] = useState(false);

  if (!isOpen) return null;

  const handleHotelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setHotel(e.target.value);
    setHasChangedHotel(true);
  };

  const handleSaveAndSubmit = () => {
    setIsSubmittingToOperator(true);
    setTimeout(() => {
      setIsSubmittingToOperator(false);
      setChangeRequested(true);
      onUpdateTrip({
        destination,
        hotel,
        transport,
        totalBudget: Number(budget) || trip.totalBudget,
        style,
        status: 'Pending Operator Approval',
      });
      setTimeout(() => {
        onClose();
        setChangeRequested(false);
      }, 1200);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-3xl border border-[#EF9CA7]/40 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#EF9CA7]/30 flex items-center justify-between bg-gradient-to-r from-[#FFF5F6] to-white">
          <div>
            <span className="text-[10px] font-semibold text-[#c85f72] tracking-[0.2em] uppercase block">
              TripForge Engine
            </span>
            <h3 className="font-cormorant text-2xl font-medium text-[#3a1a22]">
              Edit Trip & Dynamic Dependencies
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#3a1a22]/50 hover:text-[#c85f72] hover:bg-[#FFDDE1]/40 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
          {/* Dependency Cascade Warning Banner */}
          <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200/80 text-amber-950">
            <div className="flex items-center gap-2 font-semibold text-xs mb-1 text-amber-900">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Interconnected Trip Dependency Engine</span>
            </div>
            <p className="text-[11px] text-amber-900/80 leading-relaxed">
              In TripForge, modifying hotels or dates automatically calculates impacts on your private airport transfers, activity logistics, and sends a synchronized change request to your operator.
            </p>

            {/* Dependency Pipeline Flow */}
            <div className="mt-3 pt-3 border-t border-amber-200/60 flex flex-wrap items-center gap-1.5 text-[10px] font-medium text-amber-900">
              <span className="px-2 py-0.5 rounded bg-white/80 border border-amber-300">Change Hotel</span>
              <ArrowRight className="w-3 h-3 text-amber-500" />
              <span className="px-2 py-0.5 rounded bg-white/80 border border-amber-300">Affected Transit</span>
              <ArrowRight className="w-3 h-3 text-amber-500" />
              <span className="px-2 py-0.5 rounded bg-white/80 border border-amber-300">Activity Timing</span>
              <ArrowRight className="w-3 h-3 text-amber-500" />
              <span className="px-2 py-0.5 rounded bg-white/80 border border-amber-300">Cost Delta</span>
              <ArrowRight className="w-3 h-3 text-amber-500" />
              <span className="px-2 py-0.5 rounded bg-amber-600 text-white">Operator Request</span>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#3a1a22] uppercase tracking-wider mb-1.5">
                Destination
              </label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#EF9CA7]/50 text-xs text-[#3a1a22] bg-[#FCF8F9] focus:outline-none focus:border-[#c85f72]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#3a1a22] uppercase tracking-wider mb-1.5">
                Travel Dates
              </label>
              <input
                type="text"
                value={dates}
                onChange={(e) => setDates(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#EF9CA7]/50 text-xs text-[#3a1a22] bg-[#FCF8F9] focus:outline-none focus:border-[#c85f72]"
              />
            </div>
          </div>

          {/* Hotel & Transportation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#3a1a22] uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Accommodation</span>
                <span className="text-[10px] text-[#c85f72] font-normal">Triggers route recalc</span>
              </label>
              <select
                value={hotel}
                onChange={handleHotelChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#EF9CA7]/50 text-xs text-[#3a1a22] bg-[#FCF8F9] focus:outline-none focus:border-[#c85f72]"
              >
                <option value="Azora Heritage Sea Villa (Anjuna)">Azora Heritage Sea Villa (North Goa)</option>
                <option value="Taj Fort Aguada Cliffside Resort (Sinquerim)">Taj Fort Aguada Cliffside Resort</option>
                <option value="The Postcard Hideaway (Netravali Reserve)">The Postcard Hideaway (South Reserve)</option>
                <option value="Ahilya by the Sea (Nerul Bay)">Ahilya by the Sea (Private Dolphin Bay)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#3a1a22] uppercase tracking-wider mb-1.5">
                Transportation
              </label>
              <select
                value={transport}
                onChange={(e) => setTransport(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#EF9CA7]/50 text-xs text-[#3a1a22] bg-[#FCF8F9] focus:outline-none focus:border-[#c85f72]"
              >
                <option value="Private Chauffeur Sedan">Private Chauffeur Sedan (Standby)</option>
                <option value="Luxury Electric SUV">Luxury Electric SUV (In-built Wi-Fi)</option>
                <option value="Self-Drive Vintage Thar 4x4">Self-Drive Vintage Thar 4x4</option>
                <option value="Helicopter Transfer + Sedan">Airport Helicopter Transfer + Sedan</option>
              </select>
            </div>
          </div>

          {/* Dynamic Impact Feedback when hotel changed */}
          {hasChangedHotel && (
            <div className="p-4 rounded-xl bg-[#FFF5F6] border border-[#c85f72]/40 text-xs space-y-2 animate-fadeIn">
              <div className="font-semibold text-[#c85f72] flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Simulated Dependency Adjustments Detected:</span>
              </div>
              <ul className="space-y-1 text-[#3a1a22]/80 text-[11px] list-disc list-inside">
                <li>Airport transfer travel time adjusted: <strong>+25 mins</strong> from North MOPA.</li>
                <li>Fontainhas morning walking tour rescheduled by <strong>30 mins</strong> to optimize traffic.</li>
                <li>Estimated accommodation cost adjustment: <strong>+₹4,200</strong> difference.</li>
              </ul>
            </div>
          )}

          {/* Budget & Style */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#3a1a22] uppercase tracking-wider mb-1.5">
                Total Budget (INR ₹)
              </label>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#EF9CA7]/50 text-xs text-[#3a1a22] bg-[#FCF8F9] focus:outline-none focus:border-[#c85f72] font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#3a1a22] uppercase tracking-wider mb-1.5">
                Style & Vibe
              </label>
              <input
                type="text"
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#EF9CA7]/50 text-xs text-[#3a1a22] bg-[#FCF8F9] focus:outline-none focus:border-[#c85f72]"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#EF9CA7]/30 bg-[#FCF8F9] flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-xs text-[#3a1a22]/60 hover:text-[#c85f72] cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={handleSaveAndSubmit}
            disabled={isSubmittingToOperator || changeRequested}
            className="px-6 py-2.5 rounded-xl bg-[#c85f72] hover:bg-[#3a1a22] text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors shadow-md disabled:opacity-50"
          >
            {changeRequested ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>Operator Request Sent!</span>
              </>
            ) : isSubmittingToOperator ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Re-balancing & Dispatching...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Save & Submit to Operator</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
