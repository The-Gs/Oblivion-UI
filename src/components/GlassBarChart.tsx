import type { ReactNode } from 'react';
import { cn } from '../lib/cn';
import './GlassBarChart.css';

export type ChartTone = 'accent' | 'success' | 'warning' | 'danger' | 'info';

export interface BarDatum {
  /** Point name shown under the bar. */
  label: ReactNode;
  value: number;
  /** Semantic tone (fallback). */
  tone?: ChartTone;
  /** Any CSS colour; overrides `tone`. */
  color?: string;
}

export interface BarSeries {
  /** One value per point (aligned to `labels`). */
  data: number[];
  /** Legend name. */
  name?: string;
  tone?: ChartTone;
  /** Any CSS colour; overrides `tone`. */
  color?: string;
}

export interface GlassBarChartProps {
  /** Single value per point. */
  data?: BarDatum[];
  /** Several values per point — rendered grouped, or `stacked`. */
  series?: BarSeries[];
  /** Point names (used with `series`). */
  labels?: string[];
  /** Stack the series instead of grouping them side by side. @default false */
  stacked?: boolean;
  /** Plot height, px. @default 180 */
  height?: number;
  /** Fixed max; defaults to the data's peak (or per-point sum when stacked). */
  max?: number;
  /** A custom colour for every bar without its own `color`. */
  color?: string;
  /** Print values on the bars. @default false */
  showValues?: boolean;
  /** Format a value label. @default String */
  formatValue?: (v: number) => string;
  /** Show a legend from the series names. Defaults to on when any series is named. */
  legend?: boolean;
  className?: string;
  'aria-label'?: string;
}

const TONE_TOKEN: Record<ChartTone, string> = {
  accent: '--ob-accent',
  success: '--ob-success',
  warning: '--ob-warning',
  danger: '--ob-danger',
  info: '--ob-info',
};
const DEFAULT_TONES: ChartTone[] = ['accent', 'success', 'info', 'warning', 'danger'];

const fillFor = (color: string | undefined, tone: ChartTone | undefined, i = 0): string =>
  color ?? `rgb(var(${TONE_TOKEN[tone ?? DEFAULT_TONES[i % DEFAULT_TONES.length]!]}) / 0.78)`;

interface Bar {
  value: number;
  fill: string;
  name?: string;
}

/** A responsive bar chart — one value per point, or several (grouped/stacked). */
export function GlassBarChart({
  data,
  series,
  labels,
  stacked = false,
  height = 180,
  max,
  color,
  showValues = false,
  formatValue = String,
  legend,
  className,
  'aria-label': ariaLabel,
}: GlassBarChartProps) {
  const useSeries = Array.isArray(series) && series.length > 0;

  const groups: { label: ReactNode; bars: Bar[] }[] = useSeries
    ? Array.from({ length: Math.max(...series!.map((s) => s.data.length)) }, (_, i) => ({
        label: labels?.[i] ?? '',
        bars: series!.map((s, si) => ({ value: s.data[i] ?? 0, fill: fillFor(s.color, s.tone, si), name: s.name })),
      }))
    : (data ?? []).map((d) => ({ label: d.label, bars: [{ value: d.value, fill: fillFor(d.color ?? color, d.tone) }] }));

  const top =
    max ??
    Math.max(
      1,
      ...groups.flatMap((g) => (stacked ? [g.bars.reduce((a, b) => a + b.value, 0)] : g.bars.map((b) => b.value))),
    );

  const showLegend = legend ?? (useSeries && series!.some((s) => s.name));

  return (
    <div className={cn('ob-bar', className)} role="img" aria-label={ariaLabel}>
      {showLegend ? (
        <div className="ob-bar__legend">
          {series!.map((s, si) => (
            <span className="ob-bar__legend-item" key={si}>
              <span className="ob-bar__legend-dot" style={{ background: fillFor(s.color, s.tone, si) }} />
              {s.name ?? `Series ${si + 1}`}
            </span>
          ))}
        </div>
      ) : null}

      <div className="ob-bar__cols" style={{ height }}>
        {groups.map((g, i) => (
          <div className="ob-bar__col" key={i}>
            <div className={cn('ob-bar__track', stacked ? 'ob-bar__track--stacked' : 'ob-bar__track--grouped')}>
              {g.bars.map((b, bi) => (
                <div
                  className="ob-bar__fill"
                  key={bi}
                  style={{ height: `${Math.max(0, Math.min(1, b.value / top)) * 100}%`, background: b.fill }}
                  title={b.name ? `${b.name}: ${formatValue(b.value)}` : undefined}
                >
                  {showValues ? <span className="ob-bar__val">{formatValue(b.value)}</span> : null}
                </div>
              ))}
            </div>
            <span className="ob-bar__label">{g.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
