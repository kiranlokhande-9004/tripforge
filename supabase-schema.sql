-- ==============================================================================
-- TripForge Production Supabase Schema
-- Architecture: PS ID-7 Tour Operator & Traveler Realtime Synchronization System
-- ==============================================================================

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'traveler' CHECK (role IN ('traveler', 'operator', 'admin')),
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Trip Requests Table
CREATE TABLE IF NOT EXISTS public.trip_requests (
  id TEXT PRIMARY KEY,
  traveler_id TEXT NOT NULL,
  traveler_name TEXT NOT NULL DEFAULT 'Clara Voyager',
  traveler_email TEXT NOT NULL DEFAULT 'clara.voyager@tripforge.com',
  origin TEXT NOT NULL DEFAULT 'Mumbai',
  destination TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  duration TEXT NOT NULL DEFAULT '5 Days · 4 Nights',
  travelers_count INTEGER NOT NULL DEFAULT 2,
  party_type TEXT NOT NULL DEFAULT 'Couples',
  budget NUMERIC NOT NULL DEFAULT 50000,
  currency TEXT NOT NULL DEFAULT 'INR',
  interests TEXT[] DEFAULT ARRAY[]::TEXT[],
  accommodation_preference TEXT DEFAULT 'Boutique Hotel / Villa',
  transport_preference TEXT DEFAULT 'Private Chauffeur Car',
  special_requests TEXT,
  status TEXT NOT NULL DEFAULT 'Pending Review' CHECK (status IN ('Pending Review', 'Approved', 'Changes Requested', 'Rejected', 'Planning', 'Confirmed', 'Ongoing')),
  urgency TEXT DEFAULT 'Normal' CHECK (urgency IN ('Normal', 'High')),
  operational_notes TEXT,
  assigned_operator_id TEXT DEFAULT 'OP-4920',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Itineraries Table
CREATE TABLE IF NOT EXISTS public.itineraries (
  id TEXT PRIMARY KEY,
  trip_request_id TEXT NOT NULL REFERENCES public.trip_requests(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  total_cost NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft', 'Proposed', 'Approved', 'Active', 'Archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. Itinerary Items Table
CREATE TABLE IF NOT EXISTS public.itinerary_items (
  id TEXT PRIMARY KEY,
  itinerary_id TEXT NOT NULL REFERENCES public.itineraries(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL DEFAULT 1,
  start_time TEXT NOT NULL,
  end_time TEXT,
  title TEXT NOT NULL,
  location TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('flight', 'hotel', 'activity', 'transport', 'dining')),
  estimated_cost NUMERIC NOT NULL DEFAULT 0,
  client_charge NUMERIC NOT NULL DEFAULT 0,
  vendor_name TEXT,
  status TEXT NOT NULL DEFAULT 'Confirmed' CHECK (status IN ('Confirmed', 'Pending Operator', 'Scheduled', 'Rerouted', 'Cancelled')),
  travel_time TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. Change Requests Table
CREATE TABLE IF NOT EXISTS public.change_requests (
  id TEXT PRIMARY KEY DEFAULT ('cr-' || substr(md5(random()::text), 1, 8)),
  trip_request_id TEXT NOT NULL REFERENCES public.trip_requests(id) ON DELETE CASCADE,
  requested_by TEXT NOT NULL,
  request_type TEXT NOT NULL DEFAULT 'Time/Activity Adjustment',
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  operator_response TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. Disruptions Table
CREATE TABLE IF NOT EXISTS public.disruptions (
  id TEXT PRIMARY KEY DEFAULT ('disp-' || substr(md5(random()::text), 1, 8)),
  trip_request_id TEXT NOT NULL REFERENCES public.trip_requests(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('weather', 'transport', 'vendor', 'venue', 'logistics')),
  severity TEXT NOT NULL DEFAULT 'Warning' CHECK (severity IN ('Warning', 'Critical', 'Advisory')),
  description TEXT NOT NULL,
  affected_item_id TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'rerouting', 'resolved', 'dismissed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. Reroutes Table
CREATE TABLE IF NOT EXISTS public.reroutes (
  id TEXT PRIMARY KEY DEFAULT ('reroute-' || substr(md5(random()::text), 1, 8)),
  disruption_id TEXT NOT NULL REFERENCES public.disruptions(id) ON DELETE CASCADE,
  old_plan TEXT NOT NULL,
  new_plan TEXT NOT NULL,
  location TEXT,
  timing TEXT,
  cost_difference NUMERIC NOT NULL DEFAULT 0,
  remaining_budget NUMERIC,
  distance TEXT,
  travel_time TEXT,
  reasoning TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'proposed' CHECK (status IN ('proposed', 'approved', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8. Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
  id TEXT PRIMARY KEY DEFAULT ('notif-' || substr(md5(random()::text), 1, 8)),
  user_id TEXT NOT NULL,
  trip_request_id TEXT REFERENCES public.trip_requests(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('request_created', 'trip_approved', 'changes_requested', 'itinerary_updated', 'disruption_alert', 'reroute_ready', 'reroute_approved')),
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itineraries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itinerary_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.change_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disruptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reroutes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Anonymous and Authenticated Policies for Hackathon Demonstration
CREATE POLICY "Public read/write access for profiles" ON public.profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public read/write access for trip_requests" ON public.trip_requests FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public read/write access for itineraries" ON public.itineraries FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public read/write access for itinerary_items" ON public.itinerary_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public read/write access for change_requests" ON public.change_requests FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public read/write access for disruptions" ON public.disruptions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public read/write access for reroutes" ON public.reroutes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public read/write access for notifications" ON public.notifications FOR ALL USING (true) WITH CHECK (true);

-- Enable Supabase Realtime for instant synchronization
ALTER PUBLICATION supabase_realtime ADD TABLE public.trip_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.itineraries;
ALTER PUBLICATION supabase_realtime ADD TABLE public.itinerary_items;
ALTER PUBLICATION supabase_realtime ADD TABLE public.change_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.disruptions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.reroutes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
