import type { ReactNode } from 'react';
import { cn } from '../lib/cn';
import './GlassNotification.css';

export interface GlassNotificationProps {
  /** App/source icon. */
  icon?: ReactNode;
  /** Source name (small, uppercase). */
  app?: ReactNode;
  title: ReactNode;
  body?: ReactNode;
  /** Right-aligned timestamp. */
  time?: ReactNode;
  /** Action row under the body. */
  actions?: ReactNode;
  onClose?: () => void;
  className?: string;
}

/** An OS-style notification banner — app icon, title, body, timestamp. */
export function GlassNotification({
  icon,
  app,
  title,
  body,
  time,
  actions,
  onClose,
  className,
}: GlassNotificationProps) {
  return (
    <div className={cn('ob-note', className)} role="status">
      {icon ? <div className="ob-note__icon">{icon}</div> : null}
      <div className="ob-note__main">
        <div className="ob-note__head">
          {app ? <span className="ob-note__app">{app}</span> : <span />}
          {time ? <span className="ob-note__time">{time}</span> : null}
        </div>
        <div className="ob-note__title">{title}</div>
        {body ? <div className="ob-note__body">{body}</div> : null}
        {actions ? <div className="ob-note__actions">{actions}</div> : null}
      </div>
      {onClose ? (
        <button type="button" className="ob-note__close" onClick={onClose} aria-label="Dismiss">
          ✕
        </button>
      ) : null}
    </div>
  );
}
