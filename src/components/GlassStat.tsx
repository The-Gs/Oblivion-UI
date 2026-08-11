import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';
import { GlassSurface } from './GlassSurface';
import './GlassStat.css';

export type StatTrend = 'up' | 'down' | 'flat';

export interface GlassStatProps extends HTMLAttributes<HTMLDivElement> {
  label: ReactNode;
  value: ReactNode;
  /** A change indicator, e.g. "+12.4%". Coloured by `trend`. */
  delta?: ReactNode;
  /** @default 'flat' */
  trend?: StatTrend;
  /** Optional leading glyph/badge. */
  icon?: ReactNode;
  /** Small print under the value. */
  footnote?: ReactNode;
}

const ARROW: Record<StatTrend, string> = { up: '↑', down: '↓', flat: '→' };

/** A metric tile: label, big value, and an optional trend-coloured delta. */
export function GlassStat({
  label,
  value,
  delta,
  trend = 'flat',
  icon,
  footnote,
  className,
  ...rest
}: GlassStatProps) {
  return (
    <GlassSurface className={cn('ob-stat', className)} radius="lg" {...rest}>
      <div className="ob-stat__top">
        <span className="ob-stat__label">{label}</span>
        {icon ? <span className="ob-stat__icon">{icon}</span> : null}
      </div>
      <div className="ob-stat__value">{value}</div>
      <div className="ob-stat__foot">
        {delta != null ? (
          <span className={cn('ob-stat__delta', `ob-stat__delta--${trend}`)}>
            <span aria-hidden="true">{ARROW[trend]}</span>
            {delta}
          </span>
        ) : null}
        {footnote ? <span className="ob-stat__note">{footnote}</span> : null}
      </div>
    </GlassSurface>
  );
}
