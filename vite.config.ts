import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, Plugin} from 'vite';
import {VitePWA} from 'vite-plugin-pwa';

function hmrWebSocketSilencer(): Plugin {
  return {
    name: 'hmr-websocket-silencer',
    transformIndexHtml: {
      order: 'pre',
      handler() {
        return [
          {
            tag: 'script',
            children: `(function() {
  // Prevent harmless Vite HMR WebSocket errors in AI Studio preview environment
  var NativeWebSocket = window.WebSocket;
  if (NativeWebSocket) {
    function MockViteWebSocket(url, protocols) {
      if (
        protocols === 'vite-hmr' ||
        protocols === 'vite-ping' ||
        (typeof url === 'string' && (url.indexOf('token=') !== -1 || url.indexOf('24678') !== -1))
      ) {
        var listeners = {};
        return {
          readyState: 1, // OPEN
          OPEN: 1,
          CONNECTING: 0,
          CLOSING: 2,
          CLOSED: 3,
          addEventListener: function(event, fn) {
            if (!listeners[event]) listeners[event] = [];
            listeners[event].push(fn);
            if (event === 'open') {
              setTimeout(function() { fn({ type: 'open' }); }, 0);
            }
          },
          removeEventListener: function(event, fn) {
            if (!listeners[event]) return;
            listeners[event] = listeners[event].filter(function(f) { return f !== fn; });
          },
          dispatchEvent: function() { return true; },
          send: function() {},
          close: function() {}
        };
      }
      return new NativeWebSocket(url, protocols);
    }
    MockViteWebSocket.prototype = NativeWebSocket.prototype;
    MockViteWebSocket.CONNECTING = 0;
    MockViteWebSocket.OPEN = 1;
    MockViteWebSocket.CLOSING = 2;
    MockViteWebSocket.CLOSED = 3;
    window.WebSocket = MockViteWebSocket;
  }

  var origConsoleError = console.error;
  console.error = function() {
    var args = Array.prototype.slice.call(arguments);
    var text = args.map(function(item) {
      return String(item && item.message ? item.message : item);
    }).join(' ');
    if (text.indexOf('WebSocket') !== -1 || (text.indexOf('[vite]') !== -1 && text.indexOf('connect') !== -1)) {
      return;
    }
    origConsoleError.apply(console, args);
  };

  window.addEventListener('unhandledrejection', function(event) {
    var reason = event && event.reason ? String(event.reason.message || event.reason) : '';
    if (reason.indexOf('WebSocket') !== -1 || reason.indexOf('@vite/client') !== -1) {
      event.preventDefault();
      event.stopPropagation();
      return true;
    }
  }, true);
})();`,
            injectTo: 'head-prepend',
          },
        ];
      },
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [
      hmrWebSocketSilencer(),
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'icon.svg'],
        manifest: {
          id: '/',
          name: 'TrailMind AI — Outdoor Adventure Companion',
          short_name: 'TrailMind',
          description: 'Outdoor AI companion that creates personalized real-world micro-adventures based on your time, mood, and environment.',
          theme_color: '#030812',
          background_color: '#030812',
          display: 'standalone',
          start_url: '/',
          scope: '/',
          icons: [
            {
              src: '/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-maskable-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'gstatic-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
          ],
        },
        devOptions: {
          enabled: true,
          type: 'module',
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname || process.cwd(), '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
