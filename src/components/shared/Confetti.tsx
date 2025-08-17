
"use client";

import { useEffect, useState, useCallback } from 'react';

const PARTICLE_COUNT = 50;
const COLORS = ['#A020F0', '#7DF9FF', '#FFD700', '#4169E1']; // Purple, Aqua, Gold, Blue

const ConfettiParticle = ({ id }: { id: number }) => {
  const [style, setStyle] = useState({});

  useEffect(() => {
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const size = Math.random() * 8 + 4;
    const angle = Math.random() * 360;
    const distance = Math.random() * 150 + 50;
    const duration = Math.random() * 1.5 + 1; // longer duration
    const delay = Math.random() * 0.5;

    const x = Math.cos((angle * Math.PI) / 180) * distance;
    const y = Math.sin((angle * Math.PI) / 180) * distance;

    // Initial state (hidden)
    setStyle({
        background: color,
        width: `${size}px`,
        height: `${size}px`,
        transform: `translate3d(0,0,0) scale(0)`,
        opacity: 1,
    });
    
    // Animate to final state
    const animateTimeout = setTimeout(() => {
        setStyle({
          background: color,
          width: `${size}px`,
          height: `${size}px`,
          transform: `translate3d(${x}px, ${y}px, 0) rotateZ(${Math.random() * 360}deg) scale(1)`,
          transition: `transform ${duration}s cubic-bezier(0.1, 0.9, 0.2, 1), opacity ${duration}s ease-out`,
          transitionDelay: `${delay}s`,
          opacity: 1,
        });
    }, 10);


    // Fade out after animation
    const fadeTimeout = setTimeout(() => {
        setStyle(prev => ({
            ...prev,
            opacity: 0,
            transform: `translate3d(${x*1.2}px, ${y*1.2}px, 0) rotateZ(${Math.random() * 360 + 180}deg) scale(0)`,
        }));
    }, duration * 1000 + delay * 1000);

    return () => {
      clearTimeout(animateTimeout);
      clearTimeout(fadeTimeout);
    }

  }, [id]);

  return (
    <div
      className="absolute top-1/2 left-1/2 rounded-full"
      style={{ ...style, position: 'absolute', top: '50%', left: '50%' }}
    />
  );
};


const Confetti = () => {
  const [particles, setParticles] = useState<number[]>([]);

  const generateParticles = useCallback(() => {
    const newParticles = Array.from({ length: PARTICLE_COUNT }, () => Math.random());
    setParticles(newParticles);
  }, []);

  useEffect(() => {
    generateParticles(); // Initial burst
    const interval = setInterval(() => {
        generateParticles();
    }, 2500); // New burst every 2.5 seconds

    return () => clearInterval(interval);
  }, [generateParticles]);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-50 flex items-center justify-center">
      <div className="relative">
        {particles.map((id) => (
          <ConfettiParticle key={id} id={id} />
        ))}
      </div>
    </div>
  );
};

export default Confetti;
