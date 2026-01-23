import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/api/auth';
import { handleApiError } from '@/lib/api/errors';
import { ApiError } from '@/lib/api/errors';

type RouteContext = { params: Promise<{ id: string }> };

/**
 * GET /api/admin/contents/[id]/revisions
 * 查看版本历史
 * 仅 Admin
 */
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    await requireAdmin(request);
    const { id } = await context.params;

    const content = await prisma.content.findUnique({
      where: { id, deletedAt: null },
      select: { id: true },
    });

    if (!content) {
      throw new ApiError(404, '文章不存在', 'CONTENT_NOT_FOUND');
    }

    const revisions = await prisma.contentRevision.findMany({
      where: { contentId: id },
      include: {
        revisedBy: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { revisedAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      data: revisions.map((r: any) => ({
        id: r.id,
        title: r.title,
        revisionContent: r.revisionContent,
        revisedBy: r.revisedBy,
        changeNote: r.changeNote,
        revisedAt: r.revisedAt,
      })),
      count: revisions.length,
    });
  } catch (e) {
    return handleApiError(e);
  }
}
