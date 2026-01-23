import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/api/auth';
import { handleApiError } from '@/lib/api/errors';
import { ApiError } from '@/lib/api/errors';
import {
  uploadFile,
  uploadFiles,
  DESIGN_FILE_OPTIONS,
  PREVIEW_IMAGE_OPTIONS,
} from '@/lib/api/file-upload';

/**
 * POST /api/admin/templates/upload
 * 上传模板文件或预览图
 * 仅 Admin
 * 请求体：multipart/form-data
 * 字段：
 *   - type: "design" | "preview" （文件类型）
 *   - files: File[] （文件数组）
 * 
 * 返回：上传后的文件 URL 列表
 */
export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request);

    const formData = await request.formData();
    const type = formData.get('type') as string;
    const files = formData.getAll('files') as File[];

    if (!type || (type !== 'design' && type !== 'preview')) {
      throw new ApiError(400, 'type 必须是 "design" 或 "preview"', 'INVALID_TYPE');
    }

    if (!files || files.length === 0) {
      throw new ApiError(400, '请至少上传一个文件', 'NO_FILES');
    }

    const options = type === 'design' ? DESIGN_FILE_OPTIONS : PREVIEW_IMAGE_OPTIONS;

    // 上传文件
    const results = await uploadFiles(files, options);

    return NextResponse.json({
      success: true,
      data: {
        type,
        files: results.map((r) => ({
          url: r.url,
          format: r.format,
          size: r.size,
          filename: r.filename,
        })),
      },
      message: `成功上传 ${results.length} 个文件`,
    });
  } catch (e) {
    return handleApiError(e);
  }
}
