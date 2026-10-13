import { NavLink, Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { nav } from '../data.js';
import { useSite } from '../SiteContext.jsx';

export default function Header() {
  const [open, setOpen] = useState(false);
  const { site } = useSite();
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const solid = scrolled || pathname === '/domain';
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 10);
    f();
    window.addEventListener('scroll', f, { passive: true });
    return () => window.removeEventListener('scroll', f);
  }, []);
  return (
    <header className={`header ${solid ? 'scrolled' : ''}`}>
      <div className="header-in">
        <Link to="/" className="logo">{site.logo_url ? <img src={site.logo_url} alt={site.name} className="logo-img" /> : site.name}</Link>
        <button className="burger" onClick={() => setOpen(!open)} aria-label="Menu">☰</button>
        <nav className={open ? 'nav open' : 'nav'} onClick={() => setOpen(false)}>
          {nav.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.to === '/'}>{n.label}</NavLink>
          ))}
        </nav>
        <Link to="/contact" className="btn sm">Request a Demo</Link>
      </div>
    </header>
  );
}
