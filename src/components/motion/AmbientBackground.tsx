import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, Compass, Plane, Cloud } from 'lucide-react';

interface AmbientBackgroundProps {
  variant?: 'traveler' | 'operator' | 'signin';
  enableVideo?: boolean;
}

export const AmbientBackground: React.FC<AmbientBackgroundProps> = ({
  variant = 'traveler',
  enableVideo = true,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scrollY, setScrollY] = useState(0);

  // Parallax Scroll Tracking with passive listener & requestAnimationFrame
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY || window.pageYOffset || 0);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Ensure background video plays smoothly
  useEffect(() => {
    if (enableVideo && videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay policy fallback (silent)
      });
    }
  }, [enableVideo]);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
    >
      {/* ========================================================================= */}
      {/* 1. CINEMATIC VIDEO LAYER (Reusing authentic TripForge MP4 asset)          */}
      {/* ========================================================================= */}
      {enableVideo && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.25]">
          <video
            ref={videoRef}
            src="/tripforge-background.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="w-full h-full object-cover scale-105 filter brightness-105 saturate-[1.15] will-change-transform"
          />
        </div>
      )}

      {/* Luminous Warm Blush & Daylight Overlay to guarantee 100% light aesthetic */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FCF8F9]/65 via-[#FFF5F6]/55 to-[#FCF8F9]/75 pointer-events-none" />
      <div className="absolute inset-0 bg-radial-[ellipse_at_top] from-white/50 via-transparent to-[#FFDDE1]/25 pointer-events-none" />

      {/* ========================================================================= */}
      {/* 2. SOFT AMBIENT LIGHT BLOBS (Warm Rose, Blush, Champagne)                 */}
      {/* ========================================================================= */}
      <div className="absolute -top-[12%] -left-[6%] w-[55vw] h-[55vw] max-w-[800px] max-h-[800px] rounded-full bg-[#EF9CA7]/16 blur-[110px] animate-ambient-1 will-change-transform pointer-events-none" />
      <div className="absolute top-[32%] -right-[10%] w-[58vw] h-[58vw] max-w-[850px] max-h-[850px] rounded-full bg-[#FFDDE1]/50 blur-[120px] animate-ambient-2 will-change-transform pointer-events-none" />
      <div className="absolute -bottom-[12%] left-[15%] w-[48vw] h-[48vw] max-w-[700px] max-h-[700px] rounded-full bg-[#c85f72]/10 blur-[130px] animate-ambient-1 will-change-transform pointer-events-none" />
      <div className="absolute top-[65%] left-[-8%] w-[40vw] h-[40vw] max-w-[550px] max-h-[550px] rounded-full bg-[#FCE6E9]/45 blur-[100px] animate-ambient-2 will-change-transform pointer-events-none" />

      {/* ========================================================================= */}
      {/* 3. MULTI-TIER DRIFTING ETHEREAL CLOUD LAYERS (Pure CSS Transforms)       */}
      {/* ========================================================================= */}

      {/* Cloud Tier 1: High-Altitude Translucent Cirrus Wave (Slow Right Drift) */}
      <div
        className="absolute -top-12 left-[-15%] w-[130%] h-[400px] pointer-events-none will-change-transform"
        style={{
          transform: `translate3d(0, ${scrollY * -0.05}px, 0)`,
        }}
      >
        <div className="w-full h-full opacity-35 animate-cloud-1 will-change-transform">
          <svg
            viewBox="0 0 1440 320"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full preserve-3d"
          >
            <path
              d="M0,96L48,112C96,128,192,160,288,154.7C384,149,480,107,576,106.7C672,107,768,149,864,165.3C960,181,1056,171,1152,144C1248,117,1344,75,1392,53.3L1440,32L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
              fill="url(#cloudGrad1)"
              className="filter blur-[16px]"
            />
            <defs>
              <linearGradient id="cloudGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
                <stop offset="50%" stopColor="#FFDDE1" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#EF9CA7" stopOpacity="0.2" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Cloud Tier 2: Mid-Altitude Cumulus Mist (Gentle Counter-Drift) */}
      <div
        className="absolute top-[36%] right-[-12%] w-[125%] h-[420px] pointer-events-none will-change-transform"
        style={{
          transform: `translate3d(0, ${scrollY * -0.09}px, 0)`,
        }}
      >
        <div className="w-full h-full opacity-30 animate-cloud-2 will-change-transform">
          <svg
            viewBox="0 0 1440 320"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            <path
              d="M0,224L60,213.3C120,203,240,181,360,186.7C480,192,600,224,720,229.3C840,235,960,213,1080,186.7C1200,160,1320,128,1380,112L1440,96L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
              fill="url(#cloudGrad2)"
              className="filter blur-[22px]"
            />
            <defs>
              <linearGradient id="cloudGrad2" x1="100%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.88" />
                <stop offset="60%" stopColor="#FFDDE1" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#c85f72" stopOpacity="0.15" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Cloud Tier 3: Lower Horizon Cumulus Veil (Drifting across lower content) */}
      <div
        className="absolute top-[68%] left-[-10%] w-[120%] h-[380px] pointer-events-none will-change-transform"
        style={{
          transform: `translate3d(0, ${scrollY * -0.07}px, 0)`,
        }}
      >
        <div className="w-full h-full opacity-25 animate-cloud-3 will-change-transform">
          <svg
            viewBox="0 0 1440 320"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            <path
              d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,144C672,139,768,181,864,197.3C960,213,1056,203,1152,176C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              fill="url(#cloudGrad3)"
              className="filter blur-[24px]"
            />
            <defs>
              <linearGradient id="cloudGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#FFDDE1" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#EF9CA7" stopOpacity="0.15" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Cloud Tier 4: Soft Cumulus Fluff Clusters on Left & Right Margins */}
      <div
        className="absolute top-[16%] left-[2%] pointer-events-none will-change-transform hidden sm:block"
        style={{
          transform: `translate3d(0, ${scrollY * -0.12}px, 0)`,
        }}
      >
        <div className="opacity-30 animate-cloud-4 will-change-transform">
          <svg width="240" height="120" viewBox="0 0 240 120" fill="none" className="filter blur-[10px]">
            <ellipse cx="65" cy="75" rx="50" ry="34" fill="#FFFFFF" />
            <ellipse cx="120" cy="58" rx="60" ry="42" fill="#FFDDE1" fillOpacity="0.8" />
            <ellipse cx="175" cy="75" rx="50" ry="32" fill="#FFFFFF" fillOpacity="0.95" />
            <ellipse cx="125" cy="80" rx="75" ry="26" fill="#EF9CA7" fillOpacity="0.35" />
          </svg>
        </div>
      </div>

      <div
        className="absolute top-[52%] right-[3%] pointer-events-none will-change-transform hidden md:block"
        style={{
          transform: `translate3d(0, ${scrollY * -0.1}px, 0)`,
        }}
      >
        <div className="opacity-25 animate-float-3 will-change-transform">
          <svg width="220" height="100" viewBox="0 0 220 100" fill="none" className="filter blur-[12px]">
            <ellipse cx="55" cy="65" rx="45" ry="30" fill="#FFFFFF" />
            <ellipse cx="110" cy="50" rx="55" ry="36" fill="#FFDDE1" fillOpacity="0.75" />
            <ellipse cx="160" cy="65" rx="45" ry="28" fill="#FFFFFF" fillOpacity="0.9" />
          </svg>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. FLOATING VISUAL DEPTH ELEMENTS & FLIGHT TRAJECTORY                     */}
      {/* ========================================================================= */}

      {/* Subtle Curved Flight Trajectory Line */}
      <div
        className="absolute top-[12%] right-[4%] w-[38vw] max-w-[480px] h-[320px] opacity-25 hidden lg:block pointer-events-none"
        style={{
          transform: `translate3d(0, ${scrollY * -0.06}px, 0)`,
        }}
      >
        <svg viewBox="0 0 400 240" fill="none" className="w-full h-full pointer-events-none">
          <path
            d="M 20 200 C 140 180, 220 60, 380 40"
            stroke="url(#flightLineGrad)"
            strokeWidth="1.5"
            strokeDasharray="6 8"
            className="animate-dash-flow"
          />
          {/* Subtle Waypoint marker dot */}
          <circle cx="20" cy="200" r="3.5" fill="#EF9CA7" />
          <circle cx="380" cy="40" r="4" fill="#c85f72" />
          <defs>
            <linearGradient id="flightLineGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#EF9CA7" stopOpacity="0.2" />
              <stop offset="60%" stopColor="#c85f72" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#3a1a22" stopOpacity="0.25" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Dynamic Variant Accents */}
      {variant === 'traveler' && (
        <>
          {/* Floating Origami Plane with Pitch/Glide Physics */}
          <div
            className="absolute top-[21%] left-[7%] pointer-events-none will-change-transform hidden md:block"
            style={{
              transform: `translate3d(0, ${scrollY * -0.14}px, 0)`,
            }}
          >
            <div className="opacity-35 text-[#c85f72] animate-flight-glide will-change-transform">
              <Plane className="w-9 h-9 drop-shadow-[0_4px_10px_rgba(200,95,114,0.18)]" strokeWidth={1.4} />
            </div>
          </div>

          {/* Majestic Cartographic Compass Rose (Ultra-slow spin) */}
          <div
            className="absolute top-[46%] right-[5%] pointer-events-none will-change-transform hidden lg:block"
            style={{
              transform: `translate3d(0, ${scrollY * -0.08}px, 0)`,
            }}
          >
            <div className="opacity-20 text-[#3a1a22] animate-spin-ultra-slow will-change-transform">
              <Compass className="w-16 h-16 text-[#c85f72]" strokeWidth={1.1} />
            </div>
          </div>

          {/* Location Pin with delicate coordinate mark */}
          <div
            className="absolute bottom-[24%] left-[6%] pointer-events-none will-change-transform hidden md:block"
            style={{
              transform: `translate3d(0, ${scrollY * -0.16}px, 0)`,
            }}
          >
            <div className="opacity-25 text-[#c85f72] animate-float-3 will-change-transform flex items-center gap-2">
              <MapPin className="w-6 h-6" strokeWidth={1.5} />
              <span className="font-mono text-[10px] tracking-widest text-[#3a1a22]/60 select-none hidden xl:inline">
                15°29'N · 73°49'E
              </span>
            </div>
          </div>

          {/* Cloud Silhouette */}
          <div
            className="absolute top-[10%] right-[16%] pointer-events-none will-change-transform hidden sm:block"
            style={{
              transform: `translate3d(0, ${scrollY * -0.07}px, 0)`,
            }}
          >
            <div className="opacity-25 text-[#EF9CA7] animate-float-2 will-change-transform">
              <Cloud className="w-12 h-12" strokeWidth={1.2} />
            </div>
          </div>

          {/* Navigation Arrow */}
          <div
            className="absolute bottom-[12%] right-[12%] pointer-events-none will-change-transform hidden lg:block"
            style={{
              transform: `translate3d(0, ${scrollY * -0.1}px, 0)`,
            }}
          >
            <div className="opacity-20 text-[#3a1a22] animate-float-1 will-change-transform">
              <Navigation className="w-6 h-6 rotate-45" strokeWidth={1.5} />
            </div>
          </div>
        </>
      )}

      {variant === 'operator' && (
        <>
          {/* Operator Compass */}
          <div
            className="absolute top-[19%] right-[8%] pointer-events-none will-change-transform hidden md:block"
            style={{
              transform: `translate3d(0, ${scrollY * -0.07}px, 0)`,
            }}
          >
            <div className="opacity-22 text-[#c85f72] animate-spin-ultra-slow will-change-transform">
              <Compass className="w-14 h-14" strokeWidth={1.2} />
            </div>
          </div>

          {/* Operator Flight Navigation Indicator & Radar Telemetry */}
          <div
            className="absolute bottom-[26%] left-[7%] pointer-events-none will-change-transform hidden md:block"
            style={{
              transform: `translate3d(0, ${scrollY * -0.13}px, 0)`,
            }}
          >
            <div className="opacity-22 text-[#3a1a22] animate-float-3 will-change-transform flex items-center gap-2">
              <Navigation className="w-6 h-6 rotate-45 text-[#c85f72]" strokeWidth={1.5} />
              <span className="font-mono text-[9px] tracking-[0.2em] text-[#3a1a22]/60 uppercase hidden xl:inline">
                OPS RADAR · 15.2993° N, 74.1240° E
              </span>
            </div>
          </div>

          {/* High altitude plane marker */}
          <div
            className="absolute top-[48%] left-[4%] pointer-events-none will-change-transform hidden lg:block"
            style={{
              transform: `translate3d(0, ${scrollY * -0.1}px, 0)`,
            }}
          >
            <div className="opacity-25 text-[#EF9CA7] animate-flight-glide will-change-transform">
              <Plane className="w-8 h-8 rotate-12" strokeWidth={1.3} />
            </div>
          </div>
        </>
      )}

      {variant === 'signin' && (
        <>
          <div className="absolute top-[16%] left-[10%] opacity-25 text-[#c85f72] animate-flight-glide will-change-transform hidden md:block pointer-events-none">
            <Plane className="w-9 h-9" strokeWidth={1.4} />
          </div>
          <div className="absolute bottom-[18%] right-[8%] opacity-20 text-[#3a1a22] animate-spin-ultra-slow will-change-transform hidden md:block pointer-events-none">
            <Compass className="w-14 h-14" strokeWidth={1.2} />
          </div>
        </>
      )}

      {/* ========================================================================= */}
      {/* 5. GENTLE SHIMMERING PARTICLES / RISING LIGHT MOTES                      */}
      {/* ========================================================================= */}
      <div className="absolute bottom-[15%] left-[25%] w-2 h-2 rounded-full bg-[#EF9CA7]/60 blur-[1px] animate-particle-1 hidden md:block pointer-events-none" />
      <div className="absolute bottom-[25%] right-[30%] w-2.5 h-2.5 rounded-full bg-[#FFDDE1] blur-[1px] animate-particle-2 hidden lg:block pointer-events-none" />
      <div className="absolute top-[45%] left-[55%] w-1.5 h-1.5 rounded-full bg-[#c85f72]/40 blur-[0.5px] animate-particle-1 hidden sm:block pointer-events-none" />
    </div>
  );
};
