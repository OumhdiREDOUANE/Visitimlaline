'use client';

import { useCallback, useEffect, useState } from 'react';

import { apiFetch } from '@/lib/api-client.js';
import { useI18n } from '@/components/providers/LocaleProvider.js';
import {
  Field,
  SelectInput,
  TextInput,
} from '@/components/ui/Field.js';
import { Button } from '@/components/ui/Button.js';
import { Card } from '@/components/ui/Card.js';
import { Alert } from '@/components/ui/Alert.js';
import { Ticket } from '@/components/site/Ticket.js';
import {
  formatMoney,
  todayISO,
} from '@/lib/format.js';

const MAX_GUESTS = 8;

const FIELD_KEYS = {
  activity_slug: 'field.activity',
  pack_slug: 'field.both',
  customer_name: 'field.customerName',
  email: 'field.email',
  phone: 'field.phone',
  date: 'field.date',
  time: 'field.time',
  guests: 'field.guests',
};

export function BookingWizard({
  activities,
  packs,
  initialType,
  initialSlug,
}) {
  const { t, locale } = useI18n();

  const [type, setType] = useState(
    initialType === 'pack' ? 'pack' : 'activity'
  );
  const [slug, setSlug] = useState(initialSlug ?? '');
  const [date, setDate] = useState('');
  const [minDate, setMinDate] = useState(null);
  const [slots, setSlots] = useState(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [time, setTime] = useState('');
  const [guests, setGuests] = useState(2);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [created, setCreated] = useState(null);

  useEffect(() => {
    setMinDate(todayISO());
  }, []);

  const catalog = type === 'pack' ? packs : activities;
  const product = catalog.find(
    (item) => item.slug === slug
  );

  const selectedSlot = slots?.find(
    (slot) => slot.time === time
  );

  const maxGuests = selectedSlot
    ? Math.min(
        MAX_GUESTS,
        selectedSlot.remaining_guests
      )
    : MAX_GUESTS;

  const loadSlots = useCallback(async () => {
    if (!slug || !date) {
      setSlots(null);
      setTime('');

      return;
    }

    setLoadingSlots(true);

    const query = new URLSearchParams({ date });

    query.set(
      type === 'pack' ? 'pack' : 'activity',
      slug
    );

    const result = await apiFetch(
      `/api/availability?${query.toString()}`
    );

    setLoadingSlots(false);

    if (!result.ok) {
      setSlots(null);
      setTime('');
      setAlert({ tone: 'error', text: t('errors.generic') });

      return;
    }

    setSlots(result.data.slots);
    setAlert(null);
  }, [slug, date, type, t]);

  useEffect(() => {
    loadSlots();
  }, [loadSlots]);

  useEffect(() => {
    if (time && !slots?.some((slot) => slot.time === time && slot.available)) {
      setTime('');
    }
  }, [slots, time]);

  useEffect(() => {
    setGuests((current) =>
      Math.min(Math.max(1, current), maxGuests)
    );
  }, [maxGuests]);

  const switchType = (nextType) => {
    setType(nextType);
    setSlug('');
    setDate('');
    setTime('');
    setSlots(null);
    setAlert(null);
    setFieldErrors({});
  };

  const submit = async (event) => {
    event.preventDefault();
    setAlert(null);
    setFieldErrors({});
    setSubmitting(true);

    const result = await apiFetch('/api/bookings', {
      method: 'POST',
      body: {
        ...(type === 'pack'
          ? { pack_slug: slug }
          : { activity_slug: slug }),
        date,
        time,
        guests,
        customer_name: name,
        email,
        phone,
      },
    });

    setSubmitting(false);

    if (!result.ok) {
      setFieldErrors(
        Object.fromEntries(
          Object.entries(result.details ?? {}).map(
            ([field, message]) => [
              field,
              t(
                FIELD_KEYS[field] ??
                  'errors.generic',
                null,
                message
              ),
            ]
          )
        )
      );

      if (result.remainingGuests !== null) {
        await loadSlots();
      }

      setAlert({
        tone: 'error',
        text: errorText(result, t),
      });

      return;
    }

    setCreated(result.data);
  };

  const reset = () => {
    setCreated(null);
    setSlug('');
    setDate('');
    setTime('');
    setSlots(null);
    setName('');
    setEmail('');
    setPhone('');
    setAlert(null);
    setFieldErrors({});
  };

  if (created) {
    return (
      <div className="flex flex-col gap-6">
        <Alert tone="success" title={t('booking.successTitle')}>
          {t('booking.successText')}
        </Alert>

        <Ticket
          booking={created}
          productTitle={product?.title ?? '—'}
          t={t}
          locale={locale}
        />

        <div className="no-print">
          <Button variant="secondary" onClick={reset}>
            {t('booking.anotherBooking')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="flex flex-col gap-8"
    >
      <Card
        wave
        className="flex flex-col gap-5 p-6"
      >
        <fieldset className="flex flex-col gap-4">
          <legend className="text-sm font-bold">
            {t('booking.typeLabel')}
          </legend>

          <div className="flex flex-wrap gap-3">
            {[
              ['activity', t('booking.typeActivity')],
              ['pack', t('booking.typePack')],
            ].map(([value, label]) => (
              <label
                key={value}
                className={`cursor-pointer rounded-full border px-4 py-2 text-sm font-bold transition-colors ${
                  type === value
                    ? 'border-terra bg-terra text-white'
                    : 'border-ink/15 hover:border-ink/40'
                }`}
              >
                <input
                  type="radio"
                  name="type"
                  value={value}
                  checked={type === value}
                  onChange={() => switchType(value)}
                  className="sr-only"
                />
                {label}
              </label>
            ))}
          </div>
        </fieldset>

        <Field
          label={
            type === 'pack'
              ? t('booking.choosePack')
              : t('booking.chooseActivity')
          }
          htmlFor="product"
          error={fieldErrors.pack_slug ?? fieldErrors.activity_slug}
        >
          <SelectInput
            id="product"
            value={slug}
            onChange={(event) => setSlug(event.target.value)}
            required
          >
            <option value="">
              —
            </option>

            {catalog.map((item) => (
              <option
                key={item.slug}
                value={item.slug}
              >
                {item.title}
              </option>
            ))}
          </SelectInput>
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label={t('booking.date')}
            htmlFor="date"
            hint={t('booking.dateHint')}
            error={fieldErrors.date}
          >
            <TextInput
              id="date"
              type="date"
              min={minDate ?? undefined}
              value={date}
              onChange={(event) =>
                setDate(event.target.value)
              }
              required
            />
          </Field>

          <Field
            label={t('booking.guests')}
            htmlFor="guests"
            hint={t('booking.guestsHint')}
            error={fieldErrors.guests}
          >
            <SelectInput
              id="guests"
              value={guests}
              onChange={(event) =>
                setGuests(Number(event.target.value))
              }
            >
              {Array.from(
                { length: maxGuests },
                (_, index) => index + 1
              ).map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </SelectInput>
          </Field>
        </div>
      </Card>

      <Card
        wave
        className="flex flex-col gap-4 p-6"
      >
        <p className="text-sm font-bold">
          {t('booking.slot')}
        </p>

        {loadingSlots ? (
          <p className="text-sm text-muted">
            {t('booking.slotLoading')}
          </p>
        ) : null}

        {!loadingSlots && slots && slots.length > 0 ? (
          <div className="grid gap-2 sm:grid-cols-4">
            {slots.map((slot) => (
              <SlotButton
                key={slot.time}
                slot={slot}
                active={time === slot.time}
                label={t('booking.slotRemaining', {
                  count: slot.remaining_guests,
                })}
                fullLabel={t('booking.slotFull')}
                onSelect={() => setTime(slot.time)}
              />
            ))}
          </div>
        ) : null}

        {!loadingSlots && (!slots || slots.length === 0) ? (
          <p className="text-sm text-muted">
            {t('booking.slotEmpty')}
          </p>
        ) : null}

        {fieldErrors.time ? (
          <Alert tone="error">
            {fieldErrors.time}
          </Alert>
        ) : null}
      </Card>

      <Card
        wave
        className="flex flex-col gap-5 p-6"
      >
        <p className="text-sm font-bold">
          {t('booking.detailsTitle')}
        </p>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label={t('booking.fullName')}
            htmlFor="customer_name"
            error={fieldErrors.customer_name}
          >
            <TextInput
              id="customer_name"
              name="customer_name"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              required
            />
          </Field>

          <Field
            label={t('booking.email')}
            htmlFor="email"
            error={fieldErrors.email}
          >
            <TextInput
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              required
            />
          </Field>
        </div>

        <Field
          label={t('booking.phone')}
          htmlFor="phone"
          hint={t('booking.phoneHint')}
          error={fieldErrors.phone}
        >
          <TextInput
            id="phone"
            name="phone"
            type="tel"
            value={phone}
            onChange={(event) =>
              setPhone(event.target.value)
            }
            required
          />
        </Field>
      </Card>

      <Card
        wave
        className="flex flex-col gap-4 p-6"
      >
        <p className="text-sm font-bold">
          {t('booking.summary')}
        </p>

        <dl className="flex flex-col gap-2 text-sm">
          <Row
            label={
              type === 'pack'
                ? t('booking.summaryPack')
                : t('booking.summaryActivity')
            }
            value={product?.title ?? '—'}
          />
          <Row label={t('booking.date')} value={date || '—'} />
          <Row label={t('booking.slot')} value={time || '—'} />
          <Row
            label={t('booking.guests')}
            value={guests}
          />
          <Row
            label={t('booking.total')}
            value={
              product
                ? formatMoney(
                    product.price_from * guests,
                    locale
                  )
                : '—'
            }
          />
        </dl>

        <p className="text-xs text-muted">
          {t('booking.paymentNote')}
        </p>

        {alert ? (
          <Alert tone={alert.tone}>{alert.text}</Alert>
        ) : null}

        <div>
          <Button
            type="submit"
            size="lg"
            disabled={
              submitting ||
              !slug ||
              !date ||
              !time
            }
          >
            {submitting
              ? t('booking.submitting')
              : t('booking.submit')}
          </Button>
        </div>
      </Card>
    </form>
  );
}

function SlotButton({
  slot,
  active,
  label,
  fullLabel,
  onSelect,
}) {
  const disabled = !slot.available;

  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      aria-pressed={active}
      className={`rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
        active
          ? 'border-terra bg-terra text-white'
          : 'border-ink/15 hover:border-ink/40'
      } ${disabled ? 'cursor-not-allowed opacity-40' : ''}`}
    >
      <span className="block font-bold">
        {slot.time}
      </span>
      <span className="block text-xs">
        {disabled ? fullLabel : label}
      </span>
    </button>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-muted">{label}</dt>
      <dd className="text-right font-semibold">
        {value}
      </dd>
    </div>
  );
}

function errorText(result, t) {
  if (result.error === 'network') {
    return t('booking.errorNetwork');
  }

  if (result.status === 409) {
    return result.remainingGuests !== null
      ? t('booking.errorFull')
      : t('booking.errorDuplicate');
  }

  return t('booking.errorGeneric');
}
