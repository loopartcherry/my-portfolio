# 内容管理 API 文档

## 概述

内容管理 API 提供完整的文章/内容创建、更新、发布、版本管理等功能。所有端点仅限管理员（Admin）访问。

## 认证

所有端点需要管理员权限，通过 `requireAdmin` 中间件验证。

## API 端点列表

### 1. 获取文章列表（管理员）

**GET** `/api/admin/contents`

**查询参数：**
- `type` (可选): `'article' | 'case_study' | 'faq' | 'page'` - 按类型筛选
- `status` (可选): `'draft' | 'published' | 'archived'` - 按状态筛选
- `category` (可选): `string` - 按分类筛选（slug 或关键词）
- `search` (可选): `string` - 搜索（标题、副标题、摘要、内容）
- `sortBy` (可选): `'createdAt' | 'publishedAt' | 'views' | 'title'` - 排序
- `page` (可选): `number` - 页码（默认 1）
- `limit` (可选): `number` - 每页数量（默认 20）

**响应示例：**
```json
{
  "success": true,
  "data": [
    {
      "id": "content_123",
      "slug": "design-trends-2024",
      "type": "article",
      "title": "2024 设计趋势",
      "subtitle": "今年设计的 5 个趋势",
      "excerpt": "简要摘要...",
      "featuredImage": "https://example.com/image.jpg",
      "categoryKeyword": "设计趋势",
      "tags": ["2024", "趋势"],
      "author": { "id": "user_1", "name": "管理员", "email": "admin@example.com" },
      "category": { "id": "cat_1", "name": "设计趋势", "slug": "design-trends" },
      "status": "published",
      "views": 1200,
      "isFeatured": true,
      "featuredOrder": 1,
      "publishedAt": "2024-01-15T00:00:00Z",
      "createdAt": "2024-01-01T00:00:00Z",
      "stats": {
        "revisionsCount": 3,
        "commentsCount": 12
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "totalPages": 3
  }
}
```

---

### 2. 获取单篇文章

**GET** `/api/admin/contents/[id]`

**响应示例：**
```json
{
  "success": true,
  "data": {
    "id": "content_123",
    "slug": "design-trends-2024",
    "type": "article",
    "title": "2024 设计趋势",
    "content": "<h1>2024 设计趋势</h1><p>...</p>",
    "contentFormat": "html",
    "seo": {
      "metaTitle": "2024 设计趋势 - VCMA",
      "metaDescription": "探索 2024 年最重要的设计趋势",
      "keywords": "设计趋势,2024,品牌策划"
    },
    "revisions": [
      {
        "id": "rev_1",
        "title": "2024 设计趋势（更新）",
        "revisionContent": "<h1>2024 设计趋势</h1><p>更新后的内容...</p>",
        "revisedBy": { "id": "user_2", "name": "编辑A" },
        "changeNote": "更新了第三章节",
        "revisedAt": "2024-01-10T00:00:00Z"
      }
    ],
    "recentComments": [...],
    "stats": {
      "totalRevisions": 3,
      "totalComments": 12
    }
  }
}
```

---

### 3. 创建新文章

**POST** `/api/admin/contents`

**请求体：**
```json
{
  "slug": "design-trends-2024",
  "type": "article",
  "title": "2024 设计趋势",
  "subtitle": "今年设计的 5 个趋势",
  "excerpt": "简要摘要...",
  "content": "<h2>设计趋势...</h2>",
  "contentFormat": "html",
  "featuredImage": "https://example.com/image.jpg",
  "categoryKeyword": "设计趋势",
  "categoryId": "cat_1",
  "tags": ["2024", "趋势"],
  "seo": {
    "metaTitle": "标题",
    "metaDescription": "描述",
    "keywords": "关键词1,关键词2"
  },
  "status": "draft",
  "isFeatured": false,
  "featuredOrder": 0
}
```

**响应示例：**
```json
{
  "success": true,
  "data": {
    "id": "content_123",
    "slug": "design-trends-2024",
    "title": "2024 设计趋势",
    "status": "draft",
    "createdAt": "2024-01-01T00:00:00Z"
  },
  "message": "文章创建成功"
}
```

---

### 4. 更新文章

**PATCH** `/api/admin/contents/[id]`

**请求体：**
```json
{
  "title": "更新后的标题",
  "content": "<h1>更新后的内容...</h1>",
  "status": "published",
  "tags": ["新标签"],
  "changeNote": "更新了主要内容"
}
```

**注意：** 更新内容或标题时会自动创建版本历史记录。

---

### 5. 发布/下架文章

**PATCH** `/api/admin/contents/[id]/publish`

**请求体：**
```json
{
  "status": "published",
  "publishedAt": "2024-01-15T00:00:00Z"
}
```

状态值：`'draft' | 'published' | 'archived'`

---

### 6. 设置文章为推荐/取消推荐

**PATCH** `/api/admin/contents/[id]/featured`

**请求体：**
```json
{
  "isFeatured": true,
  "featuredOrder": 1
}
```

---

### 7. 删除文章

**DELETE** `/api/admin/contents/[id]`

**注意：** 使用软删除，设置 `deletedAt` 字段，不会真正删除数据。

**响应：**
```json
{
  "success": true,
  "message": "文章已删除"
}
```

---

### 8. 查看版本历史

**GET** `/api/admin/contents/[id]/revisions`

**响应示例：**
```json
{
  "success": true,
  "data": [
    {
      "id": "rev_1",
      "title": "2024 设计趋势（更新）",
      "revisionContent": "<h1>2024 设计趋势</h1><p>更新后的内容...</p>",
      "revisedBy": { "id": "user_2", "name": "编辑A" },
      "changeNote": "更新了第三章节",
      "revisedAt": "2024-01-10T00:00:00Z"
    }
  ],
  "count": 3
}
```

---

### 9. 恢复到历史版本

**POST** `/api/admin/contents/[id]/revisions/[revisionId]/restore`

**响应示例：**
```json
{
  "success": true,
  "data": {
    "id": "content_123",
    "title": "2024 设计趋势",
    "content": "<h1>恢复后的内容...</h1>",
    "updatedAt": "2024-01-20T00:00:00Z"
  },
  "message": "已恢复到指定版本"
}
```

**注意：** 恢复操作会创建新的版本历史记录。

---

### 10. 获取文章分类

**GET** `/api/admin/contents/categories`

**响应示例：**
```json
{
  "success": true,
  "data": [
    {
      "id": "cat_1",
      "name": "设计趋势",
      "slug": "design-trends",
      "description": "设计行业趋势和洞察",
      "icon": "https://example.com/icon.png",
      "order": 1,
      "contentsCount": 25,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "count": 4
}
```

---

### 11. 创建分类

**POST** `/api/admin/contents/categories`

**请求体：**
```json
{
  "name": "设计趋势",
  "slug": "design-trends",
  "description": "设计行业趋势和洞察",
  "icon": "https://example.com/icon.png",
  "order": 1
}
```

---

### 12. 更新分类

**PATCH** `/api/admin/contents/categories/[id]`

**请求体：**
```json
{
  "name": "更新后的名称",
  "order": 2
}
```

---

### 13. 获取文章统计

**GET** `/api/admin/contents/stats`

**响应示例：**
```json
{
  "success": true,
  "data": {
    "totalArticles": 50,
    "publishedArticles": 42,
    "draftArticles": 8,
    "totalViews": 10000,
    "articlesByCategory": {
      "design-trends": 25,
      "case-studies": 15,
      "faq": 10
    },
    "mostViewed": [
      {
        "id": "content_1",
        "title": "热门文章",
        "type": "article",
        "views": 5000,
        "category": { "name": "设计趋势", "slug": "design-trends" }
      }
    ]
  }
}
```

---

### 14. 上传文章配图

**POST** `/api/admin/contents/upload-image`

**请求体（multipart/form-data）：**
- `image`: File - 图片文件

**限制：**
- 最大大小：5MB
- 支持格式：JPG, PNG, GIF, WEBP

**响应示例：**
```json
{
  "success": true,
  "data": {
    "url": "https://example.com/uploads/contents/image.jpg",
    "filename": "image.jpg",
    "size": 1024000,
    "type": "image/jpeg"
  },
  "message": "图片上传成功"
}
```

**注意：** 实际文件上传需要集成存储服务（AWS S3、阿里云 OSS 等）。当前实现返回模拟 URL。

---

## 错误码说明

| 状态码 | 错误码 | 说明 |
|--------|--------|------|
| 400 | `VALIDATION_ERROR` | 数据验证失败 |
| 400 | `NO_IMAGE` | 未提供图片 |
| 400 | `IMAGE_TOO_LARGE` | 图片大小超过限制 |
| 400 | `INVALID_IMAGE_FORMAT` | 不支持的图片格式 |
| 401 | `UNAUTHORIZED` | 未认证 |
| 403 | `FORBIDDEN` | 权限不足（非管理员） |
| 404 | `CONTENT_NOT_FOUND` | 文章不存在 |
| 404 | `CATEGORY_NOT_FOUND` | 分类不存在 |
| 404 | `REVISION_NOT_FOUND` | 版本不存在 |
| 422 | `SLUG_EXISTS` | slug 已存在 |

---

## 数据验证

所有请求都使用 Zod 进行验证：

- **查询参数**：通过 `validateContentListQuery` 验证
- **请求体**：通过对应的 Schema 验证（`CreateContentSchema`、`UpdateContentSchema` 等）

验证失败返回 `400 VALIDATION_ERROR`，包含详细的错误信息。

---

## 业务逻辑说明

### 版本历史

- 更新文章时，如果修改了 `content` 或 `title`，会自动创建版本历史记录
- 版本历史包含：标题、内容、修改人、改动说明、修改时间
- 可以查看所有版本历史
- 可以恢复到任意历史版本（会创建新的版本历史记录）

### 软删除

- 删除文章时使用软删除，设置 `deletedAt` 字段
- 查询时自动过滤已删除的文章（`deletedAt: null`）
- 可以恢复已删除的文章（清除 `deletedAt`）

### SEO 字段

- `seo` 字段存储 JSON 对象，包含：
  - `metaTitle`: 页面标题（用于 SEO）
  - `metaDescription`: 页面描述（用于 SEO）
  - `keywords`: 关键词（逗号分隔）

### 内容格式

- 支持两种格式：`html` 和 `markdown`
- 通过 `contentFormat` 字段区分
- 默认格式为 `html`

### 推荐排序

- `isFeatured`: 是否在首页推荐
- `featuredOrder`: 推荐排序（数字越小越靠前）
- 可以同时设置多个推荐文章

---

## 文件结构

```
app/api/admin/contents/
├── route.ts                    # GET 列表, POST 创建
├── upload-image/route.ts      # POST 上传配图
├── stats/route.ts             # GET 统计
├── categories/
│   ├── route.ts               # GET 列表, POST 创建
│   └── [id]/route.ts          # PATCH 更新
└── [id]/
    ├── route.ts               # GET 详情, PATCH 更新, DELETE 删除
    ├── publish/route.ts       # PATCH 发布/下架
    ├── featured/route.ts     # PATCH 设置推荐
    └── revisions/
        ├── route.ts           # GET 版本历史
        └── [revisionId]/
            └── restore/route.ts # POST 恢复版本
```

---

## 注意事项

1. **slug 唯一性**：每个文章的 slug 必须唯一，用于生成友好的 URL
2. **版本历史**：更新内容或标题时自动创建版本历史，无需手动调用
3. **软删除**：删除操作不会真正删除数据，只是设置 `deletedAt` 字段
4. **图片上传**：当前实现返回模拟 URL，需要集成实际的存储服务
5. **分类关联**：文章可以关联到 `ContentCategory`，也可以通过 `categoryKeyword` 存储简单的分类字符串
6. **内容过期**：可以设置 `expiresAt` 字段，用于自动下架过期内容
