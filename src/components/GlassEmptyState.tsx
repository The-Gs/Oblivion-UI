import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';
import './GlassEmptyState.css';

export interface GlassEmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** A glyph or illustration above the title. */
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  /** Action row — usually a button or two. */
  action?: ReactNode;
  /** @default 'md' */
  size?: 'sm' | 'md' | 'lg';
}

/** A centred placeholder for empty lists, zero-results, and first-run states. */
export function GlassEmptyState({
  icon,
  title,
  description,
  action,
  size = 'md',
  className,
  ...rest
}: GlassEmptyStateProps) {
  return (
    <div className={cn('ob-empty', `ob-empty--${size}`, className)} {...rest}>
      {icon ? (
        <div className="ob-empty__icon" aria-hidden="true">
          {icon}
        </div>
      ) : null}
      <div className="ob-empty__title">{title}</div>
      {description ? <p className="ob-empty__desc">{description}</p> : null}
      {action ? <div className="ob-empty__action">{action}</div> : null}
    </div>
  );
}
