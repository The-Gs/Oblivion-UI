import { useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../lib/cn';
import { useFocusTrap, useOnEscape, usePortal, useScrollLock } from '../lib/hooks';
import './GlassDrawer.css';

export type DrawerSide = 'left' | 'right' | 'top' | 'bottom';

/** Class names for each part of the drawer. */
export interface DrawerSlots {
  scrim?: string;
  panel?: string;
  header?: string;
  body?: string;
  footer?: string;
}

export interface GlassDrawerProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  /** Edge the sheet slides in from. @default 'right' */
  side?: DrawerSide;
  /** Panel size along its axis (width for left/right, height for top/bottom). @default '380px' */
  size?: string;
  showClose?: boolean;
  closeOnScrim?: boolean;
  closeOnEscape?: boolean;
  className?: string;
  classNames?: DrawerSlots;
  'aria-label'?: string;
}

/**
 * A panel that slides in from any edge, on the same dark overlay plate as the
 * modal (so its text stays legible on every theme). Traps focus, locks scroll,
 * closes on Escape and scrim press.
 */
export function GlassDrawer({
  open,
  onClose,
  title,
  children,
  footer,
  side = 'right',
  size = '380px',
  showClose = true,
  closeOnScrim = true,
  closeOnEscape = true,
  className,
  classNames: slots,
  'aria-label': ariaLabel,
}: GlassDrawerProps) {
  const container = usePortal();
  const panelRef = useRef<HTMLDivElement>(null);
  const onKeyDown = useFocusTrap(open, panelRef);
  useScrollLock(open);
  useOnEscape(open && closeOnEscape, onClose);

  if (!open || !container) return null;

  const axis = side === 'left' || side === 'right' ? { width: size } : { height: size };

  return createPortal(
    <div className="ob-drawer" onKeyDown={onKeyDown}>
      <div
        className={cn('ob-drawer__scrim', slots?.scrim)}
        onClick={closeOnScrim ? onClose : undefined}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel ?? (typeof title === 'string' ? title : undefined)}
        tabIndex={-1}
        className={cn('ob-drawer__panel', `ob-drawer__panel--${side}`, slots?.panel, className)}
        style={axis}
      >
        {title || showClose ? (
          <div className={cn('ob-drawer__head', slots?.header)}>
            {title ? <h2 className="ob-drawer__title">{title}</h2> : <span />}
            {showClose ? (
              <button
                type="button"
                className="ob-drawer__close ob-reset-button ob-focusable"
                onClick={onClose}
                aria-label="Close"
              >
                ✕
              </button>
            ) : null}
          </div>
        ) : null}

        {children ? <div className={cn('ob-drawer__body', slots?.body)}>{children}</div> : null}
        {footer ? <div className={cn('ob-drawer__foot', slots?.footer)}>{footer}</div> : null}
      </div>
    </div>,
    container,
  );
}
