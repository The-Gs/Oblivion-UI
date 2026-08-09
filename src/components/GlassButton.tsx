import type { ElementType, ReactNode } from 'react';
import { cn } from '../lib/cn';
import type { PolymorphicComponent, PolymorphicProps } from '../lib/polymorphic';
import { GlassSurface } from './GlassSurface';
import './GlassButton.css';

export type ButtonVariant = 'glass' | 'solid' | 'ghost' | 'outline' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface GlassButtonOwnProps {
  children?: ReactNode;
  /** @default 'glass' */
  variant?: ButtonVariant;
  /** @default 'md' */
  size?: ButtonSize;
  /** Node before the label — an icon, a sigil, a dot. */
  leading?: ReactNode;
  /** Node after the label. */
  trailing?: ReactNode;
  /** Swaps content for a spinner and blocks interaction. */
  loading?: boolean;
  /** Stretch to the container's width. */
  block?: boolean;
  disabled?: boolean;
}

/**
 * A button cut from glass.
 *
 * Renders `<button>` by default. `as="a"` gives you a link with identical
 * styling and correctly typed `href`.
 */
export const GlassButton = (<T extends ElementType = 'button'>({
  as,
  children,
  variant = 'glass',
  size = 'md',
  leading,
  trailing,
  loading = false,
  block = false,
  disabled = false,
  className,
  ...rest
}: PolymorphicProps<T, GlassButtonOwnProps>) => {
  const Tag = (as ?? 'button') as ElementType;
  const isNativeButton = Tag === 'button';
  const inert = disabled || loading;

  return (
    <GlassSurface
      as={Tag}
      radius={size === 'lg' ? 'md' : 'sm'}
      interactive={!inert}
      grain={false}
      className={cn(
        'ob-btn',
        'ob-focusable',
        `ob-btn--${variant}`,
        `ob-btn--${size}`,
        block && 'ob-btn--block',
        loading && 'ob-btn--loading',
        className as string | undefined,
      )}
      // Native buttons get the real attribute; anything else needs the ARIA
      // equivalent plus removal from the tab order.
      {...(isNativeButton
        ? { type: 'button', disabled: inert }
        : { 'aria-disabled': inert || undefined, tabIndex: inert ? -1 : 0 })}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? <span className="ob-btn__spinner" aria-hidden="true" /> : null}
      {leading ? (
        <span className="ob-btn__affix" aria-hidden="true">
          {leading}
        </span>
      ) : null}
      <span className="ob-btn__label">{children}</span>
      {trailing ? (
        <span className="ob-btn__affix" aria-hidden="true">
          {trailing}
        </span>
      ) : null}
    </GlassSurface>
  );
}) as PolymorphicComponent<'button', GlassButtonOwnProps>;
