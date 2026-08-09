import { forwardRef, useId, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from 'react';
import { cn } from '../lib/cn';
import { GlassSurface } from './GlassSurface';
import './GlassInput.css';

interface FieldShellProps {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  leading?: ReactNode;
  trailing?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  /** Wrapper class. Use `inputClassName` to reach the control itself. */
  className?: string;
  inputClassName?: string;
}

export type GlassInputProps = FieldShellProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'className'>;

export type GlassTextareaProps = FieldShellProps &
  Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'className'>;

/** Wires label/hint/error to the control with generated, stable ids. */
function useFieldIds(explicitId: string | undefined, hint: ReactNode, error: ReactNode) {
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

/**
 * A text field on a glass surface, with label, hint, and error wired up for
 * accessibility. Focus lights the whole surface instead of drawing a ring.
 */
export const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(function GlassInput(
  {
    label,
    hint,
    error,
    required,
    leading,
    trailing,
    size = 'md',
    className,
    inputClassName,
    id: explicitId,
    disabled,
    ...rest
  },
  ref,
) {
  const { id, hintId, errorId, describedBy } = useFieldIds(explicitId, hint, error);

  return (
    <div className={cn('ob-field', className)}>
      {label ? (
        <label className="ob-field__label" htmlFor={id}>
          {label}
          {required ? (
            <span className="ob-field__req" aria-hidden="true">
              *
            </span>
          ) : null}
        </label>
      ) : null}

      <GlassSurface
        radius="sm"
        grain={false}
        className={cn(
          'ob-input',
          size !== 'md' && `ob-input--${size}`,
          error && 'ob-input--invalid',
          disabled && 'ob-input--disabled',
        )}
      >
        {leading ? (
          <span className="ob-input__affix" aria-hidden="true">
            {leading}
          </span>
        ) : null}
        <input
          ref={ref}
          id={id}
          className={cn('ob-input__control', inputClassName)}
          required={required}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          {...rest}
        />
        {trailing ? <span className="ob-input__affix">{trailing}</span> : null}
      </GlassSurface>

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
});

/** Multi-line sibling of {@link GlassInput}. */
export const GlassTextarea = forwardRef<HTMLTextAreaElement, GlassTextareaProps>(
  function GlassTextarea(
    { label, hint, error, required, size = 'md', className, inputClassName, id: explicitId, disabled, ...rest },
    ref,
  ) {
    const { id, hintId, errorId, describedBy } = useFieldIds(explicitId, hint, error);

    return (
      <div className={cn('ob-field', className)}>
        {label ? (
          <label className="ob-field__label" htmlFor={id}>
            {label}
            {required ? (
              <span className="ob-field__req" aria-hidden="true">
                *
              </span>
            ) : null}
          </label>
        ) : null}

        <GlassSurface
          radius="sm"
          grain={false}
          className={cn('ob-input', error && 'ob-input--invalid', disabled && 'ob-input--disabled')}
        >
          <textarea
            ref={ref}
            id={id}
            className={cn('ob-input__control', inputClassName)}
            required={required}
            disabled={disabled}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            {...rest}
          />
        </GlassSurface>

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
  },
);
