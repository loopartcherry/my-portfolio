"use client";

import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { cn } from "@/lib/utils";
import { Mail, MapPin } from "lucide-react";
import Image from "next/image";

const footerLinks = {
  services: {
    title: "服务",
    links: [
      { label: "品牌可视化", href: "/methodology" },
      { label: "技术可视化", href: "/methodology" },
      { label: "产品可视化", href: "/methodology" },
      { label: "数据可视化", href: "/methodology" },
    ],
  },
  resources: {
    title: "资源",
    links: [
      { label: "设计模板", href: "/shop" },
      { label: "组件库", href: "/shop" },
      { label: "文章博客", href: "/insights" },
      { label: "免费工具", href: "/shop" },
    ],
  },
  company: {
    title: "关于",
    links: [
      { label: "关于我", href: "/about" },
      { label: "合作案例", href: "/portfolio" },
      { label: "联系方式", href: "/about" },
      { label: "隐私政策", href: "/about" },
    ],
  },
};

const socialLinks = [
  { label: "微信", href: "#" },
  { label: "小红书", href: "#" },
  { label: "即刻", href: "#" },
  { label: "Twitter", href: "#" },
];

export function Footer() {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>();

  return (
    <footer ref={ref} className="relative border-t border-border/50">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-secondary/10" />

      <div className="relative px-2 md:px-4 lg:px-8 xl:px-32 py-16 lg:py-24">
        <div 
          className={cn(
            "grid grid-cols-2 md:grid-cols-5 gap-12 lg:gap-16 mb-16 transition-all duration-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          {/* Brand */}
          <div className="col-span-2">
            <a href="/" className="inline-block mb-6">
              <Image
                src="/loopart-logo.svg"
                alt="LoopArt Logo"
                width={120}
                height={21}
                className="h-6 w-auto scale-[0.6] origin-left"
              />
            </a>
            <p className="text-muted-foreground mb-6 leading-relaxed text-sm md:text-base lg:text-lg">
              专注ToB科技企业可视化提升，让复杂变得清晰，让想法变得可见。
            </p>
            <div className="flex flex-col gap-3">
              <a 
                href="mailto:hello@loopart.studio" 
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="w-4 h-4" />
                hello@loopart.studio
              </a>
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                北京 · 上海 · 远程
              </span>
            </div>
          </div>

          {/* Links */}
          {Object.values(footerLinks).map((section, i) => (
            <div 
              key={section.title}
              className={cn(
                "transition-all duration-700",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}
              style={{ transitionDelay: `${100 + i * 50}ms` }}
            >
              <h4 className="text-sm font-mono text-foreground mb-4 tracking-wider">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div 
          className={cn(
            "pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-6 transition-all duration-700 delay-300",
            isVisible ? "opacity-100" : "opacity-0"
          )}
        >
          <p className="text-sm text-muted-foreground font-mono">
            © 2026 LoopArt Studio. All rights reserved.
          </p>
          
          {/* Social links */}
          <div className="flex items-center gap-6">
            {socialLinks.map((link) => (
              <a 
                key={link.label}
                href={link.href} 
                className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Large background text */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden pointer-events-none">
          <div className="text-[15vw] font-light text-foreground/[0.02] whitespace-nowrap leading-none">
            LoopArt Studio
          </div>
        </div>
      </div>
    </footer>
  );
}
