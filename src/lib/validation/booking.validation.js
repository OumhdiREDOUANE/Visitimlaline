export function validateBooking(data) {
  const errors = {};

  if (!data || typeof data !== 'object') {
    return {
      valid: false,
      errors: {
        body: 'Request body must be a valid JSON object',
      },
    };
  }

  if (!data.activity_slug || typeof data.activity_slug !== 'string') {
    errors.activity_slug = 'Activity is required';
  }

  if (!data.customer_name || typeof data.customer_name !== 'string') {
    errors.customer_name = 'Customer name is required';
  }

  if (!data.email || typeof data.email !== 'string') {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Invalid email address';
  }

  if (!data.phone || typeof data.phone !== 'string') {
    errors.phone = 'Phone is required';
  }

  if (!data.date || typeof data.date !== 'string') {
    errors.date = 'Date is required';
  } else if (!/^\d{4}-\d{2}-\d{2}$/.test(data.date)) {
    errors.date = 'Date must use YYYY-MM-DD format';
  }

  if (!data.time || typeof data.time !== 'string') {
    errors.time = 'Time is required';
  }

  if (
    data.guests === undefined ||
    data.guests === null ||
    !Number.isInteger(Number(data.guests))
  ) {
    errors.guests = 'Guests must be an integer';
  } else if (Number(data.guests) < 1) {
    errors.guests = 'Guests must be at least 1';
  } else if (Number(data.guests) > 8) {
    errors.guests = 'Guests cannot exceed 8 per booking';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}