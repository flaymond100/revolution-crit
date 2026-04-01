import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import logoImg from '../../public/assets/logo.png';

const primaryLinks = [
  { label: 'Home', to: '/' },
  { label: 'Races', to: '/races' },
  { label: 'Results', to: '/results' },
  // { label: 'Categories', to: '/categories' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'About', to: '/about' },
];

const utilityLinks = [
  { label: 'Training Camp', to: '/training-camp' },
  { label: 'Partners', to: '/partners' },
  { label: 'FAQ', to: '/faq' },
];

function navLinkClass(isActive: boolean) {
  return [
    'rounded-full px-4 py-2 text-sm font-medium transition',
    isActive
      ? 'bg-[color:var(--surface-light)] !text-black'
      : 'text-[color:var(--text-secondary-dark)] hover:bg-white/5 hover:text-[color:var(--text-primary-dark)]',
  ].join(' ');
}

export function Header() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-(--border-dark) bg-[rgba(11,15,20,0.84)] backdrop-blur-xl">
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
          <nav aria-label="Secondary" className="flex items-center gap-1">
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
          </nav>

          {/* <Link className="cta-button" to="/races">
            Register Now
          </Link> */}
        </div>

        <button
          aria-controls="mobile-navigation"
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[color:var(--border-dark)] bg-white/5 text-[color:var(--text-primary-dark)] transition hover:border-[color:var(--accent-secondary)] hover:text-[color:var(--accent-secondary)] lg:hidden"
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
                isMenuOpen ? 'M6 6l12 12M18 6L6 18' : 'M4 7h16M4 12h16M4 17h16'
              }
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.8"
            />
          </svg>
        </button>
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
              {utilityLinks.map(link => (
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
              ))}
            </nav>

            <Link className="cta-button justify-center text-center" to="/races">
              View Upcoming Races
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
