# Palette's UX/A11y Journal

## 2024-05-22 - Standardized Button Loading State
**Learning:** Users need clear feedback during async actions like Login to prevent uncertainty and multiple submissions. Implementing a reusable `isLoading` prop on the `Button` component simplifies this across the app and ensures consistent behavior (disabled state, spinner position).
**Action:** Use the `isLoading` prop for all async form submissions instead of manual text replacement to prevent layout shifts and improve accessibility.
