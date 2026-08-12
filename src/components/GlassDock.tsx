import { useRef, useState, type ReactNode } from 'react';
import { cn } from '../lib/cn';
import './GlassDock.css';

export interface DockItem {
  id: string;
  icon: ReactNode;
  label?: string;
  active?: boolean;
  onClick?: () => void;
}

export interface GlassDockProps {
  items: DockItem[];
  /** Peak magnification of the hovered icon. @default 1.6 */
  magnification?: number;
  /** How far the magnification falls off, px. @default 90 */
  falloff?: number;
  className?: string;
}

/** A macOS-style dock: icons swell toward the cursor and settle when it leaves. */
export function GlassDock({ items, magnification = 1.6, falloff = 90, className }: GlassDockProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [mouseX, setMouseX] = useState<number | null>(null);

  const scaleFor = (el: HTMLElement | null) => {
    if (mouseX === null || !el) return 1;
    const rect = el.getBoundingClientRect();
    const center = rect.left + rect.width / 2;
    const dist = Math.abs(mouseX - center);
    if (dist > falloff) return 1;
    // Eased falloff: peak at the cursor, back to 1 at the edge of the field.
    const t = 1 - dist / falloff; // 1 at cursor → 0 at falloff
    return 1 + (magnification - 1) * Math.sin((t * Math.PI) / 2);
  };

  return (
    <div
      ref={ref}
      className={cn('ob-dock', className)}
      onMouseMove={(e) => setMouseX(e.clientX)}
      onMouseLeave={() => setMouseX(null)}
    >
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          className={cn('ob-dock__item', item.active && 'ob-dock__item--active')}
          title={item.label}
          aria-label={item.label}
          onClick={item.onClick}
          ref={(el) => {
            if (el) el.style.setProperty('--dock-scale', String(scaleFor(el)));
          }}
        >
          <span className="ob-dock__icon">{item.icon}</span>
          {item.label ? <span className="ob-dock__tip">{item.label}</span> : null}
          {item.active ? <span className="ob-dock__dot" aria-hidden="true" /> : null}
        </button>
      ))}
    </div>
  );
}
