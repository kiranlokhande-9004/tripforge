import React, { useState } from 'react';
import { Sparkles, AlertTriangle, ArrowRight, Check, Clock, DollarSign, CloudRain, Car, Building2, CheckCircle2 } from 'lucide-react';
import { ItineraryItem } from './data';

interface AITripAssistWidgetProps {
  onAcceptReroute: (newActivity: string, location: string, cost: number) => void;
  remainingBudget: number;
}

interface DisruptionScenario {
  id: 'weather' | 'transport' | 'venue';
  title: string;
  badge: string;
  icon: 'weather' | 'transport' | 'venue';
  alertText: string;
  alertSubtext: string;
  currentPlan: {
    title: string;
    time: string;
    cost: number;
    issue: string;
  };
  suggestedPlan: {
    title: string;
    time: string;
    cost: number;
    benefit: string;
    operatorNote: string;
  };
  costDelta: number;
  timeDelta: string;
}

export const AITripAssistWidget: React.FC<AITripAssistWidgetProps> = ({
  onAcceptReroute,
  remainingBudget,
}) => {
  const [activeScenarioId, setActiveScenarioId] = useState<'weather' | 'transport' | 'venue'>('weather');
  const [showAlternative, setShowAlternative] = useState(true);
  const [appliedScenarios, setAppliedScenarios] = useState<Set<string>>(new Set());

  const scenarios: Record<'weather' | 'transport' | 'venue', DisruptionScenario> = {
    weather: {
      id: 'weather',
      title: 'Weather Disruption',
      badge: 'High Swells Detected',
      icon: 'weather',
      alertText: 'Coastal Monsoon Advisory in Mandovi Bay (Day 04 Evening)',
      alertSubtext: 'High ocean swells predicted (>2.4m). Catamaran sail might experience heavy turbulence. TripForge AI calibrated a sheltered cultural atelier & dining experience.',
      currentPlan: {
        title: 'Mandovi River Private Catamaran Sail & Caviar',
        time: '05:30 PM – 08:00 PM',
        cost: 8500,
        issue: 'Rough seas & port safety warning issued by maritime bureau',
      },
      suggestedPlan: {
        title: 'Historic Portuguese Heritage Art Gallery & Gourmet Food Tour',
        time: '05:45 PM – 08:30 PM',
        cost: 9300,
        benefit: 'Sheltered private manor, 6-course Goan-Portuguese tasting & live Fado acoustic music',
        operatorNote: 'Pre-cleared with Vanguard Coastal Escapes lead concierge Tariq.',
      },
      costDelta: 800,
      timeDelta: '+15 mins longer experience',
    },
    transport: {
      id: 'transport',
      title: 'Transport Delay',
      badge: 'Highway Congestion',
      icon: 'transport',
      alertText: 'NH-66 Coastal Highway Maintenance Delay (+50 mins transit)',
      alertSubtext: 'Heavy bridge lane maintenance between North & South Goa. TripForge rerouted via private Ribandar backwater express speed-ferry.',
      currentPlan: {
        title: 'Chauffeured Highway Transit to Sahakari Estate',
        time: '09:30 AM – 10:45 AM',
        cost: 2200,
        issue: 'Gridlock estimated at Zuari river crossing',
      },
      suggestedPlan: {
        title: 'Scenic Backwater Speed-Launch & Teak Escort',
        time: '09:30 AM – 10:05 AM',
        cost: 2600,
        benefit: 'Arrives 40 mins earlier with complimentary chilled coconut water onboard',
        operatorNote: 'Directly reserved with Goa Port Heritage Fleet.',
      },
      costDelta: 400,
      timeDelta: 'Saves 40 mins transit time',
    },
    venue: {
      id: 'venue',
      title: 'Venue Unavailable',
      badge: 'Private Gala Closure',
      icon: 'venue',
      alertText: 'Fort Aguada Upper Rampart Reserved for Private Film Event',
      alertSubtext: 'Upper rampart closed to public from 3 PM. TripForge AI secured exclusive access to the private Chapora Cliffside Sanctuary terrace.',
      currentPlan: {
        title: 'Aguada Fort Upper Bastion Sunset Walk',
        time: '04:00 PM – 06:00 PM',
        cost: 1500,
        issue: 'Official government protocol closure',
      },
      suggestedPlan: {
        title: 'Vagator Chapora Bluff Private Sunset Pavilion & Drinks',
        time: '04:00 PM – 06:30 PM',
        cost: 1900,
        benefit: 'Zero crowds, 360-degree Arabian Sea panorama with private butler',
        operatorNote: 'Exclusive private landowner permit secured by operator.',
      },
      costDelta: 400,
      timeDelta: '+30 mins extended golden hour',
    },
  };

  const currentScenario = scenarios[activeScenarioId];
  const isApplied = appliedScenarios.has(activeScenarioId);

  const handleApply = () => {
    onAcceptReroute(
      currentScenario.suggestedPlan.title,
      'Panaji / Coastal Reserve',
      currentScenario.suggestedPlan.cost
    );
    setAppliedScenarios((prev) => new Set(prev).add(activeScenarioId));
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="bg-white rounded-3xl p-6 sm:p-9 border border-[#EF9CA7]/30 shadow-lg">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EF9CA7]/30 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFDDE1] text-[#c85f72] text-xs font-semibold tracking-wider uppercase mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>DYNAMIC AUTONOMOUS REROUTING</span>
            </div>
            <h2 className="font-cormorant text-3xl sm:text-4xl font-normal text-[#3a1a22]">
              AI Trip Assist
            </h2>
            <p className="text-xs sm:text-sm text-[#3a1a22]/70 mt-1 max-w-2xl">
              Plans shift in real life. TripForge monitors weather advisories, transit delays, and vendor schedules 24/7 to autonomously formulate instant replacements within your budget.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => setShowAlternative(!showAlternative)}
              className="px-4 py-2 rounded-xl bg-white border border-[#EF9CA7]/50 hover:bg-[#FFDDE1]/40 text-[#3a1a22] text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
            >
              {showAlternative ? 'Hide Details' : 'View Comparison'}
            </button>
          </div>
        </div>

        {/* Scenario Switcher Tabs */}
        <div className="mb-6">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#3a1a22]/60 block mb-2">
            Simulate Disruption Event:
          </span>
          <div className="flex flex-wrap gap-2">
            {(
              [
                { id: 'weather', label: 'Weather Disruption (Monsoon High Swells)', icon: CloudRain },
                { id: 'transport', label: 'Transport Delay (Bridge Maintenance)', icon: Car },
                { id: 'venue', label: 'Venue Unavailable (Private Gala)', icon: Building2 },
              ] as const
            ).map((tab) => {
              const Icon = tab.icon;
              const active = activeScenarioId === tab.id;
              const applied = appliedScenarios.has(tab.id);
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveScenarioId(tab.id)}
                  className={`px-3.5 py-2 rounded-2xl text-xs font-medium transition-all flex items-center gap-2 cursor-pointer ${
                    active
                      ? 'bg-[#c85f72] text-white shadow-xs font-semibold'
                      : 'bg-[#FCF8F9] hover:bg-[#FFDDE1]/50 text-[#3a1a22] border border-[#EF9CA7]/30'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  {applied && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-white" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Disruption Banner */}
        <div className="p-5 rounded-2xl bg-amber-50/90 border border-amber-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
              <AlertTriangle className="w-4 h-4 text-amber-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-950">
                  {currentScenario.alertText}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-200/70 text-[9px] font-bold text-amber-900 uppercase tracking-wider">
                  {currentScenario.badge}
                </span>
              </div>
              <div className="text-[11px] text-amber-900/80 mt-1 max-w-3xl leading-relaxed">
                {currentScenario.alertSubtext}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 self-end md:self-auto">
            <div className="text-right">
              <span className="text-[10px] text-amber-800/70 uppercase tracking-wider block">
                Cost Delta
              </span>
              <span className="text-xs font-mono font-bold text-amber-950">
                +₹{currentScenario.costDelta}
              </span>
            </div>
            <button
              onClick={handleApply}
              disabled={isApplied}
              className={`px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all shadow-xs cursor-pointer flex items-center gap-1.5 ${
                isApplied
                  ? 'bg-emerald-600 text-white cursor-default'
                  : 'bg-[#c85f72] hover:bg-[#3a1a22] text-white hover:shadow-md'
              }`}
            >
              {isApplied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>REROUTE APPLIED</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-[#FFDDE1]" />
                  <span>ACCEPT REROUTE</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Side-by-Side Comparison: Current Plan vs AI Suggested Plan */}
        {showAlternative && (
          <div className="mt-6 pt-6 border-t border-[#EF9CA7]/20 grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
            {/* CURRENT PLAN */}
            <div className="p-5 rounded-2xl bg-[#FCF8F9] border border-rose-200/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-rose-100 mb-3">
                  <span className="text-[10px] uppercase font-bold text-rose-800 tracking-wider">
                    Current Plan (Disrupted)
                  </span>
                  <span className="text-[10px] font-mono text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                    Risk: High
                  </span>
                </div>
                <h4 className="font-semibold text-sm text-[#3a1a22]">
                  {currentScenario.currentPlan.title}
                </h4>
                <div className="text-xs text-[#3a1a22]/70 mt-1 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#c85f72]" />
                  <span>{currentScenario.currentPlan.time}</span>
                </div>
                <div className="mt-3 p-2.5 rounded-xl bg-rose-50/80 border border-rose-200 text-[11px] text-rose-900 leading-relaxed">
                  <strong>Issue Detected:</strong> {currentScenario.currentPlan.issue}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-rose-100 flex items-center justify-between">
                <span className="text-xs text-[#3a1a22]/70">Scheduled Cost:</span>
                <span className="font-mono text-xs font-bold text-[#3a1a22]">
                  ₹{currentScenario.currentPlan.cost.toLocaleString()}
                </span>
              </div>
            </div>

            {/* AI SUGGESTED PLAN */}
            <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-300 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-emerald-100 mb-3">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-emerald-700" />
                    <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">
                      AI Suggested Alternative Plan
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    Verified Safe
                  </span>
                </div>

                <h4 className="font-semibold text-sm text-emerald-950">
                  {currentScenario.suggestedPlan.title}
                </h4>
                <div className="text-xs text-emerald-900/80 mt-1 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{currentScenario.suggestedPlan.time} · {currentScenario.timeDelta}</span>
                </div>

                <div className="mt-3 p-2.5 rounded-xl bg-emerald-100/60 border border-emerald-200 text-[11px] text-emerald-950 leading-relaxed">
                  <strong>Why this works:</strong> {currentScenario.suggestedPlan.benefit}
                </div>
                <div className="mt-2 text-[10px] text-emerald-800 font-medium italic">
                  ✓ {currentScenario.suggestedPlan.operatorNote}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-emerald-200 flex items-center justify-between">
                <div>
                  <span className="text-xs text-emerald-900/80">Recalibrated Cost: </span>
                  <span className="font-mono text-xs font-bold text-emerald-950">
                    ₹{currentScenario.suggestedPlan.cost.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-emerald-700 ml-1 font-mono">
                    (+₹{currentScenario.costDelta})
                  </span>
                </div>
                <span className="text-[10px] text-emerald-800 font-semibold">
                  Fits in ₹{remainingBudget.toLocaleString()} buffer
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
