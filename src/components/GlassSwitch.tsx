import type { ButtonHTMLAttributes } from 'react';
import { cn } from '../lib/cn';
import './controls.css';

export interface GlassSwitchProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'value'> {
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Required unless the switch is labelled by a visible element via
   *  `aria-labelledby` — there is no text inside the control. */
  'aria-label'?: string;
}

/**
 * A binary toggle. Controlled: hold the value yourself and update it in
 * `onChange`.
 *
 * Rendered as `role="switch"`, so assistive tech announces it as a toggle
 * rather than as a checkbox or a plain button.
 */
export function GlassSwitch({
  checked,
  onChange,
  className,
  disabled,
  ...rest
}: GlassSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      className={cn('ob-switch', 'ob-focusable', className)}
      onClick={() => onChange(!checked)}
      {...rest}
    >
      <span className="ob-switch__knob" />
    </button>
  );
}
