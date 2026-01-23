# 订阅功能 API 接口文档

## 概述

本文档描述了订阅功能的完整 API 接口实现。所有接口都已实现，包含完整的错误处理、数据验证、权限检查和业务逻辑。

## 数据模型要求

以下是在 `prisma/schema.prisma` 中需要定义的数据模型：

```prisma
model SubscriptionPlan {
  id            String   @id @default(cuid())
  name          String   // 套餐名称，如 "Professional", "Enterprise"
  description   String?  // 套餐描述
  price         Float    // 月付价格
  yearlyPrice   Float    // 年付价格
  features      Json?    // 功能列表（JSON格式）
  maxProjects   Int      @default(0)  // 最大项目数，0表示无限制
  maxStorage    Int      @default(0)  // 最大存储空间（GB），0表示无限制
  maxTeamMembers Int     @default(0)  // 最大团队成员数，0表示无限制
  isActive      Boolean  @default(true)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  subscriptions Subscription[]
  
  @@map("subscription_plans")
}

model Subscription {
  id          String   @id @default(cuid())
  userId      String   // 用户ID
  planId      String   // 套餐ID
  type        String   // "monthly" | "yearly"
  status      String   // "pending" | "active" | "trialing" | "cancelled" | "expired"
  startDate   DateTime
  endDate     DateTime
  price       Float    // 订阅价格
  autoRenew   Boolean  @default(true)
  cancelledAt DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  plan        SubscriptionPlan @relation(fields: [planId], references: [id])
  orders      Order[]
  
  @@index([userId])
  @@index([status])
  @@map("subscriptions")
}

model Order {
  id             String   @id @default(cuid())
  userId         String   // 用户ID
  type           String   // "subscription" | "upgrade" | "renewal"
  amount         Float    // 订单金额
  status         String   // "pending" | "paid" | "failed" | "cancelled" | "refunded"
  subscriptionId String?  // 关联的订阅ID
  transactionId String?  // 支付交易ID
  paidAt         DateTime?
  metadata       Json?    // 额外信息（JSON格式）
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
  
  subscription   Subscription? @relation(fields: [subscriptionId], references: [id])
  
  @@index([userId])
  @@index([status])
  @@map("orders")
}

model Project {
  id        String   @id @default(cuid())
  userId    String   // 用户ID
  name      String
  status    String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@index([userId])
  @@map("projects")
}
```

## API 端点列表

### 1. GET /api/subscriptions/plans
获取所有可用的订阅套餐列表

**权限**: 公开，无需认证

**响应示例**:
```json
{
  "success": true,
  "data": [
    {
      "id": "plan_123",
      "name": "Professional",
      "description": "专业版套餐",
      "price": 299,
      "yearlyPrice": 2990,
      "features": ["功能1", "功能2"],
      "maxProjects": 10,
      "maxStorage": 100,
      "maxTeamMembers": 5
    }
  ],
  "count": 1
}
```

### 2. GET /api/subscriptions/current
获取当前用户的订阅信息

**权限**: 需要认证，仅限客户角色

**响应示例**:
```json
{
  "success": true,
  "data": {
    "subscription": {
      "id": "sub_123",
      "status": "active",
      "type": "monthly",
      "startDate": "2024-01-01T00:00:00Z",
      "endDate": "2024-02-01T00:00:00Z",
      "autoRenew": true
    },
    "plan": {
      "id": "plan_123",
      "name": "Professional",
      "maxProjects": 10,
      "maxStorage": 100
    },
    "quota": {
      "projects": {
        "used": 3,
        "total": 10,
        "remaining": 7
      }
    }
  }
}
```

### 3. POST /api/subscriptions/subscribe
订阅套餐

**权限**: 需要认证，仅限客户角色

**请求体**:
```json
{
  "planId": "plan_123",
  "type": "monthly"
}
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "subscription": {
      "id": "sub_123",
      "status": "pending",
      "type": "monthly"
    },
    "order": {
      "id": "order_123",
      "amount": 299,
      "status": "pending"
    },
    "paymentLink": "/checkout?orderId=order_123&type=subscription"
  },
  "message": "订阅创建成功，请完成支付"
}
```

### 4. POST /api/subscriptions/upgrade
升级套餐

**权限**: 需要认证，仅限客户角色

**请求体**:
```json
{
  "planId": "plan_456"
}
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "subscription": {
      "id": "sub_123",
      "status": "pending",
      "plan": { "name": "Enterprise" }
    },
    "upgradeInfo": {
      "oldPlan": { "name": "Professional" },
      "newPlan": { "name": "Enterprise" },
      "remainingDays": 15,
      "upgradeAmount": 150,
      "needsPayment": true
    },
    "paymentLink": "/checkout?orderId=order_456&type=upgrade"
  }
}
```

### 5. POST /api/subscriptions/cancel
取消订阅

**权限**: 需要认证，仅限客户角色

**响应示例**:
```json
{
  "success": true,
  "data": {
    "subscription": {
      "id": "sub_123",
      "status": "cancelled",
      "endDate": "2024-02-01T00:00:00Z",
      "cancelledAt": "2024-01-15T00:00:00Z"
    }
  },
  "message": "订阅已取消，当前周期将在到期日结束"
}
```

### 6. GET /api/subscriptions/history
获取订阅历史记录

**权限**: 需要认证，仅限客户角色

**查询参数**:
- `page`: 页码（默认: 1）
- `limit`: 每页数量（默认: 10）

**响应示例**:
```json
{
  "success": true,
  "data": [
    {
      "subscription": {
        "id": "sub_123",
        "status": "active",
        "type": "monthly",
        "plan": { "name": "Professional" }
      },
      "orders": [
        {
          "id": "order_123",
          "amount": 299,
          "status": "paid",
          "paidAt": "2024-01-01T00:00:00Z"
        }
      ]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

### 7. GET /api/subscriptions/usage
获取额度使用情况

**权限**: 需要认证，仅限客户角色

**响应示例**:
```json
{
  "success": true,
  "data": {
    "subscription": {
      "id": "sub_123",
      "plan": { "name": "Professional" },
      "periodStart": "2024-01-01T00:00:00Z",
      "periodEnd": "2024-02-01T00:00:00Z",
      "remainingDays": 15
    },
    "usage": {
      "projects": {
        "used": 3,
        "total": 10,
        "remaining": 7,
        "percentage": 30,
        "list": [...]
      }
    }
  }
}
```

### 8. POST /api/subscriptions/renew-callback
支付回调接口（续费通知）

**权限**: 由支付网关调用，需要验证签名

**请求体**:
```json
{
  "orderId": "order_123",
  "paymentStatus": "success",
  "transactionId": "txn_123",
  "paidAmount": 299,
  "paidAt": "2024-01-15T00:00:00Z"
}
```

**响应示例**:
```json
{
  "success": true,
  "message": "支付成功，订阅已续费",
  "data": {
    "order": {
      "id": "order_123",
      "status": "paid"
    },
    "subscription": {
      "id": "sub_123",
      "status": "active",
      "endDate": "2024-03-01T00:00:00Z"
    }
  }
}
```

## 错误处理

所有接口都使用统一的错误响应格式：

```json
{
  "error": {
    "message": "错误描述",
    "code": "ERROR_CODE",
    "details": {}
  }
}
```

常见错误码：
- `UNAUTHORIZED` (401): 未认证
- `FORBIDDEN` (403): 权限不足
- `VALIDATION_ERROR` (400): 数据验证失败
- `PLAN_NOT_FOUND` (404): 套餐不存在
- `ALREADY_SUBSCRIBED` (422): 已有活跃订阅
- `NO_ACTIVE_SUBSCRIPTION` (422): 没有活跃订阅
- `SAME_PLAN` (422): 已是该套餐用户
- `INTERNAL_ERROR` (500): 服务器内部错误

## 安装依赖

确保安装以下 npm 包：

```bash
npm install @prisma/client zod
npm install -D prisma
```

## 注意事项

1. **认证实现**: 当前使用模拟认证，实际部署时需要集成真实的认证系统（如 NextAuth.js）
2. **支付集成**: 支付链接生成和回调验证需要集成实际的支付网关（支付宝、微信支付等）
3. **数据模型**: 确保 Prisma schema 中包含上述所有模型定义
4. **文件存储**: 存储使用量计算需要根据实际的文件表结构实现
5. **团队管理**: 团队成员统计需要根据实际的团队表结构实现

## 测试建议

1. 使用 Postman 或类似工具测试各个端点
2. 测试各种边界情况（如重复订阅、升级到相同套餐等）
3. 测试权限控制（使用不同角色的用户）
4. 测试支付回调的幂等性
