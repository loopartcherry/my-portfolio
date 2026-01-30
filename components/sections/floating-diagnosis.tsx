"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function FloatingDiagnosis() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [lang, setLang] = useState<"zh" | "en">("zh");
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const positionRef = useRef({ x: 0, y: 0 });
  const dragStartRef = useRef({ x: 0, y: 0 });
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const hasMovedRef = useRef(false);

  // 计算最近边缘并吸附（必须在所有 hooks 之后、条件 return 之前定义，供 useEffect 使用）
  const snapToNearestEdge = (x: number, y: number) => {
    if (typeof window === 'undefined' || !buttonRef.current) return { x: 0, y: 0 };
    
    const rect = buttonRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    
    // 计算到各边缘的距离
    const distToLeft = x;
    const distToRight = screenWidth - (x + width);
    const distToTop = y;
    const distToBottom = screenHeight - (y + height);
    
    // 找到最近的边缘
    const minDist = Math.min(distToLeft, distToRight, distToTop, distToBottom);
    
    let newX = x;
    let newY = y;
    
    // 吸附到最近的边缘
    if (minDist === distToLeft) {
      newX = 0;
    } else if (minDist === distToRight) {
      newX = screenWidth - width;
    } else if (minDist === distToTop) {
      newY = 0;
    } else if (minDist === distToBottom) {
      newY = screenHeight - height;
    }
    
    return { x: newX, y: newY };
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // 延迟显示，避免与页面加载动画冲突
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);

    // 从URL检测语言
    const detectedLang = document.documentElement.lang === "en" ? "en" : "zh";
    setLang(detectedLang);

    // 默认位置：右下角，并自动吸附
    const updatePosition = () => {
      if (buttonRef.current && typeof window !== 'undefined') {
        const defaultX = window.innerWidth - (buttonRef.current.offsetWidth || 200);
        const defaultY = window.innerHeight - (buttonRef.current.offsetHeight || 80);
        const snapped = snapToNearestEdge(defaultX, defaultY);
        setPosition(snapped);
        positionRef.current = snapped;
      }
    };

    // 初始位置设置
    updatePosition();
    
    // 监听窗口大小变化，重新计算位置
    const handleResize = () => {
      if (buttonRef.current && !isDraggingRef.current) {
        const snapped = snapToNearestEdge(positionRef.current.x, positionRef.current.y);
        setPosition(snapped);
        positionRef.current = snapped;
      }
    };
    
    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || !buttonRef.current) return;
      
      // 检测是否移动了足够距离（超过5px才认为是拖动）
      const moveX = Math.abs(e.clientX - dragStartRef.current.x);
      const moveY = Math.abs(e.clientY - dragStartRef.current.y);
      
      if (moveX > 5 || moveY > 5) {
        hasMovedRef.current = true;
      }
      
      if (hasMovedRef.current) {
        const newX = e.clientX - dragOffsetRef.current.x;
        const newY = e.clientY - dragOffsetRef.current.y;
        
        // 限制在屏幕范围内
        const maxX = window.innerWidth - buttonRef.current.offsetWidth;
        const maxY = window.innerHeight - buttonRef.current.offsetHeight;
        
        const clampedX = Math.max(0, Math.min(newX, maxX));
        const clampedY = Math.max(0, Math.min(newY, maxY));
        
        const newPos = { x: clampedX, y: clampedY };
        setPosition(newPos);
        positionRef.current = newPos;
        setIsDragging(true);
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      
      const wasDragging = hasMovedRef.current;
      
      setIsDragging(false);
      isDraggingRef.current = false;
      
      if (wasDragging && buttonRef.current) {
        // 只有真正拖动过才吸附
        const snapped = snapToNearestEdge(positionRef.current.x, positionRef.current.y);
        setPosition(snapped);
        positionRef.current = snapped;
      }
      
      // 延迟重置，确保点击事件能检测到
      setTimeout(() => {
        hasMovedRef.current = false;
      }, 100);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      dragStartRef.current = { x: e.clientX, y: e.clientY };
      dragOffsetRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      isDraggingRef.current = true;
      hasMovedRef.current = false;
    }
  };

  return (
    <div
      ref={buttonRef}
      className={cn(
        "fixed z-40 group flex items-center gap-2 sm:gap-3 px-3 sm:px-6 py-2 sm:py-4 rounded-full bg-primary/10 backdrop-blur-md border border-primary/30 hover:bg-primary/20 hover:border-primary/50 transition-all duration-300 shadow-lg shadow-primary/10",
        "flex", // 所有屏幕都显示
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none",
        isDragging ? "cursor-grabbing" : "cursor-grab"
      )}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: isDragging ? "scale(1.05)" : undefined,
      }}
      onMouseDown={handleMouseDown}
    >
      <Link
        href="/diagnosis"
        className="flex items-center gap-3 pointer-events-auto"
        onClick={(e) => {
          // 如果刚刚拖动过，阻止导航
          if (hasMovedRef.current) {
            e.preventDefault();
            e.stopPropagation();
            return false;
          }
        }}
        onMouseDown={(e) => {
          // 让事件冒泡到父元素处理拖动
          // 不阻止默认行为，这样点击时 Link 可以正常工作
        }}
      >
        <span className="text-xs sm:text-sm font-mono text-primary tracking-wide select-none whitespace-nowrap">
          {lang === "zh" ? "免费诊断" : "Free Audit"}
        </span>
        <span className="relative w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center border border-primary/40 rounded-full bg-primary/5 group-hover:bg-primary/10 transition-all duration-300 shrink-0">
          <svg
            className="w-3 h-3 sm:w-4 sm:h-4 text-primary transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 17L17 7M17 7H7M17 7v10"
            />
          </svg>
        </span>
      </Link>
    </div>
  );
}
