import { cn } from '../lib/cn';
import './GlassPagination.css';

export interface GlassPaginationProps {
  /** Current page, 1-based. */
  page: number;
  /** Total number of pages. */
  count: number;
  onChange: (page: number) => void;
  /** Pages to show on each side of the current one. @default 1 */
  siblings?: number;
  /** @default 'sm' */
  size?: 'sm' | 'md';
  className?: string;
  /** Class applied to every page/nav button. Size hook: `--ob-pager-size`. */
  itemClassName?: string;
  'aria-label'?: string;
}

const ELLIPSIS = '…';

/** Build the compact page list: first, last, current ± siblings, ellipses. */
function range(page: number, count: number, siblings: number): (number | string)[] {
  const total = siblings * 2 + 5; // first, last, current, 2 ellipsis slots
  if (count <= total) return Array.from({ length: count }, (_, i) => i + 1);

  const left = Math.max(page - siblings, 1);
  const right = Math.min(page + siblings, count);
  const showLeftDots = left > 2;
  const showRightDots = right < count - 1;
  const out: (number | string)[] = [1];

  if (showLeftDots) out.push(ELLIPSIS);
  else for (let i = 2; i < left; i++) out.push(i);

  for (let i = left; i <= right; i++) if (i !== 1 && i !== count) out.push(i);

  if (showRightDots) out.push(ELLIPSIS);
  else for (let i = right + 1; i < count; i++) out.push(i);

  out.push(count);
  return out;
}

/** Page navigation with prev/next and an eliding number list. */
export function GlassPagination({
  page,
  count,
  onChange,
  siblings = 1,
  size = 'sm',
  className,
  itemClassName,
  'aria-label': ariaLabel = 'Pagination',
}: GlassPaginationProps) {
  const go = (p: number) => {
    const next = Math.min(Math.max(p, 1), count);
    if (next !== page) onChange(next);
  };

  return (
    <nav aria-label={ariaLabel} className={cn('ob-pager', size === 'md' && 'ob-pager--md', className)}>
      <button
        type="button"
        className={cn('ob-pager__btn ob-pager__nav', itemClassName)}
        onClick={() => go(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
      >
        ‹
      </button>

      {range(page, count, siblings).map((p, i) =>
        typeof p === 'number' ? (
          <button
            key={i}
            type="button"
            className={cn('ob-pager__btn', p === page && 'ob-pager__btn--active', itemClassName)}
            onClick={() => go(p)}
            aria-current={p === page ? 'page' : undefined}
          >
            {p}
          </button>
        ) : (
          <span key={i} className="ob-pager__gap" aria-hidden="true">
            {p}
          </span>
        ),
      )}

      <button
        type="button"
        className={cn('ob-pager__btn ob-pager__nav', itemClassName)}
        onClick={() => go(page + 1)}
        disabled={page >= count}
        aria-label="Next page"
      >
        ›
      </button>
    </nav>
  );
}
