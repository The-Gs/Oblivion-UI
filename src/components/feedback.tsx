import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';
import './feedback.css';

/* ══ Progress ═════════════════════════════════════════════════════════ */

export interface GlassProgressProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** 0–100. Omit for an indeterminate bar. */
  value?: number;
  label?: ReactNode;
  /** Readout on the right. Pass `null` to hide. Defaults to `{value}%`. */
  format?: ((value: number) => ReactNode) | null;
  'aria-label'?: string;
}

/**
 * A progress bar. Omitting `value` makes it indeterminate, which drops
 * `aria-valuenow` so assistive tech announces "busy" rather than a number.
 */
export function GlassProgress({
  value,
  label,
  format,
  className,
  'aria-label': ariaLabel,
  ...rest
}: GlassProgressProps) {
  const indeterminate = value === undefined;
  const pct = indeterminate ? 0 : Math.min(100, Math.max(0, value));
  const readout =
    indeterminate || format === null ? null : format ? format(pct) : `${Math.round(pct)}%`;

  return (
    <div className={cn('ob-progress', className)} {...rest}>
      {label || readout !== null ? (
        <div className="ob-progress__head">
          {label ? <span className="ob-progress__label">{label}</span> : <span />}
          {readout !== null ? <span className="ob-progress__value">{readout}</span> : null}
        </div>
      ) : null}

      <div
        className="ob-progress__track"
        role="progressbar"
        aria-label={ariaLabel}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={indeterminate ? undefined : Math.round(pct)}
      >
        <div
          className={cn(
            'ob-progress__fill',
            indeterminate && 'ob-progress__fill--indeterminate',
          )}
          style={indeterminate ? undefined : { width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

/* ══ Spinner ══════════════════════════════════════════════════════════ */

export interface GlassSpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  /** @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** Announced to screen readers. @default 'Loading' */
  'aria-label'?: string;
}

/** An indeterminate loading spinner. */
export function GlassSpinner({
  size = 'md',
  className,
  'aria-label': ariaLabel = 'Loading',
  ...rest
}: GlassSpinnerProps) {
  return (
    <span
      role="status"
      aria-label={ariaLabel}
      className={cn('ob-spinner', `ob-spinner--${size}`, className)}
      {...rest}
    />
  );
}

/* ══ Skeleton ═════════════════════════════════════════════════════════ */

export interface GlassSkeletonProps extends HTMLAttributes<HTMLDivElement> {
  width?: number | string;
  height?: number | string;
  /** Pill instead of a rounded rectangle — for avatars and chips. */
  circle?: boolean;
  /** Stagger, in ms, so a stack of these doesn't pulse in lockstep. */
  delay?: number;
}

/** A single shimmering placeholder block. */
export function GlassSkeleton({
  width = '100%',
  height = 12,
  circle = false,
  delay = 0,
  className,
  style,
  ...rest
}: GlassSkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn('ob-skeleton', className)}
      style={{
        width,
        height,
        borderRadius: circle ? '50%' : undefined,
        animationDelay: delay ? `${delay}ms` : undefined,
        ...style,
      }}
      {...rest}
    />
  );
}

export interface GlassSkeletonTextProps extends HTMLAttributes<HTMLDivElement> {
  /** @default 3 */
  lines?: number;
  /** Announced to screen readers while content loads. @default 'Loading' */
  'aria-label'?: string;
}

/**
 * A stack of skeleton lines with varied widths and staggered pulses — the
 * common "text is loading" case.
 */
export function GlassSkeletonText({
  lines = 3,
  className,
  'aria-label': ariaLabel = 'Loading',
  ...rest
}: GlassSkeletonTextProps) {
  return (
    <div
      role="status"
      aria-label={ariaLabel}
      aria-busy="true"
      className={cn('ob-skeleton-stack', className)}
      {...rest}
    >
      {Array.from({ length: lines }, (_, i) => (
        <GlassSkeleton key={i} width={`${80 - ((i * 10) % 30)}%`} delay={i * 200} />
      ))}
    </div>
  );
}
