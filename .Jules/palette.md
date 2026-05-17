
## 2024-05-17 - [StarRating Read-only vs Interactive State]
**Learning:** We need to explicitly differentiate between read-only visual star ratings (which are repetitive to screen readers if each star is a distinct element) and interactive star ratings (where each star acts as a button).
**Action:** When working on generic components like StarRating, always ask "is this interactive or read-only?" If read-only, hide the individual stars with `aria-hidden` and provide a container role `img` with a summarizing `aria-label`. If interactive, ensure each star has `aria-label` and `aria-pressed` to indicate state. Also always add keyboard focus states (`focus-visible:ring-2`) to interactive elements.
