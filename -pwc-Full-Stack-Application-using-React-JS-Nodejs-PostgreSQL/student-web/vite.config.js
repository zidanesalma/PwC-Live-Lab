import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: [
    'studentapp-frontend.orangeground-a073c213.francecentral.azurecontainerapps.io',
    'all'
    ]
  }
})
