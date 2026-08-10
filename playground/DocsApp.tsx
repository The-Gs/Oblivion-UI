import { useEffect, useState } from 'react';
import { GlassButton } from '../src';
import { GROUPS, PAGES, type DocPage } from './pages';
import { ThemeSwitcher } from './ThemeSwitcher';
import { Builder } from './builder/Builder';

function hashId(): string {
  return window.location.hash.replace(/^#\/?/, '');
}

function pageFromHash(): DocPage {
  const id = hashId();
  return PAGES.find((p) => p.id === id) ?? PAGES[0]!;
}

/** Sidebar docs shell — grouped nav, sticky top bar with the theme switcher,
 *  and a hash-routed content column. `#builder` swaps in the page builder.
 *  No routing dependency. */
export function DocsApp() {
  const [route, setRoute] = useState<string>(hashId);
  const [page, setPage] = useState<DocPage>(pageFromHash);

  useEffect(() => {
    const sync = () => {
      setRoute(hashId());
      setPage(pageFromHash());
      window.scrollTo({ top: 0 });
    };
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, []);

  const inBuilder = route === 'builder';

  return (
    <div className="docs">
      <header className="docs__topbar">
        <div className="docs__brand">
          <span className="docs__dot" />
          Oblivion<em>UI</em>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <GlassButton
            as="a"
            href={inBuilder ? '#introduction' : '#builder'}
            variant={inBuilder ? 'ghost' : 'secondary'}
            size="sm"
          >
            {inBuilder ? '← Docs' : '⊕ Builder'}
          </GlassButton>
          <span className="docs__ver">v0.3.0</span>
          <ThemeSwitcher />
        </div>
      </header>

      {inBuilder ? (
        <Builder />
      ) : (
        <div className="docs__body">
          <nav className="docs__sidebar" aria-label="Components">
            {GROUPS.map((group) => (
              <div className="docs__group" key={group}>
                <div className="docs__group-title">{group}</div>
                {PAGES.filter((p) => p.group === group).map((p) => (
                  <a
                    key={p.id}
                    href={`#${p.id}`}
                    className={'docs__link' + (p.id === page.id ? ' docs__link--active' : '')}
                    aria-current={p.id === page.id ? 'page' : undefined}
                  >
                    {p.label}
                  </a>
                ))}
              </div>
            ))}
          </nav>

          <main className="docs__main">{page.render()}</main>
        </div>
      )}
    </div>
  );
}
