import { forwardRef, type ElementType, type ReactNode } from 'react';
import { cn } from '../lib/cn';
import type { PolymorphicComponentWithRef, PolymorphicProps } from '../lib/polymorphic';

export type SurfaceElevation = 'flush' | 'default' | 'raised' | 'haloed';

export interface GlassSurfaceOwnProps {
  children?: ReactNode;
  /**
   * `flush` sits flat, `raised` throws a longer shadow, `haloed` turns both
   * registers up — a gold arc over the top edge and heat pooling beneath.
   * @default 'default'
   */
  elevation?: SurfaceElevation;
  /** Corner rounding token. @default 'md' */
  radius?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** Lifts toward the light on hover; settles on press. */
  interactive?: boolean;
  /** Raked specular bands across the pane. @default true */
  sheen?: boolean;
  /** Film-grain overlay. @default true */
  grain?: boolean;
}

const RADIUS: Record<string, string> = {
  sm: 'var(--ob-radius-sm)',
  md: 'var(--ob-radius)',
  lg: 'var(--ob-radius-lg)',
  xl: 'var(--ob-radius-xl)',
  full: 'var(--ob-radius-full)',
};

/**
 * The material primitive. Every other Oblivion component is this plus layout.
 *
 * Renders as a `<div>` by default; pass `as` to become anything else while
 * keeping that element's prop types. Forwards its ref to the rendered element.
 */
export const GlassSurface = forwardRef(function GlassSurface<T extends ElementType = 'div'>(
  {
    as,
    children,
    elevation = 'default',
    radius = 'md',
    interactive = false,
    sheen = true,
    grain = true,
    className,
    style,
    ...rest
  }: PolymorphicProps<T, GlassSurfaceOwnProps>,
  ref: React.Ref<Element>,
) {
  const Tag = (as ?? 'div') as ElementType;

  return (
    <Tag
      ref={ref}
      className={cn(
        'ob-surface',
        elevation !== 'default' && `ob-surface--${elevation}`,
        interactive && 'ob-surface--interactive',
        className,
      )}
      style={{ borderRadius: RADIUS[radius], ...(style as object) }}
      data-ob-grain={grain}
      {...rest}
    >
      {sheen ? <span className="ob-sheen" aria-hidden="true" /> : null}
      {grain ? <span className="ob-grain" aria-hidden="true" /> : null}
      {children}
    </Tag>
  );
}) as PolymorphicComponentWithRef<'div', GlassSurfaceOwnProps>;
