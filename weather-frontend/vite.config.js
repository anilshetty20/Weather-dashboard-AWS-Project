import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // base './' makes all asset paths relative — required for S3 static hosting
  base: './',
  build: {
    outDir: 'dist',
  },
})