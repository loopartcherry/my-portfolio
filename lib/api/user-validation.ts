import { z } from 'zod';
import { validateRequest } from './validation';

/** POST /api/admin/users 请求体（管理员创建用户） */
export const CreateUserSchema = z.object({
  email: z.string().email('邮箱格式不正确'),
  password: z.string().min(6, '密码至少6位').optional(),
  name: z.string().min(1, '姓名不能为空'),
  phone: z.string().optional(),
  role: z.enum(['client', 'designer', 'admin']),
  // 设计师专用字段
  specialties: z.array(z.string()).optional(),
  hourlyRate: z.number().min(0).optional(),
  maxCapacity: z.number().int().min(1).optional(),
});

export function validateCreateUser(data: unknown) {
  return validateRequest(CreateUserSchema, data);
}
