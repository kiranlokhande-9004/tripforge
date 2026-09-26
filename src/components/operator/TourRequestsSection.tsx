import React, { useState } from 'react';
import {
  Users,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  MapPin,
  ArrowRight,
  ShieldCheck,
  X,
  Send,
  Bed,
  Car,
  DollarSign,
  AlertCircle,
  FileText,
  Check,
  RefreshCw,
} from 'lucide-react';
import { TourRequest } from './operatorData';

interface TourRequestsSectionProps {
  requests: TourRequest[];
  onApproveRequest: (id: string) => void;
  onRequestChanges: (id: string, notes: string) => void;
  onRejectRequest: (id: string) => void;
  selectedRequest: TourRequest | null;
  onSelectRequest: (request: TourRequest | null) => void;
}

export const TourRequestsSection: React.FC<TourRequestsSectionProps> = ({
  requests,
  onApproveRequest,
  onRequestChanges,
  onRejectRequest,
  selectedRequest,
  onSelectRequest,
}) => {
  const [filter, setFilter] = useState<'All' | 'Pending Review' | 'Approved' | 'High Priority'>('All');
  const [modalRequest, setModalRequest] = useState<TourRequest | null>(selectedRequest);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);
  const [operationalNotes, setOperationalNotes] = useState<string>(
    selectedRequest?.operationalNotes || ''
  );
  const [isApproving, setIsApproving] = useState(false);

  // Sync if selectedRequest changes from parent
  React.useEffect(() => {
    setModalRequest(selectedRequest);
    if (selectedRequest) {
      setOperationalNotes(selectedRequest.operationalNotes);
    }
  }, [selectedRequest]);

  const filteredRequests = requests.filter((r) => {
    if (filter === 'All') return true;
    if (filter === 'Pending Review') return r.status === 'Pending Review';
    if (filter === 'Approved') return r.status === 'Approved';
    if (filter === 'High Priority') return r.urgency === 'High';
    return true;
  });

  const handleApprove = (req: TourRequest) => {
    setIsApproving(true);
    setTimeout(() => {
      onApproveRequest(req.id);
      setIsApproving(false);
      setActionSuccessMsg(`Trip for ${req.travelerName} officially approved! Vouchers dispatched to vendors.`);
      setTimeout(() => setActionSuccessMsg(null), 4000);
      if (modalRequest && modalRequest.id === req.id) {
        setModalRequest({ ...modalRequest, status: 'Approved' });
      }
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="backdrop-blur-xl bg-white/90 border border-[#EF9CA7]/30 rounded-3xl p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#c85f72] block mb-1">
            TripForge Demand Pipeline
          </span>
          <h2 className="font-cormorant text-3xl font-normal text-[#3a1a22]">
            Custom Tour Inquiries & Proposals
          </h2>
          <p className="text-xs text-[#3a1a22]/70 mt-1 max-w-xl">
            When travelers customize trips via the TripForge traveler dashboard, requests stage here for operator pricing verification, vendor availability checks, and single-click approval.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#FCF8F9] border border-[#EF9CA7]/30">
          {(['All', 'Pending Review', 'Approved', 'High Priority'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                filter === tab
                  ? 'bg-[#c85f72] text-white shadow-xs'
                  : 'text-[#3a1a22]/70 hover:text-[#c85f72]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Success Notification Alert */}
      {actionSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center justify-between shadow-sm animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold">{actionSuccessMsg}</span>
          </div>
          <button onClick={() => setActionSuccessMsg(null)} className="text-emerald-700 hover:text-emerald-950">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Requests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRequests.map((req) => {
          const isPending = req.status === 'Pending Review';
          const isApproved = req.status === 'Approved';

          return (
            <div
              key={req.id}
              className="backdrop-blur-xl bg-white/95 border border-[#EF9CA7]/30 rounded-3xl p-5 shadow-xs hover:shadow-md hover:border-[#c85f72] transition-all card-hover-physics flex flex-col justify-between"
            >
              <div>
                {/* Top Badge & Urgency */}
                <div className="flex items-center justify-between pb-3 border-b border-[#EF9CA7]/20 mb-3">
                  <span className="text-[10px] font-mono text-[#c85f72] font-bold">
                    {req.id}
                  </span>
                  <div className="flex items-center gap-2">
                    {req.urgency === 'High' && (
                      <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200 animate-pulse">
                        High Priority
                      </span>
                    )}
                    <span
                      className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${
                        isApproved
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-100 text-amber-900 border border-amber-200'
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>
                </div>

                {/* Traveler Card Header */}
                <div className="flex items-start gap-3 mb-3">
                  <img
                    src={req.avatar}
                    alt={req.travelerName}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-xs"
                  />
                  <div>
                    <h3 className="font-semibold text-sm text-[#3a1a22]">{req.travelerName}</h3>
                    <p className="text-xs text-[#3a1a22]/70">{req.partyType}</p>
                    <p className="text-[11px] text-[#3a1a22]/50">{req.travelerEmail}</p>
                  </div>
                </div>

                {/* Destination & Details */}
                <div className="p-3.5 rounded-2xl bg-[#FCF8F9] border border-[#EF9CA7]/25 space-y-2 text-xs mb-4">
                  <div className="flex items-center gap-2 text-[#3a1a22]">
                    <MapPin className="w-3.5 h-3.5 text-[#c85f72] shrink-0" />
                    <span className="font-semibold">{req.destination}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#3a1a22]/75">
                    <Calendar className="w-3.5 h-3.5 text-[#3a1a22]/50 shrink-0" />
                    <span>
                      {req.startDate} – {req.endDate} ({req.duration})
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-[#EF9CA7]/20 text-xs">
                    <span className="text-[#3a1a22]/60">Total Budget:</span>
                    <span className="font-mono font-bold text-base text-[#c85f72]">
                      ₹{req.budget.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#3a1a22]/60">Operator Margin:</span>
                    <span className="font-mono font-semibold text-emerald-800">
                      {req.marginEstimate}% (₹{((req.budget * req.marginEstimate) / 100).toLocaleString()})
                    </span>
                  </div>
                </div>

                {/* Accommodation & Transport Preference Summary */}
                <div className="text-[11px] text-[#3a1a22]/70 space-y-1 mb-4">
                  <div className="flex items-center gap-1.5 truncate">
                    <Bed className="w-3 h-3 text-[#c85f72]" />
                    <span className="truncate">{req.accommodationPref}</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <Car className="w-3 h-3 text-[#c85f72]" />
                    <span className="truncate">{req.transportPref}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-[#EF9CA7]/20 flex items-center gap-2">
                <button
                  onClick={() => {
                    setModalRequest(req);
                    onSelectRequest(req);
                  }}
                  className="flex-1 py-2 rounded-xl bg-white border border-[#EF9CA7]/40 text-[#3a1a22] hover:bg-[#FFDDE1]/40 text-xs font-semibold tracking-wider transition-all cursor-pointer text-center"
                >
                  Review Details
                </button>

                {isPending && (
                  <button
                    onClick={() => handleApprove(req)}
                    disabled={isApproving}
                    className="px-4 py-2 rounded-xl bg-[#c85f72] hover:bg-[#3a1a22] text-white text-xs font-semibold tracking-wider transition-all cursor-pointer shadow-xs btn-hover-physics"
                  >
                    {isApproving ? '...' : 'Approve'}
                  </button>
                )}

                {isApproved && (
                  <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-[11px] font-semibold border border-emerald-200">
                    Dispatched
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* REQUEST DETAIL WORKSPACE MODAL */}
      {modalRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white/95 backdrop-blur-2xl border border-[#EF9CA7]/40 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative space-y-6 animate-modal-in">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-[#EF9CA7]/30">
              <div className="flex items-center gap-3">
                <img
                  src={modalRequest.avatar}
                  alt={modalRequest.travelerName}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-[#EF9CA7]/40 shadow-xs"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-[#c85f72] font-bold">
                      {modalRequest.id}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                      {modalRequest.status}
                    </span>
                  </div>
                  <h2 className="font-cormorant text-3xl font-medium text-[#3a1a22]">
                    {modalRequest.travelerName} — Bespoke Workspace
                  </h2>
                  <p className="text-xs text-[#3a1a22]/70">
                    {modalRequest.origin} → {modalRequest.destination} · {modalRequest.duration}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setModalRequest(null);
                  onSelectRequest(null);
                }}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-[#3a1a22] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Financial & Margin Analysis Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#FFDDE1]/40 via-white to-[#FFDDE1]/30 border border-[#EF9CA7]/30 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-[10px] text-[#3a1a22]/60 uppercase font-semibold block mb-0.5">
                  Client Total Budget
                </span>
                <div className="font-mono text-xl font-bold text-[#c85f72]">
                  ₹{modalRequest.budget.toLocaleString()}
                </div>
                <div className="text-[10px] text-emerald-800 mt-0.5">Escrow pre-authorized</div>
              </div>

              <div>
                <span className="text-[10px] text-[#3a1a22]/60 uppercase font-semibold block mb-0.5">
                  Total Vendor Payables
                </span>
                <div className="font-mono text-xl font-bold text-[#3a1a22]">
                  ₹{modalRequest.vendorCostEstimate.toLocaleString()}
                </div>
                <div className="text-[10px] text-[#3a1a22]/60 mt-0.5">Lodging, fleet, & entries</div>
              </div>

              <div>
                <span className="text-[10px] text-[#3a1a22]/60 uppercase font-semibold block mb-0.5">
                  Operator Net Margin
                </span>
                <div className="font-mono text-xl font-bold text-emerald-700">
                  ₹{((modalRequest.budget * modalRequest.marginEstimate) / 100).toLocaleString()} ({modalRequest.marginEstimate}%)
                </div>
                <div className="text-[10px] text-emerald-700 mt-0.5">Margin protection active</div>
              </div>
            </div>

            {/* Traveler Requirements & Preferences */}
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[#FCF8F9] border border-[#EF9CA7]/25 space-y-2">
                  <h4 className="font-bold text-[11px] uppercase tracking-wider text-[#3a1a22] flex items-center gap-1.5">
                    <Bed className="w-3.5 h-3.5 text-[#c85f72]" />
                    <span>Lodging & Transport Configuration</span>
                  </h4>
                  <div>
                    <span className="text-[#3a1a22]/60 block text-[10px]">Requested Stay:</span>
                    <span className="font-semibold text-[#3a1a22]">{modalRequest.accommodationPref}</span>
                  </div>
                  <div>
                    <span className="text-[#3a1a22]/60 block text-[10px]">Requested Transit:</span>
                    <span className="font-semibold text-[#3a1a22]">{modalRequest.transportPref}</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#FCF8F9] border border-[#EF9CA7]/25 space-y-2">
                  <h4 className="font-bold text-[11px] uppercase tracking-wider text-[#3a1a22] flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#c85f72]" />
                    <span>Party Profile & Contact</span>
                  </h4>
                  <div className="space-y-1 text-[11px]">
                    <div>
                      <span className="text-[#3a1a22]/60">Party: </span>
                      <span className="font-semibold text-[#3a1a22]">{modalRequest.partyType} ({modalRequest.travelersCount} Travelers)</span>
                    </div>
                    <div>
                      <span className="text-[#3a1a22]/60">Phone: </span>
                      <span className="font-mono text-[#3a1a22]">{modalRequest.travelerPhone}</span>
                    </div>
                    <div>
                      <span className="text-[#3a1a22]/60">Email: </span>
                      <span className="font-mono text-[#3a1a22]">{modalRequest.travelerEmail}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Special Requests */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80">
                <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider block mb-1">
                  Traveler Special Instructions & Constraints
                </span>
                <p className="text-xs text-amber-950 leading-relaxed font-medium">
                  {modalRequest.specialRequests}
                </p>
              </div>

              {/* TripForge AI Recommendation for Operator */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#FFDDE1]/60 to-[#EF9CA7]/20 border border-[#EF9CA7]/40 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-white border border-[#EF9CA7]/40 flex items-center justify-center text-[#c85f72] shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#c85f72] block mb-0.5">
                    TripForge AI Operational Optimization
                  </span>
                  <p className="text-xs text-[#3a1a22] leading-relaxed">
                    {modalRequest.aiRecommendation}
                  </p>
                </div>
              </div>

              {/* Operational Dispatch Notes (Editable) */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#3a1a22] block mb-1">
                  Internal Tour Operator Execution Notes:
                </label>
                <textarea
                  value={operationalNotes}
                  onChange={(e) => setOperationalNotes(e.target.value)}
                  rows={2}
                  className="w-full p-3 rounded-xl border border-[#EF9CA7]/30 bg-white text-xs text-[#3a1a22] focus:outline-none focus:border-[#c85f72] resize-none"
                  placeholder="Add notes for field coordinators, chauffeur plate verification, or special amenities..."
                />
              </div>
            </div>

            {/* Modal Action Buttons */}
            <div className="pt-4 border-t border-[#EF9CA7]/30 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    onRequestChanges(modalRequest.id, operationalNotes);
                    setActionSuccessMsg('Revision requested from traveler. Draft unlocked for adjustments.');
                    setModalRequest(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-white border border-[#EF9CA7]/40 text-[#3a1a22] hover:bg-slate-100 text-xs font-semibold transition-all cursor-pointer"
                >
                  Request Changes
                </button>
                <button
                  onClick={() => {
                    onRejectRequest(modalRequest.id);
                    setModalRequest(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-rose-50 text-rose-800 hover:bg-rose-100 text-xs font-semibold transition-all cursor-pointer"
                >
                  Decline Trip
                </button>
              </div>

              <button
                onClick={() => handleApprove(modalRequest)}
                disabled={modalRequest.status === 'Approved' || isApproving}
                className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-md cursor-pointer flex items-center gap-2 ${
                  modalRequest.status === 'Approved'
                    ? 'bg-emerald-600 text-white cursor-default'
                    : 'bg-[#c85f72] hover:bg-[#3a1a22] text-white btn-hover-physics'
                }`}
              >
                {modalRequest.status === 'Approved' ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    <span>TRIP OFFICIALLY APPROVED & VOUCHERS ISSUED</span>
                  </>
                ) : isApproving ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Confirming Stays & Dispatching Vouchers...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>APPROVE BESPOKE TRIP & DISPATCH VOUCHERS</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
