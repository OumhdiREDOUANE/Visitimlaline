PRAGMA foreign_keys = ON;

-- ============================================
-- ACTIVITIES
-- ============================================

INSERT INTO activities (
    slug,
    title,
    category,
    description,
    price_from,
    duration_min,
    duration_max,
    hero,
    gallery,
    inclusions,
    good_to_know,
    itinerary,
    active
) VALUES
(
    'quad-adventure',
    'Quad Adventure',
    'quad',
    'Explore the Timlaline landscape on an exciting quad adventure.',
    450,
    60,
    120,
    '/images/quad/timlaline-quad-adventure-desert-dunes1.webp',
    '[
        "/images/quad/timlaline-quad-adventure-desert-dunes1.webp",
        "/images/quad/timlaline-atv-desert-adventure-morocco.webp",
        "/images/quad/timlaline-quad-ride-sunset-desert.webp",
        "/images/quad/timlaline-quad-riding-golden-dunes.webp"
    ]',
    '[
        "Quad bike",
        "Safety equipment",
        "Local guide"
    ]',
    '[
        "Arrive 15 minutes early",
        "Comfortable clothes recommended",
        "Driver licence may be required depending on the vehicle"
    ]',
    '[
        ["Welcome", "Meet your guide and receive the safety briefing"],
        ["Departure", "Start the quad adventure through the landscape"],
        ["Adventure", "Explore the route and enjoy the scenery"],
        ["Return", "Return to the starting point"]
    ]',
    1
),
(
    'sandboarding-dunes',
    'Sandboarding in the Dunes',
    'sandboard',
    'Carve down the golden coastal dunes of Timlaline facing the Atlantic Ocean.',
    250,
    60,
    90,
    '/images/sandboard/timlaline-sandboarding-desert-dunes1.webp',
    '[
        "/images/sandboard/timlaline-sandboarding-desert-dunes1.webp",
        "/images/sandboard/timlaline-sandboard-ride-golden-dunes.webp",
        "/images/sandboard/timlaline-sandboarding-adventure-morocco.webp",
        "/images/sandboard/timlaline-sandboarding-sunset-timlaline.webp"
    ]',
    '[
        "Pro sandboard & wax",
        "Dune guide & instruction",
        "Cold water & Moroccan tea"
    ]',
    '[
        "Suitable for beginners and thrill-seekers",
        "Barefoot or light sneakers recommended on the sand",
        "Best golden light in the late afternoon"
    ]',
    '[
        ["Meetup", "Welcome at the Timlaline canyon base"],
        ["Climb", "Short scenic walk to the top of the main dune"],
        ["Ride", "Learn balance techniques and glide down the dunes"],
        ["Tea Break", "Relax with Moroccan mint tea overlooking the ocean"]
    ]',
    1
),
(
    'camel-ride-tour',
    'Camel Caravan Experience',
    'camel',
    'Follow the ancient coastal trail on a peaceful camel trek across the dunes and cliffs of Timlaline.',
    300,
    60,
    90,
    '/images/camel tour/timlaline-camel-caravan-desert-timlaline.webp',
    '[
        "/images/camel tour/timlaline-camel-caravan-desert-timlaline.webp",
        "/images/camel tour/timlaline-camel-ride-desert-morocco1.webp",
        "/images/camel tour/timlaline-camel-ride-sunset-timlaline.webp",
        "/images/camel tour/timlaline-camel-tour-golden-dunes.webp"
    ]',
    '[
        "Guided camel trek",
        "Traditional nomad scarf photo stop",
        "Moroccan mint tea"
    ]',
    '[
        "Family friendly (kids can ride tandem)",
        "Long pants and sunscreen recommended",
        "Arrive 15 minutes before departure"
    ]',
    '[
        ["Welcome", "Meet the camel handlers and your gentle dromedary"],
        ["Coastal Trail", "Ride along the ridge where sand dunes meet the Atlantic"],
        ["Photo Stop", "Pause on the highest crest for panoramic photos"],
        ["Return", "Head back to camp for traditional mint tea"]
    ]',
    1
),
(
    'cave-discovery',
    'Cave Discovery',
    'cave',
    'Discover natural cave landscapes and learn more about the local environment.',
    300,
    60,
    120,
    '/images/caves/timlaline-cave-exploration-desert.webp',
    '[
        "/images/caves/timlaline-cave-exploration-desert.webp",
        "/images/caves/timlaline-canyon-nature-tour-morocco1.webp",
        "/images/caves/timlaline-canyon-to-beach-nature-tour.webp",
        "/images/caves/timlaline-cliffs-beach-birds-timlaline.webp"
    ]',
    '[
        "Local guide",
        "Safety briefing",
        "Cave exploration"
    ]',
    '[
        "Wear comfortable shoes",
        "Some areas may be uneven",
        "Follow the guide instructions"
    ]',
    '[
        ["Briefing", "Introduction and safety instructions"],
        ["Walk", "Follow the route toward the cave"],
        ["Discovery", "Explore the cave area"],
        ["Return", "Return with the guide"]
    ]',
    1
),
(
    'sunset-experience',
    'Sunset Experience',
    'sunset',
    'Enjoy a memorable sunset experience surrounded by the Atlantic and desert landscape.',
    350,
    60,
    90,
    '/images/sunset/timlaline-sunset-experience-desert1.webp',
    '[
        "/images/sunset/timlaline-sunset-experience-desert1.webp",
        "/images/sunset/timlaline-desert-sunset-atlantic-coast.webp",
        "/images/sunset/timlaline-moroccan-tea-sunset-timlaline.webp",
        "/images/sunset/timlaline-sunset-desert-view-morocco.webp"
    ]',
    '[
        "Sunset viewing",
        "Local guide",
        "Moroccan tea"
    ]',
    '[
        "Sunset time varies by date",
        "Bring a light jacket",
        "Please arrive before departure"
    ]',
    '[
        ["Arrival", "Meet the local team"],
        ["Walk", "Move to the sunset viewpoint"],
        ["Sunset", "Enjoy the sunset and landscape"],
        ["Return", "Return to the meeting point"]
    ]',
    1
)
ON CONFLICT(slug) DO UPDATE SET
    title = excluded.title,
    category = excluded.category,
    description = excluded.description,
    price_from = excluded.price_from,
    duration_min = excluded.duration_min,
    duration_max = excluded.duration_max,
    hero = excluded.hero,
    gallery = excluded.gallery,
    inclusions = excluded.inclusions,
    good_to_know = excluded.good_to_know,
    itinerary = excluded.itinerary,
    active = excluded.active,
    updated_at = CURRENT_TIMESTAMP;

DELETE FROM activities
WHERE slug = 'local-experience';

-- ============================================
-- PACKS
-- ============================================

INSERT INTO packs (
    slug,
    title,
    description,
    price_from,
    duration,
    hero,
    includes,
    active
) VALUES
(
    'the-adventurer',
    'The Ultimate Ride Pack',
    'A combination of Quad Adventure, Sandboarding in the Dunes and Cave Discovery.',
    650,
    '3-4 hours',
    '/visitimlaline-ultimate-ride-pack.webp',
    '[
        "Quad Adventure",
        "Sandboarding in the Dunes",
        "Cave Discovery"
    ]',
    1
),
(
    'the-sunset',
    'Desert Escape Pack',
    'A camel caravan, sandboarding and sunset tea across the Timlaline dunes.',
    700,
    '3-4 hours',
    '/visitimlaline-desert-escape-pack.webp',
    '[
        "Camel Caravan Experience",
        "Sandboarding in the Dunes",
        "Sunset Experience & Tea"
    ]',
    1
),
(
    'the-complete-experience',
    'The Wild Trio Pack',
    'The complete Timlaline adventure combining quad, camel, cave and sunset experiences.',
    1100,
    '5-7 hours',
    '/visitimlaline-the-wild-trio-pack.webp',
    '[
        "Quad Adventure",
        "Camel Caravan Experience",
        "Cave Discovery",
        "Sunset Experience & Tea"
    ]',
    1
)
ON CONFLICT(slug) DO UPDATE SET
    title = excluded.title,
    description = excluded.description,
    price_from = excluded.price_from,
    duration = excluded.duration,
    hero = excluded.hero,
    includes = excluded.includes,
    active = excluded.active,
    updated_at = CURRENT_TIMESTAMP;

-- ============================================
-- DEMO BOOKINGS
-- ============================================

INSERT OR IGNORE INTO bookings (
    booking_reference,
    access_code,
    activity_slug,
    pack_slug,
    customer_name,
    email,
    phone,
    date,
    time,
    guests,
    base_price,
    addon_price,
    total_price,
    status
) VALUES
(
    'BK-4A1B2C3D',
    'QUAD-2A3B-4C5D',
    'quad-adventure',
    NULL,
    'John Demo',
    'john@example.com',
    '+212600000001',
    '2026-10-10',
    '10:00',
    2,
    450,
    0,
    900,
    'NOT PAID YET'
),
(
    'BK-5E6F7A8B',
    'SUNS-2J3K-4L5M',
    'sunset-experience',
    NULL,
    'Sarah Demo',
    'sarah@example.com',
    '+212600000002',
    '2026-10-11',
    '17:30',
    3,
    350,
    0,
    1050,
    'NOT PAID YET'
),
(
    'BK-9C0D1E2F',
    'CAVE-6E7F-8G9H',
    'cave-discovery',
    NULL,
    'Alex Demo',
    'alex@example.com',
    '+212600000003',
    '2026-10-12',
    '14:00',
    2,
    300,
    0,
    600,
    'ARRIVED'
);

-- ============================================
-- DEMO NOTIFICATION
-- ============================================

INSERT INTO notifications (
    booking_id,
    type,
    message
)
SELECT
    id,
    'ARRIVAL',
    'Demo customer has arrived.'
FROM bookings
WHERE booking_reference = 'BK-9C0D1E2F'
  AND NOT EXISTS (
      SELECT 1
      FROM notifications
      WHERE booking_id = bookings.id
        AND type = 'ARRIVAL'
  )
LIMIT 1;
