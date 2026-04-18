## 2024-05-16 - [Add ARIA labels to icon-only buttons]
**Learning:** Found several icon-only buttons across pagination, modals, and tables that were lacking descriptive text for screen readers, reducing accessibility.
**Action:** Always verify that `Button` components rendering only an icon have an explicit, descriptive `aria-label`.
