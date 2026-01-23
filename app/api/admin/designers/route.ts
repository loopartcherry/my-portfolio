import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/api/auth';
import { handleApiError } from '@/lib/api/errors';
import { ApiError } from '@/lib/api/errors';
import {
  validateDesignerListQuery,
  validateCreateDesigner,
} from '@/lib/api/designer-validation';

function parseListQuery(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const status = sp.get('status') || undefined;
  const specialty = sp.get('specialty') || undefined;
  const sortBy = sp.get('sortBy') || undefined;
  return validateDesignerListQuery({ status, specialty, sortBy });
}

/**
 * GET /api/admin/designers
 * 获取所有设计师列表
 * 仅 Admin
 * 查询参数：status, specialty, sortBy (rating | capacity | load)
 */
export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);
    const q = parseListQuery(request);

    const designers = await prisma.designer.findMany({
      where: {
        ...(q.status && { status: q.status }),
      },
      include: {
        user: {
          select: { id: true, email: true, name: true, role: true },
        },
      },
      orderBy:
        q.sortBy === 'rating'
          ? { rating: 'desc' }
          : q.sortBy === 'capacity'
            ? { maxCapacity: 'desc' }
            : q.sortBy === 'load'
              ? { currentLoad: 'asc' }
              : { createdAt: 'desc' },
    });

    let list = designers.map((d) => ({
      id: d.id,
      userId: d.userId,
      email: d.user.email,
      name: d.user.name,
      specialties: d.specialties as string[] | null,
      hourlyRate: d.hourlyRate,
      maxCapacity: d.maxCapacity,
      currentLoad: d.currentLoad,
      rating: d.rating,
      totalProjects: d.totalProjects,
      status: d.status,
      leaveFrom: d.leaveFrom,
      leaveTo: d.leaveTo,
      createdAt: d.createdAt,
      updatedAt: d.updatedAt,
    }));

    if (q.specialty && q.specialty.trim()) {
      const want = q.specialty.trim().toLowerCase();
      list = list.filter((d) => {
        const s = (d.specialties || []) as string[];
        return s.some((x) => String(x).toLowerCase().includes(want));
      });
    }

    return NextResponse.json({
      success: true,
      data: list,
      count: list.length,
    });
  } catch (e) {
    return handleApiError(e);
  }
}

/**
 * POST /api/admin/designers
 * 创建设计师账号（User + Designer）
 * 仅 Admin
 * 请求体：email, password?, name?, phone?, specialties?, hourlyRate?, maxCapacity?
 * 注：password、phone 当前不落库，后续可接认证/扩展 User 模型
 */
export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request);
    const body = await request.json();
    const v = validateCreateDesigner(body);

    const existing = await prisma.user.findUnique({
      where: { email: v.email },
    });
    if (existing) {
      throw new ApiError(422, '该邮箱已注册', 'EMAIL_EXISTS');
    }

    const user = await prisma.user.create({
      data: {
        email: v.email,
        name: v.name ?? null,
        role: 'designer',
      },
    });

    const designer = await prisma.designer.create({
      data: {
        userId: user.id,
        specialties: v.specialties ?? undefined,
        hourlyRate: v.hourlyRate ?? 0,
        maxCapacity: v.maxCapacity ?? 3,
        status: 'active',
      },
      include: {
        user: {
          select: { id: true, email: true, name: true, role: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: designer.id,
        userId: designer.userId,
        email: designer.user.email,
        name: designer.user.name,
        specialties: designer.specialties,
        hourlyRate: designer.hourlyRate,
        maxCapacity: designer.maxCapacity,
        currentLoad: designer.currentLoad,
        rating: designer.rating,
        totalProjects: designer.totalProjects,
        status: designer.status,
        createdAt: designer.createdAt,
        updatedAt: designer.updatedAt,
      },
      message: '设计师账号已创建',
    });
  } catch (e) {
    return handleApiError(e);
  }
}
