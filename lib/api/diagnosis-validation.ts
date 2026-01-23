import { z } from 'zod';
import { validateRequest } from './validation';

/** POST /api/diagnosis/submit 请求体 */
export const SubmitDiagnosisSchema = z.object({
  companyInfo: z.object({
    name: z.string().optional(),
    industry: z.string().optional(),
    stage: z.string().optional(),
    size: z.string().optional(),
  }).optional(),
  answers: z.record(z.string(), z.number().min(1).max(4)),
  contactInfo: z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
  }).optional(),
});

export function validateSubmitDiagnosis(data: unknown) {
  return validateRequest(SubmitDiagnosisSchema, data);
}

/** POST /api/consultations/create 请求体 */
export const CreateConsultationSchema = z.object({
  diagnosisId: z.string().min(1, '诊断ID不能为空'),
  name: z.string().min(1, '姓名不能为空'),
  email: z.string().email('邮箱格式不正确'),
  phone: z.string().min(1, '手机号不能为空'),
  company: z.string().optional(),
  position: z.string().optional(),
  preferredDate: z.string().optional(),
  preferredTime: z.string().optional(),
  message: z.string().optional(),
  type: z.enum(['expert', 'solution', 'custom']).default('expert'),
});

export function validateCreateConsultation(data: unknown) {
  return validateRequest(CreateConsultationSchema, data);
}
