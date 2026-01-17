import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const level = searchParams.get('level')
  const priceType = searchParams.get('priceType')
  const priceMin = searchParams.get('priceMin')
  const priceMax = searchParams.get('priceMax')
  const hoursMin = searchParams.get('hoursMin')
  const hoursMax = searchParams.get('hoursMax')

  const priceFilter: { gte?: number; lte?: number; equals?: number; gt?: number } = {}

  if (priceType === 'free') {
    priceFilter.equals = 0
  } else if (priceType === 'paid') {
    priceFilter.gt = 0
  }

  if (priceMin) {
    priceFilter.gte = Number(priceMin)
  }

  if (priceMax) {
    priceFilter.lte = Number(priceMax)
  }

  const courses = await prisma.course.findMany({
    where: {
      ...(category ? { category: { contains: category } } : {}),
      ...(level ? { level: level.toUpperCase() } : {}),
      ...(Object.keys(priceFilter).length ? { price: priceFilter } : {}),
      ...(hoursMin || hoursMax
        ? {
            hours: {
              ...(hoursMin ? { gte: Number(hoursMin) } : {}),
              ...(hoursMax ? { lte: Number(hoursMax) } : {})
            }
          }
        : {})
    },
    orderBy: { createdAt: 'desc' }
  })

  return NextResponse.json({ courses })
}

