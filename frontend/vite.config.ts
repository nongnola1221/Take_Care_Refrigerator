import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/Take_Care_Refrigerator/',
  plugins: [react()],
})
