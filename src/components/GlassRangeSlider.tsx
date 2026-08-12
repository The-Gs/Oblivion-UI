import { useCallback, useRef, useState, type PointerEvent, type ReactNode } from 'react';
import { cn } from '../lib/cn';
import { useControllableState } from '../lib/hooks';
import './GlassRangeSlider.css';

export type RangeValue = [number, number];

export interface GlassRangeSliderProps {
  value?: RangeValue;
  defaultValue?: RangeValue;
  onChange?: (value: RangeValue) => void;
  /** @default 0 */
  min?: number;
  /** @default 100 */
  max?: number;
  /** @default 1 */
  step?: number;
  label?: ReactNode;
  /** Readout on the right. Pass `null` to hide. */
  format?: ((value: RangeValue) => ReactNode) | null;
  disabled?: boolean;
  className?: string;
  'aria-label'?: string;
}

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

/** A dual-handle slider that selects a `[low, high]` range. Controllable. */
export function GlassRangeSlider({
  value,
  defaultValue,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  format,
  disabled = false,
  className,
  'aria-label': ariaLabel,
}: GlassRangeSliderProps) {
  const [range, setRange] = useControllableState<RangeValue>(
    value,
    defaultValue ?? [min, max],
    onChange,
  );
  const railRef = useRef<HTMLDivElement>(null);
  const active = useRef<0 | 1 | null>(null);
  const [dragging, setDragging] = useState(false);

  const [lo, hi] = range;
  const span = max - min || 1;
  const loPct = ((clamp(lo, min, max) - min) / span) * 100;
  const hiPct = ((clamp(hi, min, max) - min) / span) * 100;

  const snap = useCallback(
    (raw: number) => {
      const snapped = Math.round(raw / step) * step;
      const decimals = (String(step).split('.')[1] ?? '').length;
      return Number(clamp(snapped, min, max).toFixed(decimals));
    },
    [min, max, step],
  );

  const setThumb = useCallback(
    (which: 0 | 1, next: number) => {
      const v: RangeValue = which === 0 ? [Math.min(next, hi), hi] : [lo, Math.max(next, lo)];
      setRange(v);
    },
    [lo, hi, setRange],
  );

  const commit = useCallback(
    (clientX: number, which?: 0 | 1) => {
      const rail = railRef.current;
      if (!rail) return;
      const r = rail.getBoundingClientRect();
      if (r.width === 0) return;
      const raw = min + ((clientX - r.left) / r.width) * span;
      const val = snap(raw);
      // On a track press, drive whichever thumb is nearer.
      const target = which ?? (Math.abs(val - lo) <= Math.abs(val - hi) ? 0 : 1);
      active.current = target;
      setThumb(target, val);
    },
    [min, span, snap, lo, hi, setThumb],
  );

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (disabled) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    commit(e.clientX);
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!dragging || active.current === null) return;
    commit(e.clientX, active.current);
  };
  const endDrag = (e: PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    setDragging(false);
    active.current = null;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const keyFor = (which: 0 | 1) => (e: React.KeyboardEvent) => {
    if (disabled) return;
    const cur = range[which];
    const big = step * 10;
    const next = {
      ArrowRight: cur + step,
      ArrowUp: cur + step,
      ArrowLeft: cur - step,
      ArrowDown: cur - step,
      PageUp: cur + big,
      PageDown: cur - big,
      Home: min,
      End: max,
    }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    setThumb(which, clamp(next, min, max));
  };

  const readout = format === null ? null : format ? format(range) : `${lo} – ${hi}`;

  return (
    <div className={cn('ob-range', disabled && 'ob-range--disabled', className)}>
      {label || readout !== null ? (
        <div className="ob-range__head">
          {label ? <span className="ob-range__label">{label}</span> : <span />}
          {readout !== null ? <span className="ob-range__value">{readout}</span> : null}
        </div>
      ) : null}

      <div
        ref={railRef}
        className={cn('ob-range__rail', !dragging && 'ob-range--animated')}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <div className="ob-range__track" />
        <div className="ob-range__fill" style={{ left: `${loPct}%`, width: `${hiPct - loPct}%` }} />
        {[0, 1].map((i) => {
          const which = i as 0 | 1;
          const pct = which === 0 ? loPct : hiPct;
          return (
            <div
              key={i}
              role="slider"
              tabIndex={disabled ? -1 : 0}
              aria-label={`${ariaLabel ?? 'Range'} ${which === 0 ? 'minimum' : 'maximum'}`}
              aria-valuenow={range[which]}
              aria-valuemin={which === 0 ? min : lo}
              aria-valuemax={which === 0 ? hi : max}
              aria-disabled={disabled || undefined}
              className="ob-range__knob"
              style={{ left: `calc(${pct}% - 10px)` }}
              onKeyDown={keyFor(which)}
              onPointerDown={(e) => {
                e.stopPropagation();
                if (disabled) return;
                e.currentTarget.parentElement?.setPointerCapture?.(e.pointerId);
                active.current = which;
                setDragging(true);
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
