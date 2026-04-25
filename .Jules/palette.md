## 2026-04-25 - Interactive Cards Keyboard Accessibility
**Learning:** Custom UI components like clickable `Card`s often lack native keyboard support (tab focus, enter/space interaction) compared to `<button>` elements, breaking keyboard navigation for primary actions (like opening modals).
**Action:** Always verify that elements acting as buttons but implemented as custom `div`s or `Card`s have `role="button"`, `tabIndex={0}`, an explicit `aria-label`, an `onKeyDown` handler (Enter/Space), and visible focus states (`focus-visible:ring-2`).
