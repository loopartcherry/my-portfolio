import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleApiError } from '@/lib/api/errors';
import { ApiError } from '@/lib/api/errors';
import { validateSubmitDiagnosis } from '@/lib/api/diagnosis-validation';
import { calculateDiagnosisScore, generateDiagnosisSuggestions } from '@/lib/services/diagnosis.service';
import { getSessionFromRequest } from '@/lib/session';

/**
 * POST /api/diagnosis/submit
 * 提交诊断问卷并计算得分
 * 公开接口，无需认证（但如果有登录用户，会关联到用户）
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const v = validateSubmitDiagnosis(body);

    // 获取当前用户（如果有）
    const session = getSessionFromRequest(request);
    const userId = session?.userId || null;

    // 验证答案完整性（必须有16个问题的答案）
    const requiredQuestions = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10', 'q11', 'q12', 'q13', 'q14', 'q15', 'q16'];
    const missingQuestions = requiredQuestions.filter((q) => !v.answers[q]);
    
    if (missingQuestions.length > 0) {
      throw new ApiError(400, `缺少问题答案：${missingQuestions.join(', ')}`, 'INCOMPLETE_ANSWERS');
    }

    // 计算得分
    const result = calculateDiagnosisScore(v.answers);
    const suggestions = generateDiagnosisSuggestions(result);

    // 保存诊断记录
    const diagnosis = await prisma.diagnosis.create({
      data: {
        userId: userId || null,
        companyInfo: v.companyInfo ? (v.companyInfo as any) : null,
        answers: v.answers as any,
        totalScore: result.totalScore,
        level: result.level,
        levelName: result.levelName,
        percentile: result.percentile || null,
        dimensionScores: result.dimensionScores as any,
        contactEmail: v.contactInfo?.email || null,
        contactPhone: v.contactInfo?.phone || null,
        contactName: v.contactInfo?.name || null,
        reportGenerated: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        diagnosisId: diagnosis.id,
        totalScore: result.totalScore,
        level: result.level,
        levelName: result.levelName,
        percentile: result.percentile,
        dimensionScores: result.dimensionScores,
        suggestions,
      },
      message: '诊断提交成功',
    });
  } catch (e) {
    return handleApiError(e);
  }
}
