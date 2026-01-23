import { ApiError } from './errors';

/**
 * 验证创建项目的请求体
 */
export function validateCreateProject(body: any): {
  name: string;
  description?: string;
  attachments?: any[];
  priority: 'low' | 'medium' | 'high' | 'urgent';
} {
  if (!body.name || typeof body.name !== 'string') {
    throw new ApiError(422, '项目名称不能为空', 'INVALID_NAME');
  }

  if (body.name.length < 5) {
    throw new ApiError(422, '项目名称至少5个字符', 'NAME_TOO_SHORT');
  }

  if (body.name.length > 100) {
    throw new ApiError(422, '项目名称不超过100个字符', 'NAME_TOO_LONG');
  }

  if (body.description && typeof body.description !== 'string') {
    throw new ApiError(422, '项目描述格式错误', 'INVALID_DESCRIPTION');
  }

  if (body.description && body.description.length > 5000) {
    throw new ApiError(422, '项目描述不超过5000个字符', 'DESCRIPTION_TOO_LONG');
  }

  if (body.attachments && !Array.isArray(body.attachments)) {
    throw new ApiError(422, '附件格式错误，应为数组', 'INVALID_ATTACHMENTS');
  }

  if (body.attachments && body.attachments.length > 20) {
    throw new ApiError(422, '附件数量不能超过20个', 'TOO_MANY_ATTACHMENTS');
  }

  const validPriorities = ['low', 'medium', 'high', 'urgent'];
  const priority = body.priority || 'medium';
  if (!validPriorities.includes(priority)) {
    throw new ApiError(422, `优先级必须是以下之一：${validPriorities.join(', ')}`, 'INVALID_PRIORITY');
  }

  return {
    name: body.name.trim(),
    description: body.description?.trim() || undefined,
    attachments: body.attachments || undefined,
    priority,
  };
}

/**
 * 验证交付项目的请求体
 */
export function validateDeliverProject(body: any): {
  deliveryLink: string;
} {
  if (!body.deliveryLink || typeof body.deliveryLink !== 'string') {
    throw new ApiError(422, '交付物链接不能为空', 'INVALID_DELIVERY_LINK');
  }

  // 简单的 URL 验证
  try {
    new URL(body.deliveryLink);
  } catch {
    throw new ApiError(422, '交付物链接格式错误，必须是有效的 URL', 'INVALID_URL');
  }

  return {
    deliveryLink: body.deliveryLink.trim(),
  };
}
