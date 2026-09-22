
PRAGMA foreign_keys = ON;

-- ============================================
-- ACTIVITIES
-- ============================================

INSERT OR IGNORE INTO activities (
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
    45,
    60,
    120,
    'https://images.unsplash.com/photo-1558981806-ec527fa84c39',
    '[
        "https://images.unsplash.com/photo-1558981806-ec527fa84c39",
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
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
    'sunset-experience',
    'Sunset Experience',
    'sunset',
    'Enjoy a memorable sunset experience surrounded by the Atlantic and desert landscape.',
    35,
    60,
    90,
    'https://images.unsplash.com/photo-1500534623283-312aade485b7',
    '[
        "https://images.unsplash.com/photo-1500534623283-312aade485b7",
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
    ]',
    '[
        "Sunset viewing",
        "Local guide",
        "Refreshment"
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
),
(
    'cave-discovery',
    'Cave Discovery',
    'cave',
    'Discover natural cave landscapes and learn more about the local environment.',
    30,
    60,
    120,
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e',
    '[
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
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
    'local-experience',
    'Local Experience',
    'local',
    'Share a warm Moroccan local experience with tea, food and authentic human interaction.',
    25,
    60,
    90,
    'https://images.unsplash.com/photo-1547592180-85f173990554',
    '[
        "https://images.unsplash.com/photo-1547592180-85f173990554",
        "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f"
    ]',
    '[
        "Moroccan tea",
        "Local food",
        "Local host"
    ]',
    '[
        "Tell us about dietary restrictions",
        "Respect local customs",
        "The experience may vary depending on the host"
    ]',
    '[
        ["Welcome", "Meet your local host"],
        ["Tea", "Enjoy traditional Moroccan tea"],
        ["Food", "Discover local food"],
        ["Conversation", "Share the local experience"]
    ]',
    1
);

-- ============================================
-- PACKS
-- ============================================

INSERT OR IGNORE INTO packs (
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
    'The Adventurer',
    'A combination of Quad Adventure and Cave Discovery.',
    65,
    '2-3 hours',
    'https://images.unsplash.com/photo-1558981806-ec527fa84c39',
    '[
        "Quad Adventure",
        "Cave Discovery"
    ]',
    1
),
(
    'the-sunset',
    'The Sunset',
    'Enjoy a Quad Adventure followed by a beautiful sunset experience.',
    70,
    '2-3 hours',
    'https://images.unsplash.com/photo-1500534623283-312aade485b7',
    '[
        "Quad Adventure",
        "Sunset Experience"
    ]',
    1
),
(
    'the-complete-experience',
    'The Complete Experience',
    'The complete Visitimlaline adventure combining Quad, Cave, Sunset and Local Experience.',
    110,
    '4-6 hours',
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee',
    '[
        "Quad Adventure",
        "Cave Discovery",
        "Sunset Experience",
        "Local Experience"
    ]',
    1
);

-- ============================================
-- DEMO BOOKINGS
-- ============================================

INSERT INTO bookings (
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
    'quad-adventure',
    NULL,
    'John Demo',
    'john@example.com',
    '+212600000001',
    '2026-10-10',
    '10:00',
    2,
    45,
    0,
    90,
    'NOT PAID YET'
),
(
    'sunset-experience',
    NULL,
    'Sarah Demo',
    'sarah@example.com',
    '+212600000002',
    '2026-10-11',
    '17:30',
    3,
    35,
    0,
    105,
    'NOT PAID YET'
),
(
    'cave-discovery',
    NULL,
    'Alex Demo',
    'alex@example.com',
    '+212600000003',
    '2026-10-12',
    '14:00',
    2,
    30,
    0,
    60,
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
WHERE customer_name = 'Alex Demo'
LIMIT 1;

