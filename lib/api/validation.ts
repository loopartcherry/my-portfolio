import { z } from 'zod';

/**
 * 订阅套餐类型
 */
export const SubscriptionTypeSchema = z.enum(['monthly', 'yearly']);

/**
 * 订阅请求验证
 */
export const SubscribeRequestSchema = z.object({
  planId: z.string().min(1, '套餐ID不能为空'),
  type: SubscriptionTypeSchema,
});

/**
 * 升级请求验证
 */
export const UpgradeRequestSchema = z.object({
  planId: z.string().min(1, '套餐ID不能为空'),
});

/**
 * 验证请求体
 */
export function validateRequest<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const messages = error.issues.map((e) => {
        const path = e.path.length > 0 ? e.path.join('.') : 'root';
        return `${path}: ${e.message}`;
      });
      throw new Error(`验证失败: ${messages.join(', ')}`);
    }
    throw error;
  }
}
