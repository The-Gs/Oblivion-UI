import type { ReactNode } from 'react';
import { cn } from '../lib/cn';
import './GlassCallout.css';

export type CalloutTone = 'info' | 'accent' | 'success' | 'warning' | 'danger';

export interface GlassCalloutProps {
  children?: ReactNode;
  /** @default 'info' */
  tone?: CalloutTone;
  title?: ReactNode;
  /** Leading glyph. */
  icon?: ReactNode;
  className?: string;
}

/** A lightweight inline note with a coloured left rail — lighter than an alert. */
export function GlassCallout({ children, tone = 'info', title, icon, className }: GlassCalloutProps) {
  return (
    <div className={cn('ob-callout', `ob-callout--${tone}`, className)} role="note">
      {icon ? (
        <span className="ob-callout__icon" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <div className="ob-callout__content">
        {title ? <div className="ob-callout__title">{title}</div> : null}
        {children ? <div className="ob-callout__body">{children}</div> : null}
      </div>
    </div>
  );
}
