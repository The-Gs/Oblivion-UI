import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider, ToastProvider } from '../src';
import { DocsApp } from './DocsApp';
import './docs.css';
import './builder.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="oblivion" defaultMode="dark">
      <ToastProvider>
        <DocsApp />
      </ToastProvider>
    </ThemeProvider>
  </StrictMode>,
);
