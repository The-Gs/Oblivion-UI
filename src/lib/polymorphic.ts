import type {
  ComponentPropsWithoutRef,
  ComponentPropsWithRef,
  ElementType,
  ReactElement,
} from 'react';

/**
 * Lets any component re-target its rendered element via `as`, while keeping
 * full prop typing for whatever element you chose.
 *
 *   <GlassCard as="section" />        // gets <section> props
 *   <GlassButton as="a" href="/x" />  // href is required-aware and typed
 */
export type PolymorphicProps<T extends ElementType, Own> = Own &
  Omit<ComponentPropsWithoutRef<T>, keyof Own | 'as'> & {
    /** Element or component to render. Defaults per component. */
    as?: T;
  };

/** The ref type for whatever element `as` resolved to. */
export type PolymorphicRef<T extends ElementType> = ComponentPropsWithRef<T>['ref'];

export type PolymorphicPropsWithRef<T extends ElementType, Own> = PolymorphicProps<T, Own> & {
  ref?: PolymorphicRef<T>;
};

/** Return type for a polymorphic component, so `as` narrows correctly. */
export type PolymorphicComponent<Default extends ElementType, Own> = <
  T extends ElementType = Default,
>(
  props: PolymorphicProps<T, Own>,
) => ReactElement | null;

/**
 * Same as {@link PolymorphicComponent}, but the component forwards a ref to
 * the underlying element. Declared as a callable rather than via
 * `ForwardRefExoticComponent` because that type erases the generic — it would
 * collapse `as` back to the default element.
 */
export type PolymorphicComponentWithRef<Default extends ElementType, Own> = <
  T extends ElementType = Default,
>(
  props: PolymorphicPropsWithRef<T, Own>,
) => ReactElement | null;
