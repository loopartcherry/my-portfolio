import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireClient } from '@/lib/api/auth';
import { handleApiError } from '@/lib/api/errors';
import { ApiError } from '@/lib/api/errors';
import { validateCreateTemplateOrder } from '@/lib/api/order-validation';

/**
 * POST /api/orders/create
 * 创建模板购买订单
 * 仅限 CLIENT 角色
 */
export async function POST(request: NextRequest) {
  try {
    const userId = await requireClient(request);
    const body = await request.json();
    const { templateId } = validateCreateTemplateOrder(body);

    // 查找模板
    const template = await prisma.template.findUnique({
      where: { id: templateId },
      select: {
        id: true,
        name: true,
        price: true,
        discount: true,
        status: true,
      },
    });

    if (!template) {
      throw new ApiError(404, '模板不存在', 'TEMPLATE_NOT_FOUND');
    }

    if (template.status !== 'published') {
      throw new ApiError(400, '模板未发布，无法购买', 'TEMPLATE_NOT_PUBLISHED');
    }

    // 检查是否已有未支付的订单
    const existingOrder = await prisma.order.findFirst({
      where: {
        userId,
        templateId,
        type: 'template',
        status: 'pending',
      },
    });

    if (existingOrder) {
      // 返回现有订单
      return NextResponse.json({
        success: true,
        data: {
          orderId: existingOrder.id,
          amount: existingOrder.amount,
          status: existingOrder.status,
        },
        message: '已存在未支付订单',
      });
    }

    // 计算价格
    const finalPrice = template.discount
      ? template.price * template.discount
      : template.price;

    // 创建订单
    const order = await prisma.order.create({
      data: {
        userId,
        type: 'template',
        amount: finalPrice,
        status: 'pending',
        templateId: template.id,
        metadata: {
          templateName: template.name,
          templatePrice: template.price,
          discount: template.discount || null,
          finalPrice,
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        orderId: order.id,
        amount: order.amount,
        templateName: template.name,
        status: order.status,
      },
      message: '订单创建成功',
    });
  } catch (e) {
    return handleApiError(e);
  }
}
