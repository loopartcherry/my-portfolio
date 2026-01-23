import { NextResponse } from 'next/server';

/**
 * API 错误响应
 */
export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * 创建错误响应
 */
export function errorResponse(
  status: number,
  message: string,
  code?: string,
  details?: Record<string, any>
): NextResponse {
  return NextResponse.json(
    {
      error: {
        message,
        code,
        ...details,
      },
    },
    { status }
  );
}

/**
 * 处理 API 错误
 */
export function handleApiError(error: unknown): NextResponse {
  if (error instanceof ApiError) {
    return errorResponse(error.status, error.message, error.code);
  }

  if (error instanceof Error) {
    // 处理认证/授权错误
    if (error.message === 'UNAUTHORIZED') {
      return errorResponse(401, '未认证，请先登录', 'UNAUTHORIZED');
    }
    if (error.message === 'FORBIDDEN') {
      return errorResponse(403, '权限不足', 'FORBIDDEN');
    }
    
    // 处理验证错误
    if (
      error.message.includes('验证失败') ||
      error.message.includes('validation') ||
      error.message.includes('invalid')
    ) {
      return errorResponse(400, error.message, 'VALIDATION_ERROR');
    }
  }

  // 未知错误
  console.error('API Error:', error);
  return errorResponse(500, '服务器内部错误', 'INTERNAL_ERROR');
}
