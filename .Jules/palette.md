## 2024-05-16 - Star Rating Component Accessibility Fix
**Learning:** For components like a star rating that double as both read-only displays and interactive inputs, screen readers can struggle. When displayed as a row of disabled buttons, screen readers announce each button, cluttering the experience.
**Action:** Handle read-only mode explicitly by replacing disabled `<button>` elements with `aria-hidden="true"` wrappers (like `<div>`) and adding `role="img"` with an `aria-label="X out of Y stars"` to the container. Preserve interactive functionality only when truly enabled.
