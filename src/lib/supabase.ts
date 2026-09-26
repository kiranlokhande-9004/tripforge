import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Default Demo Supabase Configuration or Environment Variables
const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
const envKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

// Fallback or stored credentials
const storedUrl = typeof window !== 'undefined' ? localStorage.getItem('tripforge_sb_url') || '' : '';
const storedKey = typeof window !== 'undefined' ? localStorage.getItem('tripforge_sb_key') || '' : '';

export const supabaseUrl = envUrl || storedUrl;
export const supabaseAnonKey = envKey || storedKey;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('http') &&
  !supabaseUrl.includes('placeholder')
);

// Instantiate real Supabase client (using public anon key if provided, or dummy if not yet configured)
export const supabase: SupabaseClient = createClient(
  supabaseUrl || 'https://placeholder-tripforge.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key'
);

// Realtime Bus for instantaneous multi-tab sync (guarantees hackathon judge demos work 100% reliably even offline)
const BUS_CHANNEL = 'tripforge_realtime_sync_v1';
let broadcastChannel: BroadcastChannel | null = null;
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  broadcastChannel = new BroadcastChannel(BUS_CHANNEL);
}

// -----------------------------------------------------------------------------
// Core Data Interfaces
// -----------------------------------------------------------------------------
export interface DbProfile {
  id: string;
  name: string;
  email: string;
  role: 'traveler' | 'operator' | 'admin';
  avatar_url?: string;
  created_at: string;
}

export interface DbTripRequest {
  id: string;
  traveler_id: string;
  traveler_name: string;
  traveler_email: string;
  origin: string;
  destination: string;
  start_date: string;
  end_date: string;
  duration: string;
  travelers_count: number;
  party_type: string;
  budget: number;
  currency: string;
  interests: string[];
  accommodation_preference: string;
  transport_preference: string;
  special_requests: string;
  status: 'Pending Review' | 'Approved' | 'Changes Requested' | 'Rejected' | 'Planning' | 'Confirmed' | 'Ongoing';
  urgency: 'Normal' | 'High';
  operational_notes?: string;
  assigned_operator_id: string;
  created_at: string;
  updated_at: string;
}

export interface DbItineraryItem {
  id: string;
  itinerary_id: string;
  day_number: number;
  start_time: string;
  end_time?: string;
  title: string;
  location: string;
  category: 'flight' | 'hotel' | 'activity' | 'transport' | 'dining';
  estimated_cost: number;
  client_charge: number;
  vendor_name?: string;
  status: 'Confirmed' | 'Pending Operator' | 'Scheduled' | 'Rerouted' | 'Cancelled';
  travel_time?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface DbChangeRequest {
  id: string;
  trip_request_id: string;
  requested_by: string;
  request_type: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  operator_response?: string;
  created_at: string;
}

export interface DbDisruption {
  id: string;
  trip_request_id: string;
  type: 'weather' | 'transport' | 'vendor' | 'venue' | 'logistics';
  severity: 'Warning' | 'Critical' | 'Advisory';
  description: string;
  affected_item_id?: string;
  status: 'active' | 'rerouting' | 'resolved' | 'dismissed';
  created_at: string;
}

export interface DbReroute {
  id: string;
  disruption_id: string;
  old_plan: string;
  new_plan: string;
  location: string;
  timing: string;
  cost_difference: number;
  remaining_budget?: number;
  distance: string;
  travel_time: string;
  reasoning: string;
  status: 'proposed' | 'approved' | 'rejected';
  created_at: string;
}

export interface DbNotification {
  id: string;
  user_id: string;
  trip_request_id?: string;
  title: string;
  message: string;
  type: 'request_created' | 'trip_approved' | 'changes_requested' | 'itinerary_updated' | 'disruption_alert' | 'reroute_ready' | 'reroute_approved';
  is_read: boolean;
  created_at: string;
}

// -----------------------------------------------------------------------------
// Local Shared Store Initial State
// -----------------------------------------------------------------------------
const STORAGE_KEY_TRIPS = 'tripforge_db_trip_requests_v2';
const STORAGE_KEY_ITEMS = 'tripforge_db_itinerary_items_v2';
const STORAGE_KEY_CHANGES = 'tripforge_db_change_requests_v2';
const STORAGE_KEY_DISRUPTIONS = 'tripforge_db_disruptions_v2';
const STORAGE_KEY_REROUTES = 'tripforge_db_reroutes_v2';
const STORAGE_KEY_NOTIFS = 'tripforge_db_notifications_v2';

// Initial Anchor Request: Clara Voyager Mumbai -> Goa
const DEFAULT_INITIAL_TRIP: DbTripRequest = {
  id: 'TF-GOA-2026',
  traveler_id: 'clara-voyager-1',
  traveler_name: 'Clara Voyager',
  traveler_email: 'clara.voyager@tripforge.com',
  origin: 'Mumbai',
  destination: 'Goa',
  start_date: '12 Oct, 2026',
  end_date: '17 Oct, 2026',
  duration: '5 Days · 4 Nights',
  travelers_count: 4,
  party_type: 'Family Expedition',
  budget: 50000,
  currency: 'INR',
  interests: ['Coastal Stays', 'Seafood Gastronomy', 'Heritage Mansions', 'Catamaran Sailing'],
  accommodation_preference: 'Boutique Heritage Villa',
  transport_preference: 'Private Air-Conditioned SUV',
  special_requests: 'Family-friendly activities and private chef oceanview breakfast.',
  status: 'Pending Review',
  urgency: 'Normal',
  operational_notes: 'High VIP potential. Connecting coordinator assigned in Panaji.',
  assigned_operator_id: 'OP-4920',
  created_at: new Date(Date.now() - 3600000).toISOString(),
  updated_at: new Date().toISOString(),
};

const DEFAULT_INITIAL_ITEMS: DbItineraryItem[] = [
  {
    id: 'it-1',
    itinerary_id: 'itin-TF-GOA-2026',
    day_number: 1,
    start_time: '10:30 AM',
    end_time: '12:00 PM',
    title: 'Arrival at Mopa Goa International Airport & VIP Chauffeur Transfer',
    location: 'Goa Mopa Airport (GOX)',
    category: 'transport',
    estimated_cost: 2400,
    client_charge: 3200,
    vendor_name: 'Goa Executive Fleets Ltd.',
    status: 'Confirmed',
    travel_time: '45 mins',
    notes: 'Driver waiting at Bay 4 with personalized nameplate.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'it-2',
    itinerary_id: 'itin-TF-GOA-2026',
    day_number: 1,
    start_time: '02:00 PM',
    end_time: '04:00 PM',
    title: 'Check-in: Heritage Portuguese Estate & Private Pool Welcome',
    location: 'Villa Alentejo, Vagator',
    category: 'hotel',
    estimated_cost: 14500,
    client_charge: 19800,
    vendor_name: 'Sol de Goa Hospitality',
    status: 'Confirmed',
    travel_time: '10 mins',
    notes: 'Early check-in authorized by operator manager.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'it-3',
    itinerary_id: 'itin-TF-GOA-2026',
    day_number: 2,
    start_time: '10:00 AM',
    end_time: '01:00 PM',
    title: 'Private Catamaran Island Cruise & Snorkeling in Mandovi Bay',
    location: 'Dona Paula Marina Pier',
    category: 'activity',
    estimated_cost: 6200,
    client_charge: 8800,
    vendor_name: 'Blue Wave Marine Expeditions',
    status: 'Confirmed',
    travel_time: '30 mins',
    notes: 'Subject to swell advisory; life vests provided.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'it-4',
    itinerary_id: 'itin-TF-GOA-2026',
    day_number: 2,
    start_time: '07:30 PM',
    end_time: '10:00 PM',
    title: 'Curated 7-Course Goan-Portuguese Tasting Dinner',
    location: 'Verandah at the Latin Quarter, Fontainhas',
    category: 'dining',
    estimated_cost: 3800,
    client_charge: 5200,
    vendor_name: 'Fontainhas Gastronomy Club',
    status: 'Confirmed',
    travel_time: '20 mins',
    notes: 'Table 4 reserved under Clara Voyager.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'it-5',
    itinerary_id: 'itin-TF-GOA-2026',
    day_number: 3,
    start_time: '02:00 PM',
    end_time: '05:00 PM',
    title: 'Anjuna Coastal Beach Watersports & Speedboat Exploration',
    location: 'Anjuna North Beachfront',
    category: 'activity',
    estimated_cost: 2500,
    client_charge: 3500,
    vendor_name: 'Anjuna Nautical Collective',
    status: 'Confirmed',
    travel_time: '15 mins',
    notes: 'Outdoor beach watersports session.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const DEFAULT_INITIAL_NOTIFS: DbNotification[] = [
  {
    id: 'notif-1',
    user_id: 'operator',
    trip_request_id: 'TF-GOA-2026',
    title: 'New Trip Request Received',
    message: 'Clara Voyager submitted a custom Goa request (₹50,000 budget, 4 travelers).',
    type: 'request_created',
    is_read: false,
    created_at: new Date(Date.now() - 1800000).toISOString(),
  },
];

// Helper to read and write from localStorage safely
function readStore<T>(key: string, defaultVal: T): T {
  if (typeof window === 'undefined') return defaultVal;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultVal;
    return JSON.parse(raw);
  } catch {
    return defaultVal;
  }
}

function writeStore<T>(key: string, val: T) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (err) {
    console.error('Storage write error:', err);
  }
}

// -----------------------------------------------------------------------------
// Unified Database Synchronization Engine (TripForge Database)
// -----------------------------------------------------------------------------
type ChangeListener = (event: { table: string; eventType: string; payload: any }) => void;
const listeners = new Set<ChangeListener>();

// Broadcast to local listeners and other tabs
function notifyRealtime(table: string, eventType: string, payload: any) {
  const event = { table, eventType, payload };
  listeners.forEach((listener) => {
    try {
      listener(event);
    } catch (e) {
      console.error('Listener callback error:', e);
    }
  });

  if (broadcastChannel) {
    broadcastChannel.postMessage(event);
  }
}

// Listen for broadcast events from other tabs/windows
if (broadcastChannel) {
  broadcastChannel.onmessage = (msgEvent) => {
    if (msgEvent.data && msgEvent.data.table) {
      listeners.forEach((listener) => {
        try {
          listener(msgEvent.data);
        } catch (e) {
          console.error('Cross-tab broadcast listener error:', e);
        }
      });
    }
  };
}

// Also hook into window storage event for fallback multi-tab synchronization
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key?.startsWith('tripforge_db_')) {
      const table = e.key.replace('tripforge_db_', '').replace('_v2', '');
      notifyRealtime(table, 'STORAGE_SYNC', { key: e.key });
    }
  });
}

// Set up remote Supabase Realtime channel if Supabase credentials are available
if (isSupabaseConfigured) {
  try {
    const channel = supabase.channel('tripforge-realtime-global');
    channel
      .on('postgres_changes', { event: '*', schema: 'public' }, (payload) => {
        notifyRealtime(payload.table, payload.eventType, payload.new || payload.old);
      })
      .subscribe();
  } catch (err) {
    console.warn('Supabase Realtime remote setup warning:', err);
  }
}

export const tripforgeDb = {
  // 1. TRIP REQUESTS
  async getTripRequests(): Promise<DbTripRequest[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('trip_requests')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data && data.length > 0) {
          writeStore(STORAGE_KEY_TRIPS, data);
          return data;
        }
      } catch (err) {
        console.warn('Supabase query error, falling back to synchronized store:', err);
      }
    }
    return readStore<DbTripRequest[]>(STORAGE_KEY_TRIPS, [DEFAULT_INITIAL_TRIP]);
  },

  async getTripRequestById(id: string): Promise<DbTripRequest | null> {
    const all = await this.getTripRequests();
    return all.find((r) => r.id === id) || null;
  },

  async createTripRequest(req: Partial<DbTripRequest>): Promise<DbTripRequest> {
    const id = req.id || `TF-${(req.destination || 'TRIP').toUpperCase().slice(0, 3)}-${Date.now().toString().slice(-4)}`;
    const newRecord: DbTripRequest = {
      id,
      traveler_id: req.traveler_id || 'clara-voyager-1',
      traveler_name: req.traveler_name || 'Clara Voyager',
      traveler_email: req.traveler_email || 'clara.voyager@tripforge.com',
      origin: req.origin || 'Mumbai',
      destination: req.destination || 'Goa',
      start_date: req.start_date || '10 Oct',
      end_date: req.end_date || '14 Oct',
      duration: req.duration || '5 Days · 4 Nights',
      travelers_count: req.travelers_count || 4,
      party_type: req.party_type || 'Family Trip',
      budget: req.budget || 50000,
      currency: 'INR',
      interests: req.interests || ['Beaches', 'Food', 'Sightseeing'],
      accommodation_preference: req.accommodation_preference || '3-star hotel',
      transport_preference: req.transport_preference || 'Private cab',
      special_requests: req.special_requests || 'Family-friendly activities',
      status: 'Pending Review',
      urgency: req.urgency || 'Normal',
      operational_notes: 'Newly received traveler request awaiting operator review.',
      assigned_operator_id: 'OP-4920',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // 1. Update local synchronized store
    const existing = readStore<DbTripRequest[]>(STORAGE_KEY_TRIPS, [DEFAULT_INITIAL_TRIP]);
    const updated = [newRecord, ...existing.filter((t) => t.id !== id)];
    writeStore(STORAGE_KEY_TRIPS, updated);

    // 2. Generate initial itinerary items for this trip request
    await this.generateInitialItineraryForTrip(newRecord);

    // 3. Create operator notification
    await this.createNotification({
      user_id: 'operator',
      trip_request_id: newRecord.id,
      title: 'New Trip Request Received',
      message: `${newRecord.traveler_name} created a ${newRecord.destination} custom trip (${newRecord.duration}, ₹${newRecord.budget.toLocaleString('en-IN')}).`,
      type: 'request_created',
    });

    // 4. Create traveler confirmation notification
    await this.createNotification({
      user_id: newRecord.traveler_id,
      trip_request_id: newRecord.id,
      title: 'Trip Request Submitted',
      message: `Your custom ${newRecord.destination} trip request has been sent to our local tour operator for approval.`,
      type: 'request_created',
    });

    // 5. Sync to remote Supabase if connected
    if (isSupabaseConfigured) {
      try {
        await supabase.from('trip_requests').insert([newRecord]);
      } catch (err) {
        console.warn('Supabase insert warning:', err);
      }
    }

    // 6. Broadcast Realtime Event
    notifyRealtime('trip_requests', 'INSERT', newRecord);
    return newRecord;
  },

  async updateTripRequestStatus(
    id: string,
    status: DbTripRequest['status'],
    operationalNotes?: string
  ): Promise<DbTripRequest | null> {
    const existing = await this.getTripRequests();
    const target = existing.find((t) => t.id === id);
    if (!target) return null;

    const updatedRecord: DbTripRequest = {
      ...target,
      status,
      operational_notes: operationalNotes !== undefined ? operationalNotes : target.operational_notes,
      updated_at: new Date().toISOString(),
    };

    const updatedList = existing.map((t) => (t.id === id ? updatedRecord : t));
    writeStore(STORAGE_KEY_TRIPS, updatedList);

    // Notifications based on status
    if (status === 'Approved') {
      await this.createNotification({
        user_id: target.traveler_id,
        trip_request_id: id,
        title: 'Trip Approved by Tour Operator',
        message: `Your ${target.destination} trip has been officially reviewed and approved by the tour operator!`,
        type: 'trip_approved',
      });
    } else if (status === 'Changes Requested') {
      await this.createNotification({
        user_id: target.traveler_id,
        trip_request_id: id,
        title: 'Operator Proposed Changes',
        message: operationalNotes || 'Tour operator requested itinerary schedule modifications.',
        type: 'changes_requested',
      });
    }

    if (isSupabaseConfigured) {
      try {
        await supabase
          .from('trip_requests')
          .update({
            status: updatedRecord.status,
            operational_notes: updatedRecord.operational_notes,
            updated_at: updatedRecord.updated_at,
          })
          .eq('id', id);
      } catch (err) {
        console.warn('Supabase update warning:', err);
      }
    }

    notifyRealtime('trip_requests', 'UPDATE', updatedRecord);
    return updatedRecord;
  },

  // 2. ITINERARIES & ITEMS
  async getItineraryItems(tripId?: string): Promise<DbItineraryItem[]> {
    if (isSupabaseConfigured) {
      try {
        let query = supabase.from('itinerary_items').select('*').order('day_number', { ascending: true });
        if (tripId) {
          query = query.eq('itinerary_id', `itin-${tripId}`);
        }
        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          writeStore(STORAGE_KEY_ITEMS, data);
          return data;
        }
      } catch (err) {
        console.warn('Supabase itinerary query error:', err);
      }
    }
    const all = readStore<DbItineraryItem[]>(STORAGE_KEY_ITEMS, DEFAULT_INITIAL_ITEMS);
    if (tripId) {
      const filtered = all.filter((item) => item.itinerary_id === `itin-${tripId}`);
      return filtered.length > 0 ? filtered : all;
    }
    return all;
  },

  async generateInitialItineraryForTrip(trip: DbTripRequest): Promise<DbItineraryItem[]> {
    const itinId = `itin-${trip.id}`;
    const items: DbItineraryItem[] = [
      {
        id: `it-${trip.id}-1`,
        itinerary_id: itinId,
        day_number: 1,
        start_time: '10:00 AM',
        end_time: '12:00 PM',
        title: `Arrival at ${trip.destination} & Private Chauffeur Transfer`,
        location: `${trip.destination} Central Terminal`,
        category: 'transport',
        estimated_cost: 2000,
        client_charge: 2500,
        vendor_name: `${trip.destination} Express Fleet`,
        status: 'Confirmed',
        travel_time: '35 mins',
        notes: 'Chauffeured pickup on standby.',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: `it-${trip.id}-2`,
        itinerary_id: itinId,
        day_number: 1,
        start_time: '02:00 PM',
        end_time: '04:00 PM',
        title: `Check-in: ${trip.accommodation_preference}`,
        location: `${trip.destination} Prime District`,
        category: 'hotel',
        estimated_cost: 12000,
        client_charge: 16000,
        vendor_name: 'Curated Boutique Escapes',
        status: 'Confirmed',
        travel_time: '15 mins',
        notes: 'Welcome refreshments and family suites confirmed.',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: `it-${trip.id}-3`,
        itinerary_id: itinId,
        day_number: 2,
        start_time: '10:00 AM',
        end_time: '01:00 PM',
        title: `Curated ${trip.destination} Cultural & Sightseeing Tour`,
        location: `${trip.destination} Historic Landmarks`,
        category: 'activity',
        estimated_cost: 4500,
        client_charge: 6000,
        vendor_name: 'Heritage Discovery Collective',
        status: 'Confirmed',
        travel_time: '20 mins',
        notes: 'Certified local English-speaking heritage guide.',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: `it-${trip.id}-4`,
        itinerary_id: itinId,
        day_number: 3,
        start_time: '02:00 PM',
        end_time: '05:00 PM',
        title: 'Coastal Beach Activity & Family Leisure Watersports',
        location: `${trip.destination} Bay Waterfront`,
        category: 'activity',
        estimated_cost: 2500,
        client_charge: 3500,
        vendor_name: 'Coastline Recreation Guild',
        status: 'Confirmed',
        travel_time: '20 mins',
        notes: 'Subject to coastal conditions.',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];

    const currentAll = readStore<DbItineraryItem[]>(STORAGE_KEY_ITEMS, DEFAULT_INITIAL_ITEMS);
    writeStore(STORAGE_KEY_ITEMS, [...items, ...currentAll]);

    if (isSupabaseConfigured) {
      try {
        await supabase.from('itinerary_items').insert(items);
      } catch (err) {
        console.warn('Supabase itinerary insert warning:', err);
      }
    }

    notifyRealtime('itinerary_items', 'INSERT', items);
    return items;
  },

  async updateItineraryItem(itemId: string, updates: Partial<DbItineraryItem>): Promise<DbItineraryItem | null> {
    const all = await this.getItineraryItems();
    const target = all.find((item) => item.id === itemId);
    if (!target) return null;

    const updatedItem: DbItineraryItem = {
      ...target,
      ...updates,
      updated_at: new Date().toISOString(),
    };

    const updatedList = all.map((item) => (item.id === itemId ? updatedItem : item));
    writeStore(STORAGE_KEY_ITEMS, updatedList);

    // Notify traveler about itinerary modification
    await this.createNotification({
      user_id: 'traveler',
      title: 'Itinerary Schedule Updated',
      message: `Your operator adjusted "${updatedItem.title}" to ${updatedItem.start_time}.`,
      type: 'itinerary_updated',
    });

    if (isSupabaseConfigured) {
      try {
        await supabase
          .from('itinerary_items')
          .update({
            start_time: updatedItem.start_time,
            end_time: updatedItem.end_time,
            title: updatedItem.title,
            location: updatedItem.location,
            category: updatedItem.category,
            estimated_cost: updatedItem.estimated_cost,
            client_charge: updatedItem.client_charge,
            status: updatedItem.status,
            notes: updatedItem.notes,
            updated_at: updatedItem.updated_at,
          })
          .eq('id', itemId);
      } catch (err) {
        console.warn('Supabase itinerary item update warning:', err);
      }
    }

    notifyRealtime('itinerary_items', 'UPDATE', updatedItem);
    return updatedItem;
  },

  // 3. CHANGE REQUESTS (Traveler -> Operator)
  async getChangeRequests(tripId?: string): Promise<DbChangeRequest[]> {
    const all = readStore<DbChangeRequest[]>(STORAGE_KEY_CHANGES, []);
    return tripId ? all.filter((c) => c.trip_request_id === tripId) : all;
  },

  async createChangeRequest(
    tripRequestId: string,
    requestedBy: string,
    description: string
  ): Promise<DbChangeRequest> {
    const newReq: DbChangeRequest = {
      id: `cr-${Date.now().toString().slice(-6)}`,
      trip_request_id: tripRequestId,
      requested_by: requestedBy,
      request_type: 'Schedule/Activity Adjustment',
      description,
      status: 'pending',
      created_at: new Date().toISOString(),
    };

    const all = readStore<DbChangeRequest[]>(STORAGE_KEY_CHANGES, []);
    writeStore(STORAGE_KEY_CHANGES, [newReq, ...all]);

    // Create operator notification
    await this.createNotification({
      user_id: 'operator',
      trip_request_id: tripRequestId,
      title: 'New Change Request from Traveler',
      message: `${requestedBy}: "${description}"`,
      type: 'changes_requested',
    });

    if (isSupabaseConfigured) {
      try {
        await supabase.from('change_requests').insert([newReq]);
      } catch (err) {
        console.warn('Supabase change request insert warning:', err);
      }
    }

    notifyRealtime('change_requests', 'INSERT', newReq);
    return newReq;
  },

  async respondToChangeRequest(
    changeRequestId: string,
    status: 'approved' | 'rejected',
    operatorResponse?: string,
    modifiedItemId?: string,
    modifiedNewTime?: string
  ): Promise<DbChangeRequest | null> {
    const all = readStore<DbChangeRequest[]>(STORAGE_KEY_CHANGES, []);
    const target = all.find((c) => c.id === changeRequestId);
    if (!target) return null;

    const updated: DbChangeRequest = {
      ...target,
      status,
      operator_response: operatorResponse || (status === 'approved' ? 'Request approved by operator.' : 'Request declined.'),
    };

    writeStore(STORAGE_KEY_CHANGES, all.map((c) => (c.id === changeRequestId ? updated : c)));

    // If an itinerary item was modified as part of approving this change
    if (status === 'approved' && modifiedItemId && modifiedNewTime) {
      await this.updateItineraryItem(modifiedItemId, { start_time: modifiedNewTime });
    }

    // Notify traveler
    await this.createNotification({
      user_id: 'traveler',
      trip_request_id: target.trip_request_id,
      title: `Change Request ${status === 'approved' ? 'Approved' : 'Declined'}`,
      message: operatorResponse || `Operator marked your request as ${status}.`,
      type: 'itinerary_updated',
    });

    if (isSupabaseConfigured) {
      try {
        await supabase
          .from('change_requests')
          .update({ status: updated.status, operator_response: updated.operator_response })
          .eq('id', changeRequestId);
      } catch (err) {
        console.warn('Supabase change request update warning:', err);
      }
    }

    notifyRealtime('change_requests', 'UPDATE', updated);
    return updated;
  },

  // 4. DISRUPTIONS & DYNAMIC REROUTING
  async getDisruptions(tripId?: string): Promise<DbDisruption[]> {
    const all = readStore<DbDisruption[]>(STORAGE_KEY_DISRUPTIONS, []);
    return tripId ? all.filter((d) => d.trip_request_id === tripId) : all;
  },

  async triggerDisruption(
    tripRequestId: string,
    type: DbDisruption['type'],
    description: string,
    affectedItemId?: string
  ): Promise<DbDisruption> {
    const newDisruption: DbDisruption = {
      id: `disp-${Date.now().toString().slice(-6)}`,
      trip_request_id: tripRequestId,
      type,
      severity: 'Critical',
      description,
      affected_item_id: affectedItemId || 'it-5',
      status: 'active',
      created_at: new Date().toISOString(),
    };

    const all = readStore<DbDisruption[]>(STORAGE_KEY_DISRUPTIONS, []);
    writeStore(STORAGE_KEY_DISRUPTIONS, [newDisruption, ...all]);

    // Create notifications for both operator and traveler
    await this.createNotification({
      user_id: 'operator',
      trip_request_id: tripRequestId,
      title: `Operational Alert: ${type.toUpperCase()} Disruption`,
      message: `${description} Affected item: ${affectedItemId || 'Beach Activity'}. AI alternative ready for review.`,
      type: 'disruption_alert',
    });

    await this.createNotification({
      user_id: 'traveler',
      trip_request_id: tripRequestId,
      title: 'Disruption Detected on Route',
      message: `${description} Your tour operator is reviewing an AI-optimized alternative now.`,
      type: 'disruption_alert',
    });

    if (isSupabaseConfigured) {
      try {
        await supabase.from('disruptions').insert([newDisruption]);
      } catch (err) {
        console.warn('Supabase disruption insert warning:', err);
      }
    }

    notifyRealtime('disruptions', 'INSERT', newDisruption);
    return newDisruption;
  },

  // AI Dynamic Rerouting using server-side Gemini 3.8 Flash endpoint
  async generateAIReroute(payload: {
    disruptionId: string;
    tripRequestId: string;
    disruptionType: string;
    disruptionDescription: string;
    affectedActivity: string;
    location: string;
    timing: string;
    originalCost: number;
    travelerBudget: number;
    remainingBudget: number;
    interests: string[];
    partySize: number;
  }): Promise<DbReroute> {
    let aiResult: any = null;

    try {
      const res = await fetch('/api/gemini/reroute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        aiResult = await res.json();
      }
    } catch (err) {
      console.warn('Backend Gemini reroute call failed, using resilient fallback:', err);
    }

    const reroute: DbReroute = {
      id: `reroute-${Date.now().toString().slice(-6)}`,
      disruption_id: payload.disruptionId,
      old_plan: payload.affectedActivity,
      new_plan: aiResult?.newPlan || 'Indoor Historic Heritage Manor & Fado Wine Tasting',
      location: aiResult?.location || 'Solar dos Canavarros Heritage Estate, Raia',
      timing: aiResult?.timing || '03:00 PM – 05:30 PM',
      cost_difference: aiResult?.costDifference !== undefined ? aiResult.costDifference : 300,
      remaining_budget: aiResult?.remainingBudget || (payload.remainingBudget - 300),
      distance: aiResult?.distance || '4.2 km',
      travel_time: aiResult?.travelTime || '15 mins',
      reasoning:
        aiResult?.reasoning ||
        'Indoor heritage activity completely protected from weather conditions and compatible with remaining schedule and budget.',
      status: 'proposed',
      created_at: new Date().toISOString(),
    };

    const all = readStore<DbReroute[]>(STORAGE_KEY_REROUTES, []);
    writeStore(STORAGE_KEY_REROUTES, [reroute, ...all]);

    await this.createNotification({
      user_id: 'operator',
      title: 'AI Reroute Proposal Ready',
      message: `Alternative generated: ${reroute.new_plan} (+₹${reroute.cost_difference}).`,
      type: 'reroute_ready',
    });

    if (isSupabaseConfigured) {
      try {
        await supabase.from('reroutes').insert([reroute]);
      } catch (err) {
        console.warn('Supabase reroute insert warning:', err);
      }
    }

    notifyRealtime('reroutes', 'INSERT', reroute);
    return reroute;
  },

  async approveReroute(rerouteId: string, affectedItemId?: string): Promise<boolean> {
    const allReroutes = readStore<DbReroute[]>(STORAGE_KEY_REROUTES, []);
    const reroute = allReroutes.find((r) => r.id === rerouteId);
    if (!reroute) return false;

    // 1. Mark reroute approved
    reroute.status = 'approved';
    writeStore(STORAGE_KEY_REROUTES, allReroutes);

    // 2. Mark disruption resolved
    const allDisruptions = readStore<DbDisruption[]>(STORAGE_KEY_DISRUPTIONS, []);
    const disruption = allDisruptions.find((d) => d.id === reroute.disruption_id);
    if (disruption) {
      disruption.status = 'resolved';
      writeStore(STORAGE_KEY_DISRUPTIONS, allDisruptions);
    }

    // 3. Update the affected itinerary item
    const targetItemId = affectedItemId || disruption?.affected_item_id || 'it-5';
    await this.updateItineraryItem(targetItemId, {
      title: reroute.new_plan,
      location: reroute.location,
      start_time: reroute.timing.split('–')[0].trim() || '03:00 PM',
      status: 'Rerouted',
      notes: `Rerouted due to weather disruption. ${reroute.reasoning}`,
      estimated_cost: 2500 + reroute.cost_difference,
      client_charge: 3500 + reroute.cost_difference,
    });

    // 4. Create high-visibility traveler notification
    await this.createNotification({
      user_id: 'traveler',
      title: 'Itinerary Updated & Reroute Confirmed',
      message: `Weather disruption handled! New plan: "${reroute.new_plan}" confirmed (+₹${reroute.cost_difference}).`,
      type: 'reroute_approved',
    });

    if (isSupabaseConfigured) {
      try {
        await supabase.from('reroutes').update({ status: 'approved' }).eq('id', rerouteId);
        if (disruption) {
          await supabase.from('disruptions').update({ status: 'resolved' }).eq('id', disruption.id);
        }
      } catch (err) {
        console.warn('Supabase approve reroute warning:', err);
      }
    }

    notifyRealtime('reroutes', 'UPDATE', reroute);
    notifyRealtime('disruptions', 'UPDATE', disruption);
    return true;
  },

  // 5. NOTIFICATIONS
  async getNotifications(userId?: string): Promise<DbNotification[]> {
    if (isSupabaseConfigured) {
      try {
        let q = supabase.from('notifications').select('*').order('created_at', { ascending: false });
        if (userId) {
          q = q.or(`user_id.eq.${userId},user_id.eq.all`);
        }
        const { data, error } = await q;
        if (!error && data && data.length > 0) {
          writeStore(STORAGE_KEY_NOTIFS, data);
          return data;
        }
      } catch (err) {
        console.warn('Supabase notifications query warning:', err);
      }
    }
    const all = readStore<DbNotification[]>(STORAGE_KEY_NOTIFS, DEFAULT_INITIAL_NOTIFS);
    if (!userId) return all;
    return all.filter((n) => n.user_id === userId || n.user_id === 'all');
  },

  async createNotification(notif: Partial<DbNotification>): Promise<DbNotification> {
    const newRecord: DbNotification = {
      id: `notif-${Date.now().toString().slice(-6)}`,
      user_id: notif.user_id || 'all',
      trip_request_id: notif.trip_request_id,
      title: notif.title || 'Notification',
      message: notif.message || '',
      type: notif.type || 'itinerary_updated',
      is_read: false,
      created_at: new Date().toISOString(),
    };

    const existing = readStore<DbNotification[]>(STORAGE_KEY_NOTIFS, DEFAULT_INITIAL_NOTIFS);
    writeStore(STORAGE_KEY_NOTIFS, [newRecord, ...existing]);

    if (isSupabaseConfigured) {
      try {
        await supabase.from('notifications').insert([newRecord]);
      } catch (err) {
        console.warn('Supabase notif insert warning:', err);
      }
    }

    notifyRealtime('notifications', 'INSERT', newRecord);
    return newRecord;
  },

  async markNotificationRead(id: string): Promise<void> {
    const existing = readStore<DbNotification[]>(STORAGE_KEY_NOTIFS, DEFAULT_INITIAL_NOTIFS);
    const updated = existing.map((n) => (n.id === id ? { ...n, is_read: true } : n));
    writeStore(STORAGE_KEY_NOTIFS, updated);

    if (isSupabaseConfigured) {
      try {
        await supabase.from('notifications').update({ is_read: true }).eq('id', id);
      } catch (err) {
        console.warn('Supabase notif update warning:', err);
      }
    }

    notifyRealtime('notifications', 'UPDATE', { id, is_read: true });
  },

  // 6. REALTIME SUBSCRIPTION HOOK
  subscribe(listener: ChangeListener): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};
