import React, { useState, useMemo } from 'react';
import {
  Compass,
  MapPin,
  Calendar,
  Users,
  Search,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Star,
  Heart,
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  LogOut,
  Bed,
  Plane,
  Package,
  Camera,
  Car,
  ChevronDown,
  ChevronRight,
  Filter,
  DollarSign,
  Share2,
  Plus,
  Trash2,
  Edit3,
  Bell,
  Menu,
  X,
  Wallet,
  Check,
  Send,
  SlidersHorizontal,
  Navigation,
  Activity,
  FileText,
  Radio,
  ShoppingBag,
  Utensils,
  Moon,
  Trees,
} from 'lucide-react';
import {
  TripData,
  ItineraryItem,
  TripBookingItem,
  PopularDestination,
  ExperienceItem,
  CuratedStay,
  SeasonalCollection,
  INITIAL_TRIP,
  INITIAL_ITINERARY,
  INITIAL_BOOKINGS,
  POPULAR_DESTINATIONS,
  EXPERIENCES_CATALOG,
  OTHER_MY_TRIPS,
} from './traveler/data';
import { MakeMyTripWizard } from './traveler/MakeMyTripWizard';
import { EditTripModal } from './traveler/EditTripModal';
import { CategoryBookingModal } from './traveler/CategoryBookingModal';
import { BookingConfirmationModal } from './traveler/BookingConfirmationModal';
import { HeroSearchBar } from './traveler/HeroSearchBar';
import { CuratedStaysSection } from './traveler/CuratedStaysSection';
import { SeasonalCollectionsSection } from './traveler/SeasonalCollectionsSection';
import { TravelerStoriesSection } from './traveler/TravelerStoriesSection';
import { TripForgeChatbot } from './traveler/TripForgeChatbot';
import { TripPreparationWidget } from './traveler/TripPreparationWidget';
import { PrivilegePerksBanner } from './traveler/PrivilegePerksBanner';
import { AITripAssistWidget } from './traveler/AITripAssistWidget';
import { LiveTripWidget } from './traveler/LiveTripWidget';

import { MyTripsPortfolio } from './traveler/MyTripsPortfolio';
import { BookingsVault } from './traveler/BookingsVault';
import { ProfileModal, SettingsModal } from './traveler/ProfileAndSettingsModals';
import { ChangeRequestModal } from './traveler/ChangeRequestModal';
import { AmbientBackground } from './motion/AmbientBackground';
import { BackgroundAtmosphere } from './motion/BackgroundAtmosphere';
import { MotionReveal } from './motion/MotionReveal';
import {
  tripforgeDb,
  DbTripRequest,
  DbItineraryItem,
  DbNotification,
  isSupabaseConfigured,
} from '../lib/supabase';

interface TravelerDashboardProps {
  onNavigate: (path: string) => void;
}

export const TravelerDashboard: React.FC<TravelerDashboardProps> = ({ onNavigate }) => {
  // Navigation & UI States
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Active Trip State
  const [currentTrip, setCurrentTrip] = useState<TripData>(INITIAL_TRIP);
  const [itinerary, setItinerary] = useState<ItineraryItem[]>(INITIAL_ITINERARY);
  const [bookings, setBookings] = useState<TripBookingItem[]>(INITIAL_BOOKINGS);

  // Modals
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardPreselectDest, setWizardPreselectDest] = useState('Goa');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [bookingCategory, setBookingCategory] = useState<'flight' | 'hotel' | 'activity' | 'transport' | null>(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [destinationFilter, setDestinationFilter] = useState<string>('All');

  // Handler for adding curated stay
  const handleAddCuratedStay = (stay: CuratedStay) => {
    const newStayBooking: TripBookingItem = {
      id: `bk-stay-${Date.now()}`,
      category: 'hotel',
      title: stay.name,
      subtitle: `${stay.type} · ${stay.destination}`,
      cost: stay.pricePerNight * 4,
      date: currentTrip.startDate + ' – ' + currentTrip.endDate,
      location: stay.destination,
      status: 'Confirmed',
      details: `${stay.amenities.join(', ')} · VIP Upgrade Included`,
    };
    setBookings((prev) => {
      // replace existing hotel booking if any or add new
      const withoutOldHotel = prev.filter((b) => b.category !== 'hotel');
      return [...withoutOldHotel, newStayBooking];
    });
    setCurrentTrip((prev) => ({
      ...prev,
      hotel: `${stay.name} (${stay.type})`,
    }));
  };

  // Handler for seasonal collection customization
  const handleSelectCollection = (col: SeasonalCollection) => {
    setWizardPreselectDest(col.destination.split(' ')[0]);
    setWizardOpen(true);
  };

  // AI Prompt in Section 8
  const [aiCustomPrompt, setAiCustomPrompt] = useState('Add sunset cliffside dining and optimize for minimal travel time between North & South Goa.');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiSuccessMessage, setAiSuccessMessage] = useState(false);

  // AI Dynamic Rerouting state (Section 11)
  const [rerouteModalOpen, setRerouteModalOpen] = useState(false);
  const [rerouteAccepted, setRerouteAccepted] = useState(false);
  const [rerouteScenario, setRerouteScenario] = useState<'weather' | 'transport' | 'venue'>('weather');

  // Live Trip Mode: pre-departure countdown vs live in-trip itinerary
  const [liveTripMode, setLiveTripMode] = useState<'countdown' | 'active'>('countdown');

  // Category & Filter tabs
  const [myTripsCategory, setMyTripsCategory] = useState<string>('All');
  const [bookingCategoryFilter, setBookingCategoryFilter] = useState<string>('All');
  const [experienceCategoryFilter, setExperienceCategoryFilter] = useState<string>('All');
  const [itineraryDayFilter, setItineraryDayFilter] = useState<number | 'All'>('All');
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  // Operator lifecycle state (Section 9)
  const [operatorStep, setOperatorStep] = useState<number>(3); // 1 to 6
  const [isSendingOperator, setIsSendingOperator] = useState(false);

  // Realtime & Supabase States
  const [changeRequestModalOpen, setChangeRequestModalOpen] = useState(false);
  const [liveNotifications, setLiveNotifications] = useState<DbNotification[]>([]);
  const [disruptionAlert, setDisruptionAlert] = useState<{ title: string; message: string } | null>(null);
  const [globalToast, setGlobalToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setGlobalToast(msg);
    setTimeout(() => setGlobalToast(null), 4500);
  };

  const dbItemToTravelerItem = (i: DbItineraryItem): ItineraryItem => ({
    id: i.id,
    day: i.day_number,
    time: i.start_time,
    activity: i.title,
    location: i.location,
    category: (i.category as any) || 'activity',
    cost: Number(i.estimated_cost) || 0,
    travelTime: i.travel_time || '20 mins',
    status: (i.status as any) || 'Confirmed',
  });

  // Initial Data Fetch & Supabase Realtime Subscription
  React.useEffect(() => {
    const initData = async () => {
      try {
        const trips = await tripforgeDb.getTripRequests();
        if (trips && trips.length > 0) {
          const active = trips[0];
          setCurrentTrip((prev) => ({
            ...prev,
            id: active.id,
            title: `Bespoke ${active.destination} Expedition`,
            origin: active.origin,
            destination: active.destination,
            startDate: active.start_date,
            endDate: active.end_date,
            duration: active.duration,
            travelers: active.travelers_count,
            travelerType: active.party_type,
            totalBudget: active.budget,
            status: active.status === 'Approved' ? 'Approved' : active.status === 'Pending Review' ? 'Pending Operator Approval' : (active.status as any),
            progress: active.status === 'Approved' ? 85 : active.status === 'Pending Review' ? 60 : 35,
            hotel: active.accommodation_preference || prev.hotel,
            transport: active.transport_preference || prev.transport,
            interests: active.interests && active.interests.length > 0 ? active.interests : prev.interests,
          }));

          if (active.status === 'Approved') {
            setOperatorStep(5);
          } else if (active.status === 'Pending Review') {
            setOperatorStep(4);
          }

         // The database may contain old demo itinerary prices.
// Generate the itinerary from the current saved budget instead.
const loadedTrip: TripData = {
  ...INITIAL_TRIP,
  id: active.id,
  title: `Bespoke ${active.destination} Expedition`,
  origin: active.origin,
  destination: active.destination,
  startDate: active.start_date,
  endDate: active.end_date,
  duration: active.duration,
  travelers: active.travelers_count,
  travelerType: active.party_type,
  totalBudget: Number(active.budget) || 0,
  hotel: active.accommodation_preference || INITIAL_TRIP.hotel,
  transport: active.transport_preference || INITIAL_TRIP.transport,
  interests:
    active.interests && active.interests.length > 0
      ? active.interests
      : INITIAL_TRIP.interests,
};

setItinerary(generateDynamicItinerary(loadedTrip));
setBookings(generateDynamicBookings(loadedTrip));
        }

        const notifs = await tripforgeDb.getNotifications('clara-voyager-1');
        setLiveNotifications(notifs);

        const disrs = await tripforgeDb.getDisruptions();
        const activeDisp = disrs.find((d) => d.status === 'active');
        if (activeDisp) {
          setDisruptionAlert({
            title: 'LIVE DISRUPTION ALERT',
            message: `${activeDisp.description} Tour operator is reviewing AI alternatives.`,
          });
        }
      } catch (err) {
        console.error('Initialization error:', err);
      }
    };

    initData();

    // Subscribe to live Realtime events
    const unsubscribe = tripforgeDb.subscribe((event) => {
      if (event.table === 'trip_requests') {
        const r = event.payload as DbTripRequest;
        if (r) {
          setCurrentTrip((prev) => ({
            ...prev,
            status: r.status === 'Approved' ? 'Approved' : r.status === 'Pending Review' ? 'Pending Operator Approval' : (r.status as any),
            progress: r.status === 'Approved' ? 85 : 60,
          }));
          if (r.status === 'Approved') {
            setOperatorStep(5);
            showToast(`🎉 Your ${r.destination} trip was officially APPROVED by the tour operator!`);
          } else if (r.status === 'Changes Requested') {
            showToast(`Operator notes: ${r.operational_notes || 'Schedule changes requested.'}`);
          }
        }
      } else if (event.table === 'itinerary_items') {
        tripforgeDb.getItineraryItems().then((items) => {
          if (items && items.length > 0) {
            setItinerary(items.map(dbItemToTravelerItem));
          }
        });
        showToast('Itinerary synchronized with tour operator updates!');
      } else if (event.table === 'disruptions') {
        if (event.payload?.status === 'active') {
          setDisruptionAlert({
            title: 'WEATHER DISRUPTION ALERT',
            message: `${event.payload.description || 'Monsoon weather alert'}. Tour operator reviewing AI alternative.`,
          });
        } else if (event.payload?.status === 'resolved') {
          setDisruptionAlert({
            title: 'ITINERARY UPDATED',
            message: 'Weather disruption handled! Verified indoor experience confirmed by tour operator.',
          });
        }
      } else if (event.table === 'reroutes' && event.payload?.status === 'approved') {
        tripforgeDb.getItineraryItems().then((items) => {
          if (items && items.length > 0) {
            setItinerary(items.map(dbItemToTravelerItem));
          }
        });
        setDisruptionAlert({
          title: 'ITINERARY UPDATED',
          message: `Alternative confirmed: "${event.payload.new_plan}" (+₹${event.payload.cost_difference || 300}).`,
        });
        showToast(`Itinerary updated: "${event.payload.new_plan}" confirmed by operator.`);
      } else if (event.table === 'notifications') {
        tripforgeDb.getNotifications('clara-voyager-1').then(setLiveNotifications);
      }
    });

    return () => unsubscribe();
  }, []);

  // Live calculation of budget (Section 6)
const safeBudget = Math.max(
  0,
  Number(currentTrip.totalBudget) || 0
);

const estimatedCost = useMemo(() => {
  return bookings.reduce(
    (sum, item) => sum + Math.max(0, Number(item.cost) || 0),
    0
  );
}, [bookings]);

const remainingBudget = useMemo(() => {
  return Math.max(0, safeBudget - estimatedCost);
}, [safeBudget, estimatedCost]);

const budgetUtilization = useMemo(() => {
  if (safeBudget <= 0) return 0;
  return Math.round((estimatedCost / safeBudget) * 100);
}, [safeBudget, estimatedCost]);

const overBudgetAmount = useMemo(() => {
  return Math.max(0, estimatedCost - safeBudget);
}, [safeBudget, estimatedCost]);

const totalTripDays = useMemo(() => {
  const match = currentTrip.duration?.match(/(\d+)\s*Days?/i);
  const days = match ? Number(match[1]) : 1;
  return Math.max(1, days || 1);
}, [currentTrip.duration]);

const getDayStats = (day: number) => {
  const dayItems = itinerary.filter((item) => item.day === day);

  const plannedCost = dayItems.reduce(
    (sum, item) => sum + Math.max(0, Number(item.cost) || 0),
    0
  );

  const dayRemaining = Math.max(0, dailyBudget - plannedCost);

  const dayOverBudget = Math.max(0, plannedCost - dailyBudget);

  return {
    items: dayItems,
    plannedCost,
    dayRemaining,
    dayOverBudget,
  };
};

  // Budget Breakdown by Category
  const categoryBreakdown = useMemo(() => {
    const flight = bookings.filter((b) => b.category === 'flight').reduce((s, b) => s + b.cost, 0);
    const hotel = bookings.filter((b) => b.category === 'hotel').reduce((s, b) => s + b.cost, 0);
    const activity = bookings.filter((b) => b.category === 'activity').reduce((s, b) => s + b.cost, 0);
    const transport = bookings.filter((b) => b.category === 'transport').reduce((s, b) => s + b.cost, 0);
    return { flight, hotel, activity, transport };
  }, [bookings]);
    // Day-wise budget calculations
  

  const dailyBudget = useMemo(() => {
    return currentTrip.totalBudget / totalTripDays;
  }, [currentTrip.totalBudget, totalTripDays]);
  // ============================================================
// DYNAMIC BUDGET -> ITINERARY SYNC
// Whenever the travel budget changes, regenerate the
// itinerary and booking costs from the new budget.
// This prevents stale/static itinerary prices.
// ============================================================
React.useEffect(() => {
  const budget = Number(currentTrip.totalBudget);

  if (!Number.isFinite(budget) || budget <= 0) {
    return;
  }

  const updatedTrip = {
    ...currentTrip,
    totalBudget: budget,
  };

  const newItinerary = generateDynamicItinerary(updatedTrip);
  const newBookings = generateDynamicBookings(updatedTrip);

  setItinerary(newItinerary);
  setBookings(newBookings);
}, [currentTrip.totalBudget]);

  

  // Handlers for Itinerary items
  const handleRemoveItineraryItem = (id: string) => {
    setItinerary((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddActivityPrompt = () => {
    const newActivity: ItineraryItem = {
      id: `it-${Date.now()}`,
      day: 3,
      time: '03:30 PM',
      activity: 'Sunset Cliffside Photography & Coastal Drink',
      location: 'Vagator Chapora Fort Panorama',
      category: 'activity',
      cost: 1800,
      travelTime: '15 mins',
      status: 'Confirmed',
    };
    setItinerary((prev) => [...prev, newActivity]);
  };

  // Add experience to Trip
  const handleAddExperience = (exp: ExperienceItem) => {
    const newBooking: TripBookingItem = {
      id: `bk-exp-${Date.now()}`,
      category: 'activity',
      title: exp.title,
      subtitle: `${exp.location} · ${exp.duration}`,
      cost: exp.cost,
      date: '14 Oct, 2026',
      location: exp.location,
      status: 'Confirmed',
      details: exp.description,
    };
    setBookings((prev) => [...prev, newBooking]);

    const newItinerary: ItineraryItem = {
      id: `it-exp-${Date.now()}`,
      day: 3,
      time: '02:00 PM',
      activity: exp.title,
      location: exp.location,
      category: 'activity',
      cost: exp.cost,
      travelTime: '20 mins',
      status: 'Confirmed',
    };
    setItinerary((prev) => [...prev, newItinerary]);
  };

  // Handler for AI Itinerary generation
  const handleGenerateAIItinerary = () => {
    setIsGeneratingAI(true);
    setTimeout(() => {
      setIsGeneratingAI(false);
      setAiSuccessMessage(true);
      // Add custom AI generated activity
      const aiActivity: ItineraryItem = {
        id: `it-ai-${Date.now()}`,
        day: 2,
        time: '06:30 PM',
        activity: 'Cliffside Sunset Candlelit Dinner & Feni Tasting',
        location: 'Vagator Coastal Bluff Sanctuary',
        category: 'activity',
        cost: 3200,
        travelTime: '15 mins',
        status: 'Confirmed',
      };
      setItinerary((prev) => [...prev, aiActivity]);
      setTimeout(() => setAiSuccessMessage(false), 4000);
    }, 1200);
  };

  // Handlers for Operator Pipeline
  const handleSendToOperator = async () => {
    setIsSendingOperator(true);
    await tripforgeDb.updateTripRequestStatus(currentTrip.id, 'Pending Review');
    setIsSendingOperator(false);
    setOperatorStep(4); // Operator Reviewing
    setCurrentTrip((prev) => ({
      ...prev,
      status: 'Pending Operator Approval',
      progress: 60,
    }));
    showToast(`Inquiry #${currentTrip.id} transmitted to tour operator via Supabase!`);
  };

  const handleApproveByOperatorDemo = async () => {
    await tripforgeDb.updateTripRequestStatus(currentTrip.id, 'Approved');
    setOperatorStep(5); // Approved
    setCurrentTrip((prev) => ({
      ...prev,
      status: 'Approved',
      progress: 85,
    }));
    showToast(`Trip #${currentTrip.id} approved by tour operator!`);
  };

  // Handler for custom change request
  const handleSubmitChangeRequest = async (desc: string) => {
    await tripforgeDb.createChangeRequest(currentTrip.id, 'Clara Voyager', desc);
    showToast('Change request dispatched to tour operator in real-time!');
  };

  // Handler for trip generation from Wizard
  const generateDynamicItinerary = (trip: TripData): ItineraryItem[] => {
  const days = Math.max(
    1,
    parseInt(trip.duration.match(/\d+/)?.[0] || '1')
  );

  const destination = trip.destination || 'your destination';
  const interests = trip.interests || [];

  const activities = [
    {
      activity: `Arrival & ${destination} Orientation`,
      location: destination,
      cost: 2400,
      travelTime: '30 mins',
    },
    {
      activity: `${interests.includes('Culture') ? 'Heritage & Culture' : 'Local'} Experience`,
      location: `${destination} Heritage District`,
      cost: 3200,
      travelTime: '20 mins',
    },
    {
      activity: `${interests.includes('Food') ? 'Local Culinary' : 'Signature'} Experience`,
      location: `${destination} Local Quarter`,
      cost: 3800,
      travelTime: '25 mins',
    },
    {
      activity: `${interests.includes('Adventure') ? 'Adventure & Outdoor' : 'Scenic'} Exploration`,
      location: `${destination} Scenic Zone`,
      cost: 4200,
      travelTime: '35 mins',
    },
    {
      activity: `${interests.includes('Nature') ? 'Nature & Wildlife' : 'Scenic'} Experience`,
      location: `${destination} Nature Reserve`,
      cost: 3500,
      travelTime: '40 mins',
    },
    {
      activity: `${interests.includes('Shopping') ? 'Local Shopping' : 'Free Exploration'} & Leisure`,
      location: `${destination} Market`,
      cost: 2200,
      travelTime: '15 mins',
    },
    {
      activity: `Sunset Experience & Farewell Dinner`,
      location: destination,
      cost: 4500,
      travelTime: '20 mins',
    },
  ];

  return Array.from({ length: days }, (_, index) => {
    const activity = activities[index % activities.length];

    return {
      id: `dynamic-${Date.now()}-${index}`,
      day: index + 1,
      time: index === 0 ? '10:00 AM' : '11:00 AM',
      activity: activity.activity,
      location: activity.location,
      category: 'activity',
      cost: activity.cost,
      travelTime: activity.travelTime,
      status: index === 0 ? 'Confirmed' : 'Pending Operator',
    };
  });
};
const generateDynamicBookings = (trip: TripData): TripBookingItem[] => {
  const days = Math.max(
    1,
    parseInt(trip.duration.match(/\d+/)?.[0] || '1')
  );

  const travelers = Math.max(1, trip.travelers);

  // Use the user's selected budget as the basis
  const budget = Math.max(10000, trip.totalBudget);

  // Allocate the budget across major travel categories
  const flightCost = Math.round(budget * 0.20);
  const hotelCost = Math.round(budget * 0.35);
  const transportCost = Math.round(budget * 0.15);
  const activityCost = Math.max(
    0,
    budget - flightCost - hotelCost - transportCost
  );

  return [
    {
      id: `booking-flight-${Date.now()}`,
      category: 'flight',
      title: `${trip.origin} → ${trip.destination} Flight`,
      subtitle: `Round Trip · ${travelers} Traveler${travelers > 1 ? 's' : ''}`,
      cost: flightCost,
      date: `${trip.startDate} – ${trip.endDate}`,
      location: `${trip.origin} → ${trip.destination}`,
      status: 'Pending',
      details: `Estimated airfare for ${travelers} traveler${travelers > 1 ? 's' : ''}`,
    },
    {
      id: `booking-hotel-${Date.now()}`,
      category: 'hotel',
      title: `${trip.destination} Accommodation`,
      subtitle: `${days - 1 > 0 ? days - 1 : 1} Night${days - 1 !== 1 ? 's' : ''}`,
      cost: hotelCost,
      date: `${trip.startDate} – ${trip.endDate}`,
      location: trip.destination,
      status: 'Pending',
      details: `${trip.hotel} · Based on selected trip budget`,
    },
    {
      id: `booking-transport-${Date.now()}`,
      category: 'transport',
      title: `${trip.destination} Local Transport`,
      subtitle: `${days}-Day Transportation`,
      cost: transportCost,
      date: `${trip.startDate} – ${trip.endDate}`,
      location: trip.destination,
      status: 'Pending',
      details: trip.transport,
    },
    {
      id: `booking-activity-${Date.now()}`,
      category: 'activity',
      title: `${trip.destination} Experiences`,
      subtitle: `${trip.interests.length || 1} Interest-Based Experiences`,
      cost: activityCost,
      date: `${trip.startDate} – ${trip.endDate}`,
      location: trip.destination,
      status: 'Pending',
      details:
        trip.interests.length > 0
          ? trip.interests.join(', ')
          : 'Curated local experiences',
    },
  ];
};
  const handleTripGenerated = async (newTrip: TripData) => {
    const created = await tripforgeDb.createTripRequest({
      id: newTrip.id,
      traveler_id: 'clara-voyager-1',
      traveler_name: 'Clara Voyager',
      traveler_email: 'clara.voyager@tripforge.com',
      origin: newTrip.origin,
      destination: newTrip.destination,
      start_date: newTrip.startDate,
      end_date: newTrip.endDate,
      duration: newTrip.duration,
      travelers_count: newTrip.travelers,
      party_type: newTrip.travelerType,
      budget: newTrip.totalBudget,
      interests: newTrip.interests,
      accommodation_preference: newTrip.hotel,
      transport_preference: newTrip.transport,
      special_requests: 'Family-friendly activities and sunset oceanview breakfast.',
      status: 'Pending Review',
    });

    setCurrentTrip({
      ...newTrip,
      id: created.id,
      status: 'Pending Operator Approval',
      progress: 60,
    });
    setOperatorStep(4);

   const dynamicItinerary = generateDynamicItinerary(newTrip);

setItinerary(dynamicItinerary);
const dynamicBookings = generateDynamicBookings(newTrip);

setBookings(dynamicBookings);

    showToast(`Trip request #${created.id} saved to Supabase and dispatched to Operator!`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handlers for AI Rerouting
  const handleAcceptReroute = () => {
    setRerouteAccepted(true);
    setItinerary((prev) =>
      prev.map((item) =>
        item.id === 'it-6'
          ? {
              ...item,
              activity: 'Local Portuguese Heritage Art Gallery & Gourmet Food Tour',
              location: 'Panaji Latin Quarter Galleries',
              cost: 9300,
              status: 'Rerouted',
            }
          : item
      )
    );
  };

  const operatorTimeline = [
    { num: 1, label: 'Trip Created', done: operatorStep >= 1 },
    { num: 2, label: 'AI Itinerary Generated', done: operatorStep >= 2 },
    { num: 3, label: 'Request Sent to Operator', done: operatorStep >= 3 },
    { num: 4, label: 'Operator Reviewing', done: operatorStep >= 4 },
    { num: 5, label: 'Approved', done: operatorStep >= 5 },
    { num: 6, label: 'Confirmed', done: operatorStep >= 6 },
  ];

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="tripforge-dashboard tripforge-traveler relative min-h-screen w-full bg-transparent text-[#FFF9EE] font-inter antialiased flex flex-col selection:bg-[#EF9CA7]/30 overflow-x-hidden isolate">
      {/* Background Atmosphere: Semi-transparent shapes drifting across background */}
      <BackgroundAtmosphere />

      {/* Ambient Moving Clouds & Subtle Travel Accents */}
      

      <div className="relative z-10 flex flex-col flex-1">
        {/* ========================================================================= */}
        {/* 1. TRAVELER DASHBOARD HEADER                                             */}
        {/* ========================================================================= */}
        <header className="sticky top-0 z-40 bg-white xl border-b border-[#EF9CA7]/30 transition-all shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Left: Brand & Navigation */}
          <div className="flex items-center gap-6 xl:gap-8">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('/');
              }}
              className="group flex items-baseline gap-2 cursor-pointer focus:outline-none"
            >
              <span className="font-cormorant text-3xl sm:text-4xl font-normal tracking-[0.16em] text-[#3a1a22] group-hover:text-[#c85f72] transition-colors">
                TripForge
              </span>
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#c85f72] font-semibold">
                Traveler
              </span>
            </a>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 ml-2">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="px-3.5 py-1.5 rounded-full text-xs font-medium text-[#3a1a22] hover:text-[#c85f72] hover:bg-[#FFDDE1]/40 transition-all cursor-pointer"
              >
                Home
              </button>
              <button
                onClick={() => setWizardOpen(true)}
                className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#c85f72] bg-[#FFDDE1]/60 hover:bg-[#FFDDE1] transition-all cursor-pointer flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Make My Trip</span>
              </button>
              <button
                onClick={() => scrollToSection('my-trips-section')}
                className="px-3.5 py-1.5 rounded-full text-xs font-medium text-[#3a1a22]/80 hover:text-[#c85f72] hover:bg-[#FFDDE1]/40 transition-all cursor-pointer"
              >
                My Trips
              </button>
              <button
                onClick={() => scrollToSection('upcoming-bookings-section')}
                className="px-3.5 py-1.5 rounded-full text-xs font-medium text-[#3a1a22]/80 hover:text-[#c85f72] hover:bg-[#FFDDE1]/40 transition-all cursor-pointer"
              >
                Bookings
              </button>
              <button
                onClick={() => scrollToSection('itinerary-section')}
                className="px-3.5 py-1.5 rounded-full text-xs font-medium text-[#3a1a22]/80 hover:text-[#c85f72] hover:bg-[#FFDDE1]/40 transition-all cursor-pointer"
              >
                Itinerary
              </button>
              <button
                onClick={() => scrollToSection('live-trip-section')}
                className="px-3.5 py-1.5 rounded-full text-xs font-medium text-[#3a1a22]/80 hover:text-[#c85f72] hover:bg-[#FFDDE1]/40 transition-all cursor-pointer flex items-center gap-1"
              >
                <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                <span>Live Trip</span>
              </button>
            </nav>
          </div>

          {/* Right: Notifications, Profile, Mobile Menu */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Operator Switcher & Supabase Live Sync */}
            <div className="hidden lg:flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[10px] font-mono font-semibold text-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Supabase Live</span>
              </span>
              <button
                onClick={() => onNavigate('/operator')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-[#FFDDE1]/40 border border-[#EF9CA7]/50 text-xs font-semibold text-[#c85f72] transition-all cursor-pointer shadow-xs"
                title="Switch to Tour Operator Command Console"
              >
                <span>Operator Console</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2.5 rounded-full bg-[#FFDDE1]/50 hover:bg-[#FFDDE1] text-[#3a1a22] transition-colors relative cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-4 h-4 text-[#c85f72]" />
                {liveNotifications.some((n) => !n.is_read) && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#c85f72] ring-2 ring-white animate-pulse" />
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-[#EF9CA7]/40 shadow-xl p-4 z-50 text-xs animate-fadeIn">
                  <div className="flex items-center justify-between pb-2 border-b border-[#EF9CA7]/20 font-semibold text-[#3a1a22]">
                    <span>TripForge Realtime Alerts</span>
                    <span className="text-[10px] text-[#c85f72] font-semibold">
                      {liveNotifications.filter((n) => !n.is_read).length} Unread
                    </span>
                  </div>
                  <div className="divide-y divide-[#EF9CA7]/10 mt-2 max-h-72 overflow-y-auto">
                    {liveNotifications.length === 0 ? (
                      <div className="py-4 text-center text-[#3a1a22]/50 text-xs">
                        No notifications yet.
                      </div>
                    ) : (
                      liveNotifications.map((n) => (
                        <div key={n.id} className="py-2.5">
                          <div className="font-semibold text-[#c85f72]">{n.title}</div>
                          <div className="text-[11px] text-[#3a1a22]/80 mt-0.5">{n.message}</div>
                          <div className="text-[9px] text-[#3a1a22]/50 mt-1">
                            {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2.5 p-1 rounded-full hover:bg-[#FFDDE1]/40 transition-colors cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#EF9CA7] to-[#FFDDE1] p-0.5 shadow-xs">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                    alt="Clara Voyager"
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <div className="hidden sm:block text-left pr-1">
                  <div className="text-xs font-semibold text-[#3a1a22] leading-tight">Clara Voyager</div>
                  <div className="text-[10px] text-[#c85f72] font-mono">Bespoke Club</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[#3a1a22]/60 hidden sm:block" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-[#EF9CA7]/40 shadow-xl p-2 z-50 text-xs animate-fadeIn">
                  <div className="px-3 py-2 border-b border-[#EF9CA7]/20">
                    <div className="font-semibold text-[#3a1a22]">Clara Voyager</div>
                    <div className="text-[11px] text-[#3a1a22]/60">clara.voyager@tripforge.com</div>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        setProfileModalOpen(true);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#FFDDE1]/40 text-[#3a1a22] transition-colors cursor-pointer flex items-center justify-between"
                    >
                      <span>Profile</span>
                      <span className="text-[10px] text-[#c85f72] font-semibold">Tier 1</span>
                    </button>
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        setEditModalOpen(true);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#FFDDE1]/40 text-[#3a1a22] transition-colors cursor-pointer"
                    >
                      My Preferences
                    </button>
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        scrollToSection('my-trips-section');
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#FFDDE1]/40 text-[#3a1a22] transition-colors cursor-pointer"
                    >
                      My Trips
                    </button>
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        setSettingsModalOpen(true);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#FFDDE1]/40 text-[#3a1a22] transition-colors cursor-pointer"
                    >
                      Settings
                    </button>
                    <button
                      onClick={() => onNavigate('/')}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#FFF5F6] text-[#c85f72] flex items-center justify-between transition-colors cursor-pointer border-t border-[#EF9CA7]/20 mt-1"
                    >
                      <span>Sign Out</span>
                      <LogOut className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl hover:bg-[#FFDDE1]/40 text-[#3a1a22] transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#EF9CA7]/20 bg-white px-4 pt-3 pb-6 space-y-2 animate-fadeIn shadow-lg">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold text-[#3a1a22] hover:bg-[#FFDDE1]/40"
            >
              Home
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setWizardOpen(true);
              }}
              className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold text-[#c85f72] bg-[#FFDDE1]/60"
            >
              Make My Trip
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                scrollToSection('my-trips-section');
              }}
              className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold text-[#3a1a22] hover:bg-[#FFDDE1]/40"
            >
              My Trips
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                scrollToSection('upcoming-bookings-section');
              }}
              className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold text-[#3a1a22] hover:bg-[#FFDDE1]/40"
            >
              Bookings
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                scrollToSection('itinerary-section');
              }}
              className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold text-[#3a1a22] hover:bg-[#FFDDE1]/40"
            >
              Itinerary
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                scrollToSection('live-trip-section');
              }}
              className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold text-[#3a1a22] hover:bg-[#FFDDE1]/40"
            >
              Live Trip
            </button>
            <div className="pt-2 border-t border-[#EF9CA7]/20">
              <button
                onClick={() => onNavigate('/')}
                className="w-full text-left px-4 py-2 rounded-xl text-xs text-[#c85f72] font-semibold"
              >
                ← Back to Landing Page
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Global Toast for Realtime Events */}
      {globalToast && (
        <div className="fixed top-24 right-6 z-50 p-4 rounded-2xl bg-white border border-[#EF9CA7]/60 shadow-xl text-xs text-[#3a1a22] flex items-center gap-3 animate-fadeIn">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold block">TripForge Realtime Sync</span>
            <span className="text-[11px] text-[#3a1a22]/70">{globalToast}</span>
          </div>
          <button onClick={() => setGlobalToast(null)} className="text-gray-400 hover:text-gray-600 ml-2">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Live Disruption / Reroute Announcement Banner */}
      {disruptionAlert && (
        <div className="bg-gradient-to-r from-amber-500 via-rose-500 to-amber-600 text-white px-4 py-3 shadow-md flex items-center justify-between text-xs animate-fadeIn">
          <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 shrink-0 animate-pulse text-amber-200" />
              <div>
                <span className="font-bold uppercase tracking-wider mr-2">{disruptionAlert.title}:</span>
                <span>{disruptionAlert.message}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 self-end sm:self-auto">
              <button
                onClick={() => scrollToSection('itinerary-section')}
                className="px-3 py-1 rounded-lg bg-white/20 hover:bg-white text-white font-semibold text-[11px] transition-colors"
              >
                View Updated Itinerary ↓
              </button>
              <button
                onClick={() => setDisruptionAlert(null)}
                className="text-white/80 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 1: HERO / WELCOME + ACTIVE JOURNEY CARD                            */}
      {/* ========================================================================= */}
      <section className="tripforge-hero relative pt-12 pb-14 px-4 sm:px-6 lg:px-8 bg-transparent overflow-hidden border-b border-white/20">
      
        {/* Ambient atmospheric gradients & photography accent */}
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Col (7 cols): Hero Welcome */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-whiteborder border-[#EF9CA7]/50 text-[#c85f72] text-xs font-semibold tracking-wider uppercase mb-4 shadow-xs">
                <Compass className="w-3.5 h-3.5" />
                <span>Personalized Travel Workspace</span>
              </div>
              <h1 className="font-cormorant text-4xl sm:text-5xl lg:text-6xl font-light text-[#3a1a22] tracking-tight leading-[1.1]">
                Where will your journey take you?
              </h1>
              <p className="mt-3.5 text-base sm:text-lg text-[#ffffff]/75 max-w-xl leading-relaxed">
                Create a trip that's completely yours. In TripForge, you don’t pick rigid tour packages—you forge bespoke journeys with real-time transparent pricing and verified operator execution.
              </p>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-3.5">
                <button
                  onClick={() => setWizardOpen(true)}
                  className="px-8 py-3.5 rounded-2xl bg-[#c85f72] hover:bg-[#3a1a22] text-white text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-[#c85f72]/20 flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>MAKE MY TRIP</span>
                </button>

                <button
                  onClick={() => scrollToSection('destinations-section')}
                  className="px-7 py-3.5 rounded-2xl bg-white hover:bg-[#FFDDE1]/40 border border-[#EF9CA7]/60 text-[#3a1a22] hover:text-[#c85f72] text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <span>EXPLORE DESTINATIONS</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              {/* Interactive Search & Multi-parameter Discovery Bar */}
              <HeroSearchBar
                onSearch={({ destination }) => {
                  setWizardPreselectDest(destination);
                }}
                onOpenWizard={(dest) => {
                  if (dest) setWizardPreselectDest(dest);
                  setWizardOpen(true);
                }}
              />

              {/* Platform trust indicators */}
              <div className="mt-8 pt-6 border-t border-[#EF9CA7]/25 flex flex-wrap items-center gap-5 text-xs text-[#3a1a22]/70 font-medium">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#c85f72]" />
                  Verified Local Operators
                </span>
                <span className="text-white/40">•</span>
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#c85f72]" />
                  AI Dynamic Rerouting Protection
                </span>
                <span className="text-white/40">•</span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#c85f72]" />
                  24/7 Dedicated Concierge
                </span>
              </div>
            </div>

            {/* Right Col (5 cols): Active Journey Card */}
            <div className="lg:col-span-5">
              <div className="bg-white md rounded-3xl p-6 border border-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#EF9CA7]/20 to-transparent rounded-bl-full pointer-events-none" />

                <div className="flex items-center justify-between pb-3.5 border-b border-[#EF9CA7]/20">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#c85f72]">
                      My Active Journey
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    {currentTrip.status}
                  </span>
                </div>

                <div className="mt-4 flex gap-4 items-center">
                  <img
                    src={currentTrip.coverImage}
                    alt={currentTrip.destination}
                    className="w-20 h-20 rounded-2xl object-cover shadow-sm shrink-0 border border-[#EF9CA7]/30"
                  />
                  <div>
                    <h3 className="font-cormorant text-2xl font-medium text-[#3a1a22] leading-tight">
                      {currentTrip.origin} → {currentTrip.destination}
                    </h3>
                    <div className="text-xs text-[#3a1a22]/70 mt-1 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#c85f72]" />
                      <span>{currentTrip.startDate} – {currentTrip.endDate}</span>
                    </div>
                    <div className="text-xs text-[#3a1a22]/70 mt-0.5 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#c85f72]" />
                      <span>{currentTrip.travelerType} · {currentTrip.duration}</span>
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-5 p-3 rounded-2xl bg-[#FCF8F9] border border-[#EF9CA7]/25 space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-[#3a1a22]/80">Trip Progress</span>
                    <span className="font-mono text-[#c85f72]">{currentTrip.progress}% Complete</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#FFDDE1] overflow-hidden">
                    <div
                      style={{ width: `${currentTrip.progress}%` }}
                      className="bg-gradient-to-r from-[#EF9CA7] to-[#c85f72] h-full rounded-full transition-all duration-500"
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-[#3a1a22]/60 pt-0.5">
                    <span>Draft</span>
                    <span className="font-semibold text-[#c85f72]">Planning & Customization</span>
                    <span>Confirmed</span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="mt-5 pt-3 border-t border-[#EF9CA7]/20 flex items-center justify-between text-xs">
                  <button
                    onClick={() => setEditModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-white border border-[#EF9CA7]/50 hover:bg-[#FFDDE1]/40 text-[#3a1a22] font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#c85f72]" />
                    <span>EDIT TRIP</span>
                  </button>

                  <button
                    onClick={() => scrollToSection('itinerary-section')}
                    className="px-4 py-2 rounded-xl bg-[#c85f72] hover:bg-[#3a1a22] text-white font-semibold uppercase tracking-wider transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>OPEN ITINERARY</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2: QUICK TRAVEL ACTIONS                                           */}
      {/* ========================================================================= */}
      <MotionReveal delayMs={50}>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#c85f72] block">
                Trip Services
              </span>
              <h2 className="font-cormorant text-3xl font-normal text-[#3a1a22]">
                Quick Travel Actions
              </h2>
            </div>
            <span className="text-xs text-[#3a1a22]/60 hidden sm:inline">
              Curate individual layers of your journey with real-time price updates
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Flights */}
            <div
              onClick={() => setBookingCategory('flight')}
              className="group p-5 rounded-3xl bg-white border border-[#EF9CA7]/30 hover:border-[#c85f72] shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between card-hover-physics"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FFDDE1] to-[#EF9CA7]/40 text-[#c85f72] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Plane className="w-6 h-6" />
                </div>
                <h3 className="font-cormorant text-2xl font-medium text-[#3a1a22]">
                  ✈ Flights
                </h3>
                <p className="text-xs text-[#3a1a22]/70 mt-1 leading-relaxed">
                  Find flights for your journey. Compare non-stop schedules and legroom.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-[#EF9CA7]/20 flex items-center justify-between text-xs text-[#c85f72] font-semibold">
                <span>Explore Flights</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 2: Hotels */}
            <div
              onClick={() => setBookingCategory('hotel')}
              className="group p-5 rounded-3xl bg-white border border-[#EF9CA7]/30 hover:border-[#c85f72] shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between card-hover-physics"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FFDDE1] to-[#EF9CA7]/40 text-[#c85f72] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Bed className="w-6 h-6" />
                </div>
                <h3 className="font-cormorant text-2xl font-medium text-[#3a1a22]">
                  🏨 Hotels
                </h3>
                <p className="text-xs text-[#3a1a22]/70 mt-1 leading-relaxed">
                  Find your perfect stay. Curated waterfront villas, palaces & boutique suites.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-[#EF9CA7]/20 flex items-center justify-between text-xs text-[#c85f72] font-semibold">
                <span>Explore Hotels</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 3: Activities */}
            <div
              onClick={() => setBookingCategory('activity')}
              className="group p-5 rounded-3xl bg-white border border-[#EF9CA7]/30 hover:border-[#c85f72] shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between card-hover-physics"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FFDDE1] to-[#EF9CA7]/40 text-[#c85f72] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Camera className="w-6 h-6" />
                </div>
                <h3 className="font-cormorant text-2xl font-medium text-[#3a1a22]">
                  🎯 Activities
                </h3>
                <p className="text-xs text-[#3a1a22]/70 mt-1 leading-relaxed">
                  Add experiences to your journey. Spice walks, catamarans, and heritage ateliers.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-[#EF9CA7]/20 flex items-center justify-between text-xs text-[#c85f72] font-semibold">
                <span>Explore Activities</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 4: Transport */}
            <div
              onClick={() => setBookingCategory('transport')}
              className="group p-5 rounded-3xl bg-white border border-[#EF9CA7]/30 hover:border-[#c85f72] shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between card-hover-physics"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FFDDE1] to-[#EF9CA7]/40 text-[#c85f72] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Car className="w-6 h-6" />
                </div>
                <h3 className="font-cormorant text-2xl font-medium text-[#3a1a22]">
                  🚗 Transport
                </h3>
                <p className="text-xs text-[#3a1a22]/70 mt-1 leading-relaxed">
                  Plan local travel between destinations. Dedicated chauffeur or luxury EV rentals.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-[#EF9CA7]/20 flex items-center justify-between text-xs text-[#c85f72] font-semibold">
                <span>Explore Transport</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </section>
      </MotionReveal>

      {/* ========================================================================= */}
      {/* SECTION 3: POPULAR DESTINATIONS ("Explore Destinations")                  */}
      {/* ========================================================================= */}
      <MotionReveal delayMs={80}>
        <section id="destinations-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#c85f72] block">
              Inspiration Horizons
            </span>
            <h2 className="font-cormorant text-3xl sm:text-4xl font-normal text-[#3a1a22]">
              Explore Destinations
            </h2>
            <p className="text-xs sm:text-sm text-[#3a1a22]/70 mt-1">
              Select an inspiration starting point. These are not fixed tour packages—TripForge lets you build your bespoke trip around them.
            </p>
          </div>

          {/* Destination Category Filter Tabs */}
          <div className="flex flex-wrap gap-1.5 self-start sm:self-auto">
            {['All', 'Coastal', 'Heritage', 'Mountain', 'Wellness', 'Urban Luxury'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setDestinationFilter(cat)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  destinationFilter === cat
                    ? 'bg-[#c85f72] text-white font-semibold shadow-xs'
                    : 'bg-white border border-[#EF9CA7]/40 text-[#3a1a22]/80 hover:bg-[#FFDDE1]/40'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Horizontal destination cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {POPULAR_DESTINATIONS.filter((d) =>
            destinationFilter === 'All' ? true : d.category === destinationFilter
          ).map((dest) => (
            <div
              key={dest.id}
              className="group rounded-3xl bg-white border border-[#EF9CA7]/30 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              {/* Image banner */}
              <div className="relative h-52 w-full overflow-hidden bg-[#FFDDE1]/40">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  {dest.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-0.5 rounded-full bg-white md text-[10px] font-semibold text-[#c85f72] uppercase tracking-wider"
                    >
                      {tag}
                    </span>
                  ))}
                  {dest.category && (
                    <span className="px-2.5 py-0.5 rounded-full bg-[#3a1a22]/80 md text-[10px] font-semibold text-white uppercase tracking-wider">
                      {dest.category}
                    </span>
                  )}
                </div>

                <div className="absolute top-3 right-3 bg-black/40 md text-amber-300 px-2 py-0.5 rounded-lg text-xs font-bold flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                  <span>{dest.rating || 4.95}</span>
                </div>

                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <div className="text-[11px] text-white/80 font-medium flex items-center justify-between">
                    <span>{dest.region}</span>
                    {dest.bestSeason && (
                      <span className="text-[10px] text-[#FFDDE1]">Best: {dest.bestSeason}</span>
                    )}
                  </div>
                  <h3 className="font-cormorant text-2xl font-medium leading-tight mt-0.5">
                    {dest.name}
                  </h3>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <p className="text-xs text-[#3a1a22]/75 line-clamp-2 leading-relaxed mb-4">
                  {dest.description}
                </p>

                <div className="pt-3 border-t border-[#EF9CA7]/20 flex items-center justify-between mb-4">
                  <div>
                    <span className="text-[10px] text-[#3a1a22]/50 uppercase tracking-wider block">
                      Starting Estimated Budget
                    </span>
                    <span className="text-base font-bold text-[#c85f72] font-mono">
                      From {dest.startingBudget}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#3a1a22]/60 font-medium">Bespoke Forge</span>
                </div>

                <button
                  onClick={() => {
                    setWizardPreselectDest(dest.name);
                    setWizardOpen(true);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#FFF5F6] to-[#FFDDE1]/70 hover:from-[#c85f72] hover:to-[#3a1a22] hover:text-white border border-[#EF9CA7]/50 text-[#3a1a22] text-xs font-semibold tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <span>Build My Trip</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
      </MotionReveal>

      {/* ========================================================================= */}
      {/* SEASONAL COLLECTIONS (Curator's Horizons)                                  */}
      {/* ========================================================================= */}
      <MotionReveal delayMs={70}>
        <SeasonalCollectionsSection onSelectCollection={handleSelectCollection} />
      </MotionReveal>

      {/* ========================================================================= */}
      {/* SECTION 4: MY CURRENT TRIP (Detailed Showcase)                            */}
      {/* ========================================================================= */}
      <MotionReveal delayMs={70}>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          <div className="rounded-3xl bg-gradient-to-br from-white via-[#FFF5F6] to-[#FFDDE1]/30 p-6 sm:p-9 border border-[#EF9CA7]/40 shadow-lg card-hover-physics">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#EF9CA7]/30">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#c85f72]">
                    MY CURRENT TRIP
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c85f72]" />
                  <span className="text-xs font-mono text-[#3a1a22]/70 font-semibold">
                    {currentTrip.id}
                  </span>
                </div>
                <h2 className="font-cormorant text-3xl sm:text-4xl font-normal text-[#3a1a22]">
                  {currentTrip.origin} → {currentTrip.destination}
                </h2>
                <div className="mt-2 flex flex-wrap items-center gap-3 sm:gap-6 text-xs text-[#3a1a22]/80">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-[#c85f72]" />
                    <span>{currentTrip.startDate} – {currentTrip.endDate}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#c85f72]" />
                    <span>{currentTrip.duration}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-[#c85f72]" />
                    <span>{currentTrip.travelerType}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Wallet className="w-4 h-4 text-[#c85f72]" />
                    <span className="font-mono font-bold text-[#c85f72]">
                      ₹{currentTrip.totalBudget.toLocaleString()} estimated
                    </span>
                  </span>
                </div>
              </div>

              {/* Actions: OPEN ITINERARY & EDIT TRIP */}
              <div className="flex items-center gap-3 self-start lg:self-auto">
                <button
                  onClick={() => setEditModalOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-white border border-[#EF9CA7]/60 hover:bg-[#FFDDE1]/50 text-[#3a1a22] hover:text-[#c85f72] text-xs font-semibold tracking-wider uppercase transition-all shadow-xs cursor-pointer flex items-center gap-1.5 btn-hover-physics"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>EDIT TRIP</span>
                </button>
                <button
                  onClick={() => scrollToSection('itinerary-section')}
                  className="px-5 py-2.5 rounded-xl bg-[#c85f72] hover:bg-[#3a1a22] text-white text-xs font-semibold tracking-wider uppercase transition-all shadow-md cursor-pointer flex items-center gap-1.5 btn-hover-physics"
                >
                  <span>OPEN ITINERARY</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Details Row: Hotel, Transit, Operator */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 text-xs">
              <div className="p-3.5 rounded-2xl bg-white border border-[#EF9CA7]/30 card-hover-physics">
                <div className="text-[10px] uppercase font-semibold text-[#c85f72] mb-1">
                  Selected Stay
                </div>
                <div className="font-semibold text-[#3a1a22]">{currentTrip.hotel}</div>
                <div className="text-[11px] text-[#3a1a22]/60 mt-0.5">Private Oceanview Suite</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-[#EF9CA7]/30 card-hover-physics">
                <div className="text-[10px] uppercase font-semibold text-[#c85f72] mb-1">
                  Transit Standby
                </div>
                <div className="font-semibold text-[#3a1a22]">{currentTrip.transport}</div>
                <div className="text-[11px] text-[#3a1a22]/60 mt-0.5">Airport + 5 Days Inter-city</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-[#EF9CA7]/30 card-hover-physics">
                <div className="text-[10px] uppercase font-semibold text-[#c85f72] mb-1">
                  Assigned Local Operator
                </div>
                <div className="font-semibold text-[#3a1a22]">{currentTrip.operatorName}</div>
                <div className="text-[11px] text-[#c85f72] mt-0.5">Verified ID: {currentTrip.operatorId}</div>
              </div>
            </div>
          </div>
        </section>
      </MotionReveal>

      {/* ========================================================================= */}
      {/* CURATED STAYS & PRIVATE SANCTUARIES                                       */}
      {/* ========================================================================= */}
      <MotionReveal delayMs={70}>
        <CuratedStaysSection
          onAddStayToTrip={handleAddCuratedStay}
          bookedStayNames={bookings.filter((b) => b.category === 'hotel').map((b) => b.title)}
        />
      </MotionReveal>

      {/* ========================================================================= */}
      {/* SECTION 5: TRIP ITINERARY PREVIEW (Day-by-Day Travel Plans)               */}
      {/* ========================================================================= */}
      <section id="itinerary-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="bg-white rounded-3xl p-6 sm:p-9 border border-[#EF9CA7]/30 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EF9CA7]/30 mb-8">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#c85f72] block mb-1">
                Day-by-Day Timeline
              </span>
              <h2 className="font-cormorant text-3xl sm:text-4xl font-normal text-[#3a1a22]">
                Your Itinerary
              </h2>
              <p className="text-xs sm:text-sm text-[#3a1a22]/70 mt-1">
                Customized route for <span className="font-medium text-[#3a1a22]">{currentTrip.destination}</span> with live timing, estimated costs, and operator status.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => {
                  setIsGeneratingAI(true);
                  setTimeout(() => {
                    setIsGeneratingAI(false);
                    setAiSuccessMessage(true);
                    setItinerary((prev) => [
                      ...prev,
                      {
                        id: `it-ai-${Date.now()}`,
                        day: 3,
                        time: '04:30 PM',
                        activity: 'Sunset Cliffside Photography & Coastal Drink',
                        location: 'Vagator Chapora Fort Panorama',
                        category: 'activity',
                        cost: 1800,
                        travelTime: '15 mins',
                        status: 'Confirmed',
                      },
                    ]);
                    setTimeout(() => setAiSuccessMessage(false), 3500);
                  }, 1000);
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#c85f72] to-[#3a1a22] hover:from-[#3a1a22] hover:to-[#c85f72] text-white text-xs font-semibold tracking-wider uppercase transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#FFDDE1]" />
                <span>OPTIMIZE WITH AI</span>
              </button>

              <button
                onClick={handleAddActivityPrompt}
                className="px-4 py-2 rounded-xl bg-[#FFF5F6] hover:bg-[#FFDDE1] border border-[#EF9CA7]/50 text-[#3a1a22] text-xs font-semibold tracking-wider uppercase transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-[#c85f72]" />
                <span>ADD ACTIVITY</span>
              </button>

              <button
                onClick={() => setEditModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-white hover:bg-[#FFDDE1]/40 border border-[#EF9CA7]/50 text-[#3a1a22] text-xs font-semibold tracking-wider uppercase transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5 text-[#c85f72]" />
                <span>EDIT ITINERARY</span>
              </button>

              <button
                onClick={() => setChangeRequestModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-white hover:bg-[#FFDDE1]/40 border border-[#EF9CA7]/60 text-[#c85f72] text-xs font-semibold tracking-wider uppercase transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Send className="w-3.5 h-3.5 text-[#c85f72]" />
                <span>REQUEST CHANGE</span>
              </button>
            </div>
          </div>

          {/* AI Success Toast if triggered */}
          {aiSuccessMessage && (
            <div className="mb-6 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between animate-fadeIn">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>TripForge AI optimized your transit routes and synced a sunset experience with Day 3!</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-700 font-semibold">Saved 35 mins transit</span>
            </div>
          )}

          {/* Day-by-Day Selector Tabs */}
          <div className="mb-6 flex flex-wrap items-center gap-2 pb-2 overflow-x-auto">
            <button
              onClick={() => setItineraryDayFilter('All')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                itineraryDayFilter === 'All'
                  ? 'bg-[#c85f72] text-white font-semibold shadow-xs'
                  : 'bg-[#FCF8F9] hover:bg-[#FFDDE1]/40 text-[#3a1a22]/80 border border-[#EF9CA7]/30'
              }`}
            >
              All Days ({itinerary.length})
            </button>
            {Array.from({ length: totalTripDays }, (_, index) => {
  const day = index + 1;

  const dayNames = [
    'Arrival',
    'Beach & Food',
    'Culture & Sightseeing',
    'Adventure & Lagoon',
    'Relaxation & Departure',
  ];

  return {
    day,
    title: `Day ${String(day).padStart(2, '0')} · ${
      dayNames[index] || 'Explore & Discover'
    }`,
  };
}).map((tab) => (
              <button
                key={tab.day}
                onClick={() => setItineraryDayFilter(tab.day)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  itineraryDayFilter === tab.day
                    ? 'bg-[#c85f72] text-white font-semibold shadow-xs'
                    : 'bg-[#FCF8F9] hover:bg-[#FFDDE1]/40 text-[#3a1a22]/80 border border-[#EF9CA7]/30'
                }`}
              >
                {tab.title}
              </button>
            ))}
          </div>

          {/* Day-by-Day Cards */}
          <div className="space-y-4">
            {itinerary
              .filter((item) => (itineraryDayFilter === 'All' ? true : item.day === itineraryDayFilter))
              .map((item) => (
              <div
                key={item.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  item.status === 'Rerouted'
                    ? 'bg-amber-50/70 border-amber-300'
                    : 'bg-[#FCF8F9] hover:bg-[#FFF5F6] border-[#EF9CA7]/30'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className="px-3 py-1.5 rounded-xl bg-[#FFDDE1] text-[#c85f72] font-mono text-xs font-bold shrink-0 text-center">
                    <div>DAY 0{item.day}</div>
                    <div className="text-[10px] font-normal text-[#3a1a22]/70">{item.time}</div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-cormorant text-xl font-medium text-[#3a1a22]">
                        {item.activity}
                      </h4>
                      {item.status === 'Rerouted' && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[9px] font-bold uppercase tracking-wider">
                          AI Rerouted
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-[#3a1a22]/70 flex items-center gap-2 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-[#c85f72]" />
                      <span>{item.location}</span>
                      <span className="text-white/40">•</span>
                      <span>Transit: {item.travelTime}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#EF9CA7]/20">
                  <div className="text-right">
                    <span className="text-[10px] text-[#3a1a22]/50 uppercase tracking-wider block">Estimated Cost</span>
                    <span className="font-mono text-sm font-bold text-[#c85f72]">
                      ₹{item.cost.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setEditModalOpen(true)}
                      className="p-1.5 rounded-lg text-[#3a1a22]/60 hover:text-[#c85f72] hover:bg-[#FFDDE1]/40 transition-colors cursor-pointer"
                      title="Edit Activity"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleRemoveItineraryItem(item.id)}
                      className="p-1.5 rounded-lg text-[#3a1a22]/40 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Remove from Itinerary"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-5 border-t border-[#EF9CA7]/20 flex flex-wrap items-center justify-between gap-4">
            <span className="text-xs text-[#3a1a22]/60">
              {itinerary.length} scheduled itinerary experiences synced with lead operator.
            </span>

            <button
              onClick={() => scrollToSection('budget-section')}
              className="text-xs font-semibold text-[#c85f72] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View Total Budget Breakdown</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 6: TRIP BUDGET TRACKER                                            */}
      {/* ========================================================================= */}
      <section id="budget-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="bg-white rounded-3xl p-6 sm:p-9 border border-[#EF9CA7]/30 shadow-lg">
          <div className="flex items-center justify-between pb-6 border-b border-[#EF9CA7]/30 mb-8">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#c85f72] block">
                Financial Architecture
              </span>
              <h2 className="font-cormorant text-3xl sm:text-4xl font-normal text-[#3a1a22]">
                Your Trip Budget
              </h2>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-[#3a1a22]/50 uppercase tracking-wider block">Target Ceiling</span>
              <span className="font-mono text-xl sm:text-2xl font-bold text-[#3a1a22]">
                ₹{currentTrip.totalBudget.toLocaleString()}
              </span>
            </div>
          </div>

          {/* 3 Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="p-5 rounded-2xl bg-[#FCF8F9] border border-[#EF9CA7]/30">
              <span className="text-xs uppercase font-semibold text-[#3a1a22]/60">
                Total Budget
              </span>
              <div className="font-mono text-2xl font-bold text-[#3a1a22] mt-1">
                ₹{currentTrip.totalBudget.toLocaleString()}
              </div>
              <div className="text-[11px] text-[#3a1a22]/50 mt-1">Allocated for 2 travelers</div>
            </div>

            <div className="p-5 rounded-2xl bg-[#FFF5F6] border border-[#EF9CA7]/50 shadow-xs">
              <span className="text-xs uppercase font-semibold text-[#c85f72]">
                Estimated Cost
              </span>
              <div className="font-mono text-2xl font-bold text-[#c85f72] mt-1">
                ₹{estimatedCost.toLocaleString()}
              </div>
              <div className="text-[11px] text-[#c85f72]/80 mt-1">
                {Math.min(
  100,
  Math.max(0, Math.round((estimatedCost / currentTrip.totalBudget) * 100))
)}% of budget utilized
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200">
              <span className="text-xs uppercase font-semibold text-emerald-800">
                Remaining Balance
              </span>
              <div className="font-mono text-2xl font-bold text-emerald-800 mt-1">
                {Math.max(0, remainingBudget).toLocaleString()}
              </div>
              <div className="text-[11px] text-emerald-700/80 mt-1">Buffer for on-trip dining & shopping</div>
            </div>
          </div>

          {/* Visual Progress Bar of Utilization */}
          <div className="space-y-2 mb-8">
            <div className="flex justify-between text-xs text-[#3a1a22]/75 font-mono">
              <span>Cost Allocation Breakdown</span>
              <span>₹{estimatedCost.toLocaleString()} / ₹{currentTrip.totalBudget.toLocaleString()}</span>
            </div>
            <div className="w-full h-3.5 rounded-full bg-[#FFDDE1]/60 overflow-hidden flex shadow-inner">
              <div
                style={{ width: `${Math.min(100, (categoryBreakdown.flight / currentTrip.totalBudget) * 100)}%` }}
                className="bg-[#EF9CA7] h-full transition-all duration-700 ease-out"
                title="Flights"
              />
              <div
                style={{ width: `${Math.min(100, (categoryBreakdown.hotel / currentTrip.totalBudget) * 100)}%` }}
                className="bg-[#c85f72] h-full transition-all duration-700 ease-out"
                title="Hotels"
              />
              <div
                style={{ width: `${Math.min(100, (categoryBreakdown.activity / currentTrip.totalBudget) * 100)}%` }}
                className="bg-[#522430] h-full transition-all duration-700 ease-out"
                title="Activities"
              />
              <div
                style={{ width: `${Math.min(100, (categoryBreakdown.transport / currentTrip.totalBudget) * 100)}%` }}
                className="bg-amber-400 h-full transition-all duration-700 ease-out"
                title="Transport"
              />
            </div>
          </div>
                    {/* Day-wise Budget Breakdown */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs uppercase font-semibold text-[#3a1a22]/60">
                  Day-wise Budget
                </span>
                <p className="text-[11px] text-[#3a1a22]/50 mt-1">
                  Planned spending compared with your daily budget
                </p>
              </div>

              <div className="font-mono text-xs font-semibold text-[#c85f72]">
                ₹{dailyBudget.toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })} / day
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {Array.from({ length: totalTripDays }, (_, index) => {
                const day = index + 1;
                const stats = getDayStats(day);

                return (
                  <div
                    key={day}
                    className="p-4 rounded-2xl bg-[#FCF8F9] border border-[#EF9CA7]/30"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-[#3a1a22]">
                        Day {day}
                      </span>

                      {stats.dayOverBudget > 0 ? (
                        <span className="text-[9px] font-bold uppercase text-rose-600">
                          Over budget
                        </span>
                      ) : (
                        <span className="text-[9px] font-bold uppercase text-emerald-700">
                          Within budget
                        </span>
                      )}
                    </div>

                    <div className="text-[10px] text-[#3a1a22]/50 uppercase tracking-wider">
                      Planned
                    </div>

                    <div className="font-mono text-lg font-bold text-[#c85f72]">
                      ₹{stats.plannedCost.toLocaleString()}
                    </div>

                    <div className="mt-2 h-2 rounded-full bg-[#FFDDE1]/60 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          stats.dayOverBudget > 0
                            ? 'bg-rose-500'
                            : 'bg-[#c85f72]'
                        }`}
                        style={{
                          width: `${Math.min(
                            100,
                            dailyBudget > 0
                              ? (stats.plannedCost / dailyBudget) * 100
                              : 0
                          )}%`,
                        }}
                      />
                    </div>

                    <div className="mt-2 text-[10px]">
                      {stats.dayOverBudget > 0 ? (
                        <span className="text-rose-600">
                          ₹{stats.dayOverBudget.toLocaleString()} over
                        </span>
                      ) : (
                        <span className="text-emerald-700">
                          ₹{stats.dayRemaining.toLocaleString()} remaining
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Category Breakdown Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-[#FCF8F9] border border-[#EF9CA7]/25 flex flex-col justify-between card-hover-physics">
              <div className="flex items-center gap-1.5 text-[#3a1a22]/70 font-semibold mb-1">
                <Plane className="w-4 h-4 text-[#EF9CA7]" />
                <span>Flights</span>
              </div>
              <div className="font-mono text-base font-bold text-[#3a1a22]">
                ₹{categoryBreakdown.flight.toLocaleString()}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FCF8F9] border border-[#EF9CA7]/25 flex flex-col justify-between card-hover-physics">
              <div className="flex items-center gap-1.5 text-[#3a1a22]/70 font-semibold mb-1">
                <Bed className="w-4 h-4 text-[#c85f72]" />
                <span>Hotels</span>
              </div>
              <div className="font-mono text-base font-bold text-[#3a1a22]">
                ₹{categoryBreakdown.hotel.toLocaleString()}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FCF8F9] border border-[#EF9CA7]/25 flex flex-col justify-between card-hover-physics">
              <div className="flex items-center gap-1.5 text-[#3a1a22]/70 font-semibold mb-1">
                <Camera className="w-4 h-4 text-[#522430]" />
                <span>Activities</span>
              </div>
              <div className="font-mono text-base font-bold text-[#3a1a22]">
                ₹{categoryBreakdown.activity.toLocaleString()}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FCF8F9] border border-[#EF9CA7]/25 flex flex-col justify-between card-hover-physics">
              <div className="flex items-center gap-1.5 text-[#3a1a22]/70 font-semibold mb-1">
                <Car className="w-4 h-4 text-amber-500" />
                <span>Transport</span>
              </div>
              <div className="font-mono text-base font-bold text-[#3a1a22]">
                ₹{categoryBreakdown.transport.toLocaleString()}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex flex-col justify-between col-span-2 sm:col-span-1 card-hover-physics">
              <div className="flex items-center gap-1.5 text-emerald-800 font-semibold mb-1">
                <Wallet className="w-4 h-4 text-emerald-600" />
                <span>Other / Reserve</span>
              </div>
              <div className="font-mono text-base font-bold text-emerald-800">
                ₹{remainingBudget > 0 ? remainingBudget.toLocaleString() : '0'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 7: EXPERIENCES FOR YOUR TRIP                                      */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#c85f72] block">
              Curated Add-ons
            </span>
            <h2 className="font-cormorant text-3xl sm:text-4xl font-normal text-[#3a1a22]">
              Experiences for Your Trip
            </h2>
            <p className="text-xs sm:text-sm text-[#3a1a22]/70 mt-1">
              Add verified local experiences directly to your custom itinerary. Trip cost automatically recalculates.
            </p>
          </div>

          {/* Category Filter Chips */}
          <div className="flex flex-wrap gap-1.5 self-start sm:self-auto">
            {['All', 'Food Tours', 'Adventure', 'Culture', 'Nature', 'Shopping', 'Nightlife'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setExperienceCategoryFilter(cat)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  experienceCategoryFilter === cat
                    ? 'bg-[#c85f72] text-white font-semibold shadow-xs'
                    : 'bg-white border border-[#EF9CA7]/40 text-[#3a1a22]/80 hover:bg-[#FFDDE1]/40'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {EXPERIENCES_CATALOG.filter((exp) =>
            experienceCategoryFilter === 'All' ? true : exp.category === experienceCategoryFilter
          ).map((exp) => (
            <div
              key={exp.id}
              className="group rounded-3xl bg-white border border-[#EF9CA7]/30 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 w-full bg-[#FFDDE1]/40 overflow-hidden">
                  <img
                    src={exp.image}
                    alt={exp.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-[#3a1a22]/85 md text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full">
                    {exp.category}
                  </div>
                  <div className="absolute bottom-3 right-3 bg-white md text-[#3a1a22] text-[10px] font-medium px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#c85f72]" />
                    <span>{exp.duration}</span>
                  </div>
                </div>

                <div className="p-5">
                  <div className="text-[11px] text-[#c85f72] font-semibold tracking-wider uppercase mb-1">
                    {exp.location}
                  </div>
                  <h4 className="font-cormorant text-xl font-medium text-[#3a1a22] leading-snug">
                    {exp.title}
                  </h4>
                  <p className="text-xs text-[#3a1a22]/70 mt-2 line-clamp-2 leading-relaxed">
                    {exp.description}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <div className="pt-3 border-t border-[#EF9CA7]/20 flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1 text-xs font-semibold text-[#3a1a22]">
                    <Star className="w-3.5 h-3.5 fill-[#c85f72] text-[#c85f72]" />
                    <span>{exp.rating}</span>
                  </div>
                  <div className="font-mono text-sm font-bold text-[#c85f72]">
                    ₹{exp.cost.toLocaleString()}
                  </div>
                </div>

                <button
                  onClick={() => handleAddExperience(exp)}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#c85f72] hover:bg-[#3a1a22] text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add to Trip</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 8: TRIPFORGE AI                                                   */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="rounded-3xl bg-gradient-to-r from-[#3a1a22] via-[#522430] to-[#3a1a22] p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-80 h-80 rounded-full bg-[#EF9CA7]/15 blur-3xl pointer-events-none" />

          <div className="max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-white/20 text-[#FFDDE1] text-xs font-semibold tracking-wider uppercase mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#EF9CA7]" />
              <span>TripForge AI Engine</span>
            </div>
            <h2 className="font-cormorant text-3xl sm:text-5xl font-light text-white leading-tight">
              Let TripForge shape your journey
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-white/80 leading-relaxed">
              Tell us what you want from your trip and TripForge can build and optimize your itinerary. Fully prepared for Gemini multimodal integration.
            </p>

            <div className="mt-6">
              <div className="relative">
                <input
                  type="text"
                  value={aiCustomPrompt}
                  onChange={(e) => setAiCustomPrompt(e.target.value)}
                  placeholder="e.g. Add romantic sunset dinner and optimize morning transit..."
                  className="w-full pl-4 pr-32 py-3.5 rounded-2xl bg-white border border-white/20 text-xs sm:text-sm text-white placeholder-white/50 focus:outline-none focus:border-[#EF9CA7] md"
                />
                <button
                  onClick={handleGenerateAIItinerary}
                  disabled={isGeneratingAI}
                  className="absolute right-2 top-2 px-4 py-2 rounded-xl bg-[#c85f72] hover:bg-[#EF9CA7] hover:text-[#3a1a22] text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  {isGeneratingAI ? 'Thinking...' : 'GENERATE'}
                </button>
              </div>

              {aiSuccessMessage && (
                <div className="mt-3 p-3 rounded-xl bg-white border border-emerald-400/50 text-xs text-emerald-200 flex items-center gap-2 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>AI Itinerary Generated & Synced with Day 02! Check your itinerary above.</span>
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={handleGenerateAIItinerary}
                disabled={isGeneratingAI}
                className="px-6 py-2.5 rounded-xl bg-white text-[#3a1a22] hover:bg-[#FFDDE1] text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#c85f72]" />
                <span>GENERATE ITINERARY</span>
              </button>

              <button
                onClick={() => {
                  setItinerary((prev) => [...prev].reverse());
                  alert('TripForge AI re-sequenced itinerary to optimize for light, golden hours, and traffic.');
                }}
                className="px-6 py-2.5 rounded-xl bg-white border border-white  text-white hover:bg-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
              >
                OPTIMIZE MY TRIP
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 9: OPERATOR REQUEST STATUS (Two-Sided Platform Timeline)           */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="bg-white rounded-3xl p-6 sm:p-9 border border-[#EF9CA7]/30 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EF9CA7]/30 mb-8">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#c85f72] block mb-1">
                Two-Sided Platform Coordination
              </span>
              <h2 className="font-cormorant text-3xl sm:text-4xl font-normal text-[#3a1a22]">
                Trip Request
              </h2>
              <p className="text-xs sm:text-sm text-[#3a1a22]/70 mt-1">
                Assigned Operator: <span className="font-semibold text-[#3a1a22]">{currentTrip.operatorName}</span> ({currentTrip.operatorId})
              </p>
            </div>

            <div className="flex items-center gap-2">
              {operatorStep === 3 && (
                <button
                  onClick={handleSendToOperator}
                  disabled={isSendingOperator}
                  className="px-5 py-2.5 rounded-xl bg-[#c85f72] hover:bg-[#3a1a22] text-white text-xs font-semibold uppercase tracking-wider cursor-pointer transition-colors shadow-xs flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSendingOperator ? 'Transmitting...' : 'Send Request to Operator'}</span>
                </button>
              )}

              {operatorStep === 4 && (
                <button
                  onClick={handleApproveByOperatorDemo}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold uppercase tracking-wider cursor-pointer transition-colors shadow-xs flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Simulate Operator Approval</span>
                </button>
              )}
            </div>
          </div>

          {/* Visual Timeline Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {operatorTimeline.map((step) => (
              <div
                key={step.num}
                className={`p-4 rounded-2xl border text-center transition-all ${
                  step.done
                    ? 'bg-[#FFF5F6] border-[#c85f72]/40 shadow-xs'
                    : 'bg-white border-[#EF9CA7]/20 opacity-45'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full mx-auto flex items-center justify-center text-xs font-bold mb-2 ${
                    step.done
                      ? 'bg-[#c85f72] text-white shadow-xs'
                      : 'bg-[#FFDDE1] text-[#3a1a22]/60'
                  }`}
                >
                  {step.done ? '✓' : step.num}
                </div>
                <div className="text-xs font-semibold text-[#3a1a22] leading-tight">
                  {step.label}
                </div>
                <div className="text-[10px] text-[#3a1a22]/60 mt-1">
                  {step.done ? 'Completed' : 'Pending'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 10: LIVE TRIP ENGINE                                              */}
      {/* ========================================================================= */}
      <LiveTripWidget
        trip={currentTrip}
        itinerary={itinerary}
        bookings={bookings}
      />
      {/* ========================================================================= */}
{/* SECTION 10.5: WEATHER-DRIVEN DIGITAL TWIN                                */}
{/* ========================================================================= */}


      {/* ========================================================================= */}
      {/* SECTION 11: AI DYNAMIC REROUTING ("AI Trip Assist")                       */}
      {/* ========================================================================= */}
      <AITripAssistWidget
        onAcceptReroute={(newActivity, location, cost) => {
          setRerouteAccepted(true);
          const reroutedItem: ItineraryItem = {
            id: `it-reroute-${Date.now()}`,
            day: 4,
            time: '05:45 PM',
            activity: newActivity,
            location: location,
            category: 'activity',
            cost: cost,
            travelTime: '15 mins',
            status: 'Rerouted',
          };
          setItinerary((prev) => [...prev, reroutedItem]);
        }}
        remainingBudget={remainingBudget}
      />

      {/* ========================================================================= */}
      {/* SECTION 12: BOOKINGS & SECURED VOUCHERS                                   */}
      {/* ========================================================================= */}
      <BookingsVault
        bookings={bookings}
        destination={currentTrip.destination}
        onOpenVoucher={() => setConfirmModalOpen(true)}
      />

      {/* ========================================================================= */}
      {/* SECTION 13: MY TRIPS PORTFOLIO                                            */}
      {/* ========================================================================= */}
      <MyTripsPortfolio
        currentTrip={currentTrip}
        otherTrips={OTHER_MY_TRIPS}
        onSelectTrip={(t) => setCurrentTrip(t)}
      />

      {/* ========================================================================= */}
      {/* DESTINATION INTELLIGENCE & READINESS CHECKLIST                             */}
      {/* ========================================================================= */}
      <TripPreparationWidget currentDestination={currentTrip.destination} />

      {/* ========================================================================= */}
      {/* PRIVILEGE PERKS & BESPOKE GUARANTEES                                      */}
      {/* ========================================================================= */}
      <PrivilegePerksBanner />

      {/* ========================================================================= */}
      {/* TRAVELER STORIES & COMMUNITY PROOF                                        */}
      {/* ========================================================================= */}
      <TravelerStoriesSection />

      {/* ========================================================================= */}
      {/* FOOTER                                                                    */}
      {/* ========================================================================= */}
      <footer className="mt-16 bg-[#3a1a22] text-[#FFDDE1] py-14 px-4 sm:px-6 lg:px-8 border-t border-[#EF9CA7]/20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <span className="font-cormorant text-3xl font-light tracking-[0.16em] text-white">
              TripForge
            </span>
            <p className="text-xs text-white/50 mt-1.5 max-w-sm leading-relaxed">
              The bespoke orchestration system connecting discerning travelers with elite certified operators.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-white/70">
            <button
              onClick={() => onNavigate('/')}
              className="hover:text-[#EF9CA7] transition-colors cursor-pointer"
            >
              Landing Page
            </button>
            <button
              onClick={() => onNavigate('/signin')}
              className="hover:text-[#EF9CA7] transition-colors cursor-pointer"
            >
              Switch Role
            </button>
            <button
              onClick={() => onNavigate('/operator')}
              className="hover:text-[#EF9CA7] transition-colors cursor-pointer"
            >
              Tour Operator Console
            </button>
            <button
              onClick={() => setWizardOpen(true)}
              className="hover:text-[#EF9CA7] transition-colors cursor-pointer"
            >
              Make My Trip Wizard
            </button>
          </div>

          <div className="text-[11px] text-white/40 tracking-wider">
            © 2026 TripForge Technologies. All rights reserved.
          </div>
        </div>
      </footer>
      </div>

      {/* ========================================================================= */}
      {/* MODALS                                                                    */}
      {/* ========================================================================= */}

      {/* 1. Make My Trip Wizard */}
      <MakeMyTripWizard
        isOpen={wizardOpen}
        onClose={() => setWizardOpen(false)}
        initialDestination={wizardPreselectDest}
        onTripGenerated={handleTripGenerated}
      />

      {/* 2. Edit Trip Modal */}
      <EditTripModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        trip={currentTrip}
        onUpdateTrip={(updated) => {
          setCurrentTrip((prev) => ({ ...prev, ...updated }));
        }}
      />

      {/* 3. Category Booking Inventory Modal */}
      <CategoryBookingModal
        isOpen={bookingCategory !== null}
        category={bookingCategory}
        onClose={() => setBookingCategory(null)}
        existingItemIds={bookings.map((b) => b.id)}
        onAddItem={(item) => {
          setBookings((prev) => [...prev, item]);
          setBookingCategory(null);
        }}
      />

      {/* 4. Booking Confirmation Modal */}
      <BookingConfirmationModal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        trip={currentTrip}
        bookedItems={bookings}
        totalCost={estimatedCost}
      />

      {/* 5. Profile Modal */}
      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        activeTrip={currentTrip}
      />

      {/* 6. Settings Modal */}
      <SettingsModal
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
      />

      {/* 7. Change Request Modal */}
      <ChangeRequestModal
        isOpen={changeRequestModalOpen}
        onClose={() => setChangeRequestModalOpen(false)}
        tripDestination={currentTrip.destination}
        onSubmit={handleSubmitChangeRequest}
      />
    <TripForgeChatbot />
    </div>
  );
};
