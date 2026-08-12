import type { ReactNode } from 'react';
import { cn } from '../lib/cn';
import { useControllableState } from '../lib/hooks';
import './GlassSegmented.css';

export interface ToggleItem {
  value: string;
  label: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
}

export interface GlassToggleGroupProps {
  items: ToggleItem[];
  /** Selected values (multi-select). */
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
  /** @default 'md' */
  size?: 'sm' | 'md';
  fluid?: boolean;
  className?: string;
  itemClassName?: string;
  'aria-label'?: string;
}

/**
 * A multi-select sibling of {@link GlassSegmented} — toggle any number of the
 * connected pills on. Shares the segmented styling.
 */
export function GlassToggleGroup({
  items,
  value,
  defaultValue,
  onChange,
  size = 'md',
  fluid = false,
  className,
  itemClassName,
  'aria-label': ariaLabel,
}: GlassToggleGroupProps) {
  const [selected, setSelected] = useControllableState(value, defaultValue ?? [], onChange);

  const toggle = (v: string) =>
    setSelected(selected.includes(v) ? selected.filter((x) => x !== v) : [...selected, v]);

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={cn('ob-seg', size === 'sm' && 'ob-seg--sm', fluid && 'ob-seg--fluid', className)}
    >
      {items.map((item) => {
        const on = selected.includes(item.value);
        return (
          <button
            key={item.value}
            type="button"
            className={cn('ob-seg__item', itemClassName)}
            data-active={on}
            disabled={item.disabled}
            aria-pressed={on}
            onClick={() => toggle(item.value)}
          >
            {item.icon ? <span className="ob-seg__icon">{item.icon}</span> : null}
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
