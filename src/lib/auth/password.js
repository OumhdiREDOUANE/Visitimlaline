import crypto from 'node:crypto';

const KEY_LENGTH = 64;

export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');

  const hash = crypto.scryptSync(
    password,
    salt,
    KEY_LENGTH
  );

  return `${salt}:${hash.toString('hex')}`;
}

export function verifyPassword(password, storedHash) {
  if (!storedHash || !storedHash.includes(':')) {
    return false;
  }

  const [salt, hashHex] = storedHash.split(':');

  const storedHashBuffer = Buffer.from(
    hashHex,
    'hex'
  );

  const derivedHash = crypto.scryptSync(
    password,
    salt,
    KEY_LENGTH
  );

  if (
    storedHashBuffer.length !== derivedHash.length
  ) {
    return false;
  }

  return crypto.timingSafeEqual(
    storedHashBuffer,
    derivedHash
  );
}