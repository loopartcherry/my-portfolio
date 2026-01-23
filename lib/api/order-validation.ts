import { z } from 'zod';
import { validateRequest } from './validation';

/** POST /api/orders/create 请求体（创建模板订单） */
export const CreateTemplateOrderSchema = z.object({
  templateId: z.string().min(1, '模板ID不能为空'),
});

export function validateCreateTemplateOrder(data: unknown) {
  return validateRequest(CreateTemplateOrderSchema, data);
}

/** POST /api/payments/callback 请求体（支付回调） */
export const PaymentCallbackSchema = z.object({
  orderId: z.string().min(1, '订单ID不能为空'),
  transactionId: z.string().min(1, '交易ID不能为空'),
  paymentMethod: z.enum(['stripe', 'alipay', 'wechat']),
  amount: z.number().min(0, '金额必须大于0'),
  status: z.enum(['success', 'failed']),
  signature: z.string().optional(), // 支付平台签名（用于验证）
});

export function validatePaymentCallback(data: unknown) {
  return validateRequest(PaymentCallbackSchema, data);
}
