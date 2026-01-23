import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

/**
 * Prisma 事务客户端类型
 * 用于类型化 $transaction 回调中的 tx 参数
 */
export type PrismaTransactionClient = Omit<
  Prisma.TransactionClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>;
