import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';
import './GlassBreadcrumb.css';

export interface BreadcrumbItem {
  label: ReactNode;
  href?: string;
  onClick?: () => void;
}

/** Class names for each part of the trail. */
export interface BreadcrumbSlots {
  list?: string;
  item?: string;
  link?: string;
  current?: string;
  separator?: string;
}

export interface GlassBreadcrumbProps extends Omit<HTMLAttributes<HTMLElement>, 'onClick'> {
  items: BreadcrumbItem[];
  /** Separator between crumbs. @default '/' */
  separator?: ReactNode;
  /** Reach any part without a wrapper selector. */
  classNames?: BreadcrumbSlots;
  'aria-label'?: string;
}

/**
 * A navigational trail. The last item is treated as the current page
 * (`aria-current="page"`) and is never a link.
 */
export function GlassBreadcrumb({
  items,
  separator = '/',
  classNames: slots,
  className,
  'aria-label': ariaLabel = 'Breadcrumb',
  ...rest
}: GlassBreadcrumbProps) {
  return (
    <nav aria-label={ariaLabel} className={cn('ob-crumbs', className)} {...rest}>
      <ol className={cn('ob-crumbs__list', slots?.list)}>
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={i} className={cn('ob-crumbs__item', slots?.item)}>
              {last ? (
                <span className={cn('ob-crumbs__current', slots?.current)} aria-current="page">
                  {item.label}
                </span>
              ) : item.href ? (
                <a className={cn('ob-crumbs__link', slots?.link)} href={item.href} onClick={item.onClick}>
                  {item.label}
                </a>
              ) : (
                <button type="button" className={cn('ob-crumbs__link', slots?.link)} onClick={item.onClick}>
                  {item.label}
                </button>
              )}
              {last ? null : (
                <span className={cn('ob-crumbs__sep', slots?.separator)} aria-hidden="true">
                  {separator}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
