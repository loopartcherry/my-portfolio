# 角色权限系统 - 完整实现文档

## 系统概述

本系统实现了三个角色的完整工作台，每个角色都有独立的界面和功能权限：

1. **客户（Customer）** - `/dashboard`
2. **设计师（Designer）** - `/designer/*`
3. **超级管理员（Admin）** - `/admin/*`

## 文件结构

```
app/
├── dashboard/              # 客户控制台（原有功能）
│   ├── page.tsx
│   ├── projects/
│   ├── orders/
│   ├── tickets/
│   └── ...
│
├── designer/               # 设计师工作台（新增）
│   ├── dashboard/         # 工作台概览
│   ├── projects/          # 我的项目
│   ├── tasks/             # 我的任务（Kanban视图）
│   ├── files/             # 文件管理
│   ├── messages/          # 消息中心
│   ├── feedback/          # 客户反馈
│   ├── team/              # 团队协作
│   ├── time-tracking/     # 工时记录
│   ├── analytics/         # 我的统计
│   ├── profile/           # 个人资料
│   ├── settings/          # 工作偏好设置
│   └── loading.tsx
│
└── admin/                  # 超级管理员控制台（新增）
    ├── dashboard/         # 控制台概览
    ├── users/             # 用户管理
    ├── projects/          # 项目管理
    ├── orders/            # 订单管理
    ├── financials/        # 财务管理
    ├── monitoring/         # 系统监控
    ├── analytics/         # 数据统计
    ├── files/             # 文件管理
    ├── database/          # 数据库
    ├── settings/          # 系统设置
    ├── permissions/       # 权限管理
    ├── operations/        # 运营数据
    └── loading.tsx

lib/
├── types/
│   └── user.ts           # 用户角色类型和权限定义
├── auth.ts               # 权限验证逻辑
├── dashboard-nav.ts      # 客户导航配置
├── designer-nav.ts       # 设计师导航配置
└── admin-nav.ts          # 管理员导航配置

components/
└── auth/
    └── role-guard.tsx    # 角色权限守卫组件
```

## 角色权限矩阵

### 客户（Customer）
| 功能 | 权限 |
|------|------|
| 查看项目 | ✅ 仅自己的项目 |
| 创建项目 | ✅ |
| 编辑项目 | ✅ 仅自己的项目 |
| 删除项目 | ❌ |
| 查看订单 | ✅ |
| 查看财务 | ❌ |
| 上传文件 | ❌ |
| 查看其他用户 | ❌ |

### 设计师（Designer）
| 功能 | 权限 |
|------|------|
| 查看项目 | ✅ 仅分配给我的项目 |
| 创建项目 | ❌ |
| 编辑项目 | ❌ |
| 上传文件 | ✅ |
| 查看任务 | ✅ 仅分配给我的任务 |
| 更新任务状态 | ✅ |
| 记录工时 | ✅ |
| 查看统计 | ✅ 仅自己的数据 |
| 查看订单 | ❌ |
| 查看财务 | ❌ |

### 超级管理员（Admin）
| 功能 | 权限 |
|------|------|
| 查看项目 | ✅ 全部项目 |
| 创建项目 | ✅ |
| 编辑项目 | ✅ |
| 删除项目 | ✅ |
| 用户管理 | ✅ |
| 订单管理 | ✅ |
| 财务管理 | ✅ |
| 系统设置 | ✅ |
| 数据统计 | ✅ 全部数据 |

## 交互闭环

### 1. 客户工作流
```
登录 → /dashboard
  ├─ 创建项目 → /dashboard/projects/new
  ├─ 查看项目 → /dashboard/projects
  ├─ 提交工单 → /dashboard/tickets
  └─ 查看订单 → /dashboard/orders
```

### 2. 设计师工作流
```
登录 → /designer/dashboard
  ├─ 查看分配的项目 → /designer/projects
  ├─ 查看任务列表 → /designer/tasks (Kanban视图)
  │   ├─ 开始工作 → 启动计时器
  │   ├─ 上传文件 → /designer/files
  │   └─ 更新任务状态
  ├─ 记录工时 → /designer/time-tracking
  ├─ 查看客户反馈 → /designer/feedback
  │   └─ 回复反馈 → 更新项目状态
  ├─ 查看消息 → /designer/messages
  └─ 查看统计 → /designer/analytics
```

### 3. 管理员工作流
```
登录 → /admin/dashboard
  ├─ 用户管理 → /admin/users
  │   ├─ 创建用户（客户/设计师）
  │   ├─ 编辑用户信息
  │   └─ 设置用户权限
  ├─ 项目管理 → /admin/projects
  │   ├─ 创建项目
  │   ├─ 分配设计师
  │   └─ 查看所有项目状态
  ├─ 订单管理 → /admin/orders
  │   ├─ 处理订单
  │   └─ 退款处理
  ├─ 财务管理 → /admin/financials
  │   ├─ 查看营收数据
  │   └─ 导出财务报表
  └─ 系统监控 → /admin/monitoring
      └─ 查看系统健康状态
```

## 数据流转

### 项目创建流程
```
客户创建项目
  ↓
管理员审核/分配设计师
  ↓
设计师接收任务（出现在 /designer/tasks）
  ↓
设计师开始工作 → 记录工时
  ↓
设计师上传设计文件 → /designer/files
  ↓
客户查看项目进度 → /dashboard/projects/[id]
  ↓
客户提交反馈 → /designer/feedback
  ↓
设计师处理反馈 → 更新项目
  ↓
项目完成
```

### 权限验证流程
```
用户访问路由
  ↓
RoleGuard 检查 allowedRoles
  ↓
检查路由访问权限 (canAccessRoute)
  ↓
数据查询时根据角色过滤
  ↓
UI 根据权限显示/隐藏功能
```

## 关键功能点

### 设计师工作台
- ✅ 工作台概览：今日待办、进行中项目、本周工时统计
- ✅ 项目管理：只能查看分配的项目，支持网格/列表视图
- ✅ 任务管理：Kanban视图，支持拖拽排序
- ✅ 文件管理：上传、预览、版本管理
- ✅ 工时记录：计时器、日历视图、统计报表
- ✅ 客户反馈：及时处理客户反馈
- ✅ 消息中心：系统通知、项目消息、团队消息
- ✅ 团队协作：查看团队成员状态和动态
- ✅ 个人统计：工时统计、项目统计、排名
- ✅ 个人资料：基本信息、账户安全
- ✅ 工作偏好：通知设置、工作时间、界面设置

### 管理员控制台
- ✅ 控制台概览：系统状态、用户统计、项目统计、营收数据
- ✅ 用户管理：创建/编辑/删除用户，设置角色和权限
- ✅ 项目管理：查看所有项目，分配设计师，管理项目状态
- ✅ 订单管理：处理订单、退款、导出订单
- ✅ 财务管理：营收统计、收入构成、财务报表
- ✅ 系统监控：服务器状态、数据库、存储空间、API响应
- ✅ 数据统计：用户增长、项目统计、营收趋势
- ✅ 系统设置：系统配置、权限管理

## 设计规范

### 颜色方案
- **客户控制台**：深色主题 `bg-[#0a0a0f]`
- **设计师工作台**：浅色主题 `bg-gray-50`
- **管理员控制台**：深色主题 `bg-[#0a0a0f]`

### 导航宽度
- 所有角色统一：240px（`w-60`）

### 响应式
- 桌面：完整侧边栏
- 平板：侧边栏可折叠
- 移动：底部导航

## 使用示例

### 设置用户角色
```typescript
import { setCurrentUserRole } from "@/lib/auth";

// 在登录后设置
setCurrentUserRole("designer"); // 或 "admin" / "customer"
```

### 保护路由
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

### 检查权限
```tsx
import { checkPermission } from "@/lib/auth";

if (checkPermission("uploadFile")) {
  // 显示上传按钮
}
```

## 注意事项

1. **权限隔离**：确保数据根据角色正确过滤
2. **路由保护**：所有敏感路由都应使用 RoleGuard
3. **数据安全**：后端API也应验证权限
4. **UI一致性**：保持各角色工作台的UI风格一致
5. **导航同步**：确保导航配置在所有页面保持一致

## 待完善功能

- [ ] 实际的数据API集成
- [ ] 文件上传功能实现
- [ ] 实时通知系统
- [ ] 工时记录的实际保存
- [ ] 项目分配逻辑
- [ ] 权限管理的完整实现
