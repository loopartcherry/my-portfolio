"use client";

import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { useLang } from "@/components/providers/lang-provider";
import { getT } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Mail, MapPin } from "lucide-react";
import Image from "next/image";

export function Footer() {
  const { lang } = useLang();
  const footerT = getT(lang).footer;
  const { ref, isVisible } = useScrollAnimation<HTMLElement>();

  const footerLinks = {
    services: {
      title: footerT.services,
      links: [
        { label: footerT.brandVisual, href: "/methodology" },
        { label: footerT.techVisual, href: "/methodology" },
        { label: footerT.productVisual, href: "/methodology" },
        { label: footerT.dataVisual, href: "/methodology" },
      ],
    },
    resources: {
      title: footerT.resources,
      links: [
        { label: footerT.templates, href: "/shop" },
        { label: footerT.components, href: "/shop" },
        { label: footerT.blog, href: "/insights" },
        { label: footerT.tools, href: "/shop" },
      ],
    },
    company: {
      title: footerT.company,
      links: [
        { label: footerT.about, href: "/about" },
        { label: footerT.portfolio, href: "/portfolio" },
        { label: footerT.contact, href: "/about" },
        { label: footerT.privacy, href: "/privacy" },
        { label: footerT.terms, href: "/terms" },
        { label: footerT.refund, href: "/refund" },
      ],
    },
  };

  const socialLinks = [
    { label: footerT.wechat, href: "#" },
    { label: footerT.xiaohongshu, href: "#" },
    { label: footerT.jike, href: "#" },
    { label: "Twitter", href: "#" },
  ];

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
              {footerT.tagline}
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
                {footerT.location}
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
            {footerT.copyright}
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
