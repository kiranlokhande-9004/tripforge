import React, { useState } from 'react';
import { Plane, Bed, Camera, Car, ShieldCheck, FileText, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { TripBookingItem } from './data';

interface BookingsVaultProps {
  bookings: TripBookingItem[];
  destination: string;
  onOpenVoucher: () => void;
}

export const BookingsVault: React.FC<BookingsVaultProps> = ({
  bookings,
  destination,
  onOpenVoucher,
}) => {
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  const filteredBookings = categoryFilter === 'All'
    ? bookings
    : bookings.filter((b) => b.category.toLowerCase() === categoryFilter.toLowerCase());

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'flight':
        return <Plane className="w-4 h-4 text-[#c85f72]" />;
      case 'hotel':
        return <Bed className="w-4 h-4 text-[#c85f72]" />;
      case 'activity':
        return <Camera className="w-4 h-4 text-[#c85f72]" />;
      case 'transport':
        return <Car className="w-4 h-4 text-[#c85f72]" />;
      default:
        return <FileText className="w-4 h-4 text-[#c85f72]" />;
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'Confirmed':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
            <CheckCircle2 className="w-3 h-3" />
            <span>Confirmed</span>
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
            <Clock className="w-3 h-3" />
            <span>Pending</span>
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded-full">
            <AlertCircle className="w-3 h-3" />
            <span>Cancelled</span>
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
            Confirmed
          </span>
        );
    }
  };

  return (
    <section id="upcoming-bookings-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="bg-white rounded-3xl p-6 sm:p-9 border border-[#EF9CA7]/30 shadow-lg">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EF9CA7]/30 mb-6">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#c85f72] block mb-1">
              Secured Vouchers & Inventory
            </span>
            <h2 className="font-cormorant text-3xl sm:text-4xl font-normal text-[#3a1a22]">
              Bookings & Vouchers
            </h2>
            <p className="text-xs sm:text-sm text-[#3a1a22]/70 mt-1">
              Your verified reservations for <span className="font-semibold text-[#3a1a22]">{destination}</span>.
            </p>
          </div>

          <button
            onClick={onOpenVoucher}
            className="px-6 py-2.5 rounded-xl bg-[#c85f72] hover:bg-[#3a1a22] text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs cursor-pointer flex items-center gap-2 self-start sm:self-auto"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>CONFIRM TRIP / VIEW VOUCHER</span>
          </button>
        </div>

        {/* Category Filters */}
        <div className="mb-6 flex flex-wrap items-center gap-1.5 pb-2">
          {['All', 'Flight', 'Hotel', 'Activity', 'Transport'].map((cat) => {
            const active = categoryFilter === cat;
            return (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  active
                    ? 'bg-[#c85f72] text-white font-semibold shadow-xs'
                    : 'bg-[#FCF8F9] hover:bg-[#FFDDE1]/40 text-[#3a1a22]/80 border border-[#EF9CA7]/30'
                }`}
              >
                {cat === 'All' ? 'All Bookings' : cat + 's'}
              </button>
            );
          })}
        </div>

        {/* Bookings Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredBookings.map((b) => (
            <div
              key={b.id}
              className="p-5 rounded-2xl bg-[#FCF8F9] border border-[#EF9CA7]/30 hover:border-[#c85f72] transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-7 h-7 rounded-lg bg-[#FFDDE1]/60 flex items-center justify-center">
                      {getCategoryIcon(b.category)}
                    </div>
                    <span className="text-[10px] font-mono uppercase font-bold text-[#c85f72]">
                      {b.category}
                    </span>
                  </div>
                  {getStatusBadge(b.status)}
                </div>

                <h4 className="font-semibold text-sm text-[#3a1a22] leading-snug">
                  {b.title}
                </h4>
                <div className="text-xs text-[#3a1a22]/70 mt-1">{b.subtitle}</div>

                <div className="mt-3 pt-3 border-t border-[#EF9CA7]/20 space-y-1 text-[11px] text-[#3a1a22]/60">
                  <div className="flex justify-between">
                    <span>Booking ID:</span>
                    <span className="font-mono text-[#3a1a22] font-semibold">{b.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span className="text-[#3a1a22]">{b.date || 'Scheduled'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Location:</span>
                    <span className="text-[#3a1a22] text-right truncate max-w-[140px]">{b.location || destination}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#EF9CA7]/20 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#3a1a22]/50 block uppercase">Price</span>
                  <span className="font-mono text-sm font-bold text-[#c85f72]">
                    ₹{b.cost.toLocaleString()}
                  </span>
                </div>
                <button
                  onClick={onOpenVoucher}
                  className="text-xs text-[#3a1a22] hover:text-[#c85f72] font-semibold cursor-pointer underline underline-offset-2"
                >
                  View Voucher →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
