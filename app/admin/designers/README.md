# 设计师管理页面文档

## 概述

设计师管理功能为管理员提供完整的设计师账号管理、项目分配、负载监控等功能。

## 已实现的功能

### 1. 导航入口

- ✅ 在 `lib/admin-nav.ts` 中添加了"设计师管理"导航项
- 图标：`Palette`
- 路径：`/admin/designers`
- 徽章：显示设计师数量

### 2. 主页面 (`app/admin/designers/page.tsx`)

**功能：**
- ✅ 设计师列表展示（卡片视图）
- ✅ 搜索功能（按姓名、邮箱）
- ✅ 筛选功能：
  - 状态筛选（活跃、离线、休假）
  - 技能筛选（多选）
  - 排序（评分、容量、负载）
- ✅ 设计师卡片显示：
  - 头像、姓名、邮箱
  - 技能标签
  - 工作负载（进度条 + 百分比）
  - 统计数据（总项目数、评分、平均完成时间）
  - 状态徽章
  - 快捷操作（分配项目、查看详情、编辑、更多菜单）
- ✅ 负载警告（100% 时显示红色警告）
- ✅ "添加设计师" 按钮

### 3. 详情页面 (`app/admin/designers/[id]/page.tsx`)

**布局：三栏布局**

**左侧栏：**
- ✅ 设计师基本信息卡片（头像、姓名、邮箱、加入时间）
- ✅ 技能标签卡片（可编辑）
- ✅ 工作参数卡片（时薪、最大容量、当前负载、状态）
- ✅ 评价统计卡片（总项目数、平均评分、平均完成时间）

**中间栏：**
- ✅ 进行中的项目列表
  - 项目名称、客户信息
  - 进度条
  - 分配时间、预估工时
  - 操作按钮（重新分配、查看详情）
- ✅ 最近完成的项目列表（最多 5 个）

**右侧栏：**
- ✅ 快速操作面板
  - 分配项目
  - 调整参数
  - 休假设置
  - 查看评价
  - 禁用/启用账户
- ✅ 工作时间线（最近 7 天，Mock 数据）

### 4. 组件

#### AssignProjectDialog (`components/admin/designers/assign-project-dialog.tsx`)
- ✅ 分配项目对话框
- ✅ 显示当前负载和可用容量
- ✅ 项目选择下拉框
- ✅ 预估工时输入
- ✅ 优先级选择（低、中、高、紧急）
- ✅ 分配说明输入
- ✅ 负载检查（100% 时禁用）
- ✅ 休假期间警告

#### ReassignProjectDialog (`components/admin/designers/reassign-project-dialog.tsx`)
- ✅ 重新分配项目对话框
- ✅ 显示当前设计师信息
- ✅ 新设计师选择（显示负载和评分）
- ✅ 重新分配原因输入（必填）
- ✅ 通知原设计师选项

#### EditDesignerModal (`components/admin/designers/edit-design-modal.tsx`)
- ✅ 编辑/创建设计师对话框
- ✅ 基本信息编辑（邮箱、姓名、手机）
- ✅ 技能标签管理（添加、删除、常用技能快速添加）
- ✅ 工作参数设置（时薪、最大容量）
- ✅ 状态设置（活跃、离线、休假）

#### DesignerWorkloadChart (`components/admin/designers/designer-workload-chart.tsx`)
- ✅ 工作负载柱状图
- ✅ 显示所有设计师的负载对比
- ✅ 颜色编码（正常/警告/满载）

### 5. Hooks (`hooks/use-designers.ts`)

- ✅ `useDesignersList(filters)` - 获取设计师列表
- ✅ `useDesignerDetail(designerId)` - 获取设计师详情
- ✅ `useDesignerWorkload()` - 获取工作负载统计
- ✅ `useDesignerProjects(designerId, filters)` - 获取设计师的项目列表
- ✅ `useAssignProject()` - 分配项目 mutation
- ✅ `useReassignProject()` - 重新分配项目 mutation
- ✅ `useUpdateDesigner()` - 更新设计师信息 mutation
- ✅ `useCreateDesigner()` - 创建设计师 mutation

## 数据流

```
用户操作
  ↓
React Hook (useDesignersList, useAssignProject 等)
  ↓
API 端点 (/api/admin/designers/*)
  ↓
Prisma 数据库操作
  ↓
返回数据
  ↓
React Query 缓存更新
  ↓
UI 自动刷新
```

## 样式说明

- 使用 Tailwind CSS
- 深色主题（`bg-[#0a0a0f]`, `bg-[#12121a]`）
- shadcn/ui 组件
- 响应式设计（移动端适配）

## 待完善功能

1. **获取待分配项目列表**：
   - 当前 `AssignProjectDialog` 使用 Mock 数据
   - 需要创建 API 端点获取未分配的项目：`GET /api/admin/projects?assignedToUserId=null`

2. **工作时间线**：
   - 当前详情页的工作时间线使用 Mock 数据
   - 需要创建 API 端点获取设计师的工作时间记录

3. **项目完成功能**：
   - 详情页的项目卡片有"完成"按钮，但未实现
   - 需要创建 API 端点更新项目状态为完成

4. **评价查看**：
   - "查看评价"按钮未实现
   - 需要创建评价相关的数据模型和 API

5. **休假设置**：
   - "休假设置"按钮打开编辑对话框，但需要添加 `leaveFrom` 和 `leaveTo` 字段的编辑

## 使用说明

1. **访问设计师管理**：
   - 登录管理员账号
   - 在左侧导航点击"设计师管理"

2. **添加设计师**：
   - 点击"添加设计师"按钮
   - 填写邮箱（必填）、姓名、技能等信息
   - 点击"创建"

3. **分配项目**：
   - 在设计师卡片上点击"分配项目"或详情页点击"分配项目"
   - 选择项目、设置工时和优先级
   - 确认分配

4. **重新分配项目**：
   - 在详情页的项目卡片上点击"重新分配"
   - 选择新设计师、填写原因
   - 确认重新分配

5. **编辑设计师信息**：
   - 在设计师卡片上点击"编辑"或详情页点击"编辑信息"
   - 修改技能、参数、状态等
   - 保存

## 技术栈

- **框架**：Next.js 16 (App Router)
- **UI 库**：shadcn/ui + Tailwind CSS
- **状态管理**：React Query (@tanstack/react-query)
- **数据验证**：Zod
- **数据库**：Prisma + PostgreSQL
- **类型安全**：TypeScript

## 文件结构

```
app/admin/designers/
├── page.tsx                    # 主页面（列表）
├── [id]/
│   └── page.tsx               # 详情页面
└── README.md                   # 本文档

components/admin/designers/
├── assign-project-dialog.tsx   # 分配项目对话框
├── reassign-project-dialog.tsx # 重新分配对话框
├── edit-designer-modal.tsx     # 编辑设计师对话框
└── designer-workload-chart.tsx # 工作负载图表

hooks/
└── use-designers.ts            # 设计师相关 Hooks

lib/
└── admin-nav.ts                # 管理员导航（已更新）
```

## API 端点

所有 API 端点已在 `/app/api/admin/designers/` 实现：

- `GET /api/admin/designers` - 获取列表
- `POST /api/admin/designers` - 创建
- `GET /api/admin/designers/[id]` - 获取详情
- `PATCH /api/admin/designers/[id]` - 更新
- `POST /api/admin/designers/[id]/assign-project` - 分配项目
- `POST /api/admin/designers/[id]/reassign-project` - 重新分配
- `GET /api/admin/designers/[id]/projects` - 获取项目列表
- `GET /api/admin/designers/workload` - 获取负载统计

详见 `/app/api/admin/designers/README.md`
