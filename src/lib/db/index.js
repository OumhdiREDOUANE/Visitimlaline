import { DatabaseSync } from 'node:sqlite';
import path from 'path';


const databasePath = path.join(
  process.cwd(),
  'data',
  'visitmlaline.sqlite'
);

const globalForDb = globalThis;

export const db =
  globalForDb.__visitmlaline_db ??
  new DatabaseSync(databasePath);

if (process.env.NODE_ENV !== 'production') {
  globalForDb.__visitmlaline_db = db;
}

db.exec(`
  PRAGMA foreign_keys = ON;
`);export function dbTransaction() {
  db.exec('BEGIN IMMEDIATE');
}

export function commitTransaction() {
  db.exec('COMMIT');
}

export function rollbackTransaction() {
  db.exec('ROLLBACK');
}