const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-bold uppercase tracking-[0.12em] transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50';

const variants = {
  primary:
    'bg-terra text-white shadow-[0_12px_24px_rgb(184_95_50_/_18%)] hover:-translate-y-0.5 hover:bg-terra-deep hover:shadow-[0_16px_28px_rgb(184_95_50_/_25%)]',
  secondary:
    'border border-sand bg-surface text-ink hover:border-terra hover:text-terra',
  dark: 'bg-ink text-cream hover:bg-forest',
  onDark:
    'border border-sand/70 text-cream hover:border-sand hover:bg-cream/10',
  danger:
    'border border-terra text-terra hover:bg-terra hover:text-white',
  quiet:
    'text-ink underline underline-offset-4 hover:text-terra',
};

const sizes = {
  sm: 'px-4 py-2 text-[0.6875rem]',
  md: 'px-5 py-3 text-xs',
  lg: 'px-7 py-4 text-sm',
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
