import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // IMPORTANT: Replace 'repo-name' with your actual GitHub repository name
  // If your repo is https://github.com/user/forklift-app, this should be '/forklift-app/'
  base: './', 
  build: {
    outDir: 'dist',
  }
})