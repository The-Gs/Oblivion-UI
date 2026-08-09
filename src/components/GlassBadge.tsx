import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';
import './GlassBadge.css';

export type BadgeTone =
  | 'neutral'
  | 'ember'
  | 'cinder'
  | 'blood'
  | 'halo'
  | 'success'
  | 'danger';

export interface GlassBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children?: ReactNode;
  /** @default 'neutral' */
  tone?: BadgeTone;
  /** Filled instead of tinted. @default false */
  solid?: boolean;
  /** Leading status dot. @default false */
  dot?: boolean;
  /** Animates the dot. Implies `dot`. @default false */
  pulse?: boolean;
}

/** A compact status pill. Tones map onto the theme's chroma tokens. */
export function GlassBadge({
  children,
  tone = 'neutral',
  solid = false,
  dot = false,
  pulse = false,
  className,
  ...rest
}: GlassBadgeProps) {
  return (
    <span
      className={cn(
        'ob-badge',
        `ob-badge--tone-${tone}`,
        solid && 'ob-badge--solid',
        pulse && 'ob-badge--pulse',
        className,
      )}
      {...rest}
    >
      {dot || pulse ? <span className="ob-badge__dot" aria-hidden="true" /> : null}
      {children}
    </span>
  );
}
