import {
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../lib/cn';
import { useOnEscape, useOutsideClick, usePortal } from '../../lib/hooks';
import { computePosition, type Placement, type Position } from '../../lib/positioning';

export interface FloatingProps {
  open: boolean;
  onClose: () => void;
  /** The element the panel is positioned against. */
  anchorRef: RefObject<HTMLElement | null>;
  /** @default 'bottom-start' */
  placement?: Placement;
  /** Gap between anchor and panel, px. @default 6 */
  offset?: number;
  /** Match the panel's width to the anchor's (for selects). @default false */
  matchWidth?: boolean;
  /** Dismiss on Escape. @default true */
  closeOnEscape?: boolean;
  /** Dismiss on outside press. @default true */
  closeOnOutside?: boolean;
  role?: string;
  id?: string;
  'aria-label'?: string;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
  /** Extra refs (besides anchor + panel) that count as "inside". */
  extraDismissRefs?: Array<RefObject<HTMLElement | null>>;
}

/**
 * A portalled, anchored floating layer. Handles positioning (with flip +
 * viewport clamp), reposition on scroll/resize, outside-press and Escape
 * dismissal. Focus behavior is left to the caller — menus rove, popovers trap.
 *
 * Shared by GlassMenu, GlassSelect, GlassPopover, and GlassTooltip.
 */
export function Floating({
  open,
  onClose,
  anchorRef,
  placement = 'bottom-start',
  offset = 6,
  matchWidth = false,
  closeOnEscape = true,
  closeOnOutside = true,
  role,
  id,
  'aria-label': ariaLabel,
  className,
  style,
  children,
  extraDismissRefs = [],
}: FloatingProps) {
  const container = usePortal();
  const panelRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<Position | null>(null);
  const [width, setWidth] = useState<number | undefined>(undefined);

  useOnEscape(open && closeOnEscape, onClose);
  useOutsideClick([anchorRef, panelRef, ...extraDismissRefs], onClose, open && closeOnOutside);

  useLayoutEffect(() => {
    if (!open) {
      setPos(null);
      return;
    }
    const place = () => {
      const anchor = anchorRef.current;
      const panel = panelRef.current;
      if (!anchor || !panel) return;
      const anchorRect = anchor.getBoundingClientRect();
      if (matchWidth) setWidth(anchorRect.width);
      const panelRect = panel.getBoundingClientRect();
      setPos(
        computePosition(
          anchorRect,
          { width: matchWidth ? anchorRect.width : panelRect.width, height: panelRect.height },
          { placement, offset },
        ),
      );
    };
    place();
    window.addEventListener('scroll', place, true);
    window.addEventListener('resize', place);
    return () => {
      window.removeEventListener('scroll', place, true);
      window.removeEventListener('resize', place);
    };
  }, [open, anchorRef, placement, offset, matchWidth]);

  if (!open || !container) return null;

  return createPortal(
    <div
      ref={panelRef}
      role={role}
      id={id}
      aria-label={ariaLabel}
      data-ob-side={pos?.side}
      className={cn('ob-floating', className)}
      style={{
        position: 'fixed',
        left: pos?.left ?? 0,
        top: pos?.top ?? 0,
        width: matchWidth ? width : undefined,
        // Hide until measured, so it never flashes at 0,0.
        visibility: pos ? 'visible' : 'hidden',
        ...style,
      }}
    >
      {children}
    </div>,
    container,
  );
}
