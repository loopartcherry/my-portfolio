"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowLeft, ArrowUpRight, Calendar, Clock, Check, 
  TrendingUp, Users, Target, Zap, Quote, ChevronRight,
  Layers, Code, BarChart3, Palette
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Header } from "@/components/sections/header";
import { Footer } from "@/components/sections/footer";

const toSlug = (title: string) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

interface CaseDetail {
  id: number;
  title: string;
  subtitle: string;
  client: string;
  tags: string[];
  result: string;
  year: string;
  image: string;
  slug: string;
  challenge: string;
  solution: string[];
  deliverables: string[];
  impact: {
    metric: string;
    value: string;
    description: string;
  }[];
  testimonial: {
    quote: string;
    author: string;
    title: string;
  };
  gallery: string[];
  relatedCases: { id: number; title: string; image: string; result: string }[];
}

const cases: Record<string, CaseDetail> = {
  "cloud-platform-rebrand": {
    id: 1,
    title: "Cloud Platform Rebrand",
    subtitle: "云原生平台品牌升级",
    client: "Top Cloud Provider",
    tags: ["Brand", "Website", "3D"],
    result: "240% Awareness",
    year: "2025",
    image: "/images/case-cloud.jpg",
    slug: "cloud-platform-rebrand",
    challenge: "作为行业领先的云服务提供商，客户面临品牌形象老化、视觉语言不统一的问题。在竞争激烈的市场中，需要一套能够体现技术实力和前瞻性的视觉系统。",
    solution: [
      "建立全新的品牌视觉识别系统，包括Logo、色彩、字体、图标等核心元素",
      "设计响应式官网，突出技术能力和产品优势",
      "创建3D可视化资产库，用于产品展示和营销材料",
      "制定品牌使用规范，确保跨平台一致性"
    ],
    deliverables: [
      "完整VI手册（50页）",
      "响应式官网设计（桌面端+移动端）",
      "3D产品可视化资产（20+场景）",
      "品牌规范文档",
      "营销物料模板库"
    ],
    impact: [
      { metric: "品牌认知度", value: "+240%", description: "6个月内品牌搜索量增长" },
      { metric: "网站转化率", value: "+35%", description: "新官网上线后转化率提升" },
      { metric: "销售线索", value: "+180%", description: "官网带来的高质量线索增长" }
    ],
    testimonial: {
      quote: "这次品牌升级不仅提升了我们的专业形象，更重要的是帮助我们更好地向客户传达技术优势。新官网上线后，销售团队的反馈非常好。",
      author: "CMO",
      title: "某云服务提供商"
    },
    gallery: [
      "/images/case-cloud.jpg",
      "/images/case-ai.jpg",
      "/images/case-data.jpg",
      "/images/case-fintech.jpg"
    ],
    relatedCases: [
      { id: 2, title: "AI Product Visualization", image: "/images/case-ai.jpg", result: "$300M Raised" },
      { id: 3, title: "Data Platform Design System", image: "/images/case-data.jpg", result: "180% Efficiency" }
    ]
  },
  "ai-product-visualization": {
    id: 2,
    title: "AI Product Visualization",
    subtitle: "AI产品全案可视化",
    client: "AI Unicorn",
    tags: ["Product", "Motion", "Interactive"],
    result: "$300M Raised",
    year: "2025",
    image: "/images/case-ai.jpg",
    slug: "ai-product-visualization",
    challenge: "AI独角兽公司需要在融资路演中展示复杂的技术产品，但现有材料无法清晰传达产品价值和技术优势。需要一套能够将抽象AI概念可视化的完整方案。",
    solution: [
      "设计产品演示PPT，用视觉化方式解释AI技术原理和应用场景",
      "创建交互式产品展示页面，让投资人能够直观理解产品",
      "制作产品宣传视频，展示AI产品的实际应用效果",
      "设计数据可视化大屏，展示产品性能和业务指标"
    ],
    deliverables: [
      "融资路演PPT（120页）",
      "交互式产品展示网站",
      "产品宣传视频（3分钟）",
      "数据可视化大屏设计",
      "产品手册和资料包"
    ],
    impact: [
      { metric: "融资额", value: "$300M", description: "成功完成C轮融资" },
      { metric: "投资人反馈", value: "95%", description: "投资人认为产品展示非常专业" },
      { metric: "路演效率", value: "+50%", description: "路演时间缩短，但信息传达更清晰" }
    ],
    testimonial: {
      quote: "这套可视化方案帮助我们成功完成了3亿美元的C轮融资。投资人特别赞赏我们用视觉化方式解释复杂AI技术的能力。",
      author: "CEO",
      title: "某AI独角兽公司"
    },
    gallery: [
      "/images/case-ai.jpg",
      "/images/case-cloud.jpg",
      "/images/case-data.jpg",
      "/images/case-fintech.jpg"
    ],
    relatedCases: [
      { id: 1, title: "Cloud Platform Rebrand", image: "/images/case-cloud.jpg", result: "240% Awareness" },
      { id: 4, title: "FinTech Brand Identity", image: "/images/case-fintech.jpg", result: "2M+ Users" }
    ]
  },
  "data-platform-design-system": {
    id: 3,
    title: "Data Platform Design System",
    subtitle: "数据中台可视化体系",
    client: "FinTech Enterprise",
    tags: ["Dashboard", "Data Viz", "System"],
    result: "180% Efficiency",
    year: "2024",
    image: "/images/case-data.jpg",
    slug: "data-platform-design-system",
    challenge: "金融科技企业的数据中台产品功能复杂，但界面设计不统一，用户体验差。需要建立一套完整的设计系统，提升产品专业度和使用效率。",
    solution: [
      "建立数据可视化设计规范，统一图表、颜色、交互方式",
      "设计组件库，包含100+可复用组件",
      "重构核心数据大屏，提升信息密度和可读性",
      "制定设计开发协作流程，确保设计还原度"
    ],
    deliverables: [
      "设计系统文档（80页）",
      "Figma组件库（100+组件）",
      "数据大屏设计方案（5个场景）",
      "设计开发协作指南",
      "组件使用示例和最佳实践"
    ],
    impact: [
      { metric: "开发效率", value: "+180%", description: "组件复用后开发速度提升" },
      { metric: "设计一致性", value: "95%", description: "跨模块设计一致性评分" },
      { metric: "用户满意度", value: "+42%", description: "产品易用性评分提升" }
    ],
    testimonial: {
      quote: "引入设计系统后，我们的开发效率大幅提升，产品的视觉一致性也得到了显著改善。用户反馈产品看起来更专业了。",
      author: "产品总监",
      title: "某金融科技企业"
    },
    gallery: [
      "/images/case-data.jpg",
      "/images/case-ai.jpg",
      "/images/case-cloud.jpg",
      "/images/case-fintech.jpg"
    ],
    relatedCases: [
      { id: 2, title: "AI Product Visualization", image: "/images/case-ai.jpg", result: "$300M Raised" },
      { id: 4, title: "FinTech Brand Identity", image: "/images/case-fintech.jpg", result: "2M+ Users" }
    ]
  },
  "fintech-brand-identity": {
    id: 4,
    title: "FinTech Brand Identity",
    subtitle: "金融科技品牌重塑",
    client: "Digital Bank",
    tags: ["Brand", "App", "Motion"],
    result: "2M+ Users",
    year: "2024",
    image: "/images/case-fintech.jpg",
    slug: "fintech-brand-identity",
    challenge: "数字银行需要建立全新的品牌形象，既要体现金融的专业性和可信度，又要展现科技的创新和活力。同时需要统一移动端App和Web端的视觉体验。",
    solution: [
      "设计全新的品牌视觉识别系统，平衡金融与科技的双重属性",
      "重构移动端App界面，提升用户体验和品牌感知",
      "设计品牌动效系统，增强产品交互的现代感",
      "建立跨平台设计规范，确保品牌一致性"
    ],
    deliverables: [
      "品牌VI手册（60页）",
      "移动端App UI设计（完整流程）",
      "品牌动效规范文档",
      "Web端设计系统",
      "营销物料设计"
    ],
    impact: [
      { metric: "用户增长", value: "2M+", description: "App上线后6个月用户数" },
      { metric: "品牌认知", value: "+150%", description: "品牌搜索和提及量增长" },
      { metric: "用户留存", value: "+28%", description: "30日留存率提升" }
    ],
    testimonial: {
      quote: "新的品牌形象帮助我们成功吸引了年轻用户群体，App的用户增长超出了预期。品牌动效让产品体验更加现代和流畅。",
      author: "CMO",
      title: "某数字银行"
    },
    gallery: [
      "/images/case-fintech.jpg",
      "/images/case-ai.jpg",
      "/images/case-data.jpg",
      "/images/case-cloud.jpg"
    ],
    relatedCases: [
      { id: 1, title: "Cloud Platform Rebrand", image: "/images/case-cloud.jpg", result: "240% Awareness" },
      { id: 3, title: "Data Platform Design System", image: "/images/case-data.jpg", result: "180% Efficiency" }
    ]
  }
};

export default function PortfolioDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const caseData = cases[slug] || cases["cloud-platform-rebrand"];
  const [currentImage, setCurrentImage] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const tagIcons: Record<string, any> = {
    Brand: Palette,
    Website: Code,
    "3D": Layers,
    Product: Target,
    Motion: Zap,
    Interactive: TrendingUp,
    Dashboard: BarChart3,
    "Data Viz": BarChart3,
    System: Layers,
    App: Code
  };

  return (
    <div className="min-h-screen bg-background noise-overlay scanlines page-enter">
      <Header />
      
      <main className="pt-24 page-enter-content">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
          
          <div className="relative px-2 md:px-4 lg:px-8 xl:px-32">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm font-mono text-muted-foreground/60 mb-10">
              <Link href="/" className="hover:text-primary transition-colors">首页</Link>
              <ChevronRight className="w-3 h-3" />
              <Link href="/portfolio" className="hover:text-primary transition-colors">案例</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-foreground/80 truncate max-w-[200px]">{caseData.title}</span>
            </nav>

            <div>
              {/* Tags & Year */}
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <span className="text-xs font-mono text-muted-foreground/60">{caseData.year}</span>
                <div className="flex flex-wrap gap-2">
                  {caseData.tags.map((tag) => {
                    const Icon = tagIcons[tag] || Layers;
                    return (
                      <span
                        key={tag}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-mono text-primary bg-primary/10 rounded-full border border-primary/20"
                      >
                        <Icon className="w-3 h-3" />
                        {tag}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Title */}
              <h1 
                className={cn(
                  "text-4xl md:text-5xl lg:text-6xl font-extralight leading-[1.1] mb-4 transition-all duration-700",
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                )}
              >
                {caseData.title}
              </h1>
              <p 
                className={cn(
                  "text-lg md:text-xl text-primary/60 font-mono tracking-wide mb-6 transition-all duration-700 delay-100",
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                )}
              >
                {caseData.subtitle}
              </p>

              {/* Client & Result */}
              <div 
                className={cn(
                  "flex flex-wrap items-center gap-8 pt-8 border-t border-border/20 transition-all duration-700 delay-200",
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                )}
              >
                <div>
                  <div className="text-xs font-mono text-muted-foreground/60 mb-1">客户</div>
                  <div className="text-lg font-light">{caseData.client}</div>
                </div>
                <div>
                  <div className="text-xs font-mono text-muted-foreground/60 mb-1">成果</div>
                  <div className="text-lg font-light text-primary">{caseData.result}</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Cover Image */}
        <section className="px-2 md:px-4 lg:px-8 xl:px-32 -mt-4 mb-20">
          <div className="relative aspect-[21/9] rounded-2xl overflow-hidden border border-border/20">
            <Image
              src={caseData.image || "/placeholder.svg"}
              alt={caseData.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
          </div>
        </section>

        {/* Challenge & Solution */}
        <section className="py-20">
          <div className="px-2 md:px-4 lg:px-8 xl:px-32">
            <div>
              <div className="grid md:grid-cols-2 gap-12 mb-20">
                <div>
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-light mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center text-sm font-mono">挑战</span>
                    项目挑战
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">{caseData.challenge}</p>
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-light mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-green-500/10 text-green-500 flex items-center justify-center text-sm font-mono">方案</span>
                    解决方案
                  </h2>
                  <ul className="space-y-3">
                    {caseData.solution.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-muted-foreground">
                        <Check className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Deliverables */}
              <div className="mb-20">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-light mb-8">交付成果</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {caseData.deliverables.map((item, i) => (
                    <div key={i} className="p-4 rounded-xl bg-card/30 border border-border/30">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <span className="text-sm font-medium">{item}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Impact Metrics */}
              <div className="mb-20">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-light mb-8">项目成果</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {caseData.impact.map((metric, i) => (
                    <div key={i} className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/20">
                      <div className="text-xs font-mono text-muted-foreground/60 mb-2">{metric.metric}</div>
                      <div className="text-3xl font-light text-primary mb-2">{metric.value}</div>
                      <div className="text-sm text-muted-foreground">{metric.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Gallery */}
        <section className="py-20 bg-card/30">
          <div className="px-2 md:px-4 lg:px-8 xl:px-32">
            <div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-light mb-8">项目展示</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {caseData.gallery.map((img, i) => (
                  <div key={i} className="relative aspect-[4/3] rounded-xl overflow-hidden border border-border/20">
                    <Image
                      src={img || "/placeholder.svg"}
                      alt={`${caseData.title} - ${i + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonial */}
        <section className="py-20">
          <div className="px-2 md:px-4 lg:px-8 xl:px-32">
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-light mb-8">客户评价</h2>
              <div className="relative p-8 md:p-12 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20">
                <Quote className="absolute top-6 left-6 w-10 h-10 text-primary/20" />
                <p className="text-lg md:text-xl text-foreground/90 mb-6 pl-8 italic">
                  "{caseData.testimonial.quote}"
                </p>
                <div className="flex items-center gap-4 pl-8">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <span className="text-lg font-medium">{caseData.testimonial.author.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-medium">—— {caseData.testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{caseData.testimonial.title}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Cases */}
        <section className="py-20 border-t border-border/20">
          <div className="px-2 md:px-4 lg:px-8 xl:px-32">
            <div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-light mb-8">相关案例</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {caseData.relatedCases.map((related) => (
                  <Link
                    key={related.id}
                    href={`/portfolio/${toSlug(related.title)}`}
                    className="group flex items-center gap-6 p-6 rounded-xl border border-border/30 hover:border-primary/30 transition-colors"
                  >
                    <div className="relative w-32 h-24 rounded-lg overflow-hidden shrink-0">
                      <Image
                        src={related.image || "/placeholder.svg"}
                        alt={related.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium mb-2 group-hover:text-primary transition-colors">{related.title}</h3>
                      <p className="text-sm text-primary">{related.result}</p>
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 border-t border-border/20">
          <div className="px-2 md:px-4 lg:px-8 xl:px-32">
            <div className="text-center" style={{ maxWidth: '900px', margin: '0 auto' }}>
              <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extralight mb-6">
                想了解如何为你的企业打造可视化系统？
              </h2>
              <p className="text-lg text-muted-foreground/70 mb-10">
                免费诊断，了解你的可视化现状和提升空间
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/about#cta"
                  className="flex items-center gap-3 px-8 py-4 text-base font-mono text-primary-foreground bg-primary rounded-full hover:bg-primary/90 transition-all hover:scale-105"
                >
                  免费诊断
                  <ArrowUpRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/portfolio"
                  className="flex items-center gap-3 px-8 py-4 text-base font-mono text-foreground border border-border/30 rounded-full hover:border-primary/50 hover:text-primary transition-all"
                >
                  查看更多案例
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
