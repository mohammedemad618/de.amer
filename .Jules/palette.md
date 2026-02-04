## 2024-05-23 - Button Loading State Pattern
**Learning:** Centralizing loading states in the `Button` component (via `isLoading` prop) reduces boilerplate in forms and ensures consistent feedback (spinner + disabled state) compared to manual text toggling.
**Action:** Use `isLoading` and `loadingText` props on `Button` for all async actions instead of manually managing disabled states and labels.
