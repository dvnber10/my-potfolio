// src/context/portfolio_context.js — datos compartidos del portafolio
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { fetchCvData } from '../lib/api';

export const PortfolioContext = createContext(null);

export function PortfolioProvider({ children }) {
  const [cv, setCv] = useState(null);
  const [error, setError] = useState('');

  async function load() {
    try {
      setCv(await fetchCvData());
      setError('');
    } catch (err) {
      setError('No se pudieron cargar los datos.');
    }
  }

  useEffect(() => {
    load();
  }, []);

  const value = useMemo(() => ({ cv, error, loading: !cv, reload: load }), [cv, error]);

  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>;
}

export function usePortfolio() {
  return useContext(PortfolioContext);
}