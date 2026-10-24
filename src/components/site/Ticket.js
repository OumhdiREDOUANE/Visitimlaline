
'use client';
import { createElement, useState } from 'react';
import { Card } from '@/components/ui/Card.js';
import { Badge } from '@/components/ui/Badge.js';
import { StatusBadge } from '@/components/ui/StatusBadge.js';
import { Button } from '@/components/ui/Button.js';
import {
  formatDate,
  formatMoney,
} from '@/lib/format.js';
import { useI18n } from '@/components/providers/LocaleProvider.js';

const LOCATION_URL =
  'https://maps.app.goo.gl/gFXamnuyAHy5ftca8';

export function Ticket({
  booking,
  productTitle,
  t,
  locale,
}) {
  const { currency } = useI18n();
  

const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

const handleDownloadPdf = async () => {
  if (isDownloadingPdf) return;

  setIsDownloadingPdf(true);

  try {
    const [
      { pdf },
      { default: TicketPdfDocument },
    ] = await Promise.all([
      import('@react-pdf/renderer'),
      import('./TicketPdfDocument.js'),
    ]);

const pdfDocument = createElement(TicketPdfDocument, {
  booking,
  rows,
  t,
  locationUrl: LOCATION_URL,
});

const blob = await pdf(pdfDocument).toBlob();
const url = URL.createObjectURL(blob);
const link = window.document.createElement('a');

link.href = url;
link.download =
  `Visitimlaline-${booking.booking_reference || 'ticket'}.pdf`;

window.document.body.appendChild(link);
link.click();
link.remove();

window.setTimeout(() => URL.revokeObjectURL(url), 1000);

    
  } catch (error) {
    console.error('PDF generation failed:', error);
    window.alert('Could not generate the PDF. Please try again.');
  } finally {
    setIsDownloadingPdf(false);
  }
};

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
        locale,
        currency
      ),
    },
  ];

  return (
    <Card className="print-area flex flex-col gap-6 p-6">
      {/* Ticket header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="eyebrow">{t('ticket.eyebrow')}</p>
          <p className="mt-1 text-3xl font-bold tracking-[0.08em]">
            {booking.booking_reference}
          </p>
        </div>

        <StatusBadge status={booking.status} t={t} />
      </div>

      {/* Booking access code and QR */}
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

      {/* Booking details */}
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

      <div className="ticket-footer mt-2 grid grid-cols-2 gap-4 border-t border-ink/10 pt-5">
  {/* Payment */}
  <div className="rounded-2xl border border-ink/10 bg-[#F8F6F1] p-4">
    <div className="mb-3 flex items-center gap-2">
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-lg">
        💳
      </span>
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#777064]">
        Payment
      </p>
    </div>

    <p className="text-sm font-bold text-[#25251F]">
      Payment upon arrival
    </p>
    <p className="mt-1 text-xs leading-5 text-[#777064]">
      Pay at the destination when you arrive.
    </p>
  </div>

  {/* Location */}
  
{/* Location */}
<div className="rounded-2xl border border-ink/10 bg-[#F8F6F1] p-4">
  <div className="mb-3 flex items-center gap-2">
    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-lg">
      📍
    </span>
    <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#777064]">
      LOCATION
    </p>
  </div>

  <p className="text-sm font-bold text-[#25251F]">
    Timlaline Dunes, Morocco
  </p>

  <a
    href={LOCATION_URL}
    target="_blank"
    rel="noopener noreferrer"
    className="ticket-location-link mt-3 block cursor-pointer text-xs font-bold text-[#8B6B3F] underline underline-offset-4"
  >
    Open location on Google Maps ↗
  </a>

 
</div>

</div>
      {/* Actions — hidden when printing */}
      <div className="no-print flex flex-wrap items-center justify-between gap-3 border-t border-ink/10 pt-4">
        <Badge tone="accent">
          {booking.pack_slug
            ? t('booking.summaryPack')
            : t('booking.summaryActivity')}
        </Badge>

        <div className="flex flex-wrap gap-2">
         
<Button
  variant="secondary"
  size="sm"
  disabled={isDownloadingPdf}
  onClick={handleDownloadPdf}
>
  {isDownloadingPdf ? 'Preparing PDF...' : 'Download PDF'}
</Button>


          <Button
            href={`https://wa.me/?text=${encodeURIComponent(
              `${productTitle} · ${booking.booking_reference} · ${booking.date} · ${booking.time} · Payment upon arrival · ${LOCATION_URL}`
            )}`}
            variant="secondary"
            size="sm"
            target="_blank"
            rel="noreferrer"
          >
            {t('ticket.whatsapp')}
          </Button>
        </div>
      </div>
    </Card>
  );
}
