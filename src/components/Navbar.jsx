import React, { useContext } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { FaMoon, FaSun } from 'react-icons/fa6';
import { ThemeContext } from '../context/theme_context';
import { profileIcon, navLabel, initials } from '../lib/format';
import '../styles/Navbar.scss';

function Navbar({ profiles = [], personal = {} }) {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { slug } = useParams();

  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-brand" end>
        <span className="navbar-brand-avatar">
          {personal.photoUrl ? (
            <img src={personal.photoUrl} alt={personal.fullName} />
          ) : (
            initials(personal.fullName)
          )}
        </span>
        <span className="navbar-brand-text">
          <span className="navbar-brand-name">{personal.fullName || 'Portafolio'}</span>
          <span className="navbar-brand-title">{personal.title}</span>
        </span>
      </NavLink>

      <div className="navbar-scroll">
        <div className="navbar-links">
          {profiles.map((p) => {
            const Icon = profileIcon(p);
            const active = slug === p.slug;
            return (
              <NavLink
                key={p.slug}
                to={`/${p.slug}`}
                className={active ? 'nav-pill active' : 'nav-pill'}
                title={p.title}
              >
                <Icon />
                {navLabel(p.slug, p)}
              </NavLink>
            );
          })}
        </div>
      </div>

      <div className="navbar-actions">
        <button onClick={toggleTheme} className="theme-toggle" aria-label="Cambiar tema">
          {theme === 'light' ? <FaMoon /> : <FaSun />}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;