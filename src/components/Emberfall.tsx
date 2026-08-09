import { useMemo, type CSSProperties, type HTMLAttributes } from 'react';
import { cn } from '../lib/cn';
import './Emberfall.css';

export interface EmberfallProps extends HTMLAttributes<HTMLDivElement> {
  /** `fixed` pins it to the viewport; `absolute` fills the nearest
   *  positioned ancestor. @default 'fixed' */
  position?: 'fixed' | 'absolute';
  /** Cinders drifting up at once. @default 30 */
  count?: number;
  /** Concentric halo rings. @default true */
  halo?: boolean;
  /** Hairline lattice. Also what makes the glass above it legible. @default true */
  lattice?: boolean;
  /** Hot rule along the bottom edge. @default true */
  seam?: boolean;
}

/**
 * Deterministic pseudo-random in [0, 1).
 *
 * `Math.random()` would give the server and the client different layouts and
 * blow up hydration, so cinder placement is derived from its index instead.
 */
function noise(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

const TONES = ['var(--ob-ember)', 'var(--ob-cinder)', 'var(--ob-halo)'];

const LATTICE_V = 9;
const LATTICE_H = 6;

/**
 * The backdrop: a halo turning overhead, cinders rising off a hot seam, and
 * a hairline lattice between them.
 *
 * This is load-bearing, not decoration. `backdrop-filter` can only be seen
 * where it has something sharp to soften — on a flat background the panes
 * read as grey boxes. Render one at the root of your app.
 */
export function Emberfall({
  position = 'fixed',
  count = 30,
  halo = true,
  lattice = true,
  seam = true,
  className,
  ...rest
}: EmberfallProps) {
  const motes = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const a = noise(i + 1);
        const b = noise(i + 97);
        const c = noise(i + 313);

        return {
          key: i,
          style: {
            '--m-x': `${a * 100}%`,
            '--m-size': `${1 + Math.floor(c * 3)}px`,
            '--m-drift': `${(b - 0.5) * 160}px`,
            '--m-dur': `${13 + b * 18}s`,
            '--m-delay': `${-a * 28}s`,
            '--m-opacity': `${0.3 + c * 0.55}`,
            '--m-tone': TONES[i % TONES.length],
          } as CSSProperties,
        };
      }),
    [count],
  );

  return (
    <div
      aria-hidden="true"
      className={cn('ob-emberfall', position === 'fixed' && 'ob-emberfall--fixed', className)}
      {...rest}
    >
      {lattice ? (
        <>
          {Array.from({ length: LATTICE_V }, (_, i) => (
            <span
              key={`v${i}`}
              className="ob-emberfall__rule ob-emberfall__rule--v"
              style={{ left: `${((i + 1) / (LATTICE_V + 1)) * 100}%` }}
            />
          ))}
          {Array.from({ length: LATTICE_H }, (_, i) => (
            <span
              key={`h${i}`}
              className="ob-emberfall__rule ob-emberfall__rule--h"
              style={{ top: `${((i + 1) / (LATTICE_H + 1)) * 100}%` }}
            />
          ))}
        </>
      ) : null}

      {halo ? (
        <>
          <div className="ob-emberfall__ring ob-emberfall__ring--outer" />
          <div className="ob-emberfall__ring ob-emberfall__ring--mid" />
          <div className="ob-emberfall__ring ob-emberfall__ring--spin" />
        </>
      ) : null}

      {motes.map((m) => (
        <span key={m.key} className="ob-emberfall__mote" style={m.style} />
      ))}

      {seam ? <div className="ob-emberfall__seam" /> : null}
      <div className="ob-emberfall__grain" />
    </div>
  );
}
