## 2024-05-18 - Missing ARIA labels on icon-only buttons
**Learning:** Found a common pattern of missing `aria-label`s on icon-only interactive elements (like share, delete, and pagination buttons), which breaks screen reader accessibility since the button text is visually empty.
**Action:** Add explicit `aria-label` strings explaining the button action whenever an icon is used as the sole content of an interactive control.
