export function validateLogin(data) {
  const errors = {};

  if (!data || typeof data !== 'object') {
    return {
      valid: false,
      errors: {
        body: 'Invalid request body',
      },
    };
  }

  if (!data.email || typeof data.email !== 'string') {
    errors.email = 'Email is required';
  }

  if (
    !data.password ||
    typeof data.password !== 'string'
  ) {
    errors.password = 'Password is required';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}