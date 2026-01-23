import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/api/auth';
import { handleApiError } from '@/lib/api/errors';
import { ApiError } from '@/lib/api/errors';

/**
 * GET /api/files
 * 获取文件列表
 * 需要登录
 * 查询参数：
 * - projectId: 项目ID（可选）
 * - taskId: 任务ID（可选）
 * - folderId: 文件夹ID（可选）
 * - starred: 是否只显示收藏（可选）
 * - shared: 是否只显示共享（可选）
 * - page: 页码（默认1）
 * - limit: 每页数量（默认20）
 */
export async function GET(request: NextRequest) {
  try {
    const userId = await requireAuth(request);
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const taskId = searchParams.get('taskId');
    const folderId = searchParams.get('folderId');
    const starred = searchParams.get('starred') === 'true';
    const shared = searchParams.get('shared') === 'true';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    // 构建查询条件
    const where: any = {
      deletedAt: null,
    };

    // 权限过滤：只能看到自己上传的、共享给自己的、或项目/任务相关的文件
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (user?.role !== 'admin') {
      // 非管理员只能看到：
      // 1. 自己上传的文件
      // 2. 共享给自己的文件
      // 3. 项目相关的文件（如果是项目所有者或分配的设计师）
      // 4. 任务相关的文件（如果是任务分配人或项目所有者）

      const orConditions: any[] = [
        { uploadedById: userId },
      ];

      if (shared) {
        orConditions.push({
          shared: true,
          sharedWithUserIds: { array_contains: [userId] },
        });
      }

      if (projectId) {
        const project = await prisma.project.findUnique({
          where: { id: projectId },
          select: { userId: true, assignedToUserId: true },
        });

        if (project && (project.userId === userId || project.assignedToUserId === userId)) {
          orConditions.push({ projectId });
        }
      }

      if (taskId) {
        const task = await prisma.projectTask.findUnique({
          where: { id: taskId },
          include: {
            project: {
              select: { userId: true },
            },
          },
        });

        if (
          task &&
          (task.assignedToUserId === userId || task.project.userId === userId)
        ) {
          orConditions.push({ taskId });
        }
      }

      where.OR = orConditions;
    } else {
      // 管理员可以看到所有文件
      if (projectId) where.projectId = projectId;
      if (taskId) where.taskId = taskId;
    }

    if (folderId) {
      where.folderId = folderId;
    } else if (!projectId && !taskId) {
      // 如果没有指定项目或任务，且没有指定文件夹，则只显示根目录文件
      where.folderId = null;
    }

    if (starred) {
      where.starred = true;
    }

    if (shared) {
      where.shared = true;
    }

    // 查询文件
    const [files, total] = await Promise.all([
      prisma.file.findMany({
        where,
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
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.file.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: files,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (e) {
    return handleApiError(e);
  }
}
