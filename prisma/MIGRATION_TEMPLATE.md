# 模板管理功能 — 数据模型迁移说明

## 概述

本迁移为**模板管理**功能扩展数据模型：新增 `Template`、`TemplateCategory`、`TemplateReview`、`TemplateDownload` 模型，用于管理员上传模板、管理分类、用户评价和下载记录。

---

## 一、模型变更摘要

| 模型 | 变更类型 | 说明 |
|------|----------|------|
| `User` | 扩展 | 新增 `uploadedTemplates`、`templateReviews`、`templateDownloads` 关系 |
| `Template` | **新增** | 模板主表（名称、描述、分类、预览图、文件、价格、统计、状态等） |
| `TemplateCategory` | **新增** | 模板分类表（名称、slug、图标、排序、状态） |
| `TemplateCategoryTemplate` | **新增** | 模板与分类关联表（多对多关系） |
| `TemplateReview` | **新增** | 模板评价表（评分、评论、有用数） |
| `TemplateDownload` | **新增** | 模板下载记录表（下载时间） |

---

## 二、迁移命令

### 1. 生成迁移（开发环境）

```bash
npx prisma migrate dev --name add_template_management
```

会创建 `prisma/migrations/YYYYMMDDHHMMSS_add_template_management/migration.sql`，并执行迁移、重新生成 Prisma Client。

### 2. 仅生成迁移文件（不执行）

```bash
npx prisma migrate dev --name add_template_management --create-only
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
   - 所有新表均为空表，不影响现有数据。

---

## 四、迁移后可选步骤

### 1. 创建初始模板分类

```typescript
// scripts/seed-template-categories.ts
import { prisma } from '@/lib/prisma';

const categories = [
  { name: 'Logo设计', slug: 'logo', order: 1 },
  { name: 'VI系统', slug: 'vi-system', order: 2 },
  { name: '网站设计', slug: 'website', order: 3 },
  { name: '海报设计', slug: 'poster', order: 4 },
  { name: '包装设计', slug: 'packaging', order: 5 },
  { name: 'UI设计', slug: 'ui', order: 6 },
];

for (const cat of categories) {
  await prisma.templateCategory.upsert({
    where: { slug: cat.slug },
    create: cat,
    update: {},
  });
}
```

### 2. 更新模板统计

模板的 `downloads`、`likes`、`rating` 字段可以通过聚合 `TemplateDownload`、`TemplateReview` 表来更新，或通过应用逻辑在下载/评价时自动更新。

---

## 五、关系与约束速查

- **User ↔ Template**：一对多，`Template.uploadedById` → `User`（上传者）。
- **Template ↔ TemplateCategory**：多对多，通过 `TemplateCategoryTemplate` 中间表。
- **Template ↔ TemplateReview**：一对多，`TemplateReview.templateId` → `Template`。
- **Template ↔ TemplateDownload**：一对多，`TemplateDownload.templateId` → `Template`。
- **User ↔ TemplateReview**：一对多，`TemplateReview.userId` → `User`。
- **User ↔ TemplateDownload**：一对多，`TemplateDownload.userId` → `User`。
- **唯一约束**：`TemplateReview` 中 `[templateId, userId]` 唯一（每个用户对每个模板只能评价一次）。
- 外键均带 `onDelete`（Cascade），删除用户/模板时自动删除相关记录。

---

## 六、数据模型字段说明

### Template 字段

| 字段 | 类型 | 说明 |
|------|------|------|
| `categoryIds` | Json? | 分类ID数组（可选，也可通过关联表） |
| `preview` | String[] | 预览图URL数组 |
| `files` | Json? | 文件信息数组，格式：`[{ format: "AI", url: "...", size: 1024 }]` |
| `price` | Float | 价格（元） |
| `discount` | Float? | 折扣（0-1，如 0.8 表示 8 折） |
| `downloads` | Int | 下载次数（可聚合 `TemplateDownload` 更新） |
| `likes` | Int | 点赞数 |
| `rating` | Float | 平均评分（可聚合 `TemplateReview` 更新） |
| `tags` | Json? | 标签数组 |
| `author` | String? | 作者名称（设计师名称） |
| `status` | String | 'draft' \| 'published' \| 'archived' |
| `views` | Int | 浏览次数 |
| `isFeatured` | Boolean | 是否精选推荐 |
| `featuredUntil` | DateTime? | 精选截止时间 |

### TemplateCategory 字段

| 字段 | 类型 | 说明 |
|------|------|------|
| `slug` | String | URL友好的标识符（唯一） |
| `icon` | String? | 分类图标URL |
| `order` | Int | 显示顺序（数字越小越靠前） |
| `active` | Boolean | 是否启用 |

### TemplateReview 字段

| 字段 | 类型 | 说明 |
|------|------|------|
| `rating` | Int | 评分 1-5 |
| `comment` | String? | 评价内容 |
| `helpful` | Int | 有用/点赞数 |

### TemplateDownload 字段

| 字段 | 类型 | 说明 |
|------|------|------|
| `downloadedAt` | DateTime | 下载时间 |

---

## 七、回滚

若需回滚本次迁移：

```bash
npx prisma migrate resolve --rolled-back 20240101000000_add_template_management
```

然后手动执行反向 SQL（删除新表、新列、新索引）。**务必先备份。**

---

## 八、Schema 路径

- Prisma schema：`prisma/schema.prisma`
- 迁移目录：`prisma/migrations/`

更多见 [Prisma Migrate 文档](https://www.prisma.io/docs/orm/prisma-migrate)。
