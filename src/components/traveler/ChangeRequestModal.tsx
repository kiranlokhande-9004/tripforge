import React, { useState } from 'react';
import { X, Send, Clock, Sparkles, CheckCircle2 } from 'lucide-react';

interface ChangeRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (description: string) => Promise<void>;
  tripDestination: string;
}

export const ChangeRequestModal: React.FC<ChangeRequestModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  tripDestination,
}) => {
  const [description, setDescription] = useState(
    'Can we move the beach watersports activity from 10:00 AM to the afternoon (02:00 PM)?'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setIsSubmitting(true);
    await onSubmit(description);
    setIsSubmitting(false);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-3xl border border-[#EF9CA7]/40 shadow-2xl max-w-lg w-full p-6 sm:p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-[#FFDDE1]/40 text-[#3a1a22]/70 hover:text-[#3a1a22] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-8 h-8 rounded-xl bg-[#FFDDE1] text-[#c85f72] flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#c85f72]">
            Tour Operator Direct Channel
          </span>
        </div>

        <h3 className="font-cormorant text-2xl sm:text-3xl font-normal text-[#3a1a22]">
          Request Itinerary Adjustment
        </h3>
        <p className="text-xs text-[#3a1a22]/70 mt-1 mb-6">
          Submit custom timing or activity change requests for your {tripDestination} journey. Your assigned operator will review and update the master schedule in real-time.
        </p>

        {submitted ? (
          <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2 animate-fadeIn">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <div className="font-semibold text-sm text-emerald-950">Change Request Dispatched!</div>
            <div className="text-xs text-emerald-800">
              Your tour operator received your request via Supabase Realtime and is updating the itinerary.
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#3a1a22] mb-1.5">
                Describe Requested Change:
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Can we move the beach activity to the afternoon?"
                className="w-full p-3.5 rounded-2xl border border-[#EF9CA7]/40 focus:border-[#c85f72] focus:ring-2 focus:ring-[#EF9CA7]/30 text-xs text-[#3a1a22] outline-none transition-all resize-none bg-[#FCF8F9]"
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#3a1a22]/60 bg-[#FFDDE1]/30 p-3 rounded-xl border border-[#EF9CA7]/30">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#c85f72]" />
                Direct Supabase sync to Vanguard Coastal Escapes
              </span>
              <span className="font-mono text-[#c85f72] font-semibold">Live Realtime</span>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-[#EF9CA7]/40 hover:bg-[#FFDDE1]/30 text-xs font-semibold text-[#3a1a22] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-[#c85f72] hover:bg-[#3a1a22] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center gap-2 cursor-pointer btn-hover-physics"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Transmitting to Operator...' : 'Submit Change Request'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
