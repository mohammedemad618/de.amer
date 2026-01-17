import { NextResponse } from 'next/server'
import { sql } from '@/lib/db/neon'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const level = searchParams.get('level')
  const priceType = searchParams.get('priceType')
  const priceMin = searchParams.get('priceMin')
  const priceMax = searchParams.get('priceMax')
  const hoursMin = searchParams.get('hoursMin')
  const hoursMax = searchParams.get('hoursMax')

  // بناء SQL query ديناميكياً
  let query = sql`SELECT * FROM courses WHERE 1=1`
  const conditions: any[] = []

  if (category) {
    query = sql`${query} AND category ILIKE ${'%' + category + '%'}`
  }

  if (level) {
    query = sql`${query} AND level = ${level.toUpperCase()}`
  }

  if (priceType === 'free') {
    query = sql`${query} AND price = 0`
  } else if (priceType === 'paid') {
    query = sql`${query} AND price > 0`
  }

  if (priceMin) {
    query = sql`${query} AND price >= ${Number(priceMin)}`
  }

  if (priceMax) {
    query = sql`${query} AND price <= ${Number(priceMax)}`
  }

  if (hoursMin) {
    query = sql`${query} AND hours >= ${Number(hoursMin)}`
  }

  if (hoursMax) {
    query = sql`${query} AND hours <= ${Number(hoursMax)}`
  }

  query = sql`${query} ORDER BY "createdAt" DESC`

  const courses = await query
  return NextResponse.json({ courses })
}

