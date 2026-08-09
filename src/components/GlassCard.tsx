import type { ElementType, ReactNode } from 'react';
import { cn } from '../lib/cn';
import type { PolymorphicComponent, PolymorphicProps } from '../lib/polymorphic';
import { GlassSurface, type SurfaceElevation } from './GlassSurface';
import './GlassCard.css';

export interface GlassCardOwnProps {
  children?: ReactNode;
  /** Small uppercase label above the title. */
  eyebrow?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  /** Top-right slot in the header — a badge, a menu button, an avatar. */
  aside?: ReactNode;
  /** Image or video, rendered flush against the card's top edge. */
  media?: ReactNode;
  /** Bottom row, typically actions. */
  footer?: ReactNode;
  /** Hairline above the footer. @default false */
  dividedFooter?: boolean;
  /** @default 'md' */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** @default 'default' */
  elevation?: SurfaceElevation;
  /** Corner rounding token. @default 'xl' */
  radius?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  interactive?: boolean;
}

/**
 * A glass panel with optional header, media, body, and footer regions.
 *
 * Every region is optional and driven by props, so you can map straight from
 * data to cards without writing markup per item. Pass `children` for the body,
 * or omit it and use `title`/`description` alone.
 */
export const GlassCard = (<T extends ElementType = 'div'>({
  as,
  children,
  eyebrow,
  title,
  description,
  aside,
  media,
  footer,
  dividedFooter = false,
  padding = 'md',
  elevation = 'default',
  radius = 'xl',
  interactive = false,
  className,
  ...rest
}: PolymorphicProps<T, GlassCardOwnProps>) => {
  const hasHead = Boolean(eyebrow || title || description || aside);

  return (
    <GlassSurface
      as={(as ?? 'div') as ElementType}
      radius={radius}
      elevation={elevation}
      interactive={interactive}
      className={cn('ob-card', `ob-card--pad-${padding}`, className)}
      {...rest}
    >
      {media ? <figure className="ob-card__media">{media}</figure> : null}

      {hasHead ? (
        <div className="ob-card__head">
          <div className="ob-card__headText">
            {eyebrow ? <div className="ob-card__eyebrow">{eyebrow}</div> : null}
            {title ? <h3 className="ob-card__title">{title}</h3> : null}
            {description ? <p className="ob-card__desc">{description}</p> : null}
          </div>
          {aside ? <div className="ob-card__aside">{aside}</div> : null}
        </div>
      ) : null}

      {children ? <div className="ob-card__body">{children}</div> : null}

      {footer ? (
        <div className={cn('ob-card__foot', dividedFooter && 'ob-card__foot--divided')}>
          {footer}
        </div>
      ) : null}
    </GlassSurface>
  );
}) as PolymorphicComponent<'div', GlassCardOwnProps>;
