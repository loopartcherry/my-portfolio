# 订阅 API 安装说明

## 1. 安装依赖

运行以下命令安装必要的依赖：

```bash
npm install @prisma/client zod
npm install -D prisma
```

## 2. 初始化 Prisma（如果尚未初始化）

```bash
npx prisma init
```

## 3. 配置 Prisma Schema

在 `prisma/schema.prisma` 中添加订阅相关的模型（参考 `SUBSCRIPTION_API_README.md` 中的数据模型要求）。

## 4. 生成 Prisma Client

```bash
npx prisma generate
```

## 5. 运行数据库迁移

```bash
npx prisma migrate dev --name add_subscriptions
```

## 6. 配置环境变量

在 `.env` 文件中添加数据库连接字符串：

```
DATABASE_URL="your_database_url"
```

## 7. 更新认证系统

当前实现使用模拟认证，实际部署时需要：

1. 集成真实的认证系统（如 NextAuth.js）
2. 更新 `lib/api/auth.ts` 中的 `getCurrentUserId` 函数
3. 确保请求头中包含用户ID或从 session 中获取

## 8. 集成支付网关

在以下文件中添加支付集成：

1. `app/api/subscriptions/subscribe/route.ts` - 生成支付链接
2. `app/api/subscriptions/upgrade/route.ts` - 生成支付链接
3. `app/api/subscriptions/renew-callback/route.ts` - 验证支付签名

## 完成

完成以上步骤后，所有订阅 API 接口即可正常使用。
