export interface ItineraryItem {
  id: string;
  day: number;
  time: string;
  activity: string;
  location: string;
  category: 'flight' | 'hotel' | 'activity' | 'transport';
  cost: number;
  travelTime: string;
  status: 'Confirmed' | 'Pending Operator' | 'Scheduled' | 'Rerouted';
}

export interface TripBookingItem {
  id: string;
  category: 'flight' | 'hotel' | 'activity' | 'transport';
  title: string;
  subtitle: string;
  cost: number;
  date?: string;
  location?: string;
  status?: 'Confirmed' | 'Pending' | 'Cancelled';
  details: string;
}

export interface TripData {
  id: string;
  title: string;
  destination: string;
  origin: string;
  startDate: string;
  endDate: string;
  duration: string;
  travelers: number;
  travelerType: string;
  totalBudget: number;
  status: 'Draft' | 'Planning' | 'Pending Operator Approval' | 'Approved' | 'Confirmed' | 'Ongoing' | 'Completed';
  progress: number;
  coverImage: string;
  operatorName: string;
  operatorId: string;
  hotel: string;
  transport: string;
  style: string;
  interests: string[];
}

export interface PopularDestination {
  id: string;
  name: string;
  region: string;
  tags: string[];
  startingBudget: string;
  description: string;
  image: string;
  defaultOrigin: string;
  category?: 'Coastal' | 'Heritage' | 'Mountain' | 'Wellness' | 'Urban Luxury';
  rating?: number;
  bestSeason?: string;
}

export interface CuratedStay {
  id: string;
  name: string;
  destination: string;
  type: string;
  image: string;
  rating: number;
  reviewsCount: number;
  pricePerNight: number;
  amenities: string[];
  operatorBadge: string;
  tag: string;
}

export interface SeasonalCollection {
  id: string;
  title: string;
  subtitle: string;
  destination: string;
  duration: string;
  price: number;
  image: string;
  operator: string;
  highlights: string[];
  theme: string;
}

export interface TravelerStory {
  id: string;
  author: string;
  avatar: string;
  tripTitle: string;
  destination: string;
  rating: number;
  review: string;
  date: string;
  operatorReviewed: string;
  rerouteExperience?: string;
}

export interface DestinationInsight {
  destination: string;
  temp: string;
  condition: string;
  humidity: string;
  sunset: string;
  bestSeason: string;
  localTip: string;
}

export interface ChecklistItem {
  id: string;
  task: string;
  category: 'Documents' | 'Gear' | 'Health' | 'Logistics';
  completed: boolean;
}

export interface ExperienceItem {

  id: string;
  title: string;
  category: 'Food Tours' | 'Adventure' | 'Culture' | 'Nature' | 'Nightlife' | 'Shopping';
  duration: string;
  cost: number;
  rating: number;
  image: string;
  description: string;
  location: string;
}

export const INITIAL_TRIP: TripData = {
  id: 'TF-GOA-2026',
  title: 'Bespoke Coastal Haven & Spice Trails',
  origin: 'Mumbai',
  destination: 'Goa',
  startDate: '12 Oct',
  endDate: '17 Oct, 2026',
  duration: '5 Days · 4 Nights',
  travelers: 2,
  travelerType: '2 Adults',
  totalBudget: 50000,
  status: 'Planning',
  progress: 45,
  coverImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
  operatorName: 'Vanguard Coastal Escapes',
  operatorId: 'OP-GOA-108',
  hotel: 'Azora Heritage Sea Villa (Anjuna)',
  transport: 'Private Chauffeur Sedan',
  style: 'Luxury & Cultural',
  interests: ['Beach & Sunset', 'Culinary Spice Trail', 'Heritage Portuguese Quarters'],
};

export const INITIAL_ITINERARY: ItineraryItem[] = [
  {
    id: 'it-1',
    day: 1,
    time: '11:30 AM',
    activity: 'Flight Arrival & Private Chauffeur Escort',
    location: 'Goa MOPA Airport → Azora Heritage Villa',
    category: 'transport',
    cost: 2500,
    travelTime: '45 mins',
    status: 'Confirmed',
  },
  {
    id: 'it-2',
    day: 1,
    time: '04:00 PM',
    activity: 'Anjuna Beach Sunset & Coconut Palm Promenade',
    location: 'North Anjuna Coastline',
    category: 'activity',
    cost: 1200,
    travelTime: '15 mins',
    status: 'Scheduled',
  },
  {
    id: 'it-3',
    day: 2,
    time: '09:00 AM',
    activity: 'Historic Fontainhas Latin Quarter Walking Tour',
    location: 'Panaji Heritage Zone',
    category: 'activity',
    cost: 3500,
    travelTime: '30 mins',
    status: 'Confirmed',
  },
  {
    id: 'it-4',
    day: 2,
    time: '01:00 PM',
    activity: 'Private Goan-Portuguese Tasting Luncheon',
    location: 'Viva Panjim Heritage Atelier',
    category: 'activity',
    cost: 4800,
    travelTime: '5 mins',
    status: 'Confirmed',
  },
  {
    id: 'it-5',
    day: 3,
    time: '10:00 AM',
    activity: 'Organic Spice Plantation & Secret River Bath',
    location: 'Sahakari Spice Estate, Ponda',
    category: 'activity',
    cost: 5500,
    travelTime: '50 mins',
    status: 'Pending Operator',
  },
  {
    id: 'it-6',
    day: 4,
    time: '05:30 PM',
    activity: 'Mandovi River Private Catamaran Sail & Caviar',
    location: 'Panaji Marina Pier',
    category: 'activity',
    cost: 8500,
    travelTime: '20 mins',
    status: 'Scheduled',
  },
];

export const INITIAL_BOOKINGS: TripBookingItem[] = [
  {
    id: 'bk-1',
    category: 'flight',
    title: 'Indigo Premium 6E-289',
    subtitle: 'BOM → GOX (Non-stop)',
    cost: 8400,
    date: '12 Oct, 2026',
    location: 'Mumbai T2 → Goa MOPA',
    status: 'Confirmed',
    details: 'Economy Plus · 2 Passengers · Extra Legroom',
  },
  {
    id: 'bk-2',
    category: 'hotel',
    title: 'Azora Heritage Sea Villa',
    subtitle: 'Anjuna Bay · 4 Nights',
    cost: 18000,
    date: '12 Oct – 17 Oct',
    location: 'Anjuna Coastal Reserve',
    status: 'Confirmed',
    details: 'Oceanview Suite · Gourmet Breakfast Included',
  },
  {
    id: 'bk-3',
    category: 'transport',
    title: 'Dedicated Chauffeur Sedan',
    subtitle: 'Full 5-Day Standby',
    cost: 6500,
    date: '12 Oct – 17 Oct',
    location: 'Goa Coastal Zone',
    status: 'Confirmed',
    details: 'Airport pickup, inter-city tours & late return',
  },
  {
    id: 'bk-4',
    category: 'activity',
    title: 'Heritage & Spice Curated Pass',
    subtitle: 'Fontainhas & Sahakari Private Pass',
    cost: 9600,
    date: '13 & 14 Oct',
    location: 'Panaji & Ponda',
    status: 'Confirmed',
    details: 'Private historian guide + tastings for 2',
  },
];

export const POPULAR_DESTINATIONS: PopularDestination[] = [
  {
    id: 'pop-goa',
    name: 'Goa',
    region: 'Western Coast, India',
    tags: ['Beach', 'Villas', 'Culinary'],
    startingBudget: '₹18,000',
    description: 'Portuguese heritage villas, secluded golden sands, and organic spice trails.',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
    defaultOrigin: 'Mumbai',
    category: 'Coastal',
    rating: 4.94,
    bestSeason: 'Oct – May',
  },
  {
    id: 'pop-udaipur',
    name: 'Udaipur',
    region: 'Mewar, Rajasthan',
    tags: ['Palaces', 'Lakes', 'Royal'],
    startingBudget: '₹28,000',
    description: 'Marble lake pavilions, vintage car heritage fleets, and candlelit courtyard dinners.',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
    defaultOrigin: 'Delhi',
    category: 'Heritage',
    rating: 4.98,
    bestSeason: 'Sep – Mar',
  },
  {
    id: 'pop-kerala',
    name: 'Kerala',
    region: 'Alleppey & Munnar, India',
    tags: ['Backwaters', 'Ayurveda', 'Tea Mist'],
    startingBudget: '₹24,000',
    description: 'Private teak houseboats, rolling tea mist plantations, and Ayurvedic healing pavilions.',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
    defaultOrigin: 'Bengaluru',
    category: 'Wellness',
    rating: 4.96,
    bestSeason: 'Sep – Apr',
  },
  {
    id: 'pop-shimla',
    name: 'Shimla & Mashobra',
    region: 'Himachal Pradesh, India',
    tags: ['Cedar Woods', 'Alpine', 'Fireplaces'],
    startingBudget: '₹22,000',
    description: 'Colonial cedar forest estates, apple orchard walks, and snow-capped Himalayan ridges.',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
    defaultOrigin: 'Delhi',
    category: 'Mountain',
    rating: 4.92,
    bestSeason: 'Year-round',
  },
  {
    id: 'pop-dubai',
    name: 'Dubai',
    region: 'Arabian Gulf, UAE',
    tags: ['Luxury', 'Skyline', 'Desert Domes'],
    startingBudget: '₹55,000',
    description: 'Ultra-modern skyline architecture, private desert safaris, and Michelin dhow cruises.',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    defaultOrigin: 'Mumbai',
    category: 'Urban Luxury',
    rating: 4.95,
    bestSeason: 'Nov – Mar',
  },
  {
    id: 'pop-bali',
    name: 'Bali',
    region: 'Ubud & Seminyak, Indonesia',
    tags: ['Culture', 'Temples', 'Waterfalls'],
    startingBudget: '₹42,000',
    description: 'Emerald jungle ravines, sacred cliffside temples, and private waterfall sanctuaries.',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
    defaultOrigin: 'Bengaluru',
    category: 'Wellness',
    rating: 4.93,
    bestSeason: 'Apr – Oct',
  },
  {
    id: 'pop-swiss',
    name: 'Switzerland',
    region: 'Zermatt & Lucerne, Alps',
    tags: ['Alpine', 'Chalets', 'Glaciers'],
    startingBudget: '₹85,000',
    description: 'Glacier Express panoramas, private timber fire-lit chalets, and alpine thermal spas.',
    image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80',
    defaultOrigin: 'Delhi',
    category: 'Mountain',
    rating: 4.99,
    bestSeason: 'Dec – Apr & Jun – Sep',
  },
  {
    id: 'pop-japan',
    name: 'Japan',
    region: 'Kyoto & Tokyo, Japan',
    tags: ['Zen', 'Gastronomy', 'Ryokans'],
    startingBudget: '₹75,000',
    description: 'Dawn bamboo groves, master tea ceremonies, shinkansen transit, and historic ryokans.',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
    defaultOrigin: 'Delhi',
    category: 'Heritage',
    rating: 4.97,
    bestSeason: 'Mar – May & Oct – Nov',
  },
  {
    id: 'pop-amalfi',
    name: 'Amalfi Coast',
    region: 'Campania, Italy',
    tags: ['Cliffside', 'Yachting', 'Limoncello'],
    startingBudget: '₹95,000',
    description: 'Pastel cliff villages, secluded azure coves, private Riva speedboats, and terraced lemon groves.',
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80',
    defaultOrigin: 'Mumbai',
    category: 'Coastal',
    rating: 4.98,
    bestSeason: 'May – Oct',
  },
];

export const EXPERIENCES_CATALOG: ExperienceItem[] = [
  {
    id: 'exp-1',
    title: 'Goan-Portuguese Chef’s Table & Feni Cellar',
    category: 'Food Tours',
    duration: '3.5 Hours',
    cost: 3800,
    rating: 4.98,
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
    description: 'Historic manor private kitchen tasting with vintage cashew pot-still feni pairings.',
    location: 'Panaji Latin Quarter',
  },
  {
    id: 'exp-2',
    title: 'Dudhsagar Jungle 4x4 & Secret Lagoon',
    category: 'Adventure',
    duration: '5 Hours',
    cost: 4200,
    rating: 4.92,
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80',
    description: 'Off-road jeep convoy across Western Ghat streams to remote natural cascades.',
    location: 'Bhagwan Mahavir Reserve',
  },
  {
    id: 'exp-3',
    title: 'Private Heritage Atelier & Azulejo Artistry',
    category: 'Culture',
    duration: '2.5 Hours',
    cost: 2900,
    rating: 4.95,
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80',
    description: 'Hands-on Portuguese ceramic glazing masterclass with a master local artisan.',
    location: 'Fontainhas Atelier',
  },
  {
    id: 'exp-4',
    title: 'Sal Backwaters Sunrise Kayaking & Birding',
    category: 'Nature',
    duration: '3 Hours',
    cost: 2500,
    rating: 4.91,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
    description: 'Paddling through serene coastal mangroves with binoculars and hot filter coffee.',
    location: 'Cavelossim Estuary',
  },
  {
    id: 'exp-5',
    title: 'Vagator Cliffside Fire Dining & Lounge',
    category: 'Nightlife',
    duration: '4 Hours',
    cost: 5000,
    rating: 4.96,
    image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=600&q=80',
    description: 'VIP cliff table facing crashing waves with organic charcoal cocktails and live ambient acoustic sets.',
    location: 'Vagator Hill',
  },
  {
    id: 'exp-6',
    title: 'Arpora Night Bazaar Private Stylist & Gems',
    category: 'Shopping',
    duration: '3 Hours',
    cost: 1800,
    rating: 4.88,
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80',
    description: 'Curated shopping route through boutique silk weavers, antique brass, and spice merchants.',
    location: 'Arpora Hillside',
  },
];

export const OTHER_MY_TRIPS: TripData[] = [
  {
    id: 'TF-UDA-2026',
    title: 'Mewar Royal Forts & Lake Sanctuary',
    origin: 'Delhi',
    destination: 'Udaipur',
    startDate: '24 Nov',
    endDate: '28 Nov, 2026',
    duration: '4 Days · 3 Nights',
    travelers: 2,
    travelerType: '2 Adults',
    totalBudget: 60000,
    status: 'Confirmed',
    progress: 100,
    coverImage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
    operatorName: 'Rajputana Heritage Atelier',
    operatorId: 'OP-RAJ-402',
    hotel: 'The Leela Palace Lake Wing',
    transport: 'Vintage Royal Car + Chauffeur',
    style: 'Royal Luxury',
    interests: ['Palace Architecture', 'Lake Sunset Charter'],
  },
  {
    id: 'TF-KER-2026',
    title: 'Vembanad Houseboat & Spice Mist',
    origin: 'Bengaluru',
    destination: 'Kerala',
    startDate: '15 Jan',
    endDate: '21 Jan, 2027',
    duration: '6 Days · 5 Nights',
    travelers: 4,
    travelerType: 'Family (4)',
    totalBudget: 85000,
    status: 'Pending Operator Approval',
    progress: 70,
    coverImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
    operatorName: 'Malabar Backwater Curators',
    operatorId: 'OP-KER-210',
    hotel: 'Kettuvallam Teak Houseboat + Spice Villa',
    transport: 'Innova Crysta VIP',
    style: 'Serene Nature & Wellness',
    interests: ['Tea Gardens', 'Ayurveda', 'Backwaters'],
  },
  {
    id: 'TF-LAD-2025',
    title: 'Himalayan High Passes & Monasteries',
    origin: 'Delhi',
    destination: 'Leh Ladakh',
    startDate: '10 Aug',
    endDate: '17 Aug, 2025',
    duration: '7 Days · 6 Nights',
    travelers: 2,
    travelerType: '2 Adults',
    totalBudget: 55000,
    status: 'Completed',
    progress: 100,
    coverImage: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=80',
    operatorName: 'High Altitude Expeditions',
    operatorId: 'OP-LAD-551',
    hotel: 'The Grand Dragon Ladakh',
    transport: '4x4 Expedition Cruiser',
    style: 'High Adventure',
    interests: ['Pangong Tso', 'Monastery Chants', 'Pass Crossing'],
  },
];

export const CURATED_STAYS: CuratedStay[] = [
  {
    id: 'stay-1',
    name: 'Azora Heritage Sea Villa',
    destination: 'Goa',
    type: 'Portuguese Heritage Villa',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
    rating: 4.97,
    reviewsCount: 142,
    pricePerNight: 12500,
    amenities: ['Private Infinity Pool', 'Sea View Terrace', 'Butler Service', 'Gourmet Breakfast'],
    operatorBadge: 'Vanguard Certified',
    tag: 'Signature Choice',
  },
  {
    id: 'stay-2',
    name: 'The Oberoi Udaivilas Palace',
    destination: 'Udaipur',
    type: 'Royal Lake Palace',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    rating: 4.99,
    reviewsCount: 318,
    pricePerNight: 28000,
    amenities: ['Lake Pichola Views', 'Royal Spa', 'Private Boat Arrival', 'Heritage Courtyards'],
    operatorBadge: 'Rajputana Atelier',
    tag: 'Royal Heritage',
  },
  {
    id: 'stay-3',
    name: 'Kumarakom Teak Lake Sanctuary',
    destination: 'Kerala',
    type: 'Waterfront Eco-Resort',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    rating: 4.94,
    reviewsCount: 96,
    pricePerNight: 14000,
    amenities: ['Ayurvedic Pavilion', 'Meandering Pool', 'Backwater Catamaran', 'Spice Garden'],
    operatorBadge: 'Malabar Verified',
    tag: 'Wellness Sanctum',
  },
  {
    id: 'stay-4',
    name: 'Wildflower Alpine Forest Estate',
    destination: 'Shimla',
    type: 'Colonial Cedar Lodge',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
    rating: 4.91,
    reviewsCount: 84,
    pricePerNight: 16500,
    amenities: ['Himalayan Views', 'Open Fireplaces', 'Heated Outdoor Whirlpool', 'Nature Trails'],
    operatorBadge: 'Himachal Certified',
    tag: 'Mountain Haven',
  },
  {
    id: 'stay-5',
    name: 'Bespoke Desert Camp & Starlit Domes',
    destination: 'Jaisalmer',
    type: 'Luxury Glamping Oasis',
    image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=800&q=80',
    rating: 4.89,
    reviewsCount: 110,
    pricePerNight: 9800,
    amenities: ['Dune-side Dining', 'Camel Caravan Escort', 'Astronomical Telescope', 'Folk Performances'],
    operatorBadge: 'Thar Heritage Guild',
    tag: 'Desert Magic',
  },
  {
    id: 'stay-6',
    name: 'Amanbagh Haveli & Mung Bean Groves',
    destination: 'Alwar / Jaipur',
    type: 'Mughal Architecture Retreat',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
    rating: 4.98,
    reviewsCount: 76,
    pricePerNight: 32000,
    amenities: ['Green Marble Plunge Pools', 'Private Yoga Masters', 'Ancient Ruin Excursions', 'Organic Farm Dining'],
    operatorBadge: 'Rajputana Atelier',
    tag: 'Elite Sanctuary',
  },
];

export const SEASONAL_COLLECTIONS: SeasonalCollection[] = [
  {
    id: 'col-1',
    title: 'The Golden Monsoons & Spice Sanctuaries',
    subtitle: 'Lush tropical coastal retreat with private cooking ateliers & rain-sheltered boat sails',
    destination: 'Goa & Western Ghats',
    duration: '5 Days · 4 Nights',
    price: 38500,
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
    operator: 'Vanguard Coastal Escapes',
    highlights: ['Portuguese Tile Glazing', 'Organic Spices Tasting', 'Sunset Catamaran with Weather Shield'],
    theme: 'Coastal Rejuvenation',
  },
  {
    id: 'col-2',
    title: 'Crowns of Rajputana: Palaces & Starlit Dunes',
    subtitle: 'From the floating pavilions of Lake Pichola to sunset dinners on the Thar desert sands',
    destination: 'Udaipur & Jodhpur',
    duration: '6 Days · 5 Nights',
    price: 64000,
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
    operator: 'Rajputana Heritage Atelier',
    highlights: ['Private Royal Boat Charter', 'Vintage Car City Tour', 'Astronomer Stargazing in Desert'],
    theme: 'Royal Opulence',
  },
  {
    id: 'col-3',
    title: 'Tranquil Waters & Ancient Ayurveda',
    subtitle: 'Gentle slow-living navigation aboard a luxury private teak kettuvallam',
    destination: 'Alleppey & Kumarakom',
    duration: '5 Days · 4 Nights',
    price: 44000,
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
    operator: 'Malabar Backwater Curators',
    highlights: ['Private Ayurvedic Doctor Consultation', 'Fresh Catch Claypot Cooking', 'Canal Sunrise Kayak'],
    theme: 'Holistic Wellness',
  },
];

export const TRAVELER_STORIES: TravelerStory[] = [
  {
    id: 'rev-1',
    author: 'Clara & Dev Anand',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    tripTitle: 'Coastal Goa Culinary & Heritage Haven',
    destination: 'Goa',
    rating: 5,
    date: 'September 2026',
    operatorReviewed: 'Vanguard Coastal Escapes',
    review:
      'TripForge gave us complete freedom without the headache. When sudden monsoon squalls formed over the bay, the dynamic AI rerouting swapped our catamaran for a breathtaking private Portuguese heritage atelier luncheon in 10 minutes without extra charges. True luxury.',
    rerouteExperience: 'Autonomous weather rerouting saved anniversary evening',
  },
  {
    id: 'rev-2',
    author: 'Marcus Vance',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    tripTitle: 'Himalayan Ridge Photography & High Passes',
    destination: 'Leh Ladakh',
    rating: 5,
    date: 'August 2026',
    operatorReviewed: 'High Altitude Expeditions',
    review:
      'Usually travel platforms give you rigid templates. Here, I tweaked our 4x4 route to include Pangong dawn light, and the local operator confirmed the permit and oxygen kits directly in the workspace. The transparent budget breakdown was refreshingly honest.',
    rerouteExperience: 'Permit coordination directly with certified operator',
  },
  {
    id: 'rev-3',
    author: 'Elena & Priya Rao',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
    tripTitle: 'Royal Forts & Lake Pichola Sanctuaries',
    destination: 'Udaipur',
    rating: 5,
    date: 'July 2026',
    operatorReviewed: 'Rajputana Heritage Atelier',
    review:
      'The difference between an automated booking website and TripForge is the operator guarantee. Tariq our chauffeur and Vikram from the atelier treated us like personal houseguests. Everything was pristine, punctual, and exquisitely staged.',
    rerouteExperience: 'Direct WhatsApp link with assigned lead concierge',
  },
];

export const DESTINATION_INSIGHTS: Record<string, DestinationInsight> = {
  Goa: {
    destination: 'Goa, India',
    temp: '29°C',
    condition: 'Sunny with Coastal Breeze',
    humidity: '68%',
    sunset: '6:18 PM',
    bestSeason: 'October – April',
    localTip: 'North Goa offers lively cliffside dining and art ateliers; South Goa is best for untouched white sands and heritage spice sanctuaries.',
  },
  Udaipur: {
    destination: 'Udaipur, Rajasthan',
    temp: '26°C',
    condition: 'Pleasant & Clear Sky',
    humidity: '42%',
    sunset: '6:05 PM',
    bestSeason: 'September – March',
    localTip: 'Sunset boat charters on Lake Pichola require 24-hr advance docking clearance which our operator handles automatically.',
  },
  Kerala: {
    destination: 'Alleppey & Munnar',
    temp: '27°C',
    condition: 'Tropical Mist & Gentle Breeze',
    humidity: '74%',
    sunset: '6:22 PM',
    bestSeason: 'September – May',
    localTip: 'Kettuvallam houseboats moor along Vembanad Lake by 5:30 PM for starlit canal dining. Early mornings are prime for birding.',
  },
};

export const INITIAL_CHECKLIST: ChecklistItem[] = [
  { id: 'chk-1', task: 'Boarding Passes & E-Tickets saved offline (Indigo 6E-289)', category: 'Documents', completed: true },
  { id: 'chk-2', task: 'Azora Heritage Villa check-in voucher with gate access PIN', category: 'Documents', completed: true },
  { id: 'chk-3', task: 'Driver Tariq chauffeur direct contact saved on WhatsApp', category: 'Logistics', completed: true },
  { id: 'chk-4', task: 'SPF 50+ Reef-safe sunscreen & beachwear packed', category: 'Gear', completed: false },
  { id: 'chk-5', task: 'Camera lenses & waterproof dry-bag for catamaran sail', category: 'Gear', completed: false },
  { id: 'chk-6', task: 'Emergency travel insurance card & dietary allergy card', category: 'Health', completed: true },
];

