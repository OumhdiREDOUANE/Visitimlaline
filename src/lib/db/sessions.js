import { db } from './index';

export function createSession({
  userId,
  tokenHash,
  expiresAt,
}) {
  const statement = db.prepare(`
    INSERT INTO sessions (
      user_id,
      token_hash,
      expires_at
    )
    VALUES (?, ?, ?)
  `);

  const result = statement.run(
    userId,
    tokenHash,
    expiresAt
  );

  return Number(result.lastInsertRowid);
}

export function findSessionByTokenHash(tokenHash) {
  const statement = db.prepare(`
    SELECT
      s.id,
      s.user_id,
      s.token_hash,
      s.expires_at,
      s.created_at,
      s.last_used_at,
      u.name,
      u.email,
      u.role,
      u.active
    FROM sessions s
    INNER JOIN users u
      ON u.id = s.user_id
    WHERE s.token_hash = ?
    LIMIT 1
  `);

  return statement.get(tokenHash);
}

export function updateSessionLastUsed(id) {
  const statement = db.prepare(`
    UPDATE sessions
    SET last_used_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `);

  statement.run(id);
}

export function deleteSessionByTokenHash(tokenHash) {
  const statement = db.prepare(`
    DELETE FROM sessions
    WHERE token_hash = ?
  `);

  return statement.run(tokenHash).changes;
}