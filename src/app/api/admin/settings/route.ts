import { NextResponse } from 'next/server'
import { z } from 'zod'
import { sql, getFirst } from '@/lib/db/neon'
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

    let settings: any[]
    if (category) {
      settings = await sql`
        SELECT * FROM systemsettings 
        WHERE category = ${category}
        ORDER BY category ASC, key ASC
      `
    } else {
      settings = await sql`
        SELECT * FROM systemsettings 
        ORDER BY category ASC, key ASC
      `
    }

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
    const now = new Date()
    
    // التحقق من وجود الإعداد
    const existingResults = await sql`
      SELECT * FROM systemsettings 
      WHERE key = ${parsed.data.key}
      LIMIT 1
    `
    const existing = getFirst(existingResults)
    
    let setting: any
    if (existing) {
      // تحديث الإعداد الموجود
      const updatedResults = await sql`
        UPDATE systemsettings 
        SET value = ${stringValue},
            type = ${parsed.data.type},
            category = ${parsed.data.category},
            "updatedBy" = ${session.id},
            "updatedAt" = ${now}
        WHERE key = ${parsed.data.key}
        RETURNING *
      `
      setting = getFirst(updatedResults)
    } else {
      // إنشاء إعداد جديد
      const createdResults = await sql`
        INSERT INTO systemsettings (id, key, value, type, category, "updatedBy", "updatedAt")
        VALUES (gen_random_uuid(), ${parsed.data.key}, ${stringValue}, ${parsed.data.type}, ${parsed.data.category}, ${session.id}, ${now})
        RETURNING *
      `
      setting = getFirst(createdResults)
    }

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
