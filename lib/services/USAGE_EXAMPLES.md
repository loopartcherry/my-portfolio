# 订阅服务使用示例

## 在 API 路由中使用订阅服务

### 示例 1: 创建项目时检查额度

```typescript
// app/api/projects/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requireClient } from '@/lib/api/auth';
import { checkSubscriptionCredits, deductCredits } from '@/lib/services/subscription.service';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const userId = await requireClient(request);
    const body = await request.json();
    const { name } = body;

    // 1. 获取用户当前订阅
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId,
        status: { in: ['active', 'trialing'] },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!subscription) {
      return NextResponse.json(
        { error: '您没有活跃的订阅' },
        { status: 422 }
      );
    }

    // 2. 检查额度
    const creditCheck = await checkSubscriptionCredits(subscription.id, 1);
    
    if (!creditCheck.available) {
      return NextResponse.json(
        {
          error: creditCheck.message || '额度不足',
          subscriptionStatus: creditCheck.subscriptionStatus,
          remainingCredits: creditCheck.remainingCredits,
        },
        { status: 422 }
      );
    }

    // 3. 创建项目
    const project = await prisma.project.create({
      data: {
        userId,
        name,
        status: 'active',
      },
    });

    // 4. 扣除额度
    const deductResult = await deductCredits(subscription.id, project.id, 1);
    
    if (!deductResult.success) {
      // 如果扣费失败，删除已创建的项目（回滚）
      await prisma.project.delete({ where: { id: project.id } });
      return NextResponse.json(
        { error: deductResult.message || '扣除额度失败' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        project,
        remainingCredits: deductResult.remainingCredits,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: '创建项目失败' },
      { status: 500 }
    );
  }
}
```

### 示例 2: 升级套餐时计算差价

```typescript
// app/api/subscriptions/upgrade/route.ts (更新版本)
import { NextRequest, NextResponse } from 'next/server';
import { requireClient } from '@/lib/api/auth';
import { calculateUpgradePrice } from '@/lib/services/subscription.service';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const userId = await requireClient(request);
    const { planId } = await request.json();

    // 获取当前订阅
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId,
        status: { in: ['active', 'trialing'] },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!subscription) {
      return NextResponse.json(
        { error: '您没有活跃的订阅' },
        { status: 422 }
      );
    }

    // 计算升级差价
    const priceInfo = await calculateUpgradePrice(subscription.id, planId);

    return NextResponse.json({
      success: true,
      data: {
        priceInfo,
        message: priceInfo.needsRefund
          ? `升级后您将获得 ${priceInfo.refundAmount} 元退款`
          : `升级需要补交 ${priceInfo.difference} 元`,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '计算差价失败' },
      { status: 500 }
    );
  }
}
```

### 示例 3: 检查续费状态

```typescript
// app/api/subscriptions/renewal-status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requireClient } from '@/lib/api/auth';
import { checkRenewalAvailable } from '@/lib/services/subscription.service';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const userId = await requireClient(request);

    // 获取当前订阅
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId,
        status: { in: ['active', 'trialing'] },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!subscription) {
      return NextResponse.json(
        { error: '您没有活跃的订阅' },
        { status: 422 }
      );
    }

    // 检查续费状态
    const renewalInfo = await checkRenewalAvailable(subscription.id);

    return NextResponse.json({
      success: true,
      data: renewalInfo,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '检查续费状态失败' },
      { status: 500 }
    );
  }
}
```

### 示例 4: 定时任务处理过期订阅

```typescript
// app/api/cron/subscriptions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { batchHandleExpiredSubscriptions } from '@/lib/services/subscription.service';

export async function GET(request: NextRequest) {
  // 验证请求来源（确保是定时任务服务调用）
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    // 每次处理100个过期订阅
    const result = await batchHandleExpiredSubscriptions(100);

    return NextResponse.json({
      success: true,
      message: `处理完成：成功 ${result.succeeded} 个，失败 ${result.failed} 个`,
      data: result,
    });
  } catch (error) {
    console.error('批量处理过期订阅失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '未知错误',
      },
      { status: 500 }
    );
  }
}
```

### 示例 5: 在项目创建前预检查

```typescript
// app/api/projects/pre-check/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requireClient } from '@/lib/api/auth';
import { checkSubscriptionCredits } from '@/lib/services/subscription.service';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const userId = await requireClient(request);

    // 获取当前订阅
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId,
        status: { in: ['active', 'trialing'] },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!subscription) {
      return NextResponse.json({
        success: false,
        canCreate: false,
        message: '您没有活跃的订阅',
      });
    }

    // 检查额度
    const creditCheck = await checkSubscriptionCredits(subscription.id, 1);

    return NextResponse.json({
      success: true,
      canCreate: creditCheck.available,
      remainingCredits: creditCheck.remainingCredits,
      subscriptionStatus: creditCheck.subscriptionStatus,
      message: creditCheck.message,
    });
  } catch (error) {
    return NextResponse.json(
      { error: '检查失败' },
      { status: 500 }
    );
  }
}
```

## 在前端组件中使用

### 示例: 显示额度信息

```typescript
// components/subscription/quota-display.tsx
'use client';

import { useEffect, useState } from 'react';
import { checkSubscriptionCredits } from '@/lib/services/subscription.service';

export function QuotaDisplay({ subscriptionId }: { subscriptionId: string }) {
  const [quota, setQuota] = useState<{
    available: boolean;
    remainingCredits: number;
    message?: string;
  } | null>(null);

  useEffect(() => {
    async function fetchQuota() {
      try {
        const result = await checkSubscriptionCredits(subscriptionId, 1);
        setQuota(result);
      } catch (error) {
        console.error('获取额度信息失败:', error);
      }
    }

    fetchQuota();
  }, [subscriptionId]);

  if (!quota) {
    return <div>加载中...</div>;
  }

  return (
    <div>
      <p>剩余额度: {quota.remainingCredits === Infinity ? '无限制' : quota.remainingCredits}</p>
      {!quota.available && quota.message && (
        <p className="text-red-500">{quota.message}</p>
      )}
    </div>
  );
}
```

## 错误处理最佳实践

```typescript
import { checkSubscriptionCredits } from '@/lib/services/subscription.service';

try {
  const result = await checkSubscriptionCredits(subscriptionId, 1);
  
  if (!result.available) {
    // 处理额度不足的情况
    switch (result.subscriptionStatus) {
      case 'expired':
        // 引导用户续费
        redirect('/dashboard/subscription?action=renew');
        break;
      case 'cancelled':
        // 引导用户重新订阅
        redirect('/pricing');
        break;
      default:
        // 引导用户升级套餐
        redirect('/dashboard/subscription?action=upgrade');
    }
  }
} catch (error) {
  // 记录错误并显示友好提示
  console.error('检查额度失败:', error);
  showError('检查额度失败，请稍后重试');
}
```

## 性能优化建议

1. **缓存订阅信息**：对于频繁查询的订阅信息，可以使用缓存
2. **批量查询**：如果需要检查多个用户的额度，使用批量查询
3. **异步处理**：过期订阅处理等耗时操作使用异步队列

```typescript
// 使用 Redis 缓存订阅信息
import { redis } from '@/lib/redis';

async function getCachedSubscription(userId: string) {
  const cacheKey = `subscription:${userId}`;
  const cached = await redis.get(cacheKey);
  
  if (cached) {
    return JSON.parse(cached);
  }

  const subscription = await prisma.subscription.findFirst({
    where: { userId, status: { in: ['active', 'trialing'] } },
  });

  if (subscription) {
    await redis.setex(cacheKey, 300, JSON.stringify(subscription)); // 缓存5分钟
  }

  return subscription;
}
```
