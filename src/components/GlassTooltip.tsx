import { useId, useState, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../lib/cn';
import { GlassSurface } from './GlassSurface';
import './GlassTooltip.css';

export interface GlassTooltipProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'content'> {
  /** Tooltip body. */
  content: ReactNode;
  /** @default 'top' */
  placement?: 'top' | 'bottom' | 'left' | 'right';
  /** The element the tooltip describes. */
  children: ReactNode;
}

/**
 * A frosted tooltip that springs in on hover or keyboard focus.
 *
 * Focus is handled as well as hover — a hover-only tooltip is invisible to
 * anyone navigating by keyboard. The bubble is `role="tooltip"` and wired to
 * the trigger through `aria-describedby`.
 */
export function GlassTooltip({
  content,
  placement = 'top',
  children,
  className,
  ...rest
}: GlassTooltipProps) {
  const id = useId();
  const [open, setOpen] = useState(false);

  return (
    <span
      className={cn('ob-tooltip', className)}
      aria-describedby={open ? id : undefined}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      // Escape should dismiss without moving focus away from the trigger.
      onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}
      {...rest}
    >
      {children}
      {open ? (
        <GlassSurface
          as="span"
          id={id}
          role="tooltip"
          elevation="overlay"
          radius="xs"
          className={cn('ob-tooltip__bubble', `ob-tooltip__bubble--${placement}`)}
        >
          {content}
        </GlassSurface>
      ) : null}
    </span>
  );
}
