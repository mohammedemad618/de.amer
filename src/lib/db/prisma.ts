import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error']
  })

// في Production على Netlify، نستخدم globalThis للحفاظ على instance واحد
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
} else {
  // في Production، نستخدم globalThis بدلاً من global
  if (typeof globalThis !== 'undefined') {
    globalForPrisma.prisma = prisma
  }
}


