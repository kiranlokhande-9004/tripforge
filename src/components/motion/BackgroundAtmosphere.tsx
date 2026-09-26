import React from 'react';

/**
 * BackgroundAtmosphere
 * 
 * Renders absolute-positioned, semi-transparent shapes styled with 
 * colors derived from the #EF9CA7 / #FFDDE1 palette.
 * Drifts slowly using CSS keyframe animations (cloud-drift-1, cloud-drift-2, etc.)
 * Configured with z-index: -1 and pointer-events: none to sit safely behind all interactive content.
 */
export const BackgroundAtmosphere: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 overflow-hidden select-none pointer-events-none"
      style={{
        zIndex: -1,
        pointerEvents: 'none',
      }}
    >
      {/* Shape 1: Upper-left rose glow drifting slowly */}
      <div
        className="absolute -top-[12%] -left-[8%] w-[58vw] h-[58vw] max-w-[800px] max-h-[800px] rounded-full bg-[#EF9CA7]/22 blur-[110px] animate-cloud-1 will-change-transform pointer-events-none"
        style={{ pointerEvents: 'none' }}
      />

      {/* Shape 2: Mid-right soft blush canopy drifting counter */}
      <div
        className="absolute top-[28%] -right-[12%] w-[62vw] h-[62vw] max-w-[850px] max-h-[850px] rounded-full bg-[#FFDDE1]/55 blur-[120px] animate-cloud-2 will-change-transform pointer-events-none"
        style={{ pointerEvents: 'none' }}
      />

      {/* Shape 3: Lower-left warm rose cushion drifting along lower horizon */}
      <div
        className="absolute -bottom-[10%] left-[12%] w-[52vw] h-[52vw] max-w-[720px] max-h-[720px] rounded-full bg-[#EF9CA7]/18 blur-[125px] animate-cloud-3 will-change-transform pointer-events-none"
        style={{ pointerEvents: 'none' }}
      />

      {/* Shape 4: Mid-left blush cloud drifting with vertical undulation */}
      <div
        className="absolute top-[62%] -left-[10%] w-[44vw] h-[44vw] max-w-[620px] max-h-[620px] rounded-full bg-[#FFDDE1]/45 blur-[100px] animate-cloud-4 will-change-transform pointer-events-none"
        style={{ pointerEvents: 'none' }}
      />

      {/* Shape 5: Center-right atmospheric light accent */}
      <div
        className="absolute top-[16%] right-[18%] w-[38vw] h-[38vw] max-w-[520px] max-h-[520px] rounded-full bg-[#FCE6E9]/50 blur-[95px] animate-cloud-1 will-change-transform pointer-events-none"
        style={{ pointerEvents: 'none' }}
      />

      {/* Shape 6: Lower-right subtle rose mist */}
      <div
        className="absolute bottom-[18%] right-[10%] w-[46vw] h-[46vw] max-w-[640px] max-h-[640px] rounded-full bg-[#EF9CA7]/14 blur-[115px] animate-cloud-2 will-change-transform pointer-events-none"
        style={{ pointerEvents: 'none' }}
      />
    </div>
  );
};
