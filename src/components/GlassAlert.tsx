import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';
import { GlassSurface } from './GlassSurface';
import './GlassAlert.css';

export type AlertTone = 'info' | 'accent' | 'success' | 'warning' | 'danger';

export interface GlassAlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** @default 'info' */
  tone?: AlertTone;
  title?: ReactNode;
  children?: ReactNode;
  /** Leading glyph — an icon or emoji. */
  icon?: ReactNode;
  /** Fires a dismiss button when provided. */
  onClose?: () => void;
}

const DEFAULT_ICON: Record<AlertTone, string> = {
  info: 'ⓘ',
  accent: '◆',
  success: '✓',
  warning: '⚠',
  danger: '✕',
};

/**
 * A banner for contextual messages, on a glass surface with a flat accent bar
 * down the leading edge. Five tones map onto the theme's semantic colours.
 */
export function GlassAlert({
  tone = 'info',
  title,
  children,
  icon,
  onClose,
  className,
  ...rest
}: GlassAlertProps) {
  return (
    <GlassSurface
      role="alert"

      className={cn('ob-alert', `ob-alert--${tone}`, className)}
      {...rest}
    >
      <span className="ob-alert__icon" aria-hidden="true">
        {icon ?? DEFAULT_ICON[tone]}
      </span>
      <div className="ob-alert__body">
        {title ? <div className="ob-alert__title">{title}</div> : null}
        {children ? <div className="ob-alert__text">{children}</div> : null}
      </div>
      {onClose ? (
        <button
          type="button"
          className="ob-alert__close ob-reset-button ob-focusable"
          aria-label="Dismiss"
          onClick={onClose}
        >
          ✕
        </button>
      ) : null}
    </GlassSurface>
  );
}
