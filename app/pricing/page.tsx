"use client";

import type { FC } from "react";
import Link from "next/link";
import {
  Check,
  ArrowRight,
  FileText,
  Image as ImageIcon,
  BookOpen,
  Palette,
  Code,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Footer } from "@/components/sections/footer";
import { Testimonials } from "@/components/sections/testimonials";

const PLANS = [
  {
    id: "basic",
    name: "基础版",
    tag: "Standard",
    price: "$3,998",
    period: "/month",
    description: "适合初创团队或阶段性设计需求",
    features: [
      "一次只能提交 1 个设计需求",
      "平均 3-5 个工作日交付",
      "支持所有设计类型（品牌、技术、产品、数据）",
      "源文件交付（AI/PSD/Figma）",
      "在线项目管理系统",
      "无限次修改，随时暂停或取消",
    ],
    popular: false,
  },
  {
    id: "pro",
    name: "专业版",
    tag: "Professional",
    price: "$5,998",
    period: "/month",
    description: "适合成长型企业，持续设计需求",
    features: [
      "可以同时提交 2 个设计需求",
      "平均 2-3 个工作日交付",
      "支持所有设计类型（品牌、技术、产品、数据）",
      "源文件 + 使用规范交付",
      "在线项目管理系统",
      "优先处理通道 + 专属设计师",
    ],
    popular: true,
  },
  {
    id: "custom",
    name: "定制项目",
    tag: "Custom Project",
    price: "$9,999+",
    period: "/project",
    description: "适合战略级项目或大型可视化方案",
    features: [
      "一次性战略级项目或大型可视化方案",
      "创始人团队亲自参与",
      "定制交付物与咨询内容",
      "支持采购流程与合同审批",
    ],
    popular: false,
  },
];

const PricingPage: FC = () => (
    <div className="min-h-screen bg-background noise-overlay">
      <main>
        {/* Section 1: Hero */}
        <section className="py-20 text-center px-6 md:px-8 lg:px-10 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            按月订阅，无限设计需求
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            专注 ToB 科技企业可视化提升，让复杂变得清晰，让想法变得可见
          </p>
        </section>

        {/* Section 2: 定价卡片 */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-6 md:px-8 lg:px-10 -mt-[100px]">
            <div className="grid md:grid-cols-3 gap-8">
              {PLANS.map((plan) => (
                <div
                  key={plan.id}
                  className={`rounded-lg p-8 border bg-card/80 backdrop-blur-sm transition hover:shadow-xl flex flex-col justify-between ${
                    plan.popular
                      ? "border-primary/60 ring-2 ring-primary/30 relative"
                      : "border-border/60"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-xs font-medium shadow-lg">
                      🔥 最受欢迎
                    </div>
                  )}

                  <div>
                    <h3 className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-1">
                      {plan.tag}
                    </h3>
                    <h4 className="text-2xl font-bold mb-2">{plan.name}</h4>
                    <p className="text-sm text-muted-foreground mb-6">
                      {plan.description}
                    </p>

                    <div className="mb-6 flex items-baseline gap-2">
                      <span className="text-3xl md:text-4xl font-light text-foreground">
                        {plan.price}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {plan.period}
                      </span>
                    </div>

                    <ul className="space-y-2 mb-8 text-sm text-foreground/80">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-primary mt-0.5" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-4">
                    {plan.id === "custom" ? (
                      <Link href="/about#contact">
                        <Button variant="outline" className="w-full">
                          获取定制报价
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    ) : (
                      <Link href="/register">
                        <Button
                          className={`w-full ${
                            plan.popular
                              ? "bg-primary text-primary-foreground hover:bg-primary/90"
                              : "bg-accent/10 text-accent hover:bg-accent/20 border border-accent/40"
                          }`}
                        >
                          立即订阅
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 4: 详细功能对比表 */}
        <section id="comparison" className="py-16 bg-muted/30">
          <div className="max-w-6xl mx-auto px-6 md:px-8 lg:px-10">
            <h2 className="text-3xl font-bold text-center mb-12">
              功能详细对比
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full bg-card rounded-lg border border-border/60 text-sm">
                <thead>
                  <tr className="border-b border-border/60">
                    <th className="text-left p-4 font-medium">功能</th>
                    <th className="text-center p-4 font-medium">基础版</th>
                    <th className="text-center p-4 font-medium bg-primary/5">
                      专业版
                    </th>
                    <th className="text-center p-4 font-medium">定制项目</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/40">
                    <td className="p-4 font-medium">设计请求数</td>
                    <td className="text-center p-4">无限</td>
                    <td className="text-center p-4 bg-primary/5">无限</td>
                    <td className="text-center p-4">定制</td>
                  </tr>
                  <tr className="border-b border-border/40">
                    <td className="p-4 font-medium">平均交付时间</td>
                    <td className="text-center p-4">3-5 天</td>
                    <td className="text-center p-4 bg-primary/5">2-3 天</td>
                    <td className="text-center p-4">不限</td>
                  </tr>
                  <tr className="border-b border-border/40">
                    <td className="p-4 font-medium">修改次数</td>
                    <td className="text-center p-4">✓ 无限</td>
                    <td className="text-center p-4 bg-primary/5">✓ 无限</td>
                    <td className="text-center p-4">✓ 无限</td>
                  </tr>
                  <tr className="border-b border-border/40">
                    <td className="p-4 font-medium">源文件交付</td>
                    <td className="text-center p-4">✓</td>
                    <td className="text-center p-4 bg-primary/5">✓</td>
                    <td className="text-center p-4">✓</td>
                  </tr>
                  <tr className="border-b border-border/40">
                    <td className="p-4 font-medium">品牌营销设计</td>
                    <td className="text-center p-4">✓</td>
                    <td className="text-center p-4 bg-primary/5">✓</td>
                    <td className="text-center p-4">✓</td>
                  </tr>
                  <tr className="border-b border-border/40">
                    <td className="p-4 font-medium">技术可视化设计</td>
                    <td className="text-center p-4">✓</td>
                    <td className="text-center p-4 bg-primary/5">✓</td>
                    <td className="text-center p-4">✓</td>
                  </tr>
                  <tr className="border-b border-border/40">
                    <td className="p-4 font-medium">产品界面设计</td>
                    <td className="text-center p-4">✓</td>
                    <td className="text-center p-4 bg-primary/5">✓</td>
                    <td className="text-center p-4">✓</td>
                  </tr>
                  <tr className="border-b border-border/40">
                    <td className="p-4 font-medium">数据可视化设计</td>
                    <td className="text-center p-4">✓</td>
                    <td className="text-center p-4 bg-primary/5">✓</td>
                    <td className="text-center p-4">✓</td>
                  </tr>
                  <tr className="border-b border-border/40">
                    <td className="p-4 font-medium">在线项目管理系统</td>
                    <td className="text-center p-4">✓</td>
                    <td className="text-center p-4 bg-primary/5">✓</td>
                    <td className="text-center p-4">✓</td>
                  </tr>
                  <tr className="border-b border-border/40">
                    <td className="p-4 font-medium">实时进度追踪</td>
                    <td className="text-center p-4">✓</td>
                    <td className="text-center p-4 bg-primary/5">✓</td>
                    <td className="text-center p-4">✓</td>
                  </tr>
                  <tr className="border-b border-border/40">
                    <td className="p-4 font-medium">在线反馈与批注</td>
                    <td className="text-center p-4">✓</td>
                    <td className="text-center p-4 bg-primary/5">✓</td>
                    <td className="text-center p-4">✓</td>
                  </tr>
                  <tr className="border-b border-border/40">
                    <td className="p-4 font-medium">优先处理通道</td>
                    <td className="text-center p-4">-</td>
                    <td className="text-center p-4 bg-primary/5">✓</td>
                    <td className="text-center p-4">✓✓</td>
                  </tr>
                  <tr className="border-b border-border/40">
                    <td className="p-4 font-medium">专属设计师</td>
                    <td className="text-center p-4">-</td>
                    <td className="text-center p-4 bg-primary/5">✓</td>
                    <td className="text-center p-4">✓</td>
                  </tr>
                  <tr className="border-b border-border/40">
                    <td className="p-4 font-medium">品牌资产管理库</td>
                    <td className="text-center p-4">-</td>
                    <td className="text-center p-4 bg-primary/5">-</td>
                    <td className="text-center p-4">✓</td>
                  </tr>
                  <tr className="border-b border-border/40">
                    <td className="p-4 font-medium">战略咨询服务</td>
                    <td className="text-center p-4">-</td>
                    <td className="text-center p-4 bg-primary/5">-</td>
                    <td className="text-center p-4">✓</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium">随时暂停/取消</td>
                    <td className="text-center p-4">✓</td>
                    <td className="text-center p-4 bg-primary/5">✓</td>
                    <td className="text-center p-4">✓</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Section 4.5: 4 大业务线（表格） */}
        <section className="py-16 bg-muted/30">
          <div className="max-w-6xl mx-auto px-6 md:px-8 lg:px-10">
            <h2 className="text-3xl font-bold text-center mb-12">
              一个订阅，覆盖 4 大设计业务线
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full bg-card rounded-lg border border-border/60 text-sm">
                <thead>
                  <tr className="border-b border-border/60">
                    <th className="text-left p-4 font-medium w-[140px]">业务线</th>
                    <th className="text-left p-4 font-medium w-[220px]">简介</th>
                    <th className="text-left p-4 font-medium">服务内容</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/40">
                    <td className="p-4 font-medium">品牌营销设计</td>
                    <td className="p-4 text-muted-foreground">
                      建立专业的品牌形象，提升市场认知度
                    </td>
                    <td className="p-4 text-foreground/80">
                      Logo 设计与 VI 系统；宣传册、PPT 与方案排版；办公用品与周边设计；品牌升级与官网重构
                    </td>
                  </tr>
                  <tr className="border-b border-border/40">
                    <td className="p-4 font-medium">技术可视化设计</td>
                    <td className="p-4 text-muted-foreground">
                      快速响应销售需求，支撑销售转化
                    </td>
                    <td className="p-4 text-foreground/80">
                      技术方案 PPT；产品白皮书；技术路线与功能架构图；技术演示视频 / 动效脚本
                    </td>
                  </tr>
                  <tr className="border-b border-border/40">
                    <td className="p-4 font-medium">产品界面设计</td>
                    <td className="p-4 text-muted-foreground">
                      提升用户体验，让产品更易用、更美观
                    </td>
                    <td className="p-4 text-foreground/80">
                      产品 UI/UX 设计；管理后台界面设计；移动端 App 设计；交互原型与设计系统
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium">数据可视化设计</td>
                    <td className="p-4 text-muted-foreground">
                      让数据说话，提升决策效率和说服力
                    </td>
                    <td className="p-4 text-foreground/80">
                      数据大屏与运营看板设计；图表设计与可视化方案优化；信息图表与报告美化；可视化组件库定制
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Section 5: 交付物展示 */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-6 md:px-8 lg:px-10">
            <h2 className="text-3xl font-bold text-center mb-4">你将得到什么？</h2>
            <p className="text-center text-muted-foreground mb-16">
              每个项目完成后，你将获得完整的设计交付物
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2">源文件完整交付</h3>
                <p className="text-sm text-muted-foreground">
                  AI、PSD、Figma 等格式源文件，方便后续二次编辑
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ImageIcon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2">多格式输出文件</h3>
                <p className="text-sm text-muted-foreground">
                  PNG、JPG、SVG、PDF 等多种格式，适配不同场景使用
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2">设计规范文档</h3>
                <p className="text-sm text-muted-foreground">
                  颜色、字体、尺寸等使用说明，确保品牌一致性
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Palette className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2">品牌资产包</h3>
                <p className="text-sm text-muted-foreground">
                  Logo、图标、配色方案等资产，方便团队统一使用
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Code className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2">前端代码片段</h3>
                <p className="text-sm text-muted-foreground">
                  UI 设计项目提供 HTML/CSS 代码，加速开发落地
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Video className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2">设计讲解视频</h3>
                <p className="text-sm text-muted-foreground">
                  设计师录制讲解视频，说明设计思路和使用要点
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 6: 工作流程 */}
        <section className="py-16 bg-muted/30">
          <div className="max-w-6xl mx-auto px-6 md:px-8 lg:px-10">
            <h2 className="text-3xl font-bold text-center mb-4">
              如何开始？简单 4 步
            </h2>
            <p className="text-center text-muted-foreground mb-16">
              从订阅到交付，全程在线协作，透明高效
            </p>

            <div className="max-w-4xl mx-auto space-y-8">
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">选择套餐并订阅</h3>
                  <p className="text-muted-foreground">
                    选择适合你的订阅套餐，完成支付后立即获得专属控制台账号，可以随时查看项目进度、提交需求、下载交付物。
                  </p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">提交设计需求</h3>
                  <p className="text-muted-foreground">
                    在项目管理系统中创建新项目，填写需求描述、上传参考资料、设置优先级。我们会在 1 个工作日内分配合适的设计师。
                  </p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">在线反馈与迭代</h3>
                  <p className="text-muted-foreground">
                    设计师提交初稿后，你可以在线批注、提出修改意见。支持无限次修改，直到你完全满意为止。
                  </p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                  4
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">验收并下载交付物</h3>
                  <p className="text-muted-foreground">
                    确认设计无误后点击“验收通过”，立即获得源文件、导出文件、规范文档等完整交付物，随时下载使用。
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center mt-12">
              <Link href="/register">
                <Button size="lg">立即开始 14 天免费试用 →</Button>
              </Link>
              <p className="text-sm text-muted-foreground mt-4">
                无需信用卡，随时取消
              </p>
            </div>
          </div>
        </section>

        {/* Section 7: FAQ */}
        <section className="py-20">
          <div className="max-w-3xl mx-auto px-6 md:px-8 lg:px-10">
            <h2 className="text-3xl font-bold text-center mb-12">常见问题</h2>

            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left">
                  订阅后多久可以开始提交需求？
                </AccordionTrigger>
                <AccordionContent>
                  订阅付费成功后立即开通账号，你可以马上在控制台提交第一个设计需求。
                  我们会在 1 个工作日内为你分配合适的设计师并开始工作。
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger className="text-left">
                  可以随时取消订阅吗？会扣费吗？
                </AccordionTrigger>
                <AccordionContent>
                  可以随时在控制台取消订阅，取消后不会再扣费。
                  已付费的当月可以继续使用完，月底自动失效。我们不提供按比例退款。
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger className="text-left">
                  设计师的专业水平如何保证？
                </AccordionTrigger>
                <AccordionContent>
                  我们的设计师团队平均 5+ 年 ToB 行业经验，擅长科技、SaaS、数据类产品的视觉设计。
                  每个项目都有审核机制，确保交付质量达标。
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger className="text-left">
                  “无限次修改”是什么意思？
                </AccordionTrigger>
                <AccordionContent>
                  在同一个项目内，你可以对设计稿提出任意次数的修改意见，
                  设计师会根据你的反馈持续优化，直到你完全满意为止。
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6">
                <AccordionTrigger className="text-left">
                  可以申请发票吗？
                </AccordionTrigger>
                <AccordionContent>
                  可以。订阅付费后，在控制台“发票管理”页面填写开票信息，
                  我们会在 3 个工作日内开具增值税专用发票并邮寄或电邮给你。
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-7">
                <AccordionTrigger className="text-left">
                  支持哪些支付方式？
                </AccordionTrigger>
                <AccordionContent>
                  支持支付宝、微信支付、对公转账。企业版客户支持签订合同后月结。
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* Section 8: 客户说（从 About 复用） */}
        <Testimonials />

        {/* Section 9: CTA */}
        <section className="py-20 border-t border-border/60">
          <div className="max-w-3xl mx-auto px-6 md:px-8 lg:px-10 text-center">
            <h2 className="text-3xl font-bold mb-4">
              准备好让设计成为你的增长引擎了吗？
            </h2>
            <p className="text-muted-foreground mb-8">
              订阅后，你将拥有一个随叫随到的「外包设计团队」——而成本只有全职团队的一小部分。
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register" className="w-full sm:w-auto">
                <Button size="lg" className="w-full">
                  立即订阅
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/diagnosis" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full">
                  先做一次免费诊断
                </Button>
              </Link>
            </div>

            <p className="text-xs text-muted-foreground mt-4">
              支持对公转账 · 可签订正式合同 · 支持开具增值税专用发票
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
);
PricingPage.displayName = "PricingPage";

export default PricingPage;
