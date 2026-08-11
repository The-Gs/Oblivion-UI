import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';
import './GlassBreadcrumb.css';

export interface BreadcrumbItem {
  label: ReactNode;
  href?: string;
  onClick?: () => void;
}

export interface GlassBreadcrumbProps extends Omit<HTMLAttributes<HTMLElement>, 'onClick'> {
  items: BreadcrumbItem[];
  /** Separator between crumbs. @default '/' */
  separator?: ReactNode;
  'aria-label'?: string;
}

/**
 * A navigational trail. The last item is treated as the current page
 * (`aria-current="page"`) and is never a link.
 */
export function GlassBreadcrumb({
  items,
  separator = '/',
  className,
  'aria-label': ariaLabel = 'Breadcrumb',
  ...rest
}: GlassBreadcrumbProps) {
  return (
    <nav aria-label={ariaLabel} className={cn('ob-crumbs', className)} {...rest}>
      <ol className="ob-crumbs__list">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={i} className="ob-crumbs__item">
              {last ? (
                <span className="ob-crumbs__current" aria-current="page">
                  {item.label}
                </span>
              ) : item.href ? (
                <a className="ob-crumbs__link" href={item.href} onClick={item.onClick}>
                  {item.label}
                </a>
              ) : (
                <button type="button" className="ob-crumbs__link" onClick={item.onClick}>
                  {item.label}
                </button>
              )}
              {last ? null : (
                <span className="ob-crumbs__sep" aria-hidden="true">
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
