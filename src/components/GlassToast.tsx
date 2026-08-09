import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../lib/cn';
import { GlassSurface } from './GlassSurface';
import './GlassToast.css';

export type ToastTone = 'accent' | 'danger' | 'neutral';
export type ToastPlacement = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';

export interface ToastOptions {
  tone?: ToastTone;
  /** Milliseconds before auto-dismiss. `0` keeps it until dismissed. @default 3800 */
  duration?: number;
}

interface ToastRecord extends Required<ToastOptions> {
  id: string;
  message: ReactNode;
}

export interface ToastApi {
  /** Push a toast. Returns its id so you can dismiss it early. */
  toast: (message: ReactNode, options?: ToastOptions) => string;
  dismiss: (id: string) => void;
  clear: () => void;
}

const ToastContext = createContext<ToastApi | null>(null);

/**
 * Access the toast queue. Must be called under a {@link ToastProvider}.
 *
 * Throws rather than silently no-opping — a toast that never appears is far
 * harder to debug than a missing provider.
 */
export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside a <ToastProvider>');
  return ctx;
}

export interface ToastProviderProps {
  children?: ReactNode;
  /** @default 'bottom-right' */
  placement?: ToastPlacement;
  /** Oldest toasts drop off past this many. @default 4 */
  limit?: number;
}

/** Holds the toast queue and renders the stack through a portal. */
export function ToastProvider({
  children,
  placement = 'bottom-right',
  limit = 4,
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastRecord[]>([]);
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>());

  const dismiss = useCallback((id: string) => {
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (message: ReactNode, options: ToastOptions = {}) => {
      const { tone = 'accent', duration = 3800 } = options;
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

      setToasts((prev) => [...prev, { id, message, tone, duration }].slice(-limit));

      if (duration > 0) {
        timers.current.set(
          id,
          setTimeout(() => dismiss(id), duration),
        );
      }
      return id;
    },
    [dismiss, limit],
  );

  const clear = useCallback(() => {
    for (const timer of timers.current.values()) clearTimeout(timer);
    timers.current.clear();
    setToasts([]);
  }, []);

  // Any toast still pending when the provider unmounts would fire setState
  // on a dead component.
  useEffect(() => {
    const pending = timers.current;
    return () => {
      for (const timer of pending.values()) clearTimeout(timer);
      pending.clear();
    };
  }, []);

  const api = useMemo<ToastApi>(() => ({ toast, dismiss, clear }), [toast, dismiss, clear]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      {typeof document !== 'undefined'
        ? createPortal(
            <div
              className={cn('ob-toasts', `ob-toasts--${placement}`)}
              role="region"
              aria-label="Notifications"
            >
              {toasts.map((t) => (
                <GlassSurface
                  key={t.id}
                  elevation="overlay"
                  radius="md"
                  className={cn('ob-toast', t.tone !== 'accent' && `ob-toast--${t.tone}`)}
                  // Assertive would interrupt a screen reader mid-sentence;
                  // these are incidental confirmations, not alarms.
                  role="status"
                  aria-live="polite"
                >
                  <span className="ob-toast__dot" aria-hidden="true" />
                  <span className="ob-toast__msg">{t.message}</span>
                  <button
                    type="button"
                    className="ob-toast__close ob-reset-button"
                    aria-label="Dismiss notification"
                    onClick={() => dismiss(t.id)}
                  >
                    ×
                  </button>
                </GlassSurface>
              ))}
            </div>,
            document.body,
          )
        : null}
    </ToastContext.Provider>
  );
}
