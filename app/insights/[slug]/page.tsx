"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { 
  ArrowLeft, 
  Clock, 
  Calendar, 
  Eye, 
  Share2, 
  Bookmark, 
  ChevronRight,
  ArrowUpRight,
  Twitter,
  Linkedin,
  Link2,
  Check,
  ChevronUp
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Footer } from "@/components/sections/footer";

// Mock article data
const getArticleBySlug = (slug: string) => {
  const articles: Record<string, {
    id: number;
    title: string;
    subtitle: string;
    excerpt: string;
    category: string;
    categoryLabel: string;
    readTime: string;
    date: string;
    image: string;
    views: number;
    author: {
      name: string;
      avatar: string;
      title: string;
      bio: string;
    };
    content: {
      type: 'h2' | 'h3' | 'p' | 'quote' | 'list' | 'code' | 'image';
      content: string;
      items?: string[];
      language?: string;
      caption?: string;
    }[];
    toc: { id: string; title: string; level: number }[];
    relatedArticles: { id: number; title: string; image: string; readTime: string; category: string }[];
  }> = {
    "the-5-core-principles-of-tob-brand-visualization": {
      id: 1,
      title: "ToB企业品牌可视化的5个核心原则",
      subtitle: "The 5 Core Principles of ToB Brand Visualization",
      excerpt: "在竞争激烈的ToB市场中，如何通过视觉系统构建独特的品牌认知？",
      category: "industry",
      categoryLabel: "行业洞察",
      readTime: "8分钟",
      date: "2025年1月15日",
      image: "/images/article-tob-visual.jpg",
      views: 2840,
      author: {
        name: "张三",
        avatar: "/images/avatar.jpg",
        title: "创始人 / 首席设计师",
        bio: "10年ToB可视化设计经验，服务过100+科技企业，专注品牌可视化、数据可视化与产品可视化领域。"
      },
      content: [
        { type: 'h2', content: '为什么ToB企业需要重视可视化' },
        { type: 'p', content: '在数字化转型的浪潮中，ToB企业面临着前所未有的挑战：如何在复杂的技术产品与目标客户之间建立有效的沟通桥梁？答案就是——可视化。' },
        { type: 'p', content: '可视化不仅仅是"好看"，它是一种战略工具，能够帮助企业：降低认知成本、提升品牌价值、加速决策过程。根据我们服务100+企业的经验，拥有优秀可视化系统的企业，其客户转化率平均提升47%。' },
        { type: 'quote', content: '可视化是ToB企业最被低估的竞争优势。当你的竞争对手还在用Excel表格和PPT模板时，一套专业的可视化系统能让你在第一眼就赢得客户的信任。' },
        { type: 'h2', content: '原则一：一致性是信任的基石' },
        { type: 'p', content: '品牌一致性是建立客户信任的第一步。从Logo到网站，从PPT到数据大屏，每一个触点都应该传递统一的视觉语言。' },
        { type: 'list', content: '一致性的关键要素：', items: [
          '色彩系统：主色、辅色、功能色的明确定义与使用规范',
          '字体层级：标题、正文、标注的字体选择与大小规范',
          '间距规律：基于8px网格的间距系统',
          '图形语言：图标风格、插画风格、图表风格的统一'
        ]},
        { type: 'h2', content: '原则二：简化复杂，放大价值' },
        { type: 'p', content: 'ToB产品通常具有较高的技术复杂度，但这不意味着视觉呈现也要复杂。好的可视化设计应该能够将复杂的技术概念转化为直观的视觉表达。' },
        { type: 'image', content: '/images/article-methodology.jpg', caption: '复杂概念的简化表达示例' },
        { type: 'h2', content: '原则三：数据驱动的视觉决策' },
        { type: 'p', content: '不要凭感觉做设计决策。通过A/B测试、用户访谈、热力图分析等方式，用数据验证你的视觉策略是否有效。' },
        { type: 'code', content: `// 数据可视化的核心配置示例
const chartConfig = {
  colors: {
    primary: '#FF6C2E',
    secondary: '#9666FF',
    success: '#10B981',
    warning: '#F59E0B',
  },
  animation: {
    duration: 800,
    easing: 'easeInOutCubic',
  },
  responsive: true,
  maintainAspectRatio: false,
};`, language: 'typescript' },
        { type: 'h2', content: '原则四：建立情感连接' },
        { type: 'p', content: 'B2B不代表没有情感。每一个决策背后都是真实的人，他们有压力、有期待、有情绪。通过恰当的视觉元素，可以在专业性与情感性之间找到平衡。' },
        { type: 'h2', content: '原则五：系统化思维' },
        { type: 'p', content: '不要把每一次设计当作独立的项目。建立一套可扩展、可维护的设计系统，让品牌视觉能够随着企业成长而有机演进。' },
        { type: 'quote', content: '设计系统不是限制创意的枷锁，而是释放创意的杠杆。当基础规范明确后，设计师可以把更多精力放在真正有价值的创新上。' },
        { type: 'h2', content: '总结' },
        { type: 'p', content: '可视化是ToB企业提升竞争力的战略投资。通过遵循以上5个核心原则，你可以构建一套能够持续为企业创造价值的视觉系统。' },
      ],
      toc: [
        { id: 'why', title: '为什么ToB企业需要重视可视化', level: 2 },
        { id: 'principle-1', title: '原则一：一致性是信任的基石', level: 2 },
        { id: 'principle-2', title: '原则二：简化复杂，放大价值', level: 2 },
        { id: 'principle-3', title: '原则三：数据驱动的视觉决策', level: 2 },
        { id: 'principle-4', title: '原则四：建立情感连接', level: 2 },
        { id: 'principle-5', title: '原则五：系统化思维', level: 2 },
        { id: 'summary', title: '总结', level: 2 },
      ],
      relatedArticles: [
        { id: 2, title: '数据可视化设计：从混乱到清晰', image: '/images/article-data-story.jpg', readTime: '12分钟', category: 'methodology' },
        { id: 3, title: '如何用设计思维提升融资BP转化率', image: '/images/article-pitch.jpg', readTime: '10分钟', category: 'case' },
        { id: 5, title: 'VCMA方法论：可视化成熟度诊断', image: '/images/article-methodology.jpg', readTime: '18分钟', category: 'methodology' },
      ]
    },
    "data-visualization-from-chaos-to-clarity": {
      id: 2,
      title: "数据可视化设计：从混乱到清晰",
      subtitle: "Data Visualization: From Chaos to Clarity",
      excerpt: "如何让复杂的数据在 3 秒内被读懂？这篇文章从结构化思维出发，给出一套可落地的数据可视化设计流程。",
      category: "methodology",
      categoryLabel: "方法论",
      readTime: "12分钟",
      date: "2025年1月20日",
      image: "/images/article-methodology.jpg",
      views: 1960,
      author: {
        name: "李四",
        avatar: "/images/avatar.jpg",
        title: "数据可视化设计师",
        bio: "专注数据产品与大屏可视化，擅长将复杂业务指标转化为可洞察的视觉语言。"
      },
      content: [
        { type: "h2", content: "从“数据堆砌”到“故事叙述”" },
        { type: "p", content: "很多企业的数据大屏之所以不好用，不是因为数据不够多，而是因为缺少叙事结构。用户看到的是一堆 KPI，而不是一个完整的业务故事。" },
        { type: "p", content: "一套好的数据可视化，应该能够回答三个问题：现在怎样？为什么会这样？接下来该怎么做？" },
        { type: "h2", content: "三层结构：监控层 / 诊断层 / 行动层" },
        { type: "list", content: "推荐的数据可视化信息架构：", items: [
          "监控层：1 屏内看完关键健康指标（红黄绿）",
          "诊断层：支持按维度/时间/人群的深入分析",
          "行动层：给出可执行的下一步建议或预警"
        ]},
        { type: "h2", content: "图表选型：不要从组件库开始" },
        { type: "p", content: "很多设计师一开始就在组件库里挑图表，这是错误的顺序。正确的顺序应该是：数据 → 问题 → 关系 → 图表。" },
        { type: "code", content: `// 简化版图表选型思路
type QuestionType = "对比" | "趋势" | "占比" | "构成" | "相关性";

const pickChart = (q: QuestionType) => {
  switch (q) {
    case "对比":
      return ["条形图", "柱状图"];
    case "趋势":
      return ["折线图", "面积图"];
    case "占比":
      return ["条形图（推荐）", "环形图"];
    case "构成":
      return ["堆叠柱状图", "瀑布图"];
    case "相关性":
      return ["散点图", "气泡图"];
  }
};`, language: "typescript" },
        { type: "h2", content: "视觉层级：让视线自己走完路径" },
        { type: "p", content: "通过字号、颜色、对比度和留白控制视觉权重，让用户在不用思考的情况下，也能沿着你设计好的路径完成浏览。" },
        { type: "quote", content: "好的数据可视化不是“炫技”，而是“善意”。它帮用户减少思考负担，把注意力放在真正重要的决策上。" },
        { type: "h2", content: "总结" },
        { type: "p", content: "下次再做数据大屏时，不妨从这三个问题开始：谁在看？要做什么决策？希望 3 秒内看到什么？" }
      ],
      toc: [
        { id: "story", title: "从“数据堆砌”到“故事叙述”", level: 2 },
        { id: "structure", title: "三层结构：监控 / 诊断 / 行动", level: 2 },
        { id: "chart", title: "图表选型的正确顺序", level: 2 },
        { id: "visual", title: "视觉层级设计", level: 2 },
        { id: "summary", title: "总结", level: 2 }
      ],
      relatedArticles: [
        { id: 1, title: "ToB企业品牌可视化的5个核心原则", image: "/images/article-brand.jpg", readTime: "8分钟", category: "industry" },
        { id: 3, title: "如何用设计思维提升融资BP转化率", image: "/images/article-pitch.jpg", readTime: "10分钟", category: "case" }
      ]
    },
    "design-thinking-for-pitch-decks": {
      id: 3,
      title: "如何用设计思维提升融资BP转化率",
      subtitle: "Design Thinking for Pitch Decks",
      excerpt: "投资人没有耐心看 40 页 BP，你必须在前 5 页里讲清楚“你是谁、做什么、为什么值得投”。",
      category: "case",
      categoryLabel: "实战案例",
      readTime: "10分钟",
      date: "2025年2月2日",
      image: "/images/article-pitch.jpg",
      views: 1320,
      author: {
        name: "王五",
        avatar: "/images/avatar.jpg",
        title: "品牌与产品顾问",
        bio: "长期服务早期创业公司，专注融资叙事与可视化表达。"
      },
      content: [
        { type: "h2", content: "投资人真正关心什么？" },
        { type: "p", content: "和很多创始人想象的不同，投资人并不在意你 PPT 有多炫，而是在意 3 个问题：赛道够不够大？团队靠不靠谱？模型能不能跑通？" },
        { type: "h2", content: "用用户旅程重构 BP 结构" },
        { type: "p", content: "我们会把 BP 拆成 5 个模块：问题 / 解决方案 / 证明 / 商业模式 / 团队。每一页都只讲一件事，每一页都回答一个关键问题。" },
        { type: "list", content: "每一页都应该清晰回答：", items: [
          "这一页的目的是什么？",
          "看完这一页，希望投资人记住什么？",
          "有没有一个视觉锚点帮助记忆？"
        ]},
        { type: "h2", content: "视觉层面的“可信度设计”" },
        { type: "p", content: "在 BP 设计中，我们更关注“可信度”而不是“创意感”。这意味着要：少用炫技特效，多用真实数据、清晰对比和简单图表。" },
        { type: "quote", content: "一份好的融资 BP，应该像一场结构严谨的对话，而不是一场炫技的 Keynote 表演。" },
        { type: "h2", content: "一个简单可复用的 BP 模板" },
        { type: "p", content: "文章最后，你可以下载我们内部使用的 BP 结构模板，用来快速搭出自己的故事骨架。" }
      ],
      toc: [
        { id: "investor", title: "投资人真正关心什么？", level: 2 },
        { id: "journey", title: "用用户旅程重构 BP 结构", level: 2 },
        { id: "credibility", title: "提升“可信度”的视觉设计", level: 2 },
        { id: "template", title: "可复用的 BP 结构模板", level: 2 }
      ],
      relatedArticles: [
        { id: 1, title: "ToB企业品牌可视化的5个核心原则", image: "/images/article-brand.jpg", readTime: "8分钟", category: "industry" },
        { id: 2, title: "数据可视化设计：从混乱到清晰", image: "/images/article-methodology.jpg", readTime: "12分钟", category: "methodology" }
      ]
    }
  };

  return articles[slug] || Object.values(articles)[0];
};

// Floating particles background
function FloatingParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    let animId: number;
    const particles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number }[] = [];
    
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
      
      particles.length = 0;
      for (let i = 0; i < 40; i++) {
        particles.push({
          x: Math.random() * canvas.offsetWidth,
          y: Math.random() * canvas.offsetHeight,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.15 - 0.1,
          size: 0.5 + Math.random() * 1,
          alpha: 0.1 + Math.random() * 0.2,
        });
      }
    };
    
    resize();
    window.addEventListener("resize", resize);
    
    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);
      
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        
        if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        
        const isOrange = Math.random() > 0.5;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = isOrange 
          ? `rgba(255, 108, 46, ${p.alpha})`
          : `rgba(150, 102, 255, ${p.alpha})`;
        ctx.fill();
      });
      
      animId = requestAnimationFrame(draw);
    };
    
    draw();
    
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animId);
    };
  }, []);
  
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

// Code block component with syntax highlighting
function CodeBlock({ code, language }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className="relative group rounded-xl bg-[#0d0d14] border border-border/30 overflow-hidden my-8">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border/20 bg-secondary/10">
        <span className="text-[10px] font-mono text-muted-foreground/60 tracking-wider uppercase">
          {language || 'code'}
        </span>
        <button 
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground/50 hover:text-primary transition-colors"
        >
          {copied ? <Check className="w-3 h-3" /> : <Link2 className="w-3 h-3" />}
          {copied ? '已复制' : '复制'}
        </button>
      </div>
      <pre className="p-6 overflow-x-auto">
        <code className="text-sm font-mono text-foreground/80 leading-relaxed">
          {code}
        </code>
      </pre>
    </div>
  );
}

// Image with zoom functionality
function ZoomableImage({ src, alt, caption }: { src: string; alt?: string; caption?: string }) {
  const [isZoomed, setIsZoomed] = useState(false);
  
  return (
    <>
      <figure className="my-10">
        <div 
          className="relative aspect-video rounded-xl overflow-hidden cursor-zoom-in group border border-border/20"
          onClick={() => setIsZoomed(true)}
        >
          <Image
            src={src || "/placeholder.svg"}
            alt={alt || ""}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        {caption && (
          <figcaption className="mt-4 text-center text-sm text-muted-foreground/60 font-mono">
            {caption}
          </figcaption>
        )}
      </figure>
      
      {/* Zoom modal */}
      {isZoomed && (
        <div 
          className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl flex items-center justify-center cursor-zoom-out p-8"
          onClick={() => setIsZoomed(false)}
        >
          <div className="relative max-w-6xl w-full aspect-video">
            <Image
              src={src || "/placeholder.svg"}
              alt={alt || ""}
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}

export default function ArticleDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = (params?.slug as string) || "the-5-core-principles-of-tob-brand-visualization";
  const [activeSection, setActiveSection] = useState("");
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [shareMenuOpen, setShareMenuOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  
  const article = getArticleBySlug(slug);
  
  // Track scroll for TOC highlighting and back to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
      
      // Find active section for TOC
      const sections = document.querySelectorAll('[data-section]');
      let current = '';
      sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top < 150) {
          current = section.getAttribute('data-section') || '';
        }
      });
      setActiveSection(current);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = article.title;
    
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        break;
    }
    setShareMenuOpen(false);
  };

  // Generate section IDs
  let sectionIndex = 0;
  const getSectionId = () => {
    const id = article.toc[sectionIndex]?.id || `section-${sectionIndex}`;
    sectionIndex++;
    return id;
  };

  return (
    <div className="min-h-screen bg-background noise-overlay page-enter">
      <main className="pt-4 pb-20 page-enter-content">
        {/* Article Header */}
        <section className="relative py-16 lg:py-24 overflow-hidden">
          <FloatingParticles />
          
          {/* Background effects */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
          <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[80px]" />
          
          <div className="relative px-2 md:px-4 lg:px-8 xl:px-32">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm font-mono text-muted-foreground/60 mb-10">
              <Link href="/" className="hover:text-primary transition-colors">首页</Link>
              <ChevronRight className="w-3 h-3" />
              <Link href="/insights" className="hover:text-primary transition-colors">思想专栏</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-foreground/80 truncate max-w-[200px]">{article.title}</span>
            </nav>
            
            <div>
              {/* Category & reading info */}
              <div className="flex flex-wrap items-center gap-4 mb-8">
                <span className="px-4 py-2 text-[10px] font-mono text-primary bg-primary/10 rounded-full tracking-wider border border-primary/20">
                  {article.categoryLabel}
                </span>
                <span className="flex items-center gap-1.5 text-sm text-muted-foreground/60 font-mono">
                  <Calendar className="w-4 h-4" />
                  {article.date}
                </span>
                <span className="flex items-center gap-1.5 text-sm text-muted-foreground/60 font-mono">
                  <Clock className="w-4 h-4" />
                  {article.readTime}
                </span>
                <span className="flex items-center gap-1.5 text-sm text-muted-foreground/60 font-mono">
                  <Eye className="w-4 h-4" />
                  {article.views.toLocaleString()} 阅读
                </span>
              </div>
              
              {/* Title */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-extralight leading-[1.1] mb-6">
                {article.title}
              </h1>
              <p className="text-lg md:text-xl lg:text-2xl xl:text-2xl text-primary/60 font-mono tracking-wide mb-10">
                {article.subtitle}
              </p>
              
              {/* Author & actions */}
              <div className="flex flex-wrap items-center justify-between gap-6 pt-8 border-t border-border/20">
                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-lg font-light text-primary">
                    {article.author.name[0]}
                  </div>
                  <div>
                    <div className="font-medium text-foreground">{article.author.name}</div>
                    <div className="text-sm text-muted-foreground/60 font-mono">{article.author.title}</div>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex items-center gap-3">
                  <button className="p-3 rounded-full border border-border/30 text-muted-foreground/60 hover:text-primary hover:border-primary/50 transition-all">
                    <Bookmark className="w-5 h-5" />
                  </button>
                  <div className="relative">
                    <button 
                      onClick={() => setShareMenuOpen(!shareMenuOpen)}
                      className="p-3 rounded-full border border-border/30 text-muted-foreground/60 hover:text-primary hover:border-primary/50 transition-all"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                    
                    {/* Share dropdown */}
                    {shareMenuOpen && (
                      <div className="absolute right-0 top-full mt-2 py-2 w-48 bg-card border border-border/30 rounded-xl shadow-xl z-50">
                        <button 
                          onClick={() => handleShare('twitter')}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground/80 hover:bg-secondary/50 transition-colors"
                        >
                          <Twitter className="w-4 h-4" />
                          分享到 Twitter
                        </button>
                        <button 
                          onClick={() => handleShare('linkedin')}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground/80 hover:bg-secondary/50 transition-colors"
                        >
                          <Linkedin className="w-4 h-4" />
                          分享到 LinkedIn
                        </button>
                        <button 
                          onClick={() => handleShare('copy')}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground/80 hover:bg-secondary/50 transition-colors"
                        >
                          <Link2 className="w-4 h-4" />
                          复制链接
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Cover Image */}
        <section className="px-2 md:px-4 lg:px-8 xl:px-32 -mt-4">
          <div className="relative aspect-[21/9] rounded-2xl overflow-hidden border border-border/20">
            <Image
              src={article.image || "/placeholder.svg"}
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16 lg:py-20">
          <div className="px-2 md:px-4 lg:px-8 xl:px-32">
            <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
              {/* TOC Sidebar */}
              <aside className="hidden lg:block lg:col-span-3">
                <div className="sticky top-32">
                  <div className="text-[10px] font-mono text-muted-foreground/40 tracking-[0.3em] mb-6">
                    目录导航
                  </div>
                  <nav className="space-y-1">
                    {article.toc.map((item, index) => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        className={cn(
                          "block py-2 text-sm transition-all duration-300 border-l-2",
                          item.level === 2 ? "pl-4" : "pl-8",
                          activeSection === item.id
                            ? "text-primary border-primary"
                            : "text-muted-foreground/50 border-transparent hover:text-foreground hover:border-border/50"
                        )}
                      >
                        {item.title}
                      </a>
                    ))}
                  </nav>
                  
                  {/* Quick actions */}
                  <div className="mt-10 pt-8 border-t border-border/20">
                    <Link 
                      href="/insights"
                      className="flex items-center gap-2 text-sm text-muted-foreground/60 hover:text-primary transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      返回文章列表
                    </Link>
                  </div>
                </div>
              </aside>
              
              {/* Article Content */}
              <article className="lg:col-span-6" ref={contentRef}>
                <div className="prose prose-invert prose-lg max-w-none">
                  {article.content.map((block, index) => {
                    switch (block.type) {
                      case 'h2':
                        const sectionId = article.toc[Math.floor(index / 2)]?.id || `section-${index}`;
                        return (
                          <h2 
                            key={index} 
                            id={sectionId}
                            data-section={sectionId}
                            className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-light mt-16 mb-6 text-foreground scroll-mt-32"
                          >
                            {block.content}
                          </h2>
                        );
                      case 'h3':
                        return (
                          <h3 key={index} className="text-xl md:text-2xl lg:text-3xl font-light mt-10 mb-4 text-foreground/90">
                            {block.content}
                          </h3>
                        );
                      case 'p':
                        return (
                          <p key={index} className="text-base md:text-lg lg:text-xl xl:text-2xl text-muted-foreground/80 leading-relaxed mb-6">
                            {block.content}
                          </p>
                        );
                      case 'quote':
                        return (
                          <blockquote 
                            key={index} 
                            className="relative my-10 pl-8 py-4 border-l-2 border-primary bg-primary/5 rounded-r-xl"
                          >
                            <p className="text-lg md:text-xl text-foreground/90 italic leading-relaxed">
                              {block.content}
                            </p>
                          </blockquote>
                        );
                      case 'list':
                        return (
                          <div key={index} className="my-8">
                            <p className="text-base md:text-lg text-foreground/80 mb-4">{block.content}</p>
                            <ul className="space-y-3">
                              {block.items?.map((item, i) => (
                                <li 
                                  key={i} 
                                  className="flex items-start gap-3 text-base text-muted-foreground/80"
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        );
                      case 'code':
                        return <CodeBlock key={index} code={block.content} language={block.language} />;
                      case 'image':
                        return <ZoomableImage key={index} src={block.content} caption={block.caption} />;
                      default:
                        return null;
                    }
                  })}
                </div>
                
                {/* Article footer */}
                <div className="mt-16 pt-10 border-t border-border/20">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-10">
                    {['品牌可视化', 'ToB设计', '设计系统', '方法论'].map(tag => (
                      <span 
                        key={tag}
                        className="px-4 py-2 text-sm font-mono text-muted-foreground/60 bg-secondary/30 rounded-full hover:bg-secondary/50 transition-colors cursor-pointer"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  
                  {/* Author Card */}
                  <div className="p-8 rounded-2xl bg-card/30 border border-border/20">
                    <div className="flex items-start gap-6">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-2xl font-light text-primary shrink-0">
                        {article.author.name[0]}
                      </div>
                      <div className="flex-1">
                        <div className="text-xl font-light text-foreground mb-1">{article.author.name}</div>
                        <div className="text-sm text-primary/70 font-mono mb-4">{article.author.title}</div>
                        <p className="text-sm text-muted-foreground/70 leading-relaxed">
                          {article.author.bio}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
              
              {/* Right Sidebar */}
              <aside className="lg:col-span-3">
                <div className="sticky top-32 space-y-8">
                  {/* CTA Card */}
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/20">
                    <div className="text-lg font-light text-foreground mb-2">
                      想深度了解这套方法论？
                    </div>
                    <p className="text-sm text-muted-foreground/70 mb-6">
                      获取完整工具包和1对1诊断服务
                    </p>
                    <div className="space-y-3">
                      <a 
                        href="#"
                        className="flex items-center justify-center gap-2 w-full py-3 text-sm font-mono text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        免费下载工具包
                        <ArrowUpRight className="w-4 h-4" />
                      </a>
                      <a 
                        href="#"
                        className="flex items-center justify-center gap-2 w-full py-3 text-sm font-mono text-primary border border-primary/30 rounded-lg hover:bg-primary/10 transition-colors"
                      >
                        预约免费诊断
                      </a>
                    </div>
                  </div>
                  
                  {/* Related Articles */}
                  <div>
                    <div className="text-[10px] font-mono text-muted-foreground/40 tracking-[0.3em] mb-6">
                      相关推荐
                    </div>
                    <div className="space-y-4">
                      {article.relatedArticles.map(related => (
                        <Link
                          key={related.id}
                          href={`/insights/${related.id}`}
                          className="group flex gap-4 p-3 -mx-3 rounded-xl hover:bg-secondary/20 transition-colors"
                        >
                          <div className="relative w-20 h-16 rounded-lg overflow-hidden shrink-0">
                            <Image
                              src={related.image || "/placeholder.svg"}
                              alt={related.title}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-light text-foreground/90 line-clamp-2 group-hover:text-primary transition-colors">
                              {related.title}
                            </h4>
                            <span className="text-[10px] font-mono text-muted-foreground/50 mt-1">
                              {related.readTime}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>
        
        {/* Bottom CTA Section */}
        <section className="py-20 border-t border-border/10">
          <div className="px-2 md:px-4 lg:px-8 xl:px-32">
            <div style={{ maxWidth: '900px', margin: '0 auto' }} className="text-center">
              <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extralight mb-6">
                准备好提升你的品牌可视化能力了吗？
              </h2>
              <p className="text-lg text-muted-foreground/70 mb-10">
                通过VCMA诊断，发现你的可视化提升空间
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <a 
                  href="#"
                  className="flex items-center gap-3 px-8 py-4 text-base font-mono text-primary-foreground bg-primary rounded-full hover:bg-primary/90 transition-all hover:scale-105"
                >
                  免费诊断
                  <ArrowUpRight className="w-5 h-5" />
                </a>
                <Link 
                  href="/#cases"
                  className="flex items-center gap-3 px-8 py-4 text-base font-mono text-foreground border border-border/30 rounded-full hover:border-primary/50 hover:text-primary transition-all"
                >
                  查看案例
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
      
      {/* Back to top button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-4 rounded-full bg-card border border-border/30 text-foreground/60 hover:text-primary hover:border-primary/50 transition-all shadow-xl z-50"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
