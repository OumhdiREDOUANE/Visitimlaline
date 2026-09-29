// scripts/create-user.js
// Usage: node scripts/create-user.js <email> <password> <admin|staff> [name]
import { join } from 'node:path';
import crypto from 'node:crypto';
import { DatabaseSync } from 'node:sqlite';

const dbPath = join(
  process.cwd(),
  'data',
  'visitmlaline.sqlite'
);

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64);

  return `${salt}:${hash.toString('hex')}`;
}

const email = process.argv[2];
const password = process.argv[3];
const role = process.argv[4];
const name = process.argv[5] || role;

if (!email || !password || !role) {
  console.error(
    'Usage: node scripts/create-user.js email password role "Name"'
  );
  process.exit(1);
}

if (!['admin', 'staff'].includes(role)) {
  console.error('Role must be admin or staff');
  process.exit(1);
}

const db = new DatabaseSync(dbPath);

try {
  db.prepare(
    `INSERT INTO users (
      name,
      email,
      password_hash,
      role,
      active
    )
    VALUES (?, ?, ?, ?, 1)`
  ).run(name, email.toLowerCase(), hashPassword(password), role);

  console.log(`User created: ${email} (${role})`);
} catch (error) {
  console.error('Failed to create user:', error.message);
  process.exitCode = 1;
} finally {
  db.close();
}
