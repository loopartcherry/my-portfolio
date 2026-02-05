import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

let url = process.env.DATABASE_URL || 'postgresql://postgres:postgres@127.0.0.1:5432/myportfolio'

// Supabase 及多数云数据库要求 SSL，未带 sslmode 时自动追加（避免线上「服务暂时不可用」）
if ((url.includes('supabase.co') || url.includes('pooler.supabase.com')) && !url.includes('sslmode=')) {
  url += url.includes('?') ? '&sslmode=require' : '?sslmode=require'
}

// Prisma 7：直连 Postgres 必须用 driver adapter；accelerateUrl 仅支持 prisma:// 或 prisma+postgres://
const isDirectPostgres = url.startsWith('postgresql://') || url.startsWith('postgres://')
const adapter = isDirectPostgres ? new PrismaPg({ connectionString: url }) : undefined

// 直连 Postgres 只传 adapter，不传 accelerateUrl（accelerateUrl 仅支持 prisma:// 或 prisma+postgres://）
const logLevel: ('error' | 'warn')[] = process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error']
export const prisma =
  globalForPrisma.prisma ??
  (adapter
    ? new PrismaClient({ adapter, log: logLevel })
    : new PrismaClient({ accelerateUrl: url, log: logLevel }))

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
