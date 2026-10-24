'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';

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
  formatDurationRange,
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
  const { t, locale, currency } = useI18n();

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
  const progress = !slug
    ? 1
    : !date || !time
      ? 2
      : 3;
  const previewDuration = product?.duration_min
    ? formatDurationRange(
        product.duration_min,
        product.duration_max,
        t
      )
    : product?.duration ?? '';

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
      <ol className="grid gap-2 sm:grid-cols-3">
        {[
          t('booking.stepExperience'),
          t('booking.stepTime'),
          t('booking.stepDetails'),
        ].map((label, index) => {
          const step = index + 1;
          const complete = progress > step;
          const active = progress === step;

          return (
            <li
              key={label}
              className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-xs font-bold transition-colors ${
                active || complete
                  ? 'border-terra bg-terra/10 text-terra-deep'
                  : 'border-ink/10 text-muted'
              }`}
            >
              <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                active || complete
                  ? 'bg-terra text-white'
                  : 'bg-ink/5 text-muted'
              }`}>
                {complete ? '✓' : step}
              </span>
              <span>{label}</span>
            </li>
          );
        })}
      </ol>

      <Card
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

        {product ? (
          <div className="flex flex-col gap-4 rounded-2xl border border-sand/40 bg-cream/60 p-3 sm:flex-row">
            <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-xl sm:w-40">
              <Image
                src={product.hero}
                alt=""
                fill
                sizes="160px"
                className="object-cover"
              />
            </div>
            <div className="flex min-w-0 flex-col justify-center gap-2">
              <div className="flex flex-wrap items-center gap-3">
                <p className="font-display text-lg">{product.title}</p>
                <span className="text-sm font-bold text-terra">
                  {formatMoney(product.price_from, locale, currency)}
                  <span className="ml-1 text-xs font-normal text-muted">
                    {t('common.perPerson')}
                  </span>
                </span>
              </div>
              {previewDuration ? (
                <p className="text-xs text-muted">
                  {previewDuration}
                </p>
              ) : null}
              <div className="flex flex-wrap gap-1.5">
                {(product.inclusions ?? product.includes ?? []).slice(0, 3).map((item) => (
                  <span key={item} className="rounded-full bg-surface px-2.5 py-1 text-[0.6875rem] font-semibold text-muted">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ) : null}

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
                goldenHourLabel={t('booking.goldenHour')}
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
                  locale,
                  currency
                  )
                : '—'
            }
          />
        </dl>

        <p className="text-xs text-muted">
          {t('booking.paymentNote')} {t('booking.currencyNote')}
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
  goldenHourLabel,
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
      <span className="flex items-center justify-between gap-2 font-bold">
        <span>{slot.time}</span>
        {slot.time === '16:30' || slot.time === '17:30' ? (
          <span className="text-[0.625rem] text-gold">
            ☀️ {goldenHourLabel}
          </span>
        ) : null}
      </span>
      <span className="block text-xs">
        {disabled ? fullLabel : label}
      </span>
      <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-ink/10">
        <span
          className={`block h-full rounded-full ${
            disabled ? 'bg-muted' : 'bg-gold'
          }`}
          style={{
            width: `${Math.max(0, Math.min(100, (slot.remaining_guests / MAX_GUESTS) * 100))}%`,
          }}
        />
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
