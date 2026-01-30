"use client";

import React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { useLang } from "@/components/providers/lang-provider";
import { getT } from "@/lib/i18n";
import { ArrowUpRight, Clock, Search, TrendingUp, Tag, Mail, ChevronRight, Loader2 } from "lucide-react";
import Image from "next/image";
import { Footer } from "@/components/sections/footer";

// Article categories
const categories = [
  { id: "all", label: "全部", labelEn: "All" },
  { id: "industry", label: "行业洞察", labelEn: "Industry" },
  { id: "methodology", label: "方法论", labelEn: "Method" },
  { id: "case", label: "实战案例", labelEn: "Case Study" },
];

// Mock articles data
const allArticles = [
  {
    id: 1,
    title: "ToB企业品牌可视化的5个核心原则",
    subtitle: "The 5 Core Principles of ToB Brand Visualization",
    excerpt: "在竞争激烈的ToB市场中，如何通过视觉系统构建独特的品牌认知？本文深入剖析5个核心原则，帮助你的品牌在数字世界中脱颖而出。",
    category: "industry",
    readTime: "8分钟",
    date: "2025.01.15",
    image: "/images/article-tob-visual.jpg",
    featured: true,
    views: 2840,
  },
  {
    id: 2,
    title: "数据可视化设计：从混乱到清晰",
    subtitle: "Data Visualization: From Chaos to Clarity",
    excerpt: "让数据说话，而不是让观众迷失在数字海洋中。掌握数据可视化的核心方法论。",
    category: "methodology",
    readTime: "12分钟",
    date: "2025.01.10",
    image: "/images/article-data-story.jpg",
    featured: false,
    views: 1920,
  },
  {
    id: 3,
    title: "如何用设计思维提升融资BP转化率",
    subtitle: "Design Thinking for Pitch Decks",
    excerpt: "从投资人视角出发，用视觉策略提升投资者沟通效率，让你的BP更具说服力。",
    category: "case",
    readTime: "10分钟",
    date: "2025.01.05",
    image: "/images/article-pitch.jpg",
    featured: false,
    views: 3150,
  },
  {
    id: 4,
    title: "科幻粒子效果在数据大屏中的应用",
    subtitle: "Sci-Fi Particles in Enterprise Dashboards",
    excerpt: "探索前沿视觉技术在商业应用中的可能性，让数据大屏更具科技感与沉浸感。",
    category: "methodology",
    readTime: "15分钟",
    date: "2024.12.28",
    image: "/images/article-dashboard.jpg",
    featured: false,
    views: 2100,
  },
  {
    id: 5,
    title: "VCMA方法论：可视化成熟度诊断",
    subtitle: "VCMA Methodology: Visual Maturity Assessment",
    excerpt: "一套系统化的企业可视化能力评估框架，帮助企业找到可视化提升的关键路径。",
    category: "methodology",
    readTime: "18分钟",
    date: "2024.12.20",
    image: "/images/article-methodology.jpg",
    featured: false,
    views: 1680,
  },
  {
    id: 6,
    title: "某AI独角兽品牌升级全案复盘",
    subtitle: "AI Unicorn Brand Upgrade Case Study",
    excerpt: "从0到1的品牌视觉系统构建，助力企业完成B轮融资，品牌价值提升300%。",
    category: "case",
    readTime: "20分钟",
    date: "2024.12.15",
    image: "/images/case-ai.jpg",
    featured: false,
    views: 4200,
  },
  {
    id: 7,
    title: "2025年ToB设计趋势预测",
    subtitle: "ToB Design Trends 2025",
    excerpt: "从AI辅助设计到沉浸式体验，解读即将影响ToB设计领域的10大趋势。",
    category: "industry",
    readTime: "14分钟",
    date: "2024.12.10",
    image: "/images/case-cloud.jpg",
    featured: false,
    views: 3800,
  },
  {
    id: 8,
    title: "数据大屏设计避坑指南",
    subtitle: "Data Dashboard Design Pitfalls to Avoid",
    excerpt: "总结50+项目经验，揭示数据大屏设计中最常见的10个误区及解决方案。",
    category: "methodology",
    readTime: "16分钟",
    date: "2024.12.05",
    image: "/images/case-data.jpg",
    featured: false,
    views: 2560,
  },
];

// Popular tags
const popularTags = [
  "品牌可视化", "数据大屏", "融资BP", "ToB设计", 
  "方法论", "AI设计", "用户体验", "设计系统",
  "数据可视化", "科技感", "全息界面", "粒子效果"
];

// Skeleton component
function ArticleSkeleton() {
  return (
    <div className="rounded-xl border border-border/30 bg-card/20 overflow-hidden animate-pulse">
      <div className="h-48 bg-secondary/30" />
      <div className="p-6">
        <div className="flex gap-4 mb-4">
          <div className="w-16 h-5 bg-secondary/50 rounded" />
          <div className="w-12 h-5 bg-secondary/30 rounded" />
        </div>
        <div className="w-full h-6 bg-secondary/40 rounded mb-2" />
        <div className="w-3/4 h-4 bg-secondary/30 rounded mb-4" />
        <div className="w-full h-12 bg-secondary/20 rounded" />
      </div>
    </div>
  );
}

// Floating particles background for page header
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
      
      // Initialize particles
      particles.length = 0;
      for (let i = 0; i < 60; i++) {
        particles.push({
          x: Math.random() * canvas.offsetWidth,
          y: Math.random() * canvas.offsetHeight,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.2 - 0.15,
          size: 0.5 + Math.random() * 1.5,
          alpha: 0.1 + Math.random() * 0.3,
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

export default function InsightsPage() {
  const { lang } = useLang();
  const insightsT = getT(lang).insightsPage;
  const [activeCategory, setActiveCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [displayedArticles, setDisplayedArticles] = useState(6);
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Filter articles
  const filteredArticles = allArticles.filter(a => {
    const matchCategory = activeCategory === "all" || a.category === activeCategory;
    const matchSearch = !searchQuery || 
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const featuredArticle = allArticles.find(a => a.featured);
  const gridArticles = filteredArticles.filter(a => !a.featured).slice(0, displayedArticles);

  // Popular articles (sorted by views)
  const popularArticles = [...allArticles].sort((a, b) => b.views - a.views).slice(0, 5);

  const handleLoadMore = () => {
    setDisplayedArticles(prev => prev + 6);
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubscribing(true);
    await new Promise(r => setTimeout(r, 1000));
    setIsSubscribing(false);
    setEmail("");
    alert("订阅成功！");
  };

  return (
    <div className="min-h-screen bg-background noise-overlay page-enter">
      <main className="pt-4 pb-20 page-enter-content">
        {/* Page Header with floating particles */}
        <section className="relative py-20 lg:py-32 overflow-hidden">
          {/* Floating particles background */}
          <FloatingParticles />
          
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[80px]" />
          
          {/* Grid lines decoration */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `linear-gradient(rgba(255,108,46,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,108,46,0.5) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }} />
          
          <div className="relative px-2 md:px-4 lg:px-8 xl:px-32">
            <div>
              <div className="flex items-center gap-4 mb-8">
                <span className="text-[10px] font-mono text-primary tracking-[0.3em]">INSIGHTS</span>
                <div className="w-16 h-px bg-gradient-to-r from-primary to-transparent" />
                <span className="text-[10px] font-mono text-muted-foreground/40">01</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extralight leading-[1.05] mb-8">
                <span className="block">{insightsT.titleA}</span>
                <span className="text-muted-foreground/60 text-3xl md:text-4xl lg:text-5xl block mt-4">
                  {insightsT.titleB}
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground/70 leading-relaxed font-light" style={{ maxWidth: '700px' }}>
                分享ToB可视化设计的前沿思考、实战方法论与案例复盘，
                <span className="text-primary/80">助力企业提升视觉竞争力。</span>
              </p>
              
              {/* Stats row */}
              <div className="flex items-center gap-8 mt-12 pt-8 border-t border-border/20">
                <div>
                  <div className="text-2xl font-light text-foreground">{allArticles.length}+</div>
                  <div className="text-xs font-mono text-muted-foreground/50 mt-1">原创文章</div>
                </div>
                <div className="w-px h-10 bg-border/30" />
                <div>
                  <div className="text-2xl font-light text-foreground">50K+</div>
                  <div className="text-xs font-mono text-muted-foreground/50 mt-1">累计阅读</div>
                </div>
                <div className="w-px h-10 bg-border/30" />
                <div>
                  <div className="text-2xl font-light text-foreground">4</div>
                  <div className="text-xs font-mono text-muted-foreground/50 mt-1">内容专题</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Filter Tabs */}
        <section className="sticky top-20 z-40 bg-background/90 backdrop-blur-xl border-y border-border/20">
          <div className="px-2 md:px-4 lg:px-8 xl:px-32">
            <div className="flex items-center justify-between gap-4 py-4">
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setActiveCategory(cat.id);
                      setDisplayedArticles(6);
                    }}
                    className={cn(
                      "px-5 py-2.5 text-sm font-mono rounded-full border transition-all duration-300 whitespace-nowrap",
                      activeCategory === cat.id
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-transparent text-muted-foreground border-border/30 hover:border-primary/50 hover:text-foreground"
                    )}
                  >
                    {cat.label}
                    <span className="ml-2 text-[10px] opacity-50">{cat.labelEn}</span>
                  </button>
                ))}
              </div>
              
              {/* Search */}
              <div className="hidden md:flex items-center gap-2 px-4 py-2 border border-border/30 rounded-full bg-secondary/20">
                <Search className="w-4 h-4 text-muted-foreground/50" />
                <input 
                  type="text"
                  placeholder="搜索文章..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent text-sm outline-none w-40 placeholder:text-muted-foreground/40"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16 lg:py-24">
          <div className="px-2 md:px-4 lg:px-8 xl:px-32">
            <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
              {/* Articles Grid */}
              <div className="lg:col-span-8" ref={containerRef}>
                {/* Featured Article */}
                {activeCategory === "all" && featuredArticle && !isLoading && !searchQuery && (
                  <a
                    href={`/insights/${featuredArticle.id}`}
                    className="group relative block rounded-2xl border border-border/30 bg-card/30 backdrop-blur-sm overflow-hidden mb-12 transition-all duration-500 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5"
                  >
                    <div className="grid md:grid-cols-2 gap-0">
                      {/* Image */}
                      <div className="relative h-72 md:h-auto overflow-hidden">
                        <Image
                          src={featuredArticle.image || "/placeholder.svg"}
                          alt={featuredArticle.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card/90 hidden md:block" />
                        <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent md:hidden" />
                        
                        {/* Featured badge */}
                        <div className="absolute top-6 left-6">
                          <span className="px-4 py-2 text-[10px] font-mono text-primary-foreground bg-primary rounded-full tracking-wider flex items-center gap-2">
                            <TrendingUp className="w-3 h-3" />
                            置顶精选
                          </span>
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="relative p-8 md:p-12 flex flex-col justify-center">
                        <div className="flex items-center gap-4 mb-6">
                          <span className="px-3 py-1.5 text-[10px] font-mono text-muted-foreground bg-secondary/50 rounded-full tracking-wider">
                            {categories.find(c => c.id === featuredArticle.category)?.label}
                          </span>
                          <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground/60 font-mono">
                            <Clock className="w-3 h-3" />
                            {featuredArticle.readTime}
                          </span>
                        </div>

                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-light mb-4 group-hover:text-primary transition-colors duration-300 leading-tight">
                          {featuredArticle.title}
                        </h2>
                        <p className="text-sm text-primary/50 mb-4 font-mono tracking-wide">
                          {featuredArticle.subtitle}
                        </p>
                        <p className="text-sm text-muted-foreground/70 leading-relaxed mb-8">
                          {featuredArticle.excerpt}
                        </p>

                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground/40 font-mono">
                            {featuredArticle.date}
                          </span>
                          <span className="flex items-center gap-2 text-sm text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                            <span className="font-mono text-xs tracking-wider">阅读全文</span>
                            <ArrowUpRight className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </a>
                )}

                {/* Section label */}
                <div className="flex items-center gap-4 mb-8">
                  <span className="text-xs font-mono text-primary/60">ALL ARTICLES</span>
                  <div className="flex-1 h-px bg-border/20" />
                  <span className="text-xs font-mono text-muted-foreground/40">{filteredArticles.length} 篇</span>
                </div>

                {/* Articles Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  {isLoading ? (
                    <>
                      {[...Array(6)].map((_, i) => (
                        <ArticleSkeleton key={i} />
                      ))}
                    </>
                  ) : (
                    gridArticles.map((article, index) => (
                      <a
                        key={article.id}
                        href={`/insights/${article.id}`}
                        className="group relative rounded-xl border border-border/30 bg-card/20 backdrop-blur-sm overflow-hidden transition-all duration-500 hover:border-primary/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        {/* Image */}
                        <div className="relative h-52 overflow-hidden">
                          <Image
                            src={article.image || "/placeholder.svg"}
                            alt={article.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
                          
                          {/* Category badge on image */}
                          <div className="absolute top-4 left-4">
                            <span className="px-2.5 py-1 text-[9px] font-mono text-foreground/80 bg-background/60 backdrop-blur-sm rounded tracking-wider">
                              {categories.find(c => c.id === article.category)?.labelEn}
                            </span>
                          </div>
                        </div>
                        
                        {/* Content */}
                        <div className="relative p-6">
                          <div className="flex items-center gap-3 mb-4">
                            <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground/50 font-mono">
                              <Clock className="w-3 h-3" />
                              {article.readTime}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-muted-foreground/20" />
                            <span className="text-[10px] text-muted-foreground/40 font-mono">
                              {article.date}
                            </span>
                          </div>

                          <h3 className="text-lg font-light mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-300 leading-snug">
                            {article.title}
                          </h3>
                          <p className="text-xs text-muted-foreground/60 mb-4 line-clamp-2 leading-relaxed">
                            {article.excerpt}
                          </p>

                          <div className="flex items-center justify-between pt-4 border-t border-border/20">
                            <span className="text-[10px] text-muted-foreground/40 font-mono">
                              {article.views.toLocaleString()} 阅读
                            </span>
                            <ArrowUpRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
                          </div>
                        </div>
                      </a>
                    ))
                  )}
                </div>

                {/* Empty state */}
                {!isLoading && gridArticles.length === 0 && (
                  <div className="text-center py-20">
                    <div className="text-muted-foreground/40 font-mono text-sm">暂无相关文章</div>
                  </div>
                )}

                {/* Load More */}
                {!isLoading && displayedArticles < filteredArticles.filter(a => !a.featured).length && (
                  <div className="flex justify-center mt-16">
                    <button
                      onClick={handleLoadMore}
                      className="group flex items-center gap-3 px-8 py-4 text-sm font-mono text-muted-foreground border border-border/30 rounded-full hover:border-primary/50 hover:text-primary transition-all duration-300"
                    >
                      <span>加载更多</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <aside className="lg:col-span-4 space-y-8">
                {/* Popular Articles */}
                <div className="rounded-xl border border-border/30 bg-card/20 backdrop-blur-sm p-6">
                  <h3 className="flex items-center gap-3 text-sm font-mono text-foreground mb-6">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    热门文章
                    <span className="text-muted-foreground/40 text-xs">Top 5</span>
                  </h3>
                  
                  <div className="space-y-1">
                    {popularArticles.map((article, index) => (
                      <a
                        key={article.id}
                        href={`/insights/${article.id}`}
                        className="group flex items-start gap-4 py-4 border-b border-border/10 last:border-0 last:pb-0 hover:bg-secondary/20 -mx-2 px-2 rounded-lg transition-colors"
                      >
                        <span className="flex-shrink-0 w-7 h-7 flex items-center justify-center text-[10px] font-mono text-primary bg-primary/10 rounded">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-light line-clamp-2 group-hover:text-primary transition-colors duration-300 leading-relaxed">
                            {article.title}
                          </h4>
                          <span className="text-[10px] text-muted-foreground/40 font-mono mt-2 block">
                            {article.views.toLocaleString()} 阅读
                          </span>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Tags Cloud */}
                <div className="rounded-xl border border-border/30 bg-card/20 backdrop-blur-sm p-6">
                  <h3 className="flex items-center gap-3 text-sm font-mono text-foreground mb-6">
                    <Tag className="w-4 h-4 text-primary" />
                    热门标签
                  </h3>
                  
                  <div className="flex flex-wrap gap-2">
                    {popularTags.map(tag => (
                      <button
                        key={tag}
                        onClick={() => setSearchQuery(tag)}
                        className="px-3 py-1.5 text-xs font-mono text-muted-foreground/70 bg-secondary/30 rounded-full border border-border/20 hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-all duration-300"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Newsletter */}
                <div className="rounded-xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card/50 to-accent/5 backdrop-blur-sm p-6 relative overflow-hidden">
                  {/* Decorative element */}
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
                  
                  <h3 className="flex items-center gap-3 text-sm font-mono text-foreground mb-3 relative">
                    <Mail className="w-4 h-4 text-primary" />
                    订阅通讯
                  </h3>
                  <p className="text-xs text-muted-foreground/70 mb-6 leading-relaxed relative">
                    每周精选ToB设计洞察与实战经验，直达你的邮箱。
                  </p>
                  
                  <form onSubmit={handleSubscribe} className="space-y-3 relative">
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      className="w-full px-4 py-3 text-sm bg-background/50 border border-border/30 rounded-lg outline-none focus:border-primary/50 transition-colors placeholder:text-muted-foreground/30"
                    />
                    <button
                      type="submit"
                      disabled={isSubscribing}
                      className="w-full px-4 py-3 text-sm font-mono bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isSubscribing ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          订阅中...
                        </>
                      ) : (
                        "立即订阅"
                      )}
                    </button>
                  </form>
                  
                  <p className="text-[10px] text-muted-foreground/40 mt-4 text-center relative">
                    已有 2,400+ 设计师订阅
                  </p>
                </div>

                {/* CTA Card */}
                <div className="rounded-xl border border-border/30 bg-card/20 backdrop-blur-sm p-6">
                  <div className="text-xs font-mono text-primary/60 mb-3">NEED HELP?</div>
                  <h4 className="text-lg font-light mb-3">需要可视化升级？</h4>
                  <p className="text-xs text-muted-foreground/60 mb-5 leading-relaxed">
                    免费获取VCMA可视化成熟度诊断，找到提升关键路径。
                  </p>
                  <a 
                    href="#diagnosis" 
                    className="flex items-center gap-2 text-sm font-mono text-primary hover:underline"
                  >
                    <span>免费诊断</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
