import { NavLink, Link } from 'react-router-dom';
import { useState } from 'react';
import { nav, site } from '../data.js';

export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="header">
      <div className="header-in">
        <Link to="/" className="logo">{site.name}</Link>
        <button className="burger" onClick={() => setOpen(!open)} aria-label="Menu">☰</button>
        <nav className={open ? 'nav open' : 'nav'} onClick={() => setOpen(false)}>
          {nav.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.to === '/'}>{n.label}</NavLink>
          ))}
        </nav>
        <Link to="/contact" className="btn btn-sm">Request a Demo</Link>
      </div>
    </header>
  );
}
