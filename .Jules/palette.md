# Palette's Journal

## 2024-05-23 - [RTL Support & Accessibility]
**Learning:** This application uses `tailwindcss-rtl` for Right-to-Left support. Standard Tailwind classes like `mr-2` (margin-right) might behave differently or be replaced by logical properties in RTL contexts. However, `tailwindcss-rtl` often automates this. When adding UI elements like spinners, it's safer to use logical properties (e.g., `me-2` for margin-end) if manual spacing is needed, to ensure correct spacing in both LTR and RTL modes (Arabic).
**Action:** Use logical CSS properties where possible, and verify spacing in RTL context.

## 2026-02-01 - Component Ref Forwarding
**Learning:** Base UI components like `Input` and `Button` lacked `React.forwardRef`. This prevents libraries like `react-hook-form` from managing focus correctly (e.g., focusing the input on validation error), which is a critical accessibility requirement.
**Action:** Always wrap base UI atoms in `React.forwardRef` to ensure they support external ref handling for focus management and library integration.
