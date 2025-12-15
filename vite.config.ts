// vite.config.ts
import { defineConfig } from 'vite'
import RubyPlugin from 'vite-plugin-ruby'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [
    RubyPlugin(),
    // Note: React plugin removed to avoid preamble detection issues with Rails proxy
    // HMR for React components won't work, but the app will render
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './app/frontend'),
    },
  },
  // Use esbuild for JSX transformation instead of React plugin
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: 'react',
  },
})
