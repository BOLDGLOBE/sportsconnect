import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Listen on all interfaces (IPv4 + IPv6) so tunnels and LAN devices can connect
    host: true,
    open: true,
    // Allow access via public tunnel hosts (cloudflared quick tunnels) so the
    // site can be shared with teammates outside this machine.
    allowedHosts: true,
    proxy: {
      // Forward /api calls to the Express backend during development
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})
