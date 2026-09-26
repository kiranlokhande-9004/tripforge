import React, { useState } from 'react';
import {
  AlertTriangle,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  ShieldCheck,
  RefreshCw,
  Send,
  Sliders,
  DollarSign,
  MapPin,
  X,
  FileCheck,
} from 'lucide-react';
import { DisruptionEvent } from './operatorData';
import { tripforgeDb } from '../../lib/supabase';

interface DisruptionsSectionProps {
  disruptions: DisruptionEvent[];
  onResolveDisruption: (id: string) => void;
}

export const DisruptionsSection: React.FC<DisruptionsSectionProps> = ({
  disruptions,
  onResolveDisruption,
}) => {
  const [selectedDisruptionId, setSelectedDisruptionId] = useState<string>(disruptions[0]?.id || '');
  const [isDeploying, setIsDeploying] = useState<boolean>(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const activeDisruption = disruptions.find((d) => d.id === selectedDisruptionId) || disruptions[0];

  const handleApproveReroute = () => {
    setIsDeploying(true);
    setTimeout(() => {
      onResolveDisruption(activeDisruption.id);
      setIsDeploying(false);
      setSuccessToast(
        `AI Reroute Approved! Solution pushed to Clara Voyager's dashboard, Chauffeur navigation, and Solar dos Canavarros Estate.`
      );
      setTimeout(() => setSuccessToast(null), 5000);
    }, 700);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="backdrop-blur-xl bg-white/90 border border-[#EF9CA7]/30 rounded-3xl p-6 sm:p-8 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold mb-1">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-700 animate-pulse" />
            <span>DISRUPTION MANAGEMENT & AUTONOMOUS RE-ROUTING</span>
          </div>
          <h2 className="font-cormorant text-3xl font-normal text-[#3a1a22]">
            Active Disruptions & AI Solution Radar
          </h2>
          <p className="text-xs text-[#3a1a22]/70 mt-1 max-w-xl">
            When weather, maritime bans, or road closures threaten a bespoke itinerary, TripForge isolates affected travelers, models alternatives, and proposes instant reroutes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-xs font-semibold text-amber-900">
            {disruptions.filter((d) => d.status !== 'Resolved & Pushed').length} Active Alerts
          </span>
          <span className="px-3.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
            AI Auto-Reroute Engine: Ready
          </span>
        </div>
      </div>

      {/* Success Toast */}
      {successToast && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center justify-between shadow-md animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{successToast}</span>
          </div>
          <button onClick={() => setSuccessToast(null)} className="text-emerald-700 hover:text-emerald-950">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Disruption Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {disruptions.map((disr) => (
          <button
            key={disr.id}
            onClick={() => setSelectedDisruptionId(disr.id)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-semibold tracking-wide transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              selectedDisruptionId === disr.id
                ? 'bg-[#c85f72] text-white shadow-sm'
                : 'bg-white border border-[#EF9CA7]/30 text-[#3a1a22]/80 hover:bg-[#FFDDE1]/40'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                disr.status === 'Resolved & Pushed' ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'
              }`}
            />
            <span>{disr.title.slice(0, 38)}...</span>
          </button>
        ))}
      </div>

      {/* Active Disruption Workspace */}
      {activeDisruption && (
        <div className="backdrop-blur-xl bg-white/95 border border-[#EF9CA7]/30 rounded-3xl p-6 sm:p-8 shadow-lg space-y-6">
          {/* Advisory Header Details */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#EF9CA7]/20">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono font-bold text-[#c85f72]">
                  {activeDisruption.id}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    activeDisruption.status === 'Resolved & Pushed'
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      : 'bg-amber-100 text-amber-900 border border-amber-300'
                  }`}
                >
                  {activeDisruption.status}
                </span>
              </div>
              <h3 className="font-cormorant text-2xl sm:text-3xl font-normal text-[#3a1a22]">
                {activeDisruption.title}
              </h3>
              <p className="text-xs text-[#3a1a22]/70 mt-1">
                Source Authority: <span className="font-semibold">{activeDisruption.sourceAuthority}</span> · Location: {activeDisruption.location}
              </p>
            </div>

            {/* Affected Guests Card */}
            <div className="p-3.5 rounded-2xl bg-[#FCF8F9] border border-[#EF9CA7]/30 text-xs shrink-0 space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#3a1a22]/60 block">
                Affected Itinerary & Traveler:
              </span>
              <div className="font-semibold text-[#3a1a22]">{activeDisruption.affectedTravelers.join(', ')}</div>
              <div className="text-[11px] text-[#c85f72] font-mono">{activeDisruption.affectedTours.join(', ')}</div>
            </div>
          </div>

          {/* Side-by-Side Comparison: Disrupted vs AI Alternative */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#3a1a22] flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-[#c85f72]" />
                <span>Side-by-Side Plan Reconciliation</span>
              </span>
              <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                AI Logistics Feasibility Score: {activeDisruption.aiSuggestedPlan.feasibilityScore}/100
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card A: Disrupted Original Plan */}
              <div className="p-5 rounded-3xl bg-rose-50/70 border border-rose-200/90 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-rose-200">
                  <span className="text-[10px] font-mono font-bold text-rose-800 uppercase tracking-wider">
                    CURRENT DISRUPTED STOP
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-200 text-rose-900 font-semibold">
                    Vendor Closed
                  </span>
                </div>

                <div>
                  <h4 className="font-semibold text-sm text-[#3a1a22]">
                    {activeDisruption.originalPlan.activity}
                  </h4>
                  <div className="text-xs text-[#3a1a22]/70 mt-1 flex items-center gap-2">
                    <Clock className="w-3 h-3 text-rose-700" />
                    <span>{activeDisruption.originalPlan.timing}</span>
                  </div>
                  <div className="text-xs text-[#3a1a22]/70 mt-0.5">
                    Vendor: <span className="font-semibold">{activeDisruption.originalPlan.vendor}</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-white border border-rose-200 text-xs text-rose-900 space-y-1">
                  <span className="text-[10px] font-bold uppercase block text-rose-700">Root Issue:</span>
                  <p>{activeDisruption.originalPlan.impactReason}</p>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-rose-200">
                  <span className="text-[#3a1a22]/60">Booked Tariff:</span>
                  <span className="font-mono font-bold text-rose-900">
                    ₹{activeDisruption.originalPlan.cost.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Card B: AI Suggested Replacement */}
              <div className="p-5 rounded-3xl bg-emerald-50/80 border border-emerald-300 space-y-4 shadow-xs">
                <div className="flex items-center justify-between pb-2 border-b border-emerald-200">
                  <span className="text-[10px] font-mono font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>TRIPFORGE AI ALTERNATIVE</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-950 font-semibold">
                    Pre-Verified Slot
                  </span>
                </div>

                <div>
                  <h4 className="font-semibold text-sm text-emerald-950">
                    {activeDisruption.aiSuggestedPlan.activity}
                  </h4>
                  <div className="text-xs text-emerald-800 mt-1 flex items-center gap-2">
                    <Clock className="w-3 h-3 text-emerald-700" />
                    <span>{activeDisruption.aiSuggestedPlan.timing} ({activeDisruption.aiSuggestedPlan.timeDelta})</span>
                  </div>
                  <div className="text-xs text-emerald-900 mt-0.5">
                    Vendor: <span className="font-semibold">{activeDisruption.aiSuggestedPlan.vendor}</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-white border border-emerald-200 text-xs text-emerald-900 space-y-1">
                  <span className="text-[10px] font-bold uppercase block text-emerald-700">Experience Highlights:</span>
                  <p className="leading-relaxed">{activeDisruption.aiSuggestedPlan.description}</p>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-emerald-200 font-mono">
                  <span className="text-emerald-800">Replacement Cost:</span>
                  <div className="text-right">
                    <span className="font-bold text-emerald-950">
                      ₹{activeDisruption.aiSuggestedPlan.cost.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-emerald-700 ml-1.5">
                      (+₹{activeDisruption.aiSuggestedPlan.costDelta})
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
            <div className="text-xs text-[#3a1a22]/70">
              {activeDisruption.status === 'Resolved & Pushed'
                ? '✓ This disruption has been resolved. The traveler’s app has rendered the new Portuguese Manor schedule.'
                : 'Click below to confirm the substitution and instantly broadcast to Clara, driver Tariq, and the estate.'}
            </div>

            <button
              onClick={handleApproveReroute}
              disabled={activeDisruption.status === 'Resolved & Pushed' || isDeploying}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-md cursor-pointer flex items-center gap-2 ${
                activeDisruption.status === 'Resolved & Pushed'
                  ? 'bg-emerald-600 text-white cursor-default'
                  : 'bg-[#c85f72] hover:bg-[#3a1a22] text-white btn-hover-physics'
              }`}
            >
              {activeDisruption.status === 'Resolved & Pushed' ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>REROUTE OFFICIALLY RESOLVED & PUSHED</span>
                </>
              ) : isDeploying ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Dispatching Vouchers & Syncing Traveler App...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>APPROVE AI REROUTE & DISPATCH LIVE UPDATE</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
