import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/api/auth';
import { handleApiError } from '@/lib/api/errors';
import { ApiError } from '@/lib/api/errors';

/**
 * POST /api/admin/contents/upload-image
 * 上传文章配图
 * 仅 Admin
 * 请求体：multipart/form-data
 * 限制：5MB，格式 JPG/PNG/GIF/WEBP
 */
export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request);

    const formData = await request.formData();
    const image = formData.get('image') as File | null;

    if (!image) {
      throw new ApiError(400, '请上传图片', 'NO_IMAGE');
    }

    // 验证文件大小（5MB）
    const maxSize = 5 * 1024 * 1024;
    if (image.size > maxSize) {
      throw new ApiError(400, `图片大小超过限制 ${maxSize / 1024 / 1024}MB`, 'IMAGE_TOO_LARGE');
    }

    // 验证文件格式
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(image.type)) {
      throw new ApiError(400, '不支持的图片格式，仅支持 JPG, PNG, GIF, WEBP', 'INVALID_IMAGE_FORMAT');
    }

    // TODO: 实际实现文件上传逻辑
    // 示例：使用 AWS S3 SDK
    // const s3 = new AWS.S3();
    // const key = `contents/images/${Date.now()}-${image.name}`;
    // const result = await s3.upload({
    //   Bucket: process.env.S3_BUCKET,
    //   Key: key,
    //   Body: Buffer.from(await image.arrayBuffer()),
    //   ContentType: image.type,
    // }).promise();
    //
    // return NextResponse.json({
    //   success: true,
    //   data: {
    //     url: result.Location,
    //     filename: image.name,
    //     size: image.size,
    //   },
    //   message: '图片上传成功',
    // });

    // 临时返回模拟 URL（实际应上传到存储服务）
    const ext = image.name.substring(image.name.lastIndexOf('.'));
    const mockUrl = `https://example.com/uploads/contents/${Date.now()}${ext}`;

    return NextResponse.json({
      success: true,
      data: {
        url: mockUrl,
        filename: image.name,
        size: image.size,
        type: image.type,
      },
      message: '图片上传成功',
    });
  } catch (e) {
    return handleApiError(e);
  }
}
