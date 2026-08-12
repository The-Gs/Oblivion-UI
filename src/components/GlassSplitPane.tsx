import { useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from 'react';
import { cn } from '../lib/cn';
import { useControllableState } from '../lib/hooks';
import './GlassSplitPane.css';

export interface GlassSplitPaneProps {
  /** Exactly two children — the two panes. */
  children: [ReactNode, ReactNode];
  /** @default 'horizontal' (a vertical divider, panes side by side) */
  direction?: 'horizontal' | 'vertical';
  /** First pane's size as a fraction 0…1. */
  split?: number;
  defaultSplit?: number;
  onSplitChange?: (split: number) => void;
  /** Clamp so neither pane collapses past this fraction. @default 0.1 */
  min?: number;
  className?: string;
  style?: CSSProperties;
}

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

/** Two resizable panes with a draggable divider. */
export function GlassSplitPane({
  children,
  direction = 'horizontal',
  split,
  defaultSplit = 0.5,
  onSplitChange,
  min = 0.1,
  className,
  style,
}: GlassSplitPaneProps) {
  const [frac, setFrac] = useControllableState(split, defaultSplit, onSplitChange);
  const ref = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const horizontal = direction === 'horizontal';

  const onMove = (clientX: number, clientY: number) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const raw = horizontal ? (clientX - r.left) / r.width : (clientY - r.top) / r.height;
    setFrac(clamp(raw, min, 1 - min));
  };

  const down = (e: PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
  };
  const move = (e: PointerEvent<HTMLDivElement>) => dragging && onMove(e.clientX, e.clientY);
  const up = (e: PointerEvent<HTMLDivElement>) => {
    setDragging(false);
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const pct = `${frac * 100}%`;

  return (
    <div ref={ref} style={style} className={cn('ob-split', `ob-split--${direction}`, dragging && 'ob-split--dragging', className)}>
      <div className="ob-split__pane" style={horizontal ? { width: pct } : { height: pct }}>
        {children[0]}
      </div>
      <div
        role="separator"
        aria-orientation={horizontal ? 'vertical' : 'horizontal'}
        aria-valuenow={Math.round(frac * 100)}
        tabIndex={0}
        className="ob-split__divider"
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
        onKeyDown={(e) => {
          const step = 0.02;
          if (e.key === (horizontal ? 'ArrowLeft' : 'ArrowUp')) setFrac(clamp(frac - step, min, 1 - min));
          else if (e.key === (horizontal ? 'ArrowRight' : 'ArrowDown')) setFrac(clamp(frac + step, min, 1 - min));
        }}
      >
        <span className="ob-split__grip" />
      </div>
      <div className="ob-split__pane ob-split__pane--fill">{children[1]}</div>
    </div>
  );
}
