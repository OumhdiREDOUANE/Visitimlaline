'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export function GalleryLightbox({ images, title }) {
  const uniqueImages = [...new Set((images ?? []).filter(Boolean))];
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (selected === null) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setSelected(null);
      if (event.key === 'ArrowRight') {
        setSelected((index) => (index + 1) % uniqueImages.length);
      }
      if (event.key === 'ArrowLeft') {
        setSelected((index) => (index - 1 + uniqueImages.length) % uniqueImages.length);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [selected, uniqueImages.length]);

  if (!uniqueImages.length) return null;

  return (
    <>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {uniqueImages.map((src, index) => (
          <button
            key={src}
            type="button"
            onClick={() => setSelected(index)}
            className={`group relative overflow-hidden rounded-2xl ${
              index === 0 ? 'col-span-2 row-span-2' : ''
            }`}
            aria-label={`Open ${title} photo ${index + 1}`}
          >
            <Image
              src={src}
              alt={`${title} ${index + 1}`}
              width={900}
              height={650}
              className="h-full min-h-40 w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      {selected !== null ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${title} photo gallery`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/90 p-4"
          onClick={() => setSelected(null)}
        >
          <button
            type="button"
            className="absolute right-5 top-5 rounded-full bg-surface px-4 py-2 font-bold text-ink"
            onClick={() => setSelected(null)}
            aria-label="Close gallery"
          >
            ×
          </button>
          <button
            type="button"
            className="absolute left-4 rounded-full bg-surface px-4 py-2 text-2xl text-ink"
            onClick={(event) => {
              event.stopPropagation();
              setSelected((index) => (index - 1 + uniqueImages.length) % uniqueImages.length);
            }}
            aria-label="Previous photo"
          >
            ‹
          </button>
          <Image
            src={uniqueImages[selected]}
            alt={`${title} ${selected + 1}`}
            width={1600}
            height={1100}
            className="max-h-[85vh] w-auto max-w-[90vw] object-contain"
            onClick={(event) => event.stopPropagation()}
          />
          <button
            type="button"
            className="absolute right-4 rounded-full bg-surface px-4 py-2 text-2xl text-ink"
            onClick={(event) => {
              event.stopPropagation();
              setSelected((index) => (index + 1) % uniqueImages.length);
            }}
            aria-label="Next photo"
          >
            ›
          </button>
          <p className="absolute bottom-5 rounded-full bg-ink/70 px-4 py-2 text-sm text-cream">
            {selected + 1} / {uniqueImages.length}
          </p>
        </div>
      ) : null}
    </>
  );
}
