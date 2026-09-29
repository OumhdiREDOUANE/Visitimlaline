import Link from 'next/link';

import { getI18n } from '@/lib/i18n/server.js';
import { requireAdmin } from '@/lib/auth/guards.js';
import {
  getAdminBookings,
  getAdminBookingDetails,
  toAdminBooking,
} from '@/lib/services/booking.service.js';
import { getActivities } from '@/lib/services/activity.service.js';
import { getPacks } from '@/lib/services/pack.service.js';
import { SLOTS } from '@/lib/services/availability.service.js';
import {
  formatDate,
  formatDateTime,
  formatMoney,
  statusKey,
} from '@/lib/format.js';
import { Card } from '@/components/ui/Card.js';
import { Field, SelectInput } from '@/components/ui/Field.js';
import { Badge } from '@/components/ui/Badge.js';
import { StatusBadge } from '@/components/ui/StatusBadge.js';
import { EmptyState } from '@/components/ui/EmptyState.js';
import { Button } from '@/components/ui/Button.js';
import { BookingActions } from '@/components/admin/BookingActions.js';

const STATUSES = [
  'NOT PAID YET',
  'ARRIVED',
  'CANCELLED',
];

export default async function AdminBookingsPage({
  searchParams,
}) {
  const { t, locale } = await getI18n();
  await requireAdmin('/admin/bookings');

  const params = await searchParams;
  const status = (params?.status ?? '').toString();
  const product = (params?.product ?? '').toString();
  const selected = (params?.selected ?? '').toString();

  const filters = {
    status: STATUSES.includes(status) ? status : null,
    ...parseProduct(product),
  };

  const activities = getActivities();
  const packs = getPacks();
  const bookings = getAdminBookings(filters).map(
    toAdminBooking
  );

  const titles = Object.fromEntries(
    [...activities, ...packs].map((item) => [
      item.slug,
      item.title,
    ])
  );

  const detail =
    /^\d+$/.test(selected) && bookings.some(
      (row) => String(row.id) === selected
    )
      ? toAdminBooking(
          getAdminBookingDetails(Number(selected))
        )
      : null;

  return (
    <div className="page-shell flex flex-col gap-8 py-10">
      <header className="flex flex-col gap-3">
        <h1 className="text-4xl">
          {t('adminBookings.title')}
        </h1>
        <p className="max-w-xl text-muted">
          {t('adminBookings.lead')}
        </p>
      </header>

      <form className="flex flex-wrap items-end gap-4">
        <Field
          label={t('adminBookings.status')}
          htmlFor="filter-status"
        >
          <SelectInput
            id="filter-status"
            name="status"
            defaultValue={filters.status ?? ''}
          >
            <option value="">
              {t('adminBookings.allStatuses')}
            </option>

            {STATUSES.map((value) => (
              <option key={value} value={value}>
                {t(`status.${statusKey(value)}`)}
              </option>
            ))}
          </SelectInput>
        </Field>

        <Field
          label={t('adminBookings.product')}
          htmlFor="filter-product"
        >
          <SelectInput
            id="filter-product"
            name="product"
            defaultValue={product}
          >
            <option value="">
              {t('adminBookings.allProducts')}
            </option>

            <optgroup label={t('booking.typeActivity')}>
              {activities.map((item) => (
                <option
                  key={item.slug}
                  value={`activity:${item.slug}`}
                >
                  {item.title}
                </option>
              ))}
            </optgroup>

            <optgroup label={t('booking.typePack')}>
              {packs.map((item) => (
                <option
                  key={item.slug}
                  value={`pack:${item.slug}`}
                >
                  {item.title}
                </option>
              ))}
            </optgroup>
          </SelectInput>
        </Field>

        <Button type="submit" size="sm">
          {t('adminBookings.filters')}
        </Button>

        <Link
          href="/admin/bookings"
          className="text-xs font-bold uppercase tracking-[0.12em] text-muted hover:text-terra"
        >
          {t('adminBookings.clear')}
        </Link>
      </form>

      {bookings.length > 0 ? (
        <Card
          className="overflow-x-auto"
        >
          <table className="w-full min-w-[52rem] border-collapse text-sm">
            <thead>
              <tr className="border-b border-ink/10 text-left text-xs uppercase tracking-[0.1em] text-muted">
                <th className="px-4 py-3">
                  {t('adminBookings.reference')}
                </th>
                <th className="px-4 py-3">
                  {t('adminBookings.customer')}
                </th>
                <th className="px-4 py-3">
                  {t('adminBookings.product')}
                </th>
                <th className="px-4 py-3">
                  {t('adminBookings.when')}
                </th>
                <th className="px-4 py-3">
                  {t('adminBookings.guests')}
                </th>
                <th className="px-4 py-3">
                  {t('adminBookings.total')}
                </th>
                <th className="px-4 py-3">
                  {t('adminBookings.actions')}
                </th>
              </tr>
            </thead>

            <tbody>
              {bookings.map((row) => (
                <tr
                  key={row.id}
                  className={`border-b border-ink/5 last:border-0 ${
                    String(row.id) === selected
                      ? 'bg-terra/10'
                      : ''
                  }`}
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/bookings?${query({
                        status: filters.status,
                        product,
                        selected: String(row.id),
                      })}`}
                      className="font-bold underline underline-offset-4"
                    >
                      {row.booking_reference}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <span className="block">
                      {row.customer_name}
                    </span>
                    <span className="text-xs text-muted">
                      {row.email}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone="neutral">
                      {titles[
                        row.pack_slug ??
                          row.activity_slug
                      ] ?? '—'}
                    </Badge>
                    <span className="mt-1 block text-xs text-muted">
                      {row.pack_slug
                        ? t('booking.summaryPack')
                        : t('booking.summaryActivity')}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="block">
                      {formatDate(
                        row.date,
                        locale
                      )}
                    </span>
                    <span className="text-xs text-muted">
                      {row.time}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {row.guests}
                  </td>
                  <td className="px-4 py-3 font-semibold">
                    {formatMoney(
                      row.total_price,
                      locale
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge
                      status={row.status}
                      t={t}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      ) : (
        <EmptyState title={t('adminBookings.empty')} />
      )}

      {detail ? (
        <Card
          wave
          className="flex flex-col gap-5 p-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl">
              {t('adminBookings.detail')} ·{' '}
              {detail.booking_reference}
            </h2>
            <StatusBadge status={detail.status} t={t} />
          </div>

          <dl className="grid gap-4 sm:grid-cols-3">
            <Detail
              label={t('adminBookings.customer')}
              value={`${detail.customer_name} · ${detail.phone}`}
            />
            <Detail
              label={t('adminBookings.product')}
              value={titles[
                detail.pack_slug ?? detail.activity_slug
              ]}
            />
            <Detail
              label={t('adminBookings.when')}
              value={`${formatDate(
                detail.date,
                locale
              )} · ${detail.time}`}
            />
            <Detail
              label={t('adminBookings.total')}
              value={formatMoney(
                detail.total_price,
                locale
              )}
            />
            <Detail
              label={t('adminBookings.maskedCode')}
              value={detail.access_code_hint ?? '—'}
            />
            <Detail
              label={t('adminBookings.arrivedAt')}
              value={
                detail.arrived_at
                  ? formatDateTime(
                      detail.arrived_at,
                      locale
                    )
                  : '—'
              }
            />
          </dl>

          <BookingActions
            booking={detail}
            slots={SLOTS}
            returnHref={`/admin/bookings?selected=${detail.id}`}
          />
        </Card>
      ) : bookings.length > 0 ? (
        <p className="text-sm text-muted">
          {t('adminBookings.selectBooking')}
        </p>
      ) : null}
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-[0.12em] text-muted">
        {label}
      </dt>
      <dd className="text-sm font-semibold">
        {value}
      </dd>
    </div>
  );
}

function parseProduct(value) {
  const match = /^([^:]+):(.+)$/.exec(value ?? '');

  if (!match) {
    return {};
  }

  const [, kind, slug] = match;

  return kind === 'pack'
    ? { pack: slug }
    : { activity: slug };
}

function query(filters) {
  const params = new URLSearchParams();

  if (filters.status) {
    params.set('status', filters.status);
  }

  if (filters.product) {
    params.set('product', filters.product);
  }

  if (filters.selected) {
    params.set('selected', filters.selected);
  }

  return params.toString();
}
