import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Exposes shell env vars prefixed with APP_ (e.g. APP_API_TOKEN from PowerShell)
 * as import.meta.env.APP_*. No project .env file required.
 */
export default defineConfig({
  envPrefix: ['APP_'],
  plugins: [react()],
  server: {
    port: 5173,
    fs: {
      // Allow importing @portfolio/shared from ../shared
      allow: ['..'],
    },
    proxy: {
      // Avoid CORS during local dev — browser calls /api → Quarkus :8080
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
