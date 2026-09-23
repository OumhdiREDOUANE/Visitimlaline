import { db } from './index';

export function findUserByEmail(email) {
  const statement = db.prepare(`
    SELECT
      id,
      name,
      email,
      password_hash,
      role,
      active,
      created_at,
      updated_at
    FROM users
    WHERE email = ?
    LIMIT 1
  `);

  return statement.get(email);
}

export function findUserById(id) {
  const statement = db.prepare(`
    SELECT
      id,
      name,
      email,
      role,
      active,
      created_at,
      updated_at
    FROM users
    WHERE id = ?
    LIMIT 1
  `);

  return statement.get(id);
}

export function createUser({
  name,
  email,
  passwordHash,
  role,
}) {
  const statement = db.prepare(`
    INSERT INTO users (
      name,
      email,
      password_hash,
      role,
      active
    )
    VALUES (?, ?, ?, ?, 1)
  `);

  const result = statement.run(
    name,
    email,
    passwordHash,
    role
  );

  return Number(result.lastInsertRowid);
}