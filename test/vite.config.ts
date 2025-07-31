import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      'nice-helpers': path.resolve(__dirname, '../src/index.ts')
    }
  },
  server: {
    port: 5174
  }
})