import crypto from 'node:crypto';

import {
  createSession,
  findSessionByTokenHash,
  updateSessionLastUsed,
  deleteSessionByTokenHash,
} from '../db/sessions';

const SESSION_DURATION_DAYS = 7;

export function generateSessionToken() {
  return crypto.randomBytes(32).toString('hex');
}

export function hashSessionToken(token) {
  return crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
}

export function createUserSession(userId) {
  const token = generateSessionToken();

  const tokenHash = hashSessionToken(token);

  const expiresAt = new Date(
    Date.now() +
      SESSION_DURATION_DAYS *
        24 *
        60 *
        60 *
        1000
  );

  createSession({
    userId,
    tokenHash,
    expiresAt: expiresAt.toISOString(),
  });

  return {
    token,
    expiresAt,
  };
}

export function getSessionFromToken(token) {
  if (!token) {
    return null;
  }

  const tokenHash = hashSessionToken(token);

  const session =
    findSessionByTokenHash(tokenHash);

  if (!session) {
    return null;
  }

  if (!session.active) {
    return null;
  }

  if (
    new Date(session.expires_at).getTime() <=
    Date.now()
  ) {
    deleteSessionByTokenHash(tokenHash);
    return null;
  }

  updateSessionLastUsed(session.id);

  return session;
}

export function deleteUserSession(token) {
  if (!token) {
    return;
  }

  const tokenHash = hashSessionToken(token);

  deleteSessionByTokenHash(tokenHash);
}