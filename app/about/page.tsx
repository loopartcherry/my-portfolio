"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, Zap, Target, Layers, Users, Shield, Star, FileSearch, MessageSquare, Rocket, Handshake, Quote, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Footer } from "@/components/sections/footer";
import { useLang } from "@/components/providers/lang-provider";
import { getT } from "@/lib/i18n";

const getStats = (lang: "zh" | "en") => {
  const T = getT(lang).aboutPage;
  return [
    { value: "100+", label: T.services, icon: Users },
    { value: "8亿+", label: T.funding, icon: Target },
    { value: "300%", label: T.roi, icon: Zap },
    { value: "95%", label: T.renew, icon: Shield },
  ];
};

const capabilities = [
  {
    id: "fullstack",
    title: "全栈设计",
    subtitle: "Full-Stack",
    icon: Layers,
    highlight: "覆盖全流程",
    skills: ["品牌战略", "VI/官网/PPT", "产品UI/UX", "数据可视化", "Design System"],
  },
  {
    id: "business",
    title: "商业理解",
    subtitle: "Business",
    icon: Target,
    highlight: "10年ToB深耕",
    skills: ["融资场景", "销售转化", "产品化设计", "ROI量化"],
  },
  {
    id: "system",
    title: "体系思维",
    subtitle: "System",
    icon: Zap,
    highlight: "长期价值",
    skills: ["设计标准化", "组件化资产", "团队赋能"],
  },
];

const testimonials = [
  {
    quote: "这是我见过最懂ToB的设计师。不只是帮我们做项目，更是帮我们建立了设计思维。",
    author: "某SaaS公司CEO",
    result: "融资5000万，转化率+40%",
  },
  {
    quote: "ROI超预期，第二年继续合作。原本只是想做个PPT，最后把整个品牌体系都升级了。",
    author: "某数据公司CMO",
    result: "销售周期缩短30%",
  },
  {
    quote: "响应速度太快了，周末发的需求周一就有初稿。质量还特别高。",
    author: "某金融科技CTO",
    result: "产品续约率+25%",
  },
];

const comparison = [
  { 
    label: "ToB理解", 
    a: { stars: 2, desc: "以ToC经验为主" }, 
    b: { stars: 1, desc: "看项目" }, 
    c: { stars: 5, desc: "10年ToB深耕" } 
  },
  { 
    label: "全栈能力", 
    a: { stars: 3, desc: "需要跨部门协作" }, 
    b: { stars: 2, desc: "专精某一领域" }, 
    c: { stars: 5, desc: "设计师全流程跟踪执行" } 
  },
  { 
    label: "战略能力", 
    a: { stars: 2, desc: "执行为主" }, 
    b: { stars: 1, desc: "基本没有" }, 
    c: { stars: 4, desc: "战略咨询+设计落地" } 
  },
  { 
    label: "响应速度", 
    a: { stars: 2, desc: "流程长" }, 
    b: { stars: 3, desc: "较快" }, 
    c: { stars: 5, desc: "直接对接" } 
  },
  { 
    label: "性价比", 
    a: { stars: 2, desc: "贵(溢价高)" }, 
    b: { stars: 4, desc: "便宜但风险高" }, 
    c: { stars: 4, desc: "专业+合理价格" } 
  },
  { 
    label: "持续服务", 
    a: { stars: 2, desc: "项目制" }, 
    b: { stars: 1, desc: "做完就走" }, 
    c: { stars: 5, desc: "长期伙伴" } 
  },
];

const processSteps = [
  {
    step: 1,
    title: "免费诊断",
    icon: FileSearch,
    desc: "8分钟VCMA问卷，快速了解现状",
  },
  {
    step: 2,
    title: "方案沟通",
    icon: MessageSquare,
    desc: "1对1深度咨询，定制解决方案",
  },
  {
    step: 3,
    title: "高效执行",
    icon: Rocket,
    desc: "标准化流程，透明化进度",
  },
  {
    step: 4,
    title: "持续陪伴",
    icon: Handshake,
    desc: "交付不是终点，长期伙伴关系",
  },
];

export default function AboutPage() {
  const { lang } = useLang();
  const aboutT = getT(lang).aboutPage;
  const stats = getStats(lang);
  const [activeCapability, setActiveCapability] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [showMoreAchievements, setShowMoreAchievements] = useState(false);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="min-h-screen bg-background noise-overlay page-enter">
      <main className="pt-4 page-enter-content">
        {/* Hero - Ashfall style */}
        <section className="relative py-20 lg:py-32 overflow-hidden min-h-[85vh] flex items-center">
          <div className="absolute inset-0">
            <Image
              src="/images/about-workshop.jpg"
              alt="LoopArt Studio"
              fill
              className="object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />
          </div>

          <div className="relative px-2 md:px-4 lg:px-8 xl:px-32 w-full">
            <div className="flex items-center gap-4 mb-8">
              <span className="text-[10px] font-mono text-primary tracking-[0.3em]">ABOUT</span>
              <div className="w-16 h-px bg-gradient-to-r from-primary to-transparent" />
              <span className="text-[10px] font-mono text-muted-foreground/40">LOOPART STUDIO</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light leading-[1.05] mb-8 tracking-tight">
              <span className="block">{aboutT.heroTitleA}</span>
              <span className="block text-primary mt-2">{aboutT.heroTitleB}</span>
              <span className="block mt-2">{aboutT.heroTitleC}</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground/70 mb-12 leading-relaxed font-light" style={{ maxWidth: '700px' }}>
              {aboutT.heroDesc}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/about#cta"
                className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-mono text-sm tracking-wide hover:bg-primary/90 transition-colors"
              >
                {aboutT.bookConsult}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/portfolio"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border/40 text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors text-sm font-mono"
              >
                {aboutT.viewCases}
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-20 page-enter">
          <div className="px-2 md:px-4 lg:px-8 xl:px-32">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((item) => (
                <div key={item.label} className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-mono text-muted-foreground/60">
                    <item.icon className="w-4 h-4 text-primary" />
                    <span>{item.label}</span>
                  </div>
                  <div className="text-3xl font-light text-foreground">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="relative py-40">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
          
          <div className="px-2 md:px-4 lg:px-8 xl:px-32">
            <div>
              {/* Section header */}
              <div className="flex items-center gap-6 mb-20">
                <span className="text-7xl md:text-8xl font-extralight text-primary/20">01</span>
                <div>
                  <span className="text-xs font-mono text-primary tracking-widest block mb-2">MY STORY</span>
                  <h2 className="text-3xl md:text-4xl font-extralight">为什么做ToB可视化？</h2>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                {/* Image */}
                <div className="relative">
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                    <Image
                      src="/images/about-story.jpg"
                      alt="Journey"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                  </div>
                  
                  {/* Floating quote card */}
                  <div className="absolute -bottom-8 -right-8 md:right-8 max-w-sm p-6 bg-card/90 backdrop-blur-sm border border-primary/20 rounded-xl">
                    <Quote className="w-8 h-8 text-primary/30 mb-3" />
                    <p className="text-foreground font-light leading-relaxed mb-3">
                      "你们的技术更好，但他们的PPT更专业。我老板倾向选他们。"
                    </p>
                    <p className="text-xs text-muted-foreground">—— 某客户CTO的一句话，改变了我的职业方向</p>
                  </div>
                </div>

                {/* Text */}
                <div className="lg:pl-8">
                  <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                    2018年，我还是某互联网大厂的产品经理。那时我发现一个奇怪的现象：很多技术很牛的ToB公司，却总在市场竞争中吃亏。
                  </p>
                  
                  <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                    不是产品不行，而是<strong className="text-foreground">"讲不清楚"</strong>。
                  </p>

                  <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                    那一刻我意识到：ToB的竞争，不只是技术和产品，还有<strong className="text-foreground">可视化能力</strong>。
                  </p>

                  <div className="p-6 border-l-2 border-primary bg-card/30 rounded-r-xl mb-8">
                    <p className="text-xl text-foreground font-light">
                      5年来，我服务过100多家科技企业，见证了无数"技术很牛但讲不清楚"的公司，通过可视化升级实现商业突破。
                    </p>
                  </div>

                  <Link 
                    href="/portfolio"
                    className="inline-flex items-center gap-3 text-sm font-mono text-primary hover:gap-4 transition-all duration-300"
                  >
                    <span>查看真实案例</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Capabilities Section */}
        <section className="relative py-40 bg-card/30">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
          
          <div className="px-2 md:px-4 lg:px-8 xl:px-32">
            <div>
              {/* Section header */}
              <div className="flex items-center gap-6 mb-20">
                <span className="text-7xl md:text-8xl font-extralight text-primary/20">02</span>
                <div>
                  <span className="text-xs font-mono text-primary tracking-widest block mb-2">CAPABILITIES</span>
                  <h2 className="text-3xl md:text-4xl font-extralight">我们的3大核心能力</h2>
                </div>
              </div>

              {/* Capability cards */}
              <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
                {capabilities.map((cap, i) => (
                  <div
                    key={cap.id}
                    onMouseEnter={() => setActiveCapability(i)}
                    className={cn(
                      "group relative p-8 lg:p-10 rounded-2xl border transition-all duration-500 cursor-pointer",
                      activeCapability === i 
                        ? "bg-card border-primary/40 scale-[1.02]" 
                        : "bg-card/50 border-border/30 hover:border-border/60"
                    )}
                  >
                    {/* Number */}
                    <div className="absolute top-6 right-6 text-5xl font-extralight text-primary/10">
                      0{i + 1}
                    </div>

                    {/* Icon */}
                    <div className={cn(
                      "w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-colors duration-300",
                      activeCapability === i ? "bg-primary/20" : "bg-muted/50"
                    )}>
                      <cap.icon className={cn(
                        "w-7 h-7 transition-colors duration-300",
                        activeCapability === i ? "text-primary" : "text-muted-foreground"
                      )} />
                    </div>

                    {/* Title */}
                    <div className="text-xs font-mono text-muted-foreground/60 mb-2">{cap.subtitle}</div>
                    <h3 className="text-2xl font-light mb-2">{cap.title}</h3>
                    
                    {/* Highlight tag */}
                    <div className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-mono rounded-full mb-6">
                      {cap.highlight}
                    </div>

                    {/* Skills */}
                    <div className="space-y-2">
                      {cap.skills.map((skill) => (
                        <div key={skill} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="w-1 h-1 rounded-full bg-primary/50" />
                          <span>{skill}</span>
                        </div>
                      ))}
                    </div>

                    {/* Hover arrow */}
                    <div className={cn(
                      "absolute bottom-8 right-8 transition-all duration-300",
                      activeCapability === i ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
                    )}>
                      <ArrowUpRight className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Comparison */}
        <section className="relative py-40">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
          
          <div className="px-2 md:px-4 lg:px-8 xl:px-32">
            <div>
              {/* Section header */}
              <div className="flex items-center gap-6 mb-20">
                <span className="text-7xl md:text-8xl font-extralight text-primary/20">03</span>
                <div>
                  <span className="text-xs font-mono text-primary tracking-widest block mb-2">COMPARISON</span>
                  <h2 className="text-3xl md:text-4xl font-extralight">为什么选择我们？</h2>
                </div>
              </div>

              {/* Comparison Table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="p-4 text-left text-sm font-mono text-muted-foreground border-b border-border/30">对比项</th>
                      <th className="p-4 text-center text-sm font-mono text-muted-foreground border-b border-border/30 min-w-[160px]">传统设计公司</th>
                      <th className="p-4 text-center text-sm font-mono text-muted-foreground border-b border-border/30 min-w-[160px]">Freelancer</th>
                      <th className="p-4 text-center text-sm font-mono text-primary border-b border-primary/30 min-w-[160px] bg-primary/5">LoopArt（新型设计公司）</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparison.map((row, i) => (
                      <tr key={row.label} className="group hover:bg-card/30 transition-colors">
                        <td className="p-4 text-sm font-medium border-b border-border/20">{row.label}</td>
                        <td className="p-4 text-center border-b border-border/20">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            {[...Array(5)].map((_, j) => (
                              <Star key={j} className={cn("w-3 h-3", j < row.a.stars ? "text-amber-500 fill-amber-500" : "text-muted-foreground/20")} />
                            ))}
                          </div>
                          <div className="text-xs text-muted-foreground">{row.a.desc}</div>
                        </td>
                        <td className="p-4 text-center border-b border-border/20">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            {[...Array(5)].map((_, j) => (
                              <Star key={j} className={cn("w-3 h-3", j < row.b.stars ? "text-amber-500 fill-amber-500" : "text-muted-foreground/20")} />
                            ))}
                          </div>
                          <div className="text-xs text-muted-foreground">{row.b.desc}</div>
                        </td>
                        <td className="p-4 text-center border-b border-primary/10 bg-primary/5">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            {[...Array(5)].map((_, j) => (
                              <Star key={j} className={cn("w-3 h-3", j < row.c.stars ? "text-primary fill-primary" : "text-muted-foreground/20")} />
                            ))}
                          </div>
                          <div className="text-xs text-primary font-medium">{row.c.desc}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* How we work */}
        <section className="relative py-40 bg-card/30">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
          
          <div className="px-2 md:px-4 lg:px-8 xl:px-32">
            <div>
              {/* Section header */}
              <div className="flex items-center gap-6 mb-20">
                <span className="text-7xl md:text-8xl font-extralight text-primary/20">04</span>
                <div>
                  <span className="text-xs font-mono text-primary tracking-widest block mb-2">PROCESS</span>
                  <h2 className="text-3xl md:text-4xl font-extralight">合作方式：4步流程</h2>
                </div>
              </div>

              {/* Steps */}
              <div className="grid md:grid-cols-4 gap-8">
                {processSteps.map((step, i) => (
                  <div key={step.step} className="relative group">
                    {/* Connector line */}
                    {i < processSteps.length - 1 && (
                      <div className="hidden md:block absolute top-10 left-full w-full h-px bg-gradient-to-r from-border/50 to-transparent -translate-x-4 z-0" />
                    )}
                    
                    <div className="relative z-10">
                      {/* Icon */}
                      <div className="w-20 h-20 rounded-2xl bg-card border border-border/50 flex items-center justify-center mb-6 group-hover:border-primary/50 group-hover:bg-primary/5 transition-all duration-300">
                        <step.icon className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      
                      {/* Step number */}
                      <div className="text-xs font-mono text-primary mb-2">STEP 0{step.step}</div>
                      
                      {/* Title */}
                      <h3 className="text-xl font-light mb-2">{step.title}</h3>
                      
                      {/* Description */}
                      <p className="text-sm text-muted-foreground">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonial Section with carousel */}
        <section className="relative py-40">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
          
          {/* Background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[150px]" />
          
          <div className="relative z-10 px-2 md:px-4 lg:px-8 xl:px-32">
            <div className="max-w-5xl mx-auto text-center">
              {/* Section header */}
              <div className="flex items-center justify-center gap-6 mb-16">
                <span className="text-7xl md:text-8xl font-extralight text-primary/20">05</span>
                <div className="text-left">
                  <span className="text-xs font-mono text-primary tracking-widest block mb-2">TESTIMONIAL</span>
                  <h2 className="text-3xl md:text-4xl font-extralight">客户说</h2>
                </div>
              </div>

              {/* Testimonial carousel */}
              <div className="relative">
                {/* Large quote */}
                <Quote className="w-16 h-16 text-primary/20 mx-auto mb-8" />
                
                <blockquote className="text-2xl md:text-3xl lg:text-4xl font-extralight leading-relaxed text-foreground mb-8 min-h-[120px]">
                  "{testimonials[currentTestimonial].quote}"
                </blockquote>
                
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">{testimonials[currentTestimonial].author}</div>
                    <div className="text-sm text-primary">{testimonials[currentTestimonial].result}</div>
                  </div>
                </div>

                {/* Navigation arrows */}
                <div className="flex items-center justify-center gap-4 mt-12">
                  <button
                    onClick={prevTestimonial}
                    className="w-12 h-12 rounded-full border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all"
                    aria-label="Previous testimonial"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  
                  {/* Dots indicator */}
                  <div className="flex items-center gap-2">
                    {testimonials.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentTestimonial(i)}
                        className={cn(
                          "w-2 h-2 rounded-full transition-all duration-300",
                          i === currentTestimonial ? "bg-primary w-6" : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                        )}
                        aria-label={`Go to testimonial ${i + 1}`}
                      />
                    ))}
                  </div>
                  
                  <button
                    onClick={nextTestimonial}
                    className="w-12 h-12 rounded-full border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all"
                    aria-label="Next testimonial"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* More achievements toggle */}
              <button
                onClick={() => setShowMoreAchievements(!showMoreAchievements)}
                className="mt-16 inline-flex items-center gap-2 text-sm font-mono text-muted-foreground hover:text-foreground transition-colors"
              >
                <span>查看更多成就</span>
                <ChevronDown className={cn("w-4 h-4 transition-transform", showMoreAchievements && "rotate-180")} />
              </button>

              {/* Collapsible achievements */}
              <div className={cn(
                "mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4 text-left transition-all duration-500 overflow-hidden",
                showMoreAchievements ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
              )}>
                {[
                  "帮助23家企业成功融资（A-C轮）",
                  "帮助18家企业提升销售转化率（+35%）",
                  "帮助12家企业提升产品续约率（+25%）",
                  "发表行业文章50+篇，阅读量100万+",
                  "受邀在3个行业大会分享方法论",
                  "获得客户95%续约/推荐率",
                ].map((achievement) => (
                  <div key={achievement} className="flex items-start gap-3 p-4 bg-card/50 rounded-lg">
                    <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{achievement}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section id="cta" className="py-24 border-t border-border/40">
          <div className="px-2 md:px-4 lg:px-8 xl:px-32">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-extralight mb-4">
                准备开始了吗？
              </h2>
              <p className="text-lg text-muted-foreground mb-10">
                8分钟免费诊断,了解你的可视化现状
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Link
                  href="/about#cta"
                  className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-primary text-primary-foreground font-mono text-sm tracking-wide hover:bg-primary/90 transition-colors"
                >
                  免费诊断
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/portfolio"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-border/40 text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors text-sm font-mono"
                >
                  先看看案例
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
                <span>24小时内回复</span>
                <span className="w-1 h-1 rounded-full bg-border/40" />
                <span>hello@studio.com</span>
                <span className="w-1 h-1 rounded-full bg-border/40" />
                <span>北京/上海/深圳</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

