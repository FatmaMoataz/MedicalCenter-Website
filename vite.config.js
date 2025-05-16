import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import flowbiteReact from "flowbite-react/plugin/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), flowbiteReact()],
    server: {
    proxy: {
      '/api': 'http://localhost:3000' 
    }
  },
  build: {
    outDir: 'dist'
  }
})