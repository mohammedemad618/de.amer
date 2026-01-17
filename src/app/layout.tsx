import type { Metadata } from 'next'
import { Cairo } from 'next/font/google'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { ButterfliesBackground } from '@/components/background/butterflies-background'
import { ErrorBoundary } from '@/components/error-boundary'
import { ToastProvider } from '@/components/ui/toast'
import { getBaseUrl } from '@/lib/config/env'
import { getSettings } from '@/lib/settings'
import './globals.css'

const cairo = Cairo({
  subsets: ['arabic'],
  variable: '--font-cairo',
  weight: ['300', '400', '500', '600', '700', '800']
})

// Base URL من متغيرات البيئة
const baseUrl = getBaseUrl()

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings(['site_name', 'site_description', 'site_url', 'og_image', 'meta_keywords'])
  const siteName = (settings.site_name as string) || 'أمار للتعليم الطبي'
  const siteDescription = (settings.site_description as string) || 'منصة عربية لتطوير المهارات المهنية في التغذية العلاجية والعلاج الوظيفي بمحتوى عملي متخصص.'
  const siteUrl = (settings.site_url as string) || baseUrl
  const ogImage = (settings.og_image as string) || ''
  const metaKeywords = (settings.meta_keywords as string) || ''

  return {
    title: `${siteName} | دورات التغذية والعلاج الوظيفي`,
    description: siteDescription,
    keywords: metaKeywords || undefined,
    metadataBase: new URL(siteUrl || baseUrl),
    openGraph: {
      title: `${siteName} | دورات التغذية والعلاج الوظيفي`,
      description: siteDescription,
      url: siteUrl || baseUrl,
      siteName: siteName,
      locale: 'ar_AR',
      type: 'website',
      ...(ogImage && { images: [{ url: ogImage }] })
    },
    alternates: {
      canonical: '/'
    }
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='ar' dir='rtl'>
      <body className={cairo.variable}>
        <ErrorBoundary>
          <ToastProvider>
            <ButterfliesBackground />
            <a href='#content' className='skip-link'>
              تخطي إلى المحتوى
            </a>
            <Navbar />
            <main id='content'>{children}</main>
            <Footer />
          </ToastProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
