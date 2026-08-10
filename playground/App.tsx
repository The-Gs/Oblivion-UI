import { useEffect, useState } from 'react';
import { ThemeProvider, ToastProvider } from '../src';
import { Landing } from './Landing';
import { Components } from './Components';
import { ThemeSwitcher } from './ThemeSwitcher';

type Page = 'landing' | 'components';

/** Tiny hash router — the playground doesn't warrant a routing dependency. */
function pageFromHash(): Page {
  return window.location.hash === '#components' ? 'components' : 'landing';
}

export function App() {
  const [page, setPage] = useState<Page>(pageFromHash);

  useEffect(() => {
    const sync = () => setPage(pageFromHash());
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, []);

  const navigate = (next: Page) => {
    window.location.hash = next === 'components' ? '#components' : '';
    setPage(next);
    window.scrollTo({ top: 0 });
  };

  return (
    <ThemeProvider defaultTheme="oblivion" defaultMode="dark">
      <ToastProvider>
        <ThemeSwitcher />
        {page === 'components' ? (
          <Components onNavigate={navigate} />
        ) : (
          <Landing onNavigate={navigate} />
        )}
      </ToastProvider>
    </ThemeProvider>
  );
}
