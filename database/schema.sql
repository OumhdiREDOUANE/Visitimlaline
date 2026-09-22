PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS activities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    price_from REAL NOT NULL DEFAULT 0,
    duration_min INTEGER,
    duration_max INTEGER,
    hero TEXT,
    gallery TEXT,
    inclusions TEXT,
    good_to_know TEXT,
    itinerary TEXT,
    active INTEGER NOT NULL DEFAULT 1 CHECK (active IN (0, 1)),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS packs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT,
    price_from REAL NOT NULL DEFAULT 0,
    duration TEXT,
    hero TEXT,
    includes TEXT,
    active INTEGER NOT NULL DEFAULT 1 CHECK (active IN (0, 1)),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    activity_slug TEXT,
    pack_slug TEXT,
    customer_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    guests INTEGER NOT NULL CHECK (guests > 0),
    base_price REAL NOT NULL DEFAULT 0,
    addon_price REAL NOT NULL DEFAULT 0,
    total_price REAL NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'NOT PAID YET',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    arrived_at TEXT,

    FOREIGN KEY (activity_slug)
        REFERENCES activities(slug)
        ON UPDATE CASCADE
        ON DELETE SET NULL,

    FOREIGN KEY (pack_slug)
        REFERENCES packs(slug)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_id INTEGER NOT NULL,
    type TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    read_at TEXT,

    FOREIGN KEY (booking_id)
        REFERENCES bookings(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_activities_slug
    ON activities(slug);

CREATE INDEX IF NOT EXISTS idx_activities_category
    ON activities(category);

CREATE INDEX IF NOT EXISTS idx_activities_active
    ON activities(active);

CREATE INDEX IF NOT EXISTS idx_packs_slug
    ON packs(slug);

CREATE INDEX IF NOT EXISTS idx_packs_active
    ON packs(active);

CREATE INDEX IF NOT EXISTS idx_bookings_activity
    ON bookings(activity_slug);

CREATE INDEX IF NOT EXISTS idx_bookings_pack
    ON bookings(pack_slug);

CREATE INDEX IF NOT EXISTS idx_bookings_date
    ON bookings(date);

CREATE INDEX IF NOT EXISTS idx_bookings_status
    ON bookings(status);

CREATE INDEX IF NOT EXISTS idx_notifications_booking
    ON notifications(booking_id);

CREATE INDEX IF NOT EXISTS idx_notifications_read
    ON notifications(read_at);
    