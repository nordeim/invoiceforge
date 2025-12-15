# InvoiceForge - Phase 2 Backend Integration Walkthrough

## Summary

Successfully resolved the Vite Rails configuration issues that were preventing the React frontend from rendering. The application now fully works with Rails 8.1.1, React 18, Inertia.js, and TailwindCSS v4.

## Issues Resolved

### 1. Missing Vite Configuration Files
- Created `config/vite.json` - Required by vite_rails gem
- Created `Procfile.dev` - For running Rails + Vite together
- Fixed `Procfile.dev` to use `/bin/bash -c` for `source` command

### 2. Database Connection
- Updated `.env.docker` to use `POSTGRES_HOST=localhost` instead of `db`
- Copied to `.env` for local development

### 3. Missing JavaScript Exports
- Added `calculateDueDate` and `paymentTermOptions` to `DatePicker.tsx`
- Added `InvoiceSummaryCompact` to `InvoiceSummary.tsx`
- Added `calculateTotals` export to `InvoiceSummary.tsx`
- Created missing `dialog.tsx` UI component

### 4. React Plugin Preamble Issue
The `@vitejs/plugin-react` and `@vitejs/plugin-react-swc` both failed with "can't detect preamble" error when accessed through the Rails proxy. 

**Solution**: Removed the React plugin and used esbuild's built-in JSX transformation instead.

```typescript
// vite.config.ts
esbuild: {
  jsx: 'automatic',
  jsxImportSource: 'react',
}
```

**Trade-off**: React Fast Refresh (HMR for components) is disabled, but the app renders correctly.

## Working Application Screenshots

![Dashboard](/home/pete/.gemini/antigravity/brain/ab55e45e-71ad-44a5-94e4-6b01d29131df/uploaded_image_0_1765775191917.png)

![Clients Page](/home/pete/.gemini/antigravity/brain/ab55e45e-71ad-44a5-94e4-6b01d29131df/uploaded_image_1_1765775191917.png)

![Invoices Page](/home/pete/.gemini/antigravity/brain/ab55e45e-71ad-44a5-94e4-6b01d29131df/uploaded_image_2_1765775191917.png)

## Start Commands

```bash
# Start Docker PostgreSQL
bin/docker-dev start

# Start Rails + Vite
source .env && foreman start -f Procfile.dev

# Access the app
open http://localhost:3000

# Login credentials
# Email: admin@invoiceforge.app
# Password: password123
```

## Files Modified

| File | Change |
|------|--------|
| `config/vite.json` | Created - Vite configuration for vite_rails |
| `Procfile.dev` | Created - Foreman process file |
| `vite.config.ts` | Removed React plugin, use esbuild JSX |
| `.env.docker` / `.env` | Updated POSTGRES_HOST to localhost |
| `app/frontend/components/invoices/DatePicker.tsx` | Added missing exports |
| `app/frontend/components/invoices/InvoiceSummary.tsx` | Added missing exports |
| `app/frontend/components/ui/dialog.tsx` | Created - Missing UI component |
| `app/frontend/entrypoints/inertia.tsx` | Added debugging (can be removed) |

## Verification

- ✅ Dashboard renders with real database metrics
- ✅ Clients page shows client list with actions
- ✅ Invoices page shows invoice list with filtering
- ✅ Authentication works (Devise)
- ✅ Database queries execute correctly
