import { useRef, useState, type ReactNode } from 'react';
import { cn } from '../lib/cn';
import { Floating } from './internal/Floating';
import type { Placement } from '../lib/positioning';
import './GlassPopover.css';

export interface GlassHoverCardProps {
  /** The element that reveals the card on hover/focus. */
  trigger: ReactNode;
  children: ReactNode;
  /** @default 'bottom-start' */
  placement?: Placement;
  /** Gap from the trigger, px. @default 8 */
  offset?: number;
  /** Delay before opening, ms. @default 180 */
  openDelay?: number;
  /** Delay before closing, ms. @default 120 */
  closeDelay?: number;
  className?: string;
  'aria-label'?: string;
}

/**
 * A hover- (and focus-) triggered floating card for previews — a profile, a
 * definition, a link peek. Stays open while the pointer is over the card.
 */
export function GlassHoverCard({
  trigger,
  children,
  placement = 'bottom-start',
  offset = 8,
  openDelay = 180,
  closeDelay = 120,
  className,
  'aria-label': ariaLabel,
}: GlassHoverCardProps) {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLSpanElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const schedule = (next: boolean) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(next), next ? openDelay : closeDelay);
  };

  const hoverProps = {
    onMouseEnter: () => schedule(true),
    onMouseLeave: () => schedule(false),
  };

  return (
    <>
      <span
        ref={anchorRef}
        className="ob-pop__anchor"
        tabIndex={0}
        onFocus={() => schedule(true)}
        onBlur={() => schedule(false)}
        {...hoverProps}
      >
        {trigger}
      </span>

      <Floating
        open={open}
        onClose={() => setOpen(false)}
        anchorRef={anchorRef}
        placement={placement}
        offset={offset}
        closeOnOutside={false}
        role="tooltip"
        aria-label={ariaLabel}
        className={cn('ob-pop', className)}
      >
        {/* Handlers live here (Floating doesn't spread), so the card stays open
            while the pointer is over it. */}
        <div className="ob-pop__inner" {...hoverProps}>
          {children}
        </div>
      </Floating>
    </>
  );
}
