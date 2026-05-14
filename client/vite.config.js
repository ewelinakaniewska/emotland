import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(),react()],
  server: {
    host: true, // pozwala na dostęp z sieci lokalnej
    port: 5173,
    allowedHosts: [
      'calm-towns-leave.loca.lt', // dodaj swój host z Localtunnel
      '.loca.lt'                   // lub wszystkie subdomeny loca.lt
    ],
  },
})
