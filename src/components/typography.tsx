import type { ElementType, ReactNode } from 'react';
import { cn } from '../lib/cn';
import type { PolymorphicProps } from '../lib/polymorphic';
import './typography.css';

export type HeadingSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';

export interface HeadingOwnProps {
  children?: ReactNode;
  /** Heading level 1–6; also sets the default element. @default 2 */
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Visual size, independent of level. */
  size?: HeadingSize;
  /** Clamp to one line with an ellipsis. */
  truncate?: boolean;
}

/** A display heading. Renders `h{level}` by default; override with `as`. */
export function Heading<T extends ElementType = 'h2'>({
  as,
  level = 2,
  size,
  truncate,
  className,
  ...rest
}: PolymorphicProps<T, HeadingOwnProps>) {
  const Tag = (as ?? (`h${level}` as ElementType)) as ElementType;
  const s = size ?? (['3xl', '2xl', 'xl', 'lg', 'md', 'sm'][level - 1] as HeadingSize);
  return <Tag className={cn('ob-heading', `ob-heading--${s}`, truncate && 'ob-truncate', className)} {...rest} />;
}

export type TextSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type TextTone = 'default' | 'muted' | 'subtle' | 'accent';

export interface TextOwnProps {
  children?: ReactNode;
  /** @default 'md' */
  size?: TextSize;
  /** @default 'default' */
  tone?: TextTone;
  /** @default 400 */
  weight?: 400 | 500 | 600 | 700;
  mono?: boolean;
  truncate?: boolean;
}

/** Body text with size, tone, and weight. Renders `<p>` by default. */
export function Text<T extends ElementType = 'p'>({
  as,
  size = 'md',
  tone = 'default',
  weight,
  mono,
  truncate,
  className,
  style,
  ...rest
}: PolymorphicProps<T, TextOwnProps>) {
  const Tag = (as ?? 'p') as ElementType;
  return (
    <Tag
      className={cn('ob-text', `ob-text--${size}`, `ob-text--${tone}`, mono && 'ob-text--mono', truncate && 'ob-truncate', className)}
      style={{ fontWeight: weight, ...(style as object) }}
      {...rest}
    />
  );
}
