import { useCallback, useEffect, useRef, useState, type PointerEvent } from 'react';
import { cn } from '../lib/cn';
import './GlassColorPicker.css';

export interface GlassColorPickerProps {
  /** Current colour as hex (`#rrggbb`) or `rgba()` when alpha is used. */
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Show the opacity slider and emit `rgba()`. @default false */
  alpha?: boolean;
  className?: string;
  'aria-label'?: string;
}

type HSV = { h: number; s: number; v: number };

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

function hexToRgb(hex: string): [number, number, number] {
  let h = hex.replace('#', '').trim();
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const n = parseInt(h, 16);
  if (Number.isNaN(n) || h.length !== 6) return [179, 31, 51];
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function rgbToHex(r: number, g: number, b: number): string {
  const to = (v: number) => Math.round(v).toString(16).padStart(2, '0');
  return `#${to(r)}${to(g)}${to(b)}`;
}
function rgbToHsv(r: number, g: number, b: number): HSV {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  return { h, s: max === 0 ? 0 : d / max, v: max };
}
function hsvToRgb({ h, s, v }: HSV): [number, number, number] {
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  const [r, g, b] = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
  return [(r + m) * 255, (g + m) * 255, (b + m) * 255];
}

/** A hue/saturation/value colour picker — no dependencies, pointer-driven. */
export function GlassColorPicker({
  value,
  defaultValue = '#b31f33',
  onChange,
  alpha = false,
  className,
  'aria-label': ariaLabel = 'Color picker',
}: GlassColorPickerProps) {
  const seed = value ?? defaultValue;
  const [hsv, setHsv] = useState<HSV>(() => rgbToHsv(...hexToRgb(seed)));
  const [a, setA] = useState(1);
  const svRef = useRef<HTMLDivElement>(null);
  const dragging = useRef<'sv' | 'hue' | 'alpha' | null>(null);

  const [r, g, b] = hsvToRgb(hsv);
  const hex = rgbToHex(r, g, b);
  const out = alpha && a < 1 ? `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${a.toFixed(2)})` : hex;

  // Reflect controlled hex changes back into HSV (skip while dragging).
  useEffect(() => {
    if (value && !dragging.current) setHsv(rgbToHsv(...hexToRgb(value)));
  }, [value]);

  const emit = useCallback(
    (next: HSV, alphaNext = a) => {
      setHsv(next);
      const [nr, ng, nb] = hsvToRgb(next);
      const hx = rgbToHex(nr, ng, nb);
      onChange?.(alpha && alphaNext < 1 ? `rgba(${Math.round(nr)}, ${Math.round(ng)}, ${Math.round(nb)}, ${alphaNext.toFixed(2)})` : hx);
    },
    [a, alpha, onChange],
  );

  const onSvMove = (clientX: number, clientY: number) => {
    const el = svRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const s = clamp01((clientX - rect.left) / rect.width);
    const v = 1 - clamp01((clientY - rect.top) / rect.height);
    emit({ ...hsv, s, v });
  };

  const svDown = (e: PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragging.current = 'sv';
    onSvMove(e.clientX, e.clientY);
  };
  const svMove = (e: PointerEvent<HTMLDivElement>) => {
    if (dragging.current === 'sv') onSvMove(e.clientX, e.clientY);
  };
  const svUp = (e: PointerEvent<HTMLDivElement>) => {
    dragging.current = null;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const hueBg = `linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)`;

  return (
    <div className={cn('ob-cp', className)} aria-label={ariaLabel}>
      <div
        ref={svRef}
        className="ob-cp__sv"
        style={{ backgroundColor: `hsl(${hsv.h} 100% 50%)` }}
        onPointerDown={svDown}
        onPointerMove={svMove}
        onPointerUp={svUp}
        onPointerCancel={svUp}
      >
        <div className="ob-cp__sv-white" />
        <div className="ob-cp__sv-black" />
        <div
          className="ob-cp__sv-knob"
          style={{ left: `${hsv.s * 100}%`, top: `${(1 - hsv.v) * 100}%`, background: hex }}
        />
      </div>

      <div className="ob-cp__sliders">
        <input
          className="ob-cp__hue"
          type="range"
          min={0}
          max={360}
          value={Math.round(hsv.h)}
          style={{ background: hueBg }}
          aria-label="Hue"
          onChange={(e) => emit({ ...hsv, h: Number(e.target.value) })}
        />
        {alpha ? (
          <input
            className="ob-cp__alpha"
            type="range"
            min={0}
            max={100}
            value={Math.round(a * 100)}
            style={{ ['--cp-solid' as string]: hex }}
            aria-label="Opacity"
            onChange={(e) => {
              const av = Number(e.target.value) / 100;
              setA(av);
              emit(hsv, av);
            }}
          />
        ) : null}
      </div>

      <div className="ob-cp__row">
        <span className="ob-cp__preview" style={{ background: out }} />
        <input
          className="ob-cp__hex"
          value={out}
          spellCheck={false}
          aria-label="Colour value"
          onChange={(e) => {
            const v = e.target.value.trim();
            if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(v)) emit(rgbToHsv(...hexToRgb(v)));
          }}
        />
      </div>
    </div>
  );
}
