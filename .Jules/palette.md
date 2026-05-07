## 2026-05-07 - Component specific screen reader modes
**Learning:** For components supporting both read-only and interactive modes (like Star Ratings), screen reader flow requires separate treatments. In read-only mode, individual elements are repetitive, so hiding them via `aria-hidden` and using a container-level `aria-label` provides a cleaner UX.
**Action:** When working on toggleable interactive/read-only components, consider creating an explicit read-only container role (e.g. `role="img"`) and suppressing child announcements.
