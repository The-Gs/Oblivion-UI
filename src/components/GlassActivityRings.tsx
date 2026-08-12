import { cn } from '../lib/cn';
import './GlassActivityRings.css';

export type RingTone = 'accent' | 'success' | 'warning' | 'danger' | 'info';

export interface Ring {
  /** Fraction filled, 0…1 (values > 1 wrap visually via the cap). */
  value: number;
  tone?: RingTone;
  label?: string;
}

export interface GlassActivityRingsProps {
  rings: Ring[];
  /** Outer diameter, px. @default 132 */
  size?: number;
  /** Ring thickness, px. @default 12 */
  thickness?: number;
  /** Gap between rings, px. @default 4 */
  gap?: number;
  /** Centre content (e.g. a number). */
  children?: React.ReactNode;
  className?: string;
}

const TONE_VAR: Record<RingTone, string> = {
  accent: 'var(--ob-accent)',
  success: 'var(--ob-success)',
  warning: 'var(--ob-warning)',
  danger: 'var(--ob-danger)',
  info: 'var(--ob-info)',
};
const DEFAULT_TONES: RingTone[] = ['accent', 'success', 'warning', 'info', 'danger'];

/** Apple-Watch-style concentric progress rings, drawn in SVG. */
export function GlassActivityRings({
  rings,
  size = 132,
  thickness = 12,
  gap = 4,
  children,
  className,
}: GlassActivityRingsProps) {
  const c = size / 2;
  return (
    <div className={cn('ob-rings', className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="ob-rings__svg">
        {rings.map((ring, i) => {
          const r = c - thickness / 2 - i * (thickness + gap);
          if (r <= 0) return null;
          const circ = 2 * Math.PI * r;
          const tone = TONE_VAR[ring.tone ?? DEFAULT_TONES[i % DEFAULT_TONES.length]!];
          const frac = Math.min(1, Math.max(0, ring.value));
          return (
            <g key={i}>
              <circle cx={c} cy={c} r={r} fill="none" strokeWidth={thickness} className="ob-rings__track" />
              <circle
                cx={c}
                cy={c}
                r={r}
                fill="none"
                strokeWidth={thickness}
                strokeLinecap="round"
                stroke={`rgb(${tone})`}
                strokeDasharray={circ}
                strokeDashoffset={circ * (1 - frac)}
                className="ob-rings__arc"
                transform={`rotate(-90 ${c} ${c})`}
              >
                {ring.label ? <title>{`${ring.label}: ${Math.round(frac * 100)}%`}</title> : null}
              </circle>
            </g>
          );
        })}
      </svg>
      {children ? <div className="ob-rings__center">{children}</div> : null}
    </div>
  );
}
