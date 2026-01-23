import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleApiError } from '@/lib/api/errors';
import { ApiError } from '@/lib/api/errors';
import { validateCreateConsultation } from '@/lib/api/diagnosis-validation';
import { getSessionFromRequest } from '@/lib/session';

/**
 * POST /api/consultations/create
 * 创建咨询预约
 * 公开接口，无需认证（但如果有登录用户，会关联到用户）
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const v = validateCreateConsultation(body);

    // 获取当前用户（如果有）
    const session = getSessionFromRequest(request);
    const userId = session?.userId || null;

    // 验证诊断记录是否存在
    const diagnosis = await prisma.diagnosis.findUnique({
      where: { id: v.diagnosisId },
    });

    if (!diagnosis) {
      throw new ApiError(404, '诊断记录不存在', 'DIAGNOSIS_NOT_FOUND');
    }

    // 创建咨询预约
    const consultation = await prisma.consultation.create({
      data: {
        diagnosisId: v.diagnosisId,
        userId: userId || null,
        name: v.name,
        email: v.email,
        phone: v.phone,
        company: v.company || null,
        position: v.position || null,
        preferredDate: v.preferredDate ? new Date(v.preferredDate) : null,
        preferredTime: v.preferredTime || null,
        message: v.message || null,
        type: v.type,
        status: 'pending',
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        consultationId: consultation.id,
        status: consultation.status,
      },
      message: '预约提交成功，我们将在24小时内联系您',
    });
  } catch (e) {
    return handleApiError(e);
  }
}
