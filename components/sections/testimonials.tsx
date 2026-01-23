"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Quote, Users, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const testimonials = [
  {
    quote: "这是我见过最懂ToB的设计师。不只是帮我们做项目,更是帮我们建立了设计思维。",
    author: "某SaaS公司CEO",
    achievement: "融资5000万,转化率+40%",
  },
  {
    quote: "专业、高效、结果导向。LoopArt帮助我们完成了品牌升级，直接推动了下一轮融资。",
    author: "某AI公司创始人",
    achievement: "品牌升级后估值提升60%",
  },
  {
    quote: "从数据大屏到产品体验，一人全案搞定。响应速度快，质量超出预期。",
    author: "某数据公司CTO",
    achievement: "续约率从65%提升至89%",
  },
];

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const current = testimonials[currentIndex];

  return (
    <section className="py-24 border-t border-border/40 relative">
      <div className="absolute top-0 right-0 text-[200px] font-extralight text-primary/5 leading-none pointer-events-none">
        <Quote className="w-full h-full" />
      </div>

      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <div className="mb-12 text-center">
            <div className="inline-flex items-center gap-3 px-4 py-1 mb-4 rounded-full border border-primary/30 bg-primary/5">
              <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
              <span className="text-xs font-mono tracking-[0.3em] text-primary">
                TESTIMONIALS
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extralight">客户说</h2>
          </div>

          <div className="text-center">
            <blockquote className="text-2xl md:text-3xl font-light leading-relaxed mb-8 text-foreground">
              {current.quote}
            </blockquote>

            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Users className="w-4 h-4 text-primary" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-foreground">{current.author}</p>
                <p className="text-sm text-primary">{current.achievement}</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 mt-8">
              <Button
                variant="ghost"
                size="icon"
                onClick={prev}
                className="rounded-full border border-border/40 hover:border-primary/50"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentIndex ? "bg-primary" : "bg-border/40"
                    }`}
                    aria-label={`切换到第${index + 1}条证言`}
                  />
                ))}
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={next}
                className="rounded-full border border-border/40 hover:border-primary/50"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            <div className="mt-8">
              <Link
                href="/portfolio"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                查看更多成就
                <ChevronDown className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
