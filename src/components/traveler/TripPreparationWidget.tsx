import React, { useState } from 'react';
import { Sun, CloudRain, Wind, Clock, CheckSquare, Square, Plus, Compass, Sparkles, MapPin } from 'lucide-react';
import { DESTINATION_INSIGHTS, INITIAL_CHECKLIST, ChecklistItem } from './data';

interface TripPreparationWidgetProps {
  currentDestination: string;
}

export const TripPreparationWidget: React.FC<TripPreparationWidgetProps> = ({
  currentDestination,
}) => {
  const [checklist, setChecklist] = useState<ChecklistItem[]>(INITIAL_CHECKLIST);
  const [newTaskText, setNewTaskText] = useState('');

  const weather = DESTINATION_INSIGHTS[currentDestination] || DESTINATION_INSIGHTS['Goa'];

  const toggleTask = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    const item: ChecklistItem = {
      id: `chk-${Date.now()}`,
      task: newTaskText.trim(),
      category: 'Logistics',
      completed: false,
    };
    setChecklist((prev) => [item, ...prev]);
    setNewTaskText('');
  };

  const completedCount = checklist.filter((c) => c.completed).length;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left col (6 cols): Live Destination Insights & Weather */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-[#EF9CA7]/30 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#EF9CA7]/20">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#c85f72]">
                  Live Destination Intelligence
                </span>
              </div>
              <span className="text-xs font-mono font-semibold text-[#3a1a22]">
                {weather.destination}
              </span>
            </div>

            <div className="mt-5 flex items-center justify-between gap-4">
              <div>
                <span className="text-[11px] text-[#3a1a22]/60 font-medium uppercase tracking-wider">
                  Current Forecast
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="font-mono text-4xl sm:text-5xl font-light text-[#3a1a22]">
                    {weather.temp}
                  </span>
                  <span className="text-xs text-[#c85f72] font-semibold">{weather.condition}</span>
                </div>
              </div>

              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FFDDE1] to-[#FFF5F6] text-[#c85f72] flex items-center justify-center shadow-xs">
                <Sun className="w-8 h-8 text-amber-500 animate-spin-slow" />
              </div>
            </div>

            {/* Weather detail chips */}
            <div className="grid grid-cols-3 gap-3 mt-6">
              <div className="p-3 rounded-2xl bg-[#FCF8F9] border border-[#EF9CA7]/25 text-center">
                <span className="text-[10px] text-[#3a1a22]/50 uppercase tracking-wider block">
                  Humidity
                </span>
                <span className="font-mono text-sm font-bold text-[#3a1a22] mt-0.5 block">
                  {weather.humidity}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-[#FCF8F9] border border-[#EF9CA7]/25 text-center">
                <span className="text-[10px] text-[#3a1a22]/50 uppercase tracking-wider block">
                  Sunset
                </span>
                <span className="font-mono text-sm font-bold text-[#c85f72] mt-0.5 block">
                  {weather.sunset}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-[#FCF8F9] border border-[#EF9CA7]/25 text-center">
                <span className="text-[10px] text-[#3a1a22]/50 uppercase tracking-wider block">
                  Prime Season
                </span>
                <span className="text-[11px] font-semibold text-[#3a1a22] mt-0.5 block">
                  {weather.bestSeason}
                </span>
              </div>
            </div>
          </div>

          {/* Local Tip from Certified Operator */}
          <div className="mt-6 p-4 rounded-2xl bg-[#FFF5F6] border border-[#EF9CA7]/40">
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#c85f72] mb-1">
              <Compass className="w-3.5 h-3.5" />
              <span>Operator Local Advisory</span>
            </div>
            <p className="text-xs text-[#3a1a22]/80 leading-relaxed">
              {weather.localTip}
            </p>
          </div>
        </div>

        {/* Right col (6 cols): Travel Readiness & Interactive Checklist */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-[#EF9CA7]/30 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#EF9CA7]/20">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#c85f72] block">
                  Pre-Departure Preparedness
                </span>
                <h3 className="font-cormorant text-2xl font-normal text-[#3a1a22]">
                  Trip Readiness Checklist
                </h3>
              </div>
              <div className="text-right">
                <span className="font-mono text-xs font-bold text-[#c85f72]">
                  {completedCount} / {checklist.length} Completed
                </span>
                <div className="w-24 h-1.5 bg-[#FFDDE1] rounded-full overflow-hidden mt-1">
                  <div
                    style={{ width: `${(completedCount / checklist.length) * 100}%` }}
                    className="bg-[#c85f72] h-full rounded-full transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Checklist items */}
            <div className="mt-4 space-y-2 max-h-56 overflow-y-auto pr-1">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleTask(item.id)}
                  className={`p-2.5 rounded-xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                    item.completed
                      ? 'bg-emerald-50/60 border-emerald-200 text-[#3a1a22]/60'
                      : 'bg-[#FCF8F9] hover:bg-[#FFF5F6] border-[#EF9CA7]/25 text-[#3a1a22]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 text-xs">
                    {item.completed ? (
                      <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-[#EF9CA7] shrink-0" />
                    )}
                    <span className={item.completed ? 'line-through text-[#3a1a22]/50' : 'font-medium'}>
                      {item.task}
                    </span>
                  </div>
                  <span className="text-[9px] uppercase font-mono px-2 py-0.5 rounded-md bg-white border border-[#EF9CA7]/30 text-[#c85f72] shrink-0">
                    {item.category}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Add custom item */}
          <form onSubmit={handleAddTask} className="mt-4 pt-3 border-t border-[#EF9CA7]/20 flex gap-2">
            <input
              type="text"
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              placeholder="Add personal packing or document task..."
              className="flex-1 px-3 py-2 rounded-xl bg-[#FCF8F9] border border-[#EF9CA7]/30 text-xs text-[#3a1a22] focus:outline-none focus:border-[#c85f72]"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#c85f72] hover:bg-[#3a1a22] text-white text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-1 cursor-pointer shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
