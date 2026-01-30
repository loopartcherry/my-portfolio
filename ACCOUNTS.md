# 控制台测试账号 / Console Test Accounts

运行 `npm run db:seed` 后可使用以下账号登录（登录页 `/login` 使用邮箱+密码）：

| 角色 | 邮箱 | 密码 | 登录后入口 |
|------|------|------|------------|
| **超级管理员** | admin@test.com | password123 | `/admin/overview` |
| **设计师** | designer@test.com | password123 | `/designer/overview` |
| **用户（客户）** | client@test.com | password123 | `/dashboard/overview` |

## 首次使用

### 方式一：一键启动 DB + 同步 schema + seed（推荐）

需要本地已安装 Docker。执行：

```bash
npm run db:up
```

脚本会：启动 Docker 中的 Postgres → 等待就绪 → `prisma db push` 同步表结构 → 执行 seed 创建账号。  
完成后将终端输出的 `DATABASE_URL` 写入项目根目录的 `.env` 或 `.env.local`，例如：

```bash
DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:5432/myportfolio"
```

### 方式二：已有数据库时仅迁移 + seed

```bash
npx prisma migrate dev   # 如有新迁移
npm run db:seed          # 创建上述三个账号
```

2. 打开 `/login`，使用上表任一邮箱和密码登录。
3. 登录成功后会自动跳转到对应控制台（管理员→admin，设计师→designer，用户→dashboard）。

详见 `prisma/SEED_README.md`。
