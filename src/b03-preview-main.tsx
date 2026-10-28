import React from 'react';
import { createRoot } from 'react-dom/client';
import QuizPreview from './ui/quiz/QuizPreview';

const target = document.querySelector('#b03-root');
if (!target) throw new Error('No existe #b03-root');
createRoot(target).render(<React.StrictMode><QuizPreview /></React.StrictMode>);
