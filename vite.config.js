import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    open: false,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          proxy.on('error', (err, _req, res) => {
            console.error('[Vite Proxy Error]: Ensure FastAPI backend is running on port 8000.', err.message);
            if (res && !res.headersSent) {
              res.writeHead(503, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ detail: 'FastAPI backend is offline or unreachable on port 8000. Run npm run backend or python backend/main.py.' }));
            }
          });
        },
      }
    }
  }
})
