import { cn } from '../lib/cn';
import './GlassSparkline.css';

export type SparkTone = 'accent' | 'success' | 'warning' | 'danger';

export interface GlassSparklineProps {
  data: number[];
  /** @default 120 */
  width?: number;
  /** @default 32 */
  height?: number;
  tone?: SparkTone;
  /** Fill the area under the line. @default true */
  area?: boolean;
  /** Dot on the last point. @default true */
  marker?: boolean;
  className?: string;
  'aria-label'?: string;
}

const TONE: Record<SparkTone, string> = {
  accent: 'var(--ob-accent)',
  success: 'var(--ob-success)',
  warning: 'var(--ob-warning)',
  danger: 'var(--ob-danger)',
};

/** A tiny inline SVG line chart to drop into stat tiles and rows. */
export function GlassSparkline({
  data,
  width = 120,
  height = 32,
  tone = 'accent',
  area = true,
  marker = true,
  className,
  'aria-label': ariaLabel,
}: GlassSparklineProps) {
  const pad = 3;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const n = data.length;
  const x = (i: number) => (n <= 1 ? pad : pad + (i / (n - 1)) * (width - pad * 2));
  const y = (v: number) => height - pad - ((v - min) / span) * (height - pad * 2);

  const pts = data.map((v, i) => `${x(i)},${y(v)}`).join(' ');
  const last = data[n - 1] ?? 0;
  const color = `rgb(${TONE[tone]})`;

  return (
    <svg
      className={cn('ob-spark', className)}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={ariaLabel}
      style={{ ['--spark' as string]: TONE[tone] }}
    >
      {area && n > 1 ? (
        <polygon
          className="ob-spark__area"
          points={`${x(0)},${height} ${pts} ${x(n - 1)},${height}`}
          fill={color}
        />
      ) : null}
      <polyline className="ob-spark__line" points={pts} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
      {marker && n > 0 ? <circle className="ob-spark__dot" cx={x(n - 1)} cy={y(last)} r={2.6} fill={color} /> : null}
    </svg>
  );
}
