'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

const HERO_IMAGES = [
  '/timlaline-desert-quad-adventure-sunset.jpg',
  '/timlaline-desert-landscape-atlantic-morocco.jpg',
];

export function HeroImageCycler() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setReducedMotion(mediaQuery.matches);
    updatePreference();
    mediaQuery.addEventListener('change', updatePreference);

    return () => mediaQuery.removeEventListener('change', updatePreference);
  }, []);

  useEffect(() => {
    if (reducedMotion) return undefined;

    const timer = window.setInterval(() => {
      setCurrentIndex((previous) => (previous + 1) % HERO_IMAGES.length);
    }, 1200);

    return () => window.clearInterval(timer);
  }, [reducedMotion]);

  return (
    <>
      {HERO_IMAGES.map((src, index) => (
        <Image
          key={src}
          src={src}
          alt=""
          fill
          priority
          sizes="100vw"
          className={`absolute inset-0 object-cover transition-opacity duration-300 ease-in-out ${
            index === currentIndex
              ? 'z-0 opacity-100'
              : '-z-10 opacity-0'
          }`}
        />
      ))}
    </>
  );
}
