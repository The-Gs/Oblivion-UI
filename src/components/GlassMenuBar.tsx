import { useEffect, useState, type ReactNode } from 'react';
import { cn } from '../lib/cn';
import './GlassMenuBar.css';

export interface GlassMenuBarProps {
  /** Leading brand glyph (e.g. an  logo). */
  brand?: ReactNode;
  /** App menu labels. */
  menus?: string[];
  /** Right-side status glyphs. */
  status?: ReactNode[];
  /** Show a live clock at the far right. @default true */
  clock?: boolean;
  className?: string;
}

function useClock(enabled: boolean) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    if (!enabled) return;
    const id = setInterval(() => setNow(new Date()), 1000 * 20);
    return () => clearInterval(id);
  }, [enabled]);
  return now;
}

/** A macOS-style top menu bar: brand, app menus, right-aligned status + clock. */
export function GlassMenuBar({ brand = '', menus = [], status = [], clock = true, className }: GlassMenuBarProps) {
  const now = useClock(clock);
  const time = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  const day = now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <div className={cn('ob-menubar', className)} role="menubar">
      {brand ? <span className="ob-menubar__brand">{brand}</span> : null}
      {menus.map((m, i) => (
        <button key={i} type="button" className="ob-menubar__menu" role="menuitem">
          {m}
        </button>
      ))}
      <span className="ob-menubar__spacer" />
      {status.map((s, i) => (
        <span key={i} className="ob-menubar__status">
          {s}
        </span>
      ))}
      {clock ? (
        <span className="ob-menubar__clock">
          {day} &nbsp; {time}
        </span>
      ) : null}
    </div>
  );
}
