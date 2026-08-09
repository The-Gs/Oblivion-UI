import { useCallback, useLayoutEffect, useRef, useState, type Key, type ReactNode } from 'react';
import { cn } from '../lib/cn';
import { GlassSurface } from './GlassSurface';
import './GlassTabs.css';

export interface GlassTabsProps<T> {
  items: readonly T[];
  /** Identity for each tab. This is what `value` is compared against. */
  getKey: (item: T, index: number) => Key;
  /** Tab label. Defaults to `String(item)`. */
  label?: (item: T, index: number) => ReactNode;
  /** Optional icon before the label. */
  icon?: (item: T, index: number) => ReactNode;
  /** Per-tab disable predicate. */
  isDisabled?: (item: T, index: number) => boolean;
  /** Key of the selected tab (controlled). */
  value: Key;
  onChange: (item: T, index: number) => void;
  /** Fill the container and split evenly. @default false */
  block?: boolean;
  className?: string;
  'aria-label'?: string;
}

/**
 * A segmented control with a highlight that slides between tabs.
 *
 * Controlled: hold the active key yourself and update it in `onChange`.
 * Arrow keys move between tabs, per the WAI-ARIA tabs pattern.
 */
export function GlassTabs<T>({
  items,
  getKey,
  label,
  icon,
  isDisabled,
  value,
  onChange,
  block = false,
  className,
  'aria-label': ariaLabel,
}: GlassTabsProps<T>) {
  const listRef = useRef<HTMLDivElement>(null);
  const [thumb, setThumb] = useState<{ x: number; w: number } | null>(null);

  const activeIndex = items.findIndex((item, i) => getKey(item, i) === value);

  // Measure the active tab and park the highlight on it. Layout effect so the
  // thumb never paints at a stale position.
  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list || activeIndex < 0) {
      setThumb(null);
      return;
    }

    const measure = () => {
      const tab = list.querySelectorAll<HTMLElement>('[role="tab"]')[activeIndex];
      if (!tab) return;
      setThumb({ x: tab.offsetLeft, w: tab.offsetWidth });
    };

    measure();

    // Labels reflow on container resize and on late-loading fonts.
    const ro = new ResizeObserver(measure);
    ro.observe(list);
    return () => ro.disconnect();
  }, [activeIndex, items]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const delta = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (delta === 0) return;
      e.preventDefault();

      // Walk past disabled tabs, wrapping at both ends.
      for (let step = 1; step <= items.length; step++) {
        const next = (activeIndex + delta * step + items.length * step) % items.length;
        const item = items[next];
        if (item !== undefined && !isDisabled?.(item, next)) {
          onChange(item, next);
          const tabs = listRef.current?.querySelectorAll<HTMLElement>('[role="tab"]');
          tabs?.[next]?.focus();
          return;
        }
      }
    },
    [activeIndex, items, isDisabled, onChange],
  );

  return (
    <GlassSurface
      radius="md"
      grain={false}
      className={cn('ob-tabs', block && 'ob-tabs--block', className)}
    >
      <span
        className={cn('ob-tabs__thumb', thumb && 'ob-tabs__thumb--ready')}
        style={thumb ? { transform: `translateX(${thumb.x}px)`, width: thumb.w } : undefined}
        aria-hidden="true"
      />
      <div
        ref={listRef}
        role="tablist"
        aria-label={ariaLabel}
        onKeyDown={onKeyDown}
        className="ob-tabs__list"
      >
        {items.map((item, i) => {
          const selected = i === activeIndex;
          const disabled = isDisabled?.(item, i) ?? false;

          return (
            <button
              key={getKey(item, i)}
              type="button"
              role="tab"
              aria-selected={selected}
              // Roving tabindex: only the active tab is a tab stop.
              tabIndex={selected ? 0 : -1}
              disabled={disabled}
              className="ob-tabs__tab ob-reset-button ob-focusable"
              onClick={() => onChange(item, i)}
            >
              {icon ? <span aria-hidden="true">{icon(item, i)}</span> : null}
              {label ? label(item, i) : String(item)}
            </button>
          );
        })}
      </div>
    </GlassSurface>
  );
}
