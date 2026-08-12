import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';
import './GlassTag.css';

export type TagTone = 'accent' | 'neutral' | 'success' | 'warning' | 'danger';

export interface GlassTagProps extends HTMLAttributes<HTMLSpanElement> {
  children?: ReactNode;
  /** @default 'neutral' */
  tone?: TagTone;
  /** @default 'md' */
  size?: 'sm' | 'md';
  /** Leading glyph. */
  icon?: ReactNode;
  /** Show a close × and call this when it's pressed. */
  onClose?: () => void;
}

/** A compact, optionally removable tag — like a badge you can dismiss. */
export function GlassTag({ children, tone = 'neutral', size = 'md', icon, onClose, className, ...rest }: GlassTagProps) {
  return (
    <span className={cn('ob-tag', `ob-tag--${tone}`, size === 'sm' && 'ob-tag--sm', className)} {...rest}>
      {icon ? <span className="ob-tag__icon">{icon}</span> : null}
      <span className="ob-tag__label">{children}</span>
      {onClose ? (
        <button
          type="button"
          className="ob-tag__close"
          aria-label="Remove"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        >
          ✕
        </button>
      ) : null}
    </span>
  );
}
