import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import unoCSS from 'unocss/vite'

export default defineConfig({
  plugins: [react(), unoCSS()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})
