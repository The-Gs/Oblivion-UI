import type { ReactNode } from 'react';
import { cn } from '../lib/cn';
import './GlassDescriptionList.css';

export interface DescriptionItem {
  term: ReactNode;
  description: ReactNode;
}

/** Class names for each part of the list. */
export interface DescriptionListSlots {
  row?: string;
  term?: string;
  description?: string;
}

export interface GlassDescriptionListProps {
  items: DescriptionItem[];
  /**
   * `horizontal` puts term and value side by side. Size the term column with
   * `--ob-dl-term-w`. @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical';
  /** Hairlines between rows. @default true */
  divided?: boolean;
  className?: string;
  classNames?: DescriptionListSlots;
}

/** A term/value list (`<dl>`) for specs, metadata, and detail panels. */
export function GlassDescriptionList({
  items,
  orientation = 'horizontal',
  divided = true,
  className,
  classNames: slots,
}: GlassDescriptionListProps) {
  return (
    <dl
      className={cn('ob-dl', `ob-dl--${orientation}`, divided && 'ob-dl--divided', className)}
    >
      {items.map((item, i) => (
        <div key={i} className={cn('ob-dl__row', slots?.row)}>
          <dt className={cn('ob-dl__term', slots?.term)}>{item.term}</dt>
          <dd className={cn('ob-dl__desc', slots?.description)}>{item.description}</dd>
        </div>
      ))}
    </dl>
  );
}
