import type { ReactNode } from 'react';
import { cn } from '../lib/cn';
import { useControllableState } from '../lib/hooks';
import './GlassSegmented.css';

export interface SegmentedItem {
  value: string;
  label: ReactNode;
  /** Optional leading glyph. */
  icon?: ReactNode;
  disabled?: boolean;
}

export interface GlassSegmentedProps {
  items: SegmentedItem[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** @default 'md' */
  size?: 'sm' | 'md';
  /** Stretch segments to fill the container. @default false */
  fluid?: boolean;
  className?: string;
  'aria-label'?: string;
}

/**
 * A segmented toggle — one choice from a small set, laid out as connected
 * pills. Controlled or uncontrolled via `value` / `defaultValue`.
 */
export function GlassSegmented({
  items,
  value,
  defaultValue,
  onChange,
  size = 'md',
  fluid = false,
  className,
  'aria-label': ariaLabel,
}: GlassSegmentedProps) {
  const [current, setCurrent] = useControllableState(value, defaultValue ?? items[0]?.value ?? '', onChange);

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={cn('ob-seg', size === 'sm' && 'ob-seg--sm', fluid && 'ob-seg--fluid', className)}
    >
      {items.map((item) => (
        <button
          key={item.value}
          type="button"
          className="ob-seg__item"
          data-active={item.value === current}
          disabled={item.disabled}
          aria-pressed={item.value === current}
          onClick={() => setCurrent(item.value)}
        >
          {item.icon ? <span className="ob-seg__icon">{item.icon}</span> : null}
          {item.label}
        </button>
      ))}
    </div>
  );
}
