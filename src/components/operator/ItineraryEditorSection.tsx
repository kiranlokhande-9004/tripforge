import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Plus,
  Trash2,
  Edit2,
  DollarSign,
  Building2,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  X,
  Check,
} from 'lucide-react';
import { ItineraryItemOp } from './operatorData';

interface ItineraryEditorSectionProps {
  items: ItineraryItemOp[];
  onUpdateItems: (newItems: ItineraryItemOp[]) => void;
  onNavigateToDependencyEngine: () => void;
}

export const ItineraryEditorSection: React.FC<ItineraryEditorSectionProps> = ({
  items,
  onUpdateItems,
  onNavigateToDependencyEngine,
}) => {
  const [selectedDay, setSelectedDay] = useState<number>(0); // 0 = all days
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ItineraryItemOp | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // New activity form state
  const [newDay, setNewDay] = useState<number>(1);
  const [newTime, setNewTime] = useState<string>('03:00 PM');
  const [newActivity, setNewActivity] = useState<string>('');
  const [newLocation, setNewLocation] = useState<string>('');
  const [newCategory, setNewCategory] = useState<'activity' | 'transport' | 'hotel' | 'dining'>('activity');
  const [newVendor, setNewVendor] = useState<string>('Goa Heritage Walks Guild');
  const [newVendorCost, setNewVendorCost] = useState<number>(2000);
  const [newClientCharge, setNewClientCharge] = useState<number>(2800);

  const days = Array.from(new Set(items.map((i) => i.day))).sort();

  const filteredItems = selectedDay === 0 ? items : items.filter((i) => i.day === selectedDay);

  const handleDelete = (id: string) => {
    const updated = items.filter((item) => item.id !== id);
    onUpdateItems(updated);
    setNotification('Activity removed. Recalculated timeline and transit buffers.');
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSaveNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActivity) return;

    const newItem: ItineraryItemOp = {
      id: `op-it-${Date.now()}`,
      day: newDay,
      time: newTime,
      activity: newActivity,
      location: newLocation || 'Goa',
      category: newCategory,
      vendorName: newVendor,
      vendorCost: Number(newVendorCost),
      clientCharge: Number(newClientCharge),
      status: 'Confirmed',
      travelTime: '20 mins',
      notes: 'Added by Operator Console',
    };

    onUpdateItems([...items, newItem]);
    setIsAddModalOpen(false);
    setNewActivity('');
    setNewLocation('');
    setNotification(`"${newActivity}" added to Day ${newDay}. Autonomous dependency graph updated!`);
    setTimeout(() => setNotification(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="backdrop-blur-xl bg-white/90 border border-[#EF9CA7]/30 rounded-3xl p-6 sm:p-8 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFDDE1]/60 text-xs font-bold text-[#c85f72] mb-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>OPERATIONAL ITINERARY BUILDER</span>
          </div>
          <h2 className="font-cormorant text-3xl font-normal text-[#3a1a22]">
            Day-by-Day Master Schedule & Vendors
          </h2>
          <p className="text-xs text-[#3a1a22]/70 mt-1 max-w-xl">
            Live schedule for Clara Voyager (TF-GOA-2026). Add, edit, or shift activities—TripForge flags vendor conflicts and transit timing gaps automatically.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onNavigateToDependencyEngine}
            className="px-4 py-2 rounded-xl bg-white border border-[#EF9CA7]/40 text-[#c85f72] hover:bg-[#FFDDE1]/30 text-xs font-semibold tracking-wide transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#c85f72]" />
            <span>View Dependency Ripple</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#c85f72] hover:bg-[#3a1a22] text-white text-xs font-bold tracking-wide transition-all cursor-pointer flex items-center gap-1.5 shadow-md btn-hover-physics"
          >
            <Plus className="w-4 h-4" />
            <span>Add Activity</span>
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center justify-between shadow-xs animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold">{notification}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-emerald-700 hover:text-emerald-950">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Day Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setSelectedDay(0)}
          className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer shrink-0 ${
            selectedDay === 0
              ? 'bg-[#c85f72] text-white shadow-xs'
              : 'bg-white border border-[#EF9CA7]/30 text-[#3a1a22]/70 hover:bg-[#FFDDE1]/40'
          }`}
        >
          All Days (5 Days)
        </button>

        {days.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer shrink-0 ${
              selectedDay === day
                ? 'bg-[#c85f72] text-white shadow-xs'
                : 'bg-white border border-[#EF9CA7]/30 text-[#3a1a22]/70 hover:bg-[#FFDDE1]/40'
            }`}
          >
            Day 0{day}
          </button>
        ))}
      </div>

      {/* Itinerary Timeline */}
      <div className="space-y-3">
        {filteredItems.map((item, idx) => {
          const isWarning = item.status === 'Requires Attention';
          const margin = item.clientCharge - item.vendorCost;

          return (
            <div
              key={item.id}
              className={`backdrop-blur-xl border rounded-3xl p-5 shadow-xs transition-all card-hover-physics ${
                isWarning
                  ? 'bg-amber-50/90 border-amber-300'
                  : 'bg-white/95 border-[#EF9CA7]/30'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Time & Day Badge */}
                <div className="flex items-start gap-4">
                  <div className="text-center shrink-0 w-20 py-2 rounded-2xl bg-[#FCF8F9] border border-[#EF9CA7]/30">
                    <span className="text-[10px] font-mono text-[#c85f72] font-bold block uppercase">
                      Day 0{item.day}
                    </span>
                    <span className="font-mono text-xs font-bold text-[#3a1a22]">{item.time}</span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#FFDDE1]/60 text-[#c85f72]">
                        {item.category}
                      </span>
                      {isWarning && (
                        <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1 animate-pulse">
                          <AlertTriangle className="w-2.5 h-2.5" />
                          <span>Advisory Alert</span>
                        </span>
                      )}
                      <span className="text-[9px] text-[#3a1a22]/50 font-mono">
                        Transit Buffer: {item.travelTime}
                      </span>
                    </div>

                    <h3 className="font-semibold text-sm text-[#3a1a22] mt-1">{item.activity}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-[#3a1a22]/70 mt-0.5">
                      <MapPin className="w-3 h-3 text-[#c85f72]" />
                      <span>{item.location}</span>
                    </div>

                    {item.notes && (
                      <p className="text-[11px] text-[#3a1a22]/60 italic mt-1">{item.notes}</p>
                    )}
                  </div>
                </div>

                {/* Vendor & Financials */}
                <div className="flex flex-wrap md:flex-col items-start md:items-end justify-between gap-2 border-t md:border-t-0 pt-2 md:pt-0 border-[#EF9CA7]/20 text-xs">
                  <div className="flex items-center gap-1.5 text-[#3a1a22]">
                    <Building2 className="w-3.5 h-3.5 text-[#c85f72]" />
                    <span className="font-semibold">{item.vendorName}</span>
                  </div>

                  <div className="flex items-center gap-3 font-mono text-[11px]">
                    <span className="text-[#3a1a22]/60">Cost: ₹{item.vendorCost.toLocaleString()}</span>
                    <span>•</span>
                    <span className="text-[#c85f72] font-semibold">Billed: ₹{item.clientCharge.toLocaleString()}</span>
                    <span>•</span>
                    <span className="text-emerald-700 font-bold">Margin: +₹{margin.toLocaleString()}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-1">
                    <button
                      onClick={onNavigateToDependencyEngine}
                      className="px-2.5 py-1 rounded-lg bg-white border border-[#EF9CA7]/40 text-[#c85f72] hover:bg-[#FFDDE1]/30 text-[10px] font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Test Ripple</span>
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Remove Activity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ADD ACTIVITY MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white/95 backdrop-blur-2xl border border-[#EF9CA7]/40 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-modal-in">
            <div className="flex items-center justify-between pb-3 border-b border-[#EF9CA7]/30">
              <h3 className="font-cormorant text-2xl font-normal text-[#3a1a22]">
                Add Activity to Itinerary
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-[#3a1a22] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNew} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#3a1a22]/70 block mb-1">
                    Target Day
                  </label>
                  <select
                    value={newDay}
                    onChange={(e) => setNewDay(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-[#EF9CA7]/40 bg-white"
                  >
                    {[1, 2, 3, 4, 5].map((d) => (
                      <option key={d} value={d}>
                        Day 0{d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-[#3a1a22]/70 block mb-1">
                    Scheduled Time
                  </label>
                  <input
                    type="text"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    placeholder="e.g. 03:00 PM"
                    className="w-full p-2.5 rounded-xl border border-[#EF9CA7]/40 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-[#3a1a22]/70 block mb-1">
                  Activity Name
                </label>
                <input
                  type="text"
                  required
                  value={newActivity}
                  onChange={(e) => setNewActivity(e.target.value)}
                  placeholder="e.g. Sunset Dolphin Spotting & Champagne"
                  className="w-full p-2.5 rounded-xl border border-[#EF9CA7]/40 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#3a1a22]/70 block mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="e.g. Sinquerim Jetty"
                    className="w-full p-2.5 rounded-xl border border-[#EF9CA7]/40 bg-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-[#3a1a22]/70 block mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-[#EF9CA7]/40 bg-white"
                  >
                    <option value="activity">Experience / Tour</option>
                    <option value="dining">Culinary / Dining</option>
                    <option value="transport">Chauffeur / Transit</option>
                    <option value="hotel">Lodging / Stay</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#3a1a22]/70 block mb-1">
                    Vendor Cost (₹)
                  </label>
                  <input
                    type="number"
                    value={newVendorCost}
                    onChange={(e) => setNewVendorCost(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-[#EF9CA7]/40 bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-[#3a1a22]/70 block mb-1">
                    Client Price (₹)
                  </label>
                  <input
                    type="number"
                    value={newClientCharge}
                    onChange={(e) => setNewClientCharge(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-[#EF9CA7]/40 bg-white font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#EF9CA7]/30 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 text-[#3a1a22] text-xs font-semibold hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#c85f72] text-white text-xs font-bold hover:bg-[#3a1a22] shadow-sm btn-hover-physics"
                >
                  Insert & Auto-Sync
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
