import {
  findUserByEmail,
  findUserById,
} from '../db/users';

import {
  verifyPassword,
} from '../auth/password';

import {
  createUserSession,
  getSessionFromToken,
  deleteUserSession,
} from '../auth/session';

export function loginUser(email, password) {
  const normalizedEmail =
    email.trim().toLowerCase();

  const user =
    findUserByEmail(normalizedEmail);

  if (!user) {
    const error = new Error(
      'Invalid email or password'
    );

    error.status = 401;

    throw error;
  }

  if (!user.active) {
    const error = new Error(
      'User account is inactive'
    );

    error.status = 403;

    throw error;
  }

  const validPassword =
    verifyPassword(
      password,
      user.password_hash
    );

  if (!validPassword) {
    const error = new Error(
      'Invalid email or password'
    );

    error.status = 401;

    throw error;
  }

  const session =
    createUserSession(user.id);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    session,
  };
}

export function getCurrentUser(token) {
  const session =
    getSessionFromToken(token);

  if (!session) {
    return null;
  }

  return {
    id: session.user_id,
    name: session.name,
    email: session.email,
    role: session.role,
  };
}

export function logoutUser(token) {
  deleteUserSession(token);
}