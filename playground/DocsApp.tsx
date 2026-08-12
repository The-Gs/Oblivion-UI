import { useEffect, useState } from 'react';
import { GlassButton } from '../src';
import { GROUPS, PAGES, type DocPage } from './pages';
import { ThemeSwitcher } from './ThemeSwitcher';
import { ThemeStudio } from './ThemeStudio';
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
  // Which sidebar groups are expanded. Start with the active page's group open.
  const [openGroups, setOpenGroups] = useState<Set<string>>(() => new Set([pageFromHash().group]));

  useEffect(() => {
    const sync = () => {
      setRoute(hashId());
      const next = pageFromHash();
      setPage(next);
      // Keep the active page's group expanded when navigating.
      setOpenGroups((prev) => (prev.has(next.group) ? prev : new Set(prev).add(next.group)));
      window.scrollTo({ top: 0 });
    };
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, []);

  const toggleGroup = (group: string) =>
    setOpenGroups((prev) => {
      const next = new Set(prev);
      next.has(group) ? next.delete(group) : next.add(group);
      return next;
    });

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
          <ThemeStudio />
          <ThemeSwitcher />
        </div>
      </header>

      {inBuilder ? (
        <Builder />
      ) : (
        <div className="docs__body">
          <nav className="docs__sidebar" aria-label="Components">
            {GROUPS.map((group) => {
              const pages = PAGES.filter((p) => p.group === group);
              const open = openGroups.has(group);
              const count = pages.length;
              return (
                <div className="docs__group" key={group} data-open={open}>
                  <button
                    type="button"
                    className="docs__group-toggle"
                    aria-expanded={open}
                    onClick={() => toggleGroup(group)}
                  >
                    <span className="docs__chev" aria-hidden="true">
                      ▸
                    </span>
                    <span className="docs__group-name">{group}</span>
                    <span className="docs__group-count">{count}</span>
                  </button>
                  {open ? (
                    <div className="docs__group-items">
                      {pages.map((p) => (
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
                  ) : null}
                </div>
              );
            })}
          </nav>

          <main className="docs__main">{page.render()}</main>
        </div>
      )}
    </div>
  );
}
