import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import fs from 'fs';

export default defineConfig(() => {
  return {
    plugins: [
      react(), 
      tailwindcss(),
      {
        name: 'serve-app-js-statically',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            if (req.url && (req.url === '/app.js' || req.url.startsWith('/app.js?'))) {
              const appJsPath = path.resolve(process.cwd(), './app.js');
              if (fs.existsSync(appJsPath)) {
                res.setHeader('Content-Type', 'text/javascript');
                res.end(fs.readFileSync(appJsPath, 'utf-8'));
                return;
              }
            }
            next();
          });
        }
      }
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
