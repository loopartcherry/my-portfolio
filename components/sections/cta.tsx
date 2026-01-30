"use client";

import { useScrollAnimation, useMousePosition } from "@/hooks/use-scroll-animation";
import { useLang } from "@/components/providers/lang-provider";
import { getT } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle, Sparkles } from "lucide-react";

export function CTA() {
  const { lang } = useLang();
  const ctaT = getT(lang).cta;
  const { ref, isVisible } = useScrollAnimation<HTMLElement>();
  const mouse = useMousePosition();

  return (
    <section ref={ref} className="relative py-32 overflow-hidden">
      <div className="px-2 md:px-4 lg:px-8 xl:px-32">
        <div 
          className={cn(
            "relative rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm overflow-hidden transition-all duration-1000",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          {/* Background effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5" />
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              background: `radial-gradient(circle at ${50 + mouse.x * 20}% ${50 + mouse.y * 20}%, oklch(0.68 0.2 35 / 0.2) 0%, transparent 50%)`
            }}
          />
          
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]">
            <div className="absolute inset-0" style={{
              backgroundImage: `
                linear-gradient(to right, currentColor 1px, transparent 1px),
                linear-gradient(to bottom, currentColor 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px'
            }} />
          </div>

          {/* Decorative lines */}
          <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          <div className="absolute bottom-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

          <div className="relative px-8 py-16 md:px-16 md:py-24 text-center">
            {/* Badge */}
            <div 
              className={cn(
                "inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 mb-8 transition-all duration-700 delay-200",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-mono">{ctaT.badge}</span>
            </div>

            {/* Headline */}
            <h2 
              className={cn(
                "text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-light leading-tight mb-6 transition-all duration-700 delay-300",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
            >
              {ctaT.headline}
              <br />
              <span className="text-glow text-primary">{ctaT.headlineHighlight}</span>？
            </h2>

            {/* Description */}
            <p 
              className={cn(
                "text-lg md:text-xl lg:text-2xl xl:text-2xl text-muted-foreground mb-10 leading-relaxed transition-all duration-700 delay-400",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
            >
              {ctaT.description}
            </p>

            {/* CTAs */}
            <div 
              className={cn(
                "flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 delay-500",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
            >
              <Button 
                size="lg" 
                className="group relative overflow-hidden px-8 py-6 text-base glow-primary"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {ctaT.freeDiagnosis}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="px-8 py-6 text-base border-primary/30 hover:bg-primary/10 hover:border-primary/50 bg-transparent"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                {ctaT.bookConsult}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
