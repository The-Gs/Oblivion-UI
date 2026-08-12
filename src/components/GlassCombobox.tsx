import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type Key,
  type ReactElement,
  type ReactNode,
  type Ref,
} from 'react';
import { cn } from '../lib/cn';
import { useControllableState } from '../lib/hooks';
import { FieldLabel, FieldNote, useFieldIds } from './GlassField';
import { Floating } from './internal/Floating';
import type { Placement } from '../lib/positioning';
import './GlassInput.css';
import './GlassSelect.css';
import './GlassCombobox.css';

/** Class names for each part of the control. */
export interface ComboboxClasses {
  field?: string;
  label?: string;
  note?: string;
  /** The bordered well around the input and its buttons. */
  well?: string;
  /** The `<input>` itself. */
  control?: string;
  clear?: string;
  caret?: string;
  /** The floating panel. */
  menu?: string;
  option?: string;
  /** The empty and loading notes inside the panel. */
  message?: string;
}

/** What {@link GlassComboboxProps.renderOption} is handed for each row. */
export interface ComboboxOptionArgs<T> {
  item: T;
  /** Index in the original `items` array, not in the filtered list. */
  index: number;
  /** This item is the current selection. */
  selected: boolean;
  /** The keyboard highlight is on this row. */
  active: boolean;
  disabled: boolean;
}

export interface GlassComboboxProps<T> {
  items: readonly T[];
  getKey: (item: T, index: number) => Key;
  /** Option label. Defaults to `toText`. */
  label?: (item: T, index: number) => ReactNode;
  /** Plain-text form of an item — drives filtering and the input's display value. */
  toText?: (item: T) => string;
  isDisabled?: (item: T, index: number) => boolean;
  /** Key of the selected item, or `null`. Omit for an uncontrolled field. */
  value?: Key | null;
  /** Starting selection when uncontrolled. @default null */
  defaultValue?: Key | null;
  onChange?: (item: T | null, index: number) => void;
  /**
   * Match an item against the query. Pass `false` when the caller already
   * filters — remote search — and `items` is used verbatim.
   * @default case-insensitive substring on `toText`
   */
  filter?: false | ((item: T, query: string, index: number) => boolean);
  /** Observe the typed query, e.g. to fetch results. */
  onQueryChange?: (query: string) => void;
  /** Observe the panel opening and closing. */
  onOpenChange?: (open: boolean) => void;
  /** Open the panel as soon as the field takes focus. @default true */
  openOnFocus?: boolean;
  /** Full control over an option's interior. */
  renderOption?: (args: ComboboxOptionArgs<T>) => ReactNode;
  /** Pinned under the list — an "Add new…" action, a result count. */
  footer?: ReactNode;
  /** Glyphs on the affordances. @default '✕', '▼' and '●' */
  icons?: { clear?: ReactNode; caret?: ReactNode; selected?: ReactNode };
  /** Field label above the control. */
  fieldLabel?: ReactNode;
  placeholder?: string;
  hint?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  /** Marker appended to the label when `required`. Pass `null` to drop it. */
  requiredMark?: ReactNode;
  disabled?: boolean;
  /** Show a clear button once something is selected. @default true */
  clearable?: boolean;
  /** Shown in place of the list when nothing matches. */
  emptyMessage?: ReactNode;
  /** Swaps the list for a loading note — for remote search. @default false */
  loading?: boolean;
  /** Shown while `loading`. @default 'Searching…' */
  loadingMessage?: ReactNode;
  /** Cap the panel's height before it scrolls. @default '280px' */
  maxHeight?: string | number;
  /** @default 'bottom-start' */
  placement?: Placement;
  size?: 'sm' | 'md' | 'lg';
  id?: string;
  className?: string;
  classNames?: ComboboxClasses;
  style?: CSSProperties;
  name?: string;
  'aria-label'?: string;
}

function GlassComboboxImpl<T>(
  {
    items,
    getKey,
    label,
    toText = (item) => String(item),
    isDisabled,
    value: valueProp,
    defaultValue = null,
    onChange,
    filter,
    onQueryChange,
    onOpenChange,
    openOnFocus = true,
    renderOption,
    footer,
    icons,
    fieldLabel,
    placeholder = 'Search…',
    hint,
    error,
    required,
    requiredMark,
    disabled = false,
    clearable = true,
    emptyMessage = 'No matches',
    loading = false,
    loadingMessage = 'Searching…',
    maxHeight = 280,
    placement = 'bottom-start',
    size = 'md',
    id,
    className,
    classNames,
    style,
    name,
    'aria-label': ariaLabel,
  }: GlassComboboxProps<T>,
  ref: Ref<HTMLInputElement>,
) {
  const anchorRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const { id: fieldId, hintId, errorId, describedBy } = useFieldIds(id, hint, error);

  useImperativeHandle(ref, () => inputRef.current as HTMLInputElement, []);

  const [open, setOpenState] = useState(false);
  // `null` means "mirror the selection"; a string means the user is typing.
  const [query, setQuery] = useState<string | null>(null);
  const [cursor, setCursor] = useState(0);

  const [value, setValue] = useControllableState<Key | null>(valueProp, defaultValue);

  const setOpen = useCallback(
    (next: boolean) => {
      setOpenState((prev) => {
        if (prev !== next) onOpenChange?.(next);
        return next;
      });
    },
    [onOpenChange],
  );

  const selectedIndex = items.findIndex((item, i) => getKey(item, i) === value);
  const selected = selectedIndex >= 0 ? items[selectedIndex] : undefined;
  const selectedText = selected === undefined ? '' : toText(selected);
  const text = query ?? selectedText;

  /** Items after filtering, paired with their index in the original array. */
  const matches = useMemo(() => {
    const pairs = items.map((item, index) => ({ item, index }));
    // No query, or the caller filters, means show everything we were given.
    if (filter === false || query === null || query.trim() === '') return pairs;
    const needle = query.toLowerCase();
    const match = filter ?? ((item: T, q: string) => toText(item).toLowerCase().includes(q));
    return pairs.filter(({ item, index }) => match(item, needle, index));
  }, [items, filter, query, toText]);

  // Keep the highlight in range as the list shrinks under the query.
  useLayoutEffect(() => {
    setCursor((c) => Math.min(c, Math.max(0, matches.length - 1)));
  }, [matches.length]);

  useLayoutEffect(() => {
    if (!open) return;
    listRef.current
      ?.querySelectorAll<HTMLElement>('[role="option"]')
      [cursor]?.scrollIntoView({ block: 'nearest' });
  }, [open, cursor]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery(null); // discard the query — the field shows what is selected
  }, [setOpen]);

  const openList = useCallback(() => {
    if (disabled) return;
    setOpen(true);
    const at = matches.findIndex((m) => m.index === selectedIndex);
    setCursor(at >= 0 ? at : 0);
  }, [disabled, matches, selectedIndex, setOpen]);

  const pick = useCallback(
    (at: number) => {
      const hit = matches[at];
      if (!hit || isDisabled?.(hit.item, hit.index)) return;
      setValue(getKey(hit.item, hit.index));
      onChange?.(hit.item, hit.index);
      setOpen(false);
      setQuery(null);
    },
    [matches, isDisabled, setValue, getKey, onChange, setOpen],
  );

  const step = useCallback(
    (delta: number) => {
      if (matches.length === 0) return;
      setCursor((prev) => {
        for (let n = 1; n <= matches.length; n++) {
          const next = (prev + delta * n + matches.length * n) % matches.length;
          const hit = matches[next];
          if (hit && !isDisabled?.(hit.item, hit.index)) return next;
        }
        return prev;
      });
    },
    [matches, isDisabled],
  );

  const clear = () => {
    setValue(null);
    onChange?.(null, -1);
    setQuery(null);
    inputRef.current?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        openList();
      }
      return;
    }

    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        close();
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
        setCursor(matches.length - 1);
        break;
      case 'Enter':
        // Only swallow Enter when there is something to commit, so the key
        // still submits the surrounding form on an empty list.
        if (matches.length > 0) {
          e.preventDefault();
          pick(cursor);
        }
        break;
      case 'Tab':
        close();
        break;
    }
  };

  const listId = `${fieldId}-list`;

  return (
    <div
      className={cn('ob-field', error && 'ob-field--invalid', className, classNames?.field)}
      style={style}
    >
      {fieldLabel ? (
        <FieldLabel
          id={fieldId}
          label={fieldLabel}
          required={required}
          requiredMark={requiredMark}
          className={classNames?.label}
        />
      ) : null}

      <div className="ob-combo" ref={anchorRef} data-open={open}>
        <div
          className={cn(
            'ob-input',
            'ob-combo__well',
            size !== 'md' && `ob-input--${size}`,
            error && 'ob-input--invalid',
            disabled && 'ob-input--disabled',
            classNames?.well,
          )}
        >
          <input
            ref={inputRef}
            id={fieldId}
            type="text"
            role="combobox"
            className={cn('ob-input__control', classNames?.control)}
            autoComplete="off"
            value={text}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            aria-expanded={open}
            aria-controls={open ? listId : undefined}
            aria-autocomplete="list"
            aria-activedescendant={
              open && matches.length > 0 ? `${fieldId}-opt-${cursor}` : undefined
            }
            aria-label={ariaLabel}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            onChange={(e) => {
              setQuery(e.target.value);
              onQueryChange?.(e.target.value);
              setCursor(0);
              setOpen(true);
            }}
            onKeyDown={onKeyDown}
            onFocus={() => openOnFocus && openList()}
            onBlur={(e) => {
              // A click on an option refocuses the input, so only a blur that
              // truly leaves the control should revert the query.
              if (anchorRef.current?.contains(e.relatedTarget as Node)) return;
              setQuery(null);
            }}
          />

          {name ? <input type="hidden" name={name} value={value === null ? '' : String(value)} /> : null}

          {clearable && selected !== undefined && !disabled ? (
            <button
              type="button"
              tabIndex={-1}
              className={cn('ob-combo__clear', 'ob-reset-button', classNames?.clear)}
              aria-label="Clear selection"
              onMouseDown={(e) => e.preventDefault()}
              onClick={clear}
            >
              {icons?.clear ?? '✕'}
            </button>
          ) : null}

          <button
            type="button"
            tabIndex={-1}
            aria-hidden="true"
            disabled={disabled}
            className={cn('ob-combo__caret', 'ob-reset-button', classNames?.caret)}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => (open ? close() : (inputRef.current?.focus(), openList()))}
          >
            {icons?.caret ?? '▼'}
          </button>
        </div>

        <Floating
          open={open}
          onClose={close}
          anchorRef={anchorRef}
          placement={placement}
          matchWidth
          className={cn('ob-combo__menu', 'ob-surface', 'ob-surface--overlay', classNames?.menu)}
        >
          <div className="ob-combo__scroll" style={{ maxHeight }}>
            {loading ? (
              <p className={cn('ob-combo__note', classNames?.message)}>{loadingMessage}</p>
            ) : matches.length === 0 ? (
              <p className={cn('ob-combo__note', classNames?.message)}>{emptyMessage}</p>
            ) : (
              <div ref={listRef} id={listId} role="listbox" aria-label={ariaLabel ?? 'Suggestions'}>
                {matches.map(({ item, index }, at) => {
                  const optDisabled = isDisabled?.(item, index) ?? false;
                  const isSelected = index === selectedIndex;
                  return (
                    <div
                      key={getKey(item, index)}
                      id={`${fieldId}-opt-${at}`}
                      role="option"
                      aria-selected={isSelected}
                      aria-disabled={optDisabled || undefined}
                      data-active={at === cursor}
                      className={cn('ob-select__option', classNames?.option)}
                      // Commit on mousedown so the input never blurs first.
                      onMouseDown={(e) => {
                        e.preventDefault();
                        pick(at);
                      }}
                      onMouseEnter={() => !optDisabled && setCursor(at)}
                    >
                      {renderOption ? (
                        renderOption({
                          item,
                          index,
                          selected: isSelected,
                          active: at === cursor,
                          disabled: optDisabled,
                        })
                      ) : (
                        <>
                          <span>{label ? label(item, index) : toText(item)}</span>
                          {isSelected ? (
                            <span className="ob-select__mark" aria-hidden="true">
                              {icons?.selected ?? '●'}
                            </span>
                          ) : null}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          {footer ? <div className="ob-combo__foot">{footer}</div> : null}
        </Floating>
      </div>

      <FieldNote
        error={error}
        hint={hint}
        errorId={errorId}
        hintId={hintId}
        className={classNames?.note}
      />
    </div>
  );
}

/**
 * A searchable select: type to filter, arrows to move, Enter to commit.
 *
 * Follows the ARIA combobox pattern with `aria-activedescendant`, so focus
 * never leaves the text input. The query is transient — Escape or blur
 * restores the selected item's text, so the field can never be left showing
 * something that was not actually chosen.
 *
 * The cast keeps `T` inferable: `forwardRef` alone would erase the generic
 * and collapse every callback's item type to `unknown`.
 */
export const GlassCombobox = forwardRef(GlassComboboxImpl) as <T>(
  props: GlassComboboxProps<T> & { ref?: Ref<HTMLInputElement> },
) => ReactElement | null;
