# VCMA 诊断系统完整文档

## 概述

实现了完整的 VCMA 诊断系统闭环：**诊断测试 → 生成报告 → 预约/付费包**

## 数据模型

### Diagnosis（诊断记录）

```prisma
model Diagnosis {
  id              String   @id @default(cuid())
  userId          String?  // 如果用户已登录
  companyInfo     Json?    // 企业信息
  answers         Json     // 诊断答案（16个问题，1-4分）
  totalScore      Int      // 总分（16-64）
  level           Int      // 成熟度等级（1-4）
  levelName       String   // 等级名称
  percentile      Int?     // 行业百分位
  dimensionScores Json     // 各维度得分
  reportGenerated Boolean  // 报告是否已生成
  contactEmail    String?  // 联系方式（未登录用户）
  contactPhone    String?
  contactName     String?
  consultations   Consultation[] // 关联的咨询预约
}
```

### Consultation（咨询预约）

```prisma
model Consultation {
  id            String     @id @default(cuid())
  diagnosisId   String     // 关联的诊断记录
  userId        String?    // 如果用户已登录
  name          String     // 姓名
  email         String     // 邮箱
  phone         String     // 手机号
  company       String?    // 企业名称
  position      String?    // 职位
  preferredDate DateTime?  // 首选日期
  preferredTime String?    // 首选时间
  message       String?    // 留言
  type          String     // 'expert' | 'solution' | 'custom'
  status        String     // 'pending' | 'confirmed' | 'completed' | 'cancelled'
  assignedToId  String?    // 分配的顾问
  confirmedAt   DateTime?
  completedAt   DateTime?
  notes         String?    // 管理员备注
}
```

## API 端点

### 1. 提交诊断

**POST** `/api/diagnosis/submit`

- 公开接口，无需认证
- 请求体：
  ```json
  {
    "companyInfo": {
      "name": "企业名称",
      "industry": "AI/算法",
      "stage": "growth",
      "size": "11-50"
    },
    "answers": {
      "q1": 2,
      "q2": 3,
      // ... 共16个问题
    },
    "contactInfo": {
      "name": "姓名",
      "email": "email@example.com",
      "phone": "13800138000"
    }
  }
  ```
- 自动计算得分、等级、百分位
- 返回诊断ID和结果

### 2. 获取诊断报告

**GET** `/api/diagnosis/[id]`

- 公开接口
- 返回完整的诊断报告，包括建议

### 3. 创建咨询预约

**POST** `/api/consultations/create`

- 公开接口
- 请求体：
  ```json
  {
    "diagnosisId": "diagnosis_123",
    "name": "张三",
    "email": "zhangsan@example.com",
    "phone": "13800138000",
    "company": "XX科技有限公司",
    "position": "CEO",
    "preferredDate": "2024-02-01",
    "preferredTime": "14:00-15:00",
    "message": "希望了解品牌可视化方案",
    "type": "expert"
  }
  ```

### 4. 管理员获取诊断记录

**GET** `/api/admin/diagnoses?status=with_consultation&page=1&limit=20`

- 仅 Admin
- 查询参数：
  - `status`: `all` | `with_consultation` | `no_consultation`
  - `page`: 页码
  - `limit`: 每页数量
- 返回诊断记录列表，包含用户信息、联系方式、预约信息

## 诊断计算逻辑

### 得分计算

- **各维度得分**：该维度4个问题的得分之和（4-16分）
  - V1 品牌可视化：q1 + q2 + q3 + q4
  - V2 技术可视化：q5 + q6 + q7 + q8
  - V3 产品可视化：q9 + q10 + q11 + q12
  - V4 数据可视化：q13 + q14 + q15 + q16

- **总分**：4个维度得分之和（16-64分）

### 等级判定

- **L1 缺失期**：总分 ≤ 24
- **L2 初建期**：25 ≤ 总分 ≤ 40
- **L3 成熟期**：41 ≤ 总分 ≤ 52
- **L4 领先期**：53 ≤ 总分 ≤ 64

### 建议生成

根据各维度得分自动生成改善建议：
- 得分 ≤ 8：紧急建议（urgent）
- 得分 ≤ 10：中期建议（medium）
- 得分 > 10：优化建议（optimize）

## 前端页面

### 1. 诊断问卷页面

**路径：** `/diagnosis`

- 多步骤问卷（4个维度，16个问题）
- 企业信息表单（可选）
- 提交后调用 `/api/diagnosis/submit`
- 跳转到分析页面

### 2. 分析中页面

**路径：** `/diagnosis/analyzing`

- 显示分析进度动画
- 完成后跳转到报告页面（带诊断ID）

### 3. 诊断报告页面

**路径：** `/diagnosis/results?id=diagnosis_123`

- 从API获取诊断数据
- 显示总分、等级、雷达图
- 各维度详细分析
- **转化入口**：
  - "预约专家咨询"按钮 → 打开预约对话框
  - "购买专属服务包"按钮 → 跳转到 `/pricing`

### 4. 预约对话框

**组件：** `components/diagnosis/consultation-dialog.tsx`

- 收集用户联系信息
- 选择咨询类型和时间
- 提交到 `/api/consultations/create`

### 5. 管理员诊断记录页面

**路径：** `/admin/diagnoses`

- 显示所有诊断记录
- 搜索和筛选功能
- 显示用户信息、联系方式、预约状态
- 分页显示

## 数据追踪

管理员后台可以查看：

1. **诊断记录列表**：
   - 诊断ID、得分、等级
   - 用户信息（如果已登录）
   - 企业信息
   - 联系方式（未登录用户）
   - 诊断时间

2. **预约信息**：
   - 每个诊断记录关联的咨询预约
   - 预约状态、时间、联系方式

3. **购买信息**：
   - 通过用户ID关联到订单和订阅
   - 查看用户的购买历史

## 使用流程

1. **用户填写诊断问卷** → `/diagnosis`
2. **提交诊断** → 后端计算得分并保存
3. **查看报告** → `/diagnosis/results?id=...`
4. **转化操作**：
   - 点击"预约专家咨询" → 填写预约表单 → 保存到 Consultation 表
   - 点击"购买专属服务包" → 跳转到定价页面
5. **管理员查看** → `/admin/diagnoses` → 查看所有记录和预约信息

## 数据库迁移

运行以下命令更新数据库：

```bash
npx prisma migrate dev --name add_diagnosis_consultation
npx prisma generate
```

## 注意事项

1. **未登录用户**：可以完成诊断，但需要提供联系方式
2. **已登录用户**：诊断记录自动关联到用户账号
3. **预约管理**：管理员可以在后台查看和分配顾问
4. **数据统计**：可以基于诊断数据生成行业报告和趋势分析
