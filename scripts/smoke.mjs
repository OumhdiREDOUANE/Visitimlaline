/**
 * End-to-end acceptance check against a running server.
 *
 *   npm run build && npm run start   # terminal 1
 *   npm run smoke                    # terminal 2
 *
 * Every journey in PROJECT_MAP.md > SYSTEM_FLOW has a check here.
 * The script only reads public/admin APIs plus the rendered pages, and it
 * tags the bookings it creates with a `smoke+` email so the local database
 * stays easy to audit.
 */

const BASE = process.env.SMOKE_URL ?? 'http://localhost:3000';

const SMOKE_EMAIL = `smoke+${Date.now()}@example.test`;

/**
 * A fresh day per run: capacity is 8 guests per slot, so reusing a fixed
 * date would fill the slot after a few runs and fail for the wrong reason.
 */
const FUTURE = futureDate(30 + Math.floor(Math.random() * 60));

let cookie = '';
let passed = 0;
let failed = 0;

async function main() {
  const activity = await json('/api/activities');
  const pack = await json('/api/packs');

  check('activities are listed', activity.ok && activity.body.data.length > 0);
  check('packs are listed', pack.ok && pack.body.data.length > 0);

  const activitySlug = activity.body.data[0].slug;
  const packSlug = pack.body.data[0].slug;

  const activitySlots = await json(
    `/api/availability?activity=${activitySlug}&date=${FUTURE}`
  );
  const packSlots = await json(
    `/api/availability?pack=${packSlug}&date=${FUTURE}`
  );

  check('activity availability returns slots', activitySlots.ok && activitySlots.body.data.slots.length === 4);
  check('pack availability returns slots', packSlots.ok && packSlots.body.data.slots.length === 4);

  const rejected = await json('/api/availability?date=' + FUTURE);
  check('availability needs a product', !rejected.ok && rejected.status === 400);

  const base = {
    customer_name: 'Smoke Test',
    email: SMOKE_EMAIL,
    phone: '+212600000000',
    date: FUTURE,
    time: '10:00',
    guests: 2,
  };

  const activityBooking = await post('/api/bookings', {
    ...base,
    activity_slug: activitySlug,
  });

  if (!activityBooking.body?.data) {
    throw new Error(
      `activity booking failed (${activityBooking.status}): ${JSON.stringify(
        activityBooking.body
      )}`
    );
  }

  check(
    'activity booking is created',
    activityBooking.status === 201 &&
      activityBooking.body.data.activity_slug === activitySlug &&
      activityBooking.body.data.pack_slug === null &&
      Boolean(activityBooking.body.data.booking_reference) &&
      Boolean(activityBooking.body.data.access_code)
  );

  const packBooking = await post('/api/bookings', {
    ...base,
    pack_slug: packSlug,
    time: '14:00',
  });

  check(
    'pack booking is created',
    packBooking.status === 201 &&
      packBooking.body.data.pack_slug === packSlug &&
      packBooking.body.data.activity_slug === null
  );

  const duplicate = await post('/api/bookings', {
    ...base,
    activity_slug: activitySlug,
  });

  check('duplicate booking is rejected', duplicate.status === 409);

  const both = await post('/api/bookings', {
    ...base,
    email: 'smoke+both@example.test',
    activity_slug: activitySlug,
    pack_slug: packSlug,
  });

  check('activity + pack is rejected', both.status === 422);

  const capacity = await post('/api/bookings', {
    ...base,
    email: 'smoke+full@example.test',
    activity_slug: activitySlug,
    time: '16:30',
    guests: 9,
  });

  check('more than 8 guests is rejected', capacity.status === 422);

  const created = activityBooking.body.data;

  check(
    'a new booking arrives with a scannable QR',
    activityBooking.ok &&
      typeof created.qr_code === 'string' &&
      created.qr_code.startsWith('data:image/png;base64,')
  );

  const ticket = await post('/api/bookings/access', {
    booking_reference: created.booking_reference,
    access_code: created.access_code,
  });

  check(
    'guest reopens the same ticket, code and QR included',
    ticket.ok &&
      ticket.body.data.id === created.id &&
      ticket.body.data.access_code === created.access_code &&
      ticket.body.data.qr_code === created.qr_code
  );

  const badTicket = await post('/api/bookings/access', {
    booking_reference: created.booking_reference,
    access_code: 'AAAA-AAAA-AAAA',
  });

  check('wrong access code is rejected', badTicket.status === 401);

  const anonymous = await json('/api/admin/bookings');
  check('admin API requires a session', anonymous.status === 401);

  const anonymousTelegram = await json('/api/test-telegram');
  check(
    'telegram test endpoint is protected',
    anonymousTelegram.status === 401
  );

  const badLogin = await post('/api/auth/login', {
    email: 'qa@visimlaline.test',
    password: 'wrong-password',
  });

  check('wrong credentials are rejected', badLogin.status === 401);

  // The throttle is keyed on (address, account) and lives in server memory,
  // so the probe needs a fresh account per run: reusing a fixed address would
  // start this run already blocked and fail for the wrong reason.
  const throttled = [];
  let lastThrottled = null;
  const probeEmail = `throttle-probe+${Date.now()}@example.test`;

  for (let attempt = 0; attempt < 9; attempt++) {
    const response = await post('/api/auth/login', {
      email: probeEmail,
      password: 'wrong-password',
    });

    throttled.push(response.status);
    lastThrottled = response;
  }

  const retryAfter = Number(
    lastThrottled?.headers?.get('retry-after') ?? 0
  );

  check(
    'repeated bad sign-ins are throttled with 429 and Retry-After',
    throttled.slice(0, 8).every((status) => status === 401) &&
      throttled[8] === 429 &&
      retryAfter > 0
  );

  const login = await post('/api/auth/login', {
    email: 'qa@visimlaline.test',
    password: 'Visitimlaline2026',
  });

  check('admin can sign in', login.ok);

  if (!login.ok) {
    throw new Error(
      'Cannot continue: the QA admin account is missing. Run: npm run user:create qa@visimlaline.test Visitimlaline2026 admin "QA Admin"'
    );
  }

  const list = await json('/api/admin/bookings');

  check(
    'admin sees the bookings with a masked access code and no QR',
    list.ok &&
      list.body.data.length > 0 &&
      list.body.data.every(
        (row) =>
          row.access_code === undefined &&
          row.qr_code === undefined &&
          typeof row.access_code_hint === 'string'
      )
  );

  const filtered = await json(
    `/api/admin/bookings?activity=${activitySlug}`
  );

  check(
    'admin can filter by activity',
    filtered.ok &&
      filtered.body.data.every(
        (row) => row.activity_slug === activitySlug
      )
  );

  const filteredPack = await json(
    `/api/admin/bookings?pack=${packSlug}`
  );

  check(
    'admin can filter by pack',
    filteredPack.ok && filteredPack.body.data.length > 0
  );

  const rescheduled = await patch(
    `/api/admin/bookings/${packBooking.body.data.id}/reschedule`,
    { date: FUTURE, time: '16:30' }
  );

  check('admin can reschedule a booking', rescheduled.ok && rescheduled.body.data.time === '16:30');

  const checkIn = await post('/api/admin/bookings/arrive', {
    booking_reference: created.booking_reference,
    access_code: created.access_code,
  });

  check(
    'staff can record an arrival',
    checkIn.ok && checkIn.body.data.status === 'ARRIVED'
  );

  const notifications = await json('/api/admin/notifications');
  check('notifications are listed', notifications.ok && Array.isArray(notifications.body.data));

  const closedCheckIn = await post('/api/admin/bookings/arrive', {
    booking_reference: created.booking_reference,
    access_code: created.access_code,
  });

  check('arriving twice is refused', closedCheckIn.status === 409);

  await checkPages();

  await patch(`/api/admin/bookings/${packBooking.body.data.id}/cancel`, {});
  await patch(`/api/admin/bookings/${activityBooking.body.data.id}/cancel`, {});
}

async function checkPages() {
  const pages = [
    ['/', 'Réserver'],
    ['/experiences', 'Trouvez votre Timlaline'],
    [`/experiences/${await firstActivitySlug()}`, 'Quad'],
    ['/packs', 'Packs'],
    ['/booking', 'Réserver'],
    ['/ticket', 'Retrouvez votre réservation'],
    ['/login', 'Espace équipe'],
  ];

  for (const [path, needle] of pages) {
    const response = await fetch(BASE + path);
    const html = await response.text();

    check(
      `page ${path} renders`,
      response.status === 200 && html.includes(needle)
    );
  }

  const english = await fetch(BASE + '/', {
    headers: { cookie: 'visitimlaline_locale=en' },
  });
  const englishHtml = await english.text();

  check(
    'locale cookie switches the site to English',
    english.status === 200 && englishHtml.includes('Book now')
  );

  const missing = await fetch(`${BASE}/experiences/nope`);
  check('unknown experience returns 404', missing.status === 404);

  const guarded = await fetch(`${BASE}/admin/bookings`, {
    redirect: 'manual',
  });

  check(
    'backoffice redirects anonymous users to the login',
    [307, 303, 302].includes(guarded.status) &&
      (guarded.headers.get('location') ?? '').includes(
        '/login'
      )
  );

  const admin = await fetch(`${BASE}/admin/bookings`, {
    headers: { cookie },
  });
  const adminHtml = await admin.text();

  check(
    'admin can open the bookings backoffice',
    admin.status === 200 && adminHtml.includes('Réservations')
  );

  const notificationsPage = await fetch(
    `${BASE}/admin/notifications`,
    { headers: { cookie } }
  );
  const notificationsHtml = await notificationsPage.text();

  check(
    'admin can open the notifications backoffice',
    notificationsPage.status === 200 &&
      notificationsHtml.includes('Notifications')
  );

  const checkInPage = await fetch(`${BASE}/staff/check-in`, {
    headers: { cookie },
  });

  check('staff can open the check-in screen', checkInPage.status === 200);
}

async function firstActivitySlug() {
  const { body } = await json('/api/activities');

  return body.data[0].slug;
}

function futureDate(days) {
  const date = new Date(Date.now() + days * 86400000);

  return date.toISOString().slice(0, 10);
}

async function json(path) {
  const response = await fetch(BASE + path, {
    headers: cookie ? { cookie } : {},
  });

  return {
    ok: response.ok,
    status: response.status,
    body: await response.json().catch(() => null),
  };
}

async function post(path, body) {
  return send(path, 'POST', body);
}

async function patch(path, body) {
  return send(path, 'PATCH', body);
}

async function send(path, method, body) {
  const response = await fetch(BASE + path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(cookie ? { cookie } : {}),
    },
    body: JSON.stringify(body),
  });

  const setCookie = response.headers.get('set-cookie');

  if (setCookie?.includes('visitmlaline_session=')) {
    cookie = setCookie.split(';')[0];
  }

  return {
    ok: response.ok,
    status: response.status,
    headers: response.headers,
    body: await response.json().catch(() => null),
  };
}

function check(label, condition) {
  if (condition) {
    passed += 1;
    console.log(`  ok  ${label}`);

    return;
  }

  failed += 1;
  console.error(`  FAIL ${label}`);
}

main()
  .catch((error) => {
    failed += 1;
    console.error(error.message);
  })
  .finally(() => {
    console.log(
      `\n${passed} passed, ${failed} failed (tagged as ${SMOKE_EMAIL})`
    );
    process.exit(failed > 0 ? 1 : 0);
  });
