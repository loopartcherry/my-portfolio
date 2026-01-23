import { z } from 'zod';
import { validateRequest } from './validation';

const ContentTypeSchema = z.enum(['article', 'case_study', 'faq', 'page']);
const ContentStatusSchema = z.enum(['draft', 'published', 'archived']);
const ContentFormatSchema = z.enum(['html', 'markdown']);

/** GET /api/admin/contents 查询参数 */
export const ContentListQuerySchema = z.object({
  type: ContentTypeSchema.optional(),
  status: ContentStatusSchema.optional(),
  category: z.string().optional(),
  search: z.string().optional(),
  sortBy: z.enum(['createdAt', 'publishedAt', 'views', 'title']).optional(),
  page: z.string().optional().transform((v) => (v ? parseInt(v, 10) : 1)),
  limit: z.string().optional().transform((v) => (v ? parseInt(v, 10) : 20)),
});

/** POST /api/admin/contents 请求体 */
export const CreateContentSchema = z.object({
  slug: z.string().min(1, 'slug不能为空').regex(/^[a-z0-9-]+$/, 'slug只能包含小写字母、数字和连字符'),
  type: ContentTypeSchema,
  title: z.string().min(1, '标题不能为空'),
  subtitle: z.string().optional(),
  excerpt: z.string().optional(),
  content: z.string().min(1, '内容不能为空'),
  contentFormat: ContentFormatSchema.optional(),
  featuredImage: z.string().url().optional().or(z.literal('')),
  categoryKeyword: z.string().optional(),
  categoryId: z.string().optional(),
  tags: z.array(z.string()).optional(),
  seo: z.object({
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    keywords: z.string().optional(),
  }).optional(),
  status: ContentStatusSchema.optional(),
  isFeatured: z.boolean().optional(),
  featuredOrder: z.number().int().min(0).optional(),
  publishedAt: z.string().datetime().optional().transform((v) => (v ? new Date(v) : undefined)),
  expiresAt: z.string().datetime().optional().transform((v) => (v ? new Date(v) : undefined)),
});

/** PATCH /api/admin/contents/[id] 请求体 */
export const UpdateContentSchema = z.object({
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/).optional(),
  type: ContentTypeSchema.optional(),
  title: z.string().min(1).optional(),
  subtitle: z.string().optional(),
  excerpt: z.string().optional(),
  content: z.string().min(1).optional(),
  contentFormat: ContentFormatSchema.optional(),
  featuredImage: z.string().url().optional().or(z.literal('')),
  categoryKeyword: z.string().optional(),
  categoryId: z.string().optional(),
  tags: z.array(z.string()).optional(),
  seo: z.object({
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    keywords: z.string().optional(),
  }).optional(),
  status: ContentStatusSchema.optional(),
  isFeatured: z.boolean().optional(),
  featuredOrder: z.number().int().min(0).optional(),
  publishedAt: z.string().datetime().optional().transform((v) => (v ? new Date(v) : undefined)),
  expiresAt: z.string().datetime().optional().transform((v) => (v ? new Date(v) : undefined)),
  changeNote: z.string().optional(), // 版本历史说明
});

/** PATCH /api/admin/contents/[id]/publish 请求体 */
export const PublishContentSchema = z.object({
  status: ContentStatusSchema,
  publishedAt: z.string().datetime().optional().transform((v) => (v ? new Date(v) : undefined)),
});

/** PATCH /api/admin/contents/[id]/featured 请求体 */
export const FeaturedContentSchema = z.object({
  isFeatured: z.boolean(),
  featuredOrder: z.number().int().min(0).optional(),
});

/** POST /api/admin/contents/categories 请求体 */
export const CreateContentCategorySchema = z.object({
  name: z.string().min(1, '分类名称不能为空'),
  slug: z.string().min(1, 'slug不能为空').regex(/^[a-z0-9-]+$/, 'slug只能包含小写字母、数字和连字符'),
  description: z.string().optional(),
  icon: z.string().url().optional().or(z.literal('')),
  order: z.number().int().min(0).optional(),
});

/** PATCH /api/admin/contents/categories/[id] 请求体 */
export const UpdateContentCategorySchema = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/).optional(),
  description: z.string().optional(),
  icon: z.string().url().optional().or(z.literal('')),
  order: z.number().int().min(0).optional(),
});

export function validateContentListQuery(data: unknown) {
  return validateRequest(ContentListQuerySchema, data);
}

export function validateCreateContent(data: unknown) {
  return validateRequest(CreateContentSchema, data);
}

export function validateUpdateContent(data: unknown) {
  return validateRequest(UpdateContentSchema, data);
}

export function validatePublishContent(data: unknown) {
  return validateRequest(PublishContentSchema, data);
}

export function validateFeaturedContent(data: unknown) {
  return validateRequest(FeaturedContentSchema, data);
}

export function validateCreateContentCategory(data: unknown) {
  return validateRequest(CreateContentCategorySchema, data);
}

export function validateUpdateContentCategory(data: unknown) {
  return validateRequest(UpdateContentCategorySchema, data);
}
