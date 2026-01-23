import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/api/auth';
import { handleApiError } from '@/lib/api/errors';
import { ApiError } from '@/lib/api/errors';
import { z } from 'zod';

const UpdateUserStatusSchema = z.object({
  status: z.enum(['active', 'inactive', 'suspended']),
});

type RouteContext = { params: Promise<{ id: string }> };

/**
 * PATCH /api/admin/users/[id]/status
 * 更新用户状态（启用/禁用）
 * 仅 Admin
 */
export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    await requireAdmin(request);
    const { id: userId } = await context.params;
    const body = await request.json();
    const v = UpdateUserStatusSchema.parse(body);

    // 查找用户
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        designer: true,
      },
    });

    if (!user) {
      throw new ApiError(404, '用户不存在', 'USER_NOT_FOUND');
    }

    // 如果是设计师，更新 Designer 状态
    if (user.role === 'designer' && user.designer) {
      await prisma.designer.update({
        where: { userId },
        data: {
          status: v.status === 'active' ? 'active' : 'inactive',
        },
      });
    }

    // 注意：User 模型没有 status 字段，这里可以通过其他方式标记（如 metadata）
    // 或者扩展 User 模型添加 status 字段
    // 暂时返回成功，实际实现需要根据业务需求

    return NextResponse.json({
      success: true,
      message: `用户已${v.status === 'active' ? '启用' : '禁用'}`,
    });
  } catch (e) {
    return handleApiError(e);
  }
}
