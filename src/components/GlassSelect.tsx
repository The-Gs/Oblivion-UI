import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type Key,
  type ReactNode,
} from 'react';
import { cn } from '../lib/cn';
import { GlassSurface } from './GlassSurface';
import './GlassInput.css';
import './GlassSelect.css';

export interface GlassSelectProps<T> {
  items: readonly T[];
  getKey: (item: T, index: number) => Key;
  /** Option label. Defaults to `String(item)`. */
  label?: (item: T, index: number) => ReactNode;
  isDisabled?: (item: T, index: number) => boolean;
  /** Key of the selected item, or `null` for none. */
  value: Key | null;
  onChange: (item: T, index: number) => void;
  /** Field label above the trigger. */
  fieldLabel?: ReactNode;
  placeholder?: string;
  hint?: ReactNode;
  error?: ReactNode;
  disabled?: boolean;
  className?: string;
  'aria-label'?: string;
}

/**
 * A listbox-backed select. Controlled.
 *
 * Opens on click or ArrowDown, closes on Escape, outside click, or blur out
 * of the control. Arrow keys move a highlight, Enter commits it. Follows the
 * ARIA listbox pattern with `aria-activedescendant` rather than moving focus
 * into the options, so the trigger keeps focus the whole time.
 */
export function GlassSelect<T>({
  items,
  getKey,
  label,
  isDisabled,
  value,
  onChange,
  fieldLabel,
  placeholder = 'Select…',
  hint,
  error,
  disabled = false,
  className,
  'aria-label': ariaLabel,
}: GlassSelectProps<T>) {
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const baseId = useId();
  const [open, setOpen] = useState(false);

  const selectedIndex = items.findIndex((item, i) => getKey(item, i) === value);
  const [cursor, setCursor] = useState(() => Math.max(0, selectedIndex));

  const selected = selectedIndex >= 0 ? items[selectedIndex] : undefined;
  const selectedLabel =
    selected === undefined
      ? null
      : label
        ? label(selected, selectedIndex)
        : String(selected);

  // Close when focus or a click lands outside the whole control.
  useEffect(() => {
    if (!open) return;
    const onDocPointerDown = (e: MouseEvent | TouchEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDocPointerDown);
    document.addEventListener('touchstart', onDocPointerDown);
    return () => {
      document.removeEventListener('mousedown', onDocPointerDown);
      document.removeEventListener('touchstart', onDocPointerDown);
    };
  }, [open]);

  // Keep the highlighted option in view as the cursor moves.
  useLayoutEffect(() => {
    if (!open) return;
    listRef.current
      ?.querySelectorAll<HTMLElement>('[role="option"]')
      [cursor]?.scrollIntoView({ block: 'nearest' });
  }, [open, cursor]);

  const openMenu = useCallback(() => {
    if (disabled) return;
    setCursor(Math.max(0, selectedIndex));
    setOpen(true);
  }, [disabled, selectedIndex]);

  const pick = useCallback(
    (index: number) => {
      const item = items[index];
      if (item === undefined || isDisabled?.(item, index)) return;
      onChange(item, index);
      setOpen(false);
    },
    [items, isDisabled, onChange],
  );

  const step = useCallback(
    (delta: number) => {
      if (items.length === 0) return;
      setCursor((prev) => {
        for (let n = 1; n <= items.length; n++) {
          const next = (prev + delta * n + items.length * n) % items.length;
          const item = items[next];
          if (item !== undefined && !isDisabled?.(item, next)) return next;
        }
        return prev;
      });
    },
    [items, isDisabled],
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openMenu();
      }
      return;
    }

    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        setOpen(false);
        break;
      case 'ArrowDown':
        e.preventDefault();
        step(1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        step(-1);
        break;
      case 'Home':
        e.preventDefault();
        setCursor(0);
        break;
      case 'End':
        e.preventDefault();
        setCursor(items.length - 1);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        pick(cursor);
        break;
      case 'Tab':
        setOpen(false);
        break;
    }
  };

  const listId = `${baseId}-list`;
  const hintId = hint ? `${baseId}-hint` : undefined;
  const errorId = error ? `${baseId}-error` : undefined;

  return (
    <div className={cn('ob-field', error && 'ob-field--invalid', className)}>
      {fieldLabel ? (
        <label className="ob-field__label" htmlFor={baseId}>
          {fieldLabel}
        </label>
      ) : null}

      <div className="ob-select" ref={rootRef} data-open={open}>
        <button
          id={baseId}
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-controls={open ? listId : undefined}
          aria-haspopup="listbox"
          aria-label={ariaLabel}
          aria-activedescendant={open ? `${baseId}-opt-${cursor}` : undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={errorId ?? hintId}
          disabled={disabled}
          className={cn(
            'ob-input',
            'ob-select__trigger',
            'ob-reset-button',
            error && 'ob-input--invalid',
            disabled && 'ob-input--disabled',
          )}
          onClick={() => (open ? setOpen(false) : openMenu())}
          onKeyDown={onKeyDown}
        >
          <span
            className={cn(
              'ob-select__value',
              selectedLabel === null && 'ob-select__value--placeholder',
            )}
          >
            {selectedLabel ?? placeholder}
          </span>
          <span className="ob-select__caret" aria-hidden="true">
            ▼
          </span>
        </button>

        {open ? (
          <GlassSurface
            as="ul"
            id={listId}
            role="listbox"
            radius="md"
            elevation="overlay"
            ref={listRef}
            className="ob-select__menu"
          >
            {items.map((item, i) => {
              const optDisabled = isDisabled?.(item, i) ?? false;
              return (
                <li
                  key={getKey(item, i)}
                  id={`${baseId}-opt-${i}`}
                  role="option"
                  aria-selected={i === selectedIndex}
                  aria-disabled={optDisabled || undefined}
                  data-active={i === cursor}
                  className="ob-select__option"
                  // Pointer-down would blur the trigger before the click
                  // lands; commit on mousedown instead and keep focus.
                  onMouseDown={(e) => {
                    e.preventDefault();
                    pick(i);
                  }}
                  onMouseEnter={() => !optDisabled && setCursor(i)}
                >
                  <span>{label ? label(item, i) : String(item)}</span>
                  {i === selectedIndex ? (
                    <span className="ob-select__mark" aria-hidden="true">
                      ●
                    </span>
                  ) : null}
                </li>
              );
            })}
          </GlassSurface>
        ) : null}
      </div>

      {error ? (
        <p id={errorId} className="ob-field__note ob-field__note--error" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="ob-field__note">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
