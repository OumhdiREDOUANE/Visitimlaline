import { getCurrentUser } from '../services/auth.service';

export function getTokenFromRequest(request) {
  return request.cookies.get(
    'visitmlaline_session'
  )?.value || null;
}

export function getAuthenticatedUser(request) {
  const token =
    getTokenFromRequest(request);

  if (!token) {
    return null;
  }

  return getCurrentUser(token);
}

export function requireAuthenticatedUser(
  request
) {
  const user =
    getAuthenticatedUser(request);

  if (!user) {
    const error = new Error(
      'Authentication required'
    );

    error.status = 401;

    throw error;
  }

  return user;
}

export function requireRole(
  request,
  allowedRoles
) {
  const user =
    requireAuthenticatedUser(request);

  if (!allowedRoles.includes(user.role)) {
    const error = new Error(
      'You do not have permission to access this resource'
    );

    error.status = 403;

    throw error;
  }

  return user;
}