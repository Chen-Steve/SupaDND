import React, { useState, useRef, useEffect } from 'react';

interface ItemModalProps {
  item: {
    id: string;
    name: string;
    quantity: number;
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ItemModal({ item, isOpen, onClose }: ItemModalProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tiltStyle, setTiltStyle] = useState({});

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const tiltX = (y - centerY) / 10; // Adjust divisor for more/less tilt
      const tiltY = (centerX - x) / 10; // Adjust divisor for more/less tilt

      setTiltStyle({
        transform: `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.05, 1.05, 1.05)`,
        transition: 'all 0.1s ease',
      });
    };

    const handleMouseLeave = () => {
      setTiltStyle({
        transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
        transition: 'all 0.5s ease',
      });
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isOpen]);

  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div 
        ref={cardRef}
        style={tiltStyle}
        className="bg-gradient-to-b from-gray-100 to-gray-300 rounded-lg p-4 w-64 h-96 shadow-xl flex flex-col"
      >
        <div className="flex-grow flex flex-col items-center justify-center">
          <div className="w-32 h-32 bg-white rounded-full mb-4 flex items-center justify-center">
            {item.name !== 'Empty' ? (
              <span className="text-4xl">🎁</span> // Placeholder icon, replace with actual item icon
            ) : (
              <span className="text-4xl">❌</span> // Empty slot icon
            )}
          </div>
          <h2 className="text-xl font-bold mb-2 text-center">{item.name}</h2>
          {item.name !== 'Empty' ? (
            <p className="text-gray-600 mb-2">Quantity: {item.quantity}</p>
          ) : (
            <p className="text-gray-600 mb-2">This slot is empty</p>
          )}
        </div>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors duration-200"
        >
          Close
        </button>
      </div>
    </div>
  );
}