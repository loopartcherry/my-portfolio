import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/api/auth';
import { handleApiError } from '@/lib/api/errors';
import { ApiError } from '@/lib/api/errors';
import { validateFeaturedTemplate } from '@/lib/api/template-validation';

type RouteContext = { params: Promise<{ id: string }> };

/**
 * PATCH /api/admin/templates/[id]/featured
 * 设置模板为精选/取消精选
 * 仅 Admin
 */
export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    await requireAdmin(request);
    const { id } = await context.params;
    const body = await request.json();
    const v = validateFeaturedTemplate(body);

    const template = await prisma.template.findUnique({ where: { id } });
    if (!template) {
      throw new ApiError(404, '模板不存在', 'TEMPLATE_NOT_FOUND');
    }

    const updated = await prisma.template.update({
      where: { id },
      data: {
        isFeatured: v.isFeatured,
        featuredUntil: v.featuredUntil,
      },
      select: {
        id: true,
        name: true,
        isFeatured: true,
        featuredUntil: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: updated.id,
        name: updated.name,
        isFeatured: updated.isFeatured,
        featuredUntil: updated.featuredUntil,
        updatedAt: updated.updatedAt,
      },
      message: v.isFeatured ? '模板已设置为精选' : '模板已取消精选',
    });
  } catch (e) {
    return handleApiError(e);
  }
}
