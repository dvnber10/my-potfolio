import React, { useEffect, useState } from 'react';
import {
  FaShieldHalved,
  FaFloppyDisk,
  FaRotate,
  FaKey,
  FaEye,
  FaPlus,
  FaPen,
  FaDownload,
  FaXmark,
  FaList,
  FaUser,
  FaCode,
  FaFilePdf,
  FaFolderOpen,
  FaBriefcase,
} from 'react-icons/fa6';
import { getApiUrl, adminAuth, adminGetCv, adminPutCv, cvPdfUrl, fetchVisitCount } from '../lib/api';
import { usePortfolio } from '../context/portfolio_context';
import { PROFILE_ICON_OPTIONS, profileIcon, CATEGORIES, categoryMeta } from '../lib/format';
import '../styles/Admin.scss';

const KEY_STORAGE = 'portfolio_admin_key';

const TABS = [
  { id: 'cvs', label: 'Mis CVs', Icon: FaList },
  { id: 'projects', label: 'Proyectos', Icon: FaFolderOpen },
  { id: 'exp', label: 'Experiencia', Icon: FaBriefcase },
  { id: 'personal', label: 'Datos personales', Icon: FaUser },
  { id: 'json', label: 'JSON (avanzado)', Icon: FaCode },
  { id: 'pdfs', label: 'PDFs generados', Icon: FaFilePdf },
];

function clone(obj) {
  return obj ? JSON.parse(JSON.stringify(obj)) : obj;
}

function TagEditor({ value, onChange, placeholder }) {
  const [text, setText] = useState('');
  const add = () => {
    const t = text.trim();
    if (t && !value.includes(t)) onChange([...value, t]);
    setText('');
  };
  return (
    <div className="adm-tags">
      {value.map((t) => (
        <span className="adm-tag" key={t}>
          {t}
          <button type="button" onClick={() => onChange(value.filter((x) => x !== t))}>
            <FaXmark />
          </button>
        </span>
      ))}
      <input
        className="adm-tag-input"
        value={text}
        placeholder={placeholder}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            add();
          }
        }}
        onBlur={add}
      />
    </div>
  );
}

function ListEditor({ value, onChange, placeholder }) {
  const [text, setText] = useState('');
  const add = () => {
    const t = text.trim();
    if (t && !value.includes(t)) onChange([...value, t]);
    setText('');
  };
  const move = (i, dir) => {
    const arr = [...value];
    const j = i + dir;
    if (j < 0 || j >= arr.length) return;
    [arr[i], arr[j]] = [arr[j], arr[i]];
    onChange(arr);
  };
  return (
    <div className="adm-list-editor">
      {value.map((item, i) => (
        <div className="adm-list-row" key={i}>
          <span className="adm-list-drag" onClick={() => move(i, -1)} title="Subir">↑</span>
          <span className="adm-list-drag" onClick={() => move(i, 1)} title="Bajar">↓</span>
          <input
            value={item}
            onChange={(e) => onChange(value.map((x, j) => (j === i ? e.target.value : x)))}
          />
          <button type="button" className="adm-list-remove" onClick={() => onChange(value.filter((_, j) => j !== i))}>
            <FaXmark />
          </button>
        </div>
      ))}
      <div className="adm-list-row">
        <input
          value={text}
          placeholder={placeholder}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              add();
            }
          }}
          onBlur={add}
        />
        <button type="button" className="btn btn-ghost btn-sm" onClick={add}>
          <FaPlus /> Agregar
        </button>
      </div>
    </div>
  );
}

function Admin() {
  const base = getApiUrl();
  const { reload } = usePortfolio();
  const [key, setKey] = useState(() => sessionStorage.getItem(KEY_STORAGE) || '');
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('cvs');
  const [dataObj, setDataObj] = useState(null);
  const [raw, setRaw] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState(null);
  const [visits, setVisits] = useState(null);

  // Edición de un CV (perfil)
  const [editingIdx, setEditingIdx] = useState(-1);
  const [isNew, setIsNew] = useState(false);
  const [draft, setDraft] = useState(null);
  const [assoc, setAssoc] = useState([]);
  // Edición de un proyecto
  const [projEditingIdx, setProjEditingIdx] = useState(-1);
  const [projIsNew, setProjIsNew] = useState(false);
  const [projDraft, setProjDraft] = useState(null);
  // Edición de un cargo (experiencia)
  const [expEditingIdx, setExpEditingIdx] = useState(-1);
  const [expIsNew, setExpIsNew] = useState(false);
  const [expDraft, setExpDraft] = useState(null);
  // Personal
  const [personal, setPersonal] = useState(null);

  useEffect(() => {
    if (!authed || !key) return;
    loadFromApi();
    fetchVisitCount().then((v) => v != null && setVisits(v));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed, key]);

  async function loadFromApi() {
    const json = await adminGetCv(key).catch(() => null);
    if (!json) {
      setError('No se pudo cargar el CV desde la API.');
      return;
    }
    try {
      const obj = JSON.parse(json);
      setDataObj(obj);
      setRaw(JSON.stringify(obj, null, 2));
      setError('');
    } catch (e) {
      setError('La API devolvió datos inválidos.');
    }
  }

  async function persist(obj, okText) {
    setSaving(true);
    const result = await adminPutCv(key, JSON.stringify(obj));
    setSaving(false);
    setSaveMsg({
      ok: !!result?.ok,
      text: result?.ok ? okText : `Error: ${result?.error || JSON.stringify(result)}`,
    });
    if (result?.ok) {
      await loadFromApi();
      reload();
    }
  }

  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    setChecking(true);
    const ok = await adminAuth(key);
    setChecking(false);
    if (ok) {
      sessionStorage.setItem(KEY_STORAGE, key);
      setAuthed(true);
    } else {
      setError('Clave de administración inválida.');
    }
  }

  function setField(field, value) {
    setDraft((d) => ({ ...d, [field]: value }));
  }

  function startEdit(idx) {
    const p = dataObj.profiles[idx];
    setEditingIdx(idx);
    setIsNew(false);
    setDraft(clone(p));
    setAssoc(
      dataObj.projects
        .filter((pr) => (pr.profiles || []).includes(p.slug))
        .map((pr) => pr.id),
    );
    setSaveMsg(null);
  }

  function startNew() {
    const maxOrder = dataObj.profiles.reduce((m, p) => Math.max(m, p.order || 0), 0);
    setEditingIdx(-1);
    setIsNew(true);
    setDraft({
      slug: '',
      title: '',
      shortTitle: '',
      icon: 'user',
      order: maxOrder + 1,
      default: false,
      summary: '',
      highlights: [],
      skills: [],
      interests: '',
    });
    setAssoc([]);
    setSaveMsg(null);
  }

  function cancelEdit() {
    setEditingIdx(-1);
    setIsNew(false);
    setDraft(null);
    setAssoc([]);
    setSaveMsg(null);
  }

  async function handleSaveProfile() {
    const slug = draft.slug.trim();
    const problems = [];
    if (!slug) problems.push('El slug es obligatorio.');
    else if (!/^[a-z0-9][a-z0-9-]*$/.test(slug)) problems.push('El slug solo admite minúsculas, números y guiones.');
    else if (dataObj.profiles.some((p, i) => p.slug === slug && (isNew || i !== editingIdx)))
      problems.push('Ese slug ya está en uso por otro CV.');
    if (!draft.title.trim()) problems.push('El título es obligatorio.');
    if (problems.length) {
      setSaveMsg({ ok: false, text: problems.join(' — ') });
      return;
    }

    const finalProfile = { ...draft, slug };
    const next = {
      ...dataObj,
      profiles: isNew
        ? [...dataObj.profiles, finalProfile]
        : dataObj.profiles.map((p, i) => (i === editingIdx ? finalProfile : p)),
      projects: dataObj.projects.map((pr) => {
        const keep = (pr.profiles || []).filter((s) => s !== slug);
        if (assoc.includes(pr.id)) keep.push(slug);
        return { ...pr, profiles: keep };
      }),
    };
    await persist(next, isNew ? 'CV creado correctamente.' : 'CV actualizado correctamente.');
    cancelEdit();
  }

  // ---- Proyectos ----
  function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  function projMeta() {
    return {
      id: uuid(),
      title: '',
      category: 'Backend',
      description: '',
      link: '',
      repoLink: '',
      imageUrl: '',
      order: (dataObj.projects.reduce((m, p) => Math.max(m, p.order || 0), 0)) + 1,
      profiles: [],
    };
  }

  function setProjField(field, value) {
    setProjDraft((d) => ({ ...d, [field]: value }));
  }

  function startEditProj(i) {
    setProjEditingIdx(i);
    setProjIsNew(false);
    setProjDraft(clone(dataObj.projects[i]));
    setSaveMsg(null);
  }

  function startNewProj() {
    setProjEditingIdx(-1);
    setProjIsNew(true);
    setProjDraft(projMeta());
    setSaveMsg(null);
  }

  function cancelProj() {
    setProjEditingIdx(-1);
    setProjIsNew(false);
    setProjDraft(null);
    setSaveMsg(null);
  }

  async function handleSaveProj() {
    if (!projDraft.title.trim()) {
      setSaveMsg({ ok: false, text: 'El título del proyecto es obligatorio.' });
      return;
    }
    if (!/^[0-9a-f-]{36}$/i.test(projDraft.id)) {
      setSaveMsg({ ok: false, text: 'El id del proyecto no es válido.' });
      return;
    }
    const next = {
      ...dataObj,
      projects: projIsNew
        ? [...dataObj.projects, projDraft]
        : dataObj.projects.map((p, i) => (i === projEditingIdx ? projDraft : p)),
    };
    await persist(next, projIsNew ? 'Proyecto creado correctamente.' : 'Proyecto actualizado correctamente.');
    cancelProj();
  }

  // ---- Cargos / experiencia ----
  function newExpMeta() {
    return {
      period: '',
      role: '',
      organization: '',
      location: '',
      project: '',
      link: '',
      type: 'professional',
      responsibilities: [],
      profiles: [],
    };
  }

  function setExpField(field, value) {
    setExpDraft((d) => ({ ...d, [field]: value }));
  }

  function startEditExp(i) {
    setExpEditingIdx(i);
    setExpIsNew(false);
    setExpDraft(clone(dataObj.experience[i]));
    setSaveMsg(null);
  }

  function startNewExp() {
    setExpEditingIdx(-1);
    setExpIsNew(true);
    setExpDraft(newExpMeta());
    setSaveMsg(null);
  }

  function cancelExp() {
    setExpEditingIdx(-1);
    setExpIsNew(false);
    setExpDraft(null);
    setSaveMsg(null);
  }

  async function handleSaveExp() {
    const problems = [];
    if (!expDraft.role.trim()) problems.push('El cargo es obligatorio.');
    if (!expDraft.period.trim()) problems.push('El período es obligatorio.');
    if (problems.length) {
      setSaveMsg({ ok: false, text: problems.join(' — ') });
      return;
    }
    const next = {
      ...dataObj,
      experience: expIsNew
        ? [...dataObj.experience, expDraft]
        : dataObj.experience.map((e, i) => (i === expEditingIdx ? expDraft : e)),
    };
    await persist(next, expIsNew ? 'Cargo creado correctamente.' : 'Cargo actualizado correctamente.');
    cancelExp();
  }

  async function handleSaveJson() {
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      setSaveMsg({ ok: false, text: 'JSON inválido: ' + err.message });
      return;
    }
    await persist(parsed, 'JSON guardado (la API regenera los PDFs).');
  }

  if (!base) {
    return (
      <div className="admin-box">
        <FaShieldHalved className="admin-box-icon" />
        <h1>Panel de administración</h1>
        <p>
          Define la variable <code>REACT_APP_API_URL</code> para conectarte al backend y poder
          administrar los datos. Sin ella, el portafolio funciona solo con los datos locales.
        </p>
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="admin-box">
        <FaShieldHalved className="admin-box-icon" />
        <h1>Panel de administración</h1>
        <p>Acceso restringido. Introduce tu clave secreta para continuar.</p>
        <form className="admin-login" onSubmit={handleLogin}>
          <input
            type="password"
            placeholder="Clave secreta"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            autoComplete="current-password"
          />
          <button className="btn btn-primary" disabled={checking || !key}>
            <FaKey /> {checking ? 'Verificando…' : 'Entrar'}
          </button>
        </form>
        {error && <p className="admin-error">{error}</p>}
      </div>
    );
  }

  const editable = dataObj && Array.isArray(dataObj.profiles);

  return (
    <div className="admin">
      <div className="admin-top">
        <h1>
          <FaShieldHalved /> Panel de administración
        </h1>
        <div className="admin-top-actions">
          <button className="btn btn-ghost" onClick={() => loadFromApi()}>
            <FaRotate /> Recargar
          </button>
          {visits != null && (
            <span className="adm-stats">
              <FaEye /> Visitas: <strong>{visits.toLocaleString('es-ES')}</strong>
            </span>
          )}
        </div>
      </div>

      <div className="adm-tabs">
        {TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            className={'adm-tab' + (tab === id ? ' active' : '')}
            onClick={() => setTab(id)}
          >
            <Icon /> {label}
          </button>
        ))}
      </div>

      {saveMsg && tab !== 'json' && (
        <p className={saveMsg.ok ? 'adm-msg ok' : 'adm-msg'}>{saveMsg.text}</p>
      )}

      {!editable && (
        <p className="adm-msg">Cargando datos… (o errores, revisa Recargar).</p>
      )}

      {editable && tab === 'cvs' && (
        <>
          <section className="adm-card">
            <div className="adm-card-head">
              <div>
                <h2>Mis CVs</h2>
                <p className="adm-sub">Cada CV es un perfil diferente (por ejemplo: .NET, IA, Java).</p>
              </div>
              <button className="btn btn-primary" onClick={startNew}>
                <FaPlus /> Nuevo CV
              </button>
            </div>

            <div className="adm-cv-list">
              {dataObj.profiles.map((p, i) => {
                const Icon = profileIcon(p);
                const nProjects = dataObj.projects.filter((pr) => (pr.profiles || []).includes(p.slug)).length;
                return (
                  <div className={'adm-cv-row' + (editingIdx === i && !isNew ? ' editing' : '')} key={p.slug + i}>
                    <span className="adm-cv-icon" title={p.icon || 'icono'}>
                      <Icon />
                    </span>
                    <div className="adm-cv-info">
                      <div className="adm-cv-title">
                        {p.title}
                        {p.default ? <span className="adm-badge">por defecto</span> : null}
                      </div>
                      <div className="adm-cv-meta">
                        <code>/{p.slug}</code>
                        <span>{nProjects} proyectos</span>
                        <span>orden {p.order ?? 0}</span>
                      </div>
                    </div>
                    <div className="adm-cv-actions">
                      <a className="btn btn-ghost btn-sm" href={cvPdfUrl(p.slug)} target="_blank" rel="noreferrer">
                        <FaDownload /> PDF
                      </a>
                      <button className="btn btn-ghost btn-sm" onClick={() => startEdit(i)}>
                        <FaPen /> Editar
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {draft && (
            <section className="adm-card adm-form-card">
              <div className="adm-card-head">
                <h2>{isNew ? 'Nuevo CV' : `Editar CV: ${draft.slug}`}</h2>
                <div className="adm-actions">
                  <button className="btn btn-ghost" onClick={cancelEdit}>
                    Cancelar
                  </button>
                  <button className="btn btn-primary" onClick={handleSaveProfile} disabled={saving}>
                    <FaFloppyDisk /> {saving ? 'Guardando…' : 'Guardar CV'}
                  </button>
                </div>
              </div>

              <div className="adm-form-grid">
                <label className="adm-field">
                  <span>Slug (ruta: /{draft.slug || '…'})</span>
                  <input
                    value={draft.slug}
                    disabled={!isNew}
                    placeholder="java"
                    onChange={(e) => setField('slug', e.target.value.toLowerCase())}
                  />
                  <small>{isNew ? 'Solo minúsculas, números y guiones.' : 'No editable (define la URL).'}</small>
                </label>
                <label className="adm-field">
                  <span>Título</span>
                  <input value={draft.title} placeholder="Ingeniero de Software Java" onChange={(e) => setField('title', e.target.value)} />
                </label>
                <label className="adm-field">
                  <span>Etiqueta corta (navbar)</span>
                  <input value={draft.shortTitle} placeholder="Java" onChange={(e) => setField('shortTitle', e.target.value)} />
                </label>
                <label className="adm-field">
                  <span>Orden de aparición</span>
                  <input
                    type="number"
                    value={draft.order ?? 0}
                    onChange={(e) => setField('order', parseInt(e.target.value, 10) || 0)}
                  />
                </label>
                <label className="adm-field adm-field-check">
                  <input type="checkbox" checked={!!draft.default} onChange={(e) => setField('default', e.target.checked)} />
                  <span>CV por defecto (se muestra en la portada)</span>
                </label>
              </div>

              <div className="adm-field">
                <span>Icono del CV</span>
                <div className="adm-icon-grid">
                  {PROFILE_ICON_OPTIONS.map(({ key, label, Icon: OptIcon }) => (
                    <button
                      type="button"
                      key={key}
                      className={'adm-icon-option' + (draft.icon === key ? ' selected' : '')}
                      onClick={() => setField('icon', key)}
                    >
                      <OptIcon />
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <label className="adm-field">
                <span>Resumen (perfil profesional)</span>
                <textarea
                  rows={3}
                  value={draft.summary || ''}
                  placeholder="Profesional con experiencia en…"
                  onChange={(e) => setField('summary', e.target.value)}
                />
              </label>

              <div className="adm-field">
                <span>Logros destacados</span>
                <ListEditor
                  value={draft.highlights || []}
                  onChange={(v) => setField('highlights', v)}
                  placeholder="Logro, métrica o aporte…"
                />
              </div>

              <div className="adm-field">
                <span>Habilidades</span>
                <TagEditor
                  value={draft.skills || []}
                  onChange={(v) => setField('skills', v)}
                  placeholder="Java, Spring, JPA…"
                />
              </div>

              <label className="adm-field">
                <span>Intereses</span>
                <textarea
                  rows={2}
                  value={draft.interests || ''}
                  onChange={(e) => setField('interests', e.target.value)}
                />
              </label>

              <div className="adm-field">
                <span>Proyectos que aparecen en este CV ({assoc.length})</span>
                <div className="adm-proj-grid">
                  {dataObj.projects.map((pr) => {
                    const checked = assoc.includes(pr.id);
                    return (
                      <label className={'adm-proj-opt' + (checked ? ' selected' : '')} key={pr.id}>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) =>
                            setAssoc((a) => (e.target.checked ? [...a, pr.id] : a.filter((x) => x !== pr.id)))
                          }
                        />
                        {pr.title}
                        <small>{pr.category}</small>
                      </label>
                    );
                  })}
                </div>
              </div>
            </section>
          )}
        </>
      )}

      {editable && tab === 'projects' && (
        <>
          <section className="adm-card">
            <div className="adm-card-head">
              <div>
                <h2>Mis proyectos</h2>
                <p className="adm-sub">Los proyectos aparecen en los CVs que marques.</p>
              </div>
              <button className="btn btn-primary" onClick={startNewProj}>
                <FaPlus /> Nuevo proyecto
              </button>
            </div>

            <div className="adm-cv-list">
              {dataObj.projects.map((p, i) => {
                const { icon: CatIcon, color } = categoryMeta(p.category || '');
                const nCvs = (p.profiles || []).length;
                return (
                  <div className={'adm-cv-row' + (projEditingIdx === i && !projIsNew ? ' editing' : '')} key={p.id || i}>
                    <span className="adm-proj-thumb">
                      {p.imageUrl ? (
                        <img src={p.imageUrl} alt={p.title} loading="lazy" />
                      ) : (
                        <CatIcon style={{ color }} />
                      )}
                    </span>
                    <div className="adm-cv-info">
                      <div className="adm-cv-title">
                        {p.title}
                        <span className="adm-badge" style={{ background: `color-mix(in srgb, ${color} 16%, transparent)`, color, borderColor: `color-mix(in srgb, ${color} 45%, transparent)` }}>
                          {p.category}
                        </span>
                      </div>
                      <div className="adm-cv-meta">
                        <span>{nCvs} CVs asociados</span>
                        <span>orden {p.order ?? 0}</span>
                        {p.link ? <code>{p.link.replace(/^https?:\/\//, '')}</code> : null}
                      </div>
                    </div>
                    <div className="adm-cv-actions">
                      <button className="btn btn-ghost btn-sm" onClick={() => startEditProj(i)}>
                        <FaPen /> Editar
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {projDraft && (
            <section className="adm-card adm-form-card">
              <div className="adm-card-head">
                <h2>{projIsNew ? 'Nuevo proyecto' : `Editar proyecto: ${projDraft.title || projDraft.id.slice(0, 8)}`}</h2>
                <div className="adm-actions">
                  <button className="btn btn-ghost" onClick={cancelProj}>
                    Cancelar
                  </button>
                  <button className="btn btn-primary" onClick={handleSaveProj} disabled={saving}>
                    <FaFloppyDisk /> {saving ? 'Guardando…' : 'Guardar proyecto'}
                  </button>
                </div>
              </div>

              <div className="adm-form-grid">
                <label className="adm-field">
                  <span>Nombre del proyecto</span>
                  <input value={projDraft.title} placeholder="Nombre del proyecto" onChange={(e) => setProjField('title', e.target.value)} />
                </label>
                <label className="adm-field">
                  <span>Categoría</span>
                  <select className="adm-select" value={projDraft.category} onChange={(e) => setProjField('category', e.target.value)}>
                    {Object.keys(CATEGORIES).map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </label>
                <label className="adm-field">
                  <span>Orden de aparición</span>
                  <input type="number" value={projDraft.order ?? 0} onChange={(e) => setProjField('order', parseInt(e.target.value, 10) || 0)} />
                </label>
                <label className="adm-field">
                  <span>Imagen del proyecto</span>
                  <input value={projDraft.imageUrl || ''} list="adm-local-images" placeholder="/images/mave.png o URL" onChange={(e) => setProjField('imageUrl', e.target.value)} />
                  <datalist id="adm-local-images">
                    <option value="/images/mave.png" />
                    <option value="/images/plantas.png" />
                    <option value="/images/walls-arch.png" />
                    <option value="/images/profile.jpg" />
                  </datalist>
                  <small>Si lo dejas vacío, se usa el logo de la categoría.</small>
                </label>
                <label className="adm-field">
                  <span>Link del proyecto (demo)</span>
                  <input value={projDraft.link || ''} placeholder="https://…" onChange={(e) => setProjField('link', e.target.value)} />
                </label>
                <label className="adm-field">
                  <span>Repositorio (GitHub)</span>
                  <input value={projDraft.repoLink || ''} placeholder="https://github.com/…" onChange={(e) => setProjField('repoLink', e.target.value)} />
                </label>
              </div>

              <label className="adm-field">
                <span>Descripción</span>
                <textarea
                  rows={3}
                  value={projDraft.description || ''}
                  placeholder="Qué hace el proyecto, qué tecnologías usa, logros…"
                  onChange={(e) => setProjField('description', e.target.value)}
                />
              </label>

              <div className="adm-field">
                <span>CVs donde aparece este proyecto ({projDraft.profiles?.length || 0})</span>
                <div className="adm-proj-grid">
                  {dataObj.profiles.map((pr) => {
                    const checked = (projDraft.profiles || []).includes(pr.slug);
                    return (
                      <label className={'adm-proj-opt' + (checked ? ' selected' : '')} key={pr.slug}>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => {
                            const cur = projDraft.profiles || [];
                            const next = e.target.checked ? [...cur, pr.slug] : cur.filter((s) => s !== pr.slug);
                            setProjField('profiles', next);
                          }}
                        />
                        <span className="adm-cv-slug">/{pr.slug}</span>
                        {pr.title}
                      </label>
                    );
                  })}
                </div>
              </div>
            </section>
          )}
        </>
      )}

      {editable && tab === 'exp' && (
        <>
          <section className="adm-card">
            <div className="adm-card-head">
              <div>
                <h2>Mi experiencia</h2>
                <p className="adm-sub">Cargos de empleo y proyectos académicos. Si un cargo no marca CVs, aparece en todos.</p>
              </div>
              <button className="btn btn-primary" onClick={startNewExp}>
                <FaPlus /> Nuevo cargo
              </button>
            </div>

            <div className="adm-cv-list">
              {dataObj.experience.map((x, i) => {
                const isProj = x.type === 'project';
                const nCvs = (x.profiles || []).length;
                return (
                  <div className={'adm-cv-row' + (expEditingIdx === i && !expIsNew ? ' editing' : '')} key={x.role + i}>
                    <span className="adm-cv-icon" style={{ background: isProj ? 'var(--accent-2)' : 'var(--hero-gradient)' }}>
                      <FaBriefcase />
                    </span>
                    <div className="adm-cv-info">
                      <div className="adm-cv-title">
                        {x.role}
                        <span className={'adm-badge ' + (isProj ? 'badge-proj' : 'badge-job')}>
                          {isProj ? 'Proyecto' : 'Empleo'}
                        </span>
                      </div>
                      <div className="adm-cv-meta">
                        <span>{x.organization || '—'}{x.location ? ` · ${x.location}` : ''}</span>
                        <span>{x.period}</span>
                        <span>{nCvs === 0 ? 'todos los CVs' : `${nCvs} CVs`}</span>
                      </div>
                    </div>
                    <div className="adm-cv-actions">
                      <button className="btn btn-ghost btn-sm" onClick={() => startEditExp(i)}>
                        <FaPen /> Editar
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {expDraft && (
            <section className="adm-card adm-form-card">
              <div className="adm-card-head">
                <h2>{expIsNew ? 'Nuevo cargo' : `Editar cargo: ${expDraft.role}`}</h2>
                <div className="adm-actions">
                  <button className="btn btn-ghost" onClick={cancelExp}>
                    Cancelar
                  </button>
                  <button className="btn btn-primary" onClick={handleSaveExp} disabled={saving}>
                    <FaFloppyDisk /> {saving ? 'Guardando…' : 'Guardar cargo'}
                  </button>
                </div>
              </div>

              <div className="adm-form-grid">
                <label className="adm-field">
                  <span>Cargo</span>
                  <input value={expDraft.role} placeholder="Desarrollador de Software" onChange={(e) => setExpField('role', e.target.value)} />
                </label>
                <label className="adm-field">
                  <span>Empresa / organización</span>
                  <input value={expDraft.organization || ''} placeholder="Grupo Consiti" onChange={(e) => setExpField('organization', e.target.value)} />
                </label>
                <label className="adm-field">
                  <span>Período</span>
                  <input value={expDraft.period} placeholder="2026 – Actualidad" onChange={(e) => setExpField('period', e.target.value)} />
                </label>
                <label className="adm-field">
                  <span>Ubicación</span>
                  <input value={expDraft.location || ''} placeholder="Remoto · Bogotá" onChange={(e) => setExpField('location', e.target.value)} />
                </label>
                <label className="adm-field">
                  <span>Tipo</span>
                  <select className="adm-select" value={expDraft.type} onChange={(e) => setExpField('type', e.target.value)}>
                    <option value="professional">Empleo (experiencia profesional)</option>
                    <option value="project">Proyecto / experiencia académica</option>
                  </select>
                </label>
                <label className="adm-field">
                  <span>Proyecto vinculado</span>
                  <input value={expDraft.project || ''} placeholder="Nombre del proyecto (opcional)" onChange={(e) => setExpField('project', e.target.value)} />
                </label>
                <label className="adm-field">
                  <span>Link</span>
                  <input value={expDraft.link || ''} placeholder="https://… (opcional)" onChange={(e) => setExpField('link', e.target.value)} />
                </label>
              </div>

              <div className="adm-field">
                <span>Responsabilidades / logros del cargo</span>
                <ListEditor
                  value={expDraft.responsibilities || []}
                  onChange={(v) => setExpField('responsibilities', v)}
                  placeholder="Logro, función o métrica de este cargo…"
                />
              </div>

              <div className="adm-field">
                <span>CVs donde aparece este cargo ({expDraft.profiles?.length || 0})</span>
                <p className="adm-sub" style={{ marginTop: '-0.1rem' }}>Si no marcas ninguno, aparece en todos los CVs.</p>
                <div className="adm-proj-grid">
                  {dataObj.profiles.map((pr) => {
                    const checked = (expDraft.profiles || []).includes(pr.slug);
                    return (
                      <label className={'adm-proj-opt' + (checked ? ' selected' : '')} key={pr.slug}>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => {
                            const cur = expDraft.profiles || [];
                            const next = e.target.checked ? [...cur, pr.slug] : cur.filter((s) => s !== pr.slug);
                            setExpField('profiles', next);
                          }}
                        />
                        <span className="adm-cv-slug">/{pr.slug}</span>
                        {pr.title}
                      </label>
                    );
                  })}
                </div>
              </div>
            </section>
          )}
        </>
      )}

      {editable && tab === 'personal' && (
        <section className="adm-card">
          <div className="adm-card-head">
            <div>
              <h2>Datos personales</h2>
              <p className="adm-sub">Compartidos en todos los CV y en los PDFs.</p>
            </div>
            <button className="btn btn-primary" onClick={() => persist({ ...dataObj, personal }, 'Datos personales guardados.')} disabled={saving}>
              <FaFloppyDisk /> {saving ? 'Guardando…' : 'Guardar'}
            </button>
          </div>
          <div className="adm-form-grid">
            {[
              ['fullName', 'Nombre completo'],
              ['title', 'Título / cargo'],
              ['location', 'Ubicación'],
              ['phone', 'Teléfono'],
              ['email', 'Email'],
              ['github', 'GitHub'],
              ['linkedin', 'LinkedIn'],
              ['portfolio', 'Portafolio (URL)'],
              ['photoUrl', 'Foto de perfil (URL o /images/profile.jpg)'],
            ].map(([field, label]) => (
              <label className="adm-field" key={field}>
                <span>{label}</span>
                <input
                  value={(personal || {})[field] || ''}
                  onChange={(e) => setPersonal((p) => ({ ...(p || dataObj.personal), [field]: e.target.value }))}
                />
              </label>
            ))}
          </div>
        </section>
      )}

      {editable && tab === 'json' && (
        <section className="adm-card">
          <div className="adm-card-head">
            <h2>JSON (fuente única) — solo para cambios avanzados</h2>
            <div className="adm-actions">
              <button className="btn btn-ghost" onClick={() => loadFromApi()}>
                <FaRotate /> Recargar
              </button>
              <button className="btn btn-primary" onClick={handleSaveJson} disabled={saving}>
                <FaFloppyDisk /> {saving ? 'Guardando…' : 'Guardar'}
              </button>
            </div>
          </div>
          <textarea
            className="adm-textarea"
            spellCheck="false"
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            rows={24}
          />
          {saveMsg && <p className={saveMsg.ok ? 'adm-msg ok' : 'adm-msg'}>{saveMsg.text}</p>}
        </section>
      )}

      {editable && tab === 'pdfs' && (
        <section className="adm-card">
          <div className="adm-card-head">
            <h2>PDFs generados</h2>
            <p className="adm-sub">Versionado en texto plano, sin imágenes, listo para ATS.</p>
          </div>
          <div className="adm-profiles">
            {(dataObj.profiles || []).map((p) => (
              <div className="adm-profile" key={p.slug}>
                <div className="adm-profile-head">
                  <span>{p.shortTitle || p.title}</span>
                  <a className="btn btn-ghost btn-sm" href={cvPdfUrl(p.slug)} target="_blank" rel="noreferrer">
                    <FaDownload /> PDF
                  </a>
                </div>
                <iframe title={`CV ${p.slug}`} src={cvPdfUrl(p.slug)} className="adm-preview" loading="lazy" />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default Admin;