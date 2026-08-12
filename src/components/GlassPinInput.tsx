import {
  forwardRef,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { cn } from '../lib/cn';
import { useControllableState } from '../lib/hooks';
import { FieldLabel, FieldNote, useFieldIds } from './GlassField';
import './GlassInput.css';
import './GlassPinInput.css';

/** Class names for each part of the control. */
export interface PinInputClasses {
  field?: string;
  label?: string;
  note?: string;
  /** The row of cells. */
  group?: string;
  cell?: string;
  separator?: string;
}

export interface GlassPinInputProps {
  /** The code so far. Shorter than `length` while incomplete. */
  value?: string;
  /** Starting code when uncontrolled. @default '' */
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Fired once the last cell is filled. */
  onComplete?: (value: string) => void;
  /** Number of cells. @default 6 */
  length?: number;
  /** `numeric` accepts 0–9 only; `alphanumeric` also accepts letters. @default 'numeric' */
  type?: 'numeric' | 'alphanumeric';
  /**
   * Accept exactly the characters this matches, ignoring `type`. Tested one
   * character at a time — `/[a-f0-9]/i` gives you a hex field.
   */
  allow?: RegExp;
  /** Render filled cells as dots — for PINs rather than one-time codes. @default false */
  mask?: boolean;
  /** Upper-case letters as they are typed. @default true */
  uppercase?: boolean;
  /** Shown in every empty cell — a placeholder glyph like `·`. */
  placeholder?: string;
  /**
   * Rendered between cells. A node goes in every gap; a function is called
   * with the index of the cell to its left, so you can return `null` to skip.
   */
  separator?: ReactNode | ((index: number) => ReactNode);
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  /** Marker appended to the label when `required`. Pass `null` to drop it. */
  requiredMark?: ReactNode;
  disabled?: boolean;
  autoFocus?: boolean;
  size?: 'sm' | 'md' | 'lg';
  id?: string;
  name?: string;
  className?: string;
  classNames?: PinInputClasses;
  style?: CSSProperties;
  'aria-label'?: string;
}

/** Character classes for the built-in `type`s. */
const CHAR = {
  numeric: /[0-9]/,
  alphanumeric: /[0-9a-zA-Z]/,
};

/**
 * A segmented code field — one cell per character, for OTPs and PINs.
 *
 * Typing advances, Backspace on an empty cell steps back and clears the one
 * before it, arrows move without editing, and a paste of any length fills
 * from the focused cell onward. Only characters matching `type` (or `allow`)
 * survive, so pasting `123-456` still lands as `123456`.
 */
export const GlassPinInput = forwardRef<HTMLInputElement, GlassPinInputProps>(
  function GlassPinInput(
    {
      value: valueProp,
      defaultValue = '',
      onChange,
      onComplete,
      length = 6,
      type = 'numeric',
      allow,
      mask = false,
      uppercase = true,
      placeholder,
      separator,
      label,
      hint,
      error,
      required,
      requiredMark,
      disabled = false,
      autoFocus = false,
      size = 'md',
      id,
      name,
      className,
      classNames,
      style,
      'aria-label': ariaLabel,
    },
    ref,
  ) {
    const groupId = useId();
    const { id: fieldId, hintId, errorId, describedBy } = useFieldIds(id, hint, error);
    const cells = useRef<Array<HTMLInputElement | null>>([]);

    const [value, setValue] = useControllableState<string>(valueProp, defaultValue, onChange);

    // The first cell is the control the label points at, so that is the one
    // an outside ref should land on.
    useImperativeHandle(ref, () => cells.current[0] as HTMLInputElement, []);

    // A caller's `allow` may arrive with the /g flag, whose lastIndex would
    // make `test` alternate between hits and misses. Strip it.
    const test = useMemo(() => {
      if (!allow) return CHAR[type];
      return allow.global ? new RegExp(allow.source, allow.flags.replace('g', '')) : allow;
    }, [allow, type]);

    const sanitize = (raw: string) => {
      const cleaned = [...raw].filter((c) => test.test(c)).join('');
      return uppercase ? cleaned.toUpperCase() : cleaned;
    };

    const focusCell = (index: number) => {
      const target = cells.current[Math.min(length - 1, Math.max(0, index))];
      target?.focus();
      target?.select();
    };

    const push = (next: string) => {
      const clipped = next.slice(0, length);
      setValue(clipped);
      if (clipped.length === length) onComplete?.(clipped);
    };

    /** Replace characters at `at`, keeping the string dense. */
    const writeAt = (at: number, chars: string) => {
      const arr = value.padEnd(length, ' ').split('');
      for (let i = 0; i < chars.length && at + i < length; i++) arr[at + i] = chars[i]!;
      return arr.join('').trimEnd();
    };

    const onCellChange = (index: number, raw: string) => {
      const chars = sanitize(raw);
      if (chars.length === 0) return;
      push(writeAt(index, chars));
      focusCell(index + chars.length);
    };

    const onKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      switch (e.key) {
        case 'Backspace': {
          e.preventDefault();
          if (value[index]) {
            // Delete in place, staying put — matches the browser's own feel.
            push(writeAt(index, ' ').replace(/ +$/, ''));
          } else if (index > 0) {
            push(value.slice(0, index - 1));
            focusCell(index - 1);
          }
          break;
        }
        case 'Delete':
          e.preventDefault();
          push(value.slice(0, index));
          break;
        case 'ArrowLeft':
          e.preventDefault();
          focusCell(index - 1);
          break;
        case 'ArrowRight':
          e.preventDefault();
          focusCell(index + 1);
          break;
        case 'Home':
          e.preventDefault();
          focusCell(0);
          break;
        case 'End':
          e.preventDefault();
          focusCell(value.length);
          break;
      }
    };

    const onPaste = (index: number, e: React.ClipboardEvent) => {
      e.preventDefault();
      const chars = sanitize(e.clipboardData.getData('text'));
      if (chars.length === 0) return;
      push(writeAt(index, chars));
      focusCell(index + chars.length);
    };

    const gap = (index: number): ReactNode =>
      typeof separator === 'function' ? separator(index) : separator;

    return (
      <div
        className={cn('ob-field', error && 'ob-field--invalid', className, classNames?.field)}
        style={style}
      >
        {label ? (
          <FieldLabel
            id={`${groupId}-0`}
            label={label}
            required={required}
            requiredMark={requiredMark}
            className={classNames?.label}
          />
        ) : null}

        <div
          className={cn(
            'ob-pin',
            size !== 'md' && `ob-pin--${size}`,
            disabled && 'ob-pin--disabled',
            classNames?.group,
          )}
          role="group"
          aria-label={ariaLabel ?? (typeof label === 'string' ? label : 'Verification code')}
          aria-describedby={describedBy}
        >
          {Array.from({ length }, (_, i) => {
            const char = value[i] ?? '';
            const divider = i < length - 1 ? gap(i) : null;
            return (
              <span className="ob-pin__slot" key={i}>
                <input
                  // The first cell carries the field id so the label points at it.
                  id={i === 0 ? fieldId : `${groupId}-${i}`}
                  name={name ? `${name}-${i}` : undefined}
                  ref={(el) => {
                    cells.current[i] = el;
                  }}
                  className={cn(
                    'ob-pin__cell',
                    char && 'ob-pin__cell--filled',
                    error && 'ob-pin__cell--invalid',
                    classNames?.cell,
                  )}
                  type={mask && char ? 'password' : 'text'}
                  inputMode={type === 'numeric' && !allow ? 'numeric' : 'text'}
                  // Lets iOS and Android offer the SMS code straight from the keyboard.
                  autoComplete={i === 0 ? 'one-time-code' : 'off'}
                  autoFocus={autoFocus && i === 0}
                  disabled={disabled}
                  required={required && i === 0}
                  maxLength={1}
                  value={char}
                  placeholder={placeholder}
                  aria-label={`Digit ${i + 1} of ${length}`}
                  aria-invalid={error ? true : undefined}
                  onChange={(e) => onCellChange(i, e.target.value)}
                  onKeyDown={(e) => onKeyDown(i, e)}
                  onPaste={(e) => onPaste(i, e)}
                  onFocus={(e) => e.target.select()}
                />
                {divider ? (
                  <span
                    className={cn('ob-pin__sep', classNames?.separator)}
                    aria-hidden="true"
                  >
                    {divider}
                  </span>
                ) : null}
              </span>
            );
          })}
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
  },
);
