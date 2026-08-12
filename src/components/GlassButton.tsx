import type { ElementType, ReactNode } from 'react';
import { cn } from '../lib/cn';
import type { PolymorphicComponentWithRef, PolymorphicProps } from '../lib/polymorphic';
import './GlassButton.css';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'quiet' | 'icon';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonTone = 'accent' | 'neutral' | 'success' | 'warning' | 'danger';

export interface GlassButtonOwnProps {
  children?: ReactNode;
  /** @default 'secondary' */
  variant?: ButtonVariant;
  /** @default 'md' */
  size?: ButtonSize;
  /**
   * Recolours the button by remapping its accent to a semantic token. Pairs
   * with any `variant`. Override corner rounding with `--ob-btn-radius`.
   * @default 'accent'
   */
  tone?: ButtonTone;
  /** Node before the label. */
  leading?: ReactNode;
  /** Node after the label. */
  trailing?: ReactNode;
  /** Swaps content for a spinner and blocks interaction. */
  loading?: boolean;
  /** Stretch to the container's width. */
  block?: boolean;
  /**
   * `icon` buttons rotate 90° on hover by default, which suits add/close/menu
   * affordances but not transport controls. Set this for those.
   */
  noSpin?: boolean;
  disabled?: boolean;
  /** Required for `icon` buttons — there's no visible label to read. */
  'aria-label'?: string;
}

/**
 * A button in glass.
 *
 * Renders `<button>` by default. `as="a"` gives a link with identical styling
 * and a correctly typed `href`.
 */
export const GlassButton = (<T extends ElementType = 'button'>({
  as,
  children,
  variant = 'secondary',
  size = 'md',
  tone = 'accent',
  leading,
  trailing,
  loading = false,
  block = false,
  noSpin = false,
  disabled = false,
  className,
  ...rest
}: PolymorphicProps<T, GlassButtonOwnProps>) => {
  const Tag = (as ?? 'button') as ElementType;
  const isNativeButton = Tag === 'button';
  const inert = disabled || loading;

  return (
    <Tag
      className={cn(
        'ob-btn',
        `ob-btn--${variant}`,
        `ob-btn--${size}`,
        tone !== 'accent' && `ob-btn--tone-${tone}`,
        block && 'ob-btn--block',
        loading && 'ob-btn--loading',
        noSpin && 'ob-btn--still',
        className,
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
    </Tag>
  );
}) as PolymorphicComponentWithRef<'button', GlassButtonOwnProps>;
