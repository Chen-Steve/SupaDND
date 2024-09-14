import React from 'react';

interface DotBackgroundProps {
  children: React.ReactNode;
}

export default function DotBackground({ children }: DotBackgroundProps) {
  return (
    <div className="relative min-h-screen bg-gray-100 overflow-hidden">
      <div className="absolute inset-0 z-0">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-blue-500 rounded-full opacity-10"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
            }}
          />
        ))}
      </div>
      <div className="relative z-10 min-h-screen">
        {children}
      </div>
    </div>
  );
}