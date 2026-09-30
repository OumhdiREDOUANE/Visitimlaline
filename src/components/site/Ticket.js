'use client';

import { Card } from '@/components/ui/Card.js';
import { Badge } from '@/components/ui/Badge.js';
import { StatusBadge } from '@/components/ui/StatusBadge.js';
import { Button } from '@/components/ui/Button.js';
import {
  formatDate,
  formatMoney,
} from '@/lib/format.js';

/**
 * The printable ticket. `qr_code` is a server-rendered data URL and is
 * present on both the fresh-booking response and the guest lookup, so the
 * printed ticket is always the one a staff member can scan at the gate.
 */
export function Ticket({
  booking,
  productTitle,
  t,
  locale,
}) {
  const rows = [
    {
      label: t('adminBookings.customer'),
      value: booking.customer_name,
    },
    {
      label: t('common.product'),
      value: productTitle,
    },
    {
      label: t('booking.date'),
      value: formatDate(booking.date, locale),
    },
    {
      label: t('booking.slot'),
      value: booking.time,
    },
    {
      label: t('booking.guests'),
      value: booking.guests,
    },
    {
      label: t('booking.total'),
      value: formatMoney(
        booking.total_price,
        locale
      ),
    },
  ];

  return (
    <Card
      className="print-area flex flex-col gap-6 p-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="eyebrow">{t('ticket.eyebrow')}</p>
          <p className="mt-1 text-3xl font-bold tracking-[0.08em]">
            {booking.booking_reference}
          </p>
        </div>

        <StatusBadge status={booking.status} t={t} />
      </div>

      {booking.access_code ? (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-sand/30 bg-ink/5 px-5 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-muted">
              {t('ticket.code')}
            </p>
            <p className="text-2xl font-bold tracking-[0.18em]">
              {booking.access_code}
            </p>
            <p className="mt-1 max-w-xs text-xs text-muted">
              {t('ticket.checkInHint')}
            </p>
          </div>

          {booking.qr_code ? (
            <img
              src={booking.qr_code}
              alt={t('ticket.qrAlt', {
                reference: booking.booking_reference,
              })}
              width={112}
              height={112}
              className="h-28 w-28 shrink-0 border border-ink/10 bg-white"
            />
          ) : null}
        </div>
      ) : null}

      <dl className="grid gap-4 sm:grid-cols-2">
        {rows.map((row) => (
          <div key={row.label}>
            <dt className="text-xs uppercase tracking-[0.12em] text-muted">
              {row.label}
            </dt>
            <dd className="text-base font-semibold">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="no-print flex flex-wrap items-center justify-between gap-3 border-t border-ink/10 pt-4">
        <Badge tone="accent">
          {booking.pack_slug
            ? t('booking.summaryPack')
            : t('booking.summaryActivity')}
        </Badge>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => window.print()}
        >
          {t('ticket.print')}
        </Button>
      </div>
    </Card>
  );
}
