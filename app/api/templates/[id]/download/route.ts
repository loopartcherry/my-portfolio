import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/api/auth';
import { handleApiError } from '@/lib/api/errors';
import { ApiError } from '@/lib/api/errors';

type RouteContext = { params: Promise<{ id: string }> };

/**
 * GET /api/templates/[id]/download
 * 下载模板文件（需要权限校验）
 * 仅限已购买该模板的用户
 */
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const userId = await requireAuth(request);
    const { id: templateId } = await context.params;

    // 查找模板
    const template = await prisma.template.findUnique({
      where: { id: templateId },
      select: {
        id: true,
        name: true,
        files: true,
        price: true,
      },
    });

    if (!template) {
      throw new ApiError(404, '模板不存在', 'TEMPLATE_NOT_FOUND');
    }

    // 检查用户是否有已支付的订单
    const paidOrder = await prisma.order.findFirst({
      where: {
        userId,
        templateId,
        type: 'template',
        status: 'paid',
      },
    });

    if (!paidOrder) {
      throw new ApiError(403, '您尚未购买此模板', 'NOT_PURCHASED');
    }

    // 记录下载
    await prisma.templateDownload.create({
      data: {
        templateId,
        userId,
      },
    });

    // 获取文件列表
    const files = (template.files as any) || [];
    
    if (files.length === 0) {
      throw new ApiError(404, '模板文件不存在', 'FILES_NOT_FOUND');
    }

    // 返回下载信息（实际环境中应该返回预签名URL或直接重定向到文件）
    return NextResponse.json({
      success: true,
      data: {
        templateId: template.id,
        templateName: template.name,
        files: files.map((f: any) => ({
          format: f.format,
          url: f.url, // 实际环境中应该生成预签名URL
          size: f.size,
          filename: f.filename || `${template.name}.${f.format.toLowerCase()}`,
        })),
        downloadAt: new Date().toISOString(),
      },
      message: '下载链接已生成',
    });
  } catch (e) {
    return handleApiError(e);
  }
}
