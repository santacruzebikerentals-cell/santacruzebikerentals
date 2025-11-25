import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,         // allows external connections
    port: 5173,         // your dev port
    strictPort: true,   // ensures 5173 is used
    allowedHosts: 'all' // allows any host, including ngrok
  },
})
