import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Car,
  Clock,
  Bed,
  Utensils,
  DollarSign,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Check,
  MapPin,
  TrendingUp,
} from 'lucide-react';

interface DependencyScenario {
  id: string;
  title: string;
  triggerDescription: string;
  triggerType: 'hotel' | 'flight' | 'activity' | 'fleet';
  changeFrom: string;
  changeTo: string;
  steps: {
    title: string;
    description: string;
    impact: string;
    icon: any;
    status: 'adjusted' | 'requires_action' | 'optimized';
  }[];
  costDelta: number;
  timeDelta: string;
  marginImpact: string;
  vendorNotes: string;
}

const SCENARIOS: DependencyScenario[] = [
  {
    id: 'sc-hotel-switch',
    title: 'Scenario 1: Hotel Relocation (North Goa → South Goa)',
    triggerType: 'hotel',
    triggerDescription: 'Operator modifies lodging preference based on traveler inquiry for secluded heritage stay.',
    changeFrom: 'Azora Heritage Sea Villa (Anjuna, North Goa)',
    changeTo: 'South Goa Heritage Manor Estate (Cavelossim)',
    steps: [
      {
        title: '1. Lodging Trigger',
        description: 'New check-in location locked in Cavelossim (48 km south of MOPA airport).',
        impact: 'Room tariff: -₹1,200 / night B2B rate',
        icon: Bed,
        status: 'optimized',
      },
      {
        title: '2. Chauffeur Route Re-calculated',
        description: 'NH-66 expressway routing replaced with Southern Coastal Corridor.',
        impact: '+22 km distance · Transit +25 mins · Fuel/Toll delta +₹800',
        icon: Car,
        status: 'adjusted',
      },
      {
        title: '3. Afternoon Activity Sync',
        description: 'Anjuna sunset promenade moved to Cavelossim pristine white dunes.',
        impact: 'Travel buffer updated from 15m to 10m · Zero delay',
        icon: Clock,
        status: 'optimized',
      },
      {
        title: '4. Dinner Reservation Re-anchored',
        description: 'Cliffside North Goa table cancelled; reserved riverside Fisherman’s Wharf Cavelossim.',
        impact: 'Table locked at 20:00 · Complimentary Port Wine voucher dispatched',
        icon: Utensils,
        status: 'adjusted',
      },
      {
        title: '5. Autonomous Financial Re-balance',
        description: 'Total tour cost recalculated: Net client reduction of ₹400 · Operator margin protected at 16.8%.',
        impact: 'Net Trip Cost: ₹50,000 → ₹49,600',
        icon: DollarSign,
        status: 'optimized',
      },
    ],
    costDelta: -400,
    timeDelta: '+25m transit / -15m buffer',
    marginImpact: '+0.4% protected margin',
    vendorNotes: 'Automated cancellation notice pushed to Azora Villa; confirmation voucher generated for Cavelossim Manor.',
  },
  {
    id: 'sc-flight-delay',
    title: 'Scenario 2: Flight Arrival Delay (+90 Mins)',
    triggerType: 'flight',
    triggerDescription: 'Inbound flight 6E-204 from Mumbai departs 90 minutes late due to runway congestion.',
    changeFrom: 'Scheduled Arrival: 11:30 AM',
    changeTo: 'Actual Landed: 01:00 PM',
    steps: [
      {
        title: '1. Inbound Flight Delay Alert',
        description: 'Flight radar telemetry feeds delay to TripForge Operator Dispatch.',
        impact: '+90 mins arrival delay',
        icon: Clock,
        status: 'requires_action',
      },
      {
        title: '2. Chauffeur Standby Extended',
        description: 'Driver Tariq notified via TripForge driver interface to hold at VIP arrivals.',
        impact: 'Parking buffer extended · Zero cancellation penalty',
        icon: Car,
        status: 'optimized',
      },
      {
        title: '3. Hotel Check-in Window Shifted',
        description: 'Azora Heritage front desk informed; welcome tea shifted to 15:00.',
        impact: 'Late check-in honored; luggage fast-tracked to Oceanview Suite',
        icon: Bed,
        status: 'adjusted',
      },
      {
        title: '4. Evening Activity Compressed',
        description: 'Sunset promenade rescheduled to 17:30 with private sunset cocktail cart.',
        impact: 'No canceled stops; all experiences preserved seamlessly',
        icon: Sparkles,
        status: 'optimized',
      },
    ],
    costDelta: 0,
    timeDelta: '+90 mins buffered without itinerary collapse',
    marginImpact: 'No margin loss',
    vendorNotes: 'Live SMS & push dispatch sent to chauffeur, front desk, and traveler Clara.',
  },
  {
    id: 'sc-activity-reroute',
    title: 'Scenario 3: Marine Swell Catamaran Substitution',
    triggerType: 'activity',
    triggerDescription: 'Port Authority closes Mandovi Bay to small marine vessels after 16:00.',
    changeFrom: 'Mandovi River Catamaran Sail & Caviar (₹8,500)',
    changeTo: 'Historic Manor Private Wine & Acoustic Fado (₹9,300)',
    steps: [
      {
        title: '1. Weather Alert Triggered',
        description: 'Swell height 2.5m exceeds recreational passenger limits.',
        impact: 'Original boat charter paused',
        icon: AlertTriangle,
        status: 'requires_action',
      },
      {
        title: '2. Chauffeur Destination Rerouted',
        description: 'Chauffeur destination updated to Raia Heritage Manor (inland route).',
        impact: 'Paved inland highway · Smooth 30 min transit',
        icon: Car,
        status: 'adjusted',
      },
      {
        title: '3. Private Tasting Reserved',
        description: 'Curated 6-course Goan-Portuguese twilight wine tasting confirmed.',
        impact: 'Exclusive private courtyard access · Verified rating 4.98',
        icon: Utensils,
        status: 'optimized',
      },
      {
        title: '4. Traveler App Live Sync',
        description: 'Notification pushed to Clara’s dashboard with explanation and interactive voucher.',
        impact: 'Traveler reassured in under 4 minutes',
        icon: Sparkles,
        status: 'optimized',
      },
    ],
    costDelta: 800,
    timeDelta: '+10 mins travel time',
    marginImpact: 'Absorbed via Operator Contingency Shield',
    vendorNotes: '100% refund credited back to operator ledger by Goa Marine Yacht Club.',
  },
];

export const DependencyEngineSection: React.FC = () => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('sc-hotel-switch');
  const [committed, setCommitted] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const activeScenario = SCENARIOS.find((s) => s.id === selectedScenarioId) || SCENARIOS[0];

  const handleCommit = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setCommitted(true);
    }, 600);
  };

  const handleReset = () => {
    setCommitted(false);
  };

  return (
    <div className="space-y-6">
      {/* Engine Overview Header */}
      <div className="backdrop-blur-xl bg-white/90 border border-[#EF9CA7]/30 rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#EF9CA7]/20">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFDDE1]/70 border border-[#EF9CA7]/40 text-xs font-bold text-[#c85f72] mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>TRIPFORGE CORE INNOVATION</span>
            </div>
            <h2 className="font-cormorant text-3xl sm:text-4xl font-normal text-[#3a1a22]">
              Autonomous Dependency Engine
            </h2>
            <p className="text-xs text-[#3a1a22]/70 mt-1 max-w-2xl leading-relaxed">
              When a tour operator modifies any single component—hotel, flight arrival, or transit—TripForge eliminates manual chaos by automatically calculating ripple effects across all vendor contracts, chauffeur timings, and financial ledgers.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#3a1a22]/60 font-medium">Engine Mode:</span>
            <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Real-Time Ripple Graph Active</span>
            </div>
          </div>
        </div>

        {/* Scenario Selector Tabs */}
        <div className="mt-6 flex flex-wrap gap-2">
          {SCENARIOS.map((sc) => (
            <button
              key={sc.id}
              onClick={() => {
                setSelectedScenarioId(sc.id);
                setCommitted(false);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                selectedScenarioId === sc.id
                  ? 'bg-[#c85f72] text-white shadow-sm'
                  : 'bg-[#FCF8F9] hover:bg-white text-[#3a1a22]/70 border border-[#EF9CA7]/30'
              }`}
            >
              {sc.title}
            </button>
          ))}
        </div>
      </div>

      {/* Live Ripple Simulation Canvas */}
      <div className="backdrop-blur-xl bg-white/95 border border-[#EF9CA7]/30 rounded-3xl p-6 sm:p-8 shadow-lg space-y-6">
        {/* Trigger Banner */}
        <div className="p-4 rounded-2xl bg-[#FCF8F9] border border-[#EF9CA7]/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono text-[#c85f72] uppercase font-bold tracking-wider block mb-1">
              Trigger Event Detected
            </span>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#3a1a22]">
              <span className="line-through text-[#3a1a22]/50">{activeScenario.changeFrom}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#c85f72] shrink-0" />
              <span className="text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                {activeScenario.changeTo}
              </span>
            </div>
            <p className="text-[11px] text-[#3a1a22]/70 mt-1">
              {activeScenario.triggerDescription}
            </p>
          </div>

          {/* Quick Metrics of Delta */}
          <div className="flex items-center gap-4 text-xs font-mono shrink-0">
            <div className="p-2.5 rounded-xl bg-white border border-[#EF9CA7]/30 text-center">
              <span className="text-[9px] text-[#3a1a22]/50 block font-inter">Cost Delta</span>
              <span className="font-bold text-[#3a1a22]">
                {activeScenario.costDelta >= 0 ? `+₹${activeScenario.costDelta}` : `-₹${Math.abs(activeScenario.costDelta)}`}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-[#EF9CA7]/30 text-center">
              <span className="text-[9px] text-[#3a1a22]/50 block font-inter">Transit Delta</span>
              <span className="font-bold text-[#3a1a22]">{activeScenario.timeDelta}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
              <span className="text-[9px] text-emerald-800 block font-inter">Margin Status</span>
              <span className="font-bold text-emerald-900">{activeScenario.marginImpact}</span>
            </div>
          </div>
        </div>

        {/* Visual Domino Flow / Dependency Sequence */}
        <div>
          <h3 className="font-cormorant text-2xl font-normal text-[#3a1a22] mb-3">
            Cascading Operational Impacts (5 Nodes Auto-Synchronized)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
            {activeScenario.steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-white border border-[#EF9CA7]/30 shadow-xs hover:shadow-md transition-all card-hover-physics flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-8 h-8 rounded-xl bg-[#FFDDE1]/60 text-[#c85f72] flex items-center justify-center">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                        Node 0{idx + 1}
                      </span>
                    </div>

                    <h4 className="font-bold text-xs text-[#3a1a22]">{step.title}</h4>
                    <p className="text-[11px] text-[#3a1a22]/70 mt-1 leading-snug">
                      {step.description}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-[#EF9CA7]/20">
                    <span className="text-[10px] font-mono text-emerald-800 block font-semibold">
                      {step.impact}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Vendor Dispatch Note */}
        <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block mb-0.5">Automated Vendor Dispatch Ready:</span>
            <span>{activeScenario.vendorNotes}</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs text-[#3a1a22]/70">
            {committed
              ? '✓ Adjustments pushed to all vendor APIs, Chauffeur navigation, and Clara Voyager’s live itinerary.'
              : 'Review the ripple graph above and click below to commit autonomous re-dispatch.'}
          </div>

          <div className="flex items-center gap-3">
            {committed ? (
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-xl bg-white border border-[#EF9CA7]/40 text-[#3a1a22] text-xs font-semibold hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Simulate Another Change</span>
              </button>
            ) : null}

            <button
              onClick={handleCommit}
              disabled={committed || isProcessing}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-md cursor-pointer flex items-center gap-2 ${
                committed
                  ? 'bg-emerald-600 text-white cursor-default'
                  : 'bg-[#c85f72] hover:bg-[#3a1a22] text-white btn-hover-physics'
              }`}
            >
              {committed ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>CASCADING ADJUSTMENTS COMMITTED</span>
                </>
              ) : isProcessing ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Synchronizing 5 Vendors & Chauffeur Route...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>COMMIT AUTONOMOUS RE-DISPATCH</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
