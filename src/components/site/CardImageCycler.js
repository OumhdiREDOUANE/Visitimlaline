'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export function CardImageCycler({
  images,
  alt,
  aspectRatio = 'aspect-[16/10]',
  intervalMs = 1200,
  children,
}) {
  const uniqueImages = [...new Set((images ?? []).filter(Boolean))];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (uniqueImages.length < 2 || reducedMotion) return undefined;
    const timer = window.setInterval(() => {
      setCurrentIndex((previous) => (previous + 1) % uniqueImages.length);
    }, intervalMs);
    return () => window.clearInterval(timer);
  }, [intervalMs, reducedMotion, uniqueImages.length]);

  if (!uniqueImages.length) return null;

  return (
    <div className={`experience-image-frame relative w-full ${aspectRatio}`}>
      {uniqueImages.map((src, index) => (
        <Image
          key={src}
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className={`absolute inset-0 object-cover object-center transition-opacity duration-500 ease-in-out ${
            index === currentIndex
              ? 'z-[1] opacity-100'
              : 'pointer-events-none z-0 opacity-0'
          }`}
        />
      ))}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[2] bg-linear-to-t from-ink/65 via-ink/10 to-transparent"
      />
      {children}
      {uniqueImages.length > 1 ? (
        <div
          aria-label={`Photo ${currentIndex + 1} of ${uniqueImages.length}`}
          className="absolute bottom-3 right-3.5 z-10 flex items-center gap-1"
        >
          {uniqueImages.map((src, index) => (
            <span
              key={src}
              aria-hidden
              className={`h-1 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'w-5 bg-white' : 'w-2 bg-white/40'
              }`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
