## 2026-02-02 - Centralized Loading States in Core Components
**Learning:** Centralizing loading logic (spinner + disabled state) in the base `Button` component ensures consistency across the app and reduces boilerplate in feature components (like `LogoutButton`). It also guarantees that accessibility attributes (`aria-busy`) are never missed.
**Action:** When adding async interactions, check if the base component can handle the loading state natively before implementing custom state handling in the parent.
