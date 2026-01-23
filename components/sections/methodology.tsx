"use client";

import { useScrollAnimation, useMousePosition } from "@/hooks/use-scroll-animation";
import { cn } from "@/lib/utils";
import { Layers, Cpu, Box, BarChart3 } from "lucide-react";

const methods = [
  {
    icon: Layers,
    title: "品牌可视化",
    name: "百维赋",
    subtitle: "Brand Visual",
    description: "构建独特的视觉语言系统，让品牌在数字世界中脱颖而出",
    features: ["视觉识别系统", "品牌动效规范", "数字资产库"],
    quadrant: "top-left",
  },
  {
    icon: Cpu,
    title: "技术可视化",
    name: "万维图",
    subtitle: "Tech Visual",
    description: "将复杂的技术架构转化为直观的可视化表达",
    features: ["架构图设计", "数据流可视化", "技术文档设计"],
    quadrant: "top-right",
  },
  {
    icon: Box,
    title: "产品可视化",
    name: "千维镜",
    subtitle: "Product Visual",
    description: "创造沉浸式的产品展示体验，提升用户认知",
    features: ["3D产品展示", "交互原型设计", "动态演示"],
    quadrant: "bottom-left",
  },
  {
    icon: BarChart3,
    title: "数据可视化",
    name: "数维观",
    subtitle: "Data Visual",
    description: "让数据讲述故事，驱动商业决策",
    features: ["数据大屏设计", "报表可视化", "实时监控界面"],
    quadrant: "bottom-right",
  },
];

export function Methodology() {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>();
  const mouse = useMousePosition();

  return (
    <section
      id="methodology"
      ref={ref}
      className="relative overflow-hidden pt-24 pb-16 md:pt-28 md:pb-18 lg:pt-32 lg:pb-20"
    >
      {/* Background subtle grid */}
      <div className="absolute inset-0 opacity-[0.015]">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px'
        }} />
      </div>

      <div className="relative px-2 md:px-4 lg:px-8 xl:px-32">
        {/* Section header */}
        <div className="mb-10 md:mb-12 lg:mb-14">
          <div 
            className={cn(
              "flex items-center gap-4 mb-6 transition-all duration-700",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            <span className="text-xs font-mono text-primary tracking-widest">02</span>
            <div className="w-12 h-px bg-primary/50" />
            <span className="text-xs font-mono text-muted-foreground tracking-widest">
              服务方法论 <span className="text-primary/40">/ Method</span>
            </span>
          </div>
          
          <h2 
            className={cn(
              "text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-medium leading-tight mb-6 transition-all duration-700 delay-100",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            VCMA四维可视化方法论
            <span className="text-primary">.</span>
          </h2>
          
          <p 
            className={cn(
              "text-lg md:text-xl lg:text-2xl xl:text-2xl text-muted-foreground leading-relaxed transition-all duration-700 delay-200",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            系统化的可视化提升方案，覆盖品牌、技术、产品、数据四大维度，
            <br className="hidden md:block" />
            帮助企业建立完整的视觉竞争力。
          </p>
        </div>

        {/* Coordinate System Container */}
        <div 
          className={cn(
            "relative w-full transition-all duration-1000",
            "max-w-6xl mx-auto xl:max-w-7xl 2xl:max-w-[1600px]",
            isVisible ? "opacity-100" : "opacity-0"
          )}
          style={{ aspectRatio: "16/7" }}
        >
          {/* Coordinate System - Axes */}
          <svg 
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 1000 750"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              {/* Gradient for axes */}
              {/* 使用主色 #FC6D60 和辅助色 #9666FF */}
              <linearGradient id="axisGradientX" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(252,109,96,0)" />
                <stop offset="20%" stopColor="rgba(252,109,96,0.3)" />
                <stop offset="50%" stopColor="rgba(252,109,96,0.6)" />
                <stop offset="80%" stopColor="rgba(252,109,96,0.3)" />
                <stop offset="100%" stopColor="rgba(252,109,96,0)" />
              </linearGradient>
              <linearGradient id="axisGradientY" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(150,102,255,0)" />
                <stop offset="20%" stopColor="rgba(150,102,255,0.3)" />
                <stop offset="50%" stopColor="rgba(150,102,255,0.6)" />
                <stop offset="80%" stopColor="rgba(150,102,255,0.3)" />
                <stop offset="100%" stopColor="rgba(150,102,255,0)" />
              </linearGradient>
              {/* Glow filter */}
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {/* X Axis - Horizontal */}
            <line 
              x1="50" y1="375" x2="950" y2="375" 
              stroke="url(#axisGradientX)" 
              strokeWidth="1"
              className={cn(
                "transition-all duration-1000 delay-300",
                isVisible ? "opacity-100" : "opacity-0"
              )}
            />
            
            {/* Y Axis - Vertical */}
            <line 
              x1="500" y1="30" x2="500" y2="720" 
              stroke="url(#axisGradientY)" 
              strokeWidth="1"
              className={cn(
                "transition-all duration-1000 delay-300",
                isVisible ? "opacity-100" : "opacity-0"
              )}
            />

            {/* Center point glow */}
            <circle 
              cx="500" cy="375" r="6" 
              fill="rgba(252,109,96,0.8)"
              filter="url(#glow)"
              className={cn(
                "transition-all duration-700 delay-500",
                isVisible ? "opacity-100" : "opacity-0"
              )}
            />
            <circle 
              cx="500" cy="375" r="3" 
              fill="white"
              className={cn(
                "transition-all duration-700 delay-500",
                isVisible ? "opacity-100" : "opacity-0"
              )}
            />

            {/* Decorative tick marks on X axis */}
            {[-3, -2, -1, 1, 2, 3].map((i) => (
              <g key={`x-tick-${i}`}>
                <line 
                  x1={500 + i * 100} y1="370" 
                  x2={500 + i * 100} y2="380" 
                  stroke="rgba(252,109,96,0.3)" 
                  strokeWidth="1"
                />
              </g>
            ))}

            {/* Decorative tick marks on Y axis */}
            {[-2, -1, 1, 2].map((i) => (
              <g key={`y-tick-${i}`}>
                <line 
                  x1="495" y1={375 + i * 100} 
                  x2="505" y2={375 + i * 100} 
                  stroke="rgba(150,102,255,0.3)" 
                  strokeWidth="1"
                />
              </g>
            ))}

            {/* Decorative corner dots - 使用主色 #FC6D60 和辅助色 #9666FF */}
            <circle cx="150" cy="120" r="2" fill="rgba(252,109,96,0.4)" />
            <circle cx="180" cy="140" r="1.5" fill="rgba(252,109,96,0.25)" />
            <circle cx="350" cy="100" r="1" fill="rgba(150,102,255,0.3)" />
            
            {/* Decorative corner dots - Top Right Quadrant */}
            <circle cx="850" cy="130" r="2" fill="rgba(150,102,255,0.4)" />
            <circle cx="820" cy="150" r="1.5" fill="rgba(150,102,255,0.25)" />
            <circle cx="650" cy="110" r="1" fill="rgba(252,109,96,0.3)" />

            {/* Decorative corner dots - Bottom Left Quadrant */}
            <circle cx="140" cy="620" r="2" fill="rgba(150,102,255,0.35)" />
            <circle cx="170" cy="600" r="1.5" fill="rgba(252,109,96,0.25)" />
            <circle cx="360" cy="650" r="1" fill="rgba(150,102,255,0.3)" />

            {/* Decorative corner dots - Bottom Right Quadrant */}
            <circle cx="860" cy="610" r="2" fill="rgba(252,109,96,0.35)" />
            <circle cx="830" cy="630" r="1.5" fill="rgba(150,102,255,0.25)" />
            <circle cx="640" cy="660" r="1" fill="rgba(252,109,96,0.3)" />

            {/* Decorative dashed circles around center */}
            <circle 
              cx="500" cy="375" r="60" 
              fill="none" 
              stroke="rgba(252,109,96,0.1)" 
              strokeWidth="1" 
              strokeDasharray="4 6"
            />
            <circle 
              cx="500" cy="375" r="120" 
              fill="none" 
              stroke="rgba(150,102,255,0.08)" 
              strokeWidth="1" 
              strokeDasharray="2 8"
            />

            {/* Decorative connecting lines to quadrants */}
            <line 
              x1="500" y1="375" x2="250" y2="190" 
              stroke="rgba(252,109,96,0.1)" 
              strokeWidth="1" 
              strokeDasharray="4 4"
            />
            <line 
              x1="500" y1="375" x2="750" y2="190" 
              stroke="rgba(150,102,255,0.1)" 
              strokeWidth="1" 
              strokeDasharray="4 4"
            />
            <line 
              x1="500" y1="375" x2="250" y2="560" 
              stroke="rgba(150,102,255,0.1)" 
              strokeWidth="1" 
              strokeDasharray="4 4"
            />
            <line 
              x1="500" y1="375" x2="750" y2="560" 
              stroke="rgba(252,109,96,0.1)" 
              strokeWidth="1" 
              strokeDasharray="4 4"
            />

            {/* Axis labels */}
            <text x="960" y="380" fill="rgba(252,109,96,0.5)" fontSize="10" fontFamily="monospace">+X</text>
            <text x="40" y="380" fill="rgba(252,109,96,0.3)" fontSize="10" fontFamily="monospace">-X</text>
            <text x="508" y="25" fill="rgba(150,102,255,0.5)" fontSize="10" fontFamily="monospace">+Y</text>
            <text x="508" y="740" fill="rgba(150,102,255,0.3)" fontSize="10" fontFamily="monospace">-Y</text>

            {/* Small decorative shapes */}
            {/* Triangle */}
            <polygon 
              points="100,300 110,280 120,300" 
              fill="none" 
              stroke="rgba(252,109,96,0.2)" 
              strokeWidth="1"
            />
            {/* Square */}
            <rect 
              x="870" y="280" width="15" height="15" 
              fill="none" 
              stroke="rgba(150,102,255,0.2)" 
              strokeWidth="1"
              transform="rotate(15, 877.5, 287.5)"
            />
            {/* Diamond */}
            <polygon 
              points="110,480 120,470 130,480 120,490" 
              fill="none" 
              stroke="rgba(150,102,255,0.2)" 
              strokeWidth="1"
            />
            {/* Circle */}
            <circle 
              cx="880" cy="470" r="8" 
              fill="none" 
              stroke="rgba(252,109,96,0.2)" 
              strokeWidth="1"
            />
          </svg>

          {/* Cards Grid - positioned in quadrants */}
          <div className="absolute inset-0 grid grid-cols-2 gap-x-2 gap-y-4 sm:gap-x-3 sm:gap-y-5 md:gap-x-4 md:gap-y-6 lg:gap-x-6 lg:gap-y-10 p-2 sm:p-4 md:p-6 xl:p-6 2xl:p-8">
            {methods.map((method, i) => {
              const isTop = i < 2;
              const isLeft = i % 2 === 0;
              
              return (
                <div
                  key={i}
                  className={cn(
                    "group relative cursor-pointer transition-all duration-700 hover:z-10",
                    isTop ? "self-start" : "self-end",
                    isLeft ? "justify-self-start" : "justify-self-end",
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  )}
                  style={{ 
                    transitionDelay: `${400 + i * 150}ms`,
                  }}
                >
                  <div 
                    className={cn(
                      "relative rounded-lg border border-border/30 bg-card/40 backdrop-blur-sm transition-all duration-550",
                      "hover:border-primary/40 hover:bg-card/60 hover:shadow-lg hover:shadow-primary/5",
                      "p-4 sm:p-5 md:p-6 lg:p-8 xl:p-9 2xl:p-10",
                      "w-[140px] h-auto min-h-[200px] sm:w-[200px] sm:min-h-[220px] md:w-[260px] md:min-h-[240px] lg:w-[420px] lg:min-h-[260px] xl:w-[560px] xl:h-[300px] 2xl:w-[640px] 2xl:h-[340px]"
                    )}
                    style={{
                      transform: `translate(${mouse.x * 4 * (isLeft ? 1 : -1)}px, ${mouse.y * 4 * (isTop ? 1 : -1)}px)`
                    }}
                  >
                    {/* Hover glow effect */}
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Content */}
                    <div className="relative">
                      {/* Icon */}
                      <div className="mb-5">
                        <div className="inline-flex items-center justify-center w-11 h-11 rounded-lg bg-primary/10 text-primary group-hover:scale-110 group-hover:bg-primary/15 transition-all duration-300">
                          <method.icon className="w-5 h-5" />
                        </div>
                      </div>

                      {/* Title */}
                      <div className="mb-2 sm:mb-2.5 md:mb-3">
                        <h3 className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-light mb-0.5 leading-tight">
                          {method.title}
                          <span className="text-primary">·</span>
                          <span className="text-primary/80">{method.name}</span>
                        </h3>
                        <span className="text-[9px] sm:text-[10px] md:text-[11px] font-mono text-muted-foreground/60 tracking-wider uppercase">
                          {method.subtitle}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-[10px] sm:text-xs md:text-sm lg:text-base text-muted-foreground mb-2 sm:mb-3 md:mb-4 lg:mb-5 leading-relaxed flex-1">
                        {method.description}
                      </p>

                      {/* Features */}
                      <div className="flex flex-wrap gap-1 sm:gap-1.5 md:gap-2">
                        {method.features.map((feature, j) => (
                          <span
                            key={j}
                            className="px-1.5 py-0.5 sm:px-2 sm:py-0.5 md:px-2.5 md:py-1 text-[9px] sm:text-[10px] md:text-[11px] font-mono text-muted-foreground/70 bg-secondary/30 rounded group-hover:bg-secondary/50 group-hover:text-muted-foreground transition-colors duration-300"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>

                      {/* Arrow indicator */}
                      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 md:top-5 md:right-5 lg:top-6 lg:right-6 w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                        <svg
                          className="w-3 h-3 sm:w-[14px] sm:h-[14px] md:w-4 md:h-4 text-primary"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M7 17L17 7M17 7H7M17 7V17"
                          />
                        </svg>
                      </div>
                    </div>

                    {/* Corner decorative element */}
                    <div className={cn(
                      "absolute w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 border-primary/20 transition-all duration-300 group-hover:border-primary/40",
                      isTop && isLeft && "bottom-0 right-0 border-b border-r rounded-br-lg",
                      isTop && !isLeft && "bottom-0 left-0 border-b border-l rounded-bl-lg",
                      !isTop && isLeft && "top-0 right-0 border-t border-r rounded-tr-lg",
                      !isTop && !isLeft && "top-0 left-0 border-t border-l rounded-tl-lg"
                    )} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Center label */}
          <div 
            className={cn(
              "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-1000 delay-700",
              isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
            )}
          >
            <div className="text-center">
              <div className="text-[10px] font-mono text-primary/60 tracking-[0.3em] mb-1">ORIGIN</div>
              <div className="text-[9px] font-mono text-muted-foreground/40">0,0</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
