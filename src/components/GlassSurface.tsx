import { forwardRef, type ElementType, type ReactNode } from 'react';
import { cn } from '../lib/cn';
import type { PolymorphicComponentWithRef, PolymorphicProps } from '../lib/polymorphic';

export type SurfaceElevation = 'flush' | 'default' | 'raised' | 'overlay' | 'well';

export interface GlassSurfaceOwnProps {
  children?: ReactNode;
  /**
   * `flush` drops the shadow, `raised` deepens it, `overlay` switches to the
   * darker plate used for modals and popovers, `well` inverts the lighting so
   * the surface reads as cut into the glass rather than sitting on it.
   * @default 'default'
   */
  elevation?: SurfaceElevation;
  /** Corner rounding token. @default 'xl' */
  radius?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  /** Lifts on hover, settles on press. */
  interactive?: boolean;
}

const RADIUS: Record<string, string> = {
  xs: 'var(--ob-r-xs)',
  sm: 'var(--ob-r-sm)',
  md: 'var(--ob-r-md)',
  lg: 'var(--ob-r-lg)',
  xl: 'var(--ob-r-xl)',
  '2xl': 'var(--ob-r-2xl)',
  full: 'var(--ob-r-full)',
};

/**
 * The material primitive. Every other component is this plus layout.
 *
 * Renders as a `<div>` by default; pass `as` to become anything else while
 * keeping that element's prop types. Forwards its ref to the rendered element.
 */
export const GlassSurface = forwardRef(function GlassSurface<T extends ElementType = 'div'>(
  {
    as,
    children,
    elevation = 'default',
    radius = 'xl',
    interactive = false,
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
      {...rest}
    >
      {children}
    </Tag>
  );
}) as PolymorphicComponentWithRef<'div', GlassSurfaceOwnProps>;
