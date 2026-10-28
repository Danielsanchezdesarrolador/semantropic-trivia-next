import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
// HomePreview carga el estilo oficial de SEMANTROPIC POP; el CSS B01 queda archivado sin afectar la portada.

const root = document.getElementById('root');
if (!root) throw new Error('Falta el contenedor #root');
createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
