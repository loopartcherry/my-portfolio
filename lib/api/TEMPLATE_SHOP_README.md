# 模板商城购买流程文档

## 概述

实现了完整的模板商城购买闭环：**购买 → 支付 → 下载**

## 数据模型扩展

### Order 模型扩展

在 `prisma/schema.prisma` 中扩展了 `Order` 模型：

```prisma
model Order {
  // ... 现有字段
  type           String   // 'subscription' | 'upgrade' | 'renewal' | 'template'
  templateId     String?  // 模板订单关联的模板ID
  template       Template? @relation(fields: [templateId], references: [id])
}
```

### Template 模型关系

```prisma
model Template {
  // ... 现有字段
  orders Order[]  // 关联的订单
}
```

## API 端点

### 1. 获取模板详情（公开）

**GET** `/api/templates/[id]`

- 无需认证
- 返回模板基本信息（不包含文件）
- 自动增加浏览次数

**响应示例：**
```json
{
  "success": true,
  "data": {
    "id": "template_123",
    "name": "Logo设计模板",
    "description": "...",
    "preview": ["url1", "url2"],
    "price": 99,
    "discount": 0.8,
    "finalPrice": 79.2,
    "downloads": 120,
    "rating": 4.5,
    "categories": [...],
    "author": "设计师名称"
  }
}
```

### 2. 创建模板订单

**POST** `/api/orders/create`

- 需要认证（CLIENT 角色）
- 请求体：`{ templateId: string }`
- 自动检查是否有未支付订单
- 计算最终价格（考虑折扣）

**响应示例：**
```json
{
  "success": true,
  "data": {
    "orderId": "order_123",
    "amount": 79.2,
    "templateName": "Logo设计模板",
    "status": "pending"
  }
}
```

### 3. 创建支付会话

**POST** `/api/payments/create-session`

- 需要认证（CLIENT 角色）
- 请求体：`{ orderId: string, paymentMethod?: 'stripe' | 'alipay' | 'wechat' }`
- 生成支付链接

**响应示例：**
```json
{
  "success": true,
  "data": {
    "paymentUrl": "/api/payments/alipay/checkout?session_id=...&order_id=...",
    "paymentSessionId": "ps_...",
    "orderId": "order_123",
    "amount": 79.2
  }
}
```

### 4. 支付回调

**POST** `/api/payments/callback`

- 公开接口（支付平台回调）
- 请求体：
  ```json
  {
    "orderId": "order_123",
    "transactionId": "TXN_...",
    "paymentMethod": "alipay",
    "amount": 79.2,
    "status": "success",
    "signature": "..." // 可选，用于验证
  }
  ```
- 更新订单状态为 `paid`
- 增加模板下载次数

### 5. 下载模板

**GET** `/api/templates/[id]/download`

- 需要认证
- 验证用户是否有已支付的订单
- 记录下载记录
- 返回文件列表（实际环境中应返回预签名URL）

**响应示例：**
```json
{
  "success": true,
  "data": {
    "templateId": "template_123",
    "templateName": "Logo设计模板",
    "files": [
      {
        "format": "AI",
        "url": "https://...",
        "size": 1024000,
        "filename": "logo-template.ai"
      }
    ],
    "downloadAt": "2024-01-20T10:30:00Z"
  }
}
```

### 6. 获取订单列表

**GET** `/api/orders?status=pending&type=template`

- 需要认证
- 查询参数：`status`, `type`
- 返回当前用户的订单列表

### 7. 获取订单详情

**GET** `/api/orders/[id]`

- 需要认证
- 仅订单所有者可访问

## 支付流程

### 支付宝支付（模拟）

1. 用户点击"立即购买"
2. 创建订单 → `/api/orders/create`
3. 创建支付会话 → `/api/payments/create-session`
4. 跳转到支付页面 → `/api/payments/alipay/checkout`
5. 用户确认支付（模拟）
6. 调用支付回调 → `/api/payments/callback`
7. 跳转到支付成功页面 → `/payments/success?order_id=...`

### 支付页面

**GET** `/api/payments/alipay/checkout?order_id=...&session_id=...`

- 显示订单信息
- 模拟支付确认按钮
- 支付成功后调用回调API

## 前端页面

### 1. 模板详情页

**路径：** `/templates/[id]`

- 显示模板预览图、价格、描述
- "立即购买"按钮
- 使用 `useCreateTemplateOrder` 和 `useCreatePaymentSession` hooks

### 2. 支付成功页面

**路径：** `/payments/success?order_id=...`

- 显示支付成功信息
- "立即下载"按钮（如果订单已支付）
- "查看订单"按钮

### 3. 订单页面（更新）

**路径：** `/dashboard/orders`

- 显示所有订单
- 已支付的模板订单显示"下载模板"按钮
- 待支付订单显示"立即支付"按钮

## React Hooks

### `useOrders`

```typescript
// 获取订单列表
const { data: orders } = useOrders({ status: 'paid', type: 'template' });

// 获取订单详情
const { data: order } = useOrder(orderId);
```

### `useCreateTemplateOrder`

```typescript
const createOrder = useCreateTemplateOrder();

const handlePurchase = async () => {
  const orderData = await createOrder.mutateAsync(templateId);
  // ...
};
```

### `useCreatePaymentSession`

```typescript
const createPayment = useCreatePaymentSession();

const paymentData = await createPayment.mutateAsync({
  orderId: orderData.orderId,
  paymentMethod: 'alipay',
});
window.location.href = paymentData.paymentUrl;
```

## 安全措施

1. **下载权限校验**：
   - 验证用户是否已登录
   - 验证用户是否有已支付的订单
   - 只有订单所有者才能下载

2. **支付回调验证**（TODO）：
   - 验证支付平台签名
   - 验证金额是否匹配
   - 防止重复回调

3. **订单状态管理**：
   - 使用事务保证数据一致性
   - 防止重复支付

## 数据库迁移

运行以下命令更新数据库：

```bash
npx prisma migrate dev --name add_template_order_support
npx prisma generate
```

## 测试流程

1. **创建测试模板**（管理员后台）
2. **访问模板详情页**：`/templates/[id]`
3. **点击购买** → 创建订单
4. **跳转支付页面** → 确认支付
5. **支付成功** → 跳转成功页面
6. **下载模板** → 验证权限

## 注意事项

1. **文件存储**：
   - 当前返回的是文件URL，实际环境中应使用预签名URL（S3/OSS）
   - 设置URL过期时间（如1小时）

2. **支付集成**：
   - 当前为模拟环境，实际需要：
     - 集成 Stripe/Alipay SDK
     - 实现真实的支付页面跳转
     - 实现支付回调签名验证

3. **订单超时**：
   - 建议实现订单超时自动取消（如30分钟未支付）

4. **下载限制**：
   - 可考虑限制下载次数
   - 记录下载IP和时间
