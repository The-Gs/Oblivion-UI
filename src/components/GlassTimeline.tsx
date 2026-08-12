import type { ReactNode } from 'react';
import { cn } from '../lib/cn';
import './GlassTimeline.css';

export type TimelineTone = 'accent' | 'neutral' | 'success' | 'warning' | 'danger';

export interface TimelineItem {
  title: ReactNode;
  time?: ReactNode;
  description?: ReactNode;
  /** Glyph inside the node; defaults to a filled dot. */
  icon?: ReactNode;
  /** Colours the node. @default 'accent' */
  tone?: TimelineTone;
}

/** Class names for each part of a timeline entry. */
export interface TimelineSlots {
  item?: string;
  node?: string;
  title?: string;
  time?: string;
  description?: string;
}

export interface GlassTimelineProps {
  items: TimelineItem[];
  className?: string;
  classNames?: TimelineSlots;
}

/** A vertical timeline — a connected column of dated events. */
export function GlassTimeline({ items, className, classNames: slots }: GlassTimelineProps) {
  return (
    <ol className={cn('ob-timeline', className)}>
      {items.map((item, i) => (
        <li key={i} className={cn('ob-timeline__item', slots?.item)}>
          <div className="ob-timeline__rail">
            <span className={cn('ob-timeline__node', slots?.node)} data-tone={item.tone ?? 'accent'}>
              {item.icon}
            </span>
            {i < items.length - 1 ? <span className="ob-timeline__line" aria-hidden="true" /> : null}
          </div>
          <div className="ob-timeline__body">
            <div className="ob-timeline__head">
              <span className={cn('ob-timeline__title', slots?.title)}>{item.title}</span>
              {item.time ? <span className={cn('ob-timeline__time', slots?.time)}>{item.time}</span> : null}
            </div>
            {item.description ? (
              <p className={cn('ob-timeline__desc', slots?.description)}>{item.description}</p>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}
