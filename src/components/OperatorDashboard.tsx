import React, { useState } from 'react';
import {
  ArrowLeft,
  MapPin,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  LogOut,
  Bell,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Car,
  Bed,
  Check,
  RefreshCw,
  Send,
  Users,
  Wallet,
  TrendingUp,
  Sliders,
  Calendar as CalendarIcon,
  Building2,
  Radio,
  FileText,
  BarChart3,
  X,
} from 'lucide-react';
import { AmbientBackground } from './motion/AmbientBackground';
import { BackgroundAtmosphere } from './motion/BackgroundAtmosphere';
import { MotionReveal } from './motion/MotionReveal';

// Operator Sub-components
import { OverviewSection } from './operator/OverviewSection';
import { TourRequestsSection } from './operator/TourRequestsSection';
import { ActiveToursSection } from './operator/ActiveToursSection';
import { ItineraryEditorSection } from './operator/ItineraryEditorSection';
import { DependencyEngineSection } from './operator/DependencyEngineSection';
import { DisruptionsSection } from './operator/DisruptionsSection';
import { VendorsSection } from './operator/VendorsSection';
import { BookingsPaymentsSection } from './operator/BookingsPaymentsSection';
import { CalendarSection } from './operator/CalendarSection';
import { CoordinatorsSection } from './operator/CoordinatorsSection';
import { AnalyticsSection } from './operator/AnalyticsSection';
import {
  tripforgeDb,
  DbTripRequest,
  DbItineraryItem,
  DbNotification,
  isSupabaseConfigured,
} from '../lib/supabase';

// Initial Mock Datasets
import {
  INITIAL_OPERATOR_REQUESTS,
  INITIAL_ACTIVE_TOURS,
  INITIAL_ITINERARY_ITEMS_OP,
  INITIAL_VENDORS,
  INITIAL_BOOKINGS_LEDGER,
  INITIAL_DISRUPTIONS,
  INITIAL_COORDINATORS,
  INITIAL_CALENDAR_EVENTS,
  TourRequest,
  ActiveTour,
  ItineraryItemOp,
  Vendor,
  BookingLedgerItem,
  DisruptionEvent,
  FieldCoordinator,
  CalendarEvent,
} from './operator/operatorData';

interface OperatorDashboardProps {
  onNavigate: (path: string) => void;
}

export const OperatorDashboard: React.FC<OperatorDashboardProps> = ({ onNavigate }) => {
  // Navigation tabs exactly as specified in problem statement
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'requests'
    | 'active-tours'
    | 'calendar'
    | 'itineraries'
    | 'dependencies'
    | 'vendors'
    | 'bookings'
    | 'payments'
    | 'disruptions'
    | 'coordinators'
    | 'analytics'
  >('overview');

  // Application State
  const [requests, setRequests] = useState<TourRequest[]>(INITIAL_OPERATOR_REQUESTS);
  const [activeTours, setActiveTours] = useState<ActiveTour[]>(INITIAL_ACTIVE_TOURS);
  const [itineraryItems, setItineraryItems] = useState<ItineraryItemOp[]>(INITIAL_ITINERARY_ITEMS_OP);
  const [vendors, setVendors] = useState<Vendor[]>(INITIAL_VENDORS);
  const [bookings, setBookings] = useState<BookingLedgerItem[]>(INITIAL_BOOKINGS_LEDGER);
  const [disruptions, setDisruptions] = useState<DisruptionEvent[]>(INITIAL_DISRUPTIONS);
  const [coordinators, setCoordinators] = useState<FieldCoordinator[]>(INITIAL_COORDINATORS);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(INITIAL_CALENDAR_EVENTS);

  // Selected request for workspace modal
  const [selectedRequest, setSelectedRequest] = useState<TourRequest | null>(null);

  // Notification drawer & Live Notifications
  const [notifOpen, setNotifOpen] = useState(false);
  const [liveNotifications, setLiveNotifications] = useState<DbNotification[]>([]);

  // Global Toast
  const [globalToast, setGlobalToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setGlobalToast(msg);
    setTimeout(() => setGlobalToast(null), 4000);
  };

  const dbTripToOperatorRequest = (r: DbTripRequest): TourRequest => ({
    id: r.id,
    travelerName: r.traveler_name,
    travelerEmail: r.traveler_email,
    travelerPhone: '+91 98201 44920',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    origin: r.origin,
    destination: r.destination,
    startDate: r.start_date,
    endDate: r.end_date,
    duration: r.duration,
    travelersCount: r.travelers_count,
    partyType: r.party_type,
    budget: r.budget,
    currency: r.currency || 'INR',
    accommodationPref: r.accommodation_preference,
    transportPref: r.transport_preference,
    interests: r.interests,
    status: r.status as any,
    createdTime: 'Just now',
    urgency: r.urgency,
    specialRequests: r.special_requests,
    aiRecommendation: 'High-margin luxury villa partner available in North Goa with 18% commission tier.',
    operationalNotes: r.operational_notes || '',
    marginEstimate: 18.5,
    vendorCostEstimate: Math.round(r.budget * 0.81),
  });

  const dbItemToOperatorItem = (i: DbItineraryItem): ItineraryItemOp => ({
    id: i.id,
    day: i.day_number,
    time: i.start_time,
    activity: i.title,
    location: i.location,
    category: (i.category as any) || 'activity',
    vendorName: i.vendor_name || 'Certified Operator Partner',
    vendorCost: Number(i.estimated_cost) || 2000,
    clientCharge: Number(i.client_charge) || 2800,
    status: (i.status as any) || 'Confirmed',
    travelTime: i.travel_time || '20 mins',
    notes: i.notes || '',
  });

  // Initial Load & Supabase Realtime Subscription
  React.useEffect(() => {
    const loadData = async () => {
      try {
        const dbTrips = await tripforgeDb.getTripRequests();
        if (dbTrips && dbTrips.length > 0) {
          setRequests(dbTrips.map(dbTripToOperatorRequest));
        }

        const dbItems = await tripforgeDb.getItineraryItems();
        if (dbItems && dbItems.length > 0) {
          setItineraryItems(dbItems.map(dbItemToOperatorItem));
        }

        const notifs = await tripforgeDb.getNotifications('operator');
        setLiveNotifications(notifs);
      } catch (err) {
        console.error('Operator data load error:', err);
      }
    };

    loadData();

    const unsubscribe = tripforgeDb.subscribe((event) => {
      if (event.table === 'trip_requests') {
        tripforgeDb.getTripRequests().then((trips) => {
          if (trips && trips.length > 0) {
            setRequests(trips.map(dbTripToOperatorRequest));
          }
        });
        if (event.eventType === 'INSERT') {
          showToast(`⚡ New custom trip request received from ${event.payload?.traveler_name} for ${event.payload?.destination} (₹${Number(event.payload?.budget || 0).toLocaleString('en-IN')})!`);
        }
      } else if (event.table === 'change_requests' && event.eventType === 'INSERT') {
        showToast(`⚡ New Change Request from ${event.payload?.requested_by}: "${event.payload?.description}"`);
      } else if (event.table === 'itinerary_items') {
        tripforgeDb.getItineraryItems().then((items) => {
          if (items && items.length > 0) {
            setItineraryItems(items.map(dbItemToOperatorItem));
          }
        });
      } else if (event.table === 'notifications') {
        tripforgeDb.getNotifications('operator').then(setLiveNotifications);
      }
    });

    return () => unsubscribe();
  }, []);

  // Actions
  const handleApproveRequest = async (id: string) => {
    await tripforgeDb.updateTripRequestStatus(id, 'Approved');
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'Approved' } : r))
    );
    showToast(`Trip request #${id} officially approved! Synced with traveler app via Supabase.`);
  };

  const handleRequestChanges = async (id: string, notes: string) => {
    await tripforgeDb.updateTripRequestStatus(id, 'Changes Requested', notes);
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: 'Changes Requested', operationalNotes: notes } : r
      )
    );
    showToast(`Changes requested for inquiry #${id}. Notified traveler.`);
  };

  const handleRejectRequest = async (id: string) => {
    await tripforgeDb.updateTripRequestStatus(id, 'Rejected');
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'Rejected' } : r))
    );
    showToast(`Inquiry #${id} marked as declined.`);
  };

  const handleResolveDisruption = async (id: string) => {
    await tripforgeDb.approveReroute(id);
    setDisruptions((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: 'Resolved & Pushed' } : d))
    );
    const updatedItems = await tripforgeDb.getItineraryItems();
    setItineraryItems(updatedItems.map(dbItemToOperatorItem));
    showToast('AI alternative approved and deployed across Clara Voyager’s live itinerary.');
  };

  const handleUpdateItineraryItems = async (newItems: ItineraryItemOp[]) => {
    setItineraryItems(newItems);
    for (const item of newItems) {
      await tripforgeDb.updateItineraryItem(item.id, {
        start_time: item.time,
        title: item.activity,
        location: item.location,
        client_charge: item.clientCharge,
        estimated_cost: item.vendorCost,
        status: item.status as any,
      });
    }
    showToast('Itinerary modifications saved to database and synced to traveler.');
  };

  // Navigation Items
  const navTabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'requests', label: 'Tour Requests', count: requests.filter((r) => r.status === 'Pending Review').length },
    { id: 'active-tours', label: 'Active Tours', count: activeTours.length },
    { id: 'calendar', label: 'Calendar' },
    { id: 'itineraries', label: 'Itineraries' },
    { id: 'dependencies', label: 'Dependency Engine', highlight: true },
    { id: 'vendors', label: 'Vendors' },
    { id: 'bookings', label: 'Bookings' },
    { id: 'payments', label: 'Payments' },
    { id: 'disruptions', label: 'Disruptions', alertCount: disruptions.filter((d) => d.status !== 'Resolved & Pushed').length },
    { id: 'coordinators', label: 'Coordinators' },
    { id: 'analytics', label: 'Analytics' },
  ];

  return (
    <div className="relative min-h-screen w-full bg-[#FCF8F9] text-[#3a1a22] font-inter flex flex-col justify-between selection:bg-[#EF9CA7]/30 overflow-x-hidden isolate">
      {/* Background Atmosphere: Semi-transparent shapes drifting across background */}
      <BackgroundAtmosphere />

      {/* Ambient Moving Clouds & Subtle Travel Accents */}
      <AmbientBackground variant="operator" />

      {/* Global Toast Notification */}
      {globalToast && (
        <div className="fixed top-6 right-6 z-50 p-4 rounded-2xl bg-white/95 border border-[#EF9CA7]/60 shadow-xl text-xs text-[#3a1a22] flex items-center gap-3 animate-fadeIn">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold block">Operator Event Logged</span>
            <span className="text-[11px] text-[#3a1a22]/70">{globalToast}</span>
          </div>
          <button onClick={() => setGlobalToast(null)} className="text-gray-400 hover:text-gray-600 ml-2">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* TOP HEADER BAR */}
      <header className="relative z-30 w-full bg-white/80 backdrop-blur-xl border-b border-[#EF9CA7]/30 py-3 px-4 sm:px-6 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Brand & Badge */}
          <div className="flex items-center gap-4">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('/');
              }}
              className="font-cormorant text-2xl sm:text-3xl font-medium tracking-[0.14em] text-[#3a1a22] hover:text-[#c85f72] transition-colors"
            >
              TripForge
            </a>
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] px-2.5 py-1 rounded-full bg-[#FFDDE1]/70 border border-[#EF9CA7]/40 text-[#c85f72]">
              OPERATOR
            </span>
          </div>

          {/* Quick Actions & Role Switcher */}
          <div className="flex items-center gap-3">
            {/* Supabase Sync Badge */}
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-mono font-semibold text-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Supabase Live Sync</span>
            </span>

            <button
              onClick={() => onNavigate('/traveler')}
              className="group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white hover:bg-[#FFDDE1]/30 border border-[#EF9CA7]/40 shadow-xs text-xs font-medium text-[#3a1a22] hover:text-[#c85f72] transition-all cursor-pointer card-hover-physics"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform text-[#c85f72]" />
              <span className="hidden sm:inline">Switch to Traveler View</span>
              <span className="sm:hidden">Traveler</span>
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="w-9 h-9 rounded-full bg-white/80 hover:bg-white border border-[#EF9CA7]/30 flex items-center justify-center text-[#3a1a22] transition-colors relative cursor-pointer"
                title="Operational Alerts"
              >
                <Bell className="w-4 h-4 text-[#3a1a22]" />
                {liveNotifications.some((n) => !n.is_read) && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                )}
              </button>

              {/* Notification Popover */}
              {notifOpen && (
                <div className="absolute right-0 top-11 z-50 w-80 p-4 rounded-2xl bg-white/95 border border-[#EF9CA7]/40 shadow-2xl space-y-3 text-xs animate-modal-in">
                  <div className="flex items-center justify-between pb-2 border-b border-[#EF9CA7]/20">
                    <span className="font-bold text-[#3a1a22]">Operational Alerts</span>
                    <span className="text-[10px] text-[#c85f72] font-semibold">
                      {liveNotifications.filter((n) => !n.is_read).length} New
                    </span>
                  </div>
                  <div className="space-y-2 max-h-72 overflow-y-auto">
                    {liveNotifications.length === 0 ? (
                      <div className="py-4 text-center text-[#3a1a22]/50 text-xs">
                        No active operational alerts.
                      </div>
                    ) : (
                      liveNotifications.map((n) => (
                        <div key={n.id} className="p-2.5 rounded-xl bg-[#FCF8F9] border border-[#EF9CA7]/20 text-[#3a1a22] space-y-1">
                          <span className="font-bold text-[11px] text-[#c85f72] block">{n.title}</span>
                          <p className="text-[11px] text-[#3a1a22]/80 leading-snug">{n.message}</p>
                          <div className="text-[9px] text-[#3a1a22]/50">
                            {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Operator Profile Pill */}
            <div className="flex items-center gap-2 pl-2 border-l border-[#EF9CA7]/30">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FFDDE1] to-[#EF9CA7] flex items-center justify-center text-[#c85f72] font-bold text-xs shadow-xs">
                VC
              </div>
              <div className="hidden md:block text-left text-xs leading-tight">
                <span className="font-semibold text-[#3a1a22] block">Vanguard Coastal Escapes</span>
                <span className="text-[10px] text-[#3a1a22]/50 font-mono">OP-4920</span>
              </div>
            </div>
          </div>
        </div>

        {/* TOP TAB NAVIGATION BAR */}
        <div className="max-w-7xl mx-auto mt-3 overflow-x-auto scrollbar-none flex items-center gap-1.5 pt-1">
          {navTabs.map((tab) => {
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  if (tab.id === 'requests') setSelectedRequest(null);
                }}
                className={`relative px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#c85f72] text-white shadow-xs'
                    : 'text-[#3a1a22]/70 hover:text-[#c85f72] hover:bg-white/60'
                } ${tab.highlight && !isActive ? 'border border-[#EF9CA7]/60 text-[#c85f72]' : ''}`}
              >
                {tab.highlight && <Sparkles className="w-3 h-3 text-[#c85f72] animate-pulse" />}
                <span>{tab.label}</span>

                {typeof tab.count === 'number' && tab.count > 0 && (
                  <span
                    className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-white text-[#c85f72]' : 'bg-[#FFDDE1] text-[#c85f72]'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}

                {typeof tab.alertCount === 'number' && tab.alertCount > 0 && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse ml-0.5" />
                )}
              </button>
            );
          })}
        </div>
      </header>

      {/* MAIN WORKSPACE CONTENT */}
      <main className="relative z-10 max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-8 flex-1">
        <MotionReveal delayMs={30}>
          {activeTab === 'overview' && (
            <OverviewSection
              onNavigateTab={(tab) => setActiveTab(tab as any)}
              requests={requests}
              activeTours={activeTours}
              disruptions={disruptions}
              onOpenRequest={(req) => {
                setSelectedRequest(req);
                setActiveTab('requests');
              }}
            />
          )}

          {activeTab === 'requests' && (
            <TourRequestsSection
              requests={requests}
              onApproveRequest={handleApproveRequest}
              onRequestChanges={handleRequestChanges}
              onRejectRequest={handleRejectRequest}
              selectedRequest={selectedRequest}
              onSelectRequest={setSelectedRequest}
            />
          )}

          {activeTab === 'active-tours' && (
            <ActiveToursSection
              activeTours={activeTours}
              onTriggerDisruptionForTour={() => setActiveTab('disruptions')}
            />
          )}

          {activeTab === 'calendar' && (
            <CalendarSection events={calendarEvents} />
          )}

          {activeTab === 'itineraries' && (
            <ItineraryEditorSection
              items={itineraryItems}
              onUpdateItems={handleUpdateItineraryItems}
              onNavigateToDependencyEngine={() => setActiveTab('dependencies')}
            />
          )}

          {activeTab === 'dependencies' && (
            <DependencyEngineSection />
          )}

          {activeTab === 'vendors' && (
            <VendorsSection vendors={vendors} />
          )}

          {activeTab === 'bookings' && (
            <BookingsPaymentsSection bookings={bookings} />
          )}

          {activeTab === 'payments' && (
            <BookingsPaymentsSection bookings={bookings} />
          )}

          {activeTab === 'disruptions' && (
            <DisruptionsSection
              disruptions={disruptions}
              onResolveDisruption={handleResolveDisruption}
            />
          )}

          {activeTab === 'coordinators' && (
            <CoordinatorsSection coordinators={coordinators} />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsSection />
          )}
        </MotionReveal>
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 text-center py-4 border-t border-[#EF9CA7]/20 bg-white/40 backdrop-blur-md">
        <p className="text-[11px] text-[#3a1a22]/50 tracking-wider uppercase font-medium">
          TripForge Tour Operator Command Architecture • PS ID-7 Operational System • Synchronized
        </p>
      </footer>
    </div>
  );
};
