# 线上部署说明

## 环境变量（必配）

在 **Vercel** 项目 → **Settings** → **Environment Variables** 中配置：

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `DATABASE_URL` | PostgreSQL 连接串（Supabase/其他） | `postgresql://postgres:密码@db.xxx.supabase.co:5432/postgres` |

- 使用 **Supabase** 时，在 Supabase Dashboard → **Project Settings** → **Database** 复制 **Connection string (URI)**。
- 未配置 `DATABASE_URL` 时，登录、注册、诊断提交等会返回「服务暂时不可用，请稍后重试」。

配置后重新部署（或触发一次空提交）使环境变量生效。
