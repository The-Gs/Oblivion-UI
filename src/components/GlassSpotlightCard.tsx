import { useRef, type CSSProperties, type ReactNode } from 'react';
import { cn } from '../lib/cn';
import './GlassSpotlightCard.css';

export interface GlassSpotlightCardProps {
  children?: ReactNode;
  /** Radius of the glow, px. @default 240 */
  radius?: number;
  className?: string;
  style?: CSSProperties;
}

/** A card with an accent glow that follows the cursor. */
export function GlassSpotlightCard({ children, radius = 240, className, style }: GlassSpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--spot-x', `${e.clientX - r.left}px`);
    el.style.setProperty('--spot-y', `${e.clientY - r.top}px`);
    el.style.setProperty('--spot-o', '1');
  };
  const onLeave = () => ref.current?.style.setProperty('--spot-o', '0');

  return (
    <div
      ref={ref}
      className={cn('ob-spot', className)}
      style={{ ['--spot-r' as string]: `${radius}px`, ...style }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <div className="ob-spot__glow" aria-hidden="true" />
      <div className="ob-spot__content">{children}</div>
    </div>
  );
}
