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
      className={`rounded-full border px-4 py-2 text-[0.6875rem] font-bold uppercase tracking-[0.16em] transition-all ${
        active
          ? 'border-terra bg-terra text-white'
          : 'border-sand text-ink hover:border-terra hover:text-terra'
      }`}
    >
      {label}
    </Link>
  );
}
