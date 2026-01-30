# Palette's Journal

## 2024-10-24 - Standardizing Button Loading States
**Learning:** Replacing text-based loading indicators (e.g., "Loading...") with a spinner prevents layout shifts but removes the explicit status text for screen readers.
**Action:** Always add `aria-busy="true"` to buttons when in a loading state to communicate the processing status to assistive technology without visual disruption.
