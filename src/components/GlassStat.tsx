import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';
import { GlassSurface } from './GlassSurface';
import './GlassStat.css';

export type StatTrend = 'up' | 'down' | 'flat';

/** Class names for each part of the stat tile. */
export interface StatSlots {
  label?: string;
  icon?: string;
  value?: string;
  delta?: string;
  note?: string;
}

export interface GlassStatProps extends HTMLAttributes<HTMLDivElement> {
  label: ReactNode;
  value: ReactNode;
  /** Reach any part without a wrapper selector. Size the value with `--ob-stat-value-size`. */
  classNames?: StatSlots;
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
  classNames: slots,
  className,
  ...rest
}: GlassStatProps) {
  return (
    <GlassSurface className={cn('ob-stat', className)} radius="lg" {...rest}>
      <div className="ob-stat__top">
        <span className={cn('ob-stat__label', slots?.label)}>{label}</span>
        {icon ? <span className={cn('ob-stat__icon', slots?.icon)}>{icon}</span> : null}
      </div>
      <div className={cn('ob-stat__value', slots?.value)}>{value}</div>
      <div className="ob-stat__foot">
        {delta != null ? (
          <span className={cn('ob-stat__delta', `ob-stat__delta--${trend}`, slots?.delta)}>
            <span aria-hidden="true">{ARROW[trend]}</span>
            {delta}
          </span>
        ) : null}
        {footnote ? <span className={cn('ob-stat__note', slots?.note)}>{footnote}</span> : null}
      </div>
    </GlassSurface>
  );
}
