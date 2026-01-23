"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  ArrowRight,
  Sparkles,
  Gift,
  Calendar,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Header } from "@/components/sections/header";
import { Footer } from "@/components/sections/footer";

const PLANS = [
  {
    id: "standard",
    name: "STANDARD",
    nameZh: "标准版",
    description: "单项目并行，随时暂停或取消",
    price: 3998,
    period: "month",
    features: [
      "无限设计请求",
      "1个并发项目",
      "5年+资深设计师",
      "平均48小时交付",
      "无限修改次数",
      "随时暂停或取消",
    ],
    recommended: false,
  },
  {
    id: "professional",
    name: "PROFESSIONAL",
    nameZh: "专业版",
    description: "双倍并发，效率翻番",
    price: 5998,
    period: "month",
    features: [
      "无限设计请求",
      "2个并发项目",
      "8年+设计总监",
      "平均48小时交付",
      "无限修改次数",
      "随时暂停或取消",
      "优先响应支持",
    ],
    recommended: true,
    badge: "最受欢迎",
  },
  {
    id: "business",
    name: "定制项目",
    nameZh: "按需定价",
    description: "创始人团队主导，一次性项目定制",
    price: null,
    priceText: "¥15,000起",
    period: "project",
    features: [
      "创始人团队主导",
      "定制化设计方案",
      "战略级咨询服务",
      "前沿设计理念",
    ],
    recommended: false,
    isCustom: true,
    referral: {
      title: "推荐返佣",
      description: "推荐好友订阅，每月获得5%持续返佣",
      percent: "+5%",
    },
  },
];

const FAQ_ITEMS = [
  {
    question: "什么是并发请求限制？",
    answer:
      "并发请求指同时处于进行中状态的项目数量。Standard 版最多支持 1 个，Professional 版最多支持 2 个。当项目完成后，配额会自动释放。",
  },
  {
    question: "交付时间是如何计算的？",
    answer:
      "平均 48 小时交付指的是大多数设计任务的完成时间。具体时间取决于项目复杂度，简单的 Logo 设计可能 24 小时完成，复杂的品牌手册可能需要 3-5 个工作日。",
  },
  {
    question: "可以随时暂停订阅吗？",
    answer:
      "可以！只要您当前没有进行中的项目，就可以随时暂停订阅。暂停期间不会扣费，订阅时间会自动顺延。",
  },
  {
    question: "支持哪些支付方式？",
    answer:
      "我们支持微信支付、支付宝、信用卡支付。订阅会自动续费，您可以随时在账户设置中关闭自动续费。",
  },
];

const COMPARISON_FEATURES = [
  { name: "设计请求次数", standard: "无限", professional: "无限", business: "定制" },
  { name: "并发项目数", standard: "1个", professional: "2个", business: "不限" },
  { name: "设计师级别", standard: "资深 5年+", professional: "总监 8年+", business: "创始人" },
  { name: "交付时间", standard: "48小时", professional: "48小时", business: "优先" },
  { name: "修改次数", standard: "无限", professional: "无限", business: "无限" },
  { name: "战略咨询", standard: "-", professional: "-", business: "包含" },
];

export default function PricingPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-background noise-overlay">
      <Header />

      {/* Compact Hero */}
      <section className="relative pt-28 pb-12 px-6 md:px-12 lg:px-20">
        <div className="relative max-w-7xl mx-auto text-center">
          <div
            className={cn(
              "inline-flex items-center gap-3 mb-6 transition-all duration-700",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            <span className="text-xs font-mono text-primary tracking-widest">PRICING</span>
            <div className="w-8 h-px bg-primary/50" />
            <span className="text-xs font-mono text-muted-foreground/60">订阅定价</span>
          </div>

          <h1
            className={cn(
              "text-3xl md:text-4xl lg:text-5xl font-extralight leading-tight mb-4 transition-all duration-700 delay-100",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            灵活订阅，<span className="text-primary">按需付费</span>
          </h1>

          <p
            className={cn(
              "text-base text-muted-foreground/60 max-w-md mx-auto transition-all duration-700 delay-200",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            无隐藏费用，随时暂停或取消
          </p>
        </div>
      </section>

      {/* Pricing Cards - 3 Columns */}
      <section className="px-6 md:px-12 lg:px-20 pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-6">
            {PLANS.map((plan, index) => (
              <Card
                key={plan.id}
                className={cn(
                  "relative p-6 lg:p-8 transition-all duration-500 group flex flex-col",
                  "bg-[#0a0a0f] border-white/5",
                  "hover:border-primary/30",
                  plan.recommended && "border-primary/40 ring-1 ring-primary/20"
                )}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Recommended badge */}
                {plan.recommended && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground px-3 py-1 font-mono text-[10px]">
                      <Sparkles className="w-3 h-3 mr-1" />
                      {plan.badge}
                    </Badge>
                  </div>
                )}

                {/* Plan header */}
                <div className="mb-6">
                  <h3 className="text-sm font-mono tracking-wider text-white/50 mb-1">
                    {plan.name}
                  </h3>
                  <p className="text-xs text-white/30">{plan.description}</p>
                </div>

                {/* Price */}
                <div className="mb-6">
                  {plan.price ? (
                    <div className="flex items-baseline">
                      <span className="text-xs text-white/40 mr-1">¥</span>
                      <span className="text-4xl font-extralight text-white">
                        {plan.price.toLocaleString()}
                      </span>
                      <span className="text-white/40 ml-2 text-sm">/{plan.period}</span>
                    </div>
                  ) : (
                    <div>
                      <span className="text-3xl font-extralight text-white">
                        {plan.priceText}
                      </span>
                      <span className="text-white/40 ml-2 text-sm">/{plan.period}</span>
                    </div>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-2.5 mb-6 flex-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-primary/70 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-white/50">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Referral section for custom plan */}
                {plan.isCustom && plan.referral && (
                  <div className="mb-6 p-4 rounded-lg bg-white/[0.02] border border-white/5">
                    <div className="flex items-center gap-3 mb-2">
                      <Gift className="w-4 h-4 text-accent" />
                      <span className="text-sm text-white/70">{plan.referral.title}</span>
                      <span className="text-lg font-light text-accent ml-auto">
                        {plan.referral.percent}
                      </span>
                    </div>
                    <p className="text-xs text-white/40">{plan.referral.description}</p>
                  </div>
                )}

                {/* CTA Buttons */}
                <div className="space-y-3 mt-auto">
                  {plan.isCustom ? (
                    <>
                      <Link href="/shop/1" className="block">
                        <Button
                          className="w-full font-mono text-xs tracking-wider bg-accent/10 hover:bg-accent/20 text-accent border border-accent/30"
                          size="lg"
                        >
                          <Calendar className="w-4 h-4 mr-2" />
                          支付定金 · 立即预约
                        </Button>
                      </Link>
                      <Link href="/about#contact" className="block">
                        <Button
                          variant="ghost"
                          className="w-full font-mono text-xs tracking-wider text-white/50 hover:text-white/70"
                        >
                          先咨询了解
                          <ArrowRight className="w-3 h-3 ml-2" />
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <Link href="/register" className="block">
                      <Button
                        className={cn(
                          "w-full font-mono text-xs tracking-wider",
                          plan.recommended
                            ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                            : "bg-white/5 hover:bg-white/10 text-white/70 border border-white/10"
                        )}
                        size="lg"
                      >
                        立即订阅
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="px-6 md:px-12 lg:px-20 py-20 bg-[#08080c]">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-extralight mb-2">功能对比</h2>
            <p className="text-sm text-white/40">了解每个计划的差异</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-4 font-mono text-xs text-white/40">功能</th>
                  <th className="text-center p-4 font-mono text-xs text-white/60">Standard</th>
                  <th className="text-center p-4 font-mono text-xs bg-primary/5 text-primary">
                    Professional
                  </th>
                  <th className="text-center p-4 font-mono text-xs text-white/60">定制项目</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_FEATURES.map((feature, index) => (
                  <tr
                    key={index}
                    className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="p-4 text-sm text-white/50">{feature.name}</td>
                    <td className="p-4 text-center text-sm text-white/60">
                      {feature.standard}
                    </td>
                    <td className="p-4 text-center text-sm bg-primary/5 text-white/80">
                      {feature.professional}
                    </td>
                    <td className="p-4 text-center text-sm text-white/60">
                      {feature.business}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 md:px-12 lg:px-20 py-20">
        <div className="max-w-3xl mx-auto">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-extralight mb-2">常见问题</h2>
            <p className="text-sm text-white/40">关于订阅服务的常见疑问</p>
          </div>

          <Accordion type="single" collapsible className="space-y-3">
            {FAQ_ITEMS.map((item, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-[#0a0a0f] border border-white/5 rounded-lg px-5 data-[state=open]:border-primary/20"
              >
                <AccordionTrigger className="text-left text-sm font-light hover:no-underline hover:text-primary transition-colors py-4">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-white/40 leading-relaxed pb-4">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Compact CTA */}
      <section className="px-6 md:px-12 lg:px-20 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-white/40 mb-4">还不确定哪个计划适合你？</p>
          <Link href="/method">
            <Button
              variant="outline"
              className="font-mono text-xs border-primary/30 hover:bg-primary/10 text-primary bg-transparent"
            >
              免费诊断
              <ArrowRight className="w-3 h-3 ml-2" />
            </Button>
          </Link>
          <p className="text-xs text-white/30 mt-3">8分钟了解你的可视化成熟度等级</p>
        </div>
      </section>

      <Footer />
    </div>
  );
}

