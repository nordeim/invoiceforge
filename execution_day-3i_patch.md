# Day 3 CSS Patch Implementation Plan

**Objective**: Fix broken Sheet animations by adding missing CSS classes to `application.css`.
**Context**: `Sheet.tsx` relies on `animate-in`, `slide-out-to-right`, etc., but these are missing from `application.css`.

## 1. File to Modify
`app/assets/stylesheets/application.css`

## 2. Changes
Add the following blocks to the end of the file (or appropriately within the utilities layer):

```css
/* ─────────────────────────────────────────────────────────────────────────
   COMPLETE DAY 3 CSS ADDITIONS (Patch)
   ───────────────────────────────────────────────────────────────────────── */

/* Slide Out (Full) - for Sheet */
.slide-out-to-top { --tw-exit-translate-y: -100%; }
.slide-out-to-bottom { --tw-exit-translate-y: 100%; }
.slide-out-to-left { --tw-exit-translate-x: -100%; }
.slide-out-to-right { --tw-exit-translate-x: 100%; }

/* Slide In (Full) - for Sheet */
.slide-in-from-top { --tw-enter-translate-y: -100%; }
.slide-in-from-bottom { --tw-enter-translate-y: 100%; }
.slide-in-from-left { --tw-enter-translate-x: -100%; }
.slide-in-from-right { --tw-enter-translate-x: 100%; }

/* ─────────────────────────────────────────────────────────────────────────
   RADIX UI ANIMATION UTILITIES
   ───────────────────────────────────────────────────────────────────────── */

@keyframes radix-enter {
  from {
    opacity: var(--tw-enter-opacity, 0);
    transform: translate3d(var(--tw-enter-translate-x, 0), var(--tw-enter-translate-y, 0), 0)
      scale3d(var(--tw-enter-scale, 1), var(--tw-enter-scale, 1), var(--tw-enter-scale, 1));
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0) scale3d(1, 1, 1);
  }
}

@keyframes radix-exit {
  from {
    opacity: 1;
    transform: translate3d(0, 0, 0) scale3d(1, 1, 1);
  }
  to {
    opacity: var(--tw-exit-opacity, 0);
    transform: translate3d(var(--tw-exit-translate-x, 0), var(--tw-exit-translate-y, 0), 0)
      scale3d(var(--tw-exit-scale, 1), var(--tw-exit-scale, 1), var(--tw-exit-scale, 1));
  }
}

/* Animation triggers */
.animate-in {
  animation: radix-enter 150ms ease-out;
}

.animate-out {
  animation: radix-exit 150ms ease-in;
}

/* Fade */
.fade-in-0 { --tw-enter-opacity: 0; }
.fade-out-0 { --tw-exit-opacity: 0; }

/* Zoom */
.zoom-in-95 { --tw-enter-scale: 0.95; }
.zoom-out-95 { --tw-exit-scale: 0.95; }

/* Slide In (Small) */
.slide-in-from-top-2 { --tw-enter-translate-y: -0.5rem; }
.slide-in-from-bottom-2 { --tw-enter-translate-y: 0.5rem; }
.slide-in-from-left-2 { --tw-enter-translate-x: -0.5rem; }
.slide-in-from-right-2 { --tw-enter-translate-x: 0.5rem; }

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .animate-in,
  .animate-out {
    animation: none;
  }
}
```

## 3. Validation
- Run terminal check to ensure file is updated.
- Verify existing `animate-fade-in-up` is preserved.
