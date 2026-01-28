## 2026-01-28 - Icon-Only Buttons Missing Labels
**Learning:** Found multiple icon-only buttons (delete actions, view toggles) in the admin interface that lacked accessible names (`aria-label`). Screen reader users would only hear "button" or "unlabeled button".
**Action:** Always verify icon-only buttons have `aria-label` or `aria-labelledby`, especially for destructive actions like delete.
