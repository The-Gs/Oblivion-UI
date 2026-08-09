import type { HTMLAttributes } from 'react';
import { cn } from '../lib/cn';
import './Orbs.css';

export type OrbPalette = 'midnight' | 'oxblood' | 'charcoal';

export interface OrbsProps extends HTMLAttributes<HTMLDivElement> {
  /** @default 'midnight' */
  palette?: OrbPalette;
  /** `fixed` pins to the viewport; `absolute` fills the nearest positioned
   *  ancestor. @default 'fixed' */
  position?: 'fixed' | 'absolute';
  /** Ambient drift. Also disabled by `prefers-reduced-motion`. @default true */
  motion?: boolean;
}

const PALETTES: Record<OrbPalette, [string, string, string]> = {
  midnight: ['#3a0d14', '#1c1c22', '#4a1019'],
  oxblood: ['#5c0f1b', '#2a0509', '#7a1220'],
  charcoal: ['#232028', '#16141a', '#3a0d14'],
};

/**
 * Ambient backdrop for glass surfaces.
 *
 * Glass needs something behind it worth blurring — on flat colour the panes
 * read as grey boxes. Render one of these at the root of your app, behind
 * your content.
 */
export function Orbs({
  palette = 'midnight',
  position = 'fixed',
  motion = true,
  className,
  ...rest
}: OrbsProps) {
  const [a, b, c] = PALETTES[palette] ?? PALETTES.midnight;

  return (
    <div
      aria-hidden="true"
      className={cn(
        'ob-orbs',
        position === 'absolute' && 'ob-orbs--absolute',
        !motion && 'ob-orbs--still',
        className,
      )}
      {...rest}
    >
      <div className="ob-orbs__orb ob-orbs__orb--a" style={{ background: a }} />
      <div className="ob-orbs__orb ob-orbs__orb--b" style={{ background: b }} />
      <div className="ob-orbs__orb ob-orbs__orb--c" style={{ background: c }} />
    </div>
  );
}
