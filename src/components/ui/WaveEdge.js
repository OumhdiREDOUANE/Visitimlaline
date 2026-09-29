/*
 * The wavy section divider, rebuilt from the wiggle drawing the owner
 * supplied: a strip of the section's own colour whose free edge is the wave.
 * It replaces the straight `border-t` that used to close the footer.
 *
 * The class goes on an empty element placed *between* two sections, not on
 * either of them. That placement is the whole reason this is a component:
 * axe-core's `color-contrast` rule drops any subtree holding an image node to
 * `incomplete` — unmeasured, not passing — so a fringe hung off a section, the
 * first attempt, as a pseudo-element of the footer, made that section's text
 * unauditable. A mask is only one of the three doors in; a plain painted
 * pseudo element and a tiled `background-image` do it too, so the rule is about
 * where the fringe sits, not about `mask-image`. A falsification test pinned
 * it down: a 1.56:1 pair in the footer went unflagged at accessibility 100
 * with the fringe attached, and dropped the same page to 96 without it.
 * Nothing about the wave is decorative enough to be worth losing the audit
 * over. PROJECT_MAP.md §3.3 has the four-way table.
 *
 * `height: 0` comes from the stylesheet, so the strip takes no space and the
 * boundary does not shift.
 *
 * `side` is the same motif standing on end, for the bands that run down the
 * edges of a card. It is a sibling host like the other two and is painted by a
 * pseudo element for the same reason: an image node inside a card drops that
 * card's text to `incomplete`. What it does *not* do is declare how long it is
 * — a side band's length is the card's height, and no percentage names an
 * ancestor's height — so it fills the slot it is handed, and the quarter turn
 * that would have needed that length lives in the tile instead.
 */

/*
 * Each tone must be a complete, literal class string. Tailwind extracts its
 * candidates by scanning source text, so building this custom property inside
 * a template literal yields no utility at all — silently, with no error, and
 * every strip falls back to the default terra. tests/wave.test.js guards
 * this, because nothing else would.
 */
const tones = {
  terra: '[--wave-color:var(--color-terra)]',
  ink: '[--wave-color:var(--color-ink)]',
  forest: '[--wave-color:var(--color-forest)]',
};

export function WaveEdge({
  above = false,
  side = '',
  tone = 'terra',
}) {
  const color = tones[tone] ?? tones.terra;

  if (side) {
    return (
      <div
        aria-hidden
        className={`wave-edge-side wave-edge-side-${side} ${color}`}
      />
    );
  }

  return (
    <div
      aria-hidden
      className={`${above ? 'wave-edge-above' : 'wave-edge'} ${color}`}
    />
  );
}