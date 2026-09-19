import React, { useEffect, useState } from 'react';
import { Routes, Route, Outlet, Navigate, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProfilePage from './routes/ProfilePage';
import Admin from './routes/Admin';
import NotFound from './routes/NotFound';
import { usePortfolio } from './context/portfolio_context';
import { registerVisit, fetchVisitCount } from './lib/api';
import './styles/global.scss';

const ADMIN_SHORTCUT_KEY = 'm';
const VISIT_SESSION_FLAG = 'pf_visit_registered';

function Layout() {
  const { cv } = usePortfolio();
  const [visits, setVisits] = useState(null);

  useEffect(() => {
    fetchVisitCount().then((v) => v != null && setVisits(v));
    if (sessionStorage.getItem(VISIT_SESSION_FLAG)) return;
    sessionStorage.setItem(VISIT_SESSION_FLAG, '1');
    registerVisit().then((v) => v != null && setVisits(v));
  }, []);

  return (
    <div className="layout">
      <Navbar profiles={cv?.profiles || []} personal={cv?.personal || {}} />
      <main className="layout-main">
        <Outlet />
      </main>
      <Footer personal={cv?.personal || {}} visits={visits} />
    </div>
  );
}

function App() {
  const { cv } = usePortfolio();
  const navigate = useNavigate();
  const defaultSlug =
    cv?.profiles?.find((p) => p.default)?.slug || cv?.profiles?.[0]?.slug || 'general';

  useEffect(() => {
    function onKeyDown(e) {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === ADMIN_SHORTCUT_KEY) {
        e.preventDefault();
        navigate('/admin');
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to={`/${defaultSlug}`} replace />} />
        <Route path="admin" element={<Admin />} />
        <Route path=":slug" element={<ProfilePage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;