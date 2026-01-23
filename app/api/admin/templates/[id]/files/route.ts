import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/api/auth';
import { handleApiError } from '@/lib/api/errors';
import { ApiError } from '@/lib/api/errors';
import type { Prisma } from '@prisma/client';

type RouteContext = { params: Promise<{ id: string }> };

/**
 * POST /api/admin/templates/[id]/files
 * 更新模板文件
 * 仅 Admin
 * 请求体：multipart/form-data
 * 注意：实际文件上传应使用专门的 upload API，这里接收文件 URL
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
    let fileUrls: Array<{ format?: string; url: string; size?: number }> = [];

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const filesData = formData.get('fileUrls');
      if (filesData) {
        fileUrls = JSON.parse(filesData as string);
      }
    } else if (contentType.includes('application/json')) {
      const body = await request.json();
      fileUrls = body.fileUrls || [];
    } else {
      throw new ApiError(400, '不支持的 Content-Type', 'UNSUPPORTED_CONTENT_TYPE');
    }

    // 验证文件格式和大小
    const allowedFormats = ['AI', 'PSD', 'SKETCH', 'FIGMA', 'PDF', 'EPS'];
    const maxSize = 50 * 1024 * 1024; // 50MB

    for (const file of fileUrls) {
      if (file.format && !allowedFormats.includes(file.format.toUpperCase())) {
        throw new ApiError(400, `不支持的文件格式: ${file.format}`, 'INVALID_FILE_FORMAT');
      }
      if (file.size && file.size > maxSize) {
        throw new ApiError(400, `文件大小超过限制: ${file.size} bytes`, 'FILE_TOO_LARGE');
      }
    }

    // 更新文件列表
    const files = fileUrls.map((f: { format?: string; url: string; size?: number }) => ({
      format: f.format || 'UNKNOWN',
      url: f.url,
      size: f.size || 0,
    }));

    const updated = await prisma.template.update({
      where: { id },
      data: { files },
      select: {
        id: true,
        name: true,
        files: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: updated.id,
        files: updated.files,
        updatedAt: updated.updatedAt,
      },
      message: '模板文件已更新',
    });
  } catch (e) {
    return handleApiError(e);
  }
}
