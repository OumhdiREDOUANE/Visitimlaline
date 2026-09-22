const fs = require('fs');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');

const databasePath = path.join(process.cwd(), 'data', 'visitmlaline.sqlite');
const seedPath = path.join(process.cwd(), 'database', 'seed.sql');

if (!fs.existsSync(databasePath)) {
    console.error('Database does not exist.');
    console.error('Run the database initialization script first.');
    process.exit(1);
}

if (!fs.existsSync(seedPath)) {
    console.error(`Seed file not found: ${seedPath}`);
    process.exit(1);
}

const db = new DatabaseSync(databasePath);

try {
    const seed = fs.readFileSync(seedPath, 'utf8');

    db.exec(seed);

    console.log('Demo data inserted successfully.');

    const activities = db.prepare(
        'SELECT id, slug, title, category, price_from FROM activities'
    ).all();

    const packs = db.prepare(
        'SELECT id, slug, title, price_from FROM packs'
    ).all();

    const bookings = db.prepare(
        'SELECT id, customer_name, activity_slug, date, time, guests, total_price, status FROM bookings'
    ).all();

    console.log('\nActivities:');
    console.table(activities);

    console.log('\nPacks:');
    console.table(packs);

    console.log('\nBookings:');
    console.table(bookings);

} catch (error) {
    console.error('Seed failed:');
    console.error(error);
    process.exitCode = 1;
} finally {
    db.close();
}