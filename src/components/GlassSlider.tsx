import { useCallback, useRef, useState, type PointerEvent, type ReactNode } from 'react';
import { cn } from '../lib/cn';
import './controls.css';

export interface GlassSliderProps {
  value: number;
  onChange: (value: number) => void;
  /** @default 0 */
  min?: number;
  /** @default 100 */
  max?: number;
  /** @default 1 */
  step?: number;
  /** Label above the rail. */
  label?: ReactNode;
  /** Readout on the right. Pass `null` to hide it. Defaults to the value. */
  format?: ((value: number) => ReactNode) | null;
  disabled?: boolean;
  className?: string;
  'aria-label'?: string;
}

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

/**
 * A draggable slider. Controlled.
 *
 * Pointer drag uses capture so tracking survives the cursor leaving the rail.
 * Arrow keys step, Home/End jump to the ends, PageUp/PageDown move by ten
 * steps — the standard slider keyboard contract.
 */
export function GlassSlider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  format,
  disabled = false,
  className,
  'aria-label': ariaLabel,
}: GlassSliderProps) {
  const railRef = useRef<HTMLDivElement>(null);
  // Transitions look right for keyboard steps but lag the cursor during a
  // drag, so they're switched off for the duration of the gesture.
  const [dragging, setDragging] = useState(false);

  const pct = max === min ? 0 : ((clamp(value, min, max) - min) / (max - min)) * 100;

  const commit = useCallback(
    (clientX: number) => {
      const rail = railRef.current;
      if (!rail) return;
      const r = rail.getBoundingClientRect();
      if (r.width === 0) return;
      const raw = min + ((clientX - r.left) / r.width) * (max - min);
      const snapped = Math.round(raw / step) * step;
      // Re-derive decimals from the step so 0.1-style steps don't accumulate
      // float noise into the emitted value.
      const decimals = (String(step).split('.')[1] ?? '').length;
      onChange(Number(clamp(snapped, min, max).toFixed(decimals)));
    },
    [min, max, step, onChange],
  );

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (disabled) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    commit(e.clientX);
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    commit(e.clientX);
  };

  const endDrag = (e: PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    setDragging(false);
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    const big = step * 10;
    const next = {
      ArrowRight: value + step,
      ArrowUp: value + step,
      ArrowLeft: value - step,
      ArrowDown: value - step,
      PageUp: value + big,
      PageDown: value - big,
      Home: min,
      End: max,
    }[e.key];

    if (next === undefined) return;
    e.preventDefault();
    onChange(clamp(next, min, max));
  };

  const readout = format === null ? null : format ? format(value) : `${value}%`;

  return (
    <div className={cn('ob-slider', disabled && 'ob-slider--disabled', className)}>
      {label || readout !== null ? (
        <div className="ob-slider__head">
          {label ? <span className="ob-slider__label">{label}</span> : <span />}
          {readout !== null ? <span className="ob-slider__value">{readout}</span> : null}
        </div>
      ) : null}

      <div
        ref={railRef}
        role="slider"
        tabIndex={disabled ? -1 : 0}
        aria-valuenow={value}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-label={ariaLabel}
        aria-disabled={disabled || undefined}
        className={cn('ob-slider__rail', !dragging && 'ob-slider--animated')}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onKeyDown={onKeyDown}
      >
        <div className="ob-slider__track" />
        <div className="ob-slider__fill" style={{ width: `${pct}%` }} />
        <div className="ob-slider__knob" style={{ left: `calc(${pct}% - 10px)` }} />
      </div>
    </div>
  );
}
