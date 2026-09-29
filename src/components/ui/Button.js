const base =
  'inline-flex items-center justify-center gap-2 font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-50';

const variants = {
  primary:
    'bg-terra text-white hover:bg-terra-deep',
  secondary:
    'bg-surface text-ink border border-ink/15 hover:border-ink/40',
  dark: 'bg-ink text-cream hover:bg-forest',
  onDark:
    'border border-cream/60 text-cream hover:bg-cream/10',
  danger:
    'border border-terra text-terra hover:bg-terra hover:text-white',
  quiet:
    'text-ink underline underline-offset-4 hover:text-terra',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-5 py-3 text-sm',
  lg: 'px-7 py-4 text-base',
};

export function Button({
  href,
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...rest
}) {
  const classes = `${base} ${variants[variant] ?? variants.primary} ${
    sizes[size] ?? sizes.md
  } ${className}`;

  if (href) {
    return (
      <a href={href} className={classes} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <button
      type="button"
      className={classes}
      {...rest}
    >
      {children}
    </button>
  );
}
