## 2024-05-23 - Button Loading State & RTL

**Learning:** Adding `isLoading` to buttons improves perceived performance. In RTL layouts, use logical margin properties (e.g., `me-2`) on the spinner to ensure correct spacing relative to the text, regardless of direction. The spinner should be placed logically before the text content.

**Action:** Always include `isLoading` prop in interactive components and use logical properties for spacing.

## 2024-05-23 - Neon DB Client Build Validation

**Learning:** The Neon DB client strictly validates the `DATABASE_URL` format during the build process (even if not connecting). A placeholder URL must be syntactically valid (e.g., `postgresql://user:password@host:port/database?sslmode=require`) to pass validation.

**Action:** Ensure local `.env` or build environment variables provide a valid-looking connection string.
