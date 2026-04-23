
## 2024-04-23 - Interactive Card Keyboard Accessibility
**Learning:** In the application, clickable cards using generic `div`s (e.g., `<Card onClick={...}>`) lack native keyboard focus and interaction out of the box, making them unreachable by keyboard-only or screen reader users. The `FacultyCard` was relying entirely on mouse-click events.
**Action:** Always add `role="button"`, `tabIndex={0}`, an `onKeyDown` handler (for `Enter` and `Space` keys), and explicit `focus-visible` outline classes when converting non-interactive elements (like cards or divs) into interactive components that have an `onClick` property.
