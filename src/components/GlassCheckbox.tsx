import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';
import './controls.css';

export interface GlassCheckboxProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'value'> {
  checked: boolean;
  onChange: (checked: boolean) => void;
  children?: ReactNode;
}

/**
 * A checkbox with an inline label. Controlled.
 *
 * The whole control is one button, so the label is part of the hit target
 * without needing a `for`/`id` pair.
 */
export function GlassCheckbox({
  checked,
  onChange,
  children,
  className,
  disabled,
  ...rest
}: GlassCheckboxProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      disabled={disabled}
      className={cn('ob-check', 'ob-reset-button', className)}
      onClick={() => onChange(!checked)}
      {...rest}
    >
      <span className="ob-check__box" aria-hidden="true">
        {checked ? '✓' : ''}
      </span>
      {children}
    </button>
  );
}
