import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

// In dev, proxy backend traffic to the FastAPI server so we don't need CORS
// and cookies just work (same-origin from the browser's perspective).
export default defineConfig({
  plugins: [react(), svgr()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: false,
      },
      '/ws': {
        target: 'ws://localhost:8000',
        ws: true,
        changeOrigin: false,
      },
      '/tg': {
        target: 'http://localhost:8000',
        changeOrigin: false,
      },
    },
  },
})
