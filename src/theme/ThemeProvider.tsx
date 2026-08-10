import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

/**
 * Every theme that ships with the library. `oblivion` is the base look and has
 * no override block of its own — selecting it simply falls through to the
 * defaults in `tokens.css`. The rest are `[data-ob-theme]` overrides.
 */
export const THEMES = [
  { id: 'oblivion', label: 'Oblivion' },
  { id: 'light', label: 'Light' },
  { id: 'beige', label: 'Beige' },
  { id: 'business', label: 'Business' },
  { id: 'minimal', label: 'Minimal' },
  { id: 'futuristic', label: 'Futuristic' },
  { id: 'emerald', label: 'Emerald' },
  { id: 'grape', label: 'Grape' },
  { id: 'sunset', label: 'Sunset' },
] as const;

export type ThemeId = (typeof THEMES)[number]['id'];

/** `system` follows the OS `prefers-color-scheme`. Only `minimal` ships a
 *  light variant today, but the attribute is set for every theme. */
export type ThemeMode = 'dark' | 'light' | 'system';

export interface ThemeContextValue {
  theme: ThemeId;
  setTheme: (theme: ThemeId) => void;
  /** The requested mode, as set (may be `system`). */
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  /** The mode actually applied after resolving `system`. */
  resolvedMode: 'dark' | 'light';
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export interface ThemeProviderProps {
  children: ReactNode;
  /** @default 'oblivion' */
  defaultTheme?: ThemeId;
  /** @default 'dark' */
  defaultMode?: ThemeMode;
  /**
   * Where to write `data-ob-theme` / `data-ob-mode`. Defaults to the document
   * root so page-level tokens (background, text) update too. Pass an element to
   * scope theming to a subtree instead.
   */
  target?: HTMLElement | null;
}

function systemPrefersLight(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-color-scheme: light)').matches;
}

/**
 * Optional React wrapper over the CSS `data-ob-theme` mechanism. Holds theme +
 * mode in state and mirrors them onto a DOM node. The library works without it
 * — this just gives you state-driven switching and a `useTheme()` hook.
 *
 * SSR-safe: no DOM access at import or render; all writes happen in effects.
 */
export function ThemeProvider({
  children,
  defaultTheme = 'oblivion',
  defaultMode = 'dark',
  target,
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<ThemeId>(defaultTheme);
  const [mode, setMode] = useState<ThemeMode>(defaultMode);
  const [systemLight, setSystemLight] = useState(false);

  // Track the OS preference so `mode: 'system'` can resolve.
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-color-scheme: light)');
    const sync = () => setSystemLight(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  const resolvedMode: 'dark' | 'light' =
    mode === 'system' ? (systemLight ? 'light' : 'dark') : mode;

  // Mirror onto the DOM.
  useEffect(() => {
    const el = target ?? (typeof document !== 'undefined' ? document.documentElement : null);
    if (!el) return;
    el.setAttribute('data-ob-theme', theme);
    el.setAttribute('data-ob-mode', resolvedMode);
  }, [theme, resolvedMode, target]);

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, setTheme, mode, setMode, resolvedMode }),
    [theme, mode, resolvedMode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/** Read and update the active theme/mode. Throws if used outside a provider. */
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a <ThemeProvider>.');
  }
  return ctx;
}

/** Non-throwing variant for components that may render outside a provider. */
export function useThemeOptional(): ThemeContextValue | null {
  return useContext(ThemeContext);
}

export { systemPrefersLight };
