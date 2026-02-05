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
    { type: "wechat" as const, label: footerT.wechat },
    { type: "xiaohongshu" as const, label: footerT.xiaohongshu },
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
                href="mailto:loopart.cherry@gmail.com" 
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="w-4 h-4" />
                loopart.cherry@gmail.com
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
            {socialLinks.map((link) => {
              if (link.type === "wechat") {
                return (
                  <div
                    key={link.label}
                    className="relative group cursor-pointer text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
                  >
                    {link.label}
                    <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-3 opacity-0 group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-300">
                      <div className="rounded-xl border border-border/60 bg-background/95 shadow-xl p-2">
                        <Image
                          src="/wechat-qr.png.JPG"
                          alt="WeChat QR"
                          width={180}
                          height={220}
                          className="rounded-lg"
                        />
                        <p className="mt-2 text-[10px] text-muted-foreground text-center whitespace-nowrap">
                          扫一扫添加微信
                        </p>
                      </div>
                    </div>
                  </div>
                );
              }

              if (link.type === "xiaohongshu") {
                return (
                  <a
                    key={link.label}
                    href="https://www.xiaohongshu.com/user/profile/663385970000000007004d82?xsec_token=YBzvTHleKbYzcc5JaHe7OyttFN1BVDR6czrGBMPBo0x2M=&xsec_source=app_share&xhsshare=CopyLink&shareRedId=ODw1Mzs6PUA2NzUyOTgwNjY6OTc4ST47&apptime=1770195927&share_id=c1348300a3d44f1e8611f367e046b963"
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                );
              }

              return null;
            })}
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
