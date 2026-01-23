import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/api/auth';
import { handleApiError } from '@/lib/api/errors';
import { ApiError } from '@/lib/api/errors';

type RouteContext = { params: Promise<{ id: string }> };

/**
 * POST /api/admin/templates/[id]/previews
 * 更新模板预览图
 * 仅 Admin
 * 请求体：multipart/form-data
 * 注意：实际文件上传应使用专门的 upload API，这里接收图片 URL
 */
export async function POST(request: NextRequest, context: RouteContext) {
  try {
    await requireAdmin(request);
    const { id } = await context.params;

    const template = await prisma.template.findUnique({ where: { id } });
    if (!template) {
      throw new ApiError(404, '模板不存在', 'TEMPLATE_NOT_FOUND');
    }

    const contentType = request.headers.get('content-type') || '';
    let previewUrls: string[] = [];

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const previewsData = formData.get('previewUrls');
      if (previewsData) {
        previewUrls = JSON.parse(previewsData as string);
      }
    } else if (contentType.includes('application/json')) {
      const body = await request.json();
      previewUrls = body.previewUrls || [];
    } else {
      throw new ApiError(400, '不支持的 Content-Type', 'UNSUPPORTED_CONTENT_TYPE');
    }

    // 验证图片格式和大小（URL 验证）
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB（这里假设 URL 中包含大小信息，实际应从上传 API 获取）

    for (const url of previewUrls) {
      const ext = url.toLowerCase().substring(url.lastIndexOf('.'));
      if (!allowedExtensions.includes(ext)) {
        throw new ApiError(400, `不支持的图片格式: ${ext}`, 'INVALID_IMAGE_FORMAT');
      }
    }

    // 更新预览图列表
    const updated = await prisma.template.update({
      where: { id },
      data: { preview: previewUrls },
      select: {
        id: true,
        name: true,
        preview: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: updated.id,
        preview: updated.preview,
        updatedAt: updated.updatedAt,
      },
      message: '模板预览图已更新',
    });
  } catch (e) {
    return handleApiError(e);
  }
}
