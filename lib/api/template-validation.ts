import { z } from 'zod';
import { validateRequest } from './validation';

const TemplateStatusSchema = z.enum(['draft', 'published', 'archived']);

/** GET /api/admin/templates 查询参数 */
export const TemplateListQuerySchema = z.object({
  status: TemplateStatusSchema.optional(),
  category: z.string().optional(),
  search: z.string().optional(),
  sortBy: z.enum(['createdAt', 'downloads', 'rating', 'views', 'price']).optional(),
  page: z.string().optional().transform((v) => (v ? parseInt(v, 10) : 1)),
  limit: z.string().optional().transform((v) => (v ? parseInt(v, 10) : 20)),
});

/** POST /api/admin/templates 请求体（JSON部分，文件单独处理） */
export const CreateTemplateSchema = z.object({
  name: z.string().min(1, '模板名称不能为空'),
  description: z.string().optional(),
  categoryIds: z.array(z.string()).optional(),
  price: z.number().min(0).optional(),
  discount: z.number().min(0).max(1).optional(),
  tags: z.array(z.string()).optional(),
  author: z.string().optional(),
  status: TemplateStatusSchema.optional(),
});

/** PATCH /api/admin/templates/[id] 请求体 */
export const UpdateTemplateSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  categoryIds: z.array(z.string()).optional(),
  price: z.number().min(0).optional(),
  discount: z.number().min(0).max(1).optional(),
  tags: z.array(z.string()).optional(),
  author: z.string().optional(),
  status: TemplateStatusSchema.optional(),
});

/** PATCH /api/admin/templates/[id]/featured 请求体 */
export const FeaturedTemplateSchema = z.object({
  isFeatured: z.boolean(),
  featuredUntil: z.string().datetime().optional().transform((v) => (v ? new Date(v) : undefined)),
});

/** PATCH /api/admin/templates/[id]/status 请求体 */
export const TemplateStatusUpdateSchema = z.object({
  status: TemplateStatusSchema,
});

/** POST /api/admin/templates/batch-action 请求体 */
export const BatchActionSchema = z.object({
  action: z.enum(['publish', 'archive', 'delete']),
  templateIds: z.array(z.string()).min(1, '至少选择一个模板'),
});

/** POST /api/admin/templates/categories 请求体 */
export const CreateCategorySchema = z.object({
  name: z.string().min(1, '分类名称不能为空'),
  slug: z.string().min(1, 'slug不能为空'),
  description: z.string().optional(),
  icon: z.string().optional(),
  order: z.number().int().min(0).optional(),
  active: z.boolean().optional(),
});

/** PATCH /api/admin/templates/categories/[id] 请求体 */
export const UpdateCategorySchema = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  description: z.string().optional(),
  icon: z.string().optional(),
  order: z.number().int().min(0).optional(),
  active: z.boolean().optional(),
});

export function validateTemplateListQuery(data: unknown) {
  return validateRequest(TemplateListQuerySchema, data);
}

export function validateCreateTemplate(data: unknown) {
  return validateRequest(CreateTemplateSchema, data);
}

export function validateUpdateTemplate(data: unknown) {
  return validateRequest(UpdateTemplateSchema, data);
}

export function validateFeaturedTemplate(data: unknown) {
  return validateRequest(FeaturedTemplateSchema, data);
}

export function validateTemplateStatusUpdate(data: unknown) {
  return validateRequest(TemplateStatusUpdateSchema, data);
}

export function validateBatchAction(data: unknown) {
  return validateRequest(BatchActionSchema, data);
}

export function validateCreateCategory(data: unknown) {
  return validateRequest(CreateCategorySchema, data);
}

export function validateUpdateCategory(data: unknown) {
  return validateRequest(UpdateCategorySchema, data);
}
