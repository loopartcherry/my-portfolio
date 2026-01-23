import { NextRequest, NextResponse } from 'next/server';
import { deleteSession } from '@/lib/session';

/**
 * POST /api/auth/logout
 * 用户登出
 */
export async function POST(request: NextRequest) {
  try {
    await deleteSession();

    return NextResponse.json({
      success: true,
      message: '已退出登录',
    });
  } catch (e) {
    return NextResponse.json(
      {
        success: false,
        error: {
          message: '退出登录失败',
          code: 'LOGOUT_ERROR',
        },
      },
      { status: 500 }
    );
  }
}
