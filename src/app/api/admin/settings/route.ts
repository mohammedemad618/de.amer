import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db/prisma'
import { requireAdmin } from '@/lib/auth/guards'
import { verifyCsrf } from '@/lib/security/csrf'

const settingSchema = z.object({
  key: z.string().min(1, 'المفتاح مطلوب'),
  value: z.string(),
  type: z.enum(['string', 'number', 'boolean', 'json']).default('string'),
  category: z.string().default('general')
})

// GET: جلب جميع الإعدادات أو إعدادات فئة معينة
export async function GET(request: Request) {
  try {
    await requireAdmin()

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    const settings = await prisma.systemSettings.findMany({
      where: category ? { category } : undefined,
      orderBy: [{ category: 'asc' }, { key: 'asc' }]
    })

    // تحويل القيم حسب النوع
    const formattedSettings = settings.map((setting) => {
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
        // في حالة فشل التحويل، نستخدم القيمة الأصلية
      }
      return {
        ...setting,
        value: parsedValue
      }
    })

    return NextResponse.json({ settings: formattedSettings })
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json({ message: 'غير مصرح لك بالوصول إلى هذه الصفحة.' }, { status: 403 })
    }
    console.error('خطأ في جلب الإعدادات:', error)
    return NextResponse.json({ message: 'حدث خطأ أثناء جلب الإعدادات.' }, { status: 500 })
  }
}

// POST: إنشاء أو تحديث إعداد
export async function POST(request: Request) {
  try {
    await requireAdmin()

    const csrfValid = await verifyCsrf(request)
    if (!csrfValid) {
      return NextResponse.json(
        { message: 'رمز الحماية غير صالح. يرجى تحديث الصفحة والمحاولة مرة أخرى.' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const parsed = settingSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { message: 'بيانات غير صالحة', errors: parsed.error.errors },
        { status: 400 }
      )
    }

    // تحويل القيمة إلى string حسب النوع
    let stringValue = parsed.data.value
    if (parsed.data.type === 'number' || parsed.data.type === 'boolean') {
      stringValue = String(parsed.data.value)
    } else if (parsed.data.type === 'json') {
      stringValue = JSON.stringify(parsed.data.value)
    }

    const session = await requireAdmin()
    const setting = await prisma.systemSettings.upsert({
      where: { key: parsed.data.key },
      update: {
        value: stringValue,
        type: parsed.data.type,
        category: parsed.data.category,
        updatedBy: session.id
      },
      create: {
        key: parsed.data.key,
        value: stringValue,
        type: parsed.data.type,
        category: parsed.data.category,
        updatedBy: session.id
      }
    })

    // تحويل القيمة للعرض
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

    return NextResponse.json({
      setting: { ...setting, value: parsedValue },
      message: 'تم حفظ الإعداد بنجاح.'
    })
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json({ message: 'غير مصرح لك بالوصول إلى هذه الصفحة.' }, { status: 403 })
    }
    console.error('خطأ في حفظ الإعداد:', error)
    return NextResponse.json({ message: 'حدث خطأ أثناء حفظ الإعداد.' }, { status: 500 })
  }
}
