import React from 'react';
import {
  Users,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Wallet,
  Building2,
  ArrowRight,
  TrendingUp,
  MapPin,
  Sparkles,
  Plane,
  Car,
  BellRing,
  ExternalLink,
} from 'lucide-react';
import { TourRequest, ActiveTour, DisruptionEvent } from './operatorData';

interface OverviewSectionProps {
  onNavigateTab: (tab: string) => void;
  requests: TourRequest[];
  activeTours: ActiveTour[];
  disruptions: DisruptionEvent[];
  onOpenRequest: (request: TourRequest) => void;
}

export const OverviewSection: React.FC<OverviewSectionProps> = ({
  onNavigateTab,
  requests,
  activeTours,
  disruptions,
  onOpenRequest,
}) => {
  const pendingRequestsCount = requests.filter((r) => r.status === 'Pending Review').length;
  const activeDisruptionsCount = disruptions.filter((d) => d.status !== 'Resolved & Pushed').length;

  const activities = [
    {
      time: '2 mins ago',
      title: 'Chauffeur Tariq reached Panaji Heritage Zone',
      desc: 'Clara Voyager (Party of 2) arrived safely for Fontainhas walking tour.',
      type: 'transit',
      icon: Car,
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    },
    {
      time: '18 mins ago',
      title: 'New Custom Trip Request: Clara Voyager',
      desc: 'Bespoke Goa Expedition · ₹50,000 budget · 5 Days · Requires operator approval.',
      type: 'request',
      icon: Users,
      color: 'text-[#c85f72] bg-[#FFDDE1]/70 border-[#EF9CA7]/40',
    },
    {
      time: '42 mins ago',
      title: 'Weather Warning: Mandovi Bay Swells',
      desc: 'Captain of Ports issued cautionary bulletin for catamaran sails after 16:00.',
      type: 'disruption',
      icon: AlertTriangle,
      color: 'text-amber-800 bg-amber-50 border-amber-200',
    },
    {
      time: '1h 15m ago',
      title: 'Deposit Received: ₹52,000 (Dev Singhania)',
      desc: 'Milestone escrow cleared for The Oberoi Rajvilas luxury tent suites.',
      type: 'payment',
      icon: Wallet,
      color: 'text-purple-800 bg-purple-50 border-purple-200',
    },
  ];

  return (
    <div className="space-y-6">
      {/* 6 Core Problem Statement Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Card 1: ACTIVE TOURS */}
        <div
          onClick={() => onNavigateTab('active-tours')}
          className="p-4 rounded-2xl bg-white/90 border border-[#EF9CA7]/30 shadow-xs hover:border-[#c85f72] transition-all cursor-pointer card-hover-physics flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between text-[#3a1a22]/60 mb-2">
              <span className="text-[10px] uppercase font-bold tracking-wider">Active Tours</span>
              <Plane className="w-3.5 h-3.5 text-[#c85f72]" />
            </div>
            <div className="font-mono text-2xl font-bold text-[#3a1a22]">{activeTours.length} Live</div>
          </div>
          <div className="text-[10px] text-emerald-700 font-medium flex items-center gap-1 mt-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>100% on schedule</span>
          </div>
        </div>

        {/* Card 2: PENDING REQUESTS */}
        <div
          onClick={() => onNavigateTab('requests')}
          className="p-4 rounded-2xl bg-white/90 border border-[#EF9CA7]/30 shadow-xs hover:border-[#c85f72] transition-all cursor-pointer card-hover-physics flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between text-[#3a1a22]/60 mb-2">
              <span className="text-[10px] uppercase font-bold tracking-wider">Requests</span>
              <Users className="w-3.5 h-3.5 text-[#c85f72]" />
            </div>
            <div className="font-mono text-2xl font-bold text-[#3a1a22]">{pendingRequestsCount} Pending</div>
          </div>
          <div className="text-[10px] text-[#c85f72] font-semibold mt-2 flex items-center gap-1">
            <span>Action Required</span>
            <ArrowRight className="w-2.5 h-2.5" />
          </div>
        </div>

        {/* Card 3: TODAY'S BOOKINGS */}
        <div
          onClick={() => onNavigateTab('bookings')}
          className="p-4 rounded-2xl bg-white/90 border border-[#EF9CA7]/30 shadow-xs hover:border-[#c85f72] transition-all cursor-pointer card-hover-physics flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between text-[#3a1a22]/60 mb-2">
              <span className="text-[10px] uppercase font-bold tracking-wider">Bookings</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div className="font-mono text-2xl font-bold text-[#3a1a22]">6 Confirmed</div>
          </div>
          <div className="text-[10px] text-emerald-700 font-medium mt-2">All vouchers active</div>
        </div>

        {/* Card 4: ACTIVE DISRUPTIONS */}
        <div
          onClick={() => onNavigateTab('disruptions')}
          className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/90 shadow-xs hover:border-amber-400 transition-all cursor-pointer card-hover-physics flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between text-amber-900/70 mb-2">
              <span className="text-[10px] uppercase font-bold tracking-wider">Disruptions</span>
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
            </div>
            <div className="font-mono text-2xl font-bold text-amber-950">{activeDisruptionsCount} Warning</div>
          </div>
          <div className="text-[10px] text-amber-800 font-medium mt-2">Mandovi Bay advisory</div>
        </div>

        {/* Card 5: PENDING PAYMENTS */}
        <div
          onClick={() => onNavigateTab('payments')}
          className="p-4 rounded-2xl bg-white/90 border border-[#EF9CA7]/30 shadow-xs hover:border-[#c85f72] transition-all cursor-pointer card-hover-physics flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between text-[#3a1a22]/60 mb-2">
              <span className="text-[10px] uppercase font-bold tracking-wider">Payments</span>
              <Wallet className="w-3.5 h-3.5 text-[#c85f72]" />
            </div>
            <div className="font-mono text-2xl font-bold text-[#3a1a22]">₹2,87,000</div>
          </div>
          <div className="text-[10px] text-emerald-700 font-medium mt-2">16.4% margin protected</div>
        </div>

        {/* Card 6: VENDOR ACTIONS */}
        <div
          onClick={() => onNavigateTab('vendors')}
          className="p-4 rounded-2xl bg-white/90 border border-[#EF9CA7]/30 shadow-xs hover:border-[#c85f72] transition-all cursor-pointer card-hover-physics flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between text-[#3a1a22]/60 mb-2">
              <span className="text-[10px] uppercase font-bold tracking-wider">Vendors</span>
              <Building2 className="w-3.5 h-3.5 text-[#c85f72]" />
            </div>
            <div className="font-mono text-2xl font-bold text-[#3a1a22]">1 Review</div>
          </div>
          <div className="text-[10px] text-[#c85f72] font-semibold mt-2">Marine yacht charter</div>
        </div>
      </div>

      {/* Main Focus: Immediate Operational Mission */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: High-Priority Queue & Live Traveler Request */}
        <div className="lg:col-span-2 space-y-4">
          <div className="backdrop-blur-xl bg-white/90 border border-[#EF9CA7]/30 rounded-3xl p-6 shadow-md">
            <div className="flex items-center justify-between pb-4 border-b border-[#EF9CA7]/20">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#c85f72] animate-ping" />
                <h3 className="font-cormorant text-2xl font-semibold text-[#3a1a22]">
                  Incoming Traveler Requests Awaiting Dispatch
                </h3>
              </div>
              <button
                onClick={() => onNavigateTab('requests')}
                className="text-xs font-semibold text-[#c85f72] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View All ({requests.length})</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* List of Incoming Requests */}
            <div className="mt-4 space-y-3">
              {requests.slice(0, 2).map((req) => (
                <div
                  key={req.id}
                  className="p-4 rounded-2xl bg-[#FCF8F9] hover:bg-white border border-[#EF9CA7]/25 hover:border-[#c85f72] transition-all card-hover-physics"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <img
                        src={req.avatar}
                        alt={req.travelerName}
                        className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-xs shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-sm text-[#3a1a22]">{req.travelerName}</h4>
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                              req.urgency === 'High'
                                ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {req.urgency === 'High' ? 'High Priority' : 'Standard'}
                          </span>
                        </div>
                        <p className="text-xs text-[#3a1a22]/75 font-medium mt-0.5">
                          {req.destination} · {req.startDate} – {req.endDate} ({req.duration})
                        </p>
                        <div className="text-[11px] text-[#3a1a22]/60 mt-1 flex flex-wrap items-center gap-2">
                          <span>{req.partyType}</span>
                          <span>•</span>
                          <span className="font-mono font-semibold text-[#c85f72]">
                            ₹{req.budget.toLocaleString()} Budget
                          </span>
                          <span>•</span>
                          <span className="text-emerald-700 font-medium">Est. Margin: {req.marginEstimate}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                      <span className="text-[10px] text-[#3a1a22]/50">{req.createdTime}</span>
                      <button
                        onClick={() => onOpenRequest(req)}
                        className="px-4 py-1.5 rounded-xl bg-[#c85f72] hover:bg-[#3a1a22] text-white text-xs font-semibold tracking-wider transition-all btn-hover-physics cursor-pointer shadow-xs"
                      >
                        Review Request
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Problem-Solver Toolstrip */}
          <div className="backdrop-blur-xl bg-white/80 border border-[#EF9CA7]/30 rounded-3xl p-5 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FFDDE1] text-[#c85f72] flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#3a1a22]">
                  Autonomous Dependency Engine
                </h4>
                <p className="text-[11px] text-[#3a1a22]/70">
                  Simulate hotel or transit shifts and witness instant ripple recalculations.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigateTab('dependencies')}
                className="px-3.5 py-1.5 rounded-xl bg-white border border-[#EF9CA7]/40 text-[#c85f72] hover:bg-[#FFDDE1]/40 text-xs font-semibold tracking-wide transition-all cursor-pointer"
              >
                Launch Simulator
              </button>
              <button
                onClick={() => onNavigateTab('disruptions')}
                className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold tracking-wide transition-all cursor-pointer shadow-xs"
              >
                Resolve Swell Advisory
              </button>
            </div>
          </div>
        </div>

        {/* Right Col: Live Operational Activity Stream */}
        <div className="space-y-4">
          <div className="backdrop-blur-xl bg-white/90 border border-[#EF9CA7]/30 rounded-3xl p-6 shadow-md h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#EF9CA7]/20 mb-4">
                <div className="flex items-center gap-2">
                  <BellRing className="w-4 h-4 text-[#c85f72]" />
                  <h3 className="font-cormorant text-xl font-semibold text-[#3a1a22]">
                    Operational Event Feed
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Live Stream
                </span>
              </div>

              <div className="space-y-3.5">
                {activities.map((act, i) => {
                  const Icon = act.icon;
                  return (
                    <div key={i} className="flex items-start gap-3 text-xs">
                      <div className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 ${act.color}`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-[#3a1a22] text-[11px] leading-tight">
                            {act.title}
                          </span>
                          <span className="text-[9px] text-[#3a1a22]/50 font-mono shrink-0 ml-1">
                            {act.time}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#3a1a22]/70 mt-0.5 leading-snug">
                          {act.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-[#EF9CA7]/20 flex items-center justify-between text-xs">
              <span className="text-[11px] text-[#3a1a22]/60">Operator SLA Compliance</span>
              <span className="font-mono font-bold text-emerald-800">99.4% On-Time</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
