import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type CSSProperties,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import { cn } from '../lib/cn';
import { useControllableState } from '../lib/hooks';
import { GlassField } from './GlassField';
import './GlassInput.css';
import './GlassNumberInput.css';

/** Class names for each part of the control. */
export interface NumberInputClasses {
  field?: string;
  label?: string;
  note?: string;
  /** The bordered well around everything. */
  well?: string;
  /** The `<input>` itself. */
  control?: string;
  /** The column holding the two stepper buttons. */
  steppers?: string;
  step?: string;
  prefix?: string;
  suffix?: string;
}

type PassthroughProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  | 'value'
  | 'defaultValue'
  | 'onChange'
  | 'onBlur'
  | 'size'
  | 'className'
  | 'style'
  | 'prefix'
  | 'min'
  | 'max'
  | 'step'
  | 'type'
>;

export interface GlassNumberInputProps extends PassthroughProps {
  /** Current value, or `null` when empty. Omit for an uncontrolled field. */
  value?: number | null;
  /** Starting value when uncontrolled. @default null */
  defaultValue?: number | null;
  onChange?: (value: number | null) => void;
  min?: number;
  max?: number;
  /** Increment for the steppers and arrow keys. @default 1 */
  step?: number;
  /** Increment for PageUp/PageDown. @default `step * 10` */
  bigStep?: number;
  /** Decimal places to round and display to. Inferred from `step` when unset. */
  precision?: number;
  /**
   * Render the value as text — thousands separators, currency, units. The
   * field shows the raw number again while it has focus, so the formatting
   * never gets in the way of editing.
   */
  format?: (value: number) => string;
  /**
   * Read a number back out of typed text. Pair with `format` when your
   * formatting is not reversible by the default reader, which strips
   * anything that is not a digit, sign, dot or exponent.
   */
  parse?: (text: string) => number | null;
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  /** Marker appended to the label when `required`. Pass `null` to drop it. */
  requiredMark?: ReactNode;
  /** Label beside the control instead of above it. @default 'vertical' */
  orientation?: 'vertical' | 'horizontal';
  disabled?: boolean;
  readOnly?: boolean;
  /** Static content inside the well, before the number — `$`, `≈`. */
  prefix?: ReactNode;
  /** Static content inside the well, after the number — `BPM`, `%`, `ms`. */
  suffix?: ReactNode;
  /** Hide the +/− buttons and rely on typing and arrow keys. @default false */
  hideSteppers?: boolean;
  /** Glyphs on the stepper buttons. @default `+` and `−` */
  icons?: { up?: ReactNode; down?: ReactNode };
  /** Step the value when the wheel turns over a focused field. @default true */
  wheel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  id?: string;
  className?: string;
  classNames?: NumberInputClasses;
  style?: CSSProperties;
  name?: string;
  onBlur?: () => void;
}

/** Decimals implied by a step, so 0.25 gives 2 and 5 gives 0. */
function precisionOf(step: number): number {
  const s = String(step);
  const dot = s.indexOf('.');
  return dot === -1 ? 0 : s.length - dot - 1;
}

const round = (n: number, places: number) => Number(n.toFixed(places));

/** Reads a number out of text that may carry separators or a unit. */
function defaultParse(text: string): number | null {
  const cleaned = text.replace(/[^\d.eE+-]/g, '').trim();
  if (cleaned === '') return null;
  const n = Number(cleaned);
  return Number.isNaN(n) ? null : n;
}

/**
 * A numeric field with steppers, range clamping and the standard keyboard
 * contract — ArrowUp/Down step, PageUp/Down step by `bigStep`, Home/End jump
 * to the bounds. Press and hold a stepper to repeat.
 *
 * Typing is not clamped until blur so intermediate states like `-` and `1.`
 * stay editable; the steppers and arrow keys always clamp.
 */
export const GlassNumberInput = forwardRef<HTMLInputElement, GlassNumberInputProps>(
  function GlassNumberInput(
    {
      value: valueProp,
      defaultValue = null,
      onChange,
      min = -Infinity,
      max = Infinity,
      step = 1,
      bigStep,
      precision,
      format,
      parse,
      label,
      hint,
      error,
      required,
      requiredMark,
      orientation,
      placeholder,
      disabled = false,
      readOnly = false,
      prefix,
      suffix,
      hideSteppers = false,
      icons,
      wheel = true,
      size = 'md',
      id,
      className,
      classNames,
      style,
      name,
      onBlur,
      onFocus: onFocusProp,
      onKeyDown: onKeyDownProp,
      ...rest
    },
    ref,
  ) {
    const places = precision ?? precisionOf(step);
    const leap = bigStep ?? step * 10;

    const [value, setValue] = useControllableState<number | null>(
      valueProp,
      defaultValue,
      onChange,
    );

    // The input owns its own text while focused so half-typed numbers
    // survive; the rest of the time it mirrors `value`.
    const [draft, setDraft] = useState<string | null>(null);
    const raw = value === null ? '' : String(round(value, places));
    const text = draft ?? (value === null ? '' : (format?.(value) ?? raw));

    const inputRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(ref, () => inputRef.current as HTMLInputElement, []);

    const clamp = useCallback((n: number) => Math.min(max, Math.max(min, n)), [min, max]);

    const commit = useCallback(
      (next: number | null) => {
        setValue(next === null ? null : round(clamp(next), places));
      },
      [setValue, clamp, places],
    );

    const bump = useCallback(
      (delta: number) => {
        if (disabled || readOnly) return;
        // An empty field steps from the nearest bound, or zero when unbounded.
        const base = value ?? (min > -Infinity ? min : 0);
        setDraft(null);
        commit(value === null ? base : base + delta);
      },
      [disabled, readOnly, value, min, commit],
    );

    /* ── Press and hold to repeat ────────────────────────────────────── */

    const repeat = useRef<{ timeout?: number; interval?: number }>({});

    const stopRepeat = useCallback(() => {
      window.clearTimeout(repeat.current.timeout);
      window.clearInterval(repeat.current.interval);
      repeat.current = {};
    }, []);

    useEffect(() => stopRepeat, [stopRepeat]);

    const startRepeat = (delta: number) => {
      bump(delta);
      // Match the OS key-repeat feel: a pause, then a steady stream.
      repeat.current.timeout = window.setTimeout(() => {
        repeat.current.interval = window.setInterval(() => bump(delta), 60);
      }, 400);
    };

    /* ── Keyboard ────────────────────────────────────────────────────── */

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      onKeyDownProp?.(e);
      if (e.defaultPrevented) return;

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          bump(step);
          break;
        case 'ArrowDown':
          e.preventDefault();
          bump(-step);
          break;
        case 'PageUp':
          e.preventDefault();
          bump(leap);
          break;
        case 'PageDown':
          e.preventDefault();
          bump(-leap);
          break;
        case 'Home':
          if (min > -Infinity) {
            e.preventDefault();
            setDraft(null);
            commit(min);
          }
          break;
        case 'End':
          if (max < Infinity) {
            e.preventDefault();
            setDraft(null);
            commit(max);
          }
          break;
      }
    };

    const handleBlur = () => {
      // Anything unreadable — "", "-", "1.2.3" — resolves to empty on blur.
      if (draft !== null) {
        commit(draft.trim() === '' ? null : (parse ?? defaultParse)(draft));
        setDraft(null);
      }
      onBlur?.();
    };

    const atMin = value !== null && value <= min;
    const atMax = value !== null && value >= max;

    const steppers: Array<[string, number, ReactNode, boolean]> = [
      ['up', step, icons?.up ?? '+', atMax],
      ['down', -step, icons?.down ?? '−', atMin],
    ];

    return (
      <GlassField
        label={label}
        hint={hint}
        error={error}
        required={required}
        requiredMark={requiredMark}
        orientation={orientation}
        id={id}
        className={cn(className, classNames?.field)}
        classNames={{ label: classNames?.label, note: classNames?.note }}
        style={style}
      >
        {({ id: fieldId, describedBy, invalid }) => (
          <div
            className={cn(
              'ob-input',
              'ob-num',
              size !== 'md' && `ob-input--${size}`,
              invalid && 'ob-input--invalid',
              disabled && 'ob-input--disabled',
              classNames?.well,
            )}
          >
            {prefix ? (
              <span className={cn('ob-input__affix', classNames?.prefix)} aria-hidden="true">
                {prefix}
              </span>
            ) : null}

            <input
              ref={inputRef}
              id={fieldId}
              name={name}
              className={cn('ob-input__control', 'ob-num__control', classNames?.control)}
              type="text"
              inputMode={places > 0 ? 'decimal' : 'numeric'}
              role="spinbutton"
              autoComplete="off"
              value={text}
              placeholder={placeholder}
              disabled={disabled}
              readOnly={readOnly}
              required={required}
              aria-invalid={invalid || undefined}
              aria-describedby={describedBy}
              aria-valuenow={value ?? undefined}
              aria-valuemin={min > -Infinity ? min : undefined}
              aria-valuemax={max < Infinity ? max : undefined}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={onKeyDown}
              // Editing happens on the raw number — formatting would fight
              // the caret as soon as a separator moved.
              onFocus={(e) => {
                if (format) setDraft(raw);
                onFocusProp?.(e);
              }}
              onBlur={handleBlur}
              // Only scroll the number when the field is already focused,
              // otherwise a page scroll over it would silently edit the value.
              onWheel={(e) => {
                if (!wheel || document.activeElement !== e.currentTarget) return;
                e.preventDefault();
                bump(e.deltaY < 0 ? step : -step);
              }}
              {...rest}
            />

            {suffix ? (
              <span
                className={cn('ob-input__affix', 'ob-num__suffix', classNames?.suffix)}
                aria-hidden="true"
              >
                {suffix}
              </span>
            ) : null}

            {hideSteppers ? null : (
              <span className={cn('ob-num__steppers', classNames?.steppers)}>
                {steppers.map(([dir, delta, glyph, spent]) => (
                  <button
                    key={dir}
                    type="button"
                    // The input already owns the value in the a11y tree; these
                    // are pointer affordances only.
                    tabIndex={-1}
                    aria-hidden="true"
                    disabled={disabled || readOnly || spent}
                    className={cn('ob-num__step', 'ob-reset-button', classNames?.step)}
                    onPointerDown={(e) => {
                      e.preventDefault(); // keep focus on the input
                      startRepeat(delta);
                    }}
                    onPointerUp={stopRepeat}
                    onPointerLeave={stopRepeat}
                    onPointerCancel={stopRepeat}
                  >
                    {glyph}
                  </button>
                ))}
              </span>
            )}
          </div>
        )}
      </GlassField>
    );
  },
);
