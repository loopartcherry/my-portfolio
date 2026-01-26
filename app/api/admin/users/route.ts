import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/api/auth';
import { handleApiError } from '@/lib/api/errors';
import type { Prisma } from '@prisma/client';

/**
 * GET /api/admin/users
 * 获取所有用户列表（管理员）
 * 仅 Admin
 */
export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const role = searchParams.get('role');
    const sort = searchParams.get('sort'); // 'createdAt:desc' | 'createdAt:asc'

    const skip = (page - 1) * limit;

    const where: any = {};
    if (role && role !== 'all') {
      where.role = role;
    }

    const orderBy: any = { createdAt: 'desc' };
    if (sort) {
      const [field, direction] = sort.split(':');
      if (field === 'createdAt' || field === 'updatedAt' || field === 'name' || field === 'email') {
        orderBy[field] = (direction || 'desc') as 'asc' | 'desc';
      }
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        include: {
          designer: {
            select: {
              status: true,
              currentLoad: true,
              maxCapacity: true,
              rating: true,
              totalProjects: true,
            },
          },
          _count: {
            select: {
              projects: true,
              orders: true,
            },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: users.map((user) => ({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt,
        designer: user.designer,
        projectsCount: user._count.projects,
        ordersCount: user._count.orders,
      })),
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
