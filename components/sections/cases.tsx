"use client";

import { useState, useRef, useEffect } from "react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const toSlug = (title: string) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const cases = [
  {
    id: 1,
    title: "Cloud Platform Rebrand",
    subtitle: "云原生平台品牌升级",
    client: "Top Cloud Provider",
    tags: ["Brand", "Website", "3D"],
    result: "240% Awareness",
    year: "2025",
    image: "/images/case-cloud.jpg",
  },
  {
    id: 2,
    title: "AI Product Visualization",
    subtitle: "AI产品全案可视化",
    client: "AI Unicorn",
    tags: ["Product", "Motion", "Interactive"],
    result: "$300M Raised",
    year: "2025",
    image: "/images/case-ai.jpg",
  },
  {
    id: 3,
    title: "Data Platform Design System",
    subtitle: "数据中台可视化体系",
    client: "FinTech Enterprise",
    tags: ["Dashboard", "Data Viz", "System"],
    result: "180% Efficiency",
    year: "2024",
    image: "/images/case-data.jpg",
  },
  {
    id: 4,
    title: "FinTech Brand Identity",
    subtitle: "金融科技品牌重塑",
    client: "Digital Bank",
    tags: ["Brand", "App", "Motion"],
    result: "2M+ Users",
    year: "2024",
    image: "/images/case-fintech.jpg",
  },
];

export function Cases() {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>();
  const [activeCase, setActiveCase] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section id="cases" ref={ref} className="relative py-20 md:py-24 lg:py-32 xl:py-40 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />

      <div className="relative px-2 md:px-4 lg:px-8 xl:px-32">
        {/* Section header - Ashfall style */}
        <div className="mb-12 md:mb-16 lg:mb-20 xl:mb-28">
          <div 
            className={cn(
              "flex items-center gap-3 md:gap-4 mb-6 md:mb-8 transition-all duration-700",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            <span className="text-[10px] font-mono text-primary/60 tracking-[0.3em]">03</span>
            <div className="w-6 md:w-8 h-px bg-primary/30" />
            <span className="text-[10px] font-mono text-muted-foreground/60 tracking-[0.3em]">
              精选案例 <span className="text-primary/40">/ Work</span>
            </span>
          </div>
          
          <h2 
            className={cn(
              "text-3xl md:text-4xl lg:text-[3.5rem] xl:text-[4.5rem] 2xl:text-[5.5rem] font-light leading-[1.1] transition-all duration-700 delay-100",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            从初创企业到行业领军者，
            <span className="text-muted-foreground">打造驱动增长的可视化系统</span>
          </h2>
        </div>

        {/* Cases list with hover image preview */}
        <div ref={containerRef} className="relative">
          {/* Floating preview image */}
          <div 
            className={cn(
              "fixed w-[400px] h-[280px] rounded-lg overflow-hidden pointer-events-none z-50 transition-opacity duration-300",
              activeCase !== null ? "opacity-100" : "opacity-0"
            )}
            style={{
              left: mousePos.x + 20,
              top: mousePos.y - 140,
              transform: "translate(0, 0)",
            }}
          >
            {activeCase !== null && (
              <Image
                src={cases.find(c => c.id === activeCase)?.image || "/placeholder.svg"}
                alt=""
                fill
                className="object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          </div>

          {/* Case items */}
          <div className="divide-y divide-border/30">
            {cases.map((caseItem, i) => (
              <Link
                key={caseItem.id}
                href={`/portfolio/${toSlug(caseItem.title)}`}
                className={cn(
                  "group relative block py-6 md:py-8 lg:py-10 xl:py-12 transition-all duration-700",
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                )}
                style={{ transitionDelay: `${200 + i * 100}ms` }}
                onMouseEnter={() => setActiveCase(caseItem.id)}
                onMouseLeave={() => setActiveCase(null)}
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 lg:gap-8">
                  {/* Year */}
                  <span className="text-xs font-mono text-muted-foreground/50 md:w-16 lg:w-20 flex-shrink-0">
                    {caseItem.year}
                  </span>

                  {/* Title group */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl md:text-2xl lg:text-3xl font-light group-hover:text-primary transition-colors duration-300">
                      {caseItem.title}
                    </h3>
                    <span className="text-sm md:text-base text-muted-foreground/60 mt-1 block">
                      {caseItem.subtitle}
                    </span>
                  </div>

                  {/* Tags - hidden on mobile */}
                  <div className="hidden md:flex items-center gap-2 flex-shrink-0 md:w-48 lg:w-64">
                    {caseItem.tags.map((tag, j) => (
                      <span
                        key={j}
                        className="px-2 md:px-3 py-1 text-[10px] font-mono text-muted-foreground/60 border border-border/30 rounded-full whitespace-nowrap"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Result */}
                  <div className="flex items-center justify-between md:justify-end gap-2 md:w-40 lg:w-48 flex-shrink-0">
                    <span className="text-xs md:text-sm font-mono text-primary/80 whitespace-nowrap">
                      {caseItem.result}
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300 flex-shrink-0" />
                  </div>
                </div>

                {/* Hover line */}
                <div className="absolute bottom-0 left-0 h-px w-0 bg-primary/50 group-hover:w-full transition-all duration-500" />
              </Link>
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
            <Link
              href="/portfolio"
              className="group flex items-center gap-3 px-8 py-4 text-sm font-mono text-muted-foreground border border-border/30 rounded-full hover:border-primary/50 hover:text-primary transition-all duration-300"
            >
              <span>查看全部案例</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
