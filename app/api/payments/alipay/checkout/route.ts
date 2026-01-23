import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleApiError } from '@/lib/api/errors';
import { ApiError } from '@/lib/api/errors';

/**
 * GET /api/payments/alipay/checkout
 * 支付宝支付页面（模拟）
 * 实际环境中应该重定向到支付宝支付页面
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const orderId = searchParams.get('order_id');
    const sessionId = searchParams.get('session_id');

    if (!orderId) {
      throw new ApiError(400, '订单ID不能为空', 'ORDER_ID_REQUIRED');
    }

    // 查找订单
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        template: {
          select: { id: true, name: true },
        },
        user: {
          select: { id: true, email: true, name: true },
        },
      },
    });

    if (!order) {
      throw new ApiError(404, '订单不存在', 'ORDER_NOT_FOUND');
    }

    // 模拟支付页面（实际环境中应该重定向到支付宝）
    // 这里返回一个简单的支付确认页面
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>支付宝支付 - 模拟</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              background: #f5f5f5;
              margin: 0;
            }
            .container {
              background: white;
              padding: 40px;
              border-radius: 8px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
              max-width: 400px;
              width: 100%;
            }
            h1 { margin: 0 0 20px; color: #1677ff; }
            .info { margin: 20px 0; }
            .amount { font-size: 32px; font-weight: bold; color: #1677ff; margin: 20px 0; }
            button {
              width: 100%;
              padding: 12px;
              background: #1677ff;
              color: white;
              border: none;
              border-radius: 4px;
              font-size: 16px;
              cursor: pointer;
              margin-top: 20px;
            }
            button:hover { background: #0958d9; }
            .note { margin-top: 20px; font-size: 12px; color: #999; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>💰 支付宝支付</h1>
            <div class="info">
              <p><strong>订单号：</strong>${orderId}</p>
              <p><strong>商品：</strong>${order.template?.name || '模板'}</p>
            </div>
            <div class="amount">¥${order.amount.toFixed(2)}</div>
            <button onclick="pay()">确认支付</button>
            <div class="note">⚠️ 这是模拟支付环境，点击确认将自动完成支付</div>
          </div>
          <script>
            async function pay() {
              const button = document.querySelector('button');
              button.disabled = true;
              button.textContent = '支付中...';
              
              // 模拟支付延迟
              await new Promise(r => setTimeout(r, 1500));
              
              // 调用支付回调
              const res = await fetch('/api/payments/callback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  orderId: '${orderId}',
                  transactionId: 'TXN_' + Date.now(),
                  paymentMethod: 'alipay',
                  amount: ${order.amount},
                  status: 'success',
                }),
              });
              
              if (res.ok) {
                window.location.href = '/payments/success?order_id=${orderId}';
              } else {
                alert('支付失败，请重试');
                button.disabled = false;
                button.textContent = '确认支付';
              }
            }
          </script>
        </body>
      </html>
    `;

    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  } catch (e) {
    return handleApiError(e);
  }
}
