"use client";

import React from "react"

import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { cn } from "@/lib/utils";

interface AnimatedTextProps {
  children: string;
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  animation?: "fadeUp" | "fadeIn" | "typewriter" | "split";
}

export function AnimatedText({
  children,
  className,
  delay = 0,
  as: Component = "p",
  animation = "fadeUp",
}: AnimatedTextProps) {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>();

  if (animation === "split") {
    const words = children.split(" ");
    return (
      <Component
        ref={ref as React.RefObject<never>}
        className={cn("overflow-hidden", className)}
      >
        {words.map((word, i) => (
          <span
            key={i}
            className="inline-block overflow-hidden mr-[0.25em]"
          >
            <span
              className={cn(
                "inline-block transition-all duration-700 ease-out",
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-full opacity-0"
              )}
              style={{ transitionDelay: `${delay + i * 50}ms` }}
            >
              {word}
            </span>
          </span>
        ))}
      </Component>
    );
  }

  const animations = {
    fadeUp: {
      visible: "translate-y-0 opacity-100",
      hidden: "translate-y-8 opacity-0",
    },
    fadeIn: {
      visible: "opacity-100",
      hidden: "opacity-0",
    },
    typewriter: {
      visible: "opacity-100",
      hidden: "opacity-0",
    },
  };

  return (
    <Component
      ref={ref as React.RefObject<never>}
      className={cn(
        "transition-all duration-700 ease-out",
        isVisible ? animations[animation].visible : animations[animation].hidden,
        className
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Component>
  );
}

interface AnimatedLineProps {
  className?: string;
  delay?: number;
  direction?: "horizontal" | "vertical";
}

export function AnimatedLine({
  className,
  delay = 0,
  direction = "horizontal",
}: AnimatedLineProps) {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={cn(
        "bg-primary/30 transition-all duration-1000 ease-out",
        direction === "horizontal" ? "h-px" : "w-px",
        isVisible
          ? direction === "horizontal"
            ? "w-full"
            : "h-full"
          : direction === "horizontal"
          ? "w-0"
          : "h-0",
        className
      )}
      style={{ transitionDelay: `${delay}ms` }}
    />
  );
}
