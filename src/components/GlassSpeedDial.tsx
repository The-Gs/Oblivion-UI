import { useRef, type ReactNode } from 'react';
import { cn } from '../lib/cn';
import { useControllableState, useOnEscape, useOutsideClick } from '../lib/hooks';
import './GlassSpeedDial.css';

export interface SpeedDialAction {
  id: string;
  icon: ReactNode;
  label?: string;
  onClick?: () => void;
}

export interface GlassSpeedDialProps {
  actions: SpeedDialAction[];
  /** Main button glyph. @default '+' */
  icon?: ReactNode;
  /** Fan direction. @default 'up' */
  direction?: 'up' | 'down' | 'left' | 'right';
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  'aria-label'?: string;
}

/** A floating action button that fans its actions out on open. */
export function GlassSpeedDial({
  actions,
  icon = '+',
  direction = 'up',
  open,
  defaultOpen,
  onOpenChange,
  className,
  'aria-label': ariaLabel = 'Actions',
}: GlassSpeedDialProps) {
  const [isOpen, setOpen] = useControllableState(open, defaultOpen ?? false, onOpenChange);
  const ref = useRef<HTMLDivElement>(null);
  useOnEscape(isOpen, () => setOpen(false));
  useOutsideClick([ref], () => setOpen(false), isOpen);

  return (
    <div ref={ref} className={cn('ob-dial', `ob-dial--${direction}`, isOpen && 'ob-dial--open', className)}>
      <div className="ob-dial__actions">
        {actions.map((a, i) => (
          <button
            key={a.id}
            type="button"
            className="ob-dial__action"
            style={{ ['--i' as string]: i }}
            title={a.label}
            aria-label={a.label}
            tabIndex={isOpen ? 0 : -1}
            onClick={() => {
              a.onClick?.();
              setOpen(false);
            }}
          >
            {a.icon}
            {a.label ? <span className="ob-dial__tip">{a.label}</span> : null}
          </button>
        ))}
      </div>
      <button
        type="button"
        className="ob-dial__fab"
        aria-label={ariaLabel}
        aria-expanded={isOpen}
        onClick={() => setOpen(!isOpen)}
      >
        <span className="ob-dial__fab-icon">{icon}</span>
      </button>
    </div>
  );
}
