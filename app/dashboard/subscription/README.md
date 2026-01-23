# 订阅管理页面说明

## 已创建的页面

### 1. 升级确认页面
**路径**: `/dashboard/subscriptions/upgrade`

**功能**:
- 显示当前套餐 vs 新套餐对比
- 计算升级差价（按比例）
- 显示权益对比表
- 确认升级操作

**使用方式**:
```typescript
// 从订阅页面跳转到升级页面
router.push(`/dashboard/subscriptions/upgrade?planId=${planId}`);
```

### 2. 续费管理页面
**路径**: `/dashboard/subscriptions/renew`

**功能**:
- 显示当前订阅信息
- 显示过期日期和剩余天数
- 自动续费开关
- 续费历史记录表格
- 立即续费按钮

## 安装依赖

### 1. 安装 React Query

```bash
npm install @tanstack/react-query
```

### 2. 配置 QueryClientProvider

在 `app/layout.tsx` 中添加 QueryClientProvider：

```typescript
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1分钟
        retry: 1,
      },
    },
  }));

  return (
    <html lang="zh-CN">
      <body>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </body>
    </html>
  );
}
```

### 3. 安装 Toast 组件（如果未安装）

项目已包含 `sonner`，确保正确配置：

```typescript
// app/layout.tsx 中添加
import { Toaster } from 'sonner';

// 在 body 中添加
<Toaster position="top-right" />
```

## Hooks 说明

### use-subscription.ts

数据获取相关的 hooks：

- `useCurrentSubscription()` - 获取当前订阅信息
- `useSubscriptionPlans()` - 获取所有可用套餐
- `useSubscriptionUsage()` - 获取额度使用情况
- `useSubscriptionHistory(page, limit)` - 获取订阅历史

### use-subscription-actions.ts

操作相关的 hooks：

- `useSubscribeAction()` - 订阅套餐
- `useUpgradeAction()` - 升级套餐
- `useCancelSubscription()` - 取消订阅
- `useRenewSubscription()` - 续费订阅

## 页面特性

### 1. 响应式设计
- Mobile-first 设计
- 适配各种屏幕尺寸
- 使用 Tailwind CSS 响应式类

### 2. 加载状态
- 使用 Skeleton 组件显示加载状态
- 所有数据获取都有加载提示

### 3. 错误处理
- 统一的错误提示
- 友好的错误信息
- 重试机制

### 4. 交互反馈
- Toast 提示成功/失败
- 确认对话框（重要操作）
- 按钮加载状态

### 5. 可访问性
- 语义化 HTML
- ARIA 标签
- 键盘导航支持

## 使用示例

### 从订阅页面跳转到升级页面

```typescript
// 在订阅页面中
import { useRouter } from 'next/navigation';

const router = useRouter();

const handleUpgrade = (planId: string) => {
  router.push(`/dashboard/subscriptions/upgrade?planId=${planId}`);
};
```

### 在组件中使用 hooks

```typescript
'use client';

import { useCurrentSubscription } from '@/hooks/use-subscription';
import { useUpgradeAction } from '@/hooks/use-subscription-actions';

export function SubscriptionCard() {
  const { data, isLoading, error } = useCurrentSubscription();
  const upgradeMutation = useUpgradeAction();

  if (isLoading) return <div>加载中...</div>;
  if (error) return <div>加载失败</div>;

  const handleUpgrade = () => {
    upgradeMutation.mutate({ planId: 'plan_123' });
  };

  return (
    <div>
      <h2>{data?.plan?.name}</h2>
      <button onClick={handleUpgrade}>升级</button>
    </div>
  );
}
```

## 样式说明

所有页面使用统一的样式系统：

- **背景色**: `bg-[#0a0a0f]` (主背景), `bg-[#12121a]` (卡片背景)
- **文字颜色**: `text-white/90` (主文字), `text-white/60` (次要文字)
- **边框**: `border-white/5` (卡片边框), `border-white/10` (分隔线)
- **主色**: `text-primary`, `bg-primary` (使用 CSS 变量)

## 注意事项

1. **认证**: 所有 API 调用都需要包含 `credentials: 'include'` 以传递认证信息
2. **错误处理**: 所有 hooks 都包含错误处理，但建议在组件中也添加错误边界
3. **数据刷新**: 操作成功后会自动刷新相关数据（通过 `queryClient.invalidateQueries`）
4. **支付跳转**: 订阅/升级/续费成功后会自动跳转到支付页面

## 待完善功能

1. **自动续费 API**: 当前自动续费开关只是 UI 状态，需要实现实际的 API 调用
2. **支付集成**: 支付链接需要根据实际支付网关进行配置
3. **邮件通知**: 续费成功后的邮件通知功能
4. **折扣显示**: 续费折扣的计算和显示

## 故障排查

### 问题：数据加载失败

**可能原因**:
- API 端点未正确配置
- 认证信息未传递
- 网络错误

**解决方法**:
1. 检查浏览器控制台的网络请求
2. 确认 API 端点返回正确的数据格式
3. 检查认证中间件是否正确配置

### 问题：React Query 未工作

**可能原因**:
- 未安装 `@tanstack/react-query`
- 未配置 `QueryClientProvider`

**解决方法**:
1. 运行 `npm install @tanstack/react-query`
2. 在 `app/layout.tsx` 中添加 `QueryClientProvider`

### 问题：Toast 未显示

**可能原因**:
- 未安装 `sonner`
- 未添加 `Toaster` 组件

**解决方法**:
1. 运行 `npm install sonner`
2. 在 `app/layout.tsx` 中添加 `<Toaster />`
