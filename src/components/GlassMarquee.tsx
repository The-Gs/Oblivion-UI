import type { ReactNode } from 'react';
import { cn } from '../lib/cn';
import './GlassMarquee.css';

export interface GlassMarqueeProps {
  children: ReactNode;
  /** Seconds for one full pass. @default 18 */
  speed?: number;
  /** @default 'left' */
  direction?: 'left' | 'right';
  /** Pause while hovered. @default true */
  pauseOnHover?: boolean;
  /** Fade the edges. @default true */
  fade?: boolean;
  /** Gap between the repeated copies, px. @default 48 */
  gap?: number;
  className?: string;
}

/** A seamless scrolling strip — logos, tags, a ticker. Duplicated for the loop. */
export function GlassMarquee({
  children,
  speed = 18,
  direction = 'left',
  pauseOnHover = true,
  fade = true,
  gap = 48,
  className,
}: GlassMarqueeProps) {
  return (
    <div
      className={cn('ob-marquee', fade && 'ob-marquee--fade', pauseOnHover && 'ob-marquee--pause', className)}
      style={{ ['--mq-dur' as string]: `${speed}s`, ['--mq-gap' as string]: `${gap}px`, ['--mq-dir' as string]: direction === 'left' ? 'normal' : 'reverse' }}
    >
      <div className="ob-marquee__track">
        <div className="ob-marquee__group">{children}</div>
        <div className="ob-marquee__group" aria-hidden="true">{children}</div>
      </div>
    </div>
  );
}
