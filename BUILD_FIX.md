# 构建问题修复说明

## 问题

在构建时遇到 Prisma 客户端初始化错误：
```
Error [PrismaClientConstructorValidationError]: Using engine type "client" requires either "adapter" or "accelerateUrl" to be provided to PrismaClient constructor.
```

## 解决方案

### 方案 1: 配置 DATABASE_URL（推荐）

在 `.env` 或 `.env.local` 文件中添加：

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
```

### 方案 2: 使用环境变量占位符

在构建时，可以设置一个占位符 URL：

```bash
DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder"
```

### 方案 3: 修改 Next.js 配置（不推荐）

如果确实需要在没有数据库的情况下构建，可以修改 `next.config.ts`：

```typescript
const nextConfig: NextConfig = {
  // 跳过 API 路由的静态生成
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};
```

## 当前状态

所有代码修复已完成：
- ✅ 修复了价格可能为 null 的类型错误
- ✅ 添加了价格验证逻辑
- ✅ 修复了 subscribe 路由中的价格使用
- ✅ 修复了 upgrade 路由中的价格使用
- ✅ 修复了 subscription.service.ts 中的所有价格相关错误

## 下一步

1. 创建 `.env.local` 文件并添加 `DATABASE_URL`
2. 运行 `npx prisma generate` 生成 Prisma 客户端
3. 运行 `npm run build` 验证构建成功
