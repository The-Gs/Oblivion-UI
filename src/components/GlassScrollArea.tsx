import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';
import './GlassScrollArea.css';

export interface GlassScrollAreaProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  /** Scroll axis. @default 'vertical' */
  axis?: 'vertical' | 'horizontal' | 'both';
  /** Cap the box so it scrolls (e.g. 240 or '40vh'). */
  maxHeight?: number | string;
  maxWidth?: number | string;
  /** Soft fade at the scrollable edges. @default true */
  fade?: boolean;
}

/** A styled overflow container with a slim, themed scrollbar. */
export function GlassScrollArea({
  children,
  axis = 'vertical',
  maxHeight,
  maxWidth,
  fade = true,
  className,
  style,
  ...rest
}: GlassScrollAreaProps) {
  const s: CSSProperties = {
    maxHeight,
    maxWidth,
    overflowX: axis === 'horizontal' || axis === 'both' ? 'auto' : 'hidden',
    overflowY: axis === 'vertical' || axis === 'both' ? 'auto' : 'hidden',
    ...style,
  };
  return (
    <div className={cn('ob-scroll', fade && 'ob-scroll--fade', className)} style={s} {...rest}>
      {children}
    </div>
  );
}
