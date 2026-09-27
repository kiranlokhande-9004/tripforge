import React from 'react';

export const BackgroundAtmosphere: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
    >
      <img
        src="/tripforge-japan-bg.png"
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-center"
        style={{
          opacity: 0.72,
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(20,28,40,0.04) 0%, rgba(20,28,40,0.02) 55%, rgba(10,15,20,0.12) 100%)',
        }}
      />
    </div>
  );
};