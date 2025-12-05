## Testing Steps

### 1. Start Development Servers
```bash
# Terminal 1
bin/rails server

# Terminal 2
bin/vite dev
```

### 2. Desktop Testing (>= 1024px)
1. Open http://localhost:3000
2. Verify sidebar is visible on left
3. Verify logo shows "INV / FORGE" with line separator
4. Click each nav item - verify route changes
5. Verify active state (blue text, gray background)
6. Click theme toggle - verify dark mode activates
7. Refresh page - verify theme persists

### 3. Mobile Testing (< 768px)
1. Open Chrome DevTools, set viewport to 375px
2. Verify sidebar is hidden
3. Verify header shows with hamburger icon
4. Click hamburger - verify sheet slides in from left
5. Click nav item - verify navigation and sheet closes
6. Verify theme toggle works in mobile header

### 4. Typography Verification
1. Inspect "Dashboard" title
2. Verify font-family includes "Instrument Serif"
3. Verify letter-spacing shows tracking-tight value
4. Inspect metric card values
5. Verify font-family includes "Geist Mono"

### 5. Color Verification
1. In light mode, inspect body background
2. Verify it's rgb(248, 250, 252) = #f8fafc = slate-50
3. Inspect card background
4. Verify it's rgb(255, 255, 255) = white
5. Toggle to dark mode
6. Verify canvas is slate-950, cards are slate-900
