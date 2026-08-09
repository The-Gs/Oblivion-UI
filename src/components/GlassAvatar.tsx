import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';
import './GlassAvatar.css';

export type AvatarSize = 'sm' | 'md' | 'lg';

export interface GlassAvatarProps extends HTMLAttributes<HTMLSpanElement> {
  /** Image URL. Falls back to `initials`, then `children`. */
  src?: string;
  /** Describes the person. Required when `src` is set. */
  alt?: string;
  /** Derived from `name` when omitted. */
  initials?: string;
  /** Convenience: initials are taken from the first letters of each word. */
  name?: string;
  /** @default 'md' */
  size?: AvatarSize;
  /** Neutral glass instead of accent fill. @default false */
  neutral?: boolean;
  children?: ReactNode;
}

/** First letter of each of the first two words. */
function toInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0] ?? '')
    .join('')
    .toUpperCase();
}

/** A circular avatar showing an image, initials, or arbitrary content. */
export function GlassAvatar({
  src,
  alt,
  initials,
  name,
  size = 'md',
  neutral = false,
  children,
  className,
  ...rest
}: GlassAvatarProps) {
  const text = initials ?? (name ? toInitials(name) : undefined);

  return (
    <span
      className={cn('ob-avatar', `ob-avatar--${size}`, neutral && 'ob-avatar--neutral', className)}
      // With an image the alt text carries the meaning; with initials the
      // full name does, since "DK" is not useful read aloud.
      title={name}
      {...rest}
    >
      {src ? (
        <img className="ob-avatar__img" src={src} alt={alt ?? name ?? ''} />
      ) : (
        (children ?? text)
      )}
    </span>
  );
}

export interface GlassAvatarGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Show at most this many, then a +N chip. */
  max?: number;
  /** @default 'md' */
  size?: AvatarSize;
  /** Avatars, as `GlassAvatar` elements. */
  children?: ReactNode;
}

/**
 * Overlaps avatars into a stack, collapsing the tail into a `+N` chip.
 *
 * Pass `GlassAvatar` children; `size` here is not forwarded to them, so set
 * the same size on both if you change it.
 */
export function GlassAvatarGroup({
  max,
  size = 'md',
  children,
  className,
  ...rest
}: GlassAvatarGroupProps) {
  const all = Array.isArray(children) ? children.flat() : [children];
  const items = all.filter(Boolean);
  const shown = max === undefined ? items : items.slice(0, max);
  const hidden = items.length - shown.length;

  return (
    <div className={cn('ob-avatar-group', className)} {...rest}>
      {shown}
      {hidden > 0 ? (
        <span
          className={cn('ob-avatar', `ob-avatar--${size}`, 'ob-avatar--overflow')}
          aria-label={`${hidden} more`}
        >
          +{hidden}
        </span>
      ) : null}
    </div>
  );
}
