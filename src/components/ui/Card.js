import { WaveEdge } from '@/components/ui/WaveEdge.js';

const CARD =
  'border border-ink/10 bg-surface rounded-[28px] shadow-[0_20px_60px_rgba(23,19,15,0.06)]';

/*
 * A waved card hands its straight border to the wave, so it is the same card
 * with that one utility taken off. Derived from CARD rather than restated,
 * because the two drifting apart is what put a border back under a wave once —
 * and the wave is meant to *be* the border, not to sit on top of one.
 */
const BORDERLESS = CARD.replace('border border-ink/10 ', '');

export function Card({
  as: Tag = 'div',
  className = '',
  /*
   * `false`  no fringe — the ticket, the notification list, the pack grid.
   * `true`   the band along the bottom edge, which the form cards wear.
   * `frame`  all four bands, the reference stylesheet's whole `.border-img`
   *          box, for the experience card.
   *
   * The bands are siblings of the card and not children, because an image node
   * inside a card drops that card's text from the contrast audit — see the
   * header of WaveEdge.js and PROJECT_MAP.md §3.3.
   */
  wave = false,
  children,
  ...rest
}) {
  if (!wave) {
    return (
      <Tag
        className={`${CARD} ${className}`}
        {...rest}
      >
        {children}
      </Tag>
    );
  }

  const frame = wave === 'frame';

  return (
    <div className={frame ? 'card-wave card-wave-frame' : 'card-wave'}>
      <Tag
        className={`${BORDERLESS} flex-1 ${className}`}
        {...rest}
      >
        {children}
      </Tag>

      {frame ? (
        <>
          <div className="card-wave-top" aria-hidden>
            <WaveEdge tone="forest" />
          </div>

          <div className="card-wave-left" aria-hidden>
            <WaveEdge side="left" tone="forest" />
          </div>

          <div className="card-wave-right" aria-hidden>
            <WaveEdge side="right" tone="forest" />
          </div>
        </>
      ) : null}

      {/* The bottom band is every waved card's, whichever way it is framed,
          and it is the one the form cards shipped with — so the same pinned
          host serves both and there is only ever one way to draw it. */}
      <div className="card-wave-bottom" aria-hidden>
        <WaveEdge above tone={frame ? 'forest' : 'ink'} />
      </div>
    </div>
  );
}
