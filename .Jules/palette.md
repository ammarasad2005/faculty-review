## 2026-05-06 - Accessible Star Ratings
**Learning:** Star ratings need different accessibility treatments based on context. Interactive ones need individual button labels (`aria-pressed`, `aria-label`) and focus states, while read-only ones should hide individual elements and provide a single container summary (`role="img"`, `aria-label`) to avoid repetitive screen reader announcements.
**Action:** Always implement contextual ARIA attributes and keyboard focus states (`focus-visible:ring-2`) for components with dual read-only/interactive modes.
