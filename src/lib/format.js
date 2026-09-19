// src/lib/format.js — metadatos de categorías, perfiles y utilidades
import {
  FaServer,
  FaCode,
  FaRobot,
  FaEye,
  FaBrain,
  FaDocker,
  FaLayerGroup,
  FaUser,
  FaGear,
  FaChartBar,
  FaFlask,
  FaJava,
  FaPython,
  FaDatabase,
  FaAtom,
  FaMobileScreenButton,
  FaCloud,
  FaDesktop,
  FaGlobe,
} from 'react-icons/fa6';

export const CATEGORIES = {
  'Backend': { icon: FaServer, color: '#0ea5e9' },
  'Frontend': { icon: FaCode, color: '#f97316' },
  'IA · Lenguaje': { icon: FaBrain, color: '#a855f7' },
  'IA · Visión': { icon: FaEye, color: '#8b5cf6' },
  'IA · Machine Learning': { icon: FaRobot, color: '#ec4899' },
  'DevOps': { icon: FaDocker, color: '#06b6d4' },
  'Full Stack': { icon: FaLayerGroup, color: '#10b981' },
};

// Iconos por slug (perfiles existentes) y por clave de icono (perfiles nuevos).
export const PROFILE_ICONS = {
  user: FaUser,
  gear: FaGear,
  robot: FaRobot,
  brain: FaBrain,
  chart: FaChartBar,
  flask: FaFlask,
  general: FaUser,
  'backend-net': FaGear,
  ia: FaRobot,
  'analista-datos': FaChartBar,
  'cientifico-datos': FaFlask,
  java: FaJava,
  python: FaPython,
  sql: FaDatabase,
  react: FaAtom,
  mobile: FaMobileScreenButton,
  cloud: FaCloud,
  desktop: FaDesktop,
  globe: FaGlobe,
};

export const PROFILE_ICON_OPTIONS = [
  { key: 'user', label: 'General', Icon: FaUser },
  { key: 'gear', label: 'Ingeniería', Icon: FaGear },
  { key: 'robot', label: 'IA', Icon: FaRobot },
  { key: 'brain', label: 'IA · cerebro', Icon: FaBrain },
  { key: 'chart', label: 'Análisis de datos', Icon: FaChartBar },
  { key: 'flask', label: 'Ciencia de datos', Icon: FaFlask },
  { key: 'java', label: 'Java', Icon: FaJava },
  { key: 'python', label: 'Python', Icon: FaPython },
  { key: 'sql', label: 'Base de datos', Icon: FaDatabase },
  { key: 'react', label: 'React', Icon: FaAtom },
  { key: 'mobile', label: 'Móvil', Icon: FaMobileScreenButton },
  { key: 'cloud', label: 'Cloud', Icon: FaCloud },
  { key: 'desktop', label: 'Escritorio', Icon: FaDesktop },
  { key: 'globe', label: 'Web', Icon: FaGlobe },
];

export function categoryMeta(name) {
  return CATEGORIES[name] || { icon: FaCode, color: '#64748b' };
}

export function profileIcon(profile) {
  const obj = profile && typeof profile === 'object' ? profile : null;
  const slug = obj ? obj.slug : profile;
  const iconKey = obj?.icon ? String(obj.icon).toLowerCase() : null;
  if (iconKey && PROFILE_ICONS[iconKey]) return PROFILE_ICONS[iconKey];
  return (slug && PROFILE_ICONS[slug]) || FaUser;
}

const NAV_LABELS = {
  general: 'General',
  'backend-net': '.NET',
  ia: 'IA',
  'analista-datos': 'Análisis',
  'cientifico-datos': 'C. Datos',
};

export function navLabel(slug, profile) {
  return NAV_LABELS[slug] || profile?.shortTitle || slug;
}

export function initials(name) {
  if (!name) return '';
  const words = name.split(/\s+/).filter(Boolean);
  if (words.length === 0) return '';
  if (words.length === 1) return words[0].slice(0, 1).toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

export function profileShortName(profile) {
  return profile?.shortTitle || profile?.title || profile?.slug || '';
}

export function compactSummary(text, max = 200) {
  if (!text) return '';
  return text.length > max ? `${text.slice(0, max).trimEnd()}…` : text;
}