# 线上部署说明

## 环境变量（必配）

在 **Vercel** 项目 → **Settings** → **Environment Variables** 中配置：

| 变量名 | 说明 |
|--------|------|
| `DATABASE_URL` | PostgreSQL 连接串（**Supabase 必须用下方「连接池」地址**） |

---

## Supabase 在 Vercel 上的正确配置（避免「服务暂时不可用」）

Vercel 是 **Serverless**，每次请求可能新建数据库连接。Supabase **直连（5432）** 连接数有限，容易报错，必须用 **连接池（6543）**。

### 步骤

1. 打开 **Supabase Dashboard** → 你的项目 → **Project Settings**（左下齿轮）→ **Database**。
2. 找到 **Connection pooling** 区域，选择 **Session mode**（或 Transaction mode）。
3. 复制 **Connection string** 里的 **URI**，格式类似：
   ```text
   postgresql://postgres.[项目ref]:[你的数据库密码]@aws-0-[区域].pooler.supabase.com:6543/postgres
   ```
4. 在 **Vercel** → **Settings** → **Environment Variables** 中：
   - **Name**: `DATABASE_URL`
   - **Value**: 粘贴上面复制的 URI（**不要用** “Direct connection” 的 5432 地址）
   - **Environments**: 勾选 Production（以及 Preview 如需要）
5. 保存后，在 **Deployments** 里对当前项目点 **Redeploy**，使新环境变量生效。

### 说明

- 代码已对 Supabase 地址自动追加 `sslmode=require`，一般无需在 URI 里再写。
- 若仍出现「服务暂时不可用，请稍后重试」，请确认：
  - 使用的是 **Connection pooling** 的 URI（端口 **6543**），不是直连 5432；
  - 密码无误、未含特殊字符未编码问题；
  - 已 Redeploy 且部署完成后再测试登录/诊断。

配置正确后，登录、注册、诊断提交会正常连上数据库并执行。
