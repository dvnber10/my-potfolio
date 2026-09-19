import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { FaDownload, FaCircleCheck, FaGraduationCap, FaBriefcase, FaLightbulb, FaGear } from 'react-icons/fa6';
import { cvPdfUrl } from '../lib/api';
import {
  profileIcon,
  categoryMeta,
} from '../lib/format';
import ProjectCard from '../components/ProjectCard';
import NotFound from './NotFound';
import { usePortfolio } from '../context/portfolio_context';
import '../styles/ProfilePage.scss';

function ProfilePage() {
  const { slug } = useParams();
  const { cv, loading } = usePortfolio();

  const profile = useMemo(() => cv?.profiles?.find((p) => p.slug === slug), [cv, slug]);
  const personal = cv?.personal || {};

  if (loading) {
    return (
      <div className="page-loading">
        <span className="spinner" />
      </div>
    );
  }
  if (!profile) return <NotFound personal={personal} />;

  const Icon = profileIcon(profile);
  const pdfUrl = cvPdfUrl(profile.slug);
  const projects = (cv.projects || [])
    .filter((p) => profile.slug === 'general' || (p.profiles || []).includes(profile.slug))
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));

  const experience = cv.experience || [];
  const inProfile = (e) => !e.profiles || e.profiles.length === 0 || (e.profiles || []).includes(profile.slug);
  const professionalExp = experience.filter((e) => e.type !== 'project' && inProfile(e));
  const personalProjectsExp = experience.filter((e) => e.type === 'project' && inProfile(e));
  const education = cv.education || [];
  const languages = cv.languages || [];
  const categories = [...new Set(projects.map((p) => p.category))];

  // Componentes que dependen de closures de manera estable
  const ClosureCatIcon = ({ name }) => {
    const { icon: C } = categoryMeta(name);
    return <C />;
  };
  const ClosureProfileIcon = () => <Icon />;

  return (
    <div className="profile-page">
      {/* HERO */}
      <section className="hero" style={{ '--accent': '#1f3a5f' }}>
        <div className="hero-avatar">
          {personal.photoUrl ? (
            <img src={personal.photoUrl} alt={personal.fullName} />
          ) : (
            <ClosureProfileIcon />
          )}
        </div>
        <div className="hero-text">
          <p className="hero-eyebrow">Portafolio profesional</p>
          <h1>{personal.fullName}</h1>
          <h2>{profile.title}</h2>
          <p className="hero-summary">{profile.summary}</p>
          <div className="hero-actions">
            {pdfUrl ? (
              <a className="btn btn-primary" href={pdfUrl}>
                <FaDownload /> Descargar CV (PDF)
              </a>
            ) : (
              <span className="btn btn-primary is-disabled" title="Configura REACT_APP_API_URL para descargar el PDF.">
                <FaDownload /> CV disponible a través de la API
              </span>
            )}
            {personal.github && (
              <a
                className="btn btn-ghost"
                href={personal.github.includes('://') ? personal.github : `https://${personal.github}`}
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
            )}
            {personal.linkedin && (
              <a
                className="btn btn-ghost"
                href={`https://linkedin.com/in/${personal.linkedin}`}
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
              </a>
            )}
          </div>
        </div>
      </section>

      {/* HIGHLIGHTS */}
      {profile.highlights && profile.highlights.length > 0 && (
        <section className="section highlights">
          <h3 className="section-title">
            <FaCircleCheck /> Logros destacados
          </h3>
          <div className="highlights-grid">
            {profile.highlights.map((h, i) => (
              <div className="highlight-card" key={i}>
                <FaCircleCheck className="highlight-check" />
                <span>{h}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* EXPERIENCE (profesional) */}
      {professionalExp.length > 0 && (
        <section className="section">
          <h3 className="section-title">
            <FaBriefcase /> Experiencia profesional
          </h3>
          <div className="timeline">
            {professionalExp.map((job, i) => (
              <div className="timeline-item" key={i}>
                <div className="timeline-dot" />
                <div className="timeline-card">
                  <div className="timeline-head">
                    <h4>{job.role}</h4>
                    <span className="timeline-period">{job.period}</span>
                  </div>
                  <p className="timeline-org">
                    {job.organization}
                    {job.location ? ` · ${job.location}` : ''}
                  </p>
                  {job.project && <p className="timeline-project">{job.project}</p>}
                  <ul className="timeline-bullets">
                    {(job.responsibilities || []).map((r, j) => (
                      <li key={j}>{r}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* EXPERIENCIA Y PROYECTOS PERSONALES / ACADÉMICOS */}
      {personalProjectsExp.length > 0 && (
        <section className="section">
          <h3 className="section-title section-title-soft">
            <FaGear /> Proyectos propios y académicos
          </h3>
          <div className="timeline">
            {personalProjectsExp.map((job, i) => (
              <div className="timeline-item" key={i}>
                <div className="timeline-dot" />
                <div className="timeline-card">
                  <div className="timeline-head">
                    <h4>{job.role}</h4>
                    <span className="timeline-period">{job.period}</span>
                  </div>
                  <p className="timeline-org">
                    {job.organization}
                    {job.location ? ` · ${job.location}` : ''}
                  </p>
                  {job.project && <p className="timeline-project">{job.project}</p>}
                  <ul className="timeline-bullets">
                    {(job.responsibilities || []).map((r, j) => (
                      <li key={j}>{r}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* PROJECTS */}
      {projects.length > 0 && (
        <section className="section">
          <div className="section-row">
            <h3 className="section-title">Proyectos relevantes</h3>
            <p className="section-sub">Todos mis proyectos.</p>
          </div>
          <div className="project-filters">
            <span className="filter-chip active">Todos</span>
            {categories.map((cat) => (
              <span key={cat} className="filter-chip">
                <ClosureCatIcon name={cat} key={`icon-${cat}`} /> {cat}
              </span>
            ))}
          </div>
          <div className="projects-grid">
            {projects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </section>
      )}

      {/* EDUCATION + SKILLS */}
      <div className="split">
        {education.length > 0 && (
          <section className="section">
            <h3 className="section-title">
              <FaGraduationCap /> Educación
            </h3>
            {education.map((edu, i) => (
              <div className="edu-card" key={i}>
                <div className="timeline-head">
                  <h4>{edu.degree}</h4>
                  <span className="timeline-period">{edu.period}</span>
                </div>
                <p className="timeline-org">
                  {edu.institution}
                  {edu.place ? ` · ${edu.place}` : ''}
                </p>
                {edu.detail && <p>{edu.detail}</p>}
              </div>
            ))}
          </section>
        )}

        <section className="section">
          <h3 className="section-title">
            <FaLightbulb /> Habilidades
          </h3>
          <div className="skills-cloud">
            {(profile.skills || []).map((skill, i) => (
              <span className="skill-chip" key={i}>
                {skill}
              </span>
            ))}
          </div>

          <h3 className="section-title section-title-soft">Idiomas</h3>
          <div className="lang-list">
            {languages.map((lang, i) => (
              <div className="lang-item" key={i}>
                <strong>{lang.name}</strong>
                <span>{lang.level}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* INTERESTS */}
      {profile.interests && (
        <section className="section">
          <h3 className="section-title">Intereses</h3>
          <p className="interests">{profile.interests}</p>
        </section>
      )}
    </div>
  );
}

export default ProfilePage;