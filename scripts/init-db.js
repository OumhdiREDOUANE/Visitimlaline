// scripts/init-db.js
const fs = require('fs');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');

const root = process.cwd();

const databasePath = path.join(root, 'data', 'visitmlaline.sqlite');
const schemaPath = path.join(root, 'database', 'schema.sql');

fs.mkdirSync(path.dirname(databasePath), { recursive: true });

const db = new DatabaseSync(databasePath);

const schema = fs.readFileSync(schemaPath, 'utf8');

db.exec(schema);

console.log('Database created successfully.');
console.log(`Database: ${databasePath}`);

db.close();