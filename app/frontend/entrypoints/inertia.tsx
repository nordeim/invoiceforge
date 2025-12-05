// app/frontend/entrypoints/inertia.tsx
import { createInertiaApp } from '@inertiajs/react'
import { createRoot } from 'react-dom/client'

createInertiaApp({
  // Resolve page components from the pages directory
  resolve: (name) => {
    const pages = import.meta.glob('../pages/**/*.tsx', { eager: true })
    const page = pages[`../pages/${name}.tsx`]
    if (!page) {
      throw new Error(`Page not found: ${name}`)
    }
    return page
  },

  // Set up the React root
  setup({ el, App, props }) {
    createRoot(el).render(<App {...props} />)
  },
})
