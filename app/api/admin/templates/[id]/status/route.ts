import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/api/auth';
import { handleApiError } from '@/lib/api/errors';
import { ApiError } from '@/lib/api/errors';
import { validateTemplateStatusUpdate } from '@/lib/api/template-validation';

type RouteContext = { params: Promise<{ id: string }> };

/**
 * PATCH /api/admin/templates/[id]/status
 * 发布/下架模板
 * 仅 Admin
 */
export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    await requireAdmin(request);
    const { id } = await context.params;
    const body = await request.json();
    const v = validateTemplateStatusUpdate(body);

    const template = await prisma.template.findUnique({ where: { id } });
    if (!template) {
      throw new ApiError(404, '模板不存在', 'TEMPLATE_NOT_FOUND');
    }

    const updated = await prisma.template.update({
      where: { id },
      data: {
        status: v.status,
        publishedAt: v.status === 'published' && !template.publishedAt ? new Date() : template.publishedAt,
      },
      select: {
        id: true,
        name: true,
        status: true,
        publishedAt: true,
        updatedAt: true,
      },
    });

    const statusMessages: Record<string, string> = {
      published: '模板已发布',
      archived: '模板已下架',
      draft: '模板已保存为草稿',
    };

    return NextResponse.json({
      success: true,
      data: {
        id: updated.id,
        name: updated.name,
        status: updated.status,
        publishedAt: updated.publishedAt,
        updatedAt: updated.updatedAt,
      },
      message: statusMessages[v.status] || '模板状态已更新',
    });
  } catch (e) {
    return handleApiError(e);
  }
}
