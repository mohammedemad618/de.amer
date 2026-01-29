## 2026-01-29 - Missing forwardRef in UI Components
**Learning:** Found base UI components (Input) missing `forwardRef`, which breaks integration with form libraries like `react-hook-form` (specifically error focus).
**Action:** Always wrap base UI components in `forwardRef` to ensure refs are passed to the underlying DOM element.
