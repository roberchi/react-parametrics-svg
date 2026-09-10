import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: {
      'react-parametrics-svg': path.resolve(__dirname, '../src/index.tsx'),
    },
  },
  optimizeDeps: {
    include: ['lodash', 'react-svg'],
  },
})
