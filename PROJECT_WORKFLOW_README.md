# 设计服务订阅闭环流程 - 实现文档

## 概述

已完成设计服务订阅闭环流程的核心功能，包括项目状态机、创建项目 API、分配功能、交付功能和验收功能。

## 流程说明

```
订阅付费 → 创建项目 → 分配设计师 → 交付 → 客户验收
   ↓          ↓           ↓          ↓        ↓
订阅验证    PENDING    ASSIGNED   REVIEW   COMPLETED
```

## 已完成功能

### 1. 数据库模型更新 ✅

**文件**: `prisma/schema.prisma`

已更新 `Project` 模型，添加以下字段：
- `description`: 项目描述
- `attachments`: 附件（JSON 数组）
- `priority`: 优先级（'low' | 'medium' | 'high' | 'urgent'）
- `deliveryLink`: 交付物链接
- `deliveredAt`: 交付时间
- `reviewedAt`: 验收时间
- `status`: 项目状态（默认 'PENDING'）

**注意**: 需要运行数据库迁移：
```bash
npx prisma migrate dev --name add_project_fields
```

### 2. 项目状态机 ✅

**文件**: `lib/services/project-status.ts`

实现了完整的状态机逻辑：

**状态流转图**:
```
PENDING → ASSIGNED → IN_PROGRESS → REVIEW → COMPLETED
   ↓                                    ↓
CANCELLED                          CANCELLED
```

**状态说明**:
- `PENDING`: 待处理 - 客户已创建，等待管理员分配
- `ASSIGNED`: 已分配 - 管理员已分配给设计师
- `IN_PROGRESS`: 进行中 - 设计师正在工作
- `REVIEW`: 待验收 - 设计师已提交交付物，等待客户验收
- `COMPLETED`: 已完成 - 客户已验收通过
- `CANCELLED`: 已取消 - 项目已取消

**核心函数**:
- `canTransitionStatus()`: 检查状态转换是否有效
- `validateStatusTransition()`: 验证状态转换并返回错误信息
- `getStatusLabel()`: 获取状态中文标签
- `getStatusColor()`: 获取状态颜色（用于 UI）

### 3. 创建项目 API ✅

**文件**: `app/api/projects/route.ts`

**POST /api/projects**
- 权限: 仅限客户（CLIENT）
- 功能: 创建项目，验证订阅后创建（状态为 PENDING）
- 请求体:
  ```json
  {
    "name": "项目名称（必填，5-100字符）",
    "description": "项目描述（可选，最多5000字符）",
    "attachments": [{"name": "文件名", "url": "文件URL", "size": 1024}],
    "priority": "low" | "medium" | "high" | "urgent"
  }
  ```
- 验证:
  1. 检查用户是否有有效的订阅（status='active' 或 'trialing'，未过期）
  2. 检查订阅额度是否充足
  3. 创建项目（状态为 PENDING）
  4. 扣除订阅额度

**GET /api/projects**
- 权限: 仅限客户（CLIENT）
- 功能: 获取当前用户的项目列表
- 查询参数: `status`, `page`, `limit`

### 4. 管理员分配功能 ✅

**文件**: `app/api/admin/designers/[id]/assign-project/route.ts`

**POST /api/admin/designers/[id]/assign-project**
- 权限: 仅限管理员（ADMIN）
- 功能: 将项目分配给设计师
- 请求体:
  ```json
  {
    "projectId": "项目ID",
    "estimatedHours": 10.5  // 可选
  }
  ```
- 验证:
  1. 检查设计师负载是否已满
  2. 检查设计师是否在休假
  3. 检查项目状态是否为 PENDING
  4. 更新项目状态为 ASSIGNED
  5. 更新设计师负载

**文件**: `app/api/admin/projects/pending/route.ts`

**GET /api/admin/projects/pending**
- 权限: 仅限管理员（ADMIN）
- 功能: 获取待处理项目列表（状态为 PENDING）
- 查询参数: `priority`, `page`, `limit`

### 5. 设计师交付功能 ✅

**文件**: `app/api/designer/projects/[id]/deliver/route.ts`

**POST /api/designer/projects/[id]/deliver**
- 权限: 仅限设计师（DESIGNER）
- 功能: 提交交付物，状态改为 REVIEW
- 请求体:
  ```json
  {
    "deliveryLink": "https://example.com/delivery"
  }
  ```
- 验证:
  1. 验证项目是否分配给当前设计师
  2. 验证状态转换（ASSIGNED 或 IN_PROGRESS → REVIEW）
  3. 更新项目状态和交付信息

**文件**: `app/api/designer/projects/route.ts`

**GET /api/designer/projects**
- 权限: 仅限设计师（DESIGNER）
- 功能: 获取分配给当前设计师的项目列表
- 查询参数: `status`, `page`, `limit`

### 6. 客户验收功能 ✅

**文件**: `app/api/projects/[id]/approve/route.ts`

**POST /api/projects/[id]/approve**
- 权限: 仅限项目所有者（CLIENT）
- 功能: 验收项目，状态改为 COMPLETED
- 验证:
  1. 验证项目所有者
  2. 验证状态转换（REVIEW → COMPLETED）
  3. 检查是否有交付物
  4. 更新项目状态
  5. 更新设计师统计数据（完成项目数、负载、平均完成时间）

## 验证逻辑文件

**文件**: `lib/api/project-validation.ts`

包含以下验证函数：
- `validateCreateProject()`: 验证创建项目的请求体
- `validateDeliverProject()`: 验证交付项目的请求体

## 前端页面更新建议

### 1. ADMIN 页面 (`app/admin/projects/page.tsx`)

建议添加：
- 待处理项目标签页，显示状态为 PENDING 的项目
- 分配按钮，点击后打开分配对话框
- 使用 `/api/admin/projects/pending` 获取待处理项目列表

### 2. 设计师页面 (`app/designer/projects/page.tsx`)

建议添加：
- 显示已分配项目（状态为 ASSIGNED 或 IN_PROGRESS）
- 交付按钮，点击后打开交付对话框
- 使用 `/api/designer/projects` 获取项目列表
- 使用 `/api/designer/projects/[id]/deliver` 提交交付

### 3. 客户项目详情页 (`app/dashboard/projects/[id]/page.tsx`)

建议添加：
- 验收按钮（当状态为 REVIEW 时显示）
- 使用 `/api/projects/[id]/approve` 提交验收

## 使用示例

### 创建项目（客户）

```typescript
const response = await fetch('/api/projects', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Logo 设计项目',
    description: '需要设计一个现代化的 Logo',
    priority: 'high',
    attachments: [
      { name: '参考图.jpg', url: 'https://...', size: 1024 }
    ]
  })
});
```

### 分配项目（管理员）

```typescript
const response = await fetch(`/api/admin/designers/${designerId}/assign-project`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    projectId: 'project-id',
    estimatedHours: 10
  })
});
```

### 提交交付（设计师）

```typescript
const response = await fetch(`/api/designer/projects/${projectId}/deliver`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    deliveryLink: 'https://example.com/delivery'
  })
});
```

### 验收项目（客户）

```typescript
const response = await fetch(`/api/projects/${projectId}/approve`, {
  method: 'POST'
});
```

## 注意事项

1. **数据库迁移**: 更新 schema 后需要运行迁移
2. **状态验证**: 所有状态转换都通过状态机验证，确保流程正确
3. **权限控制**: 每个 API 都有严格的权限验证
4. **订阅验证**: 创建项目时会验证订阅状态和额度
5. **事务处理**: 关键操作使用事务保证数据一致性

## 待完成功能

1. 前端页面集成（ADMIN、设计师、客户页面）
2. 通知功能（项目状态变更时发送通知）
3. 项目详情页面的状态显示和操作按钮
4. 错误处理和用户提示优化

## 测试建议

1. 测试状态流转：确保只能按顺序流转
2. 测试权限控制：确保只有正确角色可以执行操作
3. 测试订阅验证：确保无订阅或额度不足时无法创建项目
4. 测试数据一致性：确保事务操作正确回滚
