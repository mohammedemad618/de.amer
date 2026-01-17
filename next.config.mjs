/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // تعطيل typedRoutes لتجنب كسر <Link> مع الروابط الديناميكية/المخزنة كسلاسل نصية
  typedRoutes: false,
  // إعدادات Netlify: لا حاجة لـ output: 'standalone' لأن Netlify يستخدم plugin
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: []
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value:
              process.env.NODE_ENV === 'production'
                ? // Production: CSP صارم بدون unsafe-inline و unsafe-eval
                  "default-src 'self'; img-src 'self' data: blob: https://assets.codepen.io; script-src 'self'; style-src 'self' fonts.googleapis.com; font-src 'self' fonts.gstatic.com; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'"
                : // Development: CSP مرن للسماح بتطوير أسهل
                  "default-src 'self'; img-src 'self' data: blob: https://assets.codepen.io; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' fonts.googleapis.com; font-src 'self' fonts.gstatic.com; connect-src 'self' http://127.0.0.1:7252; frame-ancestors 'none'; base-uri 'self'; form-action 'self'"
          },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' }
        ]
      }
    ]
  }
}

export default nextConfig


