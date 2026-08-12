import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';
import './GlassBadge.css';

export type BadgeVariant = 'accent' | 'neutral' | 'outline' | 'status' | 'solid';
export type BadgeTone = 'accent' | 'success' | 'warning' | 'danger';

export interface GlassBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children?: ReactNode;
  /** @default 'accent' */
  variant?: BadgeVariant;
  /** Recolours the badge by remapping its accent to a semantic token. @default 'accent' */
  tone?: BadgeTone;
  /** Monospace, for versions, tags and code-adjacent labels. @default false */
  mono?: boolean;
  /** @default 'md' */
  size?: 'sm' | 'md';
  /** Leading status dot. @default false */
  dot?: boolean;
  /** Fades the dot in and out. Implies `dot`. @default false */
  pulse?: boolean;
}

/** A compact status pill. */
export function GlassBadge({
  children,
  variant = 'accent',
  tone = 'accent',
  mono = false,
  size = 'md',
  dot = false,
  pulse = false,
  className,
  ...rest
}: GlassBadgeProps) {
  return (
    <span
      className={cn(
        'ob-badge',
        `ob-badge--${variant}`,
        tone !== 'accent' && `ob-badge--tone-${tone}`,
        mono && 'ob-badge--mono',
        size === 'sm' && 'ob-badge--sm',
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
