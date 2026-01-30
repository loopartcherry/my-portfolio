"use client";

import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { useLang } from "@/components/providers/lang-provider";
import { getT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function Trust() {
  const { lang } = useLang();
  const trustT = getT(lang).trust;
  const { ref, isVisible } = useScrollAnimation<HTMLElement>();
  const partners = trustT.partners;

  return (
    <section ref={ref} className="relative py-24 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
      
      <div className="relative px-2 md:px-4 lg:px-8 xl:px-32">
        {/* Section label */}
        <div 
          className={cn(
            "flex items-center gap-4 mb-16 transition-all duration-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
        >
          <span className="text-xs font-mono text-primary tracking-widest">01</span>
          <div className="w-12 h-px bg-primary/50" />
          <span className="text-xs font-mono text-muted-foreground tracking-widest">
            {trustT.sectionLabel} <span className="text-primary/40">/ Partners</span>
          </span>
        </div>

        {/* Partners marquee */}
        <div className="relative">
          {/* Gradient masks */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
          
          <div className="flex overflow-hidden">
            <div className="flex animate-marquee">
              {[...partners, ...partners].map((partner, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 mx-12 flex items-center justify-center"
                >
                  <span className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-light text-muted-foreground/40 hover:text-muted-foreground/60 transition-colors duration-300 whitespace-nowrap">
                    {partner}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex animate-marquee" aria-hidden="true">
              {[...partners, ...partners].map((partner, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 mx-12 flex items-center justify-center"
                >
                  <span className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-light text-muted-foreground/40 hover:text-muted-foreground/60 transition-colors duration-300 whitespace-nowrap">
                    {partner}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trust statement */}
        <p 
          className={cn(
            "text-center text-muted-foreground mt-16 transition-all duration-700 delay-300 text-base md:text-lg lg:text-xl xl:text-2xl",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
        >
          {trustT.statementLongA}
          <br className="hidden md:block" />
          {trustT.statementLongB}
        </p>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </section>
  );
}
