import React from 'react';
import { X, ShieldCheck, Mail, User, Bell, Globe, DollarSign, Sparkles } from 'lucide-react';
import { TripData } from './data';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTrip: TripData;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, activeTrip }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-3xl border border-[#EF9CA7]/40 shadow-2xl max-w-md w-full overflow-hidden">
        <div className="p-6 border-b border-[#EF9CA7]/30 flex items-center justify-between bg-gradient-to-r from-[#FFF5F6] to-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-[#c85f72] to-[#FFDDE1]">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                alt="Clara Voyager"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-semibold text-base text-[#3a1a22]">Clara Voyager</h3>
              <div className="text-xs text-[#c85f72] font-mono">Bespoke Club Tier 1 Member</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#FFDDE1]/40 text-[#3a1a22]/60 hover:text-[#3a1a22]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs">
          <div className="p-3.5 rounded-2xl bg-[#FCF8F9] border border-[#EF9CA7]/25 space-y-2">
            <div className="flex justify-between">
              <span className="text-[#3a1a22]/60">Email:</span>
              <span className="font-semibold text-[#3a1a22]">clara.voyager@tripforge.com</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#3a1a22]/60">Member ID:</span>
              <span className="font-mono text-[#c85f72] font-semibold">TF-VIP-8841</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#3a1a22]/60">Active Journey:</span>
              <span className="font-semibold text-[#3a1a22]">{activeTrip.origin} → {activeTrip.destination}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200">
            <div className="flex items-center gap-1.5 font-bold text-emerald-800 mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Privilege Verified</span>
            </div>
            <p className="text-[11px] text-emerald-900/80 leading-relaxed">
              You are entitled to 0-fee autonomous dynamic rerouting on all bespoke itineraries and 24/7 dedicated local operator standby.
            </p>
          </div>
        </div>

        <div className="px-6 py-4 bg-[#FCF8F9] border-t border-[#EF9CA7]/20 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#c85f72] hover:bg-[#3a1a22] text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [currency, setCurrency] = React.useState('INR');
  const [notifications, setNotifications] = React.useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-3xl border border-[#EF9CA7]/40 shadow-2xl max-w-md w-full overflow-hidden">
        <div className="p-6 border-b border-[#EF9CA7]/30 flex items-center justify-between bg-gradient-to-r from-[#FFF5F6] to-white">
          <h3 className="font-cormorant text-2xl font-normal text-[#3a1a22]">
            Platform Preferences
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#FFDDE1]/40 text-[#3a1a22]/60 hover:text-[#3a1a22]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs">
          {/* Currency */}
          <div className="p-3.5 rounded-2xl bg-[#FCF8F9] border border-[#EF9CA7]/25 flex items-center justify-between">
            <span className="font-semibold text-[#3a1a22]">Display Currency</span>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-white border border-[#EF9CA7]/40 text-xs font-mono font-semibold text-[#c85f72] focus:outline-none"
            >
              <option value="INR">INR (₹ Indian Rupee)</option>
              <option value="USD">USD ($ US Dollar)</option>
              <option value="EUR">EUR (€ Euro)</option>
              <option value="GBP">GBP (£ British Pound)</option>
            </select>
          </div>

          {/* Notifications toggle */}
          <div className="p-3.5 rounded-2xl bg-[#FCF8F9] border border-[#EF9CA7]/25 flex items-center justify-between">
            <div>
              <div className="font-semibold text-[#3a1a22]">Instant Disruption Alerts</div>
              <div className="text-[11px] text-[#3a1a22]/60 mt-0.5">Receive immediate notifications when weather/traffic reroutes occur</div>
            </div>
            <input
              type="checkbox"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
              className="w-4 h-4 accent-[#c85f72] cursor-pointer"
            />
          </div>
        </div>

        <div className="px-6 py-4 bg-[#FCF8F9] border-t border-[#EF9CA7]/20 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#c85f72] hover:bg-[#3a1a22] text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
};
