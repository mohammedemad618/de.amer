## 2024-05-22 - Button Loading State with Slot
**Learning:** The `Button` component uses Radix `Slot` for polymorphism (`asChild`). When `asChild` is true, the component delegates rendering to the child. This prevents injecting the `Spinner` component automatically inside the button wrapper.
**Action:** When adding `isLoading` to components using `Slot`, explicitly check `!asChild` before rendering internal elements, or require the consumer to handle the loading state UI manually if using `asChild`.
