'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

export function GalleryLightbox({ images = [], title }) {
  const uniqueImages = [...new Set(images.filter(Boolean))];
  const [selectedIndex, setSelectedIndex] = useState(null);
  const closeButtonRef = useRef(null);

  const isOpen = selectedIndex !== null;
  const activeIndex = isOpen ? selectedIndex : 0;

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    closeButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setSelectedIndex(null);
      } else if (event.key === 'ArrowRight') {
        setSelectedIndex((current) =>
          current === null
            ? 0
            : (current + 1) % uniqueImages.length
        );
      } else if (event.key === 'ArrowLeft') {
        setSelectedIndex((current) =>
          current === null
            ? 0
            : (current - 1 + uniqueImages.length) %
              uniqueImages.length
        );
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, uniqueImages.length]);

  if (uniqueImages.length === 0) {
    return null;
  }

  const showPrevious = () => {
    setSelectedIndex((current) =>
      current === null
        ? 0
        : (current - 1 + uniqueImages.length) % uniqueImages.length
    );
  };

  const showNext = () => {
    setSelectedIndex((current) =>
      current === null
        ? 0
        : (current + 1) % uniqueImages.length
    );
  };

  return (
    <>
      <div className="grid auto-rows-[180px] grid-cols-2 gap-3 sm:auto-rows-[220px] sm:grid-cols-4">
        {uniqueImages.map((source, index) => (
          <button
            key={source}
            type="button"
            onClick={() => setSelectedIndex(index)}
            className={`group relative overflow-hidden rounded-[22px] text-left ${
              index === 0
                ? 'col-span-2 row-span-2'
                : 'col-span-1 row-span-1'
            }`}
            aria-label={`Open photo ${index + 1} of ${uniqueImages.length}`}
          >
            <Image
              src={source}
              alt={title}
              fill
              sizes={
                index === 0
                  ? '(max-width: 640px) 100vw, 50vw'
                  : '(max-width: 640px) 50vw, 25vw'
              }
              className="img-zoom object-cover"
            />
            <span className="absolute inset-0 bg-ink/0 transition-colors group-hover:bg-ink/15" />
          </button>
        ))}
      </div>

      {isOpen ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${title} photo gallery`}
          className="fixed inset-0 z-50 flex animate-fade-up flex-col bg-ink/95 p-4 text-cream backdrop-blur-md sm:p-6"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedIndex(null);
            }
          }}
        >
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-bold">
              {title}
              <span className="ml-3 font-normal text-cream/70">
                {activeIndex + 1} / {uniqueImages.length}
              </span>
            </p>
            <button
              type="button"
              onClick={() => setSelectedIndex(null)}
              ref={closeButtonRef}
              className="rounded-full border border-cream/30 px-4 py-2 text-sm font-bold transition-colors hover:border-cream hover:bg-cream/10"
              aria-label="Close photo gallery"
            >
              ×
            </button>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center py-6">
            <Image
              key={uniqueImages[activeIndex]}
              src={uniqueImages[activeIndex]}
              alt={title}
              fill
              sizes="100vw"
              className="animate-fade-up object-contain"
            />

            <button
              type="button"
              onClick={showPrevious}
              className="absolute left-0 rounded-full border border-cream/30 bg-ink/60 px-4 py-3 text-2xl leading-none transition-colors hover:border-cream hover:bg-ink"
              aria-label="Previous photo"
            >
              ←
            </button>
            <button
              type="button"
              onClick={showNext}
              className="absolute right-0 rounded-full border border-cream/30 bg-ink/60 px-4 py-3 text-2xl leading-none transition-colors hover:border-cream hover:bg-ink"
              aria-label="Next photo"
            >
              →
            </button>
          </div>

          <div className="flex shrink-0 justify-center gap-2 overflow-x-auto pb-1">
            {uniqueImages.map((source, index) => (
              <button
                key={source}
                type="button"
                onClick={() => setSelectedIndex(index)}
                className={`relative h-16 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                  index === activeIndex
                    ? 'scale-105 border-sand'
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
                aria-label={`Show photo ${index + 1}`}
                aria-current={index === activeIndex ? 'true' : undefined}
              >
                <Image
                  src={source}
                  alt=""
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </>
  );
}
