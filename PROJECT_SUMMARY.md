# 项目全局总结

## 一、代码质量检查

### 1.1 已通过项
- **TypeScript**：构建时类型检查已开启（`next.config.ts` 中 `ignoreBuildErrors: false`），`tsc --noEmit` 通过。
- **Prisma**：所有 API 路由均使用 `@/lib/prisma` 连接真实数据库，无内存假数据。
- **认证与鉴权**：登录/注册/登出/me 均走真实 API，Session 通过 Cookie 持久化。

### 1.2 需关注项
- **ESLint**：存在较多既有告警（如 `@typescript-eslint/no-explicit-any`、`react/no-unescaped-entities`），不影响构建与部署，可逐步修复。
- **部分页面仍用前端 mock**：见下文「功能完整性」与「需替换为真实 API 的页面」。

---

## 二、功能完整性检查

### 2.1 已接真实 API 的功能
| 功能 | 前端页面/入口 | 后端 API | 数据库 |
|------|----------------|----------|--------|
| 登录（邮箱+密码） | `app/login/page.tsx` | `POST /api/auth/login` | ✅ Prisma |
| 注册 | `app/register/page.tsx` | `POST /api/auth/register` | ✅ Prisma |
| 登出 | 各控制台 Header | `POST /api/auth/logout` | ✅ Session |
| 诊断提交 | `app/diagnosis/page.tsx` | `POST /api/diagnosis/submit` | ✅ Prisma |
| 诊断详情 | - | `GET /api/diagnosis/[id]` | ✅ Prisma |
| 模板详情/下载 | `app/templates/[id]`、支付成功页 | `GET /api/templates/[id]`、`/download` | ✅ Prisma |
| 管理员：用户/项目/订单/诊断/模板/内容/设计师 | `app/admin/*` 部分列表 | `app/api/admin/*` | ✅ Prisma |
| 设计师：项目列表/交付 | `app/designer/projects` | `GET /api/designer/projects`、`POST .../deliver` | ✅ Prisma |
| 客户：项目验收 | `app/dashboard/projects/[id]` 验收按钮 | `POST /api/projects/[id]/approve` | ✅ Prisma |
| 通知列表/已读 | `app/dashboard/notifications` | `GET/PATCH /api/notifications*` | ✅ Prisma |
| 订阅升级 | `app/dashboard/subscription/upgrade` | `POST /api/subscriptions/upgrade` | ✅ Prisma |
| 支付成功页订单 | `app/payments/success` | `GET /api/orders/[id]` | ✅ Prisma |

### 2.2 仍使用前端 Mock 的页面（需接真实 API）
| 页面 | 当前状态 | 建议对接 API |
|------|----------|--------------|
| **诊断结果页** `app/diagnosis/results/page.tsx` | 使用本地 `mockResults`，未根据诊断 ID 拉取 | `GET /api/diagnosis/[id]`，用返回数据渲染雷达图、得分、建议等 |
| **客户控制台概览** `app/dashboard/overview/page.tsx` | `mockUser`、`mockStats`、`mockProjects`、`mockTodos`、`mockActivities` | 调用 `GET /api/auth/me`、`GET /api/projects`，统计类可新增 `GET /api/dashboard/stats`（若暂无则保留 mock 或简单计数） |
| **客户-项目列表** `app/dashboard/projects/page.tsx` | `mockProjects` | `GET /api/projects`（已存在，前端改为 fetch 后 setState） |
| **客户-项目详情** `app/dashboard/projects/[id]/page.tsx` | `mockProject`、`mockFiles`、`mockMessages`、`mockStages`、`mockHistory` | `GET /api/projects/[id]`（若需任务/评论则 `GET /api/projects/[id]/comments`、tasks 相关 API） |
| **客户-订单列表** `app/dashboard/orders/page.tsx` | `mockOrders` | `GET /api/orders`（已存在） |
| **客户-订阅页** `app/dashboard/subscription/page.tsx` | `mockSubscription`、`mockPauseHistory` | `GET /api/subscriptions/current`（已存在），暂停/恢复若后端有则对接 |
| **管理员概览** `app/admin/overview/page.tsx` | 部分用 API，失败时回退 `mockRecentUsers`/`mockRecentProjects`，统计用 `mockStats` | 统一用 `GET /api/admin/stats`、用户/项目列表 API，移除 mock 回退 |
| **管理员-订单** `app/admin/orders/page.tsx` | `mockOrders` | `GET /api/admin/orders`（已存在） |
| **管理员-财务** `app/admin/financials/page.tsx` | `mockFinancials` | 需新增 `GET /api/admin/financials` 或从现有 orders/stats 聚合 |
| **管理员-项目列表** `app/admin/projects/page.tsx` | 列表用 API，部分展示用 `mockProjects` | 确保列表与详情均来自 API |
| **设计师-项目列表** `app/designer/projects/page.tsx` | `mockProjects` | `GET /api/designer/projects`（已存在） |
| **设计师-任务看板** `app/designer/tasks/page.tsx` | `mockTasks` | `GET /api/admin/projects/[id]/tasks` 或设计师侧任务 API |

### 2.3 模拟/未实现的功能（需你方补齐）
| 功能 | 位置 | 说明 |
|------|------|------|
| **手机号+验证码登录** | `app/login/page.tsx`（手机登录 Tab） | 前端仅有倒计时 UI，未调用发码/校验接口。需要你提供：**发送短信验证码 API**、**验证码登录或绑定 API**（见下文「下一步需要你做的部分」）。 |
| **支付流程** | `app/api/payments/create-session`、`alipay/checkout`、`app/shop/[id]`、`app/checkout/page.tsx` | 当前为模拟（生成假链接、模拟延迟）。需对接真实支付网关（Stripe/支付宝/微信）并实现回调校验。 |
| **支付回调签名校验** | `app/api/payments/callback/route.ts`、`app/api/subscriptions/renew-callback/route.ts` | 代码内标注 TODO：验证支付平台签名，必须实现后再上线。 |
| **文件/图片存储** | `app/api/admin/contents/upload-image/route.ts`、`lib/api/file-upload.ts` | 当前返回模拟 URL。需集成真实存储（如 AWS S3、阿里云 OSS），并配置相应环境变量。 |
| **订阅续费/自动扣款** | `lib/services/subscription.service.ts`、`app/api/subscriptions/renew-callback` | 部分逻辑为 TODO（自动发起支付、通知）。需与支付网关与通知渠道对接。 |
| **邮件/站内通知** | 多处 TODO（如订阅升级、项目验收、交付） | 需接入邮件服务（SendGrid/阿里云邮件等）或完善站内通知推送。 |

---

## 三、API 与数据库检查

### 3.1 后端 API 与数据库
- **所有 `app/api/**` 路由均使用 `prisma`（`@/lib/prisma`）访问 PostgreSQL（Supabase），无内存假库。**
- 认证：Session 从 Cookie 解析，需登录的接口通过 `getSessionFromRequest()` 等做校验（部分管理员接口需角色判断）。

### 3.2 需你确认或补充的配置
- **DATABASE_URL**：Vercel 上已配置为 Supabase **Session pooler**（IPv4 兼容），并已做 SSL 处理。
- **支付相关**：若接入 Stripe/支付宝/微信，需在 Vercel 配置对应 `STRIPE_*` / `ALIPAY_*` / `WECHAT_*` 等环境变量。
- **存储**：若接入 S3/OSS，需配置 `AWS_*` / `OSS_*` 等。
- **邮件/短信**：若接入发送服务，需配置 `SENDGRID_*` / 短信服务商 Key 等。

---

## 四、补充缺失部分的优先级建议

1. **高优先级（影响核心体验）**
   - **诊断结果页**：根据诊断 ID 调用 `GET /api/diagnosis/[id]`，用返回数据替换 `mockResults`。
   - **客户-项目列表/订单列表**：用 `GET /api/projects`、`GET /api/orders` 替换 mock，保证客户看到真实数据。
   - **支付回调**：实现支付平台签名校验，避免伪造回调。

2. **中优先级（体验与安全）**
   - **客户/管理员/设计师控制台概览**：统一用现有或新增统计 API，去掉 mock。
   - **客户-项目详情、设计师-任务**：用现有项目/任务 API 替换 mock。
   - **文件/图片上传**：接入真实对象存储并写回真实 URL。

3. **低优先级（增强功能）**
   - 手机号+验证码登录（依赖短信 API）。
   - 真实支付网关对接。
   - 邮件/站内通知完善。

---

## 五、下一步需要你做的部分

### 5.1 短信验证码（手机登录/注册）
当前登录页有「手机登录」Tab，仅前端倒计时，**没有**真实发码与校验。需要你提供或对接：

1. **发送短信验证码 API**
   - 建议形式：`POST /api/auth/send-sms`（或你方现有发码接口）。
   - 请求体示例：`{ "phone": "+8613800138000" }`（或你规定的号码格式）。
   - 响应：成功返回 `{ "success": true }` 或带 `requestId`；失败返回错误信息。
   - 后端需调用你方短信服务商（阿里云、腾讯云、Twilio 等），并做频率限制（如 1 分钟 1 次、每日上限）。

2. **手机号+验证码登录（或绑定）API**
   - 建议形式：`POST /api/auth/login-by-sms`。
   - 请求体示例：`{ "phone": "+8613800138000", "code": "123456" }`。
   - 逻辑：校验验证码（与你方发码侧一致，如 Redis 存 key=phone, value=code, TTL=5min）；通过则查/建用户并写 Session，返回用户信息与 role。
   - 若你方已有「验证码校验」接口，可改为前端调该接口后再调现有登录或注册接口完成登录。

**你方需要提供的内容（任选一种即可）：**
- 方案 A：提供「发码接口」与「验码接口」的文档或 URL + 请求/响应格式，由我们在本项目实现 `app/api/auth/send-sms` 与 `app/api/auth/login-by-sms`，并在登录页手机 Tab 里调用。
- 方案 B：你方实现上述两个 API 到现有后端，我们只在前端登录页调用你给的 URL（如 `POST /api/auth/send-sms`、`POST /api/auth/login-by-sms`）。

### 5.2 支付网关
- 确定使用的支付方式（Stripe / 支付宝 / 微信支付等）。
- 提供对应环境的 Key、Secret、回调 URL 要求，以便实现 `create-session`、回调验签与订单状态更新。

### 5.3 文件/图片存储
- 确定存储方案（如 S3 / 阿里云 OSS）。
- 提供 Bucket、Region、访问 Key 等，以便在 `upload-image` 与 `file-upload` 中上传并返回真实 URL。

### 5.4 邮件服务（可选）
- 若需要注册验证、订阅/订单通知等，提供邮件服务（SendGrid/阿里云等）的 API Key 或 SMTP 配置，用于实现 TODO 中的邮件发送。

---

## 六、总结表：真实 API vs Mock

| 类型 | 说明 |
|------|------|
| **后端 API** | 全部使用 Prisma + PostgreSQL，无假数据；支付/回调为模拟或未验签，需你方补齐配置与逻辑。 |
| **前端已接真实 API** | 登录、注册、登出、诊断提交、模板详情/下载、部分管理员/设计师/客户列表与操作、通知、订阅升级、支付成功页订单。 |
| **前端仍用 Mock** | 诊断结果页、客户/管理员/设计师的概览与部分列表/详情、订单列表、订阅页、设计师任务看板等（见 2.2 节）。 |
| **完全未实现/模拟** | 手机验证码登录（缺短信 API）、真实支付、真实文件存储、支付回调验签、部分邮件/通知 TODO。 |

按上述「补充缺失部分」的优先级逐步替换 mock 并对接你提供的短信/支付/存储/邮件能力，即可在保持当前代码质量与数据库一致性的前提下，完成功能完整性与上线安全要求。
