import React, { useState } from 'react';
import {
  FileText,
  Wallet,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  TrendingUp,
  DollarSign,
  ArrowRight,
  ShieldCheck,
  Building2,
  X,
  CreditCard,
  QrCode,
} from 'lucide-react';
import { BookingLedgerItem } from './operatorData';

interface BookingsPaymentsSectionProps {
  bookings: BookingLedgerItem[];
}

export const BookingsPaymentsSection: React.FC<BookingsPaymentsSectionProps> = ({ bookings }) => {
  const [activeSubTab, setActiveSubTab] = useState<'bookings' | 'payments'>('bookings');
  const [selectedVoucher, setSelectedVoucher] = useState<BookingLedgerItem | null>(null);

  // Financial calculations
  const totalBilled = bookings.reduce((acc, curr) => acc + curr.billedToClient, 0);
  const totalVendorCost = bookings.reduce((acc, curr) => acc + curr.costToOperator, 0);
  const netMargin = totalBilled - totalVendorCost;
  const marginPercentage = ((netMargin / totalBilled) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="backdrop-blur-xl bg-white/90 border border-[#EF9CA7]/30 rounded-3xl p-6 sm:p-8 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFDDE1]/60 text-xs font-bold text-[#c85f72] mb-1">
            <Wallet className="w-3.5 h-3.5" />
            <span>OPERATIONAL REVENUE & AUDIT TRAIL</span>
          </div>
          <h2 className="font-cormorant text-3xl font-normal text-[#3a1a22]">
            Bookings Ledger & Profitability Control
          </h2>
          <p className="text-xs text-[#3a1a22]/70 mt-1 max-w-xl">
            Audit every hotel room, chauffeur shift, and activity voucher across all traveler itineraries. Protect minimum 15% operator gross margin autonomously.
          </p>
        </div>

        {/* Sub-tab toggle */}
        <div className="flex items-center gap-2 p-1 rounded-2xl bg-[#FCF8F9] border border-[#EF9CA7]/30">
          <button
            onClick={() => setActiveSubTab('bookings')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wider transition-all cursor-pointer ${
              activeSubTab === 'bookings'
                ? 'bg-[#c85f72] text-white shadow-xs'
                : 'text-[#3a1a22]/70 hover:text-[#c85f72]'
            }`}
          >
            Confirmed Bookings ({bookings.length})
          </button>
          <button
            onClick={() => setActiveSubTab('payments')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wider transition-all cursor-pointer ${
              activeSubTab === 'payments'
                ? 'bg-[#c85f72] text-white shadow-xs'
                : 'text-[#3a1a22]/70 hover:text-[#c85f72]'
            }`}
          >
            Payments & P&L Margins
          </button>
        </div>
      </div>

      {/* SUBTAB 1: BOOKINGS LEDGER */}
      {activeSubTab === 'bookings' && (
        <div className="backdrop-blur-xl bg-white/95 border border-[#EF9CA7]/30 rounded-3xl p-6 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#EF9CA7]/20 text-[10px] font-bold uppercase tracking-wider text-[#3a1a22]/60">
                  <th className="pb-3 pl-2">Booking Code</th>
                  <th className="pb-3">Service & Category</th>
                  <th className="pb-3">Vendor</th>
                  <th className="pb-3">Traveler</th>
                  <th className="pb-3">Dates</th>
                  <th className="pb-3">Vendor Cost</th>
                  <th className="pb-3">Billed Price</th>
                  <th className="pb-3">Gross Margin</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right pr-2">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EF9CA7]/15">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-[#FCF8F9] transition-colors">
                    <td className="py-3.5 pl-2 font-mono font-bold text-[#c85f72]">{b.bookingCode}</td>
                    <td className="py-3.5">
                      <span className="font-semibold text-[#3a1a22] block">{b.serviceType}</span>
                      <span className="text-[10px] text-[#3a1a22]/50">{b.voucherCode}</span>
                    </td>
                    <td className="py-3.5 font-medium text-[#3a1a22]">{b.vendorName}</td>
                    <td className="py-3.5 text-[#3a1a22]/80">{b.travelerName}</td>
                    <td className="py-3.5 text-[#3a1a22]/60 font-mono text-[11px]">{b.date}</td>
                    <td className="py-3.5 font-mono text-[#3a1a22]">₹{b.costToOperator.toLocaleString()}</td>
                    <td className="py-3.5 font-mono font-semibold text-[#3a1a22]">₹{b.billedToClient.toLocaleString()}</td>
                    <td className="py-3.5 font-mono font-bold text-emerald-700">+₹{b.margin.toLocaleString()}</td>
                    <td className="py-3.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {b.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-right pr-2">
                      <button
                        onClick={() => setSelectedVoucher(b)}
                        className="px-2.5 py-1 rounded-lg bg-white border border-[#EF9CA7]/40 text-[#c85f72] hover:bg-[#FFDDE1]/40 text-[11px] font-semibold cursor-pointer"
                      >
                        Voucher
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 2: PAYMENTS & FINANCIAL P&L */}
      {activeSubTab === 'payments' && (
        <div className="space-y-6">
          {/* P&L Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-5 rounded-3xl bg-white/95 border border-[#EF9CA7]/30 shadow-xs card-hover-physics">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#3a1a22]/60 block mb-1">
                Gross Client Invoiced
              </span>
              <div className="font-mono text-2xl font-bold text-[#3a1a22]">
                ₹{totalBilled.toLocaleString()}
              </div>
              <div className="text-[10px] text-emerald-700 mt-1">100% Escrow Collected</div>
            </div>

            <div className="p-5 rounded-3xl bg-white/95 border border-[#EF9CA7]/30 shadow-xs card-hover-physics">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#3a1a22]/60 block mb-1">
                Total Vendor Payables
              </span>
              <div className="font-mono text-2xl font-bold text-[#3a1a22]">
                ₹{totalVendorCost.toLocaleString()}
              </div>
              <div className="text-[10px] text-[#3a1a22]/60 mt-1">Hotels, Chauffeurs, Entries</div>
            </div>

            <div className="p-5 rounded-3xl bg-emerald-50/90 border border-emerald-300 shadow-xs card-hover-physics">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block mb-1">
                Net Operator Profit
              </span>
              <div className="font-mono text-2xl font-bold text-emerald-950">
                ₹{netMargin.toLocaleString()}
              </div>
              <div className="text-[10px] text-emerald-800 mt-1">Realized Net Yield</div>
            </div>

            <div className="p-5 rounded-3xl bg-[#FFDDE1]/50 border border-[#EF9CA7]/40 shadow-xs card-hover-physics">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#c85f72] block mb-1">
                Gross Margin Rate
              </span>
              <div className="font-mono text-2xl font-bold text-[#c85f72]">
                {marginPercentage}%
              </div>
              <div className="text-[10px] text-[#3a1a22]/70 mt-1">Exceeds 15% target floor</div>
            </div>
          </div>

          {/* Escrow & Disbursement Schedule */}
          <div className="backdrop-blur-xl bg-white/95 border border-[#EF9CA7]/30 rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="font-cormorant text-2xl font-normal text-[#3a1a22]">
              Milestone Escrow & Vendor Payout Releases
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-2xl bg-[#FCF8F9] border border-[#EF9CA7]/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#3a1a22]">Azora Heritage Villa (5 Nights)</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                      Milestone 1 Cleared
                    </span>
                  </div>
                  <p className="text-[11px] text-[#3a1a22]/70 mt-0.5">
                    Deposit of ₹12,500 disbursed to hotel account via automated B2B escrow.
                  </p>
                </div>
                <span className="font-mono font-bold text-[#3a1a22]">₹12,500 Paid</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#FCF8F9] border border-[#EF9CA7]/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#3a1a22]">Goa Chauffeur & Elite Fleet</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-semibold">
                      Disbursement on Day 5
                    </span>
                  </div>
                  <p className="text-[11px] text-[#3a1a22]/70 mt-0.5">
                    Escrow hold ₹7,600 pending final airport return verification.
                  </p>
                </div>
                <span className="font-mono font-bold text-[#3a1a22]">₹7,600 In Escrow</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VOUCHER VIEWER MODAL */}
      {selectedVoucher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white/95 backdrop-blur-2xl border border-[#EF9CA7]/40 rounded-3xl max-w-md w-full p-6 shadow-2xl relative space-y-4 animate-modal-in">
            <div className="flex items-start justify-between pb-3 border-b border-[#EF9CA7]/30">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#c85f72] uppercase block">
                  Official Confirmation Voucher
                </span>
                <h3 className="font-cormorant text-2xl font-normal text-[#3a1a22]">
                  {selectedVoucher.voucherCode}
                </h3>
              </div>
              <button
                onClick={() => setSelectedVoucher(null)}
                className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-[#3a1a22] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-[#FCF8F9] border border-[#EF9CA7]/30 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#3a1a22]/60">Lead Guest:</span>
                <span className="font-semibold text-[#3a1a22]">{selectedVoucher.travelerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#3a1a22]/60">Service:</span>
                <span className="font-semibold text-[#3a1a22]">{selectedVoucher.serviceType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#3a1a22]/60">Contracted Vendor:</span>
                <span className="font-semibold text-[#3a1a22]">{selectedVoucher.vendorName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#3a1a22]/60">Valid Dates:</span>
                <span className="font-mono text-[#3a1a22]">{selectedVoucher.date}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#EF9CA7]/20">
                <span className="text-[#3a1a22]/60">Total Booking Value:</span>
                <span className="font-mono font-bold text-[#c85f72]">
                  ₹{selectedVoucher.billedToClient.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <span className="font-bold block">Verified by TripForge Operator Ops</span>
                <span className="text-[11px]">Guaranteed check-in and priority guest treatment locked.</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedVoucher(null)}
              className="w-full py-2.5 rounded-xl bg-[#c85f72] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#3a1a22] transition-colors"
            >
              Close Voucher
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
