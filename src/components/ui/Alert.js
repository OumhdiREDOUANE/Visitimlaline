const tones = {
  error: {
    box: 'border-terra/30 bg-terra/10 text-terra-deep',
  },
  success: {
    box: 'border-forest/30 bg-forest/10 text-forest',
  },
  info: {
    box: 'border-ink/10 bg-ink/5 text-ink',
  },
};

export function Alert({
  tone = 'info',
  title,
  children,
  className = '',
}) {
  const { box } = tones[tone] ?? tones.info;

  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={`rounded-2xl border px-4 py-3 text-sm ${box} ${className}`}
    >
      {title ? <p className="font-bold">{title}</p> : null}
      {children ? <div className="mt-0.5">{children}</div> : null}
    </div>
  );
}
