import React from 'react';
import { FaGithub, FaArrowUpRightFromSquare } from 'react-icons/fa6';
import { categoryMeta } from '../lib/format';

function ProjectCard({ project }) {
  const { icon: CatIcon, color } = categoryMeta(project.category || '');

  const openLink = project.link?.startsWith('http')
    ? project.link
    : project.link
      ? `https://${project.link}`
      : null;
  const repoLink = project.repoLink?.startsWith('http')
    ? project.repoLink
    : project.repoLink
      ? `https://${project.repoLink}`
      : null;

  return (
    <article className="project-card" style={{ '--cat': color }}>
      <div className="project-card-media">
        {project.imageUrl ? (
          <img src={project.imageUrl} alt={project.title} loading="lazy" />
        ) : (
          <div className="project-card-placeholder">
            <CatIcon />
          </div>
        )}
        <span className="project-card-cat" style={{ background: color }}>
          <CatIcon />
          {project.category}
        </span>
      </div>
      <div className="project-card-body">
        <h4>{project.title}</h4>
        <p>{project.description}</p>
        <div className="project-card-links">
          {repoLink && (
            <a href={repoLink} target="_blank" rel="noreferrer" className="project-link">
              <FaGithub /> Repositorio
            </a>
          )}
          {openLink && (
            <a href={openLink} target="_blank" rel="noreferrer" className="project-link">
              <FaArrowUpRightFromSquare /> Demo
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export default ProjectCard;