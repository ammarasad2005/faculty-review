## 2024-05-18 - Improve StarRating Screen Reader Experience
**Learning:** For components supporting both read-only and interactive modes (e.g., Star Ratings), treat screen reader flow separately. A shared DOM structure often results in excessive verbosity or missing roles.
**Action:** In read-only mode, hide repetitive individual elements (`aria-hidden="true"`) and use a container summary (`role="img"`, `aria-label="..."`). In interactive mode, assign individual labels and `aria-pressed` attributes to the actionable elements.
