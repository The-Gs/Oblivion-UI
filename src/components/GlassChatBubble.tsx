import type { ReactNode } from 'react';
import { cn } from '../lib/cn';
import './GlassChatBubble.css';

export interface GlassChatBubbleProps {
  children?: ReactNode;
  /** `me` is the accent-filled, right-aligned side. @default 'them' */
  from?: 'me' | 'them';
  /** Timestamp under the bubble. */
  time?: ReactNode;
  /** Sender name/avatar shown above (usually for `them` in a group). */
  author?: ReactNode;
  /** Draw the little tail. @default true */
  tail?: boolean;
  className?: string;
}

/** An iMessage-style chat bubble — sent (`me`) or received (`them`). */
export function GlassChatBubble({
  children,
  from = 'them',
  time,
  author,
  tail = true,
  className,
}: GlassChatBubbleProps) {
  return (
    <div className={cn('ob-chat', `ob-chat--${from}`, className)}>
      {author ? <div className="ob-chat__author">{author}</div> : null}
      <div className={cn('ob-chat__bubble', tail && 'ob-chat__bubble--tail')}>{children}</div>
      {time ? <div className="ob-chat__time">{time}</div> : null}
    </div>
  );
}
