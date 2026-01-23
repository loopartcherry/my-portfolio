"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowRight,
  Star,
  Check,
  X,
  Zap,
  TrendingUp,
  Clock,
  Shield,
  Users,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Header } from "@/components/sections/header";
import { Footer } from "@/components/sections/footer";

const plans = [
  {
    id: "basic",
    name: "基础改善套餐",
    tag: "快速见效",
    price: "88,000",
    originalPrice: "128,000",
    discount: "限时69折",
    period: "2-4周",
    expectedLift: "+6分 → Level 2+",
    roi: "650%",
    suitable: "Level 1-2 企业，预算有限但急需改善",
    values: [
      { icon: Zap, title: "2周快速见效", desc: "消除最严重短板" },
      { icon: TrendingUp, title: "提升6-8分", desc: "达到Level 2+" },
    ],
    features: ["基础VI系统设计", "融资BP升级（30页）", "官网首页设计", "技术PPT模板库（20套）"],
    guarantee: ["2轮修改", "3个月售后", "7天不满意退款"],
  },
  {
    id: "system",
    name: "系统提升套餐",
    tag: "推荐",
    recommended: true,
    price: "198,000",
    installment: "或66,000×3期",
    period: "3-6个月",
    expectedLift: "+12分 → Level 3",
    roi: "580%",
    suitable: "Level 2 企业，需要系统化改善",
    values: [
      { icon: Clock, title: "3-6个月系统建设", desc: "建立完整体系" },
      { icon: TrendingUp, title: "提升10-12分", desc: "达到Level 3" },
    ],
    features: ["完整VI系统设计", "品牌设计系统搭建", "官网完整设计（10+页面）", "产品UI设计规范", "设计组件库搭建", "数据可视化看板"],
    guarantee: ["无限次修改", "6个月售后", "专属项目经理", "季度复盘优化"],
    bonus: ["VCMA季度复诊", "品牌传播策略咨询", "1年设计资源订阅"],
  },
  {
    id: "enterprise",
    name: "企业定制服务",
    tag: "全面升级",
    price: "500,000起",
    priceNote: "根据企业规模定制报价",
    period: "6-12个月",
    expectedLift: "+15-20分 → Level 4",
    roi: "520%",
    suitable: "Level 3 企业，追求行业卓越",
    values: [
      { icon: Clock, title: "6-12个月全面升级", desc: "建立企业级能力" },
      { icon: TrendingUp, title: "提升15-20分", desc: "达到Level 4" },
    ],
    features: ["系统套餐全部内容", "品牌设计中台搭建", "企业级Design System", "数据可视化大屏", "设计工具链整合", "长期战略咨询"],
    guarantee: ["无限次修改", "12个月售后", "专属服务团队", "月度复盘+战略咨询"],
  },
];

const comparisonRows = [
  { label: "价格", basic: "88,000起", system: "198,000起", enterprise: "500,000起" },
  { label: "周期", basic: "2-4周", system: "3-6个月", enterprise: "6-12个月" },
  { label: "预期提升", basic: "+6分", system: "+12分", enterprise: "+20分" },
  { label: "ROI", basic: "650%", system: "580%", enterprise: "520%" },
  { label: "售后支持", basic: "3个月", system: "6个月", enterprise: "12个月" },
  { label: "项目经理", basic: false, system: true, enterprise: true },
  { label: "复盘优化", basic: false, system: "季度", enterprise: "月度" },
];

const faqs = [
  { q: "如何选择适合的方案？", a: "建议根据VCMA诊断结果选择。Level 1-2选基础套餐，Level 2-3选系统套餐，Level 3+选定制服务。不确定可以预约顾问咨询。" },
  { q: "可以只购买部分服务吗？", a: "可以。我们支持按维度购买，如只做V1品牌可视化。但建议优先解决短板维度，效果更明显。" },
  { q: "支持分期付款吗？", a: "支持。系统套餐及以上支持3期免息分期，企业定制支持按里程碑付款。" },
  { q: "不满意可以退款吗？", a: "支持。签约后7天内不满意可全额退款。交付过程中如不满意可无限次修改（合理范围）。" },
];

export default function DiagnosisSolutionsPage() {
  const [expandedFaqs, setExpandedFaqs] = useState<number[]>([]);
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);

  const toggleFaq = (index: number) => {
    setExpandedFaqs((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]" data-diagnosis>
      <Header />
      <main className="pt-24 pb-20">
        {/* Breadcrumb */}
        <div className="px-6 md:px-12 lg:px-20 mb-8">
          <div className="max-w-6xl mx-auto">
            <nav className="flex items-center gap-2 text-sm text-white/40">
              <Link href="/diagnosis/results" className="hover:text-white/60 flex items-center gap-1">
                <ArrowLeft className="w-4 h-4" />
                诊断结果
              </Link>
              <span>/</span>
              <span className="text-white/60">推荐方案</span>
            </nav>
          </div>
        </div>

        {/* Header */}
        <div className="px-6 md:px-12 lg:px-20 mb-12">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-light text-white mb-3">
              为您匹配的专属解决方案
            </h1>
            <p className="text-white/50 mb-6">基于您的 VCMA 诊断结果智能推荐</p>

            {/* Diagnosis summary */}
            <div className="inline-flex items-center gap-6 p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="text-left">
                <p className="text-xs text-white/40 mb-1">您的核心短板</p>
                <p className="text-white font-medium">V1 品牌可视化：8/16</p>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div className="text-left">
                <p className="text-xs text-white/40 mb-1">推荐方案</p>
                <p className="text-white font-medium">系统提升套餐</p>
                <p className="text-xs text-primary">预期提升：+12分</p>
              </div>
            </div>
          </div>
        </div>

        {/* Plans comparison */}
        <div className="px-6 md:px-12 lg:px-20 mb-16">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  onMouseEnter={() => setHoveredPlan(plan.id)}
                  onMouseLeave={() => setHoveredPlan(null)}
                  className={`relative rounded-2xl border transition-all duration-300 ${
                    plan.recommended
                      ? "border-primary bg-primary/5"
                      : hoveredPlan === plan.id
                      ? "border-white/30 bg-white/[0.03]"
                      : "border-white/10 bg-white/[0.02]"
                  }`}
                >
                  {plan.recommended && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-white text-xs font-medium rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      推荐
                    </div>
                  )}

                  <div className="p-6">
                    {/* Header */}
                    <div className="mb-6">
                      <span className={`inline-block px-2 py-1 text-xs rounded ${plan.recommended ? "bg-primary/10 text-primary" : "bg-white/10 text-white/60"}`}>
                        {plan.tag}
                      </span>
                      <h3 className="text-xl font-medium text-white mt-3">{plan.name}</h3>
                      <p className="text-sm text-white/40 mt-1">{plan.suitable}</p>
                    </div>

                    {/* Price */}
                    <div className="mb-6">
                      {plan.originalPrice && (
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm text-white/40 line-through">{plan.originalPrice}</span>
                          <span className="text-xs text-primary">{plan.discount}</span>
                        </div>
                      )}
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-light text-white">{plan.price}</span>
                        {!plan.priceNote && <span className="text-sm text-white/40">起</span>}
                      </div>
                      {plan.installment && (
                        <p className="text-xs text-white/40 mt-1">{plan.installment}</p>
                      )}
                      {plan.priceNote && (
                        <p className="text-xs text-white/40 mt-1">{plan.priceNote}</p>
                      )}
                    </div>

                    {/* Key metrics */}
                    <div className="space-y-3 mb-6 p-4 bg-white/5 rounded-xl">
                      <div className="flex justify-between text-sm">
                        <span className="text-white/40">周期</span>
                        <span className="text-white">{plan.period}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/40">预期提升</span>
                        <span className="text-white">{plan.expectedLift}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/40">ROI</span>
                        <span className="text-primary font-medium">{plan.roi}</span>
                      </div>
                    </div>

                    {/* Value props */}
                    <div className="space-y-3 mb-6">
                      {plan.values.map((v, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                            <v.icon className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm text-white">{v.title}</p>
                            <p className="text-xs text-white/40">{v.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* CTAs */}
                    <div className="space-y-3">
                      <Link href="/diagnosis/purchase">
                        <Button
                          className={`w-full ${
                            plan.recommended
                              ? "bg-primary hover:bg-primary/90"
                              : "bg-white/10 hover:bg-white/20 text-white"
                          }`}
                        >
                          {plan.id === "enterprise" ? "预约需求沟通" : "立即购买"}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                      <Button variant="outline" className="w-full border-white/20 text-white/60 hover:bg-white/5 bg-transparent">
                        查看详情
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Comparison table */}
        <div className="px-6 md:px-12 lg:px-20 mb-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-light text-white text-center mb-8">方案对比</h2>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="py-4 px-4 text-left text-sm font-medium text-white/40 w-1/4">对比项</th>
                    <th className="py-4 px-4 text-center text-sm font-medium text-white/60">基础套餐</th>
                    <th className="py-4 px-4 text-center text-sm font-medium text-primary bg-primary/5 rounded-t-lg">系统套餐</th>
                    <th className="py-4 px-4 text-center text-sm font-medium text-white/60">定制服务</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row, i) => (
                    <tr key={i} className="border-b border-white/5">
                      <td className="py-4 px-4 text-sm text-white/60">{row.label}</td>
                      <td className="py-4 px-4 text-center text-sm text-white/80">
                        {typeof row.basic === "boolean" ? (
                          row.basic ? <Check className="w-4 h-4 text-primary mx-auto" /> : <X className="w-4 h-4 text-white/20 mx-auto" />
                        ) : row.basic}
                      </td>
                      <td className="py-4 px-4 text-center text-sm text-white bg-primary/5">
                        {typeof row.system === "boolean" ? (
                          row.system ? <Check className="w-4 h-4 text-primary mx-auto" /> : <X className="w-4 h-4 text-white/20 mx-auto" />
                        ) : row.system}
                      </td>
                      <td className="py-4 px-4 text-center text-sm text-white/80">
                        {typeof row.enterprise === "boolean" ? (
                          row.enterprise ? <Check className="w-4 h-4 text-primary mx-auto" /> : <X className="w-4 h-4 text-white/20 mx-auto" />
                        ) : row.enterprise}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Why choose us */}
        <div className="px-6 md:px-12 lg:px-20 mb-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-light text-white text-center mb-8">为什么选择我们</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { icon: Users, title: "专业团队", stats: "50+ 资深设计师" },
                { icon: Shield, title: "专注ToB", stats: "深耕6年" },
                { icon: Star, title: "高满意度", stats: "4.9/5.0" },
                { icon: Zap, title: "持续服务", stats: "季度复盘" },
              ].map((item, i) => (
                <div key={i} className="p-6 bg-white/[0.02] border border-white/10 rounded-xl text-center">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-sm font-medium text-white mb-1">{item.title}</h3>
                  <p className="text-xs text-white/40">{item.stats}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="px-6 md:px-12 lg:px-20 mb-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-light text-white text-center mb-8">常见问题</h2>

            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className="bg-white/[0.02] border border-white/10 rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => toggleFaq(i)}
                    className="w-full p-4 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
                  >
                    <span className="text-white/80">{faq.q}</span>
                    {expandedFaqs.includes(i) ? (
                      <ChevronUp className="w-4 h-4 text-white/40 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-white/40 flex-shrink-0" />
                    )}
                  </button>
                  {expandedFaqs.includes(i) && (
                    <div className="px-4 pb-4">
                      <p className="text-sm text-white/50">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="px-6 md:px-12 lg:px-20">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-light text-white mb-4">准备好提升您的可视化能力了吗？</h2>
            <p className="text-white/40 mb-6">立即开始，2周内看到效果</p>
            <div className="flex items-center justify-center gap-4">
              <Link href="/diagnosis/purchase">
                <Button className="bg-primary hover:bg-primary/90 px-8">
                  立即购买
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Button variant="outline" className="border-white/20 text-white/60 hover:bg-white/5 bg-transparent">
                预约咨询
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

