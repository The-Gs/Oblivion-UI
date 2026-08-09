import { useCallback, useRef, type Key, type ReactNode } from 'react';
import { cn } from '../lib/cn';
import './controls.css';

export interface GlassRadioGroupProps<T> {
  items: readonly T[];
  /** Identity for each option. This is what `value` is compared against. */
  getKey: (item: T, index: number) => Key;
  /** Option label. Defaults to `String(item)`. */
  label?: (item: T, index: number) => ReactNode;
  isDisabled?: (item: T, index: number) => boolean;
  value: Key;
  onChange: (item: T, index: number) => void;
  /** Stack vertically instead of inline. @default false */
  column?: boolean;
  className?: string;
  'aria-label'?: string;
}

/**
 * A radio group over any array. Controlled.
 *
 * Follows the WAI-ARIA radiogroup pattern: the group is one tab stop, and
 * arrow keys move the selection between options.
 */
export function GlassRadioGroup<T>({
  items,
  getKey,
  label,
  isDisabled,
  value,
  onChange,
  column = false,
  className,
  'aria-label': ariaLabel,
}: GlassRadioGroupProps<T>) {
  const ref = useRef<HTMLDivElement>(null);
  const activeIndex = items.findIndex((item, i) => getKey(item, i) === value);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const delta =
        e.key === 'ArrowRight' || e.key === 'ArrowDown'
          ? 1
          : e.key === 'ArrowLeft' || e.key === 'ArrowUp'
            ? -1
            : 0;
      if (delta === 0 || items.length === 0) return;
      e.preventDefault();

      // Walk past disabled options, wrapping at both ends.
      for (let step = 1; step <= items.length; step++) {
        const next = (activeIndex + delta * step + items.length * step) % items.length;
        const item = items[next];
        if (item !== undefined && !isDisabled?.(item, next)) {
          onChange(item, next);
          ref.current?.querySelectorAll<HTMLElement>('[role="radio"]')[next]?.focus();
          return;
        }
      }
    },
    [activeIndex, items, isDisabled, onChange],
  );

  return (
    <div
      ref={ref}
      role="radiogroup"
      aria-label={ariaLabel}
      onKeyDown={onKeyDown}
      className={cn('ob-radios', column && 'ob-radios--column', className)}
    >
      {items.map((item, i) => {
        const checked = i === activeIndex;
        return (
          <button
            key={getKey(item, i)}
            type="button"
            role="radio"
            aria-checked={checked}
            // Roving tabindex: only the selected option is a tab stop.
            tabIndex={checked ? 0 : -1}
            disabled={isDisabled?.(item, i) ?? false}
            className="ob-radio ob-reset-button"
            onClick={() => onChange(item, i)}
          >
            <span className="ob-radio__dot" aria-hidden="true" />
            {label ? label(item, i) : String(item)}
          </button>
        );
      })}
    </div>
  );
}
