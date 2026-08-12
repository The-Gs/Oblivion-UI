import { useRef, type CSSProperties, type ReactNode } from 'react';
import { cn } from '../lib/cn';
import './GlassTiltCard.css';

export interface GlassTiltCardProps {
  children?: ReactNode;
  /** Maximum tilt in degrees. @default 12 */
  max?: number;
  /** Lift the card toward the viewer on hover, px. @default 6 */
  lift?: number;
  /** Add a moving sheen highlight. @default true */
  glare?: boolean;
  className?: string;
  style?: CSSProperties;
}

/** A card that tilts in 3D toward the cursor, with an optional sheen. */
export function GlassTiltCard({ children, max = 12, lift = 6, glare = true, className, style }: GlassTiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width; // 0…1
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty('--rx', `${(0.5 - py) * 2 * max}deg`);
    el.style.setProperty('--ry', `${(px - 0.5) * 2 * max}deg`);
    el.style.setProperty('--gx', `${px * 100}%`);
    el.style.setProperty('--gy', `${py * 100}%`);
    el.style.setProperty('--tz', `${lift}px`);
    el.style.setProperty('--glare-o', '1');
  };
  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
    el.style.setProperty('--tz', '0px');
    el.style.setProperty('--glare-o', '0');
  };

  return (
    <div className={cn('ob-tilt', className)} style={style} onMouseMove={onMove} onMouseLeave={onLeave}>
      <div ref={ref} className="ob-tilt__inner">
        {glare ? <div className="ob-tilt__glare" aria-hidden="true" /> : null}
        <div className="ob-tilt__content">{children}</div>
      </div>
    </div>
  );
}
