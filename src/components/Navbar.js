// src/components/Navbar/Navbar.jsx
import React, { useContext } from 'react';
import { ThemeContext } from '../context/theme_context';
import { FaMoon, FaSun } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import { CgCloseR } from "react-icons/cg";
import { LuSquareMenu } from "react-icons/lu";
import '../styles/Navbar.scss'


const Navbar = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [Menu, setMenu] = React.useState(false);

  return (
    <nav className="navbar">
      <h1>Mi Portafolio</h1>
      <div className={Menu ? 'nav-links active' : 'nav-links'}>
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? 'active' : '')}
        >
          Inicio
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) => (isActive ? 'active' : '')}
        >
          Sobre mí
        </NavLink>
        <NavLink
          to="/projects"
          className={({ isActive }) => (isActive ? 'active' : '')}
        >
          Proyectos
        </NavLink>
        <NavLink
          to="/contact"
          className={({ isActive }) => (isActive ? 'active' : '')}
        >
          Contacto
        </NavLink>

        <button onClick={toggleTheme} className="theme-toggle">
          {theme === 'light' ? <FaMoon /> : <FaSun />}
          <span>{theme === 'light' ? 'Modo Oscuro' : 'Modo Claro'}</span>
        </button>
      </div>

      <button
        className='menu-icon'
        colorScheme="teal"
        onClick={() => setMenu(!Menu)}
        >
          <span>{Menu ? <CgCloseR /> : <LuSquareMenu />}</span>
      </button>
      </nav>
  );
};

export default Navbar;