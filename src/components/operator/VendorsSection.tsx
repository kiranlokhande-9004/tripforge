import React, { useState } from 'react';
import {
  Building2,
  Phone,
  Mail,
  ShieldCheck,
  Star,
  CheckCircle2,
  Clock,
  Send,
  FileText,
  Search,
  Plus,
  X,
} from 'lucide-react';
import { Vendor } from './operatorData';

interface VendorsSectionProps {
  vendors: Vendor[];
}

export const VendorsSection: React.FC<VendorsSectionProps> = ({ vendors }) => {
  const [filterCat, setFilterCat] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toast, setToast] = useState<string | null>(null);

  const categories = ['All', 'Accommodations', 'Chauffeur & Fleet', 'Activity Provider', 'Dining & Experiences'];

  const filtered = vendors.filter((v) => {
    if (filterCat !== 'All' && v.category !== filterCat) return false;
    if (searchQuery && !v.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handlePing = (vendor: Vendor) => {
    setToast(`Availability verification request dispatched to ${vendor.name} (${vendor.contactPerson}).`);
    setTimeout(() => setToast(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="backdrop-blur-xl bg-white/90 border border-[#EF9CA7]/30 rounded-3xl p-6 sm:p-8 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFDDE1]/60 text-xs font-bold text-[#c85f72] mb-1">
            <Building2 className="w-3.5 h-3.5" />
            <span>SUPPLY CHAIN & CONTRACT NETWORK</span>
          </div>
          <h2 className="font-cormorant text-3xl font-normal text-[#3a1a22]">
            Curated Vendor Directory & SLAs
          </h2>
          <p className="text-xs text-[#3a1a22]/70 mt-1 max-w-xl">
            Pre-contracted luxury villas, elite chauffeurs, historical guides, and dining ateliers with locked B2B rates and guaranteed turnaround SLAs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-xl bg-white border border-[#EF9CA7]/40 text-xs font-semibold text-[#3a1a22]">
            <span>Active Partners: </span>
            <span className="font-mono text-[#c85f72] font-bold">{vendors.length}</span>
          </div>
          <div className="px-3.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
            <span>SLA Health: </span>
            <span className="font-mono font-bold">98.8% Avg</span>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center justify-between shadow-xs animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold">{toast}</span>
          </div>
          <button onClick={() => setToast(null)} className="text-emerald-700 hover:text-emerald-950">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCat(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer shrink-0 ${
                filterCat === cat
                  ? 'bg-[#c85f72] text-white shadow-xs'
                  : 'bg-white border border-[#EF9CA7]/30 text-[#3a1a22]/70 hover:bg-[#FFDDE1]/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-[#3a1a22]/40 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search vendor name..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white border border-[#EF9CA7]/30 text-xs text-[#3a1a22] focus:outline-none focus:border-[#c85f72]"
          />
        </div>
      </div>

      {/* Vendors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((vendor) => {
          const isAction = vendor.status === 'Action Required';

          return (
            <div
              key={vendor.id}
              className="backdrop-blur-xl bg-white/95 border border-[#EF9CA7]/30 rounded-3xl p-5 shadow-xs hover:shadow-md hover:border-[#c85f72] transition-all card-hover-physics flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#EF9CA7]/20 mb-3">
                  <span className="text-[10px] font-mono text-[#c85f72] font-bold">
                    {vendor.id}
                  </span>
                  <span
                    className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${
                      isAction
                        ? 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
                        : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    }`}
                  >
                    {vendor.status}
                  </span>
                </div>

                <h3 className="font-cormorant text-2xl font-medium text-[#3a1a22]">
                  {vendor.name}
                </h3>
                <span className="text-[10px] uppercase font-bold text-[#c85f72] tracking-wider block mt-0.5">
                  {vendor.category}
                </span>
                <p className="text-xs text-[#3a1a22]/70 mt-1">{vendor.location}</p>

                {/* Performance stats */}
                <div className="mt-4 p-3.5 rounded-2xl bg-[#FCF8F9] border border-[#EF9CA7]/25 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-[#3a1a22]/50 block">SLA Score</span>
                    <span className="font-mono font-bold text-emerald-800">{vendor.slaScore}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#3a1a22]/50 block">On-Time Fulfillment</span>
                    <span className="font-mono font-bold text-[#3a1a22]">{vendor.onTimeRate}</span>
                  </div>
                  <div className="col-span-2 pt-1 border-t border-[#EF9CA7]/20">
                    <span className="text-[10px] text-[#3a1a22]/50 block">Commercial Terms</span>
                    <span className="font-medium text-[#3a1a22] text-[11px]">{vendor.ratesAgreed}</span>
                  </div>
                </div>

                {/* Contact info */}
                <div className="mt-3 space-y-1 text-xs text-[#3a1a22]/80">
                  <div className="flex items-center gap-2">
                    <span className="text-[#3a1a22]/50">Contact:</span>
                    <span className="font-semibold">{vendor.contactPerson}</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <Phone className="w-3 h-3 text-[#c85f72]" />
                    <span>{vendor.phone}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 pt-3 border-t border-[#EF9CA7]/20 flex items-center gap-2">
                <button
                  onClick={() => handlePing(vendor)}
                  className="flex-1 py-2 rounded-xl bg-[#FCF8F9] hover:bg-[#FFDDE1]/40 border border-[#EF9CA7]/40 text-[#3a1a22] text-xs font-semibold tracking-wide transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5 text-[#c85f72]" />
                  <span>Check Inventory</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
