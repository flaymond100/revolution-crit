import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import logoImg from '../../public/assets/logo.png';

const primaryLinks = [
  { label: 'Home', to: '/' },
  { label: 'Calendar', to: '/calendar' },
  { label: 'Results', to: '/results' },
  // { label: 'Categories', to: '/categories' },
  // { label: 'Gallery', to: '/gallery' },
  { label: 'About', to: '/about' },
];

// const utilityLinks = [
//   { label: 'Training Camp', to: '/training-camp' },
//   { label: 'Partners', to: '/partners' },
//   { label: 'FAQ', to: '/faq' },
// ];

function navLinkClass(isActive: boolean) {
  return [
    'rounded-full px-4 py-2 text-sm font-medium transition',
    isActive
      ? 'bg-[color:var(--nav-active-bg)] text-[color:var(--nav-active-text)]'
      : 'text-[color:var(--text-secondary-dark)] hover:bg-white/5 hover:text-[color:var(--text-primary-dark)]',
  ].join(' ');
}

type Theme = 'dark' | 'light';

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') {
    return 'dark';
  }

  const storedTheme = window.localStorage.getItem('theme');
  if (storedTheme === 'light' || storedTheme === 'dark') {
    return storedTheme;
  }

  return window.matchMedia('(prefers-color-scheme: light)').matches
    ? 'light'
    : 'dark';
}

function ThemeIcon({ isLightTheme }: { isLightTheme: boolean }) {
  return isLightTheme ? (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
      <path
        d="M20 12.79A9 9 0 1 1 11.21 4a7 7 0 0 0 8.79 8.79Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  ) : (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 3v2M12 19v2M3 12h2M19 12h2M5.64 5.64l1.41 1.41M16.95 16.95l1.41 1.41M18.36 5.64l-1.41 1.41M7.05 16.95l-1.41 1.41"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export function Header() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const isLightTheme = theme === 'light';

  return (
    <header className="sticky top-0 z-50 border-b border-(--border-dark) bg-[color:var(--header-bg)] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" aria-label="Revolution Crit home">
          <img
            alt="Revolution Crit"
            className="max-h-12.5"
            src={logoImg}
          />{' '}
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {primaryLinks.map(link => (
            <NavLink
              key={link.to}
              className={({ isActive }) => navLinkClass(isActive)}
              to={link.to}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {/* <nav aria-label="Secondary" className="flex items-center gap-1">
            {utilityLinks.map(link => (
              <NavLink
                key={link.to}
                className={({ isActive }) =>
                  [
                    'rounded-full px-3 py-2 text-sm transition',
                    isActive
                      ? 'text-black'
                      : 'text-[color:var(--text-secondary-dark)] hover:text-[color:var(--text-primary-dark)]',
                  ].join(' ')
                }
                to={link.to}
              >
                {link.label}
              </NavLink>
            ))}
          </nav> */}

          {/* <Link className="cta-button" to="/calendar">
            Register Now
          </Link> */}

          <button
            aria-label={
              isLightTheme ? 'Switch to dark theme' : 'Switch to light theme'
            }
            className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border-dark)] bg-[color:var(--surface-soft)] px-3 py-2 text-sm font-medium text-[color:var(--text-primary-dark)] transition hover:border-[color:var(--accent-secondary)] hover:text-[color:var(--accent-secondary)]"
            onClick={() =>
              setTheme(current => (current === 'dark' ? 'light' : 'dark'))
            }
            type="button"
          >
            <ThemeIcon isLightTheme={isLightTheme} />
            {/* <span>{isLightTheme ? 'Dark' : 'Light'}</span> */}
          </button>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <button
            aria-label={
              isLightTheme ? 'Switch to dark theme' : 'Switch to light theme'
            }
            className="inline-flex h-12 min-w-12 items-center justify-center rounded-full border border-[color:var(--border-dark)] bg-[color:var(--surface-soft)] px-3 text-[color:var(--text-primary-dark)] transition hover:border-[color:var(--accent-secondary)] hover:text-[color:var(--accent-secondary)]"
            onClick={() =>
              setTheme(current => (current === 'dark' ? 'light' : 'dark'))
            }
            type="button"
          >
            <ThemeIcon isLightTheme={isLightTheme} />
          </button>

          <button
            aria-controls="mobile-navigation"
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[color:var(--border-dark)] bg-[color:var(--surface-soft)] text-[color:var(--text-primary-dark)] transition hover:border-[color:var(--accent-secondary)] hover:text-[color:var(--accent-secondary)]"
            onClick={() => setIsMenuOpen(current => !current)}
            type="button"
          >
            <span className="sr-only">Toggle navigation</span>
            <svg
              aria-hidden="true"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                d={
                  isMenuOpen
                    ? 'M6 6l12 12M18 6L6 18'
                    : 'M4 7h16M4 12h16M4 17h16'
                }
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
              />
            </svg>
          </button>
        </div>
      </div>

      {isMenuOpen ? (
        <div
          id="mobile-navigation"
          className="border-t border-[color:var(--border-dark)] bg-[color:var(--bg-secondary)] lg:hidden"
        >
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6">
            <nav aria-label="Mobile primary" className="grid gap-2">
              {primaryLinks.map(link => (
                <NavLink
                  key={link.to}
                  className={({ isActive }) => navLinkClass(isActive)}
                  to={link.to}
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            <nav
              aria-label="Mobile secondary"
              className="grid gap-2 border-t border-[color:var(--border-dark)] pt-5"
            >
              {/* {utilityLinks.map(link => (
                <NavLink
                  key={link.to}
                  className={({ isActive }) =>
                    [
                      'rounded-2xl border px-4 py-3 text-sm transition',
                      isActive
                        ? 'border-[color:var(--accent-secondary)] text-[color:var(--text-primary-dark)]'
                        : 'border-[color:var(--border-dark)] text-[color:var(--text-secondary-dark)] hover:text-[color:var(--text-primary-dark)]',
                    ].join(' ')
                  }
                  to={link.to}
                >
                  {link.label}
                </NavLink>
              ))} */}
            </nav>

            <Link
              className="cta-button justify-center text-center"
              to="/calendar"
            >
              View Upcoming Races
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
