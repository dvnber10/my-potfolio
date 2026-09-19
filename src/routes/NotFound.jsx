import React from 'react';
import { Link } from 'react-router-dom';
import { FaCompass } from 'react-icons/fa6';

function NotFound({ personal = {} }) {
  return (
    <div className="notfound">
      <FaCompass className="notfound-icon" />
      <h1>404</h1>
      <p>La página o perfil que buscas no existe.</p>
      <Link className="btn btn-primary" to="/">
        Volver al portafolio
      </Link>
    </div>
  );
}

export default NotFound;