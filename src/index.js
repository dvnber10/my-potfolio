import React from 'react';
import { createRoot } from 'react-dom/client'; // Importa createRoot
import App from './App';
import { ThemeProvider } from './context/theme_context';

// Selecciona el contenedor raíz
const container = document.getElementById('root');

// Crea una raíz y renderiza la aplicación
const root = createRoot(container);
root.render(
  <ThemeProvider>
    <App />
  </ThemeProvider>
);