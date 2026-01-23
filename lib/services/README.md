# 订阅服务业务逻辑说明

## 概述

`subscription.service.ts` 提供了订阅功能的完整业务逻辑服务，包括额度检查、扣费、升级计算、续费检查和处理过期订阅等功能。

## 服务函数

### 1. checkSubscriptionCredits

检查订阅额度是否充足。

**使用场景**：
- 客户创建项目前检查是否有足够额度
- 批量操作前检查总额度

**示例**：
```typescript
import { checkSubscriptionCredits } from '@/lib/services/subscription.service';

// 检查是否有足够额度创建1个项目
const result = await checkSubscriptionCredits('sub_123', 1);

if (result.available) {
  console.log(`可用，剩余额度：${result.remainingCredits}`);
  // 继续创建项目
} else {
  console.log(result.message); // 显示错误信息
  // 提示用户升级或续费
}
```

**返回值**：
```typescript
{
  available: boolean;        // 是否有足够额度
  remainingCredits: number;  // 剩余额度（Infinity 表示无限制）
  subscriptionStatus: string; // 订阅状态
  message?: string;          // 错误信息（如果有）
}
```

### 2. deductCredits

扣除订阅额度。

**使用场景**：
- 项目创建成功后扣除额度
- 使用付费功能时扣除额度

**示例**：
```typescript
import { deductCredits } from '@/lib/services/subscription.service';

// 创建项目后扣除1个额度
const result = await deductCredits('sub_123', 'project_456', 1);

if (result.success) {
  console.log(`扣费成功，剩余额度：${result.remainingCredits}`);
} else {
  console.error(result.message);
  // 处理扣费失败的情况
}
```

**注意事项**：
- 使用事务保证数据一致性
- 如果额度不足，会抛出错误
- 额度即将用完时会记录日志（可扩展为发送通知）

**返回值**：
```typescript
{
  success: boolean;          // 是否成功
  remainingCredits: number;  // 剩余额度
  message?: string;          // 错误信息（如果有）
}
```

### 3. calculateUpgradePrice

计算升级套餐的差价。

**使用场景**：
- 用户升级套餐时显示需要补的差价
- 计算退款金额（如果新套餐更便宜）

**示例**：
```typescript
import { calculateUpgradePrice } from '@/lib/services/subscription.service';

// 计算从当前套餐升级到新套餐的差价
const priceInfo = await calculateUpgradePrice('sub_123', 'plan_456');

console.log(`当前价格：${priceInfo.currentPrice}`);
console.log(`新价格：${priceInfo.newPrice}`);
console.log(`差价：${priceInfo.difference}`);
console.log(`剩余天数：${priceInfo.remainingDays}`);

if (priceInfo.needsRefund) {
  console.log(`需要退款：${priceInfo.refundAmount}`);
}
```

**计算逻辑**：
1. 计算当前订阅已使用的价值（按天数比例）
2. 计算新套餐的按比例价格（基于剩余天数）
3. 计算差价 = 新价格 - 剩余价值
4. 如果差价为负，表示需要退款

**返回值**：
```typescript
{
  currentPrice: number;      // 当前订阅价格
  newPrice: number;          // 新套餐价格（按比例）
  difference: number;        // 差价（绝对值）
  needsRefund: boolean;      // 是否需要退款
  refundAmount?: number;     // 退款金额（如果需要）
  proratedAmount: number;    // 按比例计算的新价格
  remainingDays: number;     // 剩余天数
}
```

### 4. checkRenewalAvailable

检查订阅是否可以续费。

**使用场景**：
- 显示续费按钮和提示
- 定时任务检查即将过期的订阅

**示例**：
```typescript
import { checkRenewalAvailable } from '@/lib/services/subscription.service';

const renewalInfo = await checkRenewalAvailable('sub_123');

if (renewalInfo.canRenew) {
  console.log(`可以续费，将在 ${renewalInfo.daysUntilExpiry} 天后过期`);
  console.log(`续费价格：${renewalInfo.renewalPrice}`);
  // 显示续费按钮
} else {
  console.log(renewalInfo.message);
  // 显示提示信息
}
```

**续费规则**：
- 距离过期 ≤ 7 天：可以续费
- 已过期：可以续费
- 距离过期 > 7 天：暂不可续费

**返回值**：
```typescript
{
  canRenew: boolean;         // 是否可以续费
  daysUntilExpiry: number;   // 距离过期的天数
  expiryDate: Date;          // 过期日期
  renewalPrice: number;      // 续费价格
  message?: string;          // 提示信息
}
```

### 5. handleSubscriptionExpiry

处理单个过期订阅。

**使用场景**：
- 定时任务处理过期订阅
- 手动触发处理过期订阅

**示例**：
```typescript
import { handleSubscriptionExpiry } from '@/lib/services/subscription.service';

const result = await handleSubscriptionExpiry('sub_123');

if (result.success) {
  console.log(result.message);
  console.log('执行的操作：', result.actions);
  // actions 可能包括：
  // - 'status_updated': 状态已更新
  // - 'email_sent': 已发送邮件
  // - 'renewal_order_created': 已创建续费订单
  // - 'auto_renew_disabled': 自动续费已关闭
}
```

**处理流程**：
1. 检查订阅是否已过期
2. 更新订阅状态为 'expired'
3. 发送过期通知邮件
4. 如果启用自动续费，创建续费订单

**返回值**：
```typescript
{
  success: boolean;    // 是否成功
  message: string;    // 处理结果信息
  actions: string[]; // 执行的操作列表
}
```

### 6. batchHandleExpiredSubscriptions（额外功能）

批量处理过期订阅。

**使用场景**：
- 定时任务批量处理所有过期订阅
- 提高处理效率

**示例**：
```typescript
import { batchHandleExpiredSubscriptions } from '@/lib/services/subscription.service';

// 每次处理100个过期订阅
const stats = await batchHandleExpiredSubscriptions(100);

console.log(`总共找到 ${stats.total} 个过期订阅`);
console.log(`成功处理 ${stats.succeeded} 个`);
console.log(`失败 ${stats.failed} 个`);

// 查看每个订阅的处理结果
stats.results.forEach(result => {
  console.log(`${result.subscriptionId}: ${result.success ? '成功' : '失败'} - ${result.message}`);
});
```

**返回值**：
```typescript
{
  total: number;      // 找到的过期订阅总数
  processed: number;  // 已处理的订阅数
  succeeded: number;  // 成功处理的订阅数
  failed: number;     // 失败的订阅数
  results: Array<{    // 每个订阅的处理结果
    subscriptionId: string;
    success: boolean;
    message: string;
  }>;
}
```

## 定时任务示例

创建一个定时任务来检查和处理过期订阅：

```typescript
// app/api/cron/subscriptions/route.ts
import { batchHandleExpiredSubscriptions } from '@/lib/services/subscription.service';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // 验证请求来源（确保是定时任务服务调用）
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await batchHandleExpiredSubscriptions(100);
    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '未知错误',
    }, { status: 500 });
  }
}
```

## 数据模型要求

确保 Prisma schema 中包含以下模型：

```prisma
model Subscription {
  id          String   @id @default(cuid())
  userId      String
  planId      String
  type        String   // "monthly" | "yearly"
  status      String   // "pending" | "active" | "trialing" | "cancelled" | "expired"
  startDate   DateTime
  endDate     DateTime
  price       Float
  autoRenew   Boolean  @default(true)
  cancelledAt DateTime?
  // ... 其他字段
}

model SubscriptionPlan {
  id            String   @id @default(cuid())
  name          String
  price         Float
  yearlyPrice   Float
  maxProjects   Int      @default(0)  // 0 表示无限制
  // ... 其他字段
}

model Project {
  id        String   @id @default(cuid())
  userId    String
  name      String
  createdAt DateTime @default(now())
  // ... 其他字段
}

// 可选：额度使用记录表
model CreditsUsage {
  id             String   @id @default(cuid())
  subscriptionId String
  projectId      String?
  credits        Int
  type           String   // "project_creation" | "feature_usage"
  createdAt      DateTime @default(now())
  // ... 其他字段
}
```

## 错误处理

所有服务函数都包含完整的错误处理：

1. **参数验证**：检查必要的参数是否存在
2. **数据验证**：验证订阅、套餐等数据是否存在
3. **业务逻辑验证**：检查订阅状态、额度等业务规则
4. **异常捕获**：捕获并记录所有错误
5. **事务回滚**：使用 Prisma 事务确保数据一致性

## 注意事项

1. **并发处理**：使用 Prisma 事务保证并发场景下的数据一致性
2. **性能优化**：批量处理过期订阅时使用 `take` 限制每次处理数量
3. **通知集成**：邮件和通知功能需要集成实际的邮件服务
4. **支付集成**：自动续费需要集成支付网关
5. **日志记录**：所有关键操作都记录日志，便于排查问题

## 扩展建议

1. **额度预警**：当额度低于阈值时自动发送通知
2. **续费折扣**：提前续费提供折扣
3. **额度赠送**：特殊活动时赠送额度
4. **使用统计**：记录详细的额度使用历史
5. **自动降级**：过期后自动降级到免费套餐
