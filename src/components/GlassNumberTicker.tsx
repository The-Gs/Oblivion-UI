import { useEffect, useRef, useState } from 'react';
import { cn } from '../lib/cn';
import './GlassNumberTicker.css';

export interface GlassNumberTickerProps {
  value: number;
  /** Animation duration, ms. @default 900 */
  duration?: number;
  /** Decimal places. @default 0 */
  decimals?: number;
  prefix?: string;
  suffix?: string;
  /** Group thousands with commas. @default true */
  grouping?: boolean;
  className?: string;
}

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/** A number that animates (counts up/down) whenever its value changes. */
export function GlassNumberTicker({
  value,
  duration = 900,
  decimals = 0,
  prefix = '',
  suffix = '',
  grouping = true,
  className,
}: GlassNumberTickerProps) {
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);
  const raf = useRef<number | undefined>(undefined);

  useEffect(() => {
    const from = fromRef.current;
    const to = value;
    if (from === to) return;
    const reduce = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setDisplay(to);
      fromRef.current = to;
      return;
    }
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setDisplay(from + (to - from) * easeOut(t));
      if (t < 1) raf.current = requestAnimationFrame(tick);
      else fromRef.current = to;
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      fromRef.current = value;
    };
  }, [value, duration]);

  const text =
    prefix +
    display.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
      useGrouping: grouping,
    }) +
    suffix;

  return <span className={cn('ob-ticker', className)}>{text}</span>;
}
