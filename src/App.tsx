import React, { useState, useEffect, useRef } from 'react';
import { SignInPage } from './components/SignInPage';
import { TravelerDashboard } from './components/TravelerDashboard';
import { OperatorDashboard } from './components/OperatorDashboard';

export default function App() {
  const [navOpen, setNavOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState(() => {
    return typeof window !== 'undefined' ? window.location.pathname : '/';
  });
  const videoRef = useRef<HTMLVideoElement>(null);
  const navRef = useRef<HTMLDivElement>(null);

  // Ensure video autoplays smoothly on landing page
  useEffect(() => {
    if (currentPath === '/' && videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay policy fallback
      });
    }
  }, [currentPath]);

  // Sync route with browser history (back/forward buttons)
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Close navigation menu if clicked outside on landing page
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setNavOpen(false);
      }
    };
    if (navOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [navOpen]);

  const navigateTo = (path: string) => {
    window.history.pushState(null, '', path);
    setCurrentPath(path);
    setNavOpen(false);
  };

  // Route 1: Sign In Page
  if (currentPath === '/signin') {
    return <SignInPage onNavigate={navigateTo} />;
  }

  // Route 2: Traveler Dashboard (staged placeholder)
  if (currentPath === '/traveler') {
    return <TravelerDashboard onNavigate={navigateTo} />;
  }

  // Route 3: Tour Operator Dashboard (staged placeholder)
  if (currentPath === '/operator') {
    return <OperatorDashboard onNavigate={navigateTo} />;
  }

  // Route 4: TripForge AI Cinematic Showcase
  if (currentPath === '/ai' || currentPath === '/tripforge-ai') {
    return (
      <iframe
        src="/tripforge-ai.html"
        title="TripForge AI Cinematic Showcase"
        className="w-full h-full border-0 fixed inset-0 z-50 bg-[#030308]"
      />
    );
  }

  // Route 5: Discover (placeholder modal / banner)
  if (currentPath === '/discover') {
    return (
      <div className="fixed inset-0 z-40 flex items-center justify-center p-6 bg-gradient-to-br from-[#FFF5F6] via-[#FFDDE1]/60 to-[#FCE6E9]">
        <div className="bg-white/85 backdrop-blur-xl border border-white/80 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
          <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#c85f72] block mb-2">
            TripForge
          </span>
          <h2 className="font-cormorant text-3xl font-medium text-[#3a1a22] mb-2">
            Discover
          </h2>
          <p className="font-inter text-xs text-[#3a1a22]/70 mb-6">
            Curated destinations and inspiration discovery will arrive in the next step.
          </p>
          <button
            onClick={() => navigateTo('/')}
            className="w-full py-2.5 px-4 rounded-xl bg-[#c85f72] text-white font-inter text-xs tracking-widest font-semibold hover:bg-[#3a1a22] transition-colors duration-200 cursor-pointer shadow-md"
          >
            BACK TO TRIPFORGE
          </button>
        </div>
      </div>
    );
  }

  // Default Route: LANDING PAGE (Exact and unchanged)
  return (
    <div className="relative w-screen h-screen overflow-hidden select-none bg-[#1a0f12]">
      {/* 
        The exact uploaded MP4 as full-screen background 
        Untouched, uncolored, unblurred, no custom overlays
      */}
      <video
        ref={videoRef}
        src="/tripforge-background.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
      />

      {/* 1. TripForge brand name in Cormorant Garamond */}
      <header className="fixed top-8 left-8 md:top-10 md:left-14 z-20 pointer-events-auto">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            navigateTo('/');
          }}
          className="group block focus:outline-none"
        >
          <span
            className="font-cormorant text-3xl sm:text-4xl md:text-5xl font-normal tracking-[0.16em] text-[#3a1a22] transition-colors duration-300 drop-shadow-[0_1px_8px_rgba(255,221,225,0.45)] hover:text-[#c85f72]"
          >
            TripForge
          </span>
        </a>
      </header>

      {/* 2. Left-side circular navigation button */}
      <div
        ref={navRef}
        className="fixed left-6 sm:left-8 md:left-12 top-1/2 -translate-y-1/2 z-30 flex items-center"
      >
        {/* Main circular button */}
        <button
          onClick={() => setNavOpen((prev) => !prev)}
          aria-label={navOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
          aria-expanded={navOpen}
          className={`relative w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center cursor-pointer transition-all duration-500 ease-out focus:outline-none ${
            navOpen
              ? 'bg-[#FFDDE1]/80 border-2 border-[#EF9CA7] shadow-[0_8px_30px_rgba(200,95,114,0.35)] scale-105'
              : 'bg-[#FFDDE1]/50 hover:bg-[#FFDDE1]/75 border border-white/70 hover:border-[#EF9CA7]/60 shadow-[0_6px_25px_rgba(58,26,34,0.15)] hover:scale-105 hover:shadow-[0_8px_30px_rgba(200,95,114,0.25)]'
          } backdrop-blur-xl`}
        >
          {/* Subtle animated circular core */}
          <div className="relative flex flex-col items-center justify-center gap-1.5 w-6 h-6">
            <span
              className={`block h-0.5 bg-[#3a1a22] rounded-full transition-all duration-300 ${
                navOpen ? 'w-5 rotate-45 translate-y-2 bg-[#c85f72]' : 'w-5'
              }`}
            />
            <span
              className={`block h-0.5 bg-[#3a1a22] rounded-full transition-all duration-200 ${
                navOpen ? 'opacity-0 scale-x-0' : 'w-3.5'
              }`}
            />
            <span
              className={`block h-0.5 bg-[#3a1a22] rounded-full transition-all duration-300 ${
                navOpen ? 'w-5 -rotate-45 -translate-y-2 bg-[#c85f72]' : 'w-5'
              }`}
            />
          </div>
        </button>

        {/* Revealed Navigation Menu: DISCOVER & SIGN IN */}
        <div
          className={`ml-4 md:ml-6 transition-all duration-400 ease-out transform origin-left ${
            navOpen
              ? 'opacity-100 scale-100 translate-x-0 pointer-events-auto'
              : 'opacity-0 scale-95 -translate-x-3 pointer-events-none'
          }`}
        >
          <div className="backdrop-blur-2xl bg-[#FFDDE1]/70 border border-white/80 rounded-2xl p-2.5 sm:p-3 shadow-[0_12px_40px_rgba(58,26,34,0.18)] min-w-[200px] flex flex-col gap-1.5">
            {/* TRAVELER DASHBOARD */}
            <button
              onClick={() => navigateTo('/traveler')}
              className="group flex items-center justify-between px-4 py-2.5 rounded-xl hover:bg-white/60 text-left transition-all duration-200 focus:outline-none cursor-pointer"
            >
              <span className="font-inter font-medium text-xs sm:text-sm tracking-[0.2em] text-[#3a1a22] group-hover:text-[#c85f72] transition-colors">
                TRAVELER
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-[#EF9CA7] transition-all duration-200 ml-2" />
            </button>

            {/* TRIPFORGE AI CINEMATIC */}
            <a
              href="/tripforge-ai.html"
              className="group flex items-center justify-between px-4 py-2.5 rounded-xl hover:bg-white/60 text-left transition-all duration-200 focus:outline-none cursor-pointer"
            >
              <span className="font-inter font-semibold text-xs sm:text-sm tracking-[0.2em] text-[#c85f72] group-hover:text-[#3a1a22] transition-colors">
                TRIPFORGE AI
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#EF9CA7] ml-2 animate-ping" />
            </a>

            {/* OPERATOR */}
            <button
              onClick={() => navigateTo('/operator')}
              className="group flex items-center justify-between px-4 py-2.5 rounded-xl hover:bg-white/60 text-left transition-all duration-200 focus:outline-none cursor-pointer"
            >
              <span className="font-inter font-medium text-xs sm:text-sm tracking-[0.2em] text-[#3a1a22] group-hover:text-[#c85f72] transition-colors">
                OPERATOR
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-[#EF9CA7] transition-all duration-200 ml-2" />
            </button>

            {/* DISCOVER */}
            <button
              onClick={() => navigateTo('/discover')}
              className="group flex items-center justify-between px-4 py-2.5 rounded-xl hover:bg-white/60 text-left transition-all duration-200 focus:outline-none cursor-pointer"
            >
              <span className="font-inter font-medium text-xs sm:text-sm tracking-[0.2em] text-[#3a1a22] group-hover:text-[#c85f72] transition-colors">
                DISCOVER
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-[#EF9CA7] transition-all duration-200 ml-2" />
            </button>

            {/* Subtle Divider */}
            <div className="h-[1px] bg-[#c85f72]/15 mx-3" />

            {/* SIGN IN */}
            <button
              onClick={() => navigateTo('/signin')}
              className="group flex items-center justify-between px-4 py-2.5 rounded-xl hover:bg-white/60 text-left transition-all duration-200 focus:outline-none cursor-pointer"
            >
              <span className="font-inter font-medium text-xs sm:text-sm tracking-[0.2em] text-[#3a1a22] group-hover:text-[#c85f72] transition-colors">
                SIGN IN
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-[#EF9CA7] transition-all duration-200 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
