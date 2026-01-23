"use client";

import Link from "next/link";
import { Bell, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  unreadCount?: number;
}

const mockUser = {
  name: "张三",
  email: "zhangsan@example.com",
  avatar: undefined,
};

export function DashboardHeader({ title, subtitle, actions, unreadCount = 0 }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-30 h-16 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-4 md:px-8">
      {/* Left: Title */}
      <div className="flex items-center gap-4 min-w-0 flex-1">
        <h1 className="text-base md:text-lg font-light text-white/90 truncate">{title}</h1>
        {subtitle && (
          <span className="hidden sm:inline text-xs text-white/40 truncate">{subtitle}</span>
        )}
        {actions && <div className="hidden md:flex items-center gap-2">{actions}</div>}
      </div>

      {/* Right: Notifications & User */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {/* Notifications */}
        <Link href="/dashboard/notifications" className="relative p-2 text-white/40 hover:text-white/80 transition-colors">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full animate-pulse" />
          )}
        </Link>

        {/* User Avatar */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-gradient-to-br from-primary/80 to-accent/80 text-white text-xs font-medium">
                  {mockUser.name[0]}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-[#12121a] border-white/10 w-56">
            <div className="px-3 py-2 border-b border-white/5">
              <div className="text-sm font-medium text-white">{mockUser.name}</div>
              <div className="text-xs text-white/60 truncate">{mockUser.email}</div>
            </div>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings" className="text-white hover:bg-white/10 cursor-pointer">
                <User className="w-4 h-4 mr-2" />
                账户设置
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem className="text-red-400 hover:bg-red-500/10 cursor-pointer">
              退出登录
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
