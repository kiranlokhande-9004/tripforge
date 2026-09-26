import React from 'react';
import {
  X,
  CheckCircle2,
  ShieldCheck,
  Calendar,
  User,
  MapPin,
  Sparkles,
  Download,
  Share2,
} from 'lucide-react';
import { TripBookingItem, TripData } from './data';

interface BookingConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: TripData;
  bookedItems: TripBookingItem[];
  totalCost: number;
}

export const BookingConfirmationModal: React.FC<BookingConfirmationModalProps> = ({
  isOpen,
  onClose,
  trip,
  bookedItems,
  totalCost,
}) => {
  if (!isOpen) return null;

  const confirmationId = `TF-CONF-${Date.now().toString().slice(-6)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-3xl border border-[#EF9CA7]/40 shadow-2xl max-w-lg w-full max-h-[92vh] flex flex-col overflow-hidden">
        {/* Banner with Success */}
        <div className="p-8 text-center bg-gradient-to-b from-[#FFF5F6] via-[#FFDDE1]/40 to-white border-b border-[#EF9CA7]/30 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-[#3a1a22]/50 hover:text-[#c85f72] hover:bg-[#FFDDE1]/40 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-sm border border-emerald-200">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <span className="text-[11px] font-semibold text-emerald-700 tracking-[0.2em] uppercase block">
            Booking Confirmed
          </span>
          <h3 className="font-cormorant text-3xl font-medium text-[#3a1a22] mt-0.5">
            Your Bespoke Trip is Secured
          </h3>
          <p className="text-xs text-[#3a1a22]/70 mt-1 max-w-xs mx-auto">
            Synchronized directly with {trip.operatorName}. Operator concierge is now preparing your private credentials.
          </p>
        </div>

        {/* Voucher Details */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          <div className="p-4 rounded-2xl bg-[#FCF8F9] border border-[#EF9CA7]/30 space-y-2.5">
            <div className="flex justify-between items-center pb-2 border-b border-[#EF9CA7]/20">
              <span className="text-[#3a1a22]/60 uppercase tracking-wider text-[10px]">
                Confirmation ID
              </span>
              <span className="font-mono font-bold text-[#c85f72] text-sm">
                {confirmationId}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[#3a1a22]/60">Lead Traveler:</span>
              <span className="font-semibold text-[#3a1a22]">Clara Voyager ({trip.travelerType})</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[#3a1a22]/60">Journey Route:</span>
              <span className="font-semibold text-[#3a1a22]">{trip.origin} → {trip.destination}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[#3a1a22]/60">Dates & Duration:</span>
              <span className="font-semibold text-[#3a1a22]">{trip.startDate} – {trip.endDate} ({trip.duration})</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[#3a1a22]/60">Local Operator:</span>
              <span className="font-semibold text-[#3a1a22]">{trip.operatorName}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[#3a1a22]/60">Status:</span>
              <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 text-[10px]">
                <ShieldCheck className="w-3 h-3" />
                <span>Confirmed & Protected</span>
              </span>
            </div>
          </div>

          {/* Booked Items List */}
          <div>
            <div className="font-semibold text-[#3a1a22] uppercase tracking-wider text-[11px] mb-2">
              Secured Itinerary Items ({bookedItems.length})
            </div>
            <div className="space-y-2">
              {bookedItems.map((item) => (
                <div
                  key={item.id}
                  className="p-2.5 rounded-xl bg-white border border-[#EF9CA7]/25 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-semibold text-[#3a1a22]">{item.title}</div>
                    <div className="text-[10px] text-[#3a1a22]/60">{item.subtitle}</div>
                  </div>
                  <div className="font-mono font-bold text-[#c85f72]">
                    ₹{item.cost.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total Amount Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#FFDDE1]/60 to-[#EF9CA7]/30 border border-[#EF9CA7]/50 flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-[#3a1a22]/60 font-semibold">
                Total Amount Paid / Secured
              </div>
              <div className="text-xl font-bold font-mono text-[#3a1a22]">
                ₹{totalCost.toLocaleString()}
              </div>
            </div>
            <span className="text-[10px] text-emerald-800 font-semibold bg-emerald-100 px-2.5 py-1 rounded-full">
              Full Protection Included
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#EF9CA7]/30 bg-[#FCF8F9] flex items-center justify-between">
          <button
            onClick={() => alert(`Simulated downloading TripForge Travel Voucher ${confirmationId}`)}
            className="text-xs text-[#3a1a22]/70 hover:text-[#c85f72] flex items-center gap-1.5 cursor-pointer font-medium"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Voucher</span>
          </button>

          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-[#c85f72] hover:bg-[#3a1a22] text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
