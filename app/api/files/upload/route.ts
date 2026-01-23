import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/api/auth';
import { handleApiError } from '@/lib/api/errors';
import { ApiError } from '@/lib/api/errors';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

/**
 * POST /api/files/upload
 * 上传文件
 * 需要登录
 */
export async function POST(request: NextRequest) {
  try {
    const userId = await requireAuth(request);
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const projectId = formData.get('projectId') as string | null;
    const taskId = formData.get('taskId') as string | null;
    const folderId = formData.get('folderId') as string | null;

    if (!file) {
      throw new ApiError(400, '文件不能为空', 'FILE_REQUIRED');
    }

    // 验证文件大小（最大50MB）
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      throw new ApiError(400, `文件大小超过限制（最大50MB）`, 'FILE_TOO_LARGE');
    }

    // 验证项目权限（如果指定了项目）
    if (projectId) {
      const project = await prisma.project.findUnique({
        where: { id: projectId },
        select: { userId: true, assignedToUserId: true },
      });

      if (!project) {
        throw new ApiError(404, '项目不存在', 'PROJECT_NOT_FOUND');
      }

      // 只有项目所有者或分配的设计师可以上传文件
      if (project.userId !== userId && project.assignedToUserId !== userId) {
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: { role: true },
        });

        if (user?.role !== 'admin') {
          throw new ApiError(403, '无权上传文件到此项目', 'FORBIDDEN');
        }
      }
    }

    // 验证任务权限（如果指定了任务）
    if (taskId) {
      const task = await prisma.projectTask.findUnique({
        where: { id: taskId },
        select: { projectId: true, assignedToUserId: true },
        include: {
          project: {
            select: { userId: true },
          },
        },
      });

      if (!task) {
        throw new ApiError(404, '任务不存在', 'TASK_NOT_FOUND');
      }

      // 只有任务分配人、项目所有者或管理员可以上传文件
      if (
        task.assignedToUserId !== userId &&
        task.project.userId !== userId
      ) {
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: { role: true },
        });

        if (user?.role !== 'admin') {
          throw new ApiError(403, '无权上传文件到此任务', 'FORBIDDEN');
        }
      }
    }

    // 保存文件到本地存储（实际环境应使用云存储如S3、OSS等）
    const uploadsDir = join(process.cwd(), 'uploads');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name}`;
    const filePath = join(uploadsDir, filename);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    await writeFile(filePath, buffer);

    // 保存文件记录到数据库
    const fileRecord = await prisma.file.create({
      data: {
        name: file.name,
        mimeType: file.type,
        size: file.size,
        url: `/uploads/${filename}`, // 实际环境应使用完整的存储URL
        uploadedById: userId,
        projectId: projectId || null,
        taskId: taskId || null,
        folderId: folderId || null,
      },
      include: {
        uploadedBy: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    // 创建通知（如果上传到项目或任务）
    if (projectId) {
      const project = await prisma.project.findUnique({
        where: { id: projectId },
        select: { userId: true, assignedToUserId: true, name: true },
      });

      if (project) {
        // 通知项目所有者（如果不是上传者本人）
        if (project.userId !== userId) {
          await prisma.notification.create({
            data: {
              userId: project.userId,
              type: 'file_uploaded',
              title: '新文件上传',
              content: `项目"${project.name}"有新文件上传：${file.name}`,
              projectId,
              fileId: fileRecord.id,
              actionUrl: `/dashboard/projects/${projectId}`,
            },
          });
        }

        // 通知分配的设计师（如果有且不是上传者本人）
        if (project.assignedToUserId && project.assignedToUserId !== userId) {
          await prisma.notification.create({
            data: {
              userId: project.assignedToUserId,
              type: 'file_uploaded',
              title: '新文件上传',
              content: `项目"${project.name}"有新文件上传：${file.name}`,
              projectId,
              fileId: fileRecord.id,
              actionUrl: `/designer/projects/${projectId}`,
            },
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: fileRecord,
      message: '文件上传成功',
    });
  } catch (e) {
    return handleApiError(e);
  }
}
