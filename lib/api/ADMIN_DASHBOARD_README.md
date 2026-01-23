# 管理员控制台完整文档

## 概述

实现了完整的管理员控制台，确保管理员能看到系统中的一切数据并进行管理。

## 功能模块

### 1. 数据总览 (`/admin/overview`)

**统计指标：**
- 今日订单总额（已支付订单）
- 新增用户数（今日注册）
- 进行中的项目数（状态为 ASSIGNED、IN_PROGRESS、REVIEW）
- 总用户数、活跃用户数
- 总项目数、总订单数
- 本月营收、营收增长率

**数据来源：**
- API: `GET /api/admin/stats`
- 实时数据，非 mock

**显示内容：**
- 最近注册用户列表
- 最近项目列表
- 系统健康状态

### 2. 订单管理 (`/admin/orders`)

**功能：**
- 查看所有订单（商城订单 + 订阅订单）
- 按状态筛选（paid, pending, failed, cancelled, refunded）
- 按类型筛选（template, subscription, upgrade, renewal）
- 搜索订单（订单ID、客户姓名、邮箱）
- 分页显示

**订单类型：**
- **模板购买** (`template`): 显示模板名称
- **订阅** (`subscription`): 显示订阅套餐
- **升级** (`upgrade`): 订阅升级订单
- **续费** (`renewal`): 订阅续费订单

**数据来源：**
- API: `GET /api/admin/orders?status=paid&type=template&page=1&limit=20`

**显示信息：**
- 订单编号、客户信息
- 订单类型、商品/服务名称
- 金额、支付状态、创建时间
- 操作菜单（查看详情、下载发票、退款处理）

### 3. 项目看板 (`/admin/projects/kanban`)

**功能：**
- Kanban 看板视图，5个状态列：
  - 待分配 (PENDING)
  - 已分配 (ASSIGNED)
  - 设计中 (IN_PROGRESS)
  - 待验收 (REVIEW)
  - 已完成 (COMPLETED)
- 拖拽项目卡片改变状态
- 分配设计师（待分配项目）
- 创建子任务
- 查看项目详情

**交互功能：**
- **拖拽更新状态**：拖拽项目卡片到不同列，自动更新状态
- **分配设计师**：点击"分配设计师"，选择设计师并分配
- **创建子任务**：为项目创建子任务，分配给设计师
- **查看详情**：点击项目卡片查看详细信息

**数据来源：**
- API: `GET /api/admin/projects`
- API: `PATCH /api/admin/projects/[id]/status`
- API: `POST /api/admin/projects/[id]/tasks`
- API: `POST /api/admin/designers/[id]/assign-project`

### 4. 项目管理 (`/admin/projects`)

**功能：**
- 列表视图和网格视图切换
- 按状态筛选
- 按优先级筛选
- 搜索项目
- 查看项目详情、编辑项目

**数据来源：**
- API: `GET /api/admin/projects?status=IN_PROGRESS&priority=high`

### 5. 用户管理 (`/admin/users`)

**功能：**
- 查看所有用户（客户、设计师、管理员）
- 按角色筛选
- 搜索用户（姓名、邮箱）
- **创建用户**：打开创建对话框，支持创建 CLIENT、DESIGNER、ADMIN
- **禁用/启用设计师账号**：通过下拉菜单操作
- **查看客户活跃度**：显示项目数、订单数
- 分页显示

**活跃度指标：**
- 项目数：用户创建的项目数量
- 订单数：用户的订单数量
- 设计师负载：当前负载/最大容量

**数据来源：**
- API: `GET /api/admin/users?role=designer&page=1&limit=20`
- API: `PATCH /api/admin/users/[id]/status`

**操作：**
- 编辑用户
- 禁用/启用账号（仅设计师）
- 删除用户

## API 端点

### 统计数据

**GET** `/api/admin/stats`

返回：
```json
{
  "success": true,
  "data": {
    "todayOrderAmount": 1234.56,
    "newUsersToday": 5,
    "activeProjectsCount": 12,
    "totalUsers": 156,
    "activeUsers": 128,
    "totalProjects": 45,
    "totalOrders": 234,
    "pendingOrders": 8,
    "monthlyRevenue": 1256800,
    "revenueGrowth": 12.5
  }
}
```

### 订单管理

**GET** `/api/admin/orders?status=paid&type=template&page=1&limit=20`

返回订单列表，包含用户信息、模板信息、订阅信息。

### 项目管理

**GET** `/api/admin/projects?status=IN_PROGRESS&priority=high`

返回项目列表，包含用户信息、设计师信息。

**PATCH** `/api/admin/projects/[id]/status`

更新项目状态：
```json
{
  "status": "IN_PROGRESS",
  "completionRate": 50
}
```

### 子任务管理

**POST** `/api/admin/projects/[id]/tasks`

创建子任务：
```json
{
  "name": "Logo设计初稿",
  "description": "完成Logo初稿设计",
  "assignedToUserId": "designer_123",
  "priority": "high",
  "estimatedHours": 8,
  "dueDate": "2024-02-01"
}
```

**GET** `/api/admin/projects/[id]/tasks`

获取项目的所有子任务。

**PATCH** `/api/admin/projects/[id]/tasks/[taskId]`

更新子任务：
```json
{
  "status": "in_progress",
  "completionRate": 50,
  "actualHours": 4
}
```

**DELETE** `/api/admin/projects/[id]/tasks/[taskId]`

删除子任务。

### 用户管理

**GET** `/api/admin/users?role=designer&page=1&limit=20`

返回用户列表，包含设计师信息、项目数、订单数。

**PATCH** `/api/admin/users/[id]/status`

更新用户状态（禁用/启用）：
```json
{
  "status": "inactive" // "active" | "inactive" | "suspended"
}
```

## 数据模型扩展

### ProjectTask（项目子任务）

```prisma
model ProjectTask {
  id              String   @id @default(cuid())
  projectId       String
  name            String
  description     String?
  status          String   @default("todo") // 'todo' | 'in_progress' | 'review' | 'completed' | 'cancelled'
  assignedToUserId String?
  priority        String   @default("medium")
  estimatedHours  Float?
  actualHours     Float?
  completionRate  Float?   @default(0)
  dueDate         DateTime?
  completedAt     DateTime?
  createdById     String?
}
```

### Project 模型扩展

已添加字段：
- `description` - 项目描述
- `attachments` - 附件（JSON）
- `priority` - 优先级
- `deliveryLink` - 交付物链接
- `deliveredAt` - 交付时间
- `reviewedAt` - 验收时间

## 页面路由

- `/admin/overview` - 数据总览
- `/admin/orders` - 订单管理
- `/admin/projects` - 项目管理（列表/网格视图）
- `/admin/projects/kanban` - 项目看板（Kanban视图）
- `/admin/users` - 用户管理

## 数据库迁移

运行以下命令更新数据库：

```bash
npx prisma migrate dev --name add_project_tasks_and_extensions
npx prisma generate
```

## 使用说明

### 项目看板使用

1. **查看项目**：所有项目按状态分组显示在对应列中
2. **更新状态**：拖拽项目卡片到目标状态列
3. **分配设计师**：
   - 点击待分配项目的"分配设计师"
   - 选择设计师（显示当前负载）
   - 确认分配
4. **创建子任务**：
   - 点击"创建子任务"按钮
   - 填写任务信息
   - 选择分配的设计师
   - 设置优先级和截止日期

### 用户管理使用

1. **创建用户**：点击"创建用户"按钮，填写信息
2. **禁用设计师**：在设计师行的操作菜单中点击"禁用账号"
3. **查看活跃度**：查看"活跃度"列的项目数和订单数

## 注意事项

1. **权限控制**：所有API端点都需要管理员权限
2. **状态更新**：项目状态更新会自动记录时间戳
3. **设计师负载**：分配项目时会检查设计师负载和休假状态
4. **子任务**：子任务可以独立管理，不影响主项目状态
