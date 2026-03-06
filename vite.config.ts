import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  // base zostawiamy dla budowania produkcyjnego
  base: './', 
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // TO JEST NOWA SEKCJA DLA PRACY LOKALNEJ
  server: {
    port: 5173, // Domyślny port Vite
    proxy: {
      '/api': {
        target: 'http://localhost:8191', // Tutaj działa Twój backend w Dockerze
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})