import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite configuration for the Blueprint app
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Relative base for GitHub Pages deployment
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
  server: {
    port: 3000,
    host: true
  }
})
