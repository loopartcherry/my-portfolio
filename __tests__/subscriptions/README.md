# 订阅功能测试说明

## 测试文件结构

```
__tests__/subscriptions/
├── subscription.api.test.ts          # API 端点测试
├── subscription.service.test.ts      # 业务逻辑测试
├── subscription.integration.test.ts  # 端到端集成测试
└── subscription.e2e.test.tsx        # UI 交互测试
```

## 安装依赖

### 1. 安装测试相关依赖

```bash
npm install -D jest @testing-library/react @testing-library/jest-dom @testing-library/user-event
npm install -D @types/jest jest-environment-jsdom
```

### 2. 安装 React Query（如果未安装）

```bash
npm install @tanstack/react-query
```

## 运行测试

### 运行所有测试

```bash
npm test
```

### 运行订阅相关测试

```bash
npm test -- __tests__/subscriptions
```

### 运行特定测试文件

```bash
npm test -- subscription.api.test.ts
```

### 查看覆盖率

```bash
npm test -- --coverage
```

## 测试覆盖的场景

### 1. API 端点测试 (subscription.api.test.ts)

- ✅ GET /api/subscriptions/plans - 获取套餐列表
- ✅ GET /api/subscriptions/current - 获取当前订阅
- ✅ POST /api/subscriptions/subscribe - 订阅套餐
- ✅ POST /api/subscriptions/upgrade - 升级套餐
- ✅ POST /api/subscriptions/cancel - 取消订阅
- ✅ GET /api/subscriptions/history - 获取订阅历史
- ✅ GET /api/subscriptions/usage - 获取使用情况
- ✅ POST /api/subscriptions/renew-callback - 支付回调

### 2. 业务逻辑测试 (subscription.service.test.ts)

- ✅ checkSubscriptionCredits - 检查订阅额度
- ✅ deductCredits - 扣除额度
- ✅ calculateUpgradePrice - 计算升级差价
- ✅ checkRenewalAvailable - 检查续费可用性
- ✅ handleSubscriptionExpiry - 处理订阅过期
- ✅ batchHandleExpiredSubscriptions - 批量处理过期订阅

### 3. 集成测试 (subscription.integration.test.ts)

- ✅ 完整的订阅流程（查看套餐 → 创建订阅 → 支付 → 激活）
- ✅ 创建项目时的额度检查流程
- ✅ 升级套餐的完整流程
- ✅ 取消订阅的完整流程
- ✅ 自动续费的完整流程
- ✅ 权限和安全测试

### 4. UI 交互测试 (subscription.e2e.test.tsx)

- ✅ 升级页面显示和交互
- ✅ 续费页面显示和交互
- ✅ 加载状态和错误处理
- ✅ 表单提交和确认对话框

## Mock 数据

测试使用的 Mock 数据在 `__tests__/__fixtures__/subscriptions.ts` 中定义：

- `mockUser` - 测试用户
- `mockPlans` - 测试套餐列表
- `mockSubscription` - 测试订阅
- `mockOrder` - 测试订单
- `mockProject` - 测试项目

## Mock 服务

### Prisma Mock

在 `__tests__/__mocks__/prisma.ts` 中定义了 Prisma 的 Mock，包括：

- `subscriptionPlan` - 套餐相关操作
- `subscription` - 订阅相关操作
- `order` - 订单相关操作
- `project` - 项目相关操作
- `$transaction` - 事务操作

### Auth Mock

在 `__tests__/__mocks__/auth.ts` 中定义了认证相关的 Mock：

- `requireClient` - 要求客户角色
- `getCurrentUserRole` - 获取当前用户角色

## 测试最佳实践

### 1. 测试结构

每个测试用例遵循 AAA 模式：

```typescript
it('应该做某事', async () => {
  // Arrange (Setup)
  mockPrisma.subscription.findFirst.mockResolvedValue(mockSubscription);

  // Act
  const result = await someFunction();

  // Assert
  expect(result).toBe(expected);
});
```

### 2. 清理 Mock

在每个测试前清理 Mock：

```typescript
beforeEach(() => {
  jest.clearAllMocks();
});
```

### 3. 测试隔离

每个测试应该是独立的，不依赖其他测试的状态。

### 4. 错误处理

测试应该覆盖成功和失败场景：

```typescript
it('成功场景', async () => { /* ... */ });
it('失败场景', async () => { /* ... */ });
```

## 持续集成

### GitHub Actions 示例

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test -- --coverage
```

## 故障排查

### 问题：测试失败，提示找不到模块

**解决方法**：
1. 确保安装了所有依赖
2. 检查 `jest.config.js` 中的 `moduleNameMapper` 配置
3. 确保测试文件路径正确

### 问题：Mock 不工作

**解决方法**：
1. 确保 Mock 文件在 `__mocks__` 目录中
2. 确保在测试文件顶部正确导入 Mock
3. 检查 `jest.setup.js` 中的配置

### 问题：数据库相关测试失败

**解决方法**：
1. 使用 Mock Prisma，不要连接真实数据库
2. 确保所有数据库操作都被 Mock
3. 检查事务 Mock 的实现

## 扩展测试

### 添加新测试用例

1. 在相应的测试文件中添加新的 `it` 或 `describe` 块
2. 使用现有的 Mock 数据和 Fixtures
3. 遵循 AAA 模式
4. 确保测试覆盖边界情况

### 添加新的 Mock 数据

在 `__tests__/__fixtures__/subscriptions.ts` 中添加：

```typescript
export const newMockData = {
  // ...
};
```

## 注意事项

1. **不要连接真实数据库**：所有测试都应该使用 Mock
2. **测试应该快速**：避免长时间运行的测试
3. **保持测试独立**：每个测试不应该依赖其他测试
4. **覆盖边界情况**：测试应该包括正常流程和异常流程
5. **定期更新测试**：当功能变更时，及时更新测试
