import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

import { formatDurationRange } from '../src/lib/format.js';

/**
 * The showcase redesign (2026-09-25) rebuilt the public product surfaces on
 * the anatomy borrowed from the two reference sites: a photo, the commercial
 * facts, a price block and a real call to action. The palette and the fonts
 * were left exactly as they were.
 *
 * These tests lock the four things that could silently regress: a card losing
 * the facts it now advertises, the duration wording drifting between the card
 * and the detail page, the hero going back to a flat opacity, and local
 * photography paths being replaced by remote stock images.
 */

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const read = (relative) =>
  readFileSync(join(ROOT, relative), 'utf8');

const seed = read('database/seed.sql');

test('the catalog uses local Timlaline photography', () => {
  const paths = [
    ...seed.matchAll(
      /["'](\/(?:images\/[^"']+|visitimlaline-[^"']+\.webp))["']/g
    ),
  ].map((match) => match[1]);

  assert.ok(paths.length > 0, 'no local catalog image paths found');
  assert.ok(
    paths.every((path) => path.endsWith('.webp')),
    'catalog photography must use WebP assets'
  );
  for (const imagePath of new Set(paths)) {
    assert.ok(
      existsSync(join(ROOT, 'public', imagePath.slice(1))),
      `${imagePath} is missing from public/`
    );
  }
  assert.doesNotMatch(
    seed,
    /https:\/\/images\.unsplash\.com/,
    'a remote stock image URL remains in the catalog seed'
  );
});

test('the catalog pack heroes use local photography', () => {
  for (const hero of [
    '/visitimlaline-ultimate-ride-pack.webp',
    '/visitimlaline-desert-escape-pack.webp',
    '/visitimlaline-the-wild-trio-pack.webp',
  ]) {
    assert.match(seed, new RegExp(hero.replaceAll('.', '\\.')));
    assert.ok(existsSync(join(ROOT, 'public', hero.slice(1))));
  }
});

test('the experience card advertises the commercial facts', () => {
  const card = read('src/components/site/ActivityCard.js');

  // What is included, as a check list, the way the reference cards do.
  assert.match(card, /inclusions/);
  assert.match(card, /✓/);
  // Duration, the single most-asked question before booking.
  assert.match(card, /formatDurationRange/);
  // A real button, not a bare underlined link.
  assert.match(card, /<Button/);
  assert.doesNotMatch(
    card,
    /underline underline-offset-4/,
    'the card fell back to a text link instead of a button'
  );
});

test('the pack card uses the same check list as the experience card', () => {
  const pack = read('src/components/site/PackCard.js');

  assert.match(pack, /✓/);
  assert.match(pack, /<Button/);
});

test('duration formatting is shared, not re-derived per component', () => {
  const format = read('src/lib/format.js');

  assert.match(format, /export function formatDurationRange/);

  for (const consumer of [
    'src/components/site/ActivityCard.js',
    'src/app/(site)/experiences/[slug]/page.js',
  ]) {
    assert.match(
      read(consumer),
      /formatDurationRange/,
      `${consumer} does not use the shared duration helper`
    );
  }
});

test('formatDurationRange collapses a fixed duration and expands a range', () => {
  const t = (key) => (key === 'common.minutes' ? 'min' : key);

  assert.equal(formatDurationRange(60, 60, t), '60 min');
  assert.equal(formatDurationRange(60, 120, t), '60–120 min');
  assert.equal(formatDurationRange(60, null, t), '60 min');
  assert.equal(formatDurationRange(null, null, t), '');
});

test('the home hero darkens the photo with a scrim, not a flat opacity', () => {
  const home = read('src/app/(site)/page.js');

  assert.match(home, /bg-linear-to-r/, 'the hero has no directional scrim');
  assert.doesNotMatch(
    home,
    /opacity-\d+["'\s]/,
    'a flat opacity on the hero photo is back'
  );
});

test('the home page offers the category rail from the reference design', () => {
  const home = read('src/app/(site)/page.js');

  assert.match(home, /experiences\?category=/);
  assert.match(home, /categoryKey/);
});

test('the category pill is shared by the rail and the listing filter', () => {
  const pill = read('src/components/site/CategoryPill.js');

  assert.match(pill, /aria-current/);

  for (const consumer of [
    'src/app/(site)/page.js',
    'src/app/(site)/experiences/page.js',
  ]) {
    assert.match(
      read(consumer),
      /CategoryPill/,
      `${consumer} does not use the shared pill`
    );
  }

  assert.doesNotMatch(
    read('src/app/(site)/experiences/page.js'),
    /function FilterLink/,
    'the local pill copy is back alongside the shared component'
  );
});
