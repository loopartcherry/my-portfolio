import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/api/auth';
import { handleApiError } from '@/lib/api/errors';
import { ApiError } from '@/lib/api/errors';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

type RouteContext = { params: Promise<{ id: string }> };

/**
 * GET /api/files/[id]/download
 * 下载文件
 * 需要登录，并验证权限
 */
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const userId = await requireAuth(request);
    const { id } = await context.params;

    // 查找文件
    const file = await prisma.file.findUnique({
      where: { id },
      include: {
        project: {
          select: { userId: true, assignedToUserId: true },
        },
        task: {
          select: { assignedToUserId: true, projectId: true },
          include: {
            project: {
              select: { userId: true },
            },
          },
        },
      },
    });

    if (!file) {
      throw new ApiError(404, '文件不存在', 'FILE_NOT_FOUND');
    }

    // 检查权限
    let hasPermission = false;

    // 上传者本人可以下载
    if (file.uploadedById === userId) {
      hasPermission = true;
    }

    // 如果文件关联到项目，检查项目权限
    if (file.projectId && file.project) {
      if (
        file.project.userId === userId ||
        file.project.assignedToUserId === userId
      ) {
        hasPermission = true;
      }
    }

    // 如果文件关联到任务，检查任务权限
    if (file.taskId && file.task) {
      if (
        file.task.assignedToUserId === userId ||
        file.task.project.userId === userId
      ) {
        hasPermission = true;
      }
    }

    // 检查是否是共享文件
    if (file.shared) {
      const sharedWith = (file.sharedWithUserIds as string[]) || [];
      if (sharedWith.includes(userId)) {
        hasPermission = true;
      }
    }

    // 管理员有所有权限
    if (!hasPermission) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true },
      });

      if (user?.role === 'admin') {
        hasPermission = true;
      }
    }

    if (!hasPermission) {
      throw new ApiError(403, '无权下载此文件', 'FORBIDDEN');
    }

    // 读取文件
    const filePath = join(process.cwd(), file.url.replace(/^\//, ''));
    
    if (!existsSync(filePath)) {
      throw new ApiError(404, '文件不存在于服务器', 'FILE_NOT_FOUND_ON_SERVER');
    }

    const fileBuffer = await readFile(filePath);

    // 返回文件
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': file.mimeType,
        'Content-Disposition': `attachment; filename="${encodeURIComponent(file.name)}"`,
        'Content-Length': file.size.toString(),
      },
    });
  } catch (e) {
    return handleApiError(e);
  }
}
