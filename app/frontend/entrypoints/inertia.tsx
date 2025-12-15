// app/frontend/entrypoints/inertia.tsx
import './application.css'
import { createInertiaApp } from '@inertiajs/react'
import { createRoot } from 'react-dom/client'

console.log('[Inertia] Starting app initialization...')

// Define the page module type
type PageModule = {
  default: React.ComponentType
}

createInertiaApp({
  // Resolve page components from the pages directory
  resolve: (name) => {
    console.log('[Inertia] Resolving page:', name)

    const pages = import.meta.glob<PageModule>('../pages/**/*.tsx', { eager: true })
    console.log('[Inertia] Available pages:', Object.keys(pages))

    const pagePath = `../pages/${name}.tsx`
    console.log('[Inertia] Looking for:', pagePath)

    const page = pages[pagePath]

    if (!page) {
      console.error('[Inertia] Page not found:', name)
      console.error('[Inertia] Searched path:', pagePath)
      console.error('[Inertia] Available pages:', Object.keys(pages))
      throw new Error(`Page not found: ${name}`)
    }

    console.log('[Inertia] Found page module:', page)
    console.log('[Inertia] Default export:', page.default)

    return page.default
  },

  // Set up the React root
  setup({ el, App, props }) {
    console.log('[Inertia] Setup called')
    console.log('[Inertia] Element:', el)
    console.log('[Inertia] App:', App)
    console.log('[Inertia] Props:', props)

    if (!el) {
      console.error('[Inertia] No element found for Inertia app')
      return
    }

    console.log('[Inertia] Creating React root...')
    const root = createRoot(el)
    console.log('[Inertia] Rendering app...')
    root.render(<App {...props} />)
    console.log('[Inertia] App rendered!')
  },
})

console.log('[Inertia] createInertiaApp called')
