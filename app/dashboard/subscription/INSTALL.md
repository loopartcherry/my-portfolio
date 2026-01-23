# 快速安装指南

## 步骤 1: 安装 React Query

```bash
npm install @tanstack/react-query
```

## 步骤 2: 配置 QueryClientProvider

在 `app/layout.tsx` 中添加：

```typescript
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { Toaster } from 'sonner';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        retry: 1,
      },
    },
  }));

  return (
    <html lang="zh-CN">
      <body>
        <QueryClientProvider client={queryClient}>
          {children}
          <Toaster position="top-right" />
        </QueryClientProvider>
      </body>
    </html>
  );
}
```

## 步骤 3: 验证安装

访问以下页面验证是否正常工作：

- `/dashboard/subscriptions/upgrade?planId=xxx` - 升级页面
- `/dashboard/subscriptions/renew` - 续费页面

## 如果不想使用 React Query

如果暂时不想安装 React Query，可以：

1. 修改页面中的 imports，使用备用 hooks：
   ```typescript
   // 从
   import { useCurrentSubscription } from '@/hooks/use-subscription';
   // 改为
   import { useCurrentSubscriptionFallback as useCurrentSubscription } from '@/hooks/use-subscription-fallback';
   ```

2. 手动管理状态和错误处理

## 完成！

安装完成后，所有订阅管理页面即可正常使用。
