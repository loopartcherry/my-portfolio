"use client";

import React from "react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Star, Check, X, ChevronLeft, ChevronRight, ShoppingCart, 
  Zap, ArrowRight, Plus, Minus, ChevronDown, Quote, Download,
  Clock, FileText, Palette, Video, RefreshCw, MessageCircle,
  CheckCircle2, Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Footer } from "@/components/sections/footer";

interface TemplateItem {
  name: string;
  pages: number;
  description: string;
  features: string[];
}

interface Product {
  id: number;
  name: string;
  nameEn: string;
  description: string;
  longDescription: string;
  category: string;
  price: number;
  originalPrice: number;
  images: string[];
  rating: number;
  sales: number;
  forWho: string[];
  painPoints: string[];
  benefits: string[];
  templates: TemplateItem[];
  bonusResources: { icon: React.ReactNode; title: string; description: string }[];
  testimonial: { quote: string; author: string; title: string };
  selfCheck: string[];
  afterPurchase: string[];
  faq: { question: string; answer: string }[];
}

const products: Record<string, Product> = {
  "1": {
    id: 1,
    name: "ToB融资PPT专业模板（5套）",
    nameEn: "ToB Pitch Deck Pro Bundle",
    description: "专为ToB企业设计的融资路演模板，助力8亿+融资",
    longDescription: "这是一套经过100+融资成功企业验证的专业PPT模板套装。5套风格、500+页内容，2小时即可完成一套专业级融资BP，帮助你在投资人面前脱颖而出。",
    category: "ppt",
    price: 299,
    originalPrice: 999,
    images: ["/images/product-ppt.jpg", "/images/case-ai.jpg", "/images/case-data.jpg", "/images/case-cloud.jpg"],
    rating: 4.9,
    sales: 1280,
    forWho: [
      "即将融资的创业者",
      "需要快速产出专业PPT的创始人",
      "预算有限但对质量有要求的团队",
    ],
    painPoints: [
      "花3天做的PPT还是被说不专业",
      "网上的模板太ToC，不适合科技企业",
      "请设计师太贵（动辄几万），周期还长",
    ],
    benefits: [
      "2小时完成一套专业级融资PPT",
      "5套风格满足不同场合（路演/BP/产品介绍）",
      "服务过100+融资成功的企业验证的结构",
    ],
    templates: [
      {
        name: "通用融资版",
        pages: 80,
        description: "适合各类ToB企业的标准融资BP模板",
        features: ["公司介绍", "商业模式", "市场分析", "团队介绍", "财务预测"],
      },
      {
        name: "科技感版",
        pages: 100,
        description: "适合AI/大数据/云计算等硬科技企业",
        features: ["深色系配色", "图表炫酷", "数据可视化强", "科幻风格"],
      },
      {
        name: "简约商务版",
        pages: 80,
        description: "适合SaaS/企业服务类公司",
        features: ["浅色系配色", "突出数据", "清晰简洁", "专业稳重"],
      },
      {
        name: "高端定制版",
        pages: 120,
        description: "适合C轮+或上市路演",
        features: ["精致动画", "顶级质感", "品牌感强", "细节丰富"],
      },
      {
        name: "数据驱动版",
        pages: 120,
        description: "适合需要大量数据展示的企业",
        features: ["50+可编辑图表", "数据可视化", "信息图表", "对比分析"],
      },
    ],
    bonusResources: [
      { icon: <FileText className="w-5 h-5" />, title: "图标库（200+）", description: "统一风格的商务图标" },
      { icon: <Palette className="w-5 h-5" />, title: "图表库（50+）", description: "可编辑数据图表" },
      { icon: <Palette className="w-5 h-5" />, title: "配色方案（10套）", description: "专业配色预设" },
      { icon: <FileText className="w-5 h-5" />, title: "字体打包", description: "商用授权字体" },
      { icon: <Video className="w-5 h-5" />, title: "使用指南视频", description: "30分钟快速上手" },
    ],
    testimonial: {
      quote: "用这套模板2小时就做完了，投资人说是他见过最专业的BP之一，顺利拿到3000万A轮。",
      author: "某SaaS创始人",
      title: "A轮融资成功",
    },
    selfCheck: [
      "我即将开始融资/路演",
      "我没有专业设计师",
      "我愿意投入299元提升PPT质量",
      "我需要快速产出（1-3天内）",
    ],
    afterPurchase: [
      "立即下载全部源文件（PPT + Keynote）",
      "30分钟免费使用指导（预约）",
      "1年免费更新",
      "7天无理由退款",
    ],
    faq: [
      { 
        question: "我不会设计，能用吗？", 
        answer: "可以。只需要替换文字和图片，保持原有排版即可。附送视频教程。" 
      },
      { 
        question: "可以商用吗？", 
        answer: "可以。购买后拥有终身商用授权（不可二次售卖）。" 
      },
      { 
        question: "支持修改吗？", 
        answer: "完全可编辑，支持自定义颜色/字体/布局。" 
      },
      { 
        question: "和定制服务比有什么区别？", 
        answer: "定制服务是完全从0开始设计（3-8万，2-4周）。这套模板是标准化产品（299元，2小时），适合预算有限或时间紧急的场景。如需定制，可以先购买模板试用，后续升级定制服务可抵扣此费用。" 
      },
    ],
  },
  "2": {
    id: 2,
    name: "VCMA可视化设计规范",
    nameEn: "VCMA Design System",
    description: "完整的ToB可视化设计系统，包含组件库和规范文档",
    longDescription: "基于VCMA方法论打造的完整设计系统，帮助ToB企业建立统一的视觉语言。从色彩体系到组件规范，从图标设计到数据可视化，一站式解决企业设计标准化问题。",
    category: "design",
    price: 499,
    originalPrice: 999,
    images: ["/images/product-design-system.jpg", "/images/case-ai.jpg", "/images/case-data.jpg", "/images/case-cloud.jpg"],
    rating: 5.0,
    sales: 386,
    forWho: [
      "需要建立设计规范的ToB企业",
      "希望提升产品视觉一致性的设计团队",
      "正在进行品牌升级的公司",
    ],
    painPoints: [
      "产品视觉不统一，每个页面风格都不同",
      "设计师交接困难，规范只在脑子里",
      "开发还原度低，设计稿和上线效果差距大",
    ],
    benefits: [
      "建立统一的设计语言，提升品牌专业度",
      "减少重复设计工作，提高团队效率40%",
      "降低沟通成本，设计开发协作更顺畅",
    ],
    templates: [
      {
        name: "完整设计规范文档",
        pages: 50,
        description: "从设计原则到实施指南",
        features: ["设计原则", "色彩系统", "字体规范", "间距系统"],
      },
      {
        name: "Figma组件库",
        pages: 100,
        description: "100+可复用组件",
        features: ["Auto Layout", "Variants", "响应式", "暗色模式"],
      },
      {
        name: "数据可视化规范",
        pages: 30,
        description: "图表设计完整指南",
        features: ["图表选择", "颜色映射", "标注规范", "交互规范"],
      },
    ],
    bonusResources: [
      { icon: <FileText className="w-5 h-5" />, title: "图标库（200+）", description: "统一风格图标" },
      { icon: <Palette className="w-5 h-5" />, title: "案例示范", description: "真实项目应用" },
      { icon: <Video className="w-5 h-5" />, title: "视频教程", description: "规范落地指南" },
    ],
    testimonial: {
      quote: "引入这套设计规范后，我们团队的设计效率提升了50%，产品的视觉一致性也得到了显著改善。",
      author: "李华",
      title: "某SaaS公司设计总监",
    },
    selfCheck: [
      "你的团队有2人以上的设计师",
      "你的产品有多个模块或页面",
      "你希望建立统一的设计标准",
      "你愿意投入时间学习和实施规范",
    ],
    afterPurchase: [
      "立即下载全部源文件",
      "3个月免费答疑支持",
      "终身免费更新",
      "7天无理由退款",
    ],
    faq: [
      { question: "包含哪些设计工具的文件？", answer: "主要提供Figma格式，同时提供Sketch版本和PDF规范文档。" },
      { question: "可以根据品牌定制吗？", answer: "当然可以，规范文档都是可编辑的，您可以根据自己的品牌调性进行定制。" },
      { question: "团队多人使用需要多份授权吗？", answer: "一份购买支持同一公司内的团队使用，无需多次购买。" },
      { question: "有售后支持吗？", answer: "提供3个月的免费答疑支持，帮助您更好地落地设计规范。" },
    ],
  },
};

const defaultProduct = products["1"];

const relatedProducts = [
  { id: 3, name: "数据可视化工具包", price: 199, image: "/images/product-toolkit.jpg" },
  { id: 4, name: "ToB可视化设计实战课", price: 899, image: "/images/product-course.jpg" },
];

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const product = products[id] || defaultProduct;
  
  const [currentImage, setCurrentImage] = useState(0);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [expandedTemplate, setExpandedTemplate] = useState<number | null>(0);
  const [checkedItems, setCheckedItems] = useState<boolean[]>(new Array(product.selfCheck.length).fill(false));
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [purchaseStep, setPurchaseStep] = useState<'form' | 'processing' | 'success'>('form');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });

  const handleCheckItem = (index: number) => {
    const newChecked = [...checkedItems];
    newChecked[index] = !newChecked[index];
    setCheckedItems(newChecked);
  };

  const checkedCount = checkedItems.filter(Boolean).length;
  const isGoodFit = checkedCount >= 3;
  const totalPages = product.templates.reduce((sum, t) => sum + t.pages, 0);

  const handlePurchase = () => {
    setShowPurchaseModal(true);
    setPurchaseStep('form');
  };

  const handleAddToCart = () => {
    // 简单的购物车提示
    alert(`已将 ${product.name} 加入购物车！`);
  };

  const handleSubmitPurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    setPurchaseStep('processing');
    
    // 模拟支付处理
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setPurchaseStep('success');
    
    // 3秒后自动关闭
    setTimeout(() => {
      setShowPurchaseModal(false);
      setPurchaseStep('form');
      setFormData({ name: '', email: '', phone: '' });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-background page-enter">
      <main className="pt-4 pb-32 page-enter-content">
        {/* Breadcrumb */}
        <div className="px-2 md:px-4 lg:px-8 xl:px-32 py-6">
          <div>
            <nav className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/shop" className="hover:text-foreground transition-colors">产品商店</Link>
              <span>/</span>
              <span className="text-foreground">{product.name}</span>
            </nav>
          </div>
        </div>

        {/* Product Hero */}
        <section className="px-2 md:px-4 lg:px-8 xl:px-32">
          <div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
              {/* Images */}
              <div>
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4 bg-card border border-border/30">
                  <Image
                    src={product.images[currentImage] || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                  <button
                    onClick={() => setCurrentImage((prev) => (prev - 1 + product.images.length) % product.images.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur flex items-center justify-center hover:bg-background transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setCurrentImage((prev) => (prev + 1) % product.images.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur flex items-center justify-center hover:bg-background transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex gap-3">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentImage(i)}
                      className={cn(
                        "relative w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors",
                        currentImage === i ? "border-primary" : "border-transparent hover:border-border"
                      )}
                    >
                      <Image src={img || "/placeholder.svg"} alt="" fill className="object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Info */}
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={cn("w-4 h-4", i < Math.floor(product.rating) ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground/30")} />
                    ))}
                    <span className="ml-2 text-sm text-muted-foreground">{product.rating}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{product.sales}+ 已购</span>
                </div>

                <h1 className="text-3xl md:text-4xl font-light mb-2">{product.name}</h1>
                <p className="text-sm font-mono text-muted-foreground/60 mb-4">{product.nameEn}</p>
                <p className="text-muted-foreground mb-8">{product.longDescription}</p>

                {/* Price */}
                <div className="flex items-baseline gap-4 mb-6">
                  <span className="text-lg text-muted-foreground/50 line-through">原价 ¥{product.originalPrice}</span>
                </div>
                <div className="flex items-baseline gap-4 mb-8">
                  <span className="text-sm text-muted-foreground">限时</span>
                  <span className="text-5xl font-bold text-primary">¥{product.price}</span>
                </div>

                {/* Buttons */}
                <div className="flex gap-4 mb-8">
                  <button 
                    onClick={handlePurchase}
                    className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors text-lg"
                  >
                    <Zap className="w-5 h-5" />
                    立即购买 ¥{product.price}
                  </button>
                  <button 
                    onClick={handleAddToCart}
                    className="flex items-center justify-center gap-2 px-6 py-4 border border-border/50 rounded-xl text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    加入购物车
                  </button>
                </div>

                {/* After Purchase */}
                <div className="p-4 rounded-xl bg-card/30 border border-border/30">
                  <p className="text-sm font-medium mb-3">购买后你将获得</p>
                  <div className="space-y-2">
                    {product.afterPurchase.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-green-500 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* For Who */}
        <section className="px-6 md:px-12 lg:px-20 mt-24">
          <div>
            <h2 className="text-2xl font-light mb-8">为谁准备？</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {product.forWho.map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-5 rounded-xl bg-card/30 border border-border/30">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                  <span className="text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pain Points */}
        <section className="px-6 md:px-12 lg:px-20 mt-16">
          <div>
            <h2 className="text-2xl font-light mb-8">你的痛点</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {product.painPoints.map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-5 rounded-xl bg-red-500/5 border border-red-500/20">
                  <X className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                  <span className="text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="px-6 md:px-12 lg:px-20 mt-16">
          <div>
            <h2 className="text-2xl font-light mb-8">这套模板能帮你什么？</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {product.benefits.map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-5 rounded-xl bg-green-500/5 border border-green-500/20">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                  <span className="text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Templates Included */}
        <section className="px-6 md:px-12 lg:px-20 mt-24">
          <div>
            <div className="flex items-baseline justify-between mb-8">
              <h2 className="text-2xl font-light">包含什么？</h2>
              <span className="text-sm text-muted-foreground font-mono">共 {totalPages}+ 页</span>
            </div>
            
            {/* Templates Accordion */}
            <div className="space-y-3 mb-8">
              {product.templates.map((template, i) => (
                <div key={i} className="rounded-xl border border-border/30 overflow-hidden">
                  <button
                    onClick={() => setExpandedTemplate(expandedTemplate === i ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-secondary/30 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm font-mono">
                        {i + 1}
                      </span>
                      <div>
                        <span className="font-medium">{template.name}</span>
                        <span className="text-muted-foreground ml-2">（{template.pages}页）</span>
                      </div>
                    </div>
                    <ChevronDown className={cn(
                      "w-5 h-5 text-muted-foreground transition-transform",
                      expandedTemplate === i && "rotate-180"
                    )} />
                  </button>
                  {expandedTemplate === i && (
                    <div className="px-5 pb-5 pt-0">
                      <p className="text-muted-foreground mb-4 pl-12">{template.description}</p>
                      <div className="flex flex-wrap gap-2 pl-12">
                        {template.features.map((feature, j) => (
                          <span key={j} className="px-3 py-1 text-xs rounded-full bg-secondary text-muted-foreground">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Bonus Resources */}
            <h3 className="text-lg font-light mb-4">配套资源</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {product.bonusResources.map((resource, i) => (
                <div key={i} className="p-4 rounded-xl bg-card/30 border border-border/30 text-center">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
                    {resource.icon}
                  </div>
                  <p className="text-sm font-medium mb-1">{resource.title}</p>
                  <p className="text-xs text-muted-foreground">{resource.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonial */}
        <section className="px-6 md:px-12 lg:px-20 mt-24">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-light mb-8">真实案例</h2>
            <div className="relative p-8 md:p-12 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20">
              <Quote className="absolute top-6 left-6 w-10 h-10 text-primary/20" />
              <p className="text-lg md:text-xl text-foreground/90 mb-6 pl-8 italic">
                "{product.testimonial.quote}"
              </p>
              <div className="flex items-center gap-4 pl-8">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <span className="text-lg font-medium">{product.testimonial.author.charAt(0)}</span>
                </div>
                <div>
                  <p className="font-medium">—— {product.testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{product.testimonial.title}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Self Check */}
        <section className="px-6 md:px-12 lg:px-20 mt-24">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-light mb-2">适合你吗？（自检清单）</h2>
            <p className="text-muted-foreground mb-8">如果3个以上打勾，这套模板非常适合你</p>
            <div className="space-y-3 mb-6">
              {product.selfCheck.map((item, i) => (
                <label
                  key={i}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all",
                    checkedItems[i]
                      ? "bg-primary/10 border-primary/30"
                      : "bg-card/30 border-border/30 hover:border-border"
                  )}
                >
                  <input
                    type="checkbox"
                    checked={checkedItems[i]}
                    onChange={() => handleCheckItem(i)}
                    className="w-5 h-5 rounded border-border accent-primary"
                  />
                  <span className={cn(checkedItems[i] ? "text-foreground" : "text-muted-foreground")}>{item}</span>
                </label>
              ))}
            </div>
            <div className={cn(
              "p-4 rounded-xl text-center",
              isGoodFit ? "bg-green-500/10 border border-green-500/30" : "bg-secondary/50"
            )}>
              {isGoodFit ? (
                <p className="text-green-500 font-medium">这套模板非常适合你！({checkedCount}/{product.selfCheck.length} 匹配)</p>
              ) : (
                <p className="text-muted-foreground">继续勾选，看看匹配度 ({checkedCount}/{product.selfCheck.length})</p>
              )}
            </div>
          </div>
        </section>

        {/* Price CTA */}
        <section className="px-6 md:px-12 lg:px-20 mt-24">
          <div className="max-w-4xl mx-auto">
            <div className="p-8 md:p-12 rounded-2xl bg-card/50 border border-border/30 text-center">
              <p className="text-muted-foreground/50 line-through mb-2">原价 ¥{product.originalPrice}</p>
              <p className="text-muted-foreground mb-2">限时优惠价</p>
              <div className="flex items-baseline justify-center gap-2 mb-8">
                <span className="text-6xl font-bold text-primary">¥{product.price}</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={handlePurchase}
                  className="flex items-center justify-center gap-2 px-12 py-4 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors text-lg"
                >
                  <Zap className="w-5 h-5" />
                  立即购买 ¥{product.price}
                </button>
                <button 
                  onClick={handleAddToCart}
                  className="flex items-center justify-center gap-2 px-8 py-4 border border-border/50 rounded-xl text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
                >
                  <ShoppingCart className="w-5 h-5" />
                  加入购物车
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="px-6 md:px-12 lg:px-20 mt-24">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-light mb-8">常见问题</h2>
            <div className="space-y-3">
              {product.faq.map((item, i) => (
                <div key={i} className="rounded-xl border border-border/30 overflow-hidden">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-secondary/30 transition-colors"
                  >
                    <span className="font-medium">Q：{item.question}</span>
                    <ChevronDown className={cn(
                      "w-5 h-5 text-muted-foreground transition-transform shrink-0",
                      expandedFaq === i && "rotate-180"
                    )} />
                  </button>
                  {expandedFaq === i && (
                    <div className="px-5 pb-5 pt-0">
                      <p className="text-muted-foreground">A：{item.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Related Products */}
        <section className="px-6 md:px-12 lg:px-20 mt-24">
          <div>
            <h2 className="text-2xl font-light mb-8">买了这个的人还买了</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedProducts.map((item) => (
                <Link
                  key={item.id}
                  href={`/shop/${item.id}`}
                  className="group flex items-center gap-6 p-4 rounded-xl border border-border/30 hover:border-primary/30 transition-colors"
                >
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden shrink-0">
                    <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium mb-2 group-hover:text-primary transition-colors">{item.name}</h3>
                    <p className="text-lg font-bold text-primary">¥{item.price}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Custom CTA */}
        <section className="px-6 md:px-12 lg:px-20 mt-24">
          <div className="max-w-4xl mx-auto">
            <div className="p-8 md:p-12 rounded-2xl bg-gradient-to-br from-accent/10 to-primary/10 border border-accent/20">
              <h3 className="text-2xl font-light mb-4">需要更个性化的方案？</h3>
              <p className="text-muted-foreground mb-6">如果你需要：</p>
              <ul className="space-y-2 mb-8">
                <li className="flex items-center gap-3 text-muted-foreground">
                  <Check className="w-5 h-5 text-accent shrink-0" />
                  针对你的企业深度定制
                </li>
                <li className="flex items-center gap-3 text-muted-foreground">
                  <Check className="w-5 h-5 text-accent shrink-0" />
                  战略层面的品牌规划
                </li>
                <li className="flex items-center gap-3 text-muted-foreground">
                  <Check className="w-5 h-5 text-accent shrink-0" />
                  持续的设计支持
                </li>
              </ul>
              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-accent-foreground rounded-xl font-medium hover:bg-accent/90 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                预约1对1咨询（首次免费）
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Purchase Modal */}
      {showPurchaseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-card border border-border/30 rounded-2xl shadow-xl overflow-hidden">
            {purchaseStep === 'form' && (
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-light">确认购买</h3>
                  <button
                    onClick={() => setShowPurchaseModal(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-secondary transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="mb-6 p-4 rounded-xl bg-secondary/30 border border-border/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">商品</span>
                    <span className="font-medium">{product.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">价格</span>
                    <span className="text-xl font-bold text-primary">¥{product.price}</span>
                  </div>
                </div>

                <form onSubmit={handleSubmitPurchase} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">姓名</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-secondary/50 border border-border/30 rounded-xl focus:outline-none focus:border-primary transition-colors"
                      placeholder="请输入您的姓名"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">邮箱</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-secondary/50 border border-border/30 rounded-xl focus:outline-none focus:border-primary transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">手机号</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-secondary/50 border border-border/30 rounded-xl focus:outline-none focus:border-primary transition-colors"
                      placeholder="13800138000"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
                  >
                    <Zap className="w-5 h-5" />
                    确认支付 ¥{product.price}
                  </button>
                </form>
              </div>
            )}

            {purchaseStep === 'processing' && (
              <div className="p-12 text-center">
                <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
                <h3 className="text-xl font-light mb-2">正在处理支付...</h3>
                <p className="text-sm text-muted-foreground">请稍候，我们正在为您处理订单</p>
              </div>
            )}

            {purchaseStep === 'success' && (
              <div className="p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-2xl font-light mb-2">购买成功！</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  我们已将下载链接发送至您的邮箱：{formData.email}
                </p>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• 请查收邮件获取下载链接</p>
                  <p>• 如有问题，请联系客服</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
