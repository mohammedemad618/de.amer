-- Neon PostgreSQL Default Settings Seed Script
-- انسخ هذا الملف بالكامل والصقه في Neon SQL Editor
-- ثم اضغط زر "Run" (وليس "Explain")
-- يجب تنفيذ هذا بعد SQL_COPY_PASTE_READY.sql

-- إدراج الإعدادات الافتراضية (General Settings)
INSERT INTO systemsettings (key, value, type, category, "updatedAt")
VALUES 
  ('site_name', 'أمار للتعليم الطبي', 'string', 'general', NOW()),
  ('site_description', 'منصة عربية لتطوير المهارات المهنية في التغذية العلاجية والعلاج الوظيفي', 'string', 'general', NOW()),
  ('site_url', 'https://amar-medical.com', 'string', 'general', NOW()),
  ('enable_registrations', 'true', 'boolean', 'general', NOW())
ON CONFLICT (key) DO NOTHING;

-- إدراج إعدادات التواصل (Contact Settings)
INSERT INTO systemsettings (key, value, type, category, "updatedAt")
VALUES 
  ('contact_email', 'info@amar-medical.com', 'string', 'contact', NOW()),
  ('contact_phone', '+966500000000', 'string', 'contact', NOW()),
  ('contact_address', 'دمشق - سوريا', 'string', 'contact', NOW())
ON CONFLICT (key) DO NOTHING;

-- إدراج إعدادات SEO (SEO Settings)
INSERT INTO systemsettings (key, value, type, category, "updatedAt")
VALUES 
  ('meta_keywords', 'التغذية العلاجية, العلاج الوظيفي, التعليم الطبي, الدورات الطبية', 'string', 'seo', NOW()),
  ('og_image', '/og-image.jpg', 'string', 'seo', NOW()),
  ('og_title', 'أمار للتعليم الطبي', 'string', 'seo', NOW()),
  ('og_description', 'منصة عربية لتطوير المهارات المهنية في التغذية العلاجية والعلاج الوظيفي', 'string', 'seo', NOW())
ON CONFLICT (key) DO NOTHING;

-- إدراج إعدادات الدورات (Courses Settings)
INSERT INTO systemsettings (key, value, type, category, "updatedAt")
VALUES 
  ('default_currency', 'USD', 'string', 'courses', NOW()),
  ('courses_per_page', '12', 'number', 'courses', NOW()),
  ('enable_enrollments', 'true', 'boolean', 'courses', NOW())
ON CONFLICT (key) DO NOTHING;

-- إدراج إعدادات البريد الإلكتروني (Email Settings)
INSERT INTO systemsettings (key, value, type, category, "updatedAt")
VALUES 
  ('email_from_name', 'أمار للتعليم الطبي', 'string', 'email', NOW()),
  ('email_from_address', 'noreply@amar-medical.com', 'string', 'email', NOW()),
  ('email_smtp_host', 'smtp.example.com', 'string', 'email', NOW()),
  ('email_smtp_port', '587', 'number', 'email', NOW()),
  ('email_smtp_user', '', 'string', 'email', NOW()),
  ('email_smtp_password', '', 'string', 'email', NOW()),
  ('email_enabled', 'false', 'boolean', 'email', NOW())
ON CONFLICT (key) DO NOTHING;

-- إدراج إعدادات الأمان (Security Settings)
INSERT INTO systemsettings (key, value, type, category, "updatedAt")
VALUES 
  ('max_login_attempts', '5', 'number', 'security', NOW()),
  ('lockout_duration', '15', 'number', 'security', NOW()),
  ('session_timeout', '60', 'number', 'security', NOW()),
  ('require_email_verification', 'false', 'boolean', 'security', NOW()),
  ('password_min_length', '8', 'number', 'security', NOW())
ON CONFLICT (key) DO NOTHING;

-- إدراج إعدادات الدفع (Payment Settings)
INSERT INTO systemsettings (key, value, type, category, "updatedAt")
VALUES 
  ('payment_gateway', 'stripe', 'string', 'payment', NOW()),
  ('payment_enabled', 'false', 'boolean', 'payment', NOW()),
  ('stripe_publishable_key', '', 'string', 'payment', NOW()),
  ('stripe_secret_key', '', 'string', 'payment', NOW()),
  ('stripe_webhook_secret', '', 'string', 'payment', NOW())
ON CONFLICT (key) DO NOTHING;

-- التحقق من الإدراج
SELECT category, COUNT(*) as count 
FROM systemsettings 
GROUP BY category 
ORDER BY category;
