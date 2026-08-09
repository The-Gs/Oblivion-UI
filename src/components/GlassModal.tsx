import { useCallback, useEffect, useId, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../lib/cn';
import { GlassSurface } from './GlassSurface';
import './GlassModal.css';

export interface GlassModalProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  /** Action row along the bottom. */
  footer?: ReactNode;
  /** @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** Show the × button. @default true */
  showClose?: boolean;
  /** Close on scrim click. @default true */
  closeOnScrim?: boolean;
  /** Close on Escape. @default true */
  closeOnEscape?: boolean;
  className?: string;
}

const FOCUSABLE =
  'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';

/**
 * A modal dialog on a glass panel, rendered through a portal on `document.body`.
 *
 * Handles Escape, scrim clicks, background scroll locking, focus capture on
 * open, and focus restoration on close.
 */
export function GlassModal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  showClose = true,
  closeOnScrim = true,
  closeOnEscape = true,
  className,
}: GlassModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreTo = useRef<HTMLElement | null>(null);
  const labelId = useId();
  const descId = useId();

  // Remember the trigger so focus can go home when the dialog closes.
  useEffect(() => {
    if (!open) return;
    restoreTo.current = document.activeElement as HTMLElement | null;
    return () => restoreTo.current?.focus?.();
  }, [open]);

  // Move focus into the dialog once it exists.
  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    if (!panel) return;
    const first = panel.querySelector<HTMLElement>(FOCUSABLE);
    (first ?? panel).focus();
  }, [open]);

  // Lock background scroll, compensating for the scrollbar so the page behind
  // does not shift sideways when it disappears.
  useEffect(() => {
    if (!open) return;
    const { body, documentElement: html } = document;
    const gap = window.innerWidth - html.clientWidth;
    const prevOverflow = body.style.overflow;
    const prevPad = body.style.paddingRight;

    body.style.overflow = 'hidden';
    if (gap > 0) body.style.paddingRight = `${gap}px`;

    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPad;
    };
  }, [open]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Escape' && closeOnEscape) {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;

      // Cycle focus within the dialog.
      const panel = panelRef.current;
      if (!panel) return;
      const nodes = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (n) => n.offsetParent !== null,
      );
      if (nodes.length === 0) return;

      const first = nodes[0]!;
      const last = nodes[nodes.length - 1]!;
      const active = document.activeElement;

      if (e.shiftKey && (active === first || active === panel)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    },
    [closeOnEscape, onClose],
  );

  if (!open || typeof document === 'undefined') return null;

  return createPortal(
    <div className="ob-modal" onKeyDown={onKeyDown}>
      <div
        className="ob-modal__scrim"
        onClick={closeOnScrim ? onClose : undefined}
        aria-hidden="true"
      />
      <GlassSurface
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? labelId : undefined}
        aria-describedby={description ? descId : undefined}
        tabIndex={-1}
        radius="lg"
        elevation="haloed"
        className={cn('ob-modal__panel', `ob-modal__panel--${size}`, className)}
      >
        {title || showClose ? (
          <div className="ob-modal__head">
            <div className="ob-modal__titles">
              {title ? (
                <h2 id={labelId} className="ob-modal__title">
                  {title}
                </h2>
              ) : null}
              {description ? (
                <p id={descId} className="ob-modal__desc">
                  {description}
                </p>
              ) : null}
            </div>
            {showClose ? (
              <button
                type="button"
                className="ob-modal__close ob-reset-button ob-focusable"
                onClick={onClose}
                aria-label="Close dialog"
              >
                ✕
              </button>
            ) : null}
          </div>
        ) : null}

        {children ? <div className="ob-modal__body">{children}</div> : null}
        {footer ? <div className="ob-modal__foot">{footer}</div> : null}
      </GlassSurface>
    </div>,
    document.body,
  );
}
