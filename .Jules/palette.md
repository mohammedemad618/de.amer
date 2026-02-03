## 2024-05-23 - RTL Button Loading State
**Learning:** In RTL interfaces (Arabic), standard margin classes like `mr-2` place the spinner incorrectly on the left (end) of the button. Using logical property `me-2` (margin-end) ensures the spinner appears correctly at the start of the text (right side in RTL) regardless of direction.
**Action:** Always use logical properties (`ms-`, `me-`, `ps-`, `pe-`) for spacing in this project.
