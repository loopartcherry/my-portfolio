import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleApiError } from '@/lib/api/errors';
import { ApiError } from '@/lib/api/errors';
import { validateLogin } from '@/lib/api/auth-validation';
import { createSession } from '@/lib/session';
import * as bcrypt from 'bcryptjs';

/**
 * POST /api/auth/login
 * 用户登录
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = validateLogin(body);

    // 查找用户
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new ApiError(401, '邮箱或密码错误', 'INVALID_CREDENTIALS');
    }

    // 验证密码
    if (!user.password) {
      throw new ApiError(401, '该账号未设置密码，请联系管理员', 'NO_PASSWORD_SET');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new ApiError(401, '邮箱或密码错误', 'INVALID_CREDENTIALS');
    }

    // 创建 session
    await createSession({
      userId: user.id,
      email: user.email,
      role: user.role as 'client' | 'designer' | 'admin',
      name: user.name || undefined,
    });

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      message: '登录成功',
    });
  } catch (e) {
    return handleApiError(e);
  }
}
