import React from 'react';
import { createRoot } from 'react-dom/client';
import HomePreview from './ui/home/HomePreview';
import './ui/home/home-preview.css';

const root = document.getElementById('preview-root');
if (!root) throw new Error('Falta #preview-root');
createRoot(root).render(
  <React.StrictMode>
    <HomePreview />
  </React.StrictMode>,
);
