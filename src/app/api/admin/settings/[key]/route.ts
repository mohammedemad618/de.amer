import { NextResponse } from 'next/server'
import { sql, getFirst } from '@/lib/db/neon'
import { requireAdmin } from '@/lib/auth/guards'
import { verifyCsrf } from '@/lib/security/csrf'

// GET: جلب إعداد معين
export async function GET(
  request: Request,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    await requireAdmin()

    const { key } = await params
    const results = await sql`
      SELECT * FROM systemsettings 
      WHERE key = ${key}
      LIMIT 1
    `
    const setting = getFirst(results)

    if (!setting) {
      return NextResponse.json({ message: 'الإعداد غير موجود.' }, { status: 404 })
    }

    // تحويل القيمة حسب النوع
    let parsedValue: any = setting.value
    try {
      if (setting.type === 'number') {
        parsedValue = Number(setting.value)
      } else if (setting.type === 'boolean') {
        parsedValue = setting.value === 'true'
      } else if (setting.type === 'json') {
        parsedValue = JSON.parse(setting.value)
      }
    } catch {
      parsedValue = setting.value
    }

    return NextResponse.json({ setting: { ...setting, value: parsedValue } })
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json({ message: 'غير مصرح لك بالوصول إلى هذه الصفحة.' }, { status: 403 })
    }
    console.error('خطأ في جلب الإعداد:', error)
    return NextResponse.json({ message: 'حدث خطأ أثناء جلب الإعداد.' }, { status: 500 })
  }
}

// DELETE: حذف إعداد
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    await requireAdmin()

    const csrfValid = await verifyCsrf(request)
    if (!csrfValid) {
      return NextResponse.json(
        { message: 'رمز الحماية غير صالح. يرجى تحديث الصفحة والمحاولة مرة أخرى.' },
        { status: 403 }
      )
    }

    const { key } = await params
    await sql`
      DELETE FROM systemsettings 
      WHERE key = ${key}
    `

    return NextResponse.json({ message: 'تم حذف الإعداد بنجاح.' })
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json({ message: 'غير مصرح لك بالوصول إلى هذه الصفحة.' }, { status: 403 })
    }
    // في SQL، إذا لم يتم حذف أي صف، لا يوجد خطأ - نتحقق من ذلك يدوياً إذا لزم الأمر
    console.error('خطأ في حذف الإعداد:', error)
    return NextResponse.json({ message: 'حدث خطأ أثناء حذف الإعداد.' }, { status: 500 })
  }
}
