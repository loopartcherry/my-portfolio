import { z } from 'zod';
import { validateRequest } from './validation';

/** POST /api/auth/login 请求体 */
export const LoginSchema = z.object({
  email: z.string().email('邮箱格式不正确'),
  password: z.string().min(6, '密码至少6位'),
});

/** POST /api/auth/register 请求体 */
export const RegisterSchema = z.object({
  email: z.string().email('邮箱格式不正确'),
  password: z.string().min(6, '密码至少6位'),
  name: z.string().min(1, '姓名不能为空'),
  phone: z.string().optional(),
});

export function validateLogin(data: unknown) {
  return validateRequest(LoginSchema, data);
}

export function validateRegister(data: unknown) {
  return validateRequest(RegisterSchema, data);
}
