import { Badge } from './Badge.js';
import { statusKey } from '../../lib/format.js';

const tones = {
  notPaidYet: 'warning',
  arrived: 'positive',
  cancelled: 'danger',
  unknown: 'neutral',
};

export function StatusBadge({
  status,
  t,
  className = '',
}) {
  const key = statusKey(status);

  return (
    <Badge
      tone={tones[key] ?? tones.unknown}
      className={className}
    >
      {t(`status.${key}`, null, status)}
    </Badge>
  );
}
