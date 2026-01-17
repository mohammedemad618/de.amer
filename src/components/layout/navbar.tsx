import Link from 'next/link'
import { cn } from '@/lib/utils/cn'
import { getSessionUser } from '@/lib/auth/guards'
import { LogoutButton } from '@/components/auth/logout-button'
import { getSetting } from '@/lib/settings'

const navLinks = [
  { href: '/', label: 'الرئيسية' },
  { href: '/about', label: 'من نحن' },
  { href: '/courses', label: 'الدورات' },
  { href: '/contact', label: 'تواصل' }
]

export async function Navbar() {
  // Server Component: cookies() أصبحت async في Next 16
  // لذلك getSessionUser أصبح async أيضاً
  const session = await getSessionUser()
  const siteName = (await getSetting('site_name', 'أمار للتعليم الطبي')) as string

  return (
    <header className='sticky top-0 z-50 border-b border-neutral-200/70 bg-white/80 backdrop-blur'>
      <div className='mx-auto flex max-w-6xl items-center justify-between px-6 py-4'>
        <Link href='/' className='text-lg font-bold text-primary'>
          {siteName}
        </Link>
        <nav className='hidden items-center gap-6 text-sm font-semibold text-neutral-700 lg:flex' aria-label='روابط التنقل'>
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className='transition hover:text-primary'>
              {link.label}
            </Link>
          ))}
          {session?.role === 'ADMIN' ? (
            <>
              <Link href='/admin/dashboard' className='transition hover:text-primary text-primary font-bold'>
                لوحة التحكم
              </Link>
              <Link href='/admin/courses' className='transition hover:text-primary text-primary font-bold'>
                إدارة الدورات
              </Link>
              <Link href='/admin/settings' className='transition hover:text-primary text-primary font-bold'>
                الإعدادات
              </Link>
            </>
          ) : (
            session && (
              <Link href='/dashboard' className='transition hover:text-primary'>
                لوحة التحكم
              </Link>
            )
          )}
        </nav>
        <div className='flex items-center gap-3'>
          {session ? (
            <>
              <span className='hidden text-xs font-semibold text-neutral-500 md:block'>{session.email}</span>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href='/auth/login' className='text-sm font-semibold text-neutral-600 hover:text-primary'>
                تسجيل الدخول
              </Link>
              <Link
                href='/auth/register'
                className={cn(
                  'inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:bg-indigo-500 focus-ring'
                )}
              >
                إنشاء حساب
              </Link>
            </>
          )}
        </div>
      </div>
      <div className='border-t border-neutral-200/70 bg-white/90 lg:hidden'>
        <nav className='mx-auto flex max-w-6xl flex-wrap gap-4 px-6 py-3 text-sm font-semibold text-neutral-700' aria-label='روابط التنقل'>
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className='transition hover:text-primary'>
              {link.label}
            </Link>
          ))}
          {session?.role === 'ADMIN' ? (
            <>
              <Link href='/admin/dashboard' className='transition hover:text-primary text-primary font-bold'>
                لوحة التحكم
              </Link>
              <Link href='/admin/courses' className='transition hover:text-primary text-primary font-bold'>
                إدارة الدورات
              </Link>
              <Link href='/admin/settings' className='transition hover:text-primary text-primary font-bold'>
                الإعدادات
              </Link>
            </>
          ) : (
            session && (
              <Link href='/dashboard' className='transition hover:text-primary'>
                لوحة التحكم
              </Link>
            )
          )}
        </nav>
      </div>
    </header>
  )
}
