import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/api/auth';
import { handleApiError } from '@/lib/api/errors';

/**
 * GET /api/admin/diagnoses
 * 获取所有诊断记录（管理员）
 * 仅 Admin
 */
export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);
    
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status'); // 是否有咨询预约

    const skip = (page - 1) * limit;

    const where: any = {};
    if (status === 'with_consultation') {
      where.consultations = { some: {} };
    } else if (status === 'no_consultation') {
      where.consultations = { none: {} };
    }

    const [diagnoses, total] = await Promise.all([
      prisma.diagnosis.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          consultations: {
            select: {
              id: true,
              status: true,
              name: true,
              email: true,
              phone: true,
              createdAt: true,
            },
            orderBy: {
              createdAt: 'desc',
            },
          },
          _count: {
            select: {
              consultations: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.diagnosis.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: diagnoses.map((d) => ({
        id: d.id,
        totalScore: d.totalScore,
        level: d.level,
        levelName: d.levelName,
        companyInfo: d.companyInfo,
        contactName: d.contactName,
        contactEmail: d.contactEmail,
        contactPhone: d.contactPhone,
        user: d.user,
        consultations: d.consultations,
        consultationCount: d._count.consultations,
        createdAt: d.createdAt,
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
