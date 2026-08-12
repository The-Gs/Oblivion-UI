import { cn } from '../lib/cn';
import './GlassLineChart.css';

export type LineTone = 'accent' | 'success' | 'warning' | 'danger' | 'info';

export interface LineSeries {
  data: number[];
  /** Semantic tone (fallback). */
  tone?: LineTone;
  /** Any CSS colour; overrides `tone`. */
  color?: string;
  name?: string;
}

export interface GlassLineChartProps {
  /** One series (number[]) or several. */
  series: number[] | LineSeries[];
  /** X-axis point names, aligned to the points. */
  labels?: string[];
  /** A custom colour applied when `series` is a bare number[]. */
  color?: string;
  /** Intrinsic height in SVG units; scales responsively. @default 160 */
  height?: number;
  /** Fill the area under each line. @default false */
  area?: boolean;
  /** Horizontal grid lines. @default true */
  grid?: boolean;
  /** Dots on each point. @default false */
  dots?: boolean;
  /** Print each point's value above it. @default false */
  showValues?: boolean;
  /** Format a value label. @default String */
  formatValue?: (v: number) => string;
  /** Show a legend from the series names. Defaults to on when any series is named. */
  legend?: boolean;
  className?: string;
  'aria-label'?: string;
}

const TONE: Record<LineTone, string> = {
  accent: 'var(--ob-accent)',
  success: 'var(--ob-success)',
  warning: 'var(--ob-warning)',
  danger: 'var(--ob-danger)',
  info: 'var(--ob-info)',
};

/** A responsive SVG line/area chart supporting one or more series. */
export function GlassLineChart({
  series,
  labels,
  color,
  height = 160,
  area = false,
  grid = true,
  dots = false,
  showValues = false,
  formatValue = String,
  legend,
  className,
  'aria-label': ariaLabel,
}: GlassLineChartProps) {
  const list: LineSeries[] =
    typeof series[0] === 'object'
      ? (series as LineSeries[])
      : [{ data: series as number[], color }];

  const strokeOf = (s: LineSeries, si: number) =>
    s.color ?? `rgb(${TONE[s.tone ?? (['accent', 'success', 'info', 'warning', 'danger'][si % 5] as LineTone)]})`;
  const showLegend = legend ?? list.some((s) => s.name);

  const width = 320;
  const padX = 6;
  const padY = 10;
  const all = list.flatMap((s) => s.data);
  const min = Math.min(...all);
  const max = Math.max(...all);
  const span = max - min || 1;
  const n = Math.max(...list.map((s) => s.data.length));
  const x = (i: number) => (n <= 1 ? padX : padX + (i / (n - 1)) * (width - padX * 2));
  const y = (v: number) => padY + (1 - (v - min) / span) * (height - padY * 2);

  const gridLines = grid ? [0.25, 0.5, 0.75].map((g) => padY + g * (height - padY * 2)) : [];

  return (
    <div className={cn('ob-linechart', className)}>
      {showLegend ? (
        <div className="ob-line__legend">
          {list.map((s, si) => (
            <span className="ob-line__legend-item" key={si}>
              <span className="ob-line__legend-dot" style={{ background: strokeOf(s, si) }} />
              {s.name ?? `Series ${si + 1}`}
            </span>
          ))}
        </div>
      ) : null}
      <svg className="ob-line" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={ariaLabel}>
        {gridLines.map((gy, i) => (
          <line key={i} className="ob-line__grid" x1={padX} x2={width - padX} y1={gy} y2={gy} />
        ))}
        {list.map((s, si) => {
          // Custom colour wins; otherwise fall back to a semantic tone token.
          const stroke = strokeOf(s, si);
          const pts = s.data.map((v, i) => `${x(i)},${y(v)}`).join(' ');
        return (
          <g key={si}>
            {area ? (
              <polygon className="ob-line__area" points={`${x(0)},${height - padY} ${pts} ${x(s.data.length - 1)},${height - padY}`} fill={stroke} />
            ) : null}
            <polyline className="ob-line__path" points={pts} fill="none" stroke={stroke} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
            {dots || showValues
              ? s.data.map((v, i) => (
                  <g key={i}>
                    {dots ? <circle cx={x(i)} cy={y(v)} r={2.5} fill={stroke} /> : null}
                    {showValues ? (
                      <text className="ob-line__value" x={x(i)} y={y(v) - 6} textAnchor="middle">
                        {formatValue(v)}
                      </text>
                    ) : null}
                  </g>
                ))
              : null}
          </g>
        );
      })}
        {labels ? (
          <g>
            {labels.map((lab, i) => (
              <text key={i} className="ob-line__label" x={x(i)} y={height - 1} textAnchor="middle">
                {lab}
              </text>
            ))}
          </g>
        ) : null}
      </svg>
    </div>
  );
}
