import React, { useState } from 'react';
import {
  X,
  Plane,
  Bed,
  Camera,
  Car,
  Plus,
  Check,
  Star,
  Clock,
  MapPin,
  ShieldCheck,
} from 'lucide-react';
import { TripBookingItem } from './data';

interface CategoryBookingModalProps {
  isOpen: boolean;
  category: 'flight' | 'hotel' | 'activity' | 'transport' | null;
  onClose: () => void;
  onAddItem: (item: TripBookingItem) => void;
  existingItemIds: string[];
}

export const CategoryBookingModal: React.FC<CategoryBookingModalProps> = ({
  isOpen,
  category,
  onClose,
  onAddItem,
  existingItemIds,
}) => {
  if (!isOpen || !category) return null;

  const catalog: Record<string, TripBookingItem[]> = {
    flight: [
      {
        id: 'fl-1',
        category: 'flight',
        title: 'Air India Express IX-412',
        subtitle: 'BOM → GOX · Morning Departure',
        cost: 6200,
        details: 'Non-stop 1h 15m · Free 15kg baggage included',
      },
      {
        id: 'fl-2',
        category: 'flight',
        title: 'Vistara Club Prime UK-882',
        subtitle: 'BOM → GOI · Gourmet Meal & Priority',
        cost: 9500,
        details: 'Premium Economy · Complimentary lounge access at BOM T2',
      },
      {
        id: 'fl-3',
        category: 'flight',
        title: 'Akasa Air QP-1304',
        subtitle: 'BOM → GOX · Sunset Direct',
        cost: 4800,
        details: 'Eco Saver · USB-C charging on every seat',
      },
    ],
    hotel: [
      {
        id: 'ht-1',
        category: 'hotel',
        title: 'W Goa Luxury Retreat',
        subtitle: 'Vagator Beachfront',
        cost: 22000,
        details: 'Marvelous Room · Ocean plunge access & Rockpool DJ access',
      },
      {
        id: 'ht-2',
        category: 'hotel',
        title: 'Fort Tiracol Heritage Bastion',
        subtitle: 'Tiracol Cliffside Suite',
        cost: 16500,
        details: '17th-century Portuguese fort overlooking Arabian Sea',
      },
      {
        id: 'ht-3',
        category: 'hotel',
        title: 'Wildernest Nature Resort',
        subtitle: 'Chorla Ghats Mist Forest',
        cost: 11000,
        details: 'Eco-cottage with infinity pool overlooking Sahyadri valley',
      },
    ],
    activity: [
      {
        id: 'ac-1',
        category: 'activity',
        title: 'Private Dolphin Cruise & Snorkeling',
        subtitle: 'Grand Island Marine Reserve',
        cost: 4500,
        details: 'Private speedboat, snorkeling gear, and chilled tropical fruits',
      },
      {
        id: 'ac-2',
        category: 'activity',
        title: 'Goan Artisan Feni Distillery Tour',
        subtitle: 'Valpoi Cashew Orchards',
        cost: 3200,
        details: 'Pot-still heritage tour with private copper vessel tasting',
      },
      {
        id: 'ac-3',
        category: 'activity',
        title: 'Dudhsagar Waterfalls Jeep Safari',
        subtitle: 'Bhagwan Mahavir Sanctuary',
        cost: 5800,
        details: '4x4 jungle trek, fresh natural pool swim & forest naturalist',
      },
    ],
    transport: [
      {
        id: 'tr-1',
        category: 'transport',
        title: 'BMW 5-Series Executive Chauffeur',
        subtitle: '3-Day Luxury Package',
        cost: 12500,
        details: 'Professional chauffeur, English/Konkani speaking, bottled water',
      },
      {
        id: 'tr-2',
        category: 'transport',
        title: 'Royal Enfield Classic 350 Rental',
        subtitle: '4-Day Coastal Riding Kit',
        cost: 3600,
        details: 'Dual helmets, magnetic phone mount, full insurance coverage',
      },
      {
        id: 'tr-3',
        category: 'transport',
        title: 'Electric Vespa Scooter Pair',
        subtitle: 'North Goa Neighborhood Hop',
        cost: 2400,
        details: 'Range 90km, portable charger & roadside assistance',
      },
    ],
  };

  const getCategoryMeta = () => {
    switch (category) {
      case 'flight':
        return { title: 'Add Flights to Itinerary', icon: Plane };
      case 'hotel':
        return { title: 'Select Luxury Accommodation', icon: Bed };
      case 'activity':
        return { title: 'Add Curated Experiences', icon: Camera };
      case 'transport':
        return { title: 'Add Transit & Vehicles', icon: Car };
    }
  };

  const meta = getCategoryMeta();
  const Icon = meta.icon;
  const items = catalog[category] || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-3xl border border-[#EF9CA7]/40 shadow-2xl max-w-xl w-full max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#EF9CA7]/30 flex items-center justify-between bg-gradient-to-r from-[#FFF5F6] to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFDDE1] text-[#c85f72] flex items-center justify-center shadow-xs">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-semibold text-[#c85f72] uppercase tracking-[0.2em] block">
                TripForge Inventory
              </span>
              <h3 className="font-cormorant text-2xl font-medium text-[#3a1a22]">
                {meta.title}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#3a1a22]/50 hover:text-[#c85f72] hover:bg-[#FFDDE1]/40 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of items */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {items.map((item) => {
            const isAdded = existingItemIds.includes(item.id);
            return (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-[#FCF8F9] hover:bg-[#FFF5F6] border border-[#EF9CA7]/40 transition-all flex items-center justify-between gap-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-[#3a1a22]">
                      {item.title}
                    </h4>
                    <span className="text-[10px] text-[#c85f72] font-medium bg-[#FFDDE1] px-2 py-0.5 rounded-full">
                      Verified
                    </span>
                  </div>
                  <div className="text-xs text-[#3a1a22]/70 mt-0.5">{item.subtitle}</div>
                  <div className="text-[11px] text-[#3a1a22]/60 mt-1">{item.details}</div>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-mono text-sm font-bold text-[#c85f72] mb-2">
                    ₹{item.cost.toLocaleString()}
                  </div>

                  <button
                    onClick={() => onAddItem(item)}
                    disabled={isAdded}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer flex items-center gap-1 ${
                      isAdded
                        ? 'bg-emerald-100 text-emerald-800 cursor-default'
                        : 'bg-[#c85f72] hover:bg-[#3a1a22] text-white shadow-xs'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add to Trip</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#EF9CA7]/30 bg-[#FCF8F9] flex items-center justify-between text-xs text-[#3a1a22]/70">
          <span>Adding items dynamically recalibrates your budget and operator quote.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white border border-[#EF9CA7]/50 hover:bg-[#FFDDE1]/40 text-[#3a1a22] font-semibold cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
