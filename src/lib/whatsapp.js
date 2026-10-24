function normalizeWhatsAppNumber(phone) {
  const digits = String(phone ?? '').replace(/\D/g, '');

  if (!digits) return null;

  let number;

  if (digits.startsWith('00')) {
    number = digits.slice(2);
  } else if (digits.startsWith('212')) {
    number = digits;
  } else if (digits.startsWith('0')) {
    number = `212${digits.slice(1)}`;
  } else if (digits.length === 9) {
    number = `212${digits}`;
  } else {
    number = digits;
  }

  if (number.length < 10 || number.length > 15) {
    return null;
  }

  return number;
}

export function getBookingWhatsAppUrl(booking) {
  const phone = normalizeWhatsAppNumber(booking.phone);

  if (!phone) return null;

  const bookingRef =
    booking.booking_reference ||
    booking.reference ||
    booking.id ||
    '—';

  const activity =
    booking.activity_title ||
    booking.activity?.title ||
    booking.activity_slug ||
    booking.pack_title ||
    booking.pack?.title ||
    booking.pack_slug ||
    'Activité Visitimlaline';

  const date = booking.date || '—';
  const time = booking.time || '—';
  const guests = booking.guests ?? '—';
  const total =
    booking.total_price ?? booking.total ?? '—';

  const message = [
    'Bonjour !',
    '',
    'Nous avons bien reçu votre demande de réservation sur Visitimlaline.',
    '',
    `Référence : ${bookingRef}`,
    `Activité : ${activity}`,
    `Date : ${date}`,
    `Heure : ${time}`,
    `Nombre de personnes : ${guests}`,
    `Montant total : ${total} MAD`,
    '',
    'Pour confirmer votre réservation, veuillez répondre YES.',
    '',
    'Merci et à bientôt chez Visitimlaline !',
  ].join('\n');

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}