import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/api/auth';
import { handleApiError } from '@/lib/api/errors';
import { ApiError } from '@/lib/api/errors';
import { unlink } from 'fs/promises';
import { join } from 'path';

type RouteContext = { params: Promise<{ id: string }> };

/**
 * GET /api/files/[id]
 * 获取文件详情
 */
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const userId = await requireAuth(request);
    const { id } = await context.params;

    const file = await prisma.file.findUnique({
      where: { id },
      include: {
        uploadedBy: {
          select: { id: true, name: true, email: true },
        },
        project: {
          select: { id: true, name: true },
        },
        task: {
          select: { id: true, name: true },
        },
        folder: {
          select: { id: true, name: true },
        },
      },
    });

    if (!file) {
      throw new ApiError(404, '文件不存在', 'FILE_NOT_FOUND');
    }

    // 检查权限（同下载逻辑）
    let hasPermission = false;
    if (file.uploadedById === userId) hasPermission = true;

    if (file.projectId && file.project) {
      const project = await prisma.project.findUnique({
        where: { id: file.projectId },
        select: { userId: true, assignedToUserId: true },
      });
      if (project && (project.userId === userId || project.assignedToUserId === userId)) {
        hasPermission = true;
      }
    }

    if (file.shared) {
      const sharedWith = (file.sharedWithUserIds as string[]) || [];
      if (sharedWith.includes(userId)) hasPermission = true;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });
    if (user?.role === 'admin') hasPermission = true;

    if (!hasPermission) {
      throw new ApiError(403, '无权访问此文件', 'FORBIDDEN');
    }

    return NextResponse.json({
      success: true,
      data: file,
    });
  } catch (e) {
    return handleApiError(e);
  }
}

/**
 * DELETE /api/files/[id]
 * 删除文件（软删除）
 */
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const userId = await requireAuth(request);
    const { id } = await context.params;

    const file = await prisma.file.findUnique({
      where: { id },
    });

    if (!file) {
      throw new ApiError(404, '文件不存在', 'FILE_NOT_FOUND');
    }

    // 只有上传者或管理员可以删除
    if (file.uploadedById !== userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true },
      });

      if (user?.role !== 'admin') {
        throw new ApiError(403, '无权删除此文件', 'FORBIDDEN');
      }
    }

    // 软删除
    await prisma.file.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });

    // 可选：物理删除文件（谨慎使用）
    // const filePath = join(process.cwd(), file.url.replace(/^\//, ''));
    // try {
    //   await unlink(filePath);
    // } catch (e) {
    //   console.error('删除物理文件失败:', e);
    // }

    return NextResponse.json({
      success: true,
      message: '文件已删除',
    });
  } catch (e) {
    return handleApiError(e);
  }
}

/**
 * PATCH /api/files/[id]
 * 更新文件信息（重命名、移动、添加标签等）
 */
export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const userId = await requireAuth(request);
    const { id } = await context.params;
    const body = await request.json();

    const file = await prisma.file.findUnique({
      where: { id },
    });

    if (!file) {
      throw new ApiError(404, '文件不存在', 'FILE_NOT_FOUND');
    }

    // 只有上传者或管理员可以修改
    if (file.uploadedById !== userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true },
      });

      if (user?.role !== 'admin') {
        throw new ApiError(403, '无权修改此文件', 'FORBIDDEN');
      }
    }

    const updated = await prisma.file.update({
      where: { id },
      data: {
        name: body.name,
        folderId: body.folderId,
        tags: body.tags,
        starred: body.starred,
        shared: body.shared,
        sharedWithUserIds: body.sharedWithUserIds,
      },
      include: {
        uploadedBy: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: updated,
      message: '文件信息已更新',
    });
  } catch (e) {
    return handleApiError(e);
  }
}
