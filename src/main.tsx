import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';
import { AuthProvider } from './context/AuthContext';

// Auto-register and update service worker
registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log('[TrailMind PWA] New outdoor engine update available');
  },
  onOfflineReady() {
    console.log('[TrailMind PWA] App shell and outdoor assets cached. Ready for offline exploration.');
  },
});

createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <App />
  </AuthProvider>
);

