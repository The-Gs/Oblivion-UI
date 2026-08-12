import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type RefObject } from 'react';

/** Elements the focus trap and menus consider tabbable. */
export const FOCUSABLE =
  'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';

/**
 * Lock background scroll while `active`, compensating for the scrollbar so the
 * page behind an overlay does not shift sideways when it disappears.
 */
export function useScrollLock(active: boolean): void {
  useEffect(() => {
    if (!active || typeof document === 'undefined') return;
    const { body, documentElement: html } = document;
    const gap = window.innerWidth - html.clientWidth;
    const prevOverflow = body.style.overflow;
    const prevPad = body.style.paddingRight;

    body.style.overflow = 'hidden';
    if (gap > 0) body.style.paddingRight = `${gap}px`;

    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPad;
    };
  }, [active]);
}

/**
 * Capture focus inside `ref` while `active`: move focus in on open, restore it
 * to whatever was focused before on close. Returns a keydown handler that
 * cycles Tab within the container — spread it onto the element you listen on.
 */
export function useFocusTrap<T extends HTMLElement>(
  active: boolean,
  ref: RefObject<T | null>,
): (e: KeyboardEvent) => void {
  const restoreTo = useRef<HTMLElement | null>(null);

  // Remember the trigger, then move focus into the container.
  useEffect(() => {
    if (!active || typeof document === 'undefined') return;
    restoreTo.current = document.activeElement as HTMLElement | null;
    const node = ref.current;
    if (node) {
      const first = node.querySelector<HTMLElement>(FOCUSABLE);
      (first ?? node).focus();
    }
    return () => restoreTo.current?.focus?.();
  }, [active, ref]);

  return useCallback(
    (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const node = ref.current;
      if (!node) return;
      const nodes = Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (n) => n.offsetParent !== null,
      );
      if (nodes.length === 0) return;

      const first = nodes[0]!;
      const last = nodes[nodes.length - 1]!;
      const activeEl = document.activeElement;

      if (e.shiftKey && (activeEl === first || activeEl === node)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && activeEl === last) {
        e.preventDefault();
        first.focus();
      }
    },
    [ref],
  );
}

/** Call `handler` when Escape is pressed anywhere, while `active`. */
export function useOnEscape(active: boolean, handler: () => void): void {
  useEffect(() => {
    if (!active || typeof document === 'undefined') return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        handler();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [active, handler]);
}

/**
 * Call `handler` on a pointer press outside every element in `refs`, while
 * `active`. Useful for dismissing menus, popovers, and comboboxes.
 */
export function useOutsideClick(
  refs: Array<RefObject<HTMLElement | null>>,
  handler: () => void,
  active = true,
): void {
  useEffect(() => {
    if (!active || typeof document === 'undefined') return;
    const onDown = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node | null;
      if (!target) return;
      const inside = refs.some((r) => r.current?.contains(target));
      if (!inside) handler();
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('touchstart', onDown);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('touchstart', onDown);
    };
  }, [refs, handler, active]);
}

/**
 * Returns `document.body` once mounted on the client, `null` on the server and
 * first render. Pass the result to `createPortal` so SSR stays safe.
 */
export function usePortal(): HTMLElement | null {
  const [container, setContainer] = useState<HTMLElement | null>(null);
  useEffect(() => {
    setContainer(document.body);
  }, []);
  return container;
}

/**
 * Controlled/uncontrolled state in one hook. If `controlled` is defined the
 * component is controlled and this echoes it; otherwise it owns local state.
 * `onChange` always fires so a controlled parent can react.
 */
export function useControllableState<T>(
  controlled: T | undefined,
  defaultValue: T,
  onChange?: (value: T) => void,
): [T, (value: T) => void] {
  const [uncontrolled, setUncontrolled] = useState<T>(defaultValue);
  const isControlled = controlled !== undefined;
  const value = isControlled ? (controlled as T) : uncontrolled;

  const setValue = useCallback(
    (next: T) => {
      if (!isControlled) setUncontrolled(next);
      onChange?.(next);
    },
    [isControlled, onChange],
  );

  return [value, setValue];
}

/**
 * Boolean open/close state for modals, drawers, menus — Chakra's `useDisclosure`.
 * `onOpen`/`onClose`/`onToggle` are stable callbacks.
 */
export function useDisclosure(defaultOpen = false): {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  onToggle: () => void;
  setOpen: (open: boolean) => void;
} {
  const [open, setOpen] = useState(defaultOpen);
  const onOpen = useCallback(() => setOpen(true), []);
  const onClose = useCallback(() => setOpen(false), []);
  const onToggle = useCallback(() => setOpen((v) => !v), []);
  return { open, onOpen, onClose, onToggle, setOpen };
}

/**
 * Copy text to the clipboard and expose a `copied` flag that resets after
 * `timeout` ms — Chakra's `useClipboard`.
 */
export function useClipboard(text: string, timeout = 1500): { copied: boolean; copy: () => void } {
  const [copied, setCopied] = useState(false);
  const copy = useCallback(() => {
    if (typeof navigator === 'undefined') return;
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), timeout);
    });
  }, [text, timeout]);
  return { copied, copy };
}

/**
 * Track a media query. SSR-safe: returns `false` until mounted, then subscribes.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mql = window.matchMedia(query);
    setMatches(mql.matches);
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);
  return matches;
}
