# 设计师管理功能 — 数据模型迁移说明

## 概述

本迁移为**设计师管理**扩展数据模型：新增 `Designer`、`ProjectAssignment`，扩展 `User`、`Project`，用于管理员分配项目、跟踪设计师负载与信息。

---

## 一、模型变更摘要

| 模型 | 变更类型 | 说明 |
|------|----------|------|
| `User` | 扩展 | 新增 `designer`、`assignedProjects`、`assignedProjectsAsAdmin`、分配记录关系 |
| `Designer` | **新增** | 设计师档案（专长、费率、负载、评分、休假等） |
| `Project` | 扩展 | 新增 `assignedToUser`、`assignedAt`、`assignedBy`、`estimatedHours`、`actualHours`、`completionRate` |
| `ProjectAssignment` | **新增** | 分配/改派记录（原设计师、新设计师、原因、时间、状态） |

---

## 二、迁移命令

### 1. 生成迁移（开发环境）

```bash
npx prisma migrate dev --name add_designer_management
```

会创建 `prisma/migrations/YYYYMMDDHHMMSS_add_designer_management/migration.sql`，并执行迁移、重新生成 Prisma Client。

### 2. 仅生成迁移文件（不执行）

```bash
npx prisma migrate dev --name add_designer_management --create-only
```

然后可手动编辑 `migration.sql`，再执行：

```bash
npx prisma migrate dev
```

### 3. 生产环境应用迁移

```bash
npx prisma migrate deploy
```

### 4. 重新生成 Prisma Client（未改 schema 时）

```bash
npx prisma generate
```

---

## 三、迁移前检查

1. **备份数据库**
   ```bash
   pg_dump -U user -d mydb > backup_$(date +%Y%m%d).sql
   ```

2. **确认 `DATABASE_URL`**
   - 在 `prisma.config.ts` 或 `.env` 中配置正确的 `DATABASE_URL`。

3. **现有数据**
   - `Project` 新增字段均为可空，已有数据不受影响。
   - `User` 仅新增关系和可选逻辑，不破坏现有用户。

---

## 四、迁移后可选步骤

### 1. 为已有设计师用户创建 `Designer` 档案

使用 Prisma 脚本或 API 批量创建。示例（Node 脚本）：

```ts
const users = await prisma.user.findMany({ where: { role: 'designer' } });
for (const u of users) {
  await prisma.designer.upsert({
    where: { userId: u.id },
    create: {
      userId: u.id,
      hourlyRate: 0,
      maxCapacity: 3,
      status: 'active',
    },
    update: {},
  });
}
```

### 2. 更新 `Designer.currentLoad`

分配/完成项目时，在应用逻辑中更新 `designers.currentLoad`，或通过定时任务从 `projects` 聚合。

---

## 五、关系与约束速查

- **User ↔ Designer**：一对一，`User.designer`、`Designer.user`。
- **User ↔ Project（客户）**：`Project.userId` → `User`（项目归属）。
- **User ↔ Project（设计师）**：`Project.assignedToUserId` → `User`（分配给该设计师）。
- **User ↔ Project（管理员）**：`Project.assignedById` → `User`（分配人）。
- **ProjectAssignment**：`projectId` → `Project`；`designerId`（原）、`newDesignerId`（新）→ `User`。
- 外键均带 `onDelete`（Cascade/SetNull），见 `schema.prisma`。

---

## 六、回滚

若需回滚本次迁移：

```bash
npx prisma migrate resolve --rolled-back 20240101000000_add_designer_management
```

然后手动执行反向 SQL（删除新表、新列、新索引）。**务必先备份。**

---

## 七、Schema 路径

- Prisma schema：`prisma/schema.prisma`
- 迁移目录：`prisma/migrations/`

更多见 [Prisma Migrate 文档](https://www.prisma.io/docs/orm/prisma-migrate)。
