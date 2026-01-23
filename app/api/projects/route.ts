import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireClient } from '@/lib/api/auth';
import { handleApiError } from '@/lib/api/errors';
import { validateCreateProject } from '@/lib/api/project-validation';
import { checkSubscriptionCredits, deductCredits } from '@/lib/services/subscription.service';
import { Prisma } from '@prisma/client';

/**
 * POST /api/projects
 * 创建项目（仅限客户，需要有效订阅）
 * 
 * 请求体：
 * {
 *   name: string;           // 项目名称（必填，5-100字符）
 *   description?: string;   // 项目描述（可选，最多5000字符）
 *   attachments?: Array;    // 附件数组（可选，最多20个）
 *   priority?: string;     // 优先级：'low' | 'medium' | 'high' | 'urgent'（默认 'medium'）
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const userId = await requireClient(request);
    const body = await request.json();
    const v = validateCreateProject(body);

    // 1. 检查用户是否有有效的订阅
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId,
        status: { in: ['active', 'trialing'] },
        endDate: { gte: new Date() }, // 未过期
      },
      include: {
        plan: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!subscription) {
      return NextResponse.json(
        {
          success: false,
          error: '您没有有效的订阅，请先订阅后再创建项目',
          code: 'NO_ACTIVE_SUBSCRIPTION',
        },
        { status: 422 }
      );
    }

    // 2. 检查订阅额度
    const creditCheck = await checkSubscriptionCredits(subscription.id, 1);
    
    if (!creditCheck.available) {
      return NextResponse.json(
        {
          success: false,
          error: creditCheck.message || '额度不足',
          code: 'INSUFFICIENT_CREDITS',
          subscriptionStatus: creditCheck.subscriptionStatus,
          remainingCredits: creditCheck.remainingCredits,
        },
        { status: 422 }
      );
    }

    // 3. 创建项目
    const project = await prisma.project.create({
      data: {
        userId,
        name: v.name,
        description: v.description,
        attachments: v.attachments ? (v.attachments as Prisma.InputJsonValue) : Prisma.DbNull,
        priority: v.priority,
        status: 'PENDING', // 初始状态为待处理
      },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    // 4. 扣除订阅额度
    const deductResult = await deductCredits(subscription.id, project.id, 1);
    
    if (!deductResult.success) {
      // 如果扣费失败，删除已创建的项目（回滚）
      await prisma.project.delete({ where: { id: project.id } });
      return NextResponse.json(
        {
          success: false,
          error: deductResult.message || '扣除额度失败',
          code: 'DEDUCT_CREDITS_FAILED',
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: project.id,
        name: project.name,
        description: project.description,
        status: project.status,
        priority: project.priority,
        createdAt: project.createdAt,
        remainingCredits: deductResult.remainingCredits,
      },
      message: '项目创建成功，等待管理员分配设计师',
    });
  } catch (e) {
    return handleApiError(e);
  }
}

/**
 * GET /api/projects
 * 获取当前用户的项目列表（仅限客户）
 */
export async function GET(request: NextRequest) {
  try {
    const userId = await requireClient(request);
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const where: Prisma.ProjectWhereInput = { userId };
    if (status) {
      where.status = status;
    }

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        include: {
          assignedToUser: {
            select: { id: true, name: true, email: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.project.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: projects,
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
