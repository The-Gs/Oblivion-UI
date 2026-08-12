import { useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../lib/cn';
import { useOnEscape, useOutsideClick, usePortal } from '../lib/hooks';
import './GlassContextMenu.css';

export interface ContextMenuItem {
  key: string;
  label?: ReactNode;
  icon?: ReactNode;
  hint?: ReactNode;
  disabled?: boolean;
  danger?: boolean;
  separator?: boolean;
  onSelect?: () => void;
}

export interface GlassContextMenuProps {
  items: ContextMenuItem[];
  /** The area that opens the menu on right-click. */
  children: ReactNode;
  className?: string;
}

/** A right-click context menu, portalled at the cursor. */
export function GlassContextMenu({ items, children, className }: GlassContextMenuProps) {
  const container = usePortal();
  const menuRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

  useOnEscape(pos !== null, () => setPos(null));
  useOutsideClick([menuRef], () => setPos(null), pos !== null);

  const open = (e: React.MouseEvent) => {
    e.preventDefault();
    // Clamp so the menu never spills off the viewport edge.
    const x = Math.min(e.clientX, window.innerWidth - 220);
    const y = Math.min(e.clientY, window.innerHeight - items.length * 34 - 16);
    setPos({ x, y });
  };

  return (
    <>
      <div className="ob-ctx__target" onContextMenu={open}>
        {children}
      </div>
      {pos && container
        ? createPortal(
            <div
              ref={menuRef}
              role="menu"
              className={cn('ob-ctx', className)}
              style={{ left: pos.x, top: pos.y }}
            >
              {items.map((item) =>
                item.separator ? (
                  <div key={item.key} className="ob-ctx__sep" role="separator" />
                ) : (
                  <button
                    key={item.key}
                    type="button"
                    role="menuitem"
                    className={cn('ob-ctx__item', item.danger && 'ob-ctx__item--danger')}
                    disabled={item.disabled}
                    onClick={() => {
                      item.onSelect?.();
                      setPos(null);
                    }}
                  >
                    {item.icon ? <span className="ob-ctx__icon">{item.icon}</span> : null}
                    <span className="ob-ctx__label">{item.label}</span>
                    {item.hint ? <span className="ob-ctx__hint">{item.hint}</span> : null}
                  </button>
                ),
              )}
            </div>,
            container,
          )
        : null}
    </>
  );
}
