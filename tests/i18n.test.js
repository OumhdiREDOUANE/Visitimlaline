import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

import fr from '../src/lib/i18n/dictionaries/fr.js';
import en from '../src/lib/i18n/dictionaries/en.js';
import { createTranslator } from '../src/lib/i18n/translate.js';
import { normalizeLocale } from '../src/lib/i18n/config.js';

function flatten(node, prefix = '', output = {}) {
  for (const [key, value] of Object.entries(node)) {
    const path = prefix ? `${prefix}.${key}` : key;

    if (value && typeof value === 'object') {
      flatten(value, path, output);
    } else {
      output[path] = String(value);
    }
  }

  return output;
}

function placeholders(value) {
  return [
    ...String(value).matchAll(/\{(\w+)\}/g),
  ]
    .map((match) => match[1])
    .sort()
    .join(',');
}

function sourceFiles(dir) {
  const output = [];

  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);

    if (statSync(full).isDirectory()) {
      output.push(...sourceFiles(full));
    } else if (/\.(js|jsx)$/.test(entry)) {
      output.push(full);
    }
  }

  return output;
}

const frFlat = flatten(fr);
const enFlat = flatten(en);

test('French and English dictionaries expose the exact same keys', () => {
  const frKeys = Object.keys(frFlat).sort();
  const enKeys = Object.keys(enFlat).sort();

  assert.deepEqual(
    enKeys.filter((key) => !frFlat[key]),
    [],
    'keys present in en but missing in fr'
  );

  assert.deepEqual(
    frKeys.filter((key) => !enFlat[key]),
    [],
    'keys present in fr but missing in en'
  );
});

test('every key uses the same interpolation placeholders in both languages', () => {
  for (const [key, value] of Object.entries(frFlat)) {
    assert.equal(
      placeholders(enFlat[key]),
      placeholders(value),
      `placeholders differ for ${key}`
    );
  }
});

test('no translation is empty', () => {
  for (const [key, value] of Object.entries(frFlat)) {
    assert.ok(value.trim(), `fr.${key} is empty`);
    assert.ok(enFlat[key].trim(), `en.${key} is empty`);
  }
});

test('translator resolves, interpolates and falls back', () => {
  const t = createTranslator(fr);

  assert.equal(t('nav.book'), 'Réserver');
  assert.equal(
    t('booking.slotRemaining', { count: 3 }),
    '3 place(s) restante(s)'
  );
  assert.equal(t('unknown.key'), 'unknown.key');
  assert.equal(t('unknown.key', null, 'Quad'), 'Quad');
  assert.equal(
    t('booking.slotRemaining', { wrong: 1 }),
    '{count} place(s) restante(s)'
  );
});

test('normalizeLocale falls back to French', () => {
  assert.equal(normalizeLocale('en'), 'en');
  assert.equal(normalizeLocale('fr'), 'fr');
  assert.equal(normalizeLocale('de'), 'fr');
  assert.equal(normalizeLocale(undefined), 'fr');
});

test('every t("…") literal used in the app exists in both dictionaries', () => {
  const roots = ['src/app', 'src/components']
    .map((path) => join(process.cwd(), path))
    .filter((path) => {
      try {
        return statSync(path).isDirectory();
      } catch {
        return false;
      }
    });

  const missing = [];

  for (const file of roots.flatMap(sourceFiles)) {
    const content = readFileSync(file, 'utf8');

    for (const match of content.matchAll(
      /\bt\(\s*'([a-zA-Z0-9_.]+)'/g
    )) {
      const key = match[1];

      if (!frFlat[key] || !enFlat[key]) {
        missing.push(`${file}: ${key}`);
      }
    }
  }

  assert.deepEqual(missing, []);
});
