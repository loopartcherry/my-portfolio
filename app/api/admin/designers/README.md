# 设计师管理 API 文档

## 概述

设计师管理 API 提供完整的设计师账号管理、项目分配、负载统计等功能。所有端点仅限管理员（Admin）访问。

## 认证

所有端点需要管理员权限，通过 `requireAdmin` 中间件验证。请求头需要包含有效的用户认证信息。

## API 端点列表

### 1. 获取所有设计师列表

**GET** `/api/admin/designers`

**查询参数：**
- `status` (可选): `'active' | 'inactive' | 'on_leave'` - 按状态筛选
- `specialty` (可选): `string` - 按专长筛选（模糊匹配）
- `sortBy` (可选): `'rating' | 'capacity' | 'load'` - 排序方式
  - `rating`: 按评分降序
  - `capacity`: 按最大容量降序
  - `load`: 按当前负载升序

**响应示例：**
```json
{
  "success": true,
  "data": [
    {
      "id": "designer_123",
      "userId": "user_456",
      "email": "designer@example.com",
      "name": "张三",
      "specialties": ["Logo设计", "VI系统"],
      "hourlyRate": 200,
      "maxCapacity": 5,
      "currentLoad": 3,
      "rating": 4.5,
      "totalProjects": 50,
      "status": "active",
      "leaveFrom": null,
      "leaveTo": null,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "count": 1
}
```

---

### 2. 获取单个设计师详情

**GET** `/api/admin/designers/[id]`

**路径参数：**
- `id`: 设计师 ID

**响应示例：**
```json
{
  "success": true,
  "data": {
    "id": "designer_123",
    "userId": "user_456",
    "email": "designer@example.com",
    "name": "张三",
    "specialties": ["Logo设计", "VI系统"],
    "hourlyRate": 200,
    "maxCapacity": 5,
    "currentLoad": 3,
    "rating": 4.5,
    "totalProjects": 50,
    "averageCompletionTime": 48,
    "status": "active",
    "leaveFrom": null,
    "leaveTo": null,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z",
    "assignedProjects": [
      {
        "id": "project_789",
        "name": "品牌设计项目",
        "status": "in_progress",
        "assignedAt": "2024-01-15T00:00:00Z",
        "estimatedHours": 40,
        "actualHours": 25,
        "completionRate": 62.5,
        "client": {
          "id": "user_111",
          "email": "client@example.com",
          "name": "客户A"
        }
      }
    ],
    "assignmentHistory": [
      {
        "id": "assignment_001",
        "projectId": "project_789",
        "projectName": "品牌设计项目",
        "previousDesignerId": null,
        "previousDesigner": null,
        "newDesignerId": "user_456",
        "newDesigner": {
          "id": "user_456",
          "name": "张三",
          "email": "designer@example.com"
        },
        "reason": null,
        "assignedAt": "2024-01-15T00:00:00Z",
        "reassignedAt": null,
        "status": "active"
      }
    ]
  }
}
```

---

### 3. 更新设计师信息

**PATCH** `/api/admin/designers/[id]`

**路径参数：**
- `id`: 设计师 ID

**请求体：**
```json
{
  "specialties": ["Logo设计", "VI系统", "网站设计"],
  "hourlyRate": 250,
  "maxCapacity": 6,
  "status": "active"
}
```

**响应示例：**
```json
{
  "success": true,
  "data": {
    "id": "designer_123",
    "userId": "user_456",
    "email": "designer@example.com",
    "name": "张三",
    "specialties": ["Logo设计", "VI系统", "网站设计"],
    "hourlyRate": 250,
    "maxCapacity": 6,
    "currentLoad": 3,
    "rating": 4.5,
    "totalProjects": 50,
    "averageCompletionTime": 48,
    "status": "active",
    "leaveFrom": null,
    "leaveTo": null,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-15T10:00:00Z"
  },
  "message": "设计师信息已更新"
}
```

---

### 4. 给设计师分配项目

**POST** `/api/admin/designers/[id]/assign-project`

**路径参数：**
- `id`: 设计师 ID

**请求体：**
```json
{
  "projectId": "project_789",
  "estimatedHours": 40,
  "priority": 1
}
```

**业务逻辑检查：**
1. ✅ 设计师当前负载是否已满（`currentLoad >= maxCapacity`）
2. ✅ 设计师是否在休假期间（`status === 'on_leave'` 且当前时间在 `leaveFrom` 和 `leaveTo` 之间）
3. ⚠️ 技能匹配检查（当前 Project 模型中没有 `requiredSkills` 字段，已预留检查逻辑）

**错误响应：**
- `422 DESIGNER_AT_CAPACITY`: 设计师负载已满
- `422 DESIGNER_ON_LEAVE`: 设计师在休假期间
- `404 PROJECT_NOT_FOUND`: 项目不存在
- `422 PROJECT_ALREADY_ASSIGNED`: 项目已分配（需使用改派接口）

**响应示例：**
```json
{
  "success": true,
  "data": {
    "assignment": {
      "projectId": "project_789",
      "designerId": "designer_123",
      "userId": "user_456",
      "estimatedHours": 40,
      "assignedAt": "2024-01-15T10:00:00Z"
    },
    "designer": {
      "id": "designer_123",
      "currentLoad": 4,
      "maxCapacity": 5,
      "email": "designer@example.com",
      "name": "张三"
    }
  },
  "message": "项目已成功分配"
}
```

---

### 5. 重新分配项目

**POST** `/api/admin/designers/[id]/reassign-project`

**路径参数：**
- `id`: 当前设计师 ID（项目原分配的设计师）

**请求体：**
```json
{
  "projectId": "project_789",
  "newDesignerId": "designer_456",
  "reason": "原设计师工作负载过重"
}
```

**业务逻辑：**
1. 检查新设计师负载是否已满
2. 检查新设计师是否在休假期间
3. 验证项目确实分配给当前设计师
4. 更新原设计师负载（减 1）
5. 更新新设计师负载（加 1）
6. 创建分配记录，标记原分配记录为已完成

**错误响应：**
- `404 DESIGNER_NOT_FOUND`: 当前设计师不存在
- `404 NEW_DESIGNER_NOT_FOUND`: 新设计师不存在
- `422 DESIGNER_AT_CAPACITY`: 新设计师负载已满
- `422 DESIGNER_ON_LEAVE`: 新设计师在休假期间
- `404 PROJECT_NOT_FOUND`: 项目不存在
- `422 PROJECT_NOT_ASSIGNED_TO_DESIGNER`: 项目未分配给当前设计师

**响应示例：**
```json
{
  "success": true,
  "data": {
    "reassignment": {
      "projectId": "project_789",
      "previousDesignerId": "designer_123",
      "newDesignerId": "designer_456",
      "reason": "原设计师工作负载过重",
      "reassignedAt": "2024-01-15T10:00:00Z"
    },
    "newDesigner": {
      "id": "designer_456",
      "currentLoad": 2,
      "maxCapacity": 5,
      "email": "designer2@example.com",
      "name": "李四"
    }
  },
  "message": "项目已成功改派"
}
```

---

### 6. 获取设计师的项目列表

**GET** `/api/admin/designers/[id]/projects`

**路径参数：**
- `id`: 设计师 ID

**查询参数：**
- `status` (可选): `string` - 按项目状态筛选
- `sortBy` (可选): `'createdAt' | 'assignedAt' | 'completionRate'` - 排序方式

**响应示例：**
```json
{
  "success": true,
  "data": [
    {
      "id": "project_789",
      "name": "品牌设计项目",
      "status": "in_progress",
      "assignedAt": "2024-01-15T00:00:00Z",
      "estimatedHours": 40,
      "actualHours": 25,
      "completionRate": 62.5,
      "client": {
        "id": "user_111",
        "email": "client@example.com",
        "name": "客户A"
      },
      "createdAt": "2024-01-10T00:00:00Z"
    }
  ],
  "count": 1
}
```

---

### 7. 获取设计师工作负载统计

**GET** `/api/admin/designers/workload`

**响应示例：**
```json
{
  "success": true,
  "data": [
    {
      "designerId": "designer_123",
      "userId": "user_456",
      "email": "designer@example.com",
      "name": "张三",
      "currentLoad": 3,
      "maxCapacity": 5,
      "utilization": 60,
      "averageCompletionTimeHours": 48,
      "estimatedTotalHoursToComplete": 144,
      "status": "active",
      "leaveFrom": null,
      "leaveTo": null
    }
  ],
  "count": 1
}
```

**字段说明：**
- `utilization`: 利用率百分比（`currentLoad / maxCapacity * 100`）
- `estimatedTotalHoursToComplete`: 预计完成所有项目所需总工时（`currentLoad * averageCompletionTime`）

---

### 8. 创建设计师账号

**POST** `/api/admin/designers`

**请求体：**
```json
{
  "email": "newdesigner@example.com",
  "password": "password123",
  "name": "新设计师",
  "phone": "13800138000",
  "specialties": ["Logo设计", "VI系统"],
  "hourlyRate": 200,
  "maxCapacity": 5
}
```

**注意：**
- `password` 和 `phone` 字段当前不存储到数据库（User 模型中没有这些字段）
- 如需存储密码，需要集成认证系统（如 NextAuth.js）
- 如需存储电话，需要在 User 模型中添加 `phone` 字段

**响应示例：**
```json
{
  "success": true,
  "data": {
    "id": "designer_789",
    "userId": "user_999",
    "email": "newdesigner@example.com",
    "name": "新设计师",
    "specialties": ["Logo设计", "VI系统"],
    "hourlyRate": 200,
    "maxCapacity": 5,
    "currentLoad": 0,
    "rating": 0,
    "totalProjects": 0,
    "status": "active",
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-15T10:00:00Z"
  },
  "message": "设计师账号已创建"
}
```

**错误响应：**
- `422 EMAIL_EXISTS`: 邮箱已注册

---

## 错误码说明

| 状态码 | 错误码 | 说明 |
|--------|--------|------|
| 400 | `VALIDATION_ERROR` | 数据验证失败 |
| 401 | `UNAUTHORIZED` | 未认证 |
| 403 | `FORBIDDEN` | 权限不足（非管理员） |
| 404 | `DESIGNER_NOT_FOUND` | 设计师不存在 |
| 404 | `PROJECT_NOT_FOUND` | 项目不存在 |
| 404 | `NEW_DESIGNER_NOT_FOUND` | 新设计师不存在 |
| 422 | `EMAIL_EXISTS` | 邮箱已注册 |
| 422 | `DESIGNER_AT_CAPACITY` | 设计师负载已满 |
| 422 | `DESIGNER_ON_LEAVE` | 设计师在休假期间 |
| 422 | `PROJECT_ALREADY_ASSIGNED` | 项目已分配 |
| 422 | `PROJECT_NOT_ASSIGNED_TO_DESIGNER` | 项目未分配给指定设计师 |

---

## 数据验证

所有请求都使用 Zod 进行验证：

- **查询参数**：通过 `validateDesignerListQuery`、`validateDesignerProjectsQuery` 验证
- **请求体**：通过对应的 Schema 验证（`CreateDesignerSchema`、`DesignerUpdateSchema`、`AssignProjectSchema`、`ReassignProjectSchema`）

验证失败返回 `400 VALIDATION_ERROR`，包含详细的错误信息。

---

## 事务处理

以下操作使用数据库事务确保数据一致性：

- **分配项目**：创建分配记录、更新项目、更新设计师负载
- **改派项目**：更新原分配记录、创建新分配记录、更新项目、更新两个设计师的负载

---

## 注意事项

1. **技能匹配检查**：当前 Project 模型中没有 `requiredSkills` 字段，技能匹配检查已预留代码但未启用。如需启用，请在 Project 模型中添加 `requiredSkills` 字段（Json 类型），并取消 `assign-project` 路由中相关代码的注释。

2. **密码存储**：创建设计师时，`password` 字段当前不存储。如需存储，需要：
   - 集成认证系统（如 NextAuth.js）
   - 或添加密码哈希字段到 User 模型

3. **负载更新**：设计师的 `currentLoad` 在分配/改派项目时自动更新。项目完成时，需要在业务逻辑中手动减少 `currentLoad`。

4. **分配记录**：每次分配/改派都会创建 `ProjectAssignment` 记录，用于追踪项目分配历史。
