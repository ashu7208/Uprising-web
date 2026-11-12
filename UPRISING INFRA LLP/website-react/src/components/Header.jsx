import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useSiteContent } from '../services/siteContent';

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/projects', label: 'Projects' },
  { to: '/#faqs', label: 'FAQs', hash: true },
  { to: '/contact', label: 'Contact' }
];

export default function Header() {
  const site = useSiteContent();
  const items = site?.nav?.length
    ? site.nav.map(({ label, link }) => {
        const to = link || '/';
        return { to, label, hash: to.includes('#') };
      })
    : navItems;
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(window.scrollY > 12);
  const { pathname } = useLocation();

  useEffect(() => {
    setOpen(false);
    setScrolled(window.scrollY > 12);
  }, [pathname]);

  useEffect(() => {
    const updateScrollState = () => {
      setScrolled(window.scrollY > 12);
    };

    window.addEventListener('scroll', updateScrollState, { passive: true });
    updateScrollState();
    return () => window.removeEventListener('scroll', updateScrollState);
  }, []);

  return (
    <header className={`site-header${scrolled ? ' scrolled' : ''}${pathname === '/' || pathname === '/about' ? ' site-header--hero' : ''}`}>
      <div className="container nav-wrap">
        <NavLink to="/" className="brand" aria-label="Uprising Infra home">
          <img src="/assets/logo-icon.jpg" alt="" className="brand-mark" />
          <span className="brand-text">
            UPRISING
            <br />
            INFRA LLP
            <small>Civil Construction | Electrical | Water</small>
          </span>
        </NavLink>

        <nav className={`main-nav ${open ? 'open' : ''}`} aria-label="Main navigation">
          {items.map((item) => {
            const classes = ({ isActive }) => `nav-link${isActive ? ' active' : ''}`;

            if (item.hash) {
              return (
                <div className="nav-item" key={item.label}>
                  <Link to={item.to} className="nav-link" onClick={() => setOpen(false)}>
                    {item.label}
                  </Link>
                </div>
              );
            }

            return (
              <div className="nav-item" key={item.to}>
                <NavLink to={item.to} end={item.to === '/'} className={classes} onClick={() => setOpen(false)}>
                  {item.label}
                </NavLink>
              </div>
            );
          })}
        </nav>

        <button
          className={`nav-toggle ${open ? 'open' : ''}`}
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
