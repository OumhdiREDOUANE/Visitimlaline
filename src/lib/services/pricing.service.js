/**
 * Single pricing rule for every bookable product: price per guest × guests.
 * Addons are part of the schema but no rule exists yet, so they stay at 0.
 */
export function calculateBookingPrice(
  source,
  guests
) {
  if (!source) {
    throw new Error(
      'An activity or a pack is required'
    );
  }

  const pricePerGuest = Number(
    source.price_from
  );

  const guestCount = Number(
    guests
  );

  if (!Number.isFinite(pricePerGuest)) {
    throw new Error(
      'Invalid product price'
    );
  }

  if (
    !Number.isInteger(guestCount) ||
    guestCount < 1
  ) {
    throw new Error(
      'Invalid guest count'
    );
  }

  const basePrice = pricePerGuest * guestCount;

  return {
    base_price: basePrice,
    addon_price: 0,
    total_price: basePrice,
  };
}
