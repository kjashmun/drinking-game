import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Critical for Docker and local network access
    port: 3000,
    proxy: {
      '/socket.io': {
        target: 'http://localhost:3001',
        ws: true,
        changeOrigin: true
      }
    }
  }
})
