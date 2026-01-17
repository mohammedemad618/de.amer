-- إنشاء مستخدم Admin افتراضي
-- تحذير: يجب تغيير كلمة السر بعد أول تسجيل دخول!

-- استخدم bcrypt hash للكلمة السرية
-- يمكنك توليد hash باستخدام: bcrypt.hash('your-password', 10)
-- أو استخدم: https://bcrypt-generator.com/ (للتطوير فقط!)

-- مثال: كلمة السر "admin123456" (يجب تغييرها!)
-- Hash: $2b$10$rP9X8QvZ3Z3Z3Z3Z3Z3Z3OeX8QvZ3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z

-- استبدل 'YOUR_BCRYPT_HASH_HERE' بالـ hash الفعلي
INSERT INTO users (id, name, email, "passwordHash", role, "createdAt")
VALUES (
  gen_random_uuid(),
  'Admin User',
  'admin@amar-medical.com',
  'YOUR_BCRYPT_HASH_HERE', -- استبدل هذا بـ bcrypt hash للكلمة السرية
  'ADMIN',
  NOW()
)
ON CONFLICT (email) DO NOTHING;

-- التحقق من إنشاء المستخدم
SELECT id, name, email, role, "createdAt" 
FROM users 
WHERE role = 'ADMIN';
