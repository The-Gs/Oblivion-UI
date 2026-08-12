import { useId, useRef, type ReactNode } from 'react';
import { cn } from '../lib/cn';
import { useControllableState } from '../lib/hooks';
import { Floating } from './internal/Floating';
import type { Placement } from '../lib/positioning';
import './GlassPopover.css';

export interface GlassPopoverProps {
  /** The element the popover anchors to and toggles from. */
  trigger: ReactNode;
  children: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** @default 'bottom-start' */
  placement?: Placement;
  /** Gap from the trigger, px. @default 8 */
  offset?: number;
  className?: string;
  'aria-label'?: string;
}

/**
 * A click-triggered floating panel for rich content — forms, detail cards,
 * anything a menu is too rigid for. Positioned and dismissed by {@link Floating}.
 */
export function GlassPopover({
  trigger,
  children,
  open,
  defaultOpen,
  onOpenChange,
  placement = 'bottom-start',
  offset = 8,
  className,
  'aria-label': ariaLabel,
}: GlassPopoverProps) {
  const [isOpen, setOpen] = useControllableState(open, defaultOpen ?? false, onOpenChange);
  const anchorRef = useRef<HTMLSpanElement>(null);
  const id = useId();

  return (
    <>
      <span
        ref={anchorRef}
        className="ob-pop__anchor"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls={isOpen ? id : undefined}
        onClick={() => setOpen(!isOpen)}
      >
        {trigger}
      </span>

      <Floating
        open={isOpen}
        onClose={() => setOpen(false)}
        anchorRef={anchorRef}
        placement={placement}
        offset={offset}
        role="dialog"
        id={id}
        aria-label={ariaLabel}
        className={cn('ob-pop', className)}
      >
        {children}
      </Floating>
    </>
  );
}
