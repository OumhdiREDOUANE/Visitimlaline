import { Card } from '@/components/ui/Card.js';

export function EmptyState({
  title,
  children,
  action,
}) {
  return (
    <Card
      className="px-6 py-12 text-center"
    >
      <p className="font-display text-xl">{title}</p>
      {children ? (
        <p className="mx-auto mt-2 max-w-md text-sm text-muted">
          {children}
        </p>
      ) : null}
      {action ? (
        <div className="mt-5 flex justify-center">
          {action}
        </div>
      ) : null}
    </Card>
  );
}
