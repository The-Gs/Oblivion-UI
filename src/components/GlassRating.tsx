import { useState } from 'react';
import { cn } from '../lib/cn';
import { useControllableState } from '../lib/hooks';
import './GlassRating.css';

export interface GlassRatingProps {
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  /** Number of symbols. @default 5 */
  max?: number;
  /** Non-interactive display. @default false */
  readOnly?: boolean;
  disabled?: boolean;
  /** @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** Glyph to render. @default '★' */
  icon?: string;
  className?: string;
  'aria-label'?: string;
}

/** A star (or any glyph) rating. Controlled or uncontrolled; hover previews. */
export function GlassRating({
  value,
  defaultValue = 0,
  onChange,
  max = 5,
  readOnly = false,
  disabled = false,
  size = 'md',
  icon = '★',
  className,
  'aria-label': ariaLabel = 'Rating',
}: GlassRatingProps) {
  const [current, setCurrent] = useControllableState(value, defaultValue, onChange);
  const [hover, setHover] = useState(0);
  const active = hover || current;
  const locked = readOnly || disabled;

  return (
    <div
      role={locked ? 'img' : 'radiogroup'}
      aria-label={`${ariaLabel}: ${current} of ${max}`}
      className={cn('ob-rating', `ob-rating--${size}`, locked && 'ob-rating--locked', className)}
      onMouseLeave={() => setHover(0)}
    >
      {Array.from({ length: max }, (_, i) => {
        const n = i + 1;
        return (
          <button
            key={n}
            type="button"
            className="ob-rating__star"
            data-on={n <= active}
            disabled={locked}
            aria-label={`${n} ${n === 1 ? 'star' : 'stars'}`}
            aria-checked={!locked && n === current}
            role={locked ? undefined : 'radio'}
            onMouseEnter={() => !locked && setHover(n)}
            onClick={() => !locked && setCurrent(n === current ? 0 : n)}
          >
            {icon}
          </button>
        );
      })}
    </div>
  );
}
