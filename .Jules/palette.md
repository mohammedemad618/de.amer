## 2024-05-23 - RTL Spacing for Loading States
**Learning:** In an RTL interface (Arabic), standard `margin-right` (`mr-2`) pushes elements to the left (towards center), which is correct for `[Spinner] [Text]` layout where spinner is on the right. However, logical property `margin-inline-end` (`me-2`) is more robust as it automatically handles LTR/RTL switching if the app supports both.
**Action:** Use `me-2` or `ms-2` for spacing icon/text relationships to ensure correct layout regardless of direction.
