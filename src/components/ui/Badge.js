const tones = {
  neutral: 'bg-ink/8 text-ink',
  accent: 'bg-sand/40 text-ink',
  positive: 'bg-forest/15 text-forest',
  warning: 'bg-gold/25 text-ink',
  danger: 'bg-terra/15 text-terra-deep',
};

export function Badge({
  tone = 'neutral',
  className = '',
  children,
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[0.6875rem] font-bold uppercase tracking-[0.1em] ${
        tones[tone] ?? tones.neutral
      } ${className}`}
    >
      {children}
    </span>
  );
}
