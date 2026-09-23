export function calculateActivityPrice(activity, guests) {
  if (!activity) {
    throw new Error('Activity is required');
  }

  const pricePerGuest = Number(activity.price_from);
  const guestCount = Number(guests);

  if (!Number.isFinite(pricePerGuest)) {
    throw new Error('Invalid activity price');
  }

  if (!Number.isInteger(guestCount) || guestCount < 1) {
    throw new Error('Invalid guest count');
  }

  const basePrice = pricePerGuest * guestCount;
  const addonPrice = 0;
  const totalPrice = basePrice + addonPrice;

  return {
    base_price: basePrice,
    addon_price: addonPrice,
    total_price: totalPrice,
  };
}