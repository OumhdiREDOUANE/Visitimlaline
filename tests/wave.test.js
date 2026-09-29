import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

/**
 * The wavy divider is back, at the owner's request: the boundary motif from
 * the reference stylesheet (`.border-img-bottom--blue` / `.border-img-top--blue`),
 * rebuilt on the supplied wiggle tile.
 *
 * These tests lock three things, in order of how much damage getting them
 * wrong would do.
 *
 * 1. The wave host is always an empty decorative sibling. axe-core's
 *    `color-contrast` rule drops text to `incomplete` — unmeasured, not
 *    passing — wherever its subtree holds an image node, so a fringe hung off a
 *    section hides that section's copy from the audit. That is not
 *    hypothetical: it is how the footer's copyright sat at 4.47:1 for as long
 *    as it did. Verified by falsification — see PROJECT_MAP.md §3.3, "the
 *    fringe blinds the audit", which also corrects the mechanism this test's
 *    name used to blame: a `mask-image` is one of three ways in, not the way in.
 * 2. Controls keep their own border. The old wave frame used to *be* the
 *    input's border, so pulling it out is the one edit in this motif's
 *    history that could leave a field with no edge at all.
 * 3. The wave stays on section boundaries, never on a rounded pill or a form
 *    control — a `mask-image` cannot follow a `rounded-full` silhouette, and
 *    masking a control would hide its own focus ring.
 */

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const read = (relative) =>
  readFileSync(join(ROOT, relative), 'utf8');

const css = read('src/app/globals.css');
const home = read('src/app/(site)/page.js');
const layout = read('src/app/(site)/layout.js');
const footer = read('src/components/site/Footer.js');
const waveEdge = read('src/components/ui/WaveEdge.js');

const TILE = 'public/wave-wiggle.svg';

/** Every source file, so the "only one host" rule can be checked globally. */
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

test('the wiggle tile is served from public/', () => {
  const path = join(ROOT, TILE);

  assert.ok(
    existsSync(path),
    `${TILE} is missing — the mask points at nothing`
  );

  const svg = readFileSync(path, 'utf8');

  assert.match(svg, /<svg/);
  assert.match(svg, /viewBox="0 0 29\.9 15"/, 'the tile geometry changed');
  assert.match(
    svg,
    /<path[^>]*\bd="[^"]{120,}"/,
    'the tile lost its path data'
  );
});

test('the stylesheet cuts the wave out of that tile', () => {
  assert.match(
    css,
    /--wave-mask:\s*url\(['"]?\/wave-wiggle\.svg['"]?\)/,
    'the mask token must point at the tile in public/'
  );
  assert.match(css, /--wave-depth:/);
  assert.match(css, /--wave-color:/);
});

test('the wave colour comes from the palette, not the reference cyan', () => {
  // #36e0dc is the reference site's brand cyan. Swapping it in would break
  // the owner's standing instruction to keep the measured palette.
  assert.doesNotMatch(
    css,
    /#36e0dc/i,
    'the reference cyan leaked into the palette'
  );
  assert.match(
    css,
    /--wave-color:\s*var\(--color-/,
    'the default wave colour must be a palette token'
  );
});

test('the mask only ever lands on a pseudo-element', () => {
  // Split the stylesheet into `selector { ... }` blocks and check the owner
  // of every mask declaration.
  const blocks = css
    .split('}')
    .map((block) => block.split('{').map((part) => part.trim()))
    .filter((parts) => parts.length === 2);

  const offenders = [];

  for (const [selector, body] of blocks) {
    if (!/mask-image/.test(body)) {
      continue;
    }

    if (!/::(after|before)/.test(selector)) {
      offenders.push(selector.replace(/\s+/g, ' ').slice(0, 80));
    }
  }

  assert.deepEqual(
    offenders,
    [],
    'a mask sits on a real element, which blinds the contrast audit'
  );
});

test('both wave directions are defined', () => {
  // Downward: anchored to the boundary line, tile flipped so its solid half
  // meets the block above and the wave dissolves away from it.
  assert.match(css, /\.wave-edge::after\s*\{[^}]*top:\s*100%/);
  assert.match(css, /\.wave-edge::after\s*\{[^}]*transform:\s*scaleY\(-1\)/);

  // Upward: anchored to the same line, tile unflipped, so the solid half is
  // the end that touches the block below.
  assert.match(css, /\.wave-edge-above::after\s*\{[^}]*bottom:\s*100%/);
  assert.match(css, /\.wave-edge-above::after\s*\{[^}]*transform:\s*none/);

  // They must share one paint rule, or the two directions can drift.
  assert.match(css, /\.wave-edge::after,\s*\n\s*\.wave-edge-above::after\s*\{/);
  assert.match(css, /\.wave-edge,\s*\n\s*\.wave-edge-above\s*\{/);
});

test('the wave host is an empty decorative sibling, never a container', () => {
  // The regression that matters. A fringe hung off a section (as a pseudo
  // element on it) puts an image node inside the subtree that axe audits, and
  // the `color-contrast` rule then drops that subtree to `incomplete`. Proven
  // by falsification: with the fringe on the footer, a 1.56:1 pair went
  // unflagged; with it removed, the same pair dropped a11y to 96.
  const carriers = sourceFiles(join(ROOT, 'src')).filter((file) =>
    /wave-edge/.test(readFileSync(file, 'utf8'))
  );

  assert.deepEqual(
    carriers.map((file) =>
      file.replace(ROOT, '').split(/[\\/]/).join('/')
    ),
    ['src/components/ui/WaveEdge.js'],
    'the motif must be applied through one shared component'
  );

  // The host carries no text, so nothing inside it can be hidden from the
  // audit. It is also zero-height (see globals.css), so the class is a
  // boundary marker and not something to put on a content block.
  assert.match(waveEdge, /<div\b[^>]*aria-hidden/);
  assert.match(waveEdge, /\/>/, 'the host must be self-closing');
  assert.doesNotMatch(waveEdge, /children/);

  // No page may put the class on a section, footer or main.
  for (const [name, source] of [
    ['home', home],
    ['layout', layout],
    ['footer', footer],
  ]) {
    assert.doesNotMatch(
      source,
      /<(section|footer|main|article|div)\b[^>]*wave-edge/,
      `${name} hangs the fringe off a content element`
    );
  }
});

test('every tone is a literal class string Tailwind can extract', () => {
  // Tailwind builds its utilities by scanning source text for candidates, so
  // a tone written as an interpolated `[--wave-color:...]` compiles to
  // nothing: no utility, no warning, and every strip silently falls back to
  // the default terra. The first version of this component did exactly that
  // and rendered three terra strips where ink and forest were asked for.
  const toneMap = waveEdge.match(/const tones = \{[\s\S]*?\};/)?.[0] ?? '';
  const tones = toneMap.match(/\[--wave-color:[^\]]*\]/g) ?? [];

  assert.deepEqual(
    tones.sort(),
    [
      '[--wave-color:var(--color-forest)]',
      '[--wave-color:var(--color-ink)]',
      '[--wave-color:var(--color-terra)]',
    ],
    'the tone classes must be complete literals, one per palette tone'
  );

  assert.doesNotMatch(
    waveEdge,
    /\[--wave-color:[^\]]*\$\{/,
    'an interpolated candidate compiles to nothing'
  );
});

test('the wave is applied at the section boundaries', () => {
  // hero -> category rail (ink rising), forest -> pack grid (forest dripping),
  // and content -> footer (ink rising, site-wide from the layout).
  const uses = (source) =>
    [...source.matchAll(/<WaveEdge\b[^>]*\/>/g)]
      .map((match) => match[0].replace(/\s+/g, ' '))
      .sort();

  assert.deepEqual(
    uses(home),
    ['<WaveEdge above tone="ink" />', '<WaveEdge tone="forest" />'].sort(),
    'the home page boundaries changed'
  );

  assert.deepEqual(
    uses(layout),
    ['<WaveEdge above tone="ink" />'],
    'the layout must carry the footer fringe'
  );

  // The footer's straight rule is what the wave replaced; leaving both
  // gives the boundary a hard line under a soft one.
  assert.doesNotMatch(footer, /border-t/);
});

test('the wave is hidden in print', () => {
  const print = css.slice(css.indexOf('@media print'));

  assert.match(
    print,
    /wave-edge::after,\s*\n?\s*\.wave-edge-above::after[^}]*display:\s*none/
  );
});

test('the wave never wraps a rounded pill or a form control', () => {
  // A `mask-image` cannot trace a `rounded-full` silhouette, and masking a
  // control would hide the border and the focus ring the control needs.
  const offenders = [];

  for (const file of [
    'src/components/site/CategoryPill.js',
    'src/components/ui/Field.js',
    'src/components/ui/Button.js',
    'src/components/ui/Card.js',
    'src/components/ui/Alert.js',
  ]) {
    const lines = read(file).split('\n');

    for (const [index, line] of lines.entries()) {
      if (!/wave-edge/.test(line)) {
        continue;
      }

      if (/rounded-full|rounded-lg|type="|Input|Select/.test(line)) {
        offenders.push(`${file}:${index + 1}`);
      }
    }
  }

  assert.deepEqual(offenders, [], 'the wave landed on a control or a pill');
});

test('controls still carry their own border', () => {
  // Carried over from the M7 removal suite: the wave frame used to be the
  // input's border, so a control must never depend on the motif for its edge.
  const field = read('src/components/ui/Field.js');
  const alert = read('src/components/ui/Alert.js');
  const card = read('src/components/ui/Card.js');

  assert.match(field, /border bg-surface/);
  assert.match(field, /border-ink\/20 focus:border-terra/);
  assert.match(field, /border-terra focus:border-terra/);
  assert.doesNotMatch(field, /wave-edge/, 'the frame wrapper has no purpose');

  assert.match(alert, /border-terra\/30/);
  assert.match(alert, /border-forest\/30/);
  assert.match(alert, /border-ink\/10/);
  assert.match(card, /border border-ink\/10 bg-surface/);
});