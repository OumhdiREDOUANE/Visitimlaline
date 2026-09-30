const base =
  'block w-full min-h-[52px] rounded-2xl border bg-surface bg-white px-4 py-3 text-sm text-ink placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-terra/15';

const control = (error) =>
  error
    ? 'border-terra focus:border-terra'
    : 'border-ink/20 focus:border-terra border-sand';

export function Field({
  label,
  hint,
  error,
  htmlFor,
  children,
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="flex flex-col gap-2"
    >
      <span className="text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-muted">
        {label}
      </span>
      {children}
      {hint && !error ? (
        <span className="text-xs text-muted">{hint}</span>
      ) : null}
      {error ? (
        <span className="text-xs font-semibold text-terra">
          {error}
        </span>
      ) : null}
    </label>
  );
}

export function TextInput({
  error,
  className = '',
  ...rest
}) {
  return (
    <input
      className={`${base} ${control(error)} ${className}`}
      aria-invalid={error ? 'true' : undefined}
      {...rest}
    />
  );
}

export function SelectInput({
  error,
  className = '',
  children,
  ...rest
}) {
  return (
    <select
      className={`${base} ${control(error)} ${className}`}
      aria-invalid={error ? 'true' : undefined}
      {...rest}
    >
      {children}
    </select>
  );
}
