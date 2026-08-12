import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { cn } from '../lib/cn';
import { useControllableState } from '../lib/hooks';
import { FieldLabel, FieldNote, useFieldIds } from './GlassField';
import { Floating } from './internal/Floating';
import './GlassInput.css';
import './GlassSelect.css';
import './GlassCombobox.css';
import './GlassTagInput.css';

/** Class names for each part of the control. */
export interface TagInputClasses {
  field?: string;
  label?: string;
  note?: string;
  /** The bordered well holding the chips and the draft input. */
  well?: string;
  list?: string;
  chip?: string;
  chipText?: string;
  /** The ✕ on a chip. */
  remove?: string;
  /** The draft `<input>`. */
  control?: string;
  count?: string;
  menu?: string;
  option?: string;
}

/** What {@link GlassTagInputProps.renderTag} is handed for each chip. */
export interface TagRenderArgs {
  tag: string;
  index: number;
  disabled: boolean;
  /** Drop this tag. Already wired to refocus the draft input. */
  remove: () => void;
}

export interface GlassTagInputProps {
  /** The tags. Omit for an uncontrolled field. */
  value?: readonly string[];
  /** Starting tags when uncontrolled. @default [] */
  defaultValue?: readonly string[];
  onChange?: (value: string[]) => void;
  /** Fired with the tag that was just added. */
  onAdd?: (tag: string) => void;
  /** Fired with the tag that was just removed, and its index. */
  onRemove?: (tag: string, index: number) => void;
  /** Offer these as a filtered dropdown — turns the field into a multi-select. */
  suggestions?: readonly string[];
  /** Only allow values drawn from `suggestions`. @default false */
  strict?: boolean;
  /** Keys that commit the draft, besides Enter. @default [','] */
  delimiters?: readonly string[];
  /** Split pasted text on `delimiters` and add each piece. @default true */
  splitPaste?: boolean;
  /** Commit a half-typed tag when focus leaves. @default true unless `strict` */
  addOnBlur?: boolean;
  /** Reject a tag, or return a string to explain why. Runs before adding. */
  validate?: (tag: string, current: readonly string[]) => boolean | string;
  /** Cap the number of tags. */
  max?: number;
  /** Normalize before adding — trims by default. */
  transform?: (raw: string) => string;
  /** Full control over a chip's markup. */
  renderTag?: (args: TagRenderArgs) => ReactNode;
  /** Glyph on the chip's remove button. @default '✕' */
  icons?: { remove?: ReactNode };
  label?: ReactNode;
  placeholder?: string;
  hint?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  /** Marker appended to the label when `required`. Pass `null` to drop it. */
  requiredMark?: ReactNode;
  disabled?: boolean;
  /** Allow the same tag twice. @default false */
  allowDuplicates?: boolean;
  emptyMessage?: ReactNode;
  /** Cap the suggestion panel's height before it scrolls. @default 280 */
  maxHeight?: string | number;
  size?: 'sm' | 'md' | 'lg';
  id?: string;
  className?: string;
  classNames?: TagInputClasses;
  style?: CSSProperties;
  'aria-label'?: string;
}

/**
 * A chip field. Type and press Enter to add, click ✕ or press Backspace on an
 * empty draft to remove the last one.
 *
 * Free-form on its own; pass `suggestions` and it becomes a multi-select with
 * a filtered dropdown, and `strict` confines it to that set. Rejections from
 * `validate`, `max` and duplicate checks surface inline under the field
 * unless the caller is already showing an `error`.
 */
export const GlassTagInput = forwardRef<HTMLInputElement, GlassTagInputProps>(
  function GlassTagInput(
    {
      value: valueProp,
      defaultValue = [],
      onChange,
      onAdd,
      onRemove,
      suggestions,
      strict = false,
      delimiters = [','],
      splitPaste = true,
      addOnBlur,
      validate,
      max,
      transform = (raw) => raw.trim(),
      renderTag,
      icons,
      label,
      placeholder = 'Add a tag…',
      hint,
      error,
      required,
      requiredMark,
      disabled = false,
      allowDuplicates = false,
      emptyMessage = 'No matches',
      maxHeight = 280,
      size = 'md',
      id,
      className,
      classNames,
      style,
      'aria-label': ariaLabel,
    },
    ref,
  ) {
    const anchorRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [draft, setDraft] = useState('');
    const [open, setOpen] = useState(false);
    const [cursor, setCursor] = useState(0);
    /** Why the last add was refused. Cleared on the next keystroke. */
    const [refusal, setRefusal] = useState<string | null>(null);

    const [value, setValue] = useControllableState<readonly string[]>(
      valueProp,
      defaultValue,
      onChange as ((v: readonly string[]) => void) | undefined,
    );

    useImperativeHandle(ref, () => inputRef.current as HTMLInputElement, []);

    const { id: fieldId, hintId, errorId, describedBy } = useFieldIds(id, hint, error ?? refusal);

    const commitOnBlur = addOnBlur ?? !strict;
    const full = max !== undefined && value.length >= max;

    const matches = useMemo(() => {
      if (!suggestions) return [];
      const needle = draft.trim().toLowerCase();
      return suggestions.filter(
        (s) =>
          (allowDuplicates || !value.includes(s)) &&
          (needle === '' || s.toLowerCase().includes(needle)),
      );
    }, [suggestions, draft, value, allowDuplicates]);

    const add = useCallback(
      (raw: string) => {
        const tag = transform(raw);
        if (tag === '') return;

        if (full) {
          setRefusal(`At most ${max} ${max === 1 ? 'tag' : 'tags'}.`);
          return;
        }
        if (!allowDuplicates && value.includes(tag)) {
          setRefusal(`“${tag}” is already added.`);
          return;
        }
        if (strict && suggestions && !suggestions.includes(tag)) {
          setRefusal(`“${tag}” is not one of the options.`);
          return;
        }
        const verdict = validate?.(tag, value);
        if (verdict === false) {
          setRefusal(`“${tag}” is not allowed.`);
          return;
        }
        if (typeof verdict === 'string') {
          setRefusal(verdict);
          return;
        }

        setRefusal(null);
        setDraft('');
        setCursor(0);
        setValue([...value, tag]);
        onAdd?.(tag);
      },
      [
        transform,
        full,
        max,
        allowDuplicates,
        value,
        strict,
        suggestions,
        validate,
        setValue,
        onAdd,
      ],
    );

    const removeAt = (index: number) => {
      const tag = value[index];
      setRefusal(null);
      setValue(value.filter((_, i) => i !== index));
      if (tag !== undefined) onRemove?.(tag, index);
      inputRef.current?.focus();
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (open && matches.length > 0) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setCursor((c) => (c + 1) % matches.length);
          return;
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          setCursor((c) => (c - 1 + matches.length) % matches.length);
          return;
        }
        if (e.key === 'Enter') {
          e.preventDefault();
          add(matches[cursor] ?? draft);
          return;
        }
      }

      if (e.key === 'Enter') {
        e.preventDefault(); // never submit the form mid-draft
        add(draft);
        return;
      }
      if (delimiters.includes(e.key)) {
        e.preventDefault();
        add(draft);
        return;
      }
      if (e.key === 'Backspace' && draft === '' && value.length > 0) {
        e.preventDefault();
        removeAt(value.length - 1);
        return;
      }
      if (e.key === 'Escape' && open) {
        e.preventDefault();
        setOpen(false);
      }
    };

    /**
     * A pasted list arrives as one string; break it on the delimiters.
     *
     * `delimiters` holds key names, so only the single-character ones are
     * real text — `'Enter'` in a character class would split on E, n, t and r.
     */
    const splitters = useMemo(
      () => delimiters.filter((d) => d.length === 1),
      [delimiters],
    );

    const onPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
      if (!splitPaste || splitters.length === 0) return;
      const text = e.clipboardData.getData('text');
      const pattern = new RegExp(
        `[${splitters.map((d) => d.replace(/[.*+?^${}()|[\]\\-]/g, '\\$&')).join('')}]`,
      );
      if (!pattern.test(text)) return;
      e.preventDefault();
      for (const piece of text.split(pattern)) add(piece);
    };

    const invalid = Boolean(error ?? refusal);

    return (
      <div
        className={cn('ob-field', invalid && 'ob-field--invalid', className, classNames?.field)}
        style={style}
      >
        {label ? (
          <FieldLabel
            id={fieldId}
            label={label}
            required={required}
            requiredMark={requiredMark}
            className={classNames?.label}
          />
        ) : null}

        <div className="ob-combo" ref={anchorRef} data-open={open}>
          {/* Clicking anywhere in the well should land in the draft input. */}
          <div
            className={cn(
              'ob-input',
              'ob-tags',
              size !== 'md' && `ob-input--${size}`,
              invalid && 'ob-input--invalid',
              disabled && 'ob-input--disabled',
              classNames?.well,
            )}
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) inputRef.current?.focus();
            }}
          >
            <ul className={cn('ob-tags__list', classNames?.list)}>
              {value.map((tag, i) => (
                <li key={`${tag}-${i}`} className={cn('ob-tags__chip', classNames?.chip)}>
                  {renderTag ? (
                    renderTag({ tag, index: i, disabled, remove: () => removeAt(i) })
                  ) : (
                    <>
                      <span className={cn('ob-tags__text', classNames?.chipText)}>{tag}</span>
                      <button
                        type="button"
                        tabIndex={-1}
                        className={cn('ob-tags__x', 'ob-reset-button', classNames?.remove)}
                        aria-label={`Remove ${tag}`}
                        disabled={disabled}
                        onClick={() => removeAt(i)}
                      >
                        {icons?.remove ?? '✕'}
                      </button>
                    </>
                  )}
                </li>
              ))}

              <li className="ob-tags__draft">
                <input
                  ref={inputRef}
                  id={fieldId}
                  type="text"
                  className={cn('ob-input__control', classNames?.control)}
                  autoComplete="off"
                  role={suggestions ? 'combobox' : undefined}
                  aria-expanded={suggestions ? open : undefined}
                  aria-autocomplete={suggestions ? 'list' : undefined}
                  value={draft}
                  // The placeholder would crowd the chips, so it only shows on
                  // an empty field.
                  placeholder={value.length === 0 ? placeholder : ''}
                  disabled={disabled}
                  aria-label={ariaLabel}
                  aria-invalid={invalid || undefined}
                  aria-describedby={describedBy}
                  onChange={(e) => {
                    setDraft(e.target.value);
                    setRefusal(null);
                    setCursor(0);
                    if (suggestions) setOpen(true);
                  }}
                  onKeyDown={onKeyDown}
                  onPaste={onPaste}
                  onFocus={() => suggestions && setOpen(true)}
                  onBlur={(e) => {
                    if (anchorRef.current?.contains(e.relatedTarget as Node)) return;
                    // Commit a half-typed tag rather than silently dropping it.
                    if (draft.trim() !== '' && commitOnBlur) add(draft);
                  }}
                />
              </li>
            </ul>

            {max !== undefined ? (
              <span
                className={cn(
                  'ob-tags__count',
                  full && 'ob-tags__count--full',
                  classNames?.count,
                )}
                aria-hidden="true"
              >
                {value.length}/{max}
              </span>
            ) : null}
          </div>

          {suggestions ? (
            <Floating
              open={open && !disabled}
              onClose={() => setOpen(false)}
              anchorRef={anchorRef}
              placement="bottom-start"
              matchWidth
              className={cn(
                'ob-combo__menu',
                'ob-surface',
                'ob-surface--overlay',
                classNames?.menu,
              )}
            >
              <div className="ob-combo__scroll" style={{ maxHeight }}>
                {matches.length === 0 ? (
                  <p className="ob-combo__note">{emptyMessage}</p>
                ) : (
                  <div role="listbox" aria-label={ariaLabel ?? 'Suggestions'}>
                    {matches.map((s, at) => (
                      <div
                        key={s}
                        role="option"
                        aria-selected={at === cursor}
                        data-active={at === cursor}
                        className={cn('ob-select__option', classNames?.option)}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          add(s);
                        }}
                        onMouseEnter={() => setCursor(at)}
                      >
                        <span>{s}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Floating>
          ) : null}
        </div>

        <FieldNote
          error={error ?? refusal}
          hint={hint}
          errorId={errorId}
          hintId={hintId}
          className={classNames?.note}
        />
      </div>
    );
  },
);
