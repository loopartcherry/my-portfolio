"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/sections/header";

const NO_HEADER_PREFIXES = ["/dashboard", "/admin", "/designer", "/login", "/register"];

function isPublicRoute(pathname: string | null): boolean {
  if (!pathname) return true;
  return !NO_HEADER_PREFIXES.some((p) => pathname.startsWith(p));
}

export function PublicHeaderLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showHeader = isPublicRoute(pathname);

  if (!showHeader) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <div className="pt-20">{children}</div>
    </>
  );
}
