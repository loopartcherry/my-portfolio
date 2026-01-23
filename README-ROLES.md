# 角色权限系统说明

## 概述

本系统实现了三个角色的完整工作台：
- **客户（Customer）**：`/dashboard` - 原有的客户控制台
- **设计师（Designer）**：`/designer/dashboard` - 设计师工作台
- **超级管理员（Admin）**：`/admin/dashboard` - 管理后台

## 角色权限

### 客户（Customer）
- ✅ 查看自己的项目
- ✅ 创建项目
- ✅ 编辑自己的项目
- ✅ 查看订单
- ❌ 无法访问财务敏感信息
- ❌ 无法查看其他用户的项目

### 设计师（Designer）
- ✅ 查看分配给自己的项目
- ✅ 上传/更新设计文件
- ✅ 查看项目需求和客户反馈
- ✅ 记录工时
- ✅ 查看自己的统计数据
- ❌ 无法访问财务、订单等敏感信息
- ❌ 无法查看未分配的项目

### 超级管理员（Admin）
- ✅ 完整的数据访问权限
- ✅ 用户管理（创建/编辑/删除）
- ✅ 项目管理（全部项目）
- ✅ 订单和财务管理
- ✅ 系统设置和配置
- ✅ 数据分析和报表

## 文件结构

```
app/
├── dashboard/          # 客户控制台（原有）
├── designer/           # 设计师工作台
│   ├── dashboard/     # 工作台概览
│   ├── projects/      # 我的项目
│   ├── tasks/         # 我的任务
│   ├── files/         # 文件管理
│   ├── messages/      # 消息中心
│   ├── feedback/      # 客户反馈
│   ├── team/          # 团队协作
│   ├── time-tracking/ # 工时记录
│   ├── analytics/     # 我的统计
│   ├── profile/       # 个人资料
│   └── settings/      # 工作偏好
└── admin/             # 超级管理员控制台
    ├── dashboard/     # 控制台概览
    ├── users/         # 用户管理
    ├── projects/     # 项目管理
    ├── orders/        # 订单管理
    ├── financials/    # 财务管理
    ├── monitoring/    # 系统监控
    ├── analytics/     # 数据统计
    ├── files/         # 文件管理
    ├── database/      # 数据库
    ├── settings/      # 系统设置
    ├── permissions/    # 权限管理
    └── operations/    # 运营数据

lib/
├── types/
│   └── user.ts        # 用户角色类型和权限定义
├── auth.ts            # 权限验证逻辑
├── dashboard-nav.ts   # 客户导航配置
├── designer-nav.ts    # 设计师导航配置
└── admin-nav.ts       # 管理员导航配置

components/
└── auth/
    └── role-guard.tsx # 角色权限守卫组件
```

## 使用方式

### 1. 设置用户角色

在 `lib/auth.ts` 中设置当前用户角色：

```typescript
import { setCurrentUserRole } from "@/lib/auth";

// 设置为设计师
setCurrentUserRole("designer");

// 设置为管理员
setCurrentUserRole("admin");

// 设置为客户
setCurrentUserRole("customer");
```

### 2. 使用权限守卫

在页面中使用 `RoleGuard` 组件保护路由：

```tsx
import { RoleGuard } from "@/components/auth/role-guard";

export default function DesignerPage() {
  return (
    <RoleGuard allowedRoles={["designer", "admin"]}>
      {/* 页面内容 */}
    </RoleGuard>
  );
}
```

### 3. 检查权限

在组件中检查权限：

```tsx
import { checkPermission } from "@/lib/auth";

if (checkPermission("uploadFile")) {
  // 允许上传文件
}
```

## 交互闭环

### 设计师工作流
1. 登录 → `/designer/dashboard` 查看工作概览
2. 查看分配的项目 → `/designer/projects`
3. 查看任务列表 → `/designer/tasks`
4. 开始工作 → 点击"开始工作"按钮
5. 上传设计文件 → `/designer/files`
6. 记录工时 → `/designer/time-tracking`
7. 查看客户反馈 → `/designer/feedback`
8. 回复消息 → `/designer/messages`

### 管理员工作流
1. 登录 → `/admin/dashboard` 查看系统概览
2. 管理用户 → `/admin/users` 创建/编辑/删除用户
3. 管理项目 → `/admin/projects` 查看所有项目
4. 管理订单 → `/admin/orders` 处理订单
5. 查看财务 → `/admin/financials` 财务数据
6. 系统监控 → `/admin/monitoring` 系统状态
7. 数据分析 → `/admin/analytics` 数据报表

### 客户工作流（原有）
1. 登录 → `/dashboard` 查看控制台
2. 创建项目 → `/dashboard/projects/new`
3. 查看项目 → `/dashboard/projects`
4. 查看订单 → `/dashboard/orders`
5. 提交工单 → `/dashboard/tickets`

## 设计规范

### 颜色方案
- **客户控制台**：深色主题（`bg-[#0a0a0f]`）
- **设计师工作台**：浅色主题（`bg-gray-50`）
- **管理员控制台**：深色主题（`bg-[#0a0a0f]`）

### 导航结构
- 所有角色都有统一的左侧导航栏
- 导航宽度：240px（设计师）/ 240px（管理员）
- 导航项根据角色权限动态显示

### 响应式设计
- 桌面端：显示完整侧边栏
- 平板端：侧边栏可折叠
- 移动端：底部导航栏

## 注意事项

1. **权限隔离**：确保角色之间数据隔离
2. **路由保护**：使用 `RoleGuard` 保护敏感路由
3. **数据过滤**：在数据查询时根据角色过滤
4. **UI一致性**：保持各角色工作台的UI风格一致
