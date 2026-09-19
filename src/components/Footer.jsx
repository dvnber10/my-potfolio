import React from 'react';
import { FaGithub, FaLinkedin, FaEnvelope, FaWhatsapp } from 'react-icons/fa6';
import '../styles/Footer.scss';

function Footer({ personal = {}, onDownload, visits }) {
  const iconProps = { className: 'footer-icon' };

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <strong>{personal.fullName}</strong>
          <span>{personal.title}</span>
        </div>

        <div className="footer-contact">
          {personal.email && (
            <a href={`mailto:${personal.email}`} aria-label="Email">
              <FaEnvelope {...iconProps} />
            </a>
          )}
          {personal.github && (
            <a
              href={personal.github.includes('://') ? personal.github : `https://${personal.github}`}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
            >
              <FaGithub {...iconProps} />
            </a>
          )}
          {personal.linkedin && (
            <a
              href={`https://linkedin.com/in/${personal.linkedin}`}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
            >
              <FaLinkedin {...iconProps} />
            </a>
          )}
          <a href="https://wa.me/573134251767" target="_blank" rel="noreferrer" aria-label="WhatsApp">
            <FaWhatsapp {...iconProps} />
          </a>
        </div>

        {onDownload && (
          <button className="footer-cv" onClick={onDownload}>
            Descargar CV
          </button>
        )}
      </div>
      <p className="footer-copy">
        © {new Date().getFullYear()} {personal.fullName || 'Portafolio'} · Hecho con React y .NET
        {visits != null && (
          <span className="footer-visits"> · {visits.toLocaleString('es-ES')} visitas</span>
        )}
      </p>
    </footer>
  );
}

export default Footer;