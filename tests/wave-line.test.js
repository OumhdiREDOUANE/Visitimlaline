import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

/**
 * The wave on the form and experience cards, as the card's own border.
 *
 * The owner rejected an earlier shape for two reasons at once: a 28px band
 * drawn inside the card covered real copy — measured at 7.2px of a 16px line
 * box on the experience card's price and "Voir le détail" button, and 3.2px of
 * the "Confirmer la réservation" button on the booking wizard — and the wave
 * was not a border at all, just a stripe on top of one. So the straight border
 * is gone and the wave *is* the edge.
 *
 * That moves the fringe outside the card, which is the only shape that is both
 * what was asked for and safe. Everything else about it was measured rather
 * than assumed:
 *
 *   drawn inside the card, 28px      covers the price and the CTA
 *   drawn outside, but on the card   clipped by `overflow: hidden`, which
 *                                   ActivityCard needs for its hero photo
 *   drawn outside, as a sibling      the M10 shape; the audit keeps working
 *
 * The sibling is the load-bearing part. A fringe inside a card is an image node
 * in the subtree axe audits, and a 1.56:1 probe placed at the *top* of the card
 * — above the band, so nothing could be covering it — was then dropped to
 * `incomplete` by all three ways of painting the tile: a plain `::after`, a
 * masked one, and a repeating `background-image`. Only an inline `<svg>` was
 * flagged, i.e. measured. The owner's answer was to use the technique the
 * footer already uses, where the fringe is a sibling of the content and the
 * text stays audited. PROJECT_MAP.md §3.3.
 *
 * So this milestone retires the inline-SVG line. `WaveLine.js`, its rule and
 * its depth token are all orphans of it and go with it; the motif is declared
 * once again, in the shared ui layer, and the tile is cut by the same
 * `--wave-mask` the section boundaries use.
 */

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const path = (relative) => join(ROOT, relative);
const read = (relative) => readFileSync(path(relative), 'utf8');

const css = read('src/app/globals.css');
const card = read('src/components/ui/Card.js');
const edge = read('src/components/ui/WaveEdge.js');

/** The owner's tile, and the quarter turn of it the side bands need. */
const TILE = 'public/wave-wiggle.svg';
const SIDE_TILE = 'public/wave-wiggle-side.svg';

/**
 * Source with its comments stripped. Every technique this milestone weighs
 * against has to be nameable in the comments that explain the rejection, so
 * anything asserted about *code* has to be asserted about code.
 */
const code = (source) =>
  source
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '');

/** Every source file, so "declared once" can be checked across the tree. */
function sourceFiles(dir) {
  const output = [];

  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);

    if (statSync(full).isDirectory()) {
      output.push(...sourceFiles(full));
    } else if (/\.jsx?$/.test(entry)) {
      output.push(full);
    }
  }

  return output;
}

/** Every `<Card …>` opening tag, whitespace-collapsed, as the owner sees it. */
function cardTags(source) {
  return [...source.matchAll(/<Card\b[^>]*>/g)].map((match) =>
    match[0].replace(/\s+/g, ' ')
  );
}

/**
 * Every card that wears the wave, as (file, total cards, cards waved).
 *
 * The form cards hold the labels and help text of the booking journey; the
 * experience card is the showcase one, the third half of the reference's
 * `.border-img-bottom--blue`. The admin bookings page is the one that must not
 * be blanket-waved: its bookings table is a card with no form in it.
 */
const WAVED_CARDS = [
  ['src/app/login/page.js', 1, 1],
  ['src/app/(backoffice)/staff/check-in/page.js', 1, 1],
  ['src/components/booking/BookingWizard.js', 4, 4],
  ['src/app/(backoffice)/admin/bookings/page.js', 2, 1],
  ['src/components/site/ActivityCard.js', 1, 1],
];

/**
 * Cards that wear all four edges, the reference stylesheet's whole
 * `.border-img` box. The experience card is the one that was asked for: it is
 * the showcase card, the one the reference gives all four sides to. The form
 * cards keep the single bottom fringe — they hold labels, help lines and
 * buttons, and a frame around a form is a different thing from a frame around a
 * photograph.
 */
const FRAMED_CARDS = ['src/components/site/ActivityCard.js'];

/** Cards the owner did not ask for, and which must keep their plain border. */
const PLAIN_CARDS = [
  'src/components/site/PackCard.js',
  'src/components/site/Ticket.js',
  'src/components/ui/EmptyState.js',
  'src/app/(site)/experiences/[slug]/page.js',
  'src/app/(backoffice)/admin/notifications/page.js',
];

test('the wave is opt-in on Card, and comes from the shared ui layer', () => {
  // Card serves thirteen call sites, and most of them are not form cards.
  // Unconditional would wave the ticket, the notification list and the pack
  // grid, none of which were asked for.
  assert.match(card, /wave\s*=\s*false/, 'the prop must default to off');
  assert.match(card, /<WaveEdge\b/);
  assert.match(
    card,
    /import \{ WaveEdge \} from '@\/components\/ui\/WaveEdge\.js'/,
    'the motif is imported once, from the shared ui layer, never from site/'
  );
  assert.doesNotMatch(
    card,
    /components\/site\//,
    'ui/ must not reach up into site/'
  );
});

test('the wave is the border, so a waved card has no straight one', () => {
  // The plain constant keeps its border — the ticket, the notification list and
  // the pack grid are untouched — and the waved card is *that* constant with
  // the straight edge removed. Derived, not restated, because the two drifting
  // apart is exactly what put a border back under a wave once already.
  const constant = code(card).split('const CARD')[1].split(';')[0];

  assert.match(
    constant,
    /border border-ink\/10/,
    'cards that were not asked for keep the straight border'
  );
  assert.match(
    code(card),
    /const BORDERLESS = CARD\.replace\(/,
    'the waved card must be the plain card minus its border'
  );

  const branch = code(card).split(/if\s*\(!wave\)/)[1] ?? '';

  assert.notEqual(branch, '', 'Card must branch on the wave prop');
  assert.match(branch, /BORDERLESS/, 'the wave branch wears the borderless card');
  assert.doesNotMatch(
    branch,
    /\bborder\b/,
    'a waved card wears the wave as its border, not a border plus a wave'
  );

  // The card is a flex child of its wrapper so it keeps filling the grid row
  // now that the wrapper, not the card, is the grid item.
  assert.match(branch, /flex-1/);
});

test('the fringe is a sibling of the card, never inside it', () => {
  // The whole point. A fringe inside the card is an image node in the subtree
  // axe audits, and every text node on the card drops to `incomplete` — the
  // labels, the help lines and the button captions of the booking journey all
  // stop being measured. Proven by falsification with a 1.56:1 probe; see the
  // header and PROJECT_MAP.md §3.3.
  const body = code(card);

  assert.match(
    body,
    /<\/Tag>[\s\S]*<WaveEdge\b/,
    'WaveEdge must close after the card element, not inside it'
  );

  // And the card element itself holds children and nothing else.
  const inner = body.match(/<Tag\b[^>]*>([\s\S]*?)<\/Tag>/)?.[1] ?? '';

  assert.match(inner, /children/);
  assert.doesNotMatch(
    inner,
    /WaveEdge/,
    'the fringe must not be a child of the card'
  );
});

test('the card reserves a band for the fringe instead of padding', () => {
  // The fringe is out of flow, so nothing has to give way to it inside the
  // card — the wrapper holds the band. Without it the strip would sit in the
  // grid's own 24px gap, and 28px of wave would reach into the next row.
  const block = css.match(/\.card-wave\s*\{[^}]*\}/)?.[0] ?? '';

  assert.notEqual(block, '', 'the wrapper has no rule of its own');
  assert.match(block, /padding-bottom:\s*var\(--wave-depth\)/);
  assert.match(block, /display:\s*flex/);
  assert.match(block, /position:\s*relative/);
  assert.match(card, /card-wave/);

  // The host has to leave the flow. `.wave-edge-above` paints at `bottom: 100%`
  // of a zero-height host, so a host sitting directly under the card paints the
  // band back over the card's copy — 8px of the experience card's price and
  // CTA line, measured. Pinned to the wrapper's bottom it fills the padding.
  const pinned = css.match(/\.card-wave-bottom\s*\{[^}]*\}/)?.[0] ?? '';

  assert.notEqual(pinned, '', 'the strip host is not pinned to the wrapper');
  assert.match(pinned, /position:\s*absolute/);
  assert.match(pinned, /bottom:\s*0/);
  assert.match(pinned, /height:\s*0/);
});

test('the four-sided frame is opt-in, and the experience card is the only one', () => {
  // `wave` on its own is the bottom fringe the form cards shipped with. The
  // reference stylesheet gives all four sides of its box to the experience card
  // and only the bottom of the others, and that is what the owner asked for
  // here, so the distinction has to live in the prop rather than in which file
  // happens to use the component.
  assert.match(code(card), /wave === 'frame'/, 'frame is a third state of `wave`');

  const framed = sourceFiles(join(ROOT, 'src'))
    .filter((file) => /wave="frame"/.test(readFileSync(file, 'utf8')))
    .map((file) => file.replace(ROOT, '').split(/[\\/]/).join('/'));

  assert.deepEqual(
    framed,
    FRAMED_CARDS,
    'a four-sided frame on a form card was not asked for'
  );
});

test('each of the four bands is pinned to the edge it belongs to', () => {
  // The top band paints downward and the bottom band upward, each anchored to
  // the wrapper's own outer edge so the strip lands inside that side's padding
  // rather than outside the card. The sides are inset by one depth on both
  // axes: that inset is the card's height, which is how the corner stays closed
  // and how the left and right bands stop short of the top and bottom ones
  // instead of overprinting them.
  for (const side of ['top', 'bottom', 'left', 'right']) {
    const block =
      code(css).match(new RegExp(`\\.card-wave-${side}\\s*\\{[^}]*\\}`))?.[0] ?? '';

    assert.notEqual(block, '', `.card-wave-${side} has no rule of its own`);
    assert.match(
      block,
      /position:\s*absolute/,
      `.card-wave-${side} is in the flow, so it takes space from the card`
    );
  }

  const top = code(css).match(/\.card-wave-top\s*\{[^}]*\}/)[0];
  const bottom = code(css).match(/\.card-wave-bottom\s*\{[^}]*\}/)[0];
  const left = code(css).match(/\.card-wave-left\s*\{[^}]*\}/)[0];
  const right = code(css).match(/\.card-wave-right\s*\{[^}]*\}/)[0];

  assert.match(top, /top:\s*0/);
  assert.match(bottom, /bottom:\s*0/);
  assert.match(left, /left:\s*0/);
  assert.match(right, /right:\s*0/);

  for (const side of [left, right]) {
    assert.match(side, /width:\s*var\(--wave-depth\)/, 'the band is a depth wide');
    assert.match(side, /top:\s*var\(--wave-depth\)/, 'clear of the top band');
    assert.match(side, /bottom:\s*var\(--wave-depth\)/, 'clear of the bottom band');
  }
});

test('the side tile is the owner\'s tile turned a quarter, not a second drawing', () => {
  // The one place a second file is the right answer. The tile is a landscape
  // strip, so a vertical band needs it on its side — and CSS cannot turn a mask
  // image without turning the element that carries it, and an element that is
  // turned has to know how long it is. The turn therefore lives in the asset,
  // where the owner's path can be carried over byte for byte and the test can
  // prove the two files are the same drawing rather than two that agree today.
  const path = (svg) => svg.match(/\bd="([^"]+)"/)?.[1] ?? '';

  assert.notEqual(path(read(SIDE_TILE)), '', 'the side tile lost its path data');
  assert.equal(
    path(read(SIDE_TILE)),
    path(read(TILE)),
    'the side tile must carry the owner\'s path unchanged'
  );
  assert.match(
    read(SIDE_TILE),
    /viewBox="-15 0 15 29\.9"/,
    'a quarter turn needs the swapped viewBox or the drawing is clipped'
  );
  // 90, so the tile's up becomes right and the solid half ends up on the side
  // that faces the card, matching what the top and bottom bands already do.
  assert.match(read(SIDE_TILE), /transform="rotate\(90\)"/);
  assert.match(
    css,
    /--wave-mask-side:\s*url\(['"]?\/wave-wiggle-side\.svg['"]?\)/
  );

  // And the turn belongs in the asset, so the band needs no length of its own.
  // The earlier draft rotated the strip instead and asked for
  // `calc(100% - 2 * var(--wave-depth))` inside a slot that is one depth wide,
  // which is -28px.
  const after = code(css).match(/\.wave-edge-side::after\s*\{[^}]*\}/)?.[0] ?? '';

  assert.notEqual(after, '', 'the side band has no paint rule of its own');
  assert.match(after, /position:\s*absolute/);
  assert.match(after, /inset:\s*0/, 'the band must fill the slot it is given');
  assert.match(after, /mask-repeat:\s*repeat-y/);
  assert.match(after, /mask-size:\s*100% auto/);
  assert.doesNotMatch(
    code(css).slice(code(css).indexOf('.wave-edge-side')),
    /rotate\(\s*-?90deg\s*\)/,
    'a turned strip is the shape that cannot know its own length'
  );
});

test('all four bands are the one component, so all four are audited as siblings', () => {
  // The side bands are painted by a pseudo element like the top and bottom
  // ones, and they hang off the same wrapper for the same reason: an image
  // node inside a card drops that card's text to `incomplete`. They must not
  // become a second, card-local way of drawing the motif — that is how the two
  // directions of the section fringe drifted apart in the first place.
  const waveEdge = code(edge);

  assert.match(waveEdge, /side/);
  assert.match(
    waveEdge,
    /className=\{`wave-edge-side wave-edge-side-\$\{side\}/,
    'the side host must be built from the shared component'
  );

  const body = code(card);

  for (const side of ['top', 'left', 'right']) {
    assert.match(
      body,
      new RegExp(`card-wave-${side}[\\s\\S]{0,120}WaveEdge`),
      `.card-wave-${side} must wrap a WaveEdge, not its own mask`
    );
  }

  // No mask, and no colour literal, may reach Card.js. The colour has to come
  // from the tones map or Tailwind never emits the utility — the failure the
  // M10 suite guards, which is why the side bands cannot hardcode forest.
  assert.doesNotMatch(body, /mask-image/);
  assert.doesNotMatch(body, /--color-/);
});

test('every waved card wears it, and only the waved cards', () => {
  for (const [file, total, waved] of WAVED_CARDS) {
    const tags = cardTags(read(file));

    assert.equal(
      tags.length,
      total,
      `${file}: expected ${total} <Card>, found ${tags.length}`
    );
    assert.equal(
      tags.filter((tag) => /\bwave\b/.test(tag)).length,
      waved,
      `${file}: expected ${waved} of ${total} cards to carry wave`
    );
  }

  for (const file of PLAIN_CARDS) {
    const waved = cardTags(read(file)).filter((tag) =>
      /\bwave\b/.test(tag)
    );

    assert.deepEqual(
      waved,
      [],
      `${file} was not asked for and must keep its plain border`
    );
  }
});

test('the retired line is gone, with its rule and its token', () => {
  // Orphans of this milestone's own earlier shape. Leaving them would be two
  // live ways to draw one motif, which is how the two directions of the
  // section fringe drifted apart in the first place.
  assert.equal(
    existsSync(path('src/components/ui/WaveLine.js')),
    false,
    'WaveLine.js is retired; the motif lives in WaveEdge.js'
  );
  assert.doesNotMatch(
    css,
    /\.wave-line\b/,
    'the line rule is retired with the component'
  );
  assert.doesNotMatch(
    css,
    /--wave-line-depth/,
    'the line token is retired with the rule'
  );
});

test('the motif is declared once, and the tile is still the mask', () => {
  // One component, one mask token, one tile in public/ — the same invariant
  // the M10 suite locks for the section boundaries.
  const carriers = sourceFiles(join(ROOT, 'src')).filter((file) =>
    /wave-edge/.test(readFileSync(file, 'utf8'))
  );

  assert.deepEqual(
    carriers.map((file) => file.replace(ROOT, '').split(/[\\/]/).join('/')),
    ['src/components/ui/WaveEdge.js'],
    'the motif must be applied through one shared component'
  );

  assert.match(css, /--wave-mask:\s*url\(['"]?\/wave-wiggle\.svg['"]?\)/);
  assert.match(css, /\.wave-edge::after,\s*\n\s*\.wave-edge-above::after/);
  assert.ok(
    existsSync(path('public/wave-wiggle.svg')),
    'the mask token points at nothing'
  );
});

test('the wave is decorative, and a printed card gets its border back', () => {
  const edge = read('src/components/ui/WaveEdge.js');

  assert.match(edge, /<div\b[^>]*aria-hidden/);
  assert.match(edge, /\/>/, 'the host must be self-closing');
  assert.doesNotMatch(edge, /children/);

  // The fringe is already hidden in print by the `.wave-edge::after` rule the
  // M10 suite added. What print needs back is the straight edge, because a
  // waved card no longer has one.
  const print = css.slice(css.indexOf('@media print'));

  assert.match(
    print,
    /\.card-wave\s*>\s*:first-child\s*\{[^}]*border:\s*1px solid/,
    'a printed card wants its border, not a wave'
  );
});

test('the wave never lands on a control', () => {
  // Carried forward from the removal suite: the old wave frame *was* the
  // inputs' border, so a control must never depend on the motif for its edge,
  // and a `mask-image` cannot trace a `rounded-full` silhouette.
  const field = read('src/components/ui/Field.js');
  const button = read('src/components/ui/Button.js');
  const alert = read('src/components/ui/Alert.js');

  for (const [name, source] of [
    ['Field', field],
    ['Button', button],
    ['Alert', alert],
  ]) {
    assert.doesNotMatch(
      source,
      /wave/,
      `${name} is a control and must keep its own border`
    );
  }

  assert.match(field, /border bg-surface/);
  assert.match(field, /border-ink\/20 focus:border-terra/);
});
