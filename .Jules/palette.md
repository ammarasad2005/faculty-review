## 2024-05-21 - Star Rating Screen Reader Flow

**Learning:** When dealing with star rating components that can be both read-only and interactive, a single DOM structure is often insufficient for good screen reader UX. Relying purely on disabled buttons for the read-only state still announces interactive semantics unnecessarily. Separating the read-only flow into an `img` role with an overall label provides much cleaner announcements than navigating disabled, individual stars.

**Action:** Consistently branch rendering logic for rating components based on interactivity. Use container-level `role="img"` for read-only mode, and `role="group"` with individually labeled toggles (`aria-pressed`) for interactive mode.
