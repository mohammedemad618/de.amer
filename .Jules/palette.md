## 2024-05-22 - Button Loading State Pattern
**Learning:** The `Button` component using Radix UI `Slot` (`asChild`) cannot easily accept injected children like spinners because `Slot` expects a single child.
**Action:** When adding `isLoading` to Buttons using `asChild`, only apply `disabled` and `aria-busy` states; do not attempt to render the spinner inside the Slot. For standard buttons (`!asChild`), rendering the spinner inline is safe.
