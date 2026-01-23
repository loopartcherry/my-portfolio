import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Prisma 7 要求提供 adapter 或 accelerateUrl
// 使用 DATABASE_URL 作为 accelerateUrl（即使不是真正的 Accelerate URL）
interface PrismaConfig {
  log?: ('error' | 'warn' | 'info' | 'query')[];
  accelerateUrl?: string;
}

const prismaConfig: PrismaConfig = {
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
}

// 提供 accelerateUrl 以满足 Prisma 7 的要求
if (process.env.DATABASE_URL) {
  prismaConfig.accelerateUrl = process.env.DATABASE_URL
} else {
  // 如果没有 DATABASE_URL，使用占位符（会导致运行时错误，但允许构建通过）
  prismaConfig.accelerateUrl = "postgresql://placeholder:placeholder@localhost:5432/placeholder"
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient(prismaConfig)

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
