'use client';

import { useState } from 'react';

import { apiFetch } from '@/lib/api-client.js';
import { logClientError } from '@/lib/observability/client.js';
import { parseScanPayload } from '@/lib/qr/payload.js';
import { useI18n } from '@/components/providers/LocaleProvider.js';
import {
  Field,
  TextInput,
} from '@/components/ui/Field.js';
import { Button } from '@/components/ui/Button.js';
import { Alert } from '@/components/ui/Alert.js';
import { StatusBadge } from '@/components/ui/StatusBadge.js';
import { QrScanner } from './QrScanner.js';
import {
  formatDate,
  formatMoney,
} from '@/lib/format.js';

export function CheckInForm() {
  const { t, locale } = useI18n();
  const [reference, setReference] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [booking, setBooking] = useState(null);

  /**
   * The single arrival path. Typing the pair and scanning the QR both end up
   * here, so a scan can never behave differently from a manual check-in.
   */
  const confirmArrival = async (rawReference, rawCode) => {
    const ref = rawReference.trim();
    const access = rawCode.trim();

    setMessage(null);
    setBooking(null);
    setLoading(true);

    const result = await apiFetch(
      '/api/admin/bookings/arrive',
      {
        method: 'POST',
        body: {
          booking_reference: ref,
          access_code: access,
        },
      }
    );

    setLoading(false);

    if (!result.ok) {
      logClientError('checkin.failed', {
        status: result.status,
        reference: ref,
      });

      setMessage(
        {
          401: t('checkIn.notFound'),
          404: t('checkIn.notFound'),
          409: t('checkIn.already'),
        }[result.status] ??
          (result.error === 'network'
            ? t('errors.network')
            : t('checkIn.failed'))
      );

      return;
    }

    setBooking(result.data);
    setReference('');
    setCode('');
  };

  const submit = (event) => {
    event.preventDefault();
    confirmArrival(reference, code);
  };

  const onScan = (text) => {
    const parsed = parseScanPayload(text);

    if (!parsed) {
      logClientError('checkin.qr_unreadable', {});

      setMessage(t('checkIn.badQr'));

      return;
    }

    confirmArrival(
      parsed.booking_reference,
      parsed.access_code
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <QrScanner
        onScan={onScan}
        t={t}
      />

      <form
        onSubmit={submit}
        className="flex flex-col gap-5"
      >
        <Field
          label={t('ticket.reference')}
          htmlFor="checkin-reference"
        >
          <TextInput
            id="checkin-reference"
            value={reference}
            onChange={(event) =>
              setReference(event.target.value)
            }
            placeholder="BK-1A2B3C4D"
            required
          />
        </Field>

        <Field
          label={t('ticket.code')}
          htmlFor="checkin-code"
        >
          <TextInput
            id="checkin-code"
            value={code}
            onChange={(event) =>
              setCode(
                event.target.value.toUpperCase()
              )
            }
            placeholder="ABCD-EFGH-IJKL"
            required
          />
        </Field>

        <div>
          <Button
            type="submit"
            size="lg"
            disabled={loading}
          >
            {loading
              ? t('checkIn.submitting')
              : t('checkIn.submit')}
          </Button>
        </div>
      </form>

      {message ? (
        <Alert tone="error">{message}</Alert>
      ) : null}

      {booking ? (
        <Alert
          tone="success"
          title={t('checkIn.success')}
        >
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-bold">
              {booking.customer_name}
            </span>

            <StatusBadge
              status={booking.status}
              t={t}
            />

            <span>
              {formatDate(
                booking.date,
                locale
              )}{' '}
              · {booking.time} · {booking.guests} ·{' '}
              {formatMoney(
                booking.total_price,
                locale
              )}
            </span>
          </div>
        </Alert>
      ) : null}
    </div>
  );
}
