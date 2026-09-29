'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { apiFetch } from '@/lib/api-client.js';
import { logClientError } from '@/lib/observability/client.js';
import { useI18n } from '@/components/providers/LocaleProvider.js';
import { Field, SelectInput, TextInput } from '@/components/ui/Field.js';
import { Button } from '@/components/ui/Button.js';
import { Alert } from '@/components/ui/Alert.js';

export function BookingActions({
  booking,
  slots,
  returnHref,
}) {
  const { t } = useI18n();
  const router = useRouter();
  const [date, setDate] = useState(booking.date);
  const [time, setTime] = useState(booking.time);
  const [loading, setLoading] = useState(null);
  const [message, setMessage] = useState(null);

  const locked =
    booking.status === 'CANCELLED' ||
    booking.status === 'ARRIVED';

  const run = async (action, request) => {
    setLoading(action);
    setMessage(null);

    const result = await request();

    setLoading(null);

    if (!result.ok) {
      logClientError(`admin.booking.${action}_failed`, {
        bookingId: booking.id,
        status: result.status,
      });

      setMessage(
        action === 'cancel'
          ? t('adminBookings.cancelError')
          : t('adminBookings.rescheduleError')
      );

      return;
    }

    setMessage(
      action === 'cancel'
        ? t('adminBookings.cancelDone')
        : t('adminBookings.rescheduleDone')
    );

    // The booking can fall outside the active filters once its status or
    // date changes, so drop the filters and keep the row in view.
    router.push(returnHref);
  };

  const cancel = () => {
    if (!window.confirm(t('adminBookings.cancelConfirm'))) {
      return;
    }

    run('cancel', () =>
      apiFetch(`/api/admin/bookings/${booking.id}/cancel`, {
        method: 'PATCH',
        body: {},
      })
    );
  };

  const reschedule = (event) => {
    event.preventDefault();

    run('reschedule', () =>
      apiFetch(`/api/admin/bookings/${booking.id}/reschedule`, {
        method: 'PATCH',
        body: { date, time },
      })
    );
  };

  if (locked) {
    return (
      <Alert tone="info">
        {t('adminBookings.locked')}
      </Alert>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <form
        onSubmit={reschedule}
        className="flex flex-col gap-4"
      >
        <p className="text-sm font-bold">
          {t('adminBookings.rescheduleTitle')}
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label={t('adminBookings.newDate')}
            htmlFor="reschedule-date"
          >
            <TextInput
              id="reschedule-date"
              type="date"
              value={date}
              onChange={(event) =>
                setDate(event.target.value)
              }
              required
            />
          </Field>

          <Field
            label={t('adminBookings.newTime')}
            htmlFor="reschedule-time"
          >
            <SelectInput
              id="reschedule-time"
              value={time}
              onChange={(event) =>
                setTime(event.target.value)
              }
            >
              {slots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </SelectInput>
          </Field>
        </div>

        <div>
          <Button
            type="submit"
            size="sm"
            disabled={loading === 'reschedule'}
          >
            {t('adminBookings.save')}
          </Button>
        </div>
      </form>

      <div className="border-t border-ink/10 pt-4">
        <Button
          variant="danger"
          size="sm"
          onClick={cancel}
          disabled={loading === 'cancel'}
        >
          {t('adminBookings.cancel')}
        </Button>
      </div>

      {message ? (
        <Alert
          tone={loading ? 'info' : 'success'}
        >
          {message}
        </Alert>
      ) : null}
    </div>
  );
}
