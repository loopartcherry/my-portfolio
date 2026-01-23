import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/api/auth';
import { handleApiError } from '@/lib/api/errors';
import { ApiError } from '@/lib/api/errors';
import { z } from 'zod';

const CreateTaskSchema = z.object({
  name: z.string().min(1, '任务名称不能为空'),
  description: z.string().optional(),
  assignedToUserId: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  estimatedHours: z.number().min(0).optional(),
  dueDate: z.string().optional(),
});

type RouteContext = { params: Promise<{ id: string }> };

/**
 * POST /api/admin/projects/[id]/tasks
 * 为项目创建子任务
 * 仅 Admin
 */
export async function POST(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const adminId = await requireAdmin(request);
    const { id: projectId } = await context.params;
    const body = await request.json();
    const v = CreateTaskSchema.parse(body);

    // 验证项目是否存在
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new ApiError(404, '项目不存在', 'PROJECT_NOT_FOUND');
    }

    // 如果指定了设计师，验证设计师是否存在
    if (v.assignedToUserId) {
      const designer = await prisma.user.findUnique({
        where: { id: v.assignedToUserId },
        include: { designer: true },
      });

      if (!designer || designer.role !== 'designer') {
        throw new ApiError(404, '设计师不存在', 'DESIGNER_NOT_FOUND');
      }
    }

    // TODO: 创建子任务功能需要 ProjectTask 模型
    // 创建子任务
    // const task = await prisma.projectTask.create({
    //   data: {
    //     projectId,
    //     name: v.name,
    //     description: v.description || null,
    //     assignedToUserId: v.assignedToUserId || null,
    //     priority: v.priority,
    //     estimatedHours: v.estimatedHours || null,
    //     dueDate: v.dueDate ? new Date(v.dueDate) : null,
    //     createdById: adminId,
    //     status: 'todo',
    //     completionRate: 0,
    //   },
    //   include: {
    //     assignedToUser: {
    //       select: { id: true, name: true, email: true },
    //     },
    //   },
    // });

    return NextResponse.json({
      success: false,
      error: '子任务功能暂未实现，需要 ProjectTask 模型',
      code: 'FEATURE_NOT_IMPLEMENTED',
    }, { status: 501 });
  } catch (e) {
    return handleApiError(e);
  }
}

/**
 * GET /api/admin/projects/[id]/tasks
 * 获取项目的所有子任务
 * 仅 Admin
 */
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    await requireAdmin(request);
    const { id: projectId } = await context.params;

    const tasks = await prisma.projectTask.findMany({
      where: { projectId },
      include: {
        assignedToUser: {
          select: { id: true, name: true, email: true },
        },
        createdBy: {
          select: { id: true, name: true, email: true },
        },
        project: {
          select: { id: true, name: true },
        },
        _count: {
          select: { comments: true },
        },
      },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    return NextResponse.json({
      success: true,
      data: tasks,
      count: tasks.length,
    });
  } catch (e) {
    return handleApiError(e);
  }
}
