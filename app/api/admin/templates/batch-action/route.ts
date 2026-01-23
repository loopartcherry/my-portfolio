import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/api/auth';
import { handleApiError } from '@/lib/api/errors';
import { ApiError } from '@/lib/api/errors';
import { validateBatchAction } from '@/lib/api/template-validation';

/**
 * POST /api/admin/templates/batch-action
 * 批量操作模板
 * 仅 Admin
 * 请求体：{ action: "publish" | "archive" | "delete", templateIds: [] }
 */
export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request);
    const body = await request.json();
    const v = validateBatchAction(body);

    // 验证模板是否存在
    const templates = await prisma.template.findMany({
      where: { id: { in: v.templateIds } },
      select: { id: true },
    });

    if (templates.length !== v.templateIds.length) {
      throw new ApiError(404, '部分模板不存在', 'SOME_TEMPLATES_NOT_FOUND');
    }

    let result: any;

    switch (v.action) {
      case 'publish':
        result = await prisma.template.updateMany({
          where: { id: { in: v.templateIds } },
          data: {
            status: 'published',
            publishedAt: new Date(),
          },
        });
        break;

      case 'archive':
        result = await prisma.template.updateMany({
          where: { id: { in: v.templateIds } },
          data: { status: 'archived' },
        });
        break;

      case 'delete':
        result = await prisma.template.deleteMany({
          where: { id: { in: v.templateIds } },
        });
        break;

      default:
        throw new ApiError(400, '不支持的操作', 'UNSUPPORTED_ACTION');
    }

    const actionMessages: Record<string, string> = {
      publish: '批量发布成功',
      archive: '批量下架成功',
      delete: '批量删除成功',
    };

    return NextResponse.json({
      success: true,
      data: {
        action: v.action,
        affectedCount: result.count,
        templateIds: v.templateIds,
      },
      message: actionMessages[v.action] || '批量操作成功',
    });
  } catch (e) {
    return handleApiError(e);
  }
}
