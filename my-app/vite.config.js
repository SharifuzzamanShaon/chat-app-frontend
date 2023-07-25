import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': 'https://api.cloudinary.com/v1_1/daaxwtbba/image/upload'
    }
  },
  plugins: [react()],
})
