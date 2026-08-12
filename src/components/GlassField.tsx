import { useId, type CSSProperties, type ReactNode } from 'react';
import { cn } from '../lib/cn';
import './GlassInput.css';

/** The ids a field hands to whatever control it wraps. */
export interface FieldIds {
  /** Put this on the control, and on the label's `htmlFor`. */
  id: string;
  hintId?: string;
  errorId?: string;
  /** Pass to `aria-describedby`. Error wins over hint when both exist. */
  describedBy?: string;
}

export interface FieldRenderArgs extends FieldIds {
  invalid: boolean;
}

/** Class names for each part of the field shell. */
export interface FieldSlotClasses {
  label?: string;
  /** The hint or error paragraph under the control. */
  note?: string;
}

/**
 * Wires label/hint/error to a control with generated, stable ids.
 *
 * Shared by every field in the kit so the id contract is written once.
 */
export function useFieldIds(
  explicitId: string | undefined,
  hint: ReactNode,
  error: ReactNode,
): FieldIds {
  const auto = useId();
  const id = explicitId ?? auto;
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  return {
    id,
    hintId,
    errorId,
    // Error wins: when both exist, screen readers should hear the failure.
    describedBy: errorId ?? hintId,
  };
}

export function FieldLabel({
  id,
  label,
  required,
  requiredMark = '*',
  className,
}: {
  id: string;
  label: ReactNode;
  required?: boolean;
  /** Marker appended when `required`. Pass `null` to drop it. @default '*' */
  requiredMark?: ReactNode;
  className?: string;
}) {
  return (
    <label className={cn('ob-field__label', className)} htmlFor={id}>
      {label}
      {required && requiredMark !== null ? (
        <span className="ob-field__req" aria-hidden="true">
          {requiredMark}
        </span>
      ) : null}
    </label>
  );
}

export function FieldNote({
  error,
  hint,
  errorId,
  hintId,
  className,
}: {
  error: ReactNode;
  hint: ReactNode;
  errorId?: string;
  hintId?: string;
  className?: string;
}) {
  if (error) {
    return (
      <p
        id={errorId}
        className={cn('ob-field__note', 'ob-field__note--error', className)}
        role="alert"
      >
        {error}
      </p>
    );
  }
  if (hint) {
    return (
      <p id={hintId} className={cn('ob-field__note', className)}>
        {hint}
      </p>
    );
  }
  return null;
}

export interface GlassFieldProps {
  label?: ReactNode;
  hint?: ReactNode;
  /** Truthy switches the field to its invalid styling and announces via `role="alert"`. */
  error?: ReactNode;
  required?: boolean;
  /** Marker appended to the label when `required`. Pass `null` to drop it. @default '*' */
  requiredMark?: ReactNode;
  /**
   * `horizontal` puts the label in a column beside the control instead of
   * above it. Size the column with `--ob-field-label-w`. @default 'vertical'
   */
  orientation?: 'vertical' | 'horizontal';
  /** Set on the control instead of the generated one. */
  id?: string;
  className?: string;
  /** Reach the label and note without a wrapper selector. */
  classNames?: FieldSlotClasses;
  style?: CSSProperties;
  /**
   * The control. Pass a function to receive the generated ids — the usual
   * case, since the control needs `id` and `aria-describedby`.
   */
  children: ReactNode | ((args: FieldRenderArgs) => ReactNode);
}

/**
 * The label + control + note shell every field in the kit wears.
 *
 * Use it to give your own control the same label, hint, error and a11y
 * wiring as `GlassInput` without reimplementing any of it:
 *
 * ```tsx
 * <GlassField label="Webhook" hint="POSTed on every render." >
 *   {({ id, describedBy }) => <input id={id} aria-describedby={describedBy} />}
 * </GlassField>
 * ```
 */
export function GlassField({
  label,
  hint,
  error,
  required,
  requiredMark,
  orientation = 'vertical',
  id: explicitId,
  className,
  classNames,
  style,
  children,
}: GlassFieldProps) {
  const ids = useFieldIds(explicitId, hint, error);

  return (
    <div
      className={cn(
        'ob-field',
        orientation === 'horizontal' && 'ob-field--row',
        error && 'ob-field--invalid',
        className,
      )}
      style={style}
    >
      {label ? (
        <FieldLabel
          id={ids.id}
          label={label}
          required={required}
          requiredMark={requiredMark}
          className={classNames?.label}
        />
      ) : null}
      {typeof children === 'function' ? children({ ...ids, invalid: Boolean(error) }) : children}
      <FieldNote
        error={error}
        hint={hint}
        errorId={ids.errorId}
        hintId={ids.hintId}
        className={classNames?.note}
      />
    </div>
  );
}
