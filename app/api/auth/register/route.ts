import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleApiError } from '@/lib/api/errors';
import { ApiError } from '@/lib/api/errors';
import { validateRegister } from '@/lib/api/auth-validation';
import { createSession } from '@/lib/session';
import * as bcrypt from 'bcryptjs';

/**
 * POST /api/auth/register
 * 用户注册（仅限 CLIENT 角色）
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, phone } = validateRegister(body);

    // 检查邮箱是否已存在
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      throw new ApiError(422, '该邮箱已被注册', 'EMAIL_EXISTS');
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 创建用户（仅限 client 角色）
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'client', // 注册时固定为 client
      },
    });

    // 创建 session
    await createSession({
      userId: user.id,
      email: user.email,
      role: 'client',
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
      message: '注册成功',
    });
  } catch (e) {
    return handleApiError(e);
  }
}
