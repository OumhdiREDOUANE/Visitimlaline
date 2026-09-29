// scripts/init-db.js
import { mkdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { DatabaseSync } from 'node:sqlite';

const databasePath = join(
  process.cwd(),
  'data',
  'visitmlaline.sqlite'
);

const schemaPath = join(
  process.cwd(),
  'database',
  'schema.sql'
);

mkdirSync(dirname(databasePath), { recursive: true });

const db = new DatabaseSync(databasePath);

db.exec(readFileSync(schemaPath, 'utf8'));

db.close();

console.log('Database created successfully.');
console.log(`Database: ${databasePath}`);
