INSERT INTO packs (
  slug,
  title,
  description,
  price_from,
  duration,
  hero,
  includes,
  active,
  updated_at
)
VALUES
  (
    'the-adventurer',
    'The Ultimate Ride Pack',
    'Quad, sandboarding and cave discovery for a complete Timlaline adventure.',
    400,
    'Half day',
    '/visitimlaline-ultimate-ride-pack.webp',
    '["Quad Adventure","Sandboarding in the Dunes","Cave Discovery"]',
    1,
    CURRENT_TIMESTAMP
  ),
  (
    'the-sunset',
    'Desert Escape Pack',
    'A camel caravan, sandboarding and sunset tea across the Timlaline dunes.',
    350,
    'Half day',
    '/visitimlaline-desert-escape-pack.webp',
    '["Camel Caravan Experience","Sandboarding in the Dunes","Sunset Experience & Tea"]',
    1,
    CURRENT_TIMESTAMP
  ),
  (
    'the-complete-experience',
    'The Wild Trio Pack',
    'The complete Timlaline adventure combining quad, camel, cave and sunset experiences.',
    450,
    'Full day',
    '/visitimlaline-the-wild-trio-pack.webp',
    '["Quad Adventure","Camel Caravan Experience","Cave Discovery","Sunset Experience & Tea"]',
    1,
    CURRENT_TIMESTAMP
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