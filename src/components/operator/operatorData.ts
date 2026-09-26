export interface TourRequest {
  id: string;
  travelerName: string;
  travelerEmail: string;
  travelerPhone: string;
  avatar: string;
  origin: string;
  destination: string;
  startDate: string;
  endDate: string;
  duration: string;
  travelersCount: number;
  partyType: string;
  budget: number;
  currency: string;
  accommodationPref: string;
  transportPref: string;
  interests: string[];
  status: 'Pending Review' | 'Approved' | 'Changes Requested' | 'Rejected';
  createdTime: string;
  urgency: 'High' | 'Normal';
  specialRequests: string;
  aiRecommendation: string;
  operationalNotes: string;
  marginEstimate: number; // in percentage e.g. 16.5
  vendorCostEstimate: number;
}

export interface ActiveTour {
  id: string;
  travelerName: string;
  destination: string;
  currentDay: number;
  totalDays: number;
  currentStop: string;
  nextTransit: string;
  coordinatorName: string;
  coordinatorPhone: string;
  chauffeurName: string;
  chauffeurPlate: string;
  status: 'On Schedule' | 'Disruption Alert' | 'Transit in Progress' | 'VIP Attention';
  completionProgress: number;
  hotelName: string;
  roomType: string;
  emergencyContact: string;
  recentActivity: string;
}

export interface ItineraryItemOp {
  id: string;
  day: number;
  time: string;
  activity: string;
  location: string;
  category: 'flight' | 'hotel' | 'activity' | 'transport' | 'dining';
  vendorName: string;
  vendorCost: number;
  clientCharge: number;
  status: 'Confirmed' | 'Pending Dispatch' | 'Requires Attention' | 'AI Suggested';
  travelTime: string;
  notes?: string;
  dependencyIds?: string[];
}

export interface Vendor {
  id: string;
  name: string;
  category: 'Accommodations' | 'Chauffeur & Fleet' | 'Activity Provider' | 'Dining & Experiences';
  location: string;
  contactPerson: string;
  phone: string;
  email: string;
  slaScore: number; // e.g. 99.2
  onTimeRate: string;
  activeContracts: number;
  status: 'Preferred Partner' | 'Standard' | 'Action Required';
  ratesAgreed: string;
  lastFulfilled: string;
}

export interface BookingLedgerItem {
  id: string;
  bookingCode: string;
  serviceType: 'Lodging' | 'Chauffeur' | 'Experience' | 'Dining' | 'Private Charter';
  vendorName: string;
  travelerName: string;
  tripId: string;
  date: string;
  costToOperator: number;
  billedToClient: number;
  margin: number;
  status: 'Voucher Issued' | 'Confirmed' | 'Pending Confirmation' | 'Cancelled';
  voucherCode: string;
}

export interface DisruptionEvent {
  id: string;
  title: string;
  severity: 'Critical' | 'Warning' | 'Advisory';
  location: string;
  affectedDay: string;
  affectedTours: string[];
  affectedTravelers: string[];
  disruptionSummary: string;
  sourceAuthority: string;
  originalPlan: {
    activity: string;
    vendor: string;
    timing: string;
    cost: number;
    impactReason: string;
  };
  aiSuggestedPlan: {
    activity: string;
    vendor: string;
    timing: string;
    cost: number;
    costDelta: number;
    timeDelta: string;
    feasibilityScore: number;
    description: string;
    marginImpact: string;
  };
  status: 'Active Alert' | 'AI Solution Ready' | 'Resolved & Pushed';
}

export interface FieldCoordinator {
  id: string;
  name: string;
  region: string;
  phone: string;
  assignedTour: string;
  currentStatus: 'On Ground' | 'En Route' | 'Standby' | 'Emergency Duty';
  liveLocation: string;
  currentTask: string;
  rating: number;
  tripsCompleted: number;
}

export interface CalendarEvent {
  id: string;
  tripId: string;
  travelerName: string;
  title: string;
  dayLabel: string;
  timeSlot: string;
  category: 'checkin' | 'checkout' | 'transit' | 'activity' | 'vip';
  location: string;
  status: 'Scheduled' | 'In Progress' | 'Completed';
}

export const INITIAL_OPERATOR_REQUESTS: TourRequest[] = [
  {
    id: 'REQ-GOA-8841',
    travelerName: 'Clara Voyager',
    travelerEmail: 'clara.voyager@example.com',
    travelerPhone: '+91 98201 44521',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    origin: 'Mumbai (BOM)',
    destination: 'Goa (GOI/MOPA)',
    startDate: '12 Oct, 2026',
    endDate: '17 Oct, 2026',
    duration: '5 Days · 4 Nights',
    travelersCount: 2,
    partyType: 'Couple (Bespoke Luxury)',
    budget: 50000,
    currency: 'INR',
    accommodationPref: 'Azora Heritage Sea Villa (Anjuna)',
    transportPref: 'Dedicated Chauffeur (Sedan Prime)',
    interests: ['Heritage Quarters', 'Coastal Sundowners', 'Culinary Tasting Atelier', 'Private Catamaran'],
    status: 'Pending Review',
    createdTime: '18 minutes ago',
    urgency: 'High',
    specialRequests: 'Prefers oceanfront view, hypoallergenic pillows, quiet transfer from MOPA airport, anniversary floral welcome.',
    aiRecommendation: 'Recommend upgrading to EV Premium Chauffeur for ₹600 lower carbon footprint. Reserve Latin Quarter private dining 4 days in advance to guarantee courtyard veranda.',
    operationalNotes: 'MOPA Airport terminal fast-track pre-cleared. Driver Tariq (Plate GA-03-QA-8812) assigned on standby.',
    marginEstimate: 16.4,
    vendorCostEstimate: 41800,
  },
  {
    id: 'REQ-RAJ-9210',
    travelerName: 'Rohan & Sunita Sharma',
    travelerEmail: 'rohan.sharma@domain.in',
    travelerPhone: '+91 98110 77340',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    origin: 'Delhi (DEL)',
    destination: 'Jaipur → Udaipur Royal Circuit',
    startDate: '20 Oct, 2026',
    endDate: '26 Oct, 2026',
    duration: '7 Days · 6 Nights',
    travelersCount: 4,
    partyType: 'Family (Multi-generational)',
    budget: 145000,
    currency: 'INR',
    accommodationPref: 'Heritage Palace Suites (Rambagh & Lake Palace)',
    transportPref: 'Luxury Innova Crysta with English-speaking Guide',
    interests: ['Fort Archeology', 'Block Print Workshop', 'Lake Pichola Sunset Boat', 'Royal Dining'],
    status: 'Pending Review',
    createdTime: '1 hour ago',
    urgency: 'Normal',
    specialRequests: 'Ground floor suites required for senior family members; mild spice preference for all meals.',
    aiRecommendation: 'High festive demand in Udaipur. Pre-lock Lake Pichola private jetty by 14:00 to avoid cruise queue.',
    operationalNotes: 'Guide Vikram Rathore (License RJ-Guide-441) confirmed for 4 days.',
    marginEstimate: 18.2,
    vendorCostEstimate: 118600,
  },
  {
    id: 'REQ-KER-3319',
    travelerName: 'Marcus & Elena Vance',
    travelerEmail: 'm.vance@pacifictravel.org',
    travelerPhone: '+44 7911 123456',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    origin: 'London via Kochi (COK)',
    destination: 'Kochi → Alleppey → Munnar',
    startDate: '01 Nov, 2026',
    endDate: '07 Nov, 2026',
    duration: '7 Days · 6 Nights',
    travelersCount: 2,
    partyType: 'Couple (Wellness & Nature)',
    budget: 92000,
    currency: 'INR',
    accommodationPref: 'Private Eco-Houseboat & Tea Plantation Bungalow',
    transportPref: 'Chauffeur Driven Electric SUV',
    interests: ['Ayurvedic Rejuvenation', 'Spice Plantations', 'Kathakali Performance', 'Tea Tasting'],
    status: 'Approved',
    createdTime: '3 hours ago',
    urgency: 'Normal',
    specialRequests: 'Certified organic meals on houseboat; herbal oil consultations on Day 3.',
    aiRecommendation: 'Recommend scheduling tea-picking morning masterclass at 07:30 AM before mist burns off for best photography.',
    operationalNotes: 'Eco-Houseboat "Kumarakom Pearl" locked. Capt. Shaji on duty.',
    marginEstimate: 17.5,
    vendorCostEstimate: 75900,
  },
];

export const INITIAL_ACTIVE_TOURS: ActiveTour[] = [
  {
    id: 'ACT-GOA-108',
    travelerName: 'Clara Voyager (Party of 2)',
    destination: 'North & South Goa Expedition',
    currentDay: 2,
    totalDays: 5,
    currentStop: 'Historic Fontainhas Latin Quarter Walking Tour',
    nextTransit: 'Private Goan-Portuguese Tasting Luncheon (13:00)',
    coordinatorName: 'Tariq Khan (Field Head)',
    coordinatorPhone: '+91 98221 00981',
    chauffeurName: 'Tariq Chauffeur Services (QA-8812)',
    chauffeurPlate: 'GA-03-QA-8812',
    status: 'On Schedule',
    completionProgress: 40,
    hotelName: 'Azora Heritage Sea Villa (Anjuna)',
    roomType: 'Suite 204 (Oceanfront)',
    emergencyContact: '+91 832 245 9900 (Operator Hotline)',
    recentActivity: 'Traveler checked in on schedule; verified concierge cocktail basket delivered.',
  },
  {
    id: 'ACT-RAJ-204',
    travelerName: 'Dev & Natasha Singhania',
    destination: 'Jaipur Amber Fort & Heritage Havelis',
    currentDay: 4,
    totalDays: 6,
    currentStop: 'City Palace Private Armory Tour',
    nextTransit: 'Chokhi Dhani Cultural Dinner Transfer (18:30)',
    coordinatorName: 'Vikram Rathore',
    coordinatorPhone: '+91 94140 55122',
    chauffeurName: 'Mahesh Sharma',
    chauffeurPlate: 'RJ-14-TC-0919',
    status: 'On Schedule',
    completionProgress: 66,
    hotelName: 'The Oberoi Rajvilas',
    roomType: 'Luxury Tent Suite',
    emergencyContact: '+91 141 268 0101',
    recentActivity: 'Amber Fort fast-track completed without delay. 5-star traveler feedback.',
  },
  {
    id: 'ACT-HIM-310',
    travelerName: 'Priya Mehta & Friends (4 Pax)',
    destination: 'Manali & Solang Valley Adventure',
    currentDay: 1,
    totalDays: 4,
    currentStop: 'En route to Old Manali Pine Chalet',
    nextTransit: 'Check-in & Acclimatization Briefing (16:00)',
    coordinatorName: 'Kalyan Negi',
    coordinatorPhone: '+91 98055 44310',
    chauffeurName: 'Suraj Verma (4x4 Expedition)',
    chauffeurPlate: 'HP-01-EA-4122',
    status: 'Transit in Progress',
    completionProgress: 25,
    hotelName: 'The Himalayan Pine Chalet',
    roomType: 'Duplex Cedar Villa',
    emergencyContact: '+91 1902 252 110',
    recentActivity: 'Departed Chandigarh Airport on time; snow tire chains checked and verified.',
  },
];

export const INITIAL_ITINERARY_ITEMS_OP: ItineraryItemOp[] = [
  {
    id: 'op-it-1',
    day: 1,
    time: '11:30 AM',
    activity: 'Flight Arrival & VIP Chauffeur Transfer',
    location: 'Goa MOPA Airport → Azora Heritage Villa',
    category: 'transport',
    vendorName: 'Goa Premium Fleet Services',
    vendorCost: 1900,
    clientCharge: 2500,
    status: 'Confirmed',
    travelTime: '45 mins',
    notes: 'Driver holds branded TripForge tablet with traveler surname.',
  },
  {
    id: 'op-it-2',
    day: 1,
    time: '02:00 PM',
    activity: 'Check-in & Heritage Welcome Champagne',
    location: 'Azora Heritage Sea Villa (Anjuna)',
    category: 'hotel',
    vendorName: 'Azora Hospitality Group',
    vendorCost: 12500,
    clientCharge: 15500,
    status: 'Confirmed',
    travelTime: '0 mins',
    notes: 'Oceanfront Suite locked. Early check-in requested.',
  },
  {
    id: 'op-it-3',
    day: 1,
    time: '05:30 PM',
    activity: 'Anjuna Beach Sunset Promenade & Sundowners',
    location: 'North Anjuna Coastline',
    category: 'activity',
    vendorName: 'Coastal Leisure Partners',
    vendorCost: 800,
    clientCharge: 1200,
    status: 'Confirmed',
    travelTime: '15 mins',
  },
  {
    id: 'op-it-4',
    day: 2,
    time: '09:00 AM',
    activity: 'Historic Fontainhas Latin Quarter Walking Tour',
    location: 'Panaji Heritage Zone',
    category: 'activity',
    vendorName: 'Goa Heritage Walks Guild',
    vendorCost: 2600,
    clientCharge: 3500,
    status: 'Confirmed',
    travelTime: '30 mins',
    notes: 'Curator Maria Fernandes assigned as historian guide.',
  },
  {
    id: 'op-it-5',
    day: 2,
    time: '01:00 PM',
    activity: 'Private Goan-Portuguese Tasting Luncheon',
    location: 'Viva Panjim Heritage Atelier',
    category: 'dining',
    vendorName: 'Viva Panjim Culinary Ltd',
    vendorCost: 3600,
    clientCharge: 4800,
    status: 'Confirmed',
    travelTime: '5 mins',
    notes: 'Veranda table booked; seafood allergy verified.',
  },
  {
    id: 'op-it-6',
    day: 3,
    time: '10:00 AM',
    activity: 'Tropical Organic Spice Plantation Safari & Lunch',
    location: 'Sahakari Spice Farm, Ponda',
    category: 'activity',
    vendorName: 'Sahakari Heritage Agri-Tourism',
    vendorCost: 3200,
    clientCharge: 4200,
    status: 'Confirmed',
    travelTime: '45 mins',
  },
  {
    id: 'op-it-7',
    day: 4,
    time: '05:30 PM',
    activity: 'Mandovi River Sunset Catamaran Sail & Caviar',
    location: 'Panaji Port Jetty Marina',
    category: 'activity',
    vendorName: 'Goa Marine Yacht Club',
    vendorCost: 6500,
    clientCharge: 8500,
    status: 'Requires Attention',
    travelTime: '35 mins',
    notes: '⚠️ Monsoon swell advisory active. May require inland heritage reroute.',
  },
  {
    id: 'op-it-8',
    day: 5,
    time: '12:00 PM',
    activity: 'Villa Checkout & VIP Return Airport Chauffeur',
    location: 'Azora Heritage Villa → Goa MOPA Airport',
    category: 'transport',
    vendorName: 'Goa Premium Fleet Services',
    vendorCost: 1900,
    clientCharge: 2500,
    status: 'Confirmed',
    travelTime: '50 mins',
  },
];

export const INITIAL_VENDORS: Vendor[] = [
  {
    id: 'VND-HTL-01',
    name: 'Azora Heritage Hospitality',
    category: 'Accommodations',
    location: 'Anjuna & Candolim, North Goa',
    contactPerson: 'Leila D\'Souza (GM)',
    phone: '+91 832 227 8890',
    email: 'reservations@azoraheritage.com',
    slaScore: 99.4,
    onTimeRate: '99.8%',
    activeContracts: 6,
    status: 'Preferred Partner',
    ratesAgreed: 'Contract Rate Tier 1 (-22% B2B margin)',
    lastFulfilled: 'Today, 11:00 AM',
  },
  {
    id: 'VND-FLT-02',
    name: 'Goa Chauffeur & Elite Fleet',
    category: 'Chauffeur & Fleet',
    location: 'Panaji Hub & MOPA Depot',
    contactPerson: 'Tariq Chauffeur Ops',
    phone: '+91 98221 44501',
    email: 'ops@goaelitefleet.in',
    slaScore: 98.7,
    onTimeRate: '99.1%',
    activeContracts: 12,
    status: 'Preferred Partner',
    ratesAgreed: 'Fixed Daily Escort Rate (₹3,800/day uncapped)',
    lastFulfilled: '15 mins ago',
  },
  {
    id: 'VND-ACT-03',
    name: 'Goa Heritage Walks Guild',
    category: 'Activity Provider',
    location: 'Fontainhas, Panaji',
    contactPerson: 'Maria Fernandes',
    phone: '+91 98225 11902',
    email: 'tours@fontainhasheritage.org',
    slaScore: 99.8,
    onTimeRate: '100%',
    activeContracts: 4,
    status: 'Preferred Partner',
    ratesAgreed: 'VIP Private Group Rate ₹2,600 / tour',
    lastFulfilled: 'Today, 09:00 AM',
  },
  {
    id: 'VND-MAR-04',
    name: 'Goa Marine Yacht Club & Charters',
    category: 'Activity Provider',
    location: 'Mandovi Bay Marina, Panaji',
    contactPerson: 'Capt. Vivian Pinto',
    phone: '+91 98220 77109',
    email: 'charters@goamarineyachts.com',
    slaScore: 92.5,
    onTimeRate: '94.0%',
    activeContracts: 3,
    status: 'Action Required',
    ratesAgreed: 'Charter Net Rate ₹6,500 / 2h session',
    lastFulfilled: 'Yesterday (Pending Swell Clearance)',
  },
  {
    id: 'VND-CUL-05',
    name: 'Viva Panjim Heritage Atelier',
    category: 'Dining & Experiences',
    location: '31st January Road, Panaji',
    contactPerson: 'Chef Linda Mascarenhas',
    phone: '+91 832 242 2405',
    email: 'chef@vivapanjim.in',
    slaScore: 99.1,
    onTimeRate: '99.5%',
    activeContracts: 8,
    status: 'Preferred Partner',
    ratesAgreed: 'Fixed Set-Menu Atelier ₹1,800 / pax',
    lastFulfilled: 'Today, 01:00 PM',
  },
  {
    id: 'VND-HTL-06',
    name: 'The Oberoi Rajvilas',
    category: 'Accommodations',
    location: 'Goner Road, Jaipur',
    contactPerson: 'Raghavendra Singh (Director Sales)',
    phone: '+91 141 268 0101',
    email: 'reservations.rajvilas@oberoihotels.com',
    slaScore: 99.9,
    onTimeRate: '100%',
    activeContracts: 5,
    status: 'Preferred Partner',
    ratesAgreed: 'Wholesale B2B Palace Tier (-25%)',
    lastFulfilled: 'Yesterday, 14:00',
  },
];

export const INITIAL_BOOKINGS_LEDGER: BookingLedgerItem[] = [
  {
    id: 'BK-001',
    bookingCode: 'TF-BK-9912',
    serviceType: 'Lodging',
    vendorName: 'Azora Heritage Hospitality',
    travelerName: 'Clara Voyager',
    tripId: 'TF-GOA-2026',
    date: '12-17 Oct, 2026',
    costToOperator: 12500,
    billedToClient: 15500,
    margin: 3000,
    status: 'Voucher Issued',
    voucherCode: 'VCH-AZORA-9841',
  },
  {
    id: 'BK-002',
    bookingCode: 'TF-BK-9913',
    serviceType: 'Chauffeur',
    vendorName: 'Goa Chauffeur & Elite Fleet',
    travelerName: 'Clara Voyager',
    tripId: 'TF-GOA-2026',
    date: '12-17 Oct, 2026',
    costToOperator: 7600,
    billedToClient: 9500,
    margin: 1900,
    status: 'Voucher Issued',
    voucherCode: 'VCH-FLT-QA8812',
  },
  {
    id: 'BK-003',
    bookingCode: 'TF-BK-9914',
    serviceType: 'Experience',
    vendorName: 'Goa Heritage Walks Guild',
    travelerName: 'Clara Voyager',
    tripId: 'TF-GOA-2026',
    date: '13 Oct, 2026',
    costToOperator: 2600,
    billedToClient: 3500,
    margin: 900,
    status: 'Confirmed',
    voucherCode: 'VCH-WALK-FONT44',
  },
  {
    id: 'BK-004',
    bookingCode: 'TF-BK-9915',
    serviceType: 'Dining',
    vendorName: 'Viva Panjim Heritage Atelier',
    travelerName: 'Clara Voyager',
    tripId: 'TF-GOA-2026',
    date: '13 Oct, 2026',
    costToOperator: 3600,
    billedToClient: 4800,
    margin: 1200,
    status: 'Confirmed',
    voucherCode: 'VCH-DINE-VP102',
  },
  {
    id: 'BK-005',
    bookingCode: 'TF-BK-9916',
    serviceType: 'Private Charter',
    vendorName: 'Goa Marine Yacht Club',
    travelerName: 'Clara Voyager',
    tripId: 'TF-GOA-2026',
    date: '15 Oct, 2026',
    costToOperator: 6500,
    billedToClient: 8500,
    margin: 2000,
    status: 'Pending Confirmation',
    voucherCode: 'VCH-YCHT-MAN09',
  },
  {
    id: 'BK-006',
    bookingCode: 'TF-BK-9920',
    serviceType: 'Lodging',
    vendorName: 'The Oberoi Rajvilas',
    travelerName: 'Dev & Natasha Singhania',
    tripId: 'TF-RAJ-1092',
    date: '22-26 Oct, 2026',
    costToOperator: 42000,
    billedToClient: 52000,
    margin: 10000,
    status: 'Voucher Issued',
    voucherCode: 'VCH-OBR-RAJ77',
  },
];

export const INITIAL_DISRUPTIONS: DisruptionEvent[] = [
  {
    id: 'DISR-GOA-01',
    title: 'Monsoon High Swell Advisory in Mandovi Bay Marina',
    severity: 'Warning',
    location: 'Mandovi River / Panaji Port, Goa',
    affectedDay: 'Day 4 (15 Oct, 2026)',
    affectedTours: ['TF-GOA-2026 (Bespoke Coastal Haven)'],
    affectedTravelers: ['Clara Voyager (2 Pax)'],
    disruptionSummary: 'Port Department issued maritime advisory warning waves exceed 2.4 meters. All recreational catamaran charters and private sundowners halted after 16:00.',
    sourceAuthority: 'Captain of Ports, Government of Goa',
    originalPlan: {
      activity: 'Mandovi River Sunset Catamaran Sail & Caviar',
      vendor: 'Goa Marine Yacht Club',
      timing: '05:30 PM – 07:30 PM',
      cost: 8500,
      impactReason: 'Safety hazard due to 2.4m swells in estuary basin.',
    },
    aiSuggestedPlan: {
      activity: 'Historic Portuguese Manor Wine & Fado Twilight Tasting',
      vendor: 'Solar dos Canavarros Heritage Estate, Raia',
      timing: '05:45 PM – 08:00 PM',
      cost: 9300,
      costDelta: 800,
      timeDelta: '+15 mins transit',
      feasibilityScore: 98,
      description: 'Exclusive access to 350-year-old aristocratic estate with live classical Portuguese guitar, heritage port wine pairings, and private gallery tour.',
      marginImpact: 'Protected (Client absorbed / covered via TripForge Disruption Shield)',
    },
    status: 'AI Solution Ready',
  },
  {
    id: 'DISR-RAJ-02',
    title: 'NH-48 Jaipur Highway VIP Convoy Diversion',
    severity: 'Advisory',
    location: 'Jaipur Bypass / Amer Fort Road',
    affectedDay: 'Tomorrow (14 Oct)',
    affectedTours: ['TF-RAJ-1092'],
    affectedTravelers: ['Dev Singhania (Party of 2)'],
    disruptionSummary: 'Interstate summit motorcade scheduled. Amber Fort main ascent restricted from 11:30 AM to 13:00.',
    sourceAuthority: 'Jaipur Traffic Police HQ',
    originalPlan: {
      activity: 'Amber Fort Elephant Ramp Entry',
      vendor: 'Amer Fort Tourism Board',
      timing: '11:45 AM',
      cost: 2400,
      impactReason: '45-minute highway standstill predicted.',
    },
    aiSuggestedPlan: {
      activity: 'Anokhi Museum of Hand Printing & Jaigarh Watchtower First',
      vendor: 'Anokhi Heritage Trust',
      timing: '10:00 AM (Inverted schedule)',
      cost: 2400,
      costDelta: 0,
      timeDelta: '0 min delay',
      feasibilityScore: 100,
      description: 'Invert sequence: visit Jaigarh Fort ramparts and textile museum during convoy window, entering Amber Fort via private rear gate at 14:00 when gates reopen.',
      marginImpact: 'Zero cost delta (Optimal logistical reversal)',
    },
    status: 'Resolved & Pushed',
  },
];

export const INITIAL_COORDINATORS: FieldCoordinator[] = [
  {
    id: 'COORD-01',
    name: 'Tariq Khan',
    region: 'North & Central Goa',
    phone: '+91 98221 00981',
    assignedTour: 'TF-GOA-2026 (Clara Voyager)',
    currentStatus: 'On Ground',
    liveLocation: 'Fontainhas Heritage Quarter, Panaji',
    currentTask: 'Accompanying guests on Latin Quarter walking tour; coordinating luncheon table.',
    rating: 4.96,
    tripsCompleted: 142,
  },
  {
    id: 'COORD-02',
    name: 'Devika Pillai',
    region: 'Kochi & Alleppey Hub',
    phone: '+91 98470 33219',
    assignedTour: 'TF-KER-3319 (Marcus Vance)',
    currentStatus: 'Standby',
    liveLocation: 'Fort Kochi Hub Office',
    currentTask: 'Inspecting Kumarakom Pearl eco-houseboat hygiene standards prior to guest boarding.',
    rating: 4.98,
    tripsCompleted: 98,
  },
  {
    id: 'COORD-03',
    name: 'Vikram Rathore',
    region: 'Jaipur & Udaipur Hub',
    phone: '+91 94140 55122',
    assignedTour: 'TF-RAJ-1092 (Dev Singhania)',
    currentStatus: 'On Ground',
    liveLocation: 'Amer Fort Lower Courtyard',
    currentTask: 'Fast-tracking ticket pass vouchers with Archaeological Survey of India.',
    rating: 4.92,
    tripsCompleted: 184,
  },
  {
    id: 'COORD-04',
    name: 'Kalyan Negi',
    region: 'Himachal & Manali',
    phone: '+91 98055 44310',
    assignedTour: 'TF-HIM-310 (Priya Mehta)',
    currentStatus: 'En Route',
    liveLocation: 'Kullu Valley Expressway KM 44',
    currentTask: 'Piloting lead 4x4 escort vehicle through morning mist.',
    rating: 4.89,
    tripsCompleted: 67,
  },
];

export const INITIAL_CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: 'EVT-01',
    tripId: 'TF-GOA-2026',
    travelerName: 'Clara Voyager',
    title: 'Arrival MOPA & Chauffeur Pickup',
    dayLabel: 'Mon 12 Oct',
    timeSlot: '11:30 AM',
    category: 'transit',
    location: 'Goa MOPA Airport',
    status: 'Completed',
  },
  {
    id: 'EVT-02',
    tripId: 'TF-GOA-2026',
    travelerName: 'Clara Voyager',
    title: 'Azora Heritage Sea Villa Check-in',
    dayLabel: 'Mon 12 Oct',
    timeSlot: '02:00 PM',
    category: 'checkin',
    location: 'Anjuna North Goa',
    status: 'Completed',
  },
  {
    id: 'EVT-03',
    tripId: 'TF-GOA-2026',
    travelerName: 'Clara Voyager',
    title: 'Fontainhas Walking Tour & Curator Maria',
    dayLabel: 'Tue 13 Oct',
    timeSlot: '09:00 AM',
    category: 'activity',
    location: 'Panaji',
    status: 'In Progress',
  },
  {
    id: 'EVT-04',
    tripId: 'TF-GOA-2026',
    travelerName: 'Clara Voyager',
    title: 'Viva Panjim Private Luncheon Atelier',
    dayLabel: 'Tue 13 Oct',
    timeSlot: '01:00 PM',
    category: 'vip',
    location: 'Panaji',
    status: 'Scheduled',
  },
  {
    id: 'EVT-05',
    tripId: 'TF-GOA-2026',
    travelerName: 'Clara Voyager',
    title: 'Sahakari Spice Farm Safari',
    dayLabel: 'Wed 14 Oct',
    timeSlot: '10:00 AM',
    category: 'activity',
    location: 'Ponda',
    status: 'Scheduled',
  },
  {
    id: 'EVT-06',
    tripId: 'TF-GOA-2026',
    travelerName: 'Clara Voyager',
    title: 'Mandovi Bay Sunset Charter (Weather Advisory)',
    dayLabel: 'Thu 15 Oct',
    timeSlot: '05:30 PM',
    category: 'vip',
    location: 'Panaji Port',
    status: 'Scheduled',
  },
  {
    id: 'EVT-07',
    tripId: 'TF-RAJ-1092',
    travelerName: 'Dev Singhania',
    title: 'Amber Fort VIP Guided Expedition',
    dayLabel: 'Tue 13 Oct',
    timeSlot: '10:30 AM',
    category: 'activity',
    location: 'Jaipur',
    status: 'In Progress',
  },
  {
    id: 'EVT-08',
    tripId: 'TF-HIM-310',
    travelerName: 'Priya Mehta',
    title: 'Cedar Villa Check-in & Fireplace Welcome',
    dayLabel: 'Tue 13 Oct',
    timeSlot: '04:00 PM',
    category: 'checkin',
    location: 'Old Manali',
    status: 'Scheduled',
  },
];
