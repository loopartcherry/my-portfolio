# 内容管理数据模型迁移指南

## 概述

本文档描述了为内容管理功能添加的数据模型变更，包括文章/内容、版本历史、评论和分类等表。

## 数据模型变更

### 新增模型

1. **Content** - 文章/内容表
2. **ContentRevision** - 文章版本历史表
3. **ContentComment** - 文章评论表
4. **ContentCategory** - 文章分类表

### 扩展模型

- **User** - 添加了内容相关的关系字段

## 字段说明

### Content 表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | String | 主键 |
| slug | String | URL slug，唯一，用于生成友好的 URL |
| type | String | 内容类型：'article' \| 'case_study' \| 'faq' \| 'page' |
| title | String | 标题 |
| subtitle | String? | 副标题（可选） |
| excerpt | String? | 摘要，用于列表显示 |
| content | String | 富文本内容（HTML 或 Markdown） |
| contentFormat | String | 内容格式：'html' \| 'markdown'，默认 'html' |
| featuredImage | String? | 文章配图 URL |
| categoryKeyword | String? | 分类关键词/标签（字符串） |
| tags | Json? | 标签（JSON 数组），如 ["设计趋势", "品牌策划"] |
| authorId | String | 作者（User ID） |
| status | String | 状态：'draft' \| 'published' \| 'archived'，默认 'draft' |
| views | Int | 浏览次数，默认 0 |
| publishedAt | DateTime? | 发布时间 |
| expiresAt | DateTime? | 内容过期时间（可选） |
| seo | Json? | SEO 信息（JSON 对象）：{ metaTitle, metaDescription, keywords } |
| isFeatured | Boolean | 是否在首页推荐，默认 false |
| featuredOrder | Int | 推荐排序（数字越小越靠前），默认 0 |
| deletedAt | DateTime? | 软删除时间 |
| categoryId | String? | 关联的分类 ID |
| createdAt | DateTime | 创建时间 |
| updatedAt | DateTime | 更新时间 |

**索引：**
- authorId
- status
- type
- categoryId
- isFeatured, featuredOrder（复合索引）
- publishedAt
- createdAt
- slug（唯一索引）

### ContentRevision 表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | String | 主键 |
| contentId | String | 关联的内容 ID |
| title | String? | 版本标题 |
| revisionContent | String | 版本内容（HTML 或 Markdown） |
| revisedById | String | 修改人（User ID） |
| changeNote | String? | 改动说明 |
| revisedAt | DateTime | 修改时间 |

**索引：**
- contentId
- revisedById
- revisedAt

### ContentComment 表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | String | 主键 |
| contentId | String | 关联的内容 ID |
| userId | String | 评论用户（User ID） |
| comment | String | 评论内容 |
| rating | Int? | 评分（可选，1-5） |
| approved | Boolean | 是否已审核通过，默认 false |
| createdAt | DateTime | 创建时间 |
| updatedAt | DateTime | 更新时间 |

**索引：**
- contentId
- userId
- approved
- createdAt

### ContentCategory 表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | String | 主键 |
| name | String | 分类名称 |
| slug | String | URL slug，唯一 |
| description | String? | 分类描述 |
| icon | String? | 分类图标 URL |
| order | Int | 显示顺序（数字越小越靠前），默认 0 |
| createdAt | DateTime | 创建时间 |
| updatedAt | DateTime | 更新时间 |

**索引：**
- slug（唯一索引）
- order

## 关系说明

### Content 关系

- **belongsTo User** (author) - 通过 `authorId` 关联
- **belongsTo ContentCategory** (category) - 通过 `categoryId` 关联（可选）
- **hasMany ContentRevision** - 一个内容可以有多个版本历史
- **hasMany ContentComment** - 一个内容可以有多个评论

### ContentRevision 关系

- **belongsTo Content** - 通过 `contentId` 关联
- **belongsTo User** (revisedBy) - 通过 `revisedById` 关联

### ContentComment 关系

- **belongsTo Content** - 通过 `contentId` 关联
- **belongsTo User** - 通过 `userId` 关联

### ContentCategory 关系

- **hasMany Content** - 一个分类可以有多篇文章

### User 扩展关系

- **hasMany Content** (authoredContents) - 用户创建的文章
- **hasMany ContentRevision** (contentRevisions) - 用户修改的版本记录
- **hasMany ContentComment** (contentComments) - 用户发表的评论

## 迁移命令

### 1. 生成迁移文件

```bash
npx prisma migrate dev --name add_content_management
```

### 2. 应用迁移

```bash
npx prisma migrate deploy
```

### 3. 生成 Prisma Client

```bash
npx prisma generate
```

## 迁移前准备

### 1. 备份数据库

```bash
# PostgreSQL 备份示例
pg_dump -U your_user -d your_database > backup_before_content_migration.sql
```

### 2. 检查现有数据

确保没有与新增字段冲突的现有数据。

## 迁移后操作

### 1. 创建初始分类数据（可选）

可以创建一个 Node.js 脚本来初始化一些默认分类：

```typescript
// scripts/seed-content-categories.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const categories = [
    { name: '设计趋势', slug: 'design-trends', description: '设计行业趋势和洞察', order: 1 },
    { name: '案例研究', slug: 'case-studies', description: '成功案例和项目展示', order: 2 },
    { name: '常见问题', slug: 'faq', description: '常见问题解答', order: 3 },
    { name: '关于我们', slug: 'about', description: '公司介绍和团队', order: 4 },
  ];

  for (const cat of categories) {
    await prisma.contentCategory.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  console.log('内容分类初始化完成');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

运行脚本：

```bash
npx tsx scripts/seed-content-categories.ts
```

### 2. 验证迁移

```sql
-- 检查表是否创建成功
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('contents', 'content_revisions', 'content_comments', 'content_categories');

-- 检查索引
SELECT indexname FROM pg_indexes 
WHERE tablename IN ('contents', 'content_revisions', 'content_comments', 'content_categories');
```

## 回滚方案

如果需要回滚迁移：

```bash
# 查看迁移历史
npx prisma migrate status

# 回滚到指定迁移
npx prisma migrate resolve --rolled-back add_content_management

# 手动删除表（如果自动回滚失败）
DROP TABLE IF EXISTS content_comments;
DROP TABLE IF EXISTS content_revisions;
DROP TABLE IF EXISTS contents;
DROP TABLE IF EXISTS content_categories;
```

## 注意事项

1. **slug 唯一性**：确保每个内容的 slug 都是唯一的，建议在应用层添加验证逻辑。

2. **软删除**：`Content` 表使用 `deletedAt` 实现软删除，查询时需要过滤已删除的记录。

3. **SEO 字段**：`seo` 字段存储 JSON 对象，包含 `metaTitle`、`metaDescription`、`keywords` 等。

4. **内容格式**：支持 HTML 和 Markdown 两种格式，通过 `contentFormat` 字段区分。

5. **版本历史**：每次修改内容时，可以创建新的 `ContentRevision` 记录来保存历史版本。

6. **评论审核**：评论默认需要审核（`approved = false`），管理员审核通过后才能显示。

7. **分类关联**：内容可以关联到 `ContentCategory`，也可以通过 `category` 字段存储简单的分类字符串。

8. **推荐排序**：使用 `featuredOrder` 控制首页推荐内容的显示顺序，数字越小越靠前。

## 使用示例

### 创建文章

```typescript
const content = await prisma.content.create({
  data: {
    slug: 'design-trends-2024',
    type: 'article',
    title: '2024 设计趋势',
    subtitle: '探索最新的设计方向',
    excerpt: '本文介绍了 2024 年最重要的设计趋势...',
    content: '<h1>2024 设计趋势</h1><p>...</p>',
    contentFormat: 'html',
    featuredImage: 'https://example.com/image.jpg',
    category: '设计趋势',
    tags: ['设计趋势', '品牌策划', 'UI设计'],
    authorId: 'user_123',
    status: 'published',
    publishedAt: new Date(),
    seo: {
      metaTitle: '2024 设计趋势 - VCMA',
      metaDescription: '探索 2024 年最重要的设计趋势和方向',
      keywords: '设计趋势,2024,品牌策划',
    },
    isFeatured: true,
    featuredOrder: 1,
    categoryId: 'cat_123',
  },
});
```

### 创建版本历史

```typescript
const revision = await prisma.contentRevision.create({
  data: {
    contentId: 'content_123',
    title: '2024 设计趋势（更新）',
    revisionContent: '<h1>2024 设计趋势</h1><p>更新后的内容...</p>',
    revisedById: 'user_456',
    changeNote: '更新了第三章节的内容',
  },
});
```

### 创建评论

```typescript
const comment = await prisma.contentComment.create({
  data: {
    contentId: 'content_123',
    userId: 'user_789',
    comment: '这篇文章很有价值！',
    rating: 5,
    approved: false, // 需要管理员审核
  },
});
```

## 后续开发建议

1. **API 接口**：创建内容管理的 CRUD API 接口
2. **富文本编辑器**：集成富文本编辑器（如 TinyMCE、Quill 等）
3. **SEO 优化**：实现 SEO 字段的自动生成和优化
4. **评论系统**：实现评论的审核、回复等功能
5. **版本对比**：实现版本历史的对比和恢复功能
6. **内容搜索**：实现全文搜索功能
7. **访问统计**：实现更详细的访问统计和分析
