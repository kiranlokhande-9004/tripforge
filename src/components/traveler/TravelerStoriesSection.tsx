import React from 'react';
import { Star, ShieldCheck, Quote, Sparkles, CheckCircle2 } from 'lucide-react';
import { TRAVELER_STORIES } from './data';

export const TravelerStoriesSection: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      <div className="rounded-3xl bg-gradient-to-br from-[#FFF5F6] via-white to-[#FFDDE1]/30 p-6 sm:p-10 border border-[#EF9CA7]/40 shadow-lg">
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#c85f72] block mb-1">
              Verified Experiences
            </span>
            <h2 className="font-cormorant text-3xl sm:text-4xl font-normal text-[#3a1a22]">
              Voices of the Forge
            </h2>
            <p className="text-xs sm:text-sm text-[#3a1a22]/70 mt-1 max-w-xl">
              Authentic journey logs from travelers who escaped standard packaged tours with TripForge's real-time operator network and autonomous rerouting protection.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="text-right">
              <div className="font-mono text-xl font-bold text-[#c85f72]">4.98 / 5.0</div>
              <div className="text-[10px] text-[#3a1a22]/60">From 1,240+ Verified Journeys</div>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-[#FFDDE1] text-[#c85f72] flex items-center justify-center font-bold">
              ★
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TRAVELER_STORIES.map((story) => (
            <div
              key={story.id}
              className="p-6 rounded-2xl bg-white border border-[#EF9CA7]/30 shadow-xs flex flex-col justify-between"
            >
              <div>
                {/* Header: Author avatar & stars */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={story.avatar}
                      alt={story.author}
                      className="w-11 h-11 rounded-full object-cover border-2 border-[#EF9CA7]/40 shadow-xs"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-[#3a1a22] leading-tight">
                        {story.author}
                      </h4>
                      <div className="text-[10px] text-[#c85f72] font-medium">
                        {story.destination} · {story.date}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-0.5">
                    {[...Array(story.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#c85f72] text-[#c85f72]" />
                    ))}
                  </div>
                </div>

                {/* Review Text */}
                <p className="text-xs text-[#3a1a22]/80 leading-relaxed italic relative">
                  "{story.review}"
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-[#EF9CA7]/20 space-y-1.5">
                <div className="text-[10px] text-[#3a1a22]/60 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>Operator: <strong className="text-[#3a1a22]">{story.operatorReviewed}</strong></span>
                </div>
                {story.rerouteExperience && (
                  <div className="text-[10px] text-[#c85f72] bg-[#FFDDE1]/40 px-2 py-0.5 rounded flex items-center gap-1 font-medium">
                    <Sparkles className="w-3 h-3" />
                    <span>{story.rerouteExperience}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
