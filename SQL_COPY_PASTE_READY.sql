-- Neon PostgreSQL Migration Script
-- انسخ هذا الملف بالكامل والصقه في Neon SQL Editor
-- ثم اضغط زر "Run" (وليس "Explain")

-- إنشاء الجداول
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  "passwordHash" VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'USER',
  "createdAt" TIMESTAMPTZ(6) DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  category VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  objectives TEXT NOT NULL,
  hours INTEGER NOT NULL,
  price DOUBLE PRECISION NOT NULL,
  level VARCHAR(50) NOT NULL,
  thumbnail VARCHAR(500) NOT NULL,
  "meetingLink" VARCHAR(500),
  "createdAt" TIMESTAMPTZ(6) DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ(6) DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "courseId" UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL,
  "progressPercent" INTEGER NOT NULL,
  "certificateId" VARCHAR(255),
  "certificateUrl" VARCHAR(500),
  "createdAt" TIMESTAMPTZ(6) DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ(6) DEFAULT NOW(),
  UNIQUE ("userId", "courseId")
);

CREATE TABLE IF NOT EXISTS refreshtokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(500) UNIQUE NOT NULL,
  "expiresAt" TIMESTAMPTZ(6) NOT NULL,
  "createdAt" TIMESTAMPTZ(6) DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ratelimits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip VARCHAR(255) UNIQUE NOT NULL,
  count INTEGER DEFAULT 1,
  "resetAt" TIMESTAMPTZ(6) NOT NULL,
  "createdAt" TIMESTAMPTZ(6) DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ(6) DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "courseId" UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  content TEXT NOT NULL,
  "order" INTEGER NOT NULL,
  duration INTEGER,
  "videoUrl" VARCHAR(500),
  resources TEXT,
  "createdAt" TIMESTAMPTZ(6) DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ(6) DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS systemsettings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(255) UNIQUE NOT NULL,
  value TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'string',
  category VARCHAR(100) DEFAULT 'general',
  "updatedAt" TIMESTAMPTZ(6) DEFAULT NOW(),
  "updatedBy" UUID
);

-- إنشاء Indexes
CREATE INDEX IF NOT EXISTS idx_enrollments_userid ON enrollments("userId");
CREATE INDEX IF NOT EXISTS idx_enrollments_courseid ON enrollments("courseId");
CREATE INDEX IF NOT EXISTS idx_refreshtokens_userid ON refreshtokens("userId");
CREATE INDEX IF NOT EXISTS idx_refreshtokens_expiresat ON refreshtokens("expiresAt");
CREATE INDEX IF NOT EXISTS idx_refreshtokens_token ON refreshtokens(token);
CREATE INDEX IF NOT EXISTS idx_ratelimits_resetat ON ratelimits("resetAt");
CREATE INDEX IF NOT EXISTS idx_lessons_courseid ON lessons("courseId");
CREATE INDEX IF NOT EXISTS idx_lessons_courseid_order ON lessons("courseId", "order");
CREATE INDEX IF NOT EXISTS idx_systemsettings_category ON systemsettings(category);
