import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/rubik/400.css';
import '@fontsource/rubik/600.css';
import '@fontsource/rubik/800.css';
import '@fontsource/fredoka/500.css';
import '@fontsource/fredoka/700.css';
import './index.css';
import App from './App.jsx';

// Register Service Worker for offline play on web/PWA (skipped inside Capacitor native shell)
if ('serviceWorker' in navigator && import.meta.env.PROD && !window.Capacitor) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
      console.log('SW registration note:', err);
    });
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
