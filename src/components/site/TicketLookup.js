'use client';

import { useState } from 'react';

import { apiFetch } from '@/lib/api-client.js';
import { useI18n } from '@/components/providers/LocaleProvider.js';
import { Field, TextInput } from '@/components/ui/Field.js';
import { Button } from '@/components/ui/Button.js';
import { Alert } from '@/components/ui/Alert.js';
import { Ticket } from './Ticket.js';

export function TicketLookup({ products }) {
  const { t, locale } = useI18n();
  const [reference, setReference] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [booking, setBooking] = useState(null);

  const lookup = async (event) => {
    event.preventDefault();
    setError(null);
    setBooking(null);
    setLoading(true);

    const result = await apiFetch('/api/bookings/access', {
      method: 'POST',
      body: {
        booking_reference: reference.trim(),
        access_code: code.trim(),
      },
    });

    setLoading(false);

    if (!result.ok) {
      setError(
        result.status === 401
          ? t('ticket.invalid')
          : t('errors.generic')
      );

      return;
    }

    setBooking(result.data);
  };

  const reset = () => {
    setBooking(null);
    setReference('');
    setCode('');
  };

  return (
    <div className="flex flex-col gap-6">
      {booking ? (
        <>
          <Ticket
            booking={booking}
            productTitle={
              products[
                booking.pack_slug ?? booking.activity_slug
              ] ?? '—'
            }
            t={t}
            locale={locale}
          />

          <div className="no-print">
            <Button
              variant="secondary"
              onClick={reset}
            >
              {t('ticket.newBooking')}
            </Button>
          </div>
        </>
      ) : (
        <form
          onSubmit={lookup}
          className="flex flex-col gap-4"
        >
          <Field
            label={t('ticket.reference')}
            htmlFor="ticket-reference"
          >
            <TextInput
              id="ticket-reference"
              name="booking_reference"
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
            htmlFor="ticket-code"
          >
            <TextInput
              id="ticket-code"
              name="access_code"
              value={code}
              onChange={(event) =>
                setCode(event.target.value.toUpperCase())
              }
              placeholder="ABCD-EFGH-IJKL"
              required
            />
          </Field>

          {error ? (
            <Alert tone="error">{error}</Alert>
          ) : null}

          <div>
            <Button
              type="submit"
              disabled={loading}
            >
              {loading
                ? t('ticket.looking')
                : t('ticket.lookup')}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
