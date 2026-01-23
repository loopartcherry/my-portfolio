import { z } from 'zod';
import { validateRequest } from './validation';

const DesignerStatusSchema = z.enum(['active', 'inactive', 'on_leave']);

/** GET /api/admin/designers 查询参数 */
export const DesignerListQuerySchema = z.object({
  status: DesignerStatusSchema.optional(),
  specialty: z.string().optional(),
  sortBy: z.enum(['rating', 'capacity', 'load']).optional(),
});

/** PATCH /api/admin/designers/[id] 请求体 */
export const DesignerUpdateSchema = z.object({
  specialties: z.array(z.string()).optional(),
  hourlyRate: z.number().min(0).optional(),
  maxCapacity: z.number().int().min(0).optional(),
  status: DesignerStatusSchema.optional(),
});

/** POST /api/admin/designers/[id]/assign-project 请求体 */
export const AssignProjectSchema = z.object({
  projectId: z.string().min(1, '项目ID不能为空'),
  estimatedHours: z.number().min(0).optional(),
  priority: z.number().int().min(0).optional(),
});

/** POST /api/admin/designers/[id]/reassign-project 请求体 */
export const ReassignProjectSchema = z.object({
  projectId: z.string().min(1, '项目ID不能为空'),
  newDesignerId: z.string().min(1, '新设计师ID不能为空'),
  reason: z.string().optional(),
});

/** GET /api/admin/designers/[id]/projects 查询参数 */
export const DesignerProjectsQuerySchema = z.object({
  status: z.string().optional(),
  sortBy: z.enum(['createdAt', 'assignedAt', 'completionRate']).optional(),
});

/** POST /api/admin/designers 创建设计师请求体 */
export const CreateDesignerSchema = z.object({
  email: z.string().email('邮箱格式无效'),
  password: z.string().min(6, '密码至少6位').optional(),
  name: z.string().optional(),
  phone: z.string().optional(),
  specialties: z.array(z.string()).optional(),
  hourlyRate: z.number().min(0).optional(),
  maxCapacity: z.number().int().min(0).optional(),
});

export function validateDesignerListQuery(data: unknown) {
  return validateRequest(DesignerListQuerySchema, data);
}

export function validateDesignerUpdate(data: unknown) {
  return validateRequest(DesignerUpdateSchema, data);
}

export function validateAssignProject(data: unknown) {
  return validateRequest(AssignProjectSchema, data);
}

export function validateReassignProject(data: unknown) {
  return validateRequest(ReassignProjectSchema, data);
}

export function validateDesignerProjectsQuery(data: unknown) {
  return validateRequest(DesignerProjectsQuerySchema, data);
}

export function validateCreateDesigner(data: unknown) {
  return validateRequest(CreateDesignerSchema, data);
}
