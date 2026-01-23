"use client";

import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { cn } from "@/lib/utils";
import { ArrowUpRight, Clock } from "lucide-react";
import Image from "next/image";

const toSlug = (title: string) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const articles = [
  {
    title: "The 5 Core Principles of ToB Brand Visualization",
    subtitle: "ToB企业品牌可视化的5个核心原则",
    excerpt: "How to build distinctive brand perception through visualization in competitive ToB markets.",
    category: "Strategy",
    readTime: "8 min",
    date: "2025.01",
    image: "/images/article-brand.jpg",
    featured: true,
  },
  {
    title: "Data Visualization: From Chaos to Clarity",
    subtitle: "数据可视化设计：从混乱到清晰",
    excerpt: "Making data speak through effective visual design.",
    category: "Data Viz",
    readTime: "12 min",
    date: "2025.01",
    image: "/images/article-methodology.jpg",
    featured: false,
  },
  {
    title: "Design Thinking for Pitch Decks",
    subtitle: "如何用设计思维提升融资BP转化率",
    excerpt: "Elevating investor communication through visual strategy.",
    category: "Business",
    readTime: "10 min",
    date: "2025.01",
    featured: false,
  },
  {
    title: "Sci-Fi Particles in Enterprise Dashboards",
    subtitle: "科幻粒子效果在数据大屏中的应用",
    excerpt: "Exploring frontier visual tech in business applications.",
    category: "Tech",
    readTime: "15 min",
    date: "2024.12",
    featured: false,
  },
];

export function Articles() {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>();

  return (
    <section id="articles" ref={ref} className="relative py-32 lg:py-40 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/5 to-background" />

      <div className="relative px-2 md:px-4 lg:px-8 xl:px-32">
        {/* Section header */}
        <div className="mb-20 lg:mb-28">
          <div 
            className={cn(
              "flex items-center gap-4 mb-8 transition-all duration-700",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            <span className="text-[10px] font-mono text-primary/60 tracking-[0.3em]">04</span>
            <div className="w-8 h-px bg-primary/30" />
            <span className="text-[10px] font-mono text-muted-foreground/60 tracking-[0.3em]">
              设计洞察 <span className="text-primary/40">/ Insights</span>
            </span>
          </div>
          
          <h2 
            className={cn(
              "text-3xl md:text-4xl lg:text-[3.5rem] xl:text-[4.5rem] 2xl:text-[5.5rem] font-extralight leading-[1.1] transition-all duration-700 delay-100",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            思考、方法与
            <span className="text-muted-foreground">设计探索</span>
          </h2>
        </div>

        {/* Articles grid - Bento style with images */}
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Featured article - large with image */}
          <a
            href={`/insights/${toSlug(articles[0].title)}`}
            className={cn(
              "group relative rounded-xl border border-border/30 bg-card/30 backdrop-blur-sm overflow-hidden transition-all duration-700 hover:border-primary/40 lg:col-span-7 lg:row-span-2",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
            style={{ transitionDelay: "200ms" }}
          >
            {/* Image */}
            <div className="relative h-64 lg:h-80 overflow-hidden">
              <Image
                src={articles[0].image || "/placeholder.svg"}
                alt={articles[0].title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/60 to-transparent" />
              
              {/* Category badge */}
              <div className="absolute top-6 left-6">
                <span className="px-3 py-1.5 text-[10px] font-mono text-primary bg-background/80 backdrop-blur-sm rounded-full border border-primary/30 tracking-wider">
                  {articles[0].category}
                </span>
              </div>
            </div>
            
            {/* Content */}
            <div className="relative p-6 lg:p-8">
              <div className="flex items-center gap-4 mb-4">
                <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground/60 font-mono tracking-wider">
                  <Clock className="w-3 h-3" />
                  {articles[0].readTime}
                </span>
                <span className="text-[10px] text-muted-foreground/40 font-mono">
                  {articles[0].date}
                </span>
              </div>

              <h3 className="text-xl lg:text-2xl font-light mb-2 group-hover:text-primary transition-colors duration-300">
                {articles[0].title}
              </h3>
              <p className="text-sm text-muted-foreground/60 mb-1">
                {articles[0].subtitle}
              </p>
              <p className="text-sm text-muted-foreground/80 mt-4 leading-relaxed hidden lg:block">
                {articles[0].excerpt}
              </p>

              {/* Read more */}
              <div className="flex items-center gap-2 mt-6 text-sm text-primary opacity-0 group-hover:opacity-100 transition-all duration-300">
                <span className="font-mono text-xs tracking-wider">Read article</span>
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
          </a>

          {/* Second article with image */}
          <a
            href={`/insights/${toSlug(articles[1].title)}`}
            className={cn(
              "group relative rounded-xl border border-border/30 bg-card/30 backdrop-blur-sm overflow-hidden transition-all duration-700 hover:border-primary/40 lg:col-span-5",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
            style={{ transitionDelay: "300ms" }}
          >
            {/* Image */}
            <div className="relative h-48 overflow-hidden">
              <Image
                src={articles[1].image || "/placeholder.svg"}
                alt={articles[1].title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/60 to-transparent" />
            </div>
            
            <div className="relative p-6">
              <div className="flex items-center gap-4 mb-3">
                <span className="px-2 py-1 text-[10px] font-mono text-muted-foreground/60 bg-secondary/50 rounded tracking-wider">
                  {articles[1].category}
                </span>
                <span className="flex items-center gap-1 text-[10px] text-muted-foreground/50 font-mono">
                  <Clock className="w-3 h-3" />
                  {articles[1].readTime}
                </span>
              </div>

              <h3 className="text-lg font-light group-hover:text-primary transition-colors duration-300">
                {articles[1].title}
              </h3>
              <p className="text-xs text-muted-foreground/50 mt-1">
                {articles[1].subtitle}
              </p>

              <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <ArrowUpRight className="w-4 h-4 text-primary" />
              </div>
            </div>
          </a>

          {/* Other articles - text only */}
          {articles.slice(2).map((article, i) => (
            <a
              key={article.title}
              href={`/insights/${toSlug(article.title)}`}
              className={cn(
                "group relative p-6 rounded-xl border border-border/30 bg-card/20 backdrop-blur-sm transition-all duration-700 hover:border-primary/40 lg:col-span-5",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}
              style={{ transitionDelay: `${400 + i * 100}ms` }}
            >
              <div className="relative">
                <div className="flex items-center gap-4 mb-3">
                  <span className="px-2 py-1 text-[10px] font-mono text-muted-foreground/60 bg-secondary/50 rounded tracking-wider">
                    {article.category}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-muted-foreground/50 font-mono">
                    <Clock className="w-3 h-3" />
                    {article.readTime}
                  </span>
                </div>

                <h3 className="text-lg font-light group-hover:text-primary transition-colors duration-300">
                  {article.title}
                </h3>
                <p className="text-xs text-muted-foreground/50 mt-1">
                  {article.subtitle}
                </p>

                <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <ArrowUpRight className="w-4 h-4 text-primary" />
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* View all link */}
        <div 
          className={cn(
            "flex justify-center mt-16 transition-all duration-700",
            isVisible ? "opacity-100" : "opacity-0"
          )}
          style={{ transitionDelay: "600ms" }}
        >
          <a
            href="/insights"
            className="group flex items-center gap-3 px-8 py-4 text-sm font-mono text-muted-foreground border border-border/30 rounded-full hover:border-primary/50 hover:text-primary transition-all duration-300"
          >
            <span>阅读全部文章</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
}
