import Link from 'next/link';

/*
 * The category filter appears twice: on the home page as a rail under the
 * hero, and on the experiences listing as the filter itself. One component
 * so the two can never disagree on how a selected category looks.
 */
export function CategoryPill({
  href,
  active = false,
  label,
}) {
  return (
    <Link
      href={href}
      aria-current={
        active ? 'true' : undefined
      }
      className={`rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-[0.12em] transition-colors ${
        active
          ? 'border-terra bg-terra text-white'
          : 'border-ink/15 text-ink hover:border-ink/40'
      }`}
    >
      {label}
    </Link>
  );
}
