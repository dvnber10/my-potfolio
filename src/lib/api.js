// src/lib/api.js — acceso a la API del backend con fallback a data local
import localCv from '../data/cv.json';

export function getApiUrl() {
  const fromEnv = (process.env.REACT_APP_API_URL || '').replace(/\/+$/, '');
  if (fromEnv) return fromEnv;
  // En desarrollo, conéctate automáticamente al backend local.
  if (process.env.NODE_ENV === 'development') return 'http://localhost:5227';
  return '';
}

export async function fetchCvData() {
  const base = getApiUrl();
  if (!base) return localCv;
  try {
    const res = await fetch(`${base}/api/cv`, {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data && data.json) return JSON.parse(data.json);
    return localCv;
  } catch (err) {
    console.warn('No se pudo conectar a la API, usando datos locales.', err);
    return localCv;
  }
}

export function cvPdfUrl(slug) {
  const base = getApiUrl();
  return base ? `${base}/api/cvs/${slug}?download=1` : null;
}

export async function registerVisit() {
  const base = getApiUrl();
  if (!base) return null;
  try {
    const res = await fetch(`${base}/api/stats/visits`, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data && typeof data.visits === 'number' ? data.visits : null;
  } catch (err) {
    console.warn('No se pudo registrar la visita.', err);
    return null;
  }
}

export async function fetchVisitCount() {
  const base = getApiUrl();
  if (!base) return null;
  try {
    const res = await fetch(`${base}/api/stats/visits`, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data && typeof data.visits === 'number' ? data.visits : null;
  } catch (err) {
    console.warn('No se pudo leer el contador de visitas.', err);
    return null;
  }
}

export async function adminAuth(key) {
  const base = getApiUrl();
  if (!base) return false;
  const res = await fetch(`${base}/api/admin/auth`, {
    method: 'POST',
    headers: { 'X-Admin-Key': key, Accept: 'application/json' },
  });
  const data = await res.json();
  return !!(data && data.valid);
}

export async function adminGetCv(key) {
  const base = getApiUrl();
  const res = await fetch(`${base}/api/admin/cv`, {
    method: 'GET',
    headers: { 'X-Admin-Key': key, Accept: 'application/json' },
  });
  const data = await res.json();
  return res.ok && data.json ? data.json : null;
}

export async function adminPutCv(key, json) {
  const base = getApiUrl();
  const res = await fetch(`${base}/api/admin/cv`, {
    method: 'PUT',
    headers: { 'X-Admin-Key': key, 'Content-Type': 'application/json' },
    body: JSON.stringify({ json }),
  });
  return res.json();
}

export function adminCvPreviewUrl(slug, key) {
  const base = getApiUrl();
  if (!base) return null;
  const url = new URL(`${base}/api/cvs/${slug}`);
  url.searchParams.set('download', '0');
  return url.toString();
}