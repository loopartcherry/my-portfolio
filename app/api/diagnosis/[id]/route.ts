import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleApiError } from '@/lib/api/errors';
import { ApiError } from '@/lib/api/errors';
import { generateDiagnosisSuggestions } from '@/lib/services/diagnosis.service';

type RouteContext = { params: Promise<{ id: string }> };

/**
 * GET /api/diagnosis/[id]
 * 获取诊断报告详情
 * 公开接口，但建议验证权限（仅诊断创建者或管理员）
 */
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id: diagnosisId } = await context.params;

    const diagnosis = await prisma.diagnosis.findUnique({
      where: { id: diagnosisId },
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
            createdAt: true,
          },
        },
      },
    });

    if (!diagnosis) {
      throw new ApiError(404, '诊断记录不存在', 'DIAGNOSIS_NOT_FOUND');
    }

    // 生成建议
    const result = {
      totalScore: diagnosis.totalScore,
      level: diagnosis.level,
      levelName: diagnosis.levelName,
      dimensionScores: diagnosis.dimensionScores as any,
      percentile: diagnosis.percentile ?? undefined,
    };
    const suggestions = generateDiagnosisSuggestions(result);

    return NextResponse.json({
      success: true,
      data: {
        id: diagnosis.id,
        totalScore: diagnosis.totalScore,
        level: diagnosis.level,
        levelName: diagnosis.levelName,
        percentile: diagnosis.percentile,
        dimensionScores: diagnosis.dimensionScores,
        companyInfo: diagnosis.companyInfo,
        answers: diagnosis.answers,
        suggestions,
        createdAt: diagnosis.createdAt,
        user: diagnosis.user,
        hasConsultation: diagnosis.consultations.length > 0,
      },
    });
  } catch (e) {
    return handleApiError(e);
  }
}
