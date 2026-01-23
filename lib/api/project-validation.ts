import { ApiError } from './errors';

interface CreateProjectBody {
  name?: unknown;
  description?: unknown;
  attachments?: unknown;
  priority?: unknown;
}

interface DeliverProjectBody {
  deliveryLink?: unknown;
}

/**
 * 验证创建项目的请求体
 */
export function validateCreateProject(body: unknown): {
  name: string;
  description?: string;
  attachments?: Array<{ name: string; url: string; size: number }>;
  priority: 'low' | 'medium' | 'high' | 'urgent';
} {
  const b = body as CreateProjectBody;
  if (!b.name || typeof b.name !== 'string') {
    throw new ApiError(422, '项目名称不能为空', 'INVALID_NAME');
  }

  if (b.name.length < 5) {
    throw new ApiError(422, '项目名称至少5个字符', 'NAME_TOO_SHORT');
  }

  if (b.name.length > 100) {
    throw new ApiError(422, '项目名称不超过100个字符', 'NAME_TOO_LONG');
  }

  if (b.description && typeof b.description !== 'string') {
    throw new ApiError(422, '项目描述格式错误', 'INVALID_DESCRIPTION');
  }

  if (b.description && typeof b.description === 'string' && b.description.length > 5000) {
    throw new ApiError(422, '项目描述不超过5000个字符', 'DESCRIPTION_TOO_LONG');
  }

  if (b.attachments && !Array.isArray(b.attachments)) {
    throw new ApiError(422, '附件格式错误，应为数组', 'INVALID_ATTACHMENTS');
  }

  if (b.attachments && Array.isArray(b.attachments) && b.attachments.length > 20) {
    throw new ApiError(422, '附件数量不能超过20个', 'TOO_MANY_ATTACHMENTS');
  }

  const validPriorities = ['low', 'medium', 'high', 'urgent'];
  const priority = (b.priority as string) || 'medium';
  if (!validPriorities.includes(priority)) {
    throw new ApiError(422, `优先级必须是以下之一：${validPriorities.join(', ')}`, 'INVALID_PRIORITY');
  }

  return {
    name: b.name.trim(),
    description: typeof b.description === 'string' ? b.description.trim() : undefined,
    attachments: Array.isArray(b.attachments) ? b.attachments as Array<{ name: string; url: string; size: number }> : undefined,
    priority: priority as 'low' | 'medium' | 'high' | 'urgent',
  };
}

/**
 * 验证交付项目的请求体
 */
export function validateDeliverProject(body: unknown): {
  deliveryLink: string;
} {
  const b = body as DeliverProjectBody;
  if (!b.deliveryLink || typeof b.deliveryLink !== 'string') {
    throw new ApiError(422, '交付物链接不能为空', 'INVALID_DELIVERY_LINK');
  }

  // 简单的 URL 验证
  try {
    new URL(b.deliveryLink);
  } catch {
    throw new ApiError(422, '交付物链接格式错误，必须是有效的 URL', 'INVALID_URL');
  }

  return {
    deliveryLink: b.deliveryLink.trim(),
  };
}
