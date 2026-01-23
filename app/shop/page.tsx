"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, ShoppingCart, Star, Sparkles, Clock, Zap, ArrowRight, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { Header } from "@/components/sections/header";
import { Footer } from "@/components/sections/footer";

const categories = [
  { id: "all", label: "全部", labelEn: "All" },
  { id: "ppt", label: "PPT模板", labelEn: "Templates" },
  { id: "design", label: "设计规范", labelEn: "Design Systems" },
  { id: "toolkit", label: "工具包", labelEn: "Toolkits" },
  { id: "course", label: "课程", labelEn: "Courses" },
];

const products = [
  {
    id: 1,
    name: "ToB融资BP模板 Pro",
    nameEn: "ToB Pitch Deck Pro",
    description: "专为ToB企业设计的融资路演模板，助力8亿+融资",
    category: "ppt",
    price: 299,
    originalPrice: 599,
    image: "/images/product-ppt.jpg",
    tag: "热销",
    tagType: "hot",
    rating: 4.9,
    sales: 1280,
    isNew: false,
  },
  {
    id: 2,
    name: "VCMA可视化设计规范",
    nameEn: "VCMA Design System",
    description: "完整的ToB可视化设计系统，包含组件库和规范文档",
    category: "design",
    price: 499,
    originalPrice: 999,
    image: "/images/product-design-system.jpg",
    tag: "新品",
    tagType: "new",
    rating: 5.0,
    sales: 386,
    isNew: true,
  },
  {
    id: 3,
    name: "数据可视化工具包",
    nameEn: "Data Viz Toolkit",
    description: "200+数据图表模板，覆盖大屏/报表/仪表盘场景",
    category: "toolkit",
    price: 199,
    originalPrice: 399,
    image: "/images/product-toolkit.jpg",
    tag: "限时",
    tagType: "limited",
    rating: 4.8,
    sales: 2150,
    isNew: false,
  },
  {
    id: 4,
    name: "ToB可视化设计实战课",
    nameEn: "ToB Visual Design Course",
    description: "12节系统课程，从理论到实战全面提升",
    category: "course",
    price: 899,
    originalPrice: 1299,
    image: "/images/product-course.jpg",
    tag: null,
    tagType: null,
    rating: 4.9,
    sales: 568,
    isNew: false,
  },
  {
    id: 5,
    name: "品牌视觉识别系统模板",
    nameEn: "Brand VI Template",
    description: "完整的品牌VI设计模板，快速建立品牌识别",
    category: "design",
    price: 399,
    originalPrice: 799,
    image: "/images/product-design-system.jpg",
    tag: "热销",
    tagType: "hot",
    rating: 4.7,
    sales: 890,
    isNew: false,
  },
  {
    id: 6,
    name: "产品发布会PPT模板",
    nameEn: "Launch Event Template",
    description: "科技感十足的产品发布会演示模板",
    category: "ppt",
    price: 249,
    originalPrice: 499,
    image: "/images/product-ppt.jpg",
    tag: "新品",
    tagType: "new",
    rating: 4.8,
    sales: 420,
    isNew: true,
  },
  {
    id: 7,
    name: "图标设计工具包",
    nameEn: "Icon Design Kit",
    description: "500+矢量图标，统一的科技风格设计语言",
    category: "toolkit",
    price: 149,
    originalPrice: 299,
    image: "/images/product-toolkit.jpg",
    tag: null,
    tagType: null,
    rating: 4.6,
    sales: 1560,
    isNew: false,
  },
  {
    id: 8,
    name: "数据叙事设计课程",
    nameEn: "Data Storytelling Course",
    description: "学会用数据讲故事，提升报告说服力",
    category: "course",
    price: 599,
    originalPrice: 899,
    image: "/images/product-course.jpg",
    tag: "限时",
    tagType: "limited",
    rating: 4.9,
    sales: 320,
    isNew: false,
  },
];

function ProductCard({ product, index }: { product: typeof products[0]; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const tagColors: Record<string, string> = {
    hot: "bg-primary text-primary-foreground",
    new: "bg-accent text-accent-foreground",
    limited: "bg-yellow-500/90 text-black",
  };

  return (
    <div
      ref={ref}
      className={cn(
        "group relative transition-all duration-700",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}
      style={{ transitionDelay: `${index * 100}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/shop/${product.id}`}>
        <div className="relative rounded-2xl border border-border/30 bg-card/30 backdrop-blur-sm overflow-hidden transition-all duration-500 hover:border-primary/50 hover:shadow-[0_0_40px_-10px] hover:shadow-primary/20">
          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              fill
              className={cn(
                "object-cover transition-transform duration-700",
                isHovered && "scale-110"
              )}
            />
            {/* Overlay */}
            <div className={cn(
              "absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent transition-opacity duration-500",
              isHovered ? "opacity-90" : "opacity-60"
            )} />
            
            {/* Tag */}
            {product.tag && (
              <div className={cn(
                "absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium",
                tagColors[product.tagType || "hot"]
              )}>
                {product.tag}
              </div>
            )}

            {/* Quick view on hover */}
            <div className={cn(
              "absolute inset-0 flex items-center justify-center transition-all duration-500",
              isHovered ? "opacity-100" : "opacity-0"
            )}>
              <span className="px-6 py-3 bg-primary text-primary-foreground rounded-full text-sm font-medium flex items-center gap-2 transform transition-transform duration-300 hover:scale-105">
                查看详情
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Rating & Sales */}
            <div className="flex items-center gap-4 mb-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                {product.rating}
              </span>
              <span>{product.sales}+ 已购</span>
            </div>

            {/* Title */}
            <h3 className="text-lg font-medium text-foreground mb-1 line-clamp-1 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <p className="text-xs font-mono text-muted-foreground/60 mb-2">
              {product.nameEn}
            </p>

            {/* Description */}
            <p className="text-sm text-muted-foreground line-clamp-1 mb-4">
              {product.description}
            </p>

            {/* Price */}
            <div className="flex items-end justify-between">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-primary">¥{product.price}</span>
                <span className="text-sm text-muted-foreground/50 line-through">¥{product.originalPrice}</span>
              </div>
              <button className="px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors">
                购买
              </button>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesCategory = activeCategory === "all" || product.category === activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background page-enter">
      <Header />
      
      <main className="pt-24 pb-32 page-enter-content">
        {/* Hero Header */}
        <section ref={headerRef} className="relative px-2 md:px-4 lg:px-8 xl:px-32 py-20 overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px]" />
          </div>

          <div className="relative">
            {/* Section label */}
            <div className={cn(
              "flex items-center gap-4 mb-8 transition-all duration-700",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}>
              <span className="text-xs font-mono text-primary tracking-widest">04</span>
              <div className="w-12 h-px bg-primary/50" />
              <span className="text-xs font-mono text-muted-foreground tracking-widest">
                产品商店 <span className="text-primary/40">/ Shop</span>
              </span>
            </div>

            {/* Title */}
            <h1 className={cn(
              "text-4xl md:text-5xl lg:text-6xl font-extralight leading-[1.1] mb-6 transition-all duration-700 delay-100",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}>
              设计资源，
              <span className="text-muted-foreground">加速你的可视化工作</span>
            </h1>

            {/* Stats */}
            <div className={cn(
              "flex flex-wrap gap-8 md:gap-16 mb-12 transition-all duration-700 delay-200",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}>
              <div>
                <div className="text-3xl font-light text-primary">20+</div>
                <div className="text-xs font-mono text-muted-foreground mt-1">精选产品</div>
              </div>
              <div>
                <div className="text-3xl font-light text-primary">8,000+</div>
                <div className="text-xs font-mono text-muted-foreground mt-1">用户购买</div>
              </div>
              <div>
                <div className="text-3xl font-light text-primary">4.9</div>
                <div className="text-xs font-mono text-muted-foreground mt-1">平均评分</div>
              </div>
            </div>

            {/* Search & Filter */}
            <div className={cn(
              "flex flex-col md:flex-row gap-4 transition-all duration-700 delay-300",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}>
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="搜索产品..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-secondary/50 border border-border/30 rounded-xl text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>

              {/* Categories */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={cn(
                      "px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300",
                      activeCategory === category.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary"
                    )}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="px-2 md:px-4 lg:px-8 xl:px-32">
          <div>
            {/* Results count */}
            <div className="flex items-center justify-between mb-8">
              <p className="text-sm text-muted-foreground">
                共 <span className="text-foreground font-medium">{filteredProducts.length}</span> 个产品
              </p>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>

            {/* Empty state */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-20">
                <p className="text-muted-foreground">没有找到相关产品</p>
              </div>
            )}
          </div>
        </section>

        {/* Enterprise CTA */}
        <section className="px-2 md:px-4 lg:px-8 xl:px-32 mt-32">
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div className="relative rounded-3xl border border-border/30 bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-sm p-12 md:p-16 text-center overflow-hidden">
              {/* Background */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-primary/10 rounded-full blur-[80px]" />
              </div>

              <div className="relative">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 mb-6">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-sm text-primary font-mono">企业定制</span>
                </div>

                <h2 className="text-3xl md:text-4xl font-light mb-4">
                  需要企业级定制方案？
                </h2>
                <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                  针对企业需求提供定制化设计系统、模板库和培训服务，助力团队提升效率
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/#contact"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors"
                  >
                    预约咨询
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/portfolio"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-border/50 rounded-full text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
                  >
                    查看企业案例
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
