import type { ReactNode } from 'react';
import { cn } from '../lib/cn';
import './GlassGauge.css';

export type GaugeTone = 'accent' | 'success' | 'warning' | 'danger';

export interface GlassGaugeProps {
  value: number;
  /** @default 100 */
  max?: number;
  /** Diameter, px. @default 140 */
  size?: number;
  /** Arc thickness, px. @default 12 */
  thickness?: number;
  tone?: GaugeTone;
  /** Auto-tone by fraction: `{ 0.9: 'danger', 0.7: 'warning' }`. */
  thresholds?: Partial<Record<number, GaugeTone>>;
  /** Sweep angle of the dial, degrees. @default 270 */
  sweep?: number;
  label?: ReactNode;
  /** Show the value in the centre. @default true */
  showValue?: boolean;
  className?: string;
}

const TONE: Record<GaugeTone, string> = {
  accent: 'var(--ob-accent)',
  success: 'var(--ob-success)',
  warning: 'var(--ob-warning)',
  danger: 'var(--ob-danger)',
};

/** A radial gauge/dial for a single KPI, drawn in SVG with an open sweep. */
export function GlassGauge({
  value,
  max = 100,
  size = 140,
  thickness = 12,
  tone = 'accent',
  thresholds,
  sweep = 270,
  label,
  showValue = true,
  className,
}: GlassGaugeProps) {
  const frac = Math.min(1, Math.max(0, max === 0 ? 0 : value / max));
  let resolved = tone;
  if (thresholds) {
    const hit = Object.keys(thresholds).map(Number).filter((t) => frac >= t).sort((a, b) => b - a)[0];
    if (hit != null) resolved = thresholds[hit]!;
  }

  const c = size / 2;
  const r = c - thickness / 2;
  const circ = 2 * Math.PI * r;
  const arc = (sweep / 360) * circ; // visible track length
  const rotation = 90 + (360 - sweep) / 2; // centre the gap at the bottom

  return (
    <div className={cn('ob-gauge', className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <g transform={`rotate(${rotation} ${c} ${c})`}>
          <circle cx={c} cy={c} r={r} fill="none" strokeWidth={thickness} strokeLinecap="round"
            className="ob-gauge__track" strokeDasharray={`${arc} ${circ}`} />
          <circle cx={c} cy={c} r={r} fill="none" strokeWidth={thickness} strokeLinecap="round"
            stroke={`rgb(${TONE[resolved]})`} className="ob-gauge__arc"
            strokeDasharray={`${arc * frac} ${circ}`} />
        </g>
      </svg>
      <div className="ob-gauge__center">
        {showValue ? <span className="ob-gauge__value">{Math.round(frac * 100)}%</span> : null}
        {label ? <span className="ob-gauge__label">{label}</span> : null}
      </div>
    </div>
  );
}
