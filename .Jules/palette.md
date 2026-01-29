## 2025-02-18 - Standardizing Button Loading States
**Learning:** The app used manual text replacement (e.g. "Loading...") for button loading states, leading to inconsistent UX and extra code in consumers.
**Action:** Added `isLoading` prop to `Button` to standardize the loading experience with a spinner, maintaining button width and providing immediate visual feedback.
