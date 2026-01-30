"use client";

import React from "react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useLang } from "@/components/providers/lang-provider";
import { getT } from "@/lib/i18n";

const navItems = {
  zh: [
    { label: "思想", href: "/insights" },
    { label: "方法", href: "/method" },
    { label: "案例", href: "/portfolio" },
    { label: "产品", href: "/shop" },
    { label: "定价", href: "/pricing" },
    { label: "关于", href: "/about" },
  ],
  en: [
    { label: "Insights", href: "/insights" },
    { label: "Method", href: "/method" },
    { label: "Portfolio", href: "/portfolio" },
    { label: "Shop", href: "/shop" },
    { label: "Pricing", href: "/pricing" },
    { label: "About", href: "/about" },
  ],
};

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { lang, setLang } = useLang();
  const pathname = usePathname();
  const T = getT(lang);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((res) => setIsLoggedIn(res.ok))
      .catch(() => setIsLoggedIn(false));
  }, []);

  const items = navItems[lang];

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-[100] transition-all duration-700",
          isScrolled
            ? "bg-background/80 backdrop-blur-2xl"
            : "bg-transparent"
        )}
      >
        <div className="px-2 md:px-4 lg:px-8 xl:px-32">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <a href="/" className="relative group flex items-center gap-3">
              <Image
                src="/loopart-logo.svg"
                alt="LoopArt Logo"
                width={320}
                height={56}
                className="h-5 w-auto opacity-80 scale-[0.6] origin-left"
                priority
              />
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {items.map((item, i) => {
                const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    className={cn(
                      "relative px-5 py-2 text-[14px] font-mono transition-all duration-300 group tracking-wide",
                      isActive 
                        ? "text-foreground/90" 
                        : "text-foreground/70 hover:text-foreground/90"
                    )}
                  >
                    <span className="relative z-10">{item.label}</span>
                    <span className={cn(
                      "absolute inset-0 scale-90 rounded transition-all duration-300",
                      isActive 
                        ? "bg-primary/10 scale-100 opacity-100" 
                        : "bg-primary/5 opacity-0 group-hover:scale-100 group-hover:opacity-100"
                    )} />
                    <span className={cn(
                      "absolute -top-1 -right-0 text-[8px] font-mono transition-opacity",
                      isActive 
                        ? "text-primary/60 opacity-100" 
                        : "text-primary/30 opacity-0 group-hover:opacity-100"
                    )}>
                      0{i + 1}
                    </span>
                  </a>
                );
              })}
            </nav>

            {/* Right side */}
            <div className="hidden lg:flex items-center gap-6">
              {/* Language Toggle */}
              <button
                onClick={() => setLang(lang === "zh" ? "en" : "zh")}
                className="relative flex items-center gap-1 text-[11px] font-mono text-foreground/70 hover:text-foreground transition-colors group"
              >
                <span
                  className={cn(
                    "transition-all duration-300",
                    lang === "zh" ? "text-primary" : "text-foreground/50"
                  )}
                >
                  中
                </span>
                <span className="text-foreground/30">/</span>
                <span
                  className={cn(
                    "transition-all duration-300",
                    lang === "en" ? "text-primary" : "text-foreground/50"
                  )}
                >
                  EN
                </span>
                <div className="absolute -bottom-1 left-0 right-0 h-px bg-primary/30 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </button>

              {/* Cart Link */}
              <a
                href="/cart"
                className="relative text-foreground/70 hover:text-foreground transition-colors duration-300"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-[10px] text-primary-foreground rounded-full flex items-center justify-center">
                  5
                </span>
              </a>

              {/* Login Link - 仅未登录时显示 */}
              {!isLoggedIn && (
                <a
                  href="/login"
                  className="text-[13px] font-mono text-foreground/70 hover:text-foreground transition-colors duration-300 tracking-wide"
                >
                  {T.header.login}
                </a>
              )}

              {/* Dashboard Link - 仅登录后显示 */}
              {isLoggedIn && (
                <a
                  href="/dashboard"
                  className="text-[11px] font-mono text-primary/60 hover:text-primary transition-colors duration-300 tracking-wide border border-primary/30 rounded px-2 py-1"
                >
                  {T.header.dashboard}
                </a>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <div className="flex lg:hidden items-center gap-4">
              {/* Mobile Lang Toggle */}
              <button
                onClick={() => setLang(lang === "zh" ? "en" : "zh")}
                className="text-[10px] font-mono text-muted-foreground/60"
              >
                {lang === "zh" ? "EN" : "中"}
              </button>
              
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="relative w-10 h-10 flex items-center justify-center"
                aria-label="Toggle menu"
              >
                <div className="relative w-6 h-4 flex flex-col justify-between">
                  <span
                    className={cn(
                      "w-full h-px bg-foreground transition-all duration-300 origin-left",
                      isMobileMenuOpen ? "rotate-45 translate-x-px" : ""
                    )}
                  />
                  <span
                    className={cn(
                      "w-3 h-px bg-foreground transition-all duration-300 ml-auto",
                      isMobileMenuOpen ? "opacity-0" : ""
                    )}
                  />
                  <span
                    className={cn(
                      "w-full h-px bg-foreground transition-all duration-300 origin-left",
                      isMobileMenuOpen ? "-rotate-45 translate-x-px" : ""
                    )}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Scroll border */}
        <div className={cn(
          "absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent transition-opacity duration-500",
          isScrolled ? "opacity-100" : "opacity-0"
        )} />
      </header>

      {/* Mobile Menu */}
      <div
        className={cn(
          "fixed inset-0 z-40 lg:hidden transition-all duration-500",
          isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        <div className="absolute inset-0 bg-background/98 backdrop-blur-2xl" />
        <nav className="relative h-full flex flex-col items-start justify-center px-8 gap-6">
          {items.map((item, i) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
            return (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "group flex items-baseline gap-4 text-4xl font-light transition-all duration-300",
                  isActive ? "text-foreground" : "text-foreground/80 hover:text-foreground",
                  isMobileMenuOpen ? "translate-x-0 opacity-100" : "-translate-x-8 opacity-0"
                )}
                style={{ transitionDelay: `${i * 50 + 100}ms` }}
              >
                <span className={cn(
                  "text-xs font-mono transition-colors",
                  isActive ? "text-primary" : "text-primary/50"
                )}>
                  0{i + 1}
                </span>
                <span>{item.label}</span>
              </a>
            );
          })}
          
          <div
            className={cn(
              "mt-12 pt-8 border-t border-border/30 w-full transition-all duration-300",
              isMobileMenuOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            )}
            style={{ transitionDelay: "350ms" }}
          >
            <a
              href="/diagnosis"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 text-sm font-mono text-muted-foreground"
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span>{T.header.freeDiagnosis}</span>
            </a>
            {!isLoggedIn && (
              <a
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 text-sm font-mono text-muted-foreground/70 mt-4 hover:text-foreground transition-colors"
              >
                <span>{T.header.loginRegister}</span>
              </a>
            )}
            {isLoggedIn && (
              <a
                href="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 text-sm font-mono text-muted-foreground/70 mt-4 hover:text-foreground transition-colors"
              >
                <span>{T.header.dashboard}</span>
              </a>
            )}
          </div>
        </nav>
      </div>
    </>
  );
}

export default Header;
