# 认证和路由守卫系统

## 概述

实现了基于角色的路由守卫和用户认证系统，支持 CLIENT、DESIGNER、ADMIN 三种角色。

## 核心组件

### 1. Session 管理 (`lib/session.ts`)

使用 HTTP-only Cookie 存储用户会话信息：

```typescript
interface SessionData {
  userId: string;
  email: string;
  role: UserRole;
  name?: string;
}
```

**函数：**
- `createSession(data)` - 创建 session
- `getSession()` - 获取 session（服务端组件）
- `getSessionFromRequest(request)` - 从请求获取 session（API 路由）
- `deleteSession()` - 删除 session

### 2. Middleware (`middleware.ts`)

Next.js 中间件，实现路由守卫：

**功能：**
- 未登录用户访问受保护路由 → 重定向到 `/login?redirect=原路径`
- 已登录用户访问登录/注册页 → 重定向到对应 dashboard
- 角色权限检查：
  - CLIENT → 只能访问 `/dashboard/*`
  - DESIGNER → 只能访问 `/designer/*`
  - ADMIN → 可以访问 `/admin/*`、`/dashboard/*`、`/designer/*`

**公开路由：**
- `/`, `/login`, `/register`
- `/about`, `/methodology`, `/insights`, `/portfolio`, `/pricing`, `/diagnosis`, `/cart`, `/shop`
- `/api/auth/login`, `/api/auth/register`

### 3. 认证 API

#### POST `/api/auth/login`
用户登录

**请求体：**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**响应：**
```json
{
  "success": true,
  "data": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "用户名",
    "role": "client"
  }
}
```

#### POST `/api/auth/register`
用户注册（仅限 CLIENT 角色）

**请求体：**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "用户名",
  "phone": "13800138000"
}
```

#### POST `/api/auth/logout`
用户登出

#### GET `/api/auth/me`
获取当前登录用户信息

### 4. 管理员创建用户 API

#### POST `/api/admin/users`
管理员创建用户（DESIGNER 或 ADMIN）

**权限：** 仅 ADMIN

**请求体：**
```json
{
  "email": "designer@example.com",
  "password": "password123", // 可选，留空则自动生成
  "name": "设计师",
  "phone": "13800138000",
  "role": "designer",
  "specialties": ["Logo设计", "VI系统"], // 仅 designer 需要
  "hourlyRate": 200, // 仅 designer 需要
  "maxCapacity": 5 // 仅 designer 需要
}
```

**功能：**
- 如果未提供密码，自动生成 8 位随机密码
- 如果角色是 `designer`，自动创建 Designer 档案
- 返回创建的用户信息（不包含密码）

## 路由规则

### CLIENT 角色
- ✅ `/dashboard/*` - 客户控制台
- ❌ `/designer/*` - 无权限
- ❌ `/admin/*` - 无权限

### DESIGNER 角色
- ✅ `/designer/*` - 设计师控制台
- ❌ `/dashboard/*` - 无权限（除非是公开路由）
- ❌ `/admin/*` - 无权限

### ADMIN 角色
- ✅ `/admin/*` - 管理员控制台
- ✅ `/dashboard/*` - 可以访问客户功能
- ✅ `/designer/*` - 可以访问设计师功能

## 账号创建规则

1. **CLIENT（客户）**：
   - ✅ 可以通过 `/register` 页面自主注册
   - ✅ 使用 `/api/auth/register` API

2. **DESIGNER（设计师）**：
   - ❌ 不能自主注册
   - ✅ 只能由 ADMIN 在后台"用户管理"中创建
   - ✅ 使用 `/api/admin/users` API（role: "designer"）
   - ✅ 自动创建 Designer 档案

3. **ADMIN（管理员）**：
   - ❌ 不能自主注册
   - ✅ 只能由 ADMIN 在后台"用户管理"中创建
   - ✅ 使用 `/api/admin/users` API（role: "admin"）

## 使用示例

### 前端登录

```typescript
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123',
  }),
});

const data = await response.json();
if (data.success) {
  // 登录成功，middleware 会自动重定向
  router.push('/dashboard/overview');
}
```

### 前端注册（仅 CLIENT）

```typescript
const response = await fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    email: 'client@example.com',
    password: 'password123',
    name: '客户名称',
  }),
});
```

### 管理员创建用户

```typescript
const response = await fetch('/api/admin/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    email: 'designer@example.com',
    password: 'password123', // 可选
    name: '设计师',
    role: 'designer',
    specialties: ['Logo设计'],
    hourlyRate: 200,
    maxCapacity: 5,
  }),
});
```

## 安全注意事项

1. **密码加密**：所有密码使用 bcrypt 加密（10 轮）
2. **Session Cookie**：
   - `httpOnly: true` - 防止 XSS 攻击
   - `secure: true` (生产环境) - 仅 HTTPS
   - `sameSite: 'lax'` - CSRF 保护
   - 有效期：7 天

3. **路由保护**：Middleware 在服务端执行，无法绕过

4. **API 权限**：所有受保护的 API 使用 `requireAuth`、`requireRole`、`requireAdmin` 等函数验证

## 文件结构

```
lib/
├── session.ts              # Session 管理
├── auth.ts                 # 认证工具函数（客户端）
└── api/
    ├── auth.ts            # API 认证工具（服务端）
    ├── auth-validation.ts # 登录/注册验证
    └── user-validation.ts # 创建用户验证

app/api/auth/
├── login/route.ts         # 登录 API
├── register/route.ts      # 注册 API
├── logout/route.ts        # 登出 API
└── me/route.ts            # 获取当前用户 API

app/api/admin/users/
└── route.ts               # 管理员创建用户 API

middleware.ts              # Next.js 路由守卫
```

## 测试账号

运行 `npm run db:seed` 后，可以使用以下测试账号：

- 管理员: `admin@test.com` / `password123`
- 设计师: `designer@test.com` / `password123`
- 客户: `client@test.com` / `password123`
