const base =
  'block w-full border bg-surface px-3 py-2.5 text-sm text-ink placeholder:text-muted/60 focus:outline-none';

const control = (error) =>
  error
    ? 'border-terra focus:border-terra'
    : 'border-ink/20 focus:border-terra';

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
      className="flex flex-col gap-1.5"
    >
      <span className="text-xs font-bold uppercase tracking-[0.12em] text-muted">
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
