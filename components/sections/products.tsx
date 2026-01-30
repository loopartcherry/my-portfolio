"use client";

import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { useLang } from "@/components/providers/lang-provider";
import { getT } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { ArrowUpRight, Star, Download, Zap } from "lucide-react";
import Image from "next/image";

const products = [
  {
    title: "ToB Design Template Library",
    subtitle: "ToB可视化设计模板库",
    description: "100+ premium templates for brand, product, and data visualization scenarios.",
    price: "¥299",
    originalPrice: "¥599",
    badge: "Popular",
    features: ["100+ Templates", "Updates", "Commercial"],
    sales: "2,340+",
    rating: 4.9,
    image: "/images/product-template.jpg",
  },
  {
    title: "Data Viz Component Kit",
    subtitle: "数据可视化组件包",
    description: "Professional data chart components for Figma and Sketch.",
    price: "¥199",
    originalPrice: "¥399",
    badge: "New",
    features: ["50+ Components", "Source Files", "Tutorials"],
    sales: "1,120+",
    rating: 4.8,
    image: "/images/case-ai.jpg",
  },
  {
    title: "Brand Visual Guidebook",
    subtitle: "品牌视觉指南手册",
    description: "Complete methodology from strategy to execution.",
    price: "¥99",
    originalPrice: "¥199",
    badge: "",
    features: ["E-book", "Case Studies", "Templates"],
    sales: "5,680+",
    rating: 4.9,
    image: "/images/case-data.jpg",
  },
  {
    title: "Design System Toolkit",
    subtitle: "设计系统工具包",
    description: "Comprehensive design system components and guidelines for enterprise applications.",
    price: "¥399",
    originalPrice: "¥699",
    badge: "Pro",
    features: ["Design Tokens", "Components", "Documentation"],
    sales: "890+",
    rating: 4.9,
    image: "/images/case-fintech.jpg",
  },
];

export function Products() {
  const { lang } = useLang();
  const productsT = getT(lang).products;
  const { ref, isVisible } = useScrollAnimation<HTMLElement>();

  return (
    <section id="products" ref={ref} className="relative py-32 lg:py-40 overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="relative px-2 md:px-4 lg:px-8 xl:px-32">
        {/* Section header */}
        <div className="mb-20 lg:mb-28">
          <div 
            className={cn(
              "flex items-center gap-4 mb-8 transition-all duration-700",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            <span className="text-[10px] font-mono text-primary/60 tracking-[0.3em]">05</span>
            <div className="w-8 h-px bg-primary/30" />
            <span className="text-[10px] font-mono text-muted-foreground/60 tracking-[0.3em]">
              {productsT.sectionLabel} <span className="text-primary/40">/ {productsT.shopLabel}</span>
            </span>
          </div>
          
          <h2 
            className={cn(
              "text-3xl md:text-4xl lg:text-[3.5rem] xl:text-[4.5rem] 2xl:text-[5.5rem] font-light leading-[1.1] transition-all duration-700 delay-100",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            {productsT.titleA}
            <span className="text-muted-foreground">{productsT.titleB}</span>
          </h2>
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
          {products.map((product, i) => (
            <a
              href={`/shop/${product.title.toLowerCase().replace(/\s+/g, "-")}`}
              key={product.title}
              className={cn(
                "group relative rounded-xl border border-border/30 bg-card/30 backdrop-blur-sm transition-all duration-700 hover:border-primary/40 overflow-hidden",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}
              style={{ transitionDelay: `${200 + i * 100}ms` }}
            >
              {/* Product image */}
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/70 to-card/30" />
                
                {/* Badge */}
                {product.badge && (
                  <div className="absolute top-4 right-4">
                    <span className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-mono bg-primary text-primary-foreground rounded-full tracking-wider">
                      <Zap className="w-3 h-3" />
                      {product.badge}
                    </span>
                  </div>
                )}
              </div>

              <div className="relative p-6 lg:p-8">
                {/* Title & description */}
                <h3 className="text-lg font-medium mb-1 group-hover:text-primary transition-colors duration-300">
                  {product.title}
                </h3>
                <p className="text-xs text-muted-foreground/50 mb-3">
                  {product.subtitle}
                </p>
                <p className="text-sm text-muted-foreground/70 mb-6 leading-relaxed">
                  {product.description}
                </p>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {product.features.map((feature) => (
                    <span
                      key={feature}
                      className="px-2 py-1 text-[10px] font-mono text-muted-foreground/60 bg-secondary/30 rounded tracking-wider"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                {/* Stats */}
                <div className="flex items-center gap-6 mb-6 text-sm">
                  <span className="flex items-center gap-1.5 text-muted-foreground/60">
                    <Star className="w-3 h-3 text-primary fill-primary" />
                    <span className="font-mono text-xs">{product.rating}</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-muted-foreground/60">
                    <Download className="w-3 h-3" />
                    <span className="font-mono text-xs">{product.sales}</span>
                  </span>
                </div>

                {/* Price & CTA */}
                <div className="flex items-center justify-between pt-6 border-t border-border/30">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-light text-primary font-mono">
                      {product.price}
                    </span>
                    <span className="text-xs text-muted-foreground/40 line-through font-mono">
                      {product.originalPrice}
                    </span>
                  </div>
                  <span className="flex items-center gap-2 text-xs font-mono text-muted-foreground/60 group-hover:text-primary transition-colors duration-300">
                    立即获取
                    <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
