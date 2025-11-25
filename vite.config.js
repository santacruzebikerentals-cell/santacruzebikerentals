import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,         // allow access from network / external URLs
    port: 5173,         // your dev server port
    allowedHosts: 'all' // allow ngrok and any other hosts
  },
})
