import type { ReactNode } from 'react';
import { cn } from '../lib/cn';
import './GlassMeter.css';

export type MeterTone = 'accent' | 'success' | 'warning' | 'danger';

export interface GlassMeterProps {
  value: number;
  /** @default 100 */
  max?: number;
  /** Fill colour. Ignored if `thresholds` matches. @default 'accent' */
  tone?: MeterTone;
  /**
   * Auto-tone by fraction filled, e.g. `{ 0.9: 'danger', 0.7: 'warning' }`.
   * The highest crossed threshold wins.
   */
  thresholds?: Partial<Record<number, MeterTone>>;
  label?: ReactNode;
  /** Show the numeric value / percentage on the right of the label row. */
  showValue?: boolean;
  /** @default 'md' */
  size?: 'sm' | 'md';
  className?: string;
  'aria-label'?: string;
}

/** A labelled progress meter with semantic tones and optional thresholds. */
export function GlassMeter({
  value,
  max = 100,
  tone = 'accent',
  thresholds,
  label,
  showValue = false,
  size = 'md',
  className,
  'aria-label': ariaLabel,
}: GlassMeterProps) {
  const frac = Math.min(1, Math.max(0, max === 0 ? 0 : value / max));
  let resolved = tone;
  if (thresholds) {
    const hit = Object.keys(thresholds)
      .map(Number)
      .filter((t) => frac >= t)
      .sort((a, b) => b - a)[0];
    if (hit != null) resolved = thresholds[hit]!;
  }

  return (
    <div className={cn('ob-meter', `ob-meter--${size}`, className)}>
      {label || showValue ? (
        <div className="ob-meter__row">
          {label ? <span className="ob-meter__label">{label}</span> : <span />}
          {showValue ? <span className="ob-meter__value">{Math.round(frac * 100)}%</span> : null}
        </div>
      ) : null}
      <div
        className="ob-meter__track"
        role="meter"
        aria-label={ariaLabel ?? (typeof label === 'string' ? label : undefined)}
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <div className="ob-meter__fill" data-tone={resolved} style={{ width: `${frac * 100}%` }} />
      </div>
    </div>
  );
}
