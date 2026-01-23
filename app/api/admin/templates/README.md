# 模板管理 API 文档

## 概述

模板管理 API 提供完整的模板上传、更新、分类管理、统计等功能。所有端点仅限管理员（Admin）访问。

## 认证

所有端点需要管理员权限，通过 `requireAdmin` 中间件验证。

## API 端点列表

### 1. 获取所有模板（管理员视图）

**GET** `/api/admin/templates`

**查询参数：**
- `status` (可选): `'draft' | 'published' | 'archived'` - 按状态筛选
- `category` (可选): `string` - 按分类筛选（slug 或 ID）
- `search` (可选): `string` - 搜索（名称、描述、作者）
- `sortBy` (可选): `'createdAt' | 'downloads' | 'rating' | 'views' | 'price'` - 排序
- `page` (可选): `number` - 页码（默认 1）
- `limit` (可选): `number` - 每页数量（默认 20）

**响应示例：**
```json
{
  "success": true,
  "data": [
    {
      "id": "template_123",
      "name": "Logo模板 001",
      "description": "现代风格Logo设计模板",
      "categories": [
        { "id": "cat_1", "name": "Logo设计", "slug": "logo" }
      ],
      "preview": ["https://example.com/preview1.jpg"],
      "price": 99,
      "discount": 0.8,
      "downloads": 150,
      "likes": 45,
      "rating": 4.5,
      "tags": ["现代", "简洁"],
      "author": "张三",
      "status": "published",
      "views": 1200,
      "isFeatured": true,
      "uploadedBy": { "id": "user_1", "name": "管理员", "email": "admin@example.com" },
      "reviewsCount": 12,
      "downloadsCount": 150,
      "createdAt": "2024-01-01T00:00:00Z",
      "publishedAt": "2024-01-02T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

---

### 2. 获取单个模板详情

**GET** `/api/admin/templates/[id]`

**响应示例：**
```json
{
  "success": true,
  "data": {
    "id": "template_123",
    "name": "Logo模板 001",
    "description": "现代风格Logo设计模板",
    "categories": [...],
    "preview": [...],
    "files": [
      { "format": "AI", "url": "...", "size": 1024000 }
    ],
    "price": 99,
    "downloads": 150,
    "rating": 4.5,
    "reviews": [
      {
        "id": "review_1",
        "rating": 5,
        "comment": "非常好用",
        "helpful": 10,
        "user": { "id": "user_2", "name": "客户A" },
        "createdAt": "2024-01-10T00:00:00Z"
      }
    ],
    "recentDownloads": [...],
    "stats": {
      "totalReviews": 12,
      "totalDownloads": 150
    }
  }
}
```

---

### 3. 上传新模板

**POST** `/api/admin/templates`

**请求体（JSON）：**
```json
{
  "name": "Logo模板 001",
  "description": "现代风格Logo设计模板",
  "categoryIds": ["cat_1", "cat_2"],
  "price": 99,
  "discount": 0.8,
  "tags": ["现代", "简洁", "科技"],
  "author": "张三",
  "status": "draft",
  "previewUrls": ["https://example.com/preview1.jpg"],
  "fileUrls": [
    { "format": "AI", "url": "https://example.com/file.ai", "size": 1024000 }
  ]
}
```

**或使用 multipart/form-data：**
- `name`: 模板名称
- `description`: 描述
- `categoryIds`: JSON 字符串数组
- `price`: 价格
- `tags`: JSON 字符串数组
- `author`: 作者
- `previewUrls`: JSON 字符串数组（从上传 API 获取）
- `fileUrls`: JSON 字符串数组（从上传 API 获取）

**注意：** 文件上传应使用 `/api/admin/templates/upload` 端点先上传文件，获取 URL 后再创建模板。

**响应示例：**
```json
{
  "success": true,
  "data": {
    "id": "template_123",
    "name": "Logo模板 001",
    "status": "draft",
    "createdAt": "2024-01-01T00:00:00Z"
  },
  "message": "模板创建成功"
}
```

---

### 4. 更新模板信息

**PATCH** `/api/admin/templates/[id]`

**请求体：**
```json
{
  "name": "更新后的名称",
  "description": "更新后的描述",
  "categoryIds": ["cat_1"],
  "price": 149,
  "tags": ["新标签"],
  "status": "published"
}
```

---

### 5. 更新模板文件

**POST** `/api/admin/templates/[id]/files`

**请求体（JSON）：**
```json
{
  "fileUrls": [
    { "format": "AI", "url": "https://example.com/new-file.ai", "size": 2048000 }
  ]
}
```

**文件限制：**
- 最大大小：50MB
- 支持格式：AI, PSD, SKETCH, FIGMA, PDF, EPS

---

### 6. 更新模板预览图

**POST** `/api/admin/templates/[id]/previews`

**请求体（JSON）：**
```json
{
  "previewUrls": [
    "https://example.com/preview1.jpg",
    "https://example.com/preview2.jpg"
  ]
}
```

**图片限制：**
- 最大大小：5MB
- 支持格式：JPG, JPEG, PNG, GIF, WEBP

---

### 7. 设置模板为精选/取消精选

**PATCH** `/api/admin/templates/[id]/featured`

**请求体：**
```json
{
  "isFeatured": true,
  "featuredUntil": "2024-02-01T00:00:00Z"
}
```

---

### 8. 发布/下架模板

**PATCH** `/api/admin/templates/[id]/status`

**请求体：**
```json
{
  "status": "published"
}
```

状态值：`'draft' | 'published' | 'archived'`

---

### 9. 删除模板

**DELETE** `/api/admin/templates/[id]`

**响应：**
```json
{
  "success": true,
  "message": "模板已删除"
}
```

---

### 10. 获取模板分类列表

**GET** `/api/admin/templates/categories`

**响应示例：**
```json
{
  "success": true,
  "data": [
    {
      "id": "cat_1",
      "name": "Logo设计",
      "slug": "logo",
      "description": "Logo设计相关模板",
      "icon": "https://example.com/icon.png",
      "order": 1,
      "active": true,
      "templatesCount": 25,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "count": 6
}
```

---

### 11. 创建模板分类

**POST** `/api/admin/templates/categories`

**请求体：**
```json
{
  "name": "Logo设计",
  "slug": "logo",
  "description": "Logo设计相关模板",
  "icon": "https://example.com/icon.png",
  "order": 1,
  "active": true
}
```

---

### 12. 更新模板分类

**PATCH** `/api/admin/templates/categories/[id]`

**请求体：**
```json
{
  "name": "更新后的名称",
  "order": 2,
  "active": false
}
```

---

### 13. 获取模板统计

**GET** `/api/admin/templates/stats`

**响应示例：**
```json
{
  "success": true,
  "data": {
    "totalTemplates": 100,
    "publishedTemplates": 80,
    "draftTemplates": 20,
    "totalDownloads": 5000,
    "averageRating": 4.5,
    "downloadsByCategory": {
      "logo": 2000,
      "vi-system": 1500,
      "website": 1500
    },
    "popularTemplates": [
      {
        "id": "template_1",
        "name": "热门模板",
        "downloads": 500,
        "rating": 4.8,
        "views": 3000,
        "categories": [...]
      }
    ]
  }
}
```

---

### 14. 批量操作

**POST** `/api/admin/templates/batch-action`

**请求体：**
```json
{
  "action": "publish",
  "templateIds": ["template_1", "template_2", "template_3"]
}
```

**操作类型：**
- `publish`: 批量发布
- `archive`: 批量下架
- `delete`: 批量删除

---

### 15. 文件上传

**POST** `/api/admin/templates/upload`

**请求体（multipart/form-data）：**
- `type`: `"design" | "preview"` - 文件类型
- `files`: `File[]` - 文件数组

**响应示例：**
```json
{
  "success": true,
  "data": {
    "type": "design",
    "files": [
      {
        "url": "https://example.com/uploads/file.ai",
        "format": "AI",
        "size": 1024000,
        "filename": "template.ai"
      }
    ]
  },
  "message": "成功上传 1 个文件"
}
```

**注意：** 实际文件上传需要集成存储服务（AWS S3、阿里云 OSS 等）。当前实现返回模拟 URL，需要替换为实际的上传逻辑。

---

## 错误码说明

| 状态码 | 错误码 | 说明 |
|--------|--------|------|
| 400 | `VALIDATION_ERROR` | 数据验证失败 |
| 400 | `UNSUPPORTED_CONTENT_TYPE` | 不支持的 Content-Type |
| 400 | `INVALID_FILE_FORMAT` | 不支持的文件格式 |
| 400 | `FILE_TOO_LARGE` | 文件大小超过限制 |
| 400 | `NO_FILES` | 未提供文件 |
| 400 | `INVALID_TYPE` | 无效的文件类型 |
| 400 | `UNSUPPORTED_ACTION` | 不支持的操作 |
| 401 | `UNAUTHORIZED` | 未认证 |
| 403 | `FORBIDDEN` | 权限不足（非管理员） |
| 404 | `TEMPLATE_NOT_FOUND` | 模板不存在 |
| 404 | `CATEGORY_NOT_FOUND` | 分类不存在 |
| 404 | `SOME_TEMPLATES_NOT_FOUND` | 部分模板不存在 |
| 404 | `SOME_CATEGORIES_NOT_FOUND` | 部分分类不存在 |
| 422 | `SLUG_EXISTS` | slug 已存在 |

---

## 文件上传流程

1. **上传文件**：
   ```
   POST /api/admin/templates/upload
   Content-Type: multipart/form-data
   
   type=design
   files=[文件1, 文件2]
   ```

2. **获取文件 URL**：
   ```json
   {
     "files": [
       { "url": "https://...", "format": "AI", "size": 1024 }
     ]
   }
   ```

3. **创建模板**：
   ```
   POST /api/admin/templates
   {
     "name": "...",
     "fileUrls": [从步骤2获取的URL]
   }
   ```

---

## 数据验证

所有请求都使用 Zod 进行验证：

- **查询参数**：通过 `validateTemplateListQuery` 验证
- **请求体**：通过对应的 Schema 验证（`CreateTemplateSchema`、`UpdateTemplateSchema` 等）

验证失败返回 `400 VALIDATION_ERROR`，包含详细的错误信息。

---

## 注意事项

1. **文件上传**：
   - 当前实现使用模拟 URL，需要集成实际的存储服务
   - 设计文件限制：50MB，支持 AI, PSD, SKETCH, FIGMA, PDF, EPS
   - 预览图限制：5MB，支持 JPG, PNG, GIF, WEBP

2. **分类关联**：
   - 模板可以关联多个分类（多对多关系）
   - 通过 `TemplateCategoryTemplate` 中间表管理

3. **状态管理**：
   - `draft`: 草稿（未发布）
   - `published`: 已发布
   - `archived`: 已下架

4. **精选推荐**：
   - `isFeatured`: 是否精选
   - `featuredUntil`: 精选截止时间（可选）

5. **统计字段**：
   - `downloads`: 下载次数（可聚合 `TemplateDownload` 更新）
   - `rating`: 平均评分（可聚合 `TemplateReview` 更新）
   - `views`: 浏览次数（需在查看模板时更新）

---

## 文件结构

```
app/api/admin/templates/
├── route.ts                    # GET 列表, POST 创建
├── upload/route.ts            # POST 文件上传
├── stats/route.ts             # GET 统计
├── batch-action/route.ts      # POST 批量操作
├── categories/
│   ├── route.ts               # GET 列表, POST 创建
│   └── [id]/route.ts          # PATCH 更新
└── [id]/
    ├── route.ts               # GET 详情, PATCH 更新, DELETE 删除
    ├── files/route.ts         # POST 更新文件
    ├── previews/route.ts      # POST 更新预览图
    ├── featured/route.ts      # PATCH 设置精选
    └── status/route.ts        # PATCH 更新状态
```
