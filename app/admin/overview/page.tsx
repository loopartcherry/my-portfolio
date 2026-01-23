"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  ShoppingBag,
  CreditCard,
  Activity,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  UserPlus,
  FileText,
  BarChart3,
  Shield,
  Search,
  Bell,
  HelpCircle,
  LogOut,
  Settings,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  adminMainNav,
  adminSystemNav,
  adminSettingsNav,
} from "@/lib/admin-nav";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

const mockRecentUsers = [
  {
    id: 1,
    name: "张三",
    email: "zhangsan@example.com",
    role: "customer",
    subscription: "Professional",
    createdAt: "2小时前",
    avatar: undefined,
  },
  {
    id: 2,
    name: "李设计师",
    email: "lidesigner@example.com",
    role: "designer",
    employeeId: "#DS-002",
    createdAt: "5小时前",
    avatar: undefined,
  },
];

const mockRecentProjects = [
  {
    id: "PRJ-001",
    name: "某 AI 公司品牌升级",
    client: "某 AI 科技有限公司",
    status: "进行中",
    progress: 65,
    deadline: "2024-02-15",
  },
  {
    id: "PRJ-002",
    name: "某 SaaS 产品 UI 设计",
    status: "设计中",
    progress: 45,
    deadline: "2024-02-28",
  },
];

const mockSystemMetrics = [
  { label: "服务器状态", value: "正常", status: "success", icon: CheckCircle },
  { label: "数据库", value: "正常", status: "success", icon: CheckCircle },
  { label: "存储空间", value: "78%", status: "warning", icon: AlertCircle },
  { label: "API 响应", value: "120ms", status: "success", icon: Activity },
];

const mockStats = {
  totalUsers: 1250,
  activeUsers: 890,
  totalProjects: 342,
  activeProjects: 156,
  pendingOrders: 12,
  revenueGrowth: 15.8,
  monthlyRevenue: 1250000,
  systemHealth: 95,
};

export default function AdminDashboardPage() {
  const [showSupport, setShowSupport] = useState(false);
  
  // 获取最近用户数据
  const { data: recentUsersData } = useQuery({
    queryKey: ["recent-users"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/admin/users?limit=5&sort=createdAt:desc", {
          credentials: "include",
        });
        if (!res.ok) return { data: mockRecentUsers };
        return res.json();
      } catch (error) {
        console.error("Failed to fetch recent users:", error);
        return { data: mockRecentUsers };
      }
    },
    retry: false,
  });

  // 获取最近项目数据
  const { data: recentProjectsData } = useQuery({
    queryKey: ["recent-projects"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/admin/projects?limit=5", {
          credentials: "include",
        });
        if (!res.ok) return { data: mockRecentProjects };
        return res.json();
      } catch (error) {
        console.error("Failed to fetch recent projects:", error);
        return { data: mockRecentProjects };
      }
    },
    retry: false,
  });

  const statsLoading = false; // 如果使用 API，这里应该是统计数据加载状态
  const stats = {
    totalUsers: mockStats.totalUsers,
    activeUsers: mockStats.activeUsers,
    todayOrderAmount: 12500.50,
    newUsersToday: 12,
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex" data-dashboard>
      {/* Left Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-60 bg-[#0d0d14] border-r border-white/5 flex-col z-40">
        <div className="p-6 border-b border-white/5">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/loopart-logo.svg"
              alt="LoopArt Logo"
              width={120}
              height={21}
              className="h-5 w-auto"
            />
            <span className="text-white/40 text-sm">管理后台</span>
          </Link>
          <div className="mt-2 flex items-center gap-2">
            <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">
              Admin
            </Badge>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
              生产环境
            </Badge>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <nav className="p-4 space-y-1">
            <div className="text-xs text-white/40 mb-2 px-4">主要功能</div>
            {adminMainNav.map((item) => {
              const Icon = item.icon;
              const isActive = item.href === "/admin/overview";
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-200",
                    isActive
                      ? "bg-primary/10 text-primary border-l-2 border-primary"
                      : "text-white/50 hover:text-white/80 hover:bg-white/5"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span
                      className={cn(
                        "px-2 py-0.5 text-[10px] font-medium rounded-full",
                        item.badgeColor === "primary"
                          ? "bg-primary/20 text-primary"
                          : item.badgeColor === "orange"
                          ? "bg-orange-500/20 text-orange-400"
                          : item.badgeColor === "red"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-green-500/20 text-green-400"
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            {adminSystemNav.length > 0 && (
              <>
                <div className="my-4 border-t border-white/5" />
                <div className="text-xs text-white/40 mb-2 px-4">系统管理</div>
                {adminSystemNav.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-white/50 hover:text-white/80 hover:bg-white/5 transition-all duration-200"
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </>
            )}

            <div className="my-4 border-t border-white/5" />

            <div className="text-xs text-white/40 mb-2 px-4">系统设置</div>
            {adminSettingsNav.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-white/50 hover:text-white/80 hover:bg-white/5 transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 w-full md:ml-60">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 h-16 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-6 flex-1">
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <Input
                placeholder="搜索用户、项目、订单、诊断..."
                className="pl-9 bg-[#12121a] border-white/5 text-white placeholder:text-white/30"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/30">
                ⌘ K
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* System Status */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative">
                  <Activity className="w-5 h-5 text-green-400" />
                  <div className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 bg-[#12121a] border-white/10">
                <div className="p-2 font-semibold text-sm text-white">系统状态监控</div>
                <div className="space-y-2 p-2">
                  {mockSystemMetrics.map((metric, idx) => {
                    const Icon = metric.icon;
                    return (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 rounded hover:bg-white/5"
                      >
                        <div className="flex items-center gap-2">
                          <Icon
                            className={cn(
                              "w-4 h-4",
                              metric.status === "success"
                                ? "text-green-400"
                                : "text-orange-400"
                            )}
                          />
                          <span className="text-sm text-white/80">{metric.label}</span>
                        </div>
                        <span
                          className={cn(
                            "text-sm",
                            metric.status === "success"
                              ? "text-green-400"
                              : "text-orange-400"
                          )}
                        >
                          {metric.value}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="w-5 h-5 text-white/40" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 bg-[#12121a] border-white/10">
                <div className="p-2 font-semibold text-sm text-white">系统通知</div>
                <div className="space-y-1">
                  <div className="p-3 hover:bg-white/5 cursor-pointer">
                    <div className="text-sm text-white">新用户注册：张三</div>
                    <div className="text-xs text-white/40 mt-1">5分钟前</div>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Help */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <HelpCircle className="w-5 h-5 text-white/40" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-[#12121a] border-white/10">
                <DropdownMenuItem className="text-white hover:bg-white/10">
                  使用指南
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:bg-white/10">
                  系统文档
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem className="text-white hover:bg-white/10">
                  技术支持
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-2 cursor-pointer">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-red-500/20 text-red-400 text-xs">
                      管
                    </AvatarFallback>
                  </Avatar>
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-[#12121a] border-white/10">
                <div className="p-2">
                  <div className="font-medium text-sm text-white">超级管理员</div>
                  <div className="text-xs text-white/40">admin@vcma.com</div>
                </div>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem className="text-white hover:bg-white/10">
                  <Settings className="w-4 h-4 mr-2" />
                  系统设置
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:bg-white/10">
                  <Shield className="w-4 h-4 mr-2" />
                  权限管理
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem className="text-red-400 hover:bg-red-500/10">
                  <LogOut className="w-4 h-4 mr-2" />
                  退出登录
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Content */}
        <div className="p-6 max-w-[1400px] mx-auto">
          {/* Page Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-white">控制台概览</h1>
                <LayoutDashboard className="w-6 h-6 text-white/40" />
              </div>
              <div className="text-sm text-white/40">
                {new Date().toLocaleDateString("zh-CN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  weekday: "long",
                })}
              </div>
            </div>
            <p className="text-sm text-white/60">系统整体运行状态和数据概览</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Total Users */}
            <Card className="p-6 bg-[#12121a] border-white/5">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div className="flex items-center gap-1 text-green-400">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-xs">+12.5%</span>
                </div>
              </div>
              <p className="text-white/40 text-xs mb-1">总用户数</p>
              {statsLoading ? (
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              ) : (
                <>
                  <p className="text-2xl font-light text-white">{stats.totalUsers}</p>
                  <p className="text-xs text-white/40 mt-2">
                    活跃用户：{stats.activeUsers}
                  </p>
                </>
              )}
            </Card>

            {/* Total Projects */}
            <Card className="p-6 bg-[#12121a] border-white/5">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-blue-400" />
                </div>
                <div className="flex items-center gap-1 text-green-400">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-xs">+8.2%</span>
                </div>
              </div>
              <p className="text-white/40 text-xs mb-1">总项目数</p>
              <p className="text-2xl font-light text-white">{mockStats.totalProjects}</p>
              <p className="text-xs text-white/40 mt-2">
                进行中：{mockStats.activeProjects}
              </p>
            </Card>

            {/* Total Orders */}
            <Card className="p-6 bg-[#12121a] border-white/5">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-orange-400" />
                </div>
                <div className="flex items-center gap-1 text-orange-400">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-xs">{mockStats.pendingOrders}</span>
                </div>
              </div>
              <p className="text-white/40 text-xs mb-1">今日订单总额</p>
              {statsLoading ? (
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              ) : (
                <>
                  <p className="text-2xl font-light text-white">
                    ¥{stats.todayOrderAmount.toFixed(2)}
                  </p>
                  <p className="text-xs text-white/40 mt-2">
                    新增用户：{stats.newUsersToday} 人
                  </p>
                </>
              )}
            </Card>

            {/* Monthly Revenue */}
            <Card className="p-6 bg-[#12121a] border-white/5">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-green-400" />
                </div>
                <div className="flex items-center gap-1 text-green-400">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-xs">+{mockStats.revenueGrowth}%</span>
                </div>
              </div>
              <p className="text-white/40 text-xs mb-1">本月营收</p>
              <p className="text-2xl font-light text-white">
                ¥{(mockStats.monthlyRevenue / 10000).toFixed(1)}万
              </p>
              <p className="text-xs text-white/40 mt-2">较上月增长</p>
            </Card>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Recent Users */}
              <Card className="p-6 bg-[#12121a] border-white/5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg font-semibold text-white">最近注册用户</h2>
                    <Users className="w-5 h-5 text-white/40" />
                  </div>
                  <Link href="/admin/users">
                    <Button variant="ghost" size="sm" className="text-white/60 hover:text-white">
                      查看全部
                    </Button>
                  </Link>
                </div>

                <div className="space-y-3">
                  {recentUsersData?.data && recentUsersData.data.length > 0 ? (
                    recentUsersData.data.map((user: any) => (
                      <div
                        key={user.id}
                        className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                      >
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-primary/20 text-primary">
                            {user.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-white text-sm">{user.name}</span>
                            <Badge
                              className={cn(
                                "text-xs",
                                user.role === "customer"
                                  ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                                  : "bg-primary/20 text-primary border-primary/30"
                              )}
                            >
                              {user.role === "customer" ? "客户" : "设计师"}
                            </Badge>
                            {user.subscription && (
                              <Badge variant="outline" className="text-xs text-white/60">
                                {user.subscription}
                              </Badge>
                            )}
                          </div>
                          <div className="text-xs text-white/40">{user.email}</div>
                          {user.employeeId && (
                            <div className="text-xs text-white/40">工号：{user.employeeId}</div>
                          )}
                        </div>
                        <div className="text-xs text-white/40">{user.createdAt}</div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-white/40 text-center py-4">暂无最近注册用户</p>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-white/5">
                  <Link href="/admin/users">
                    <Button variant="outline" size="sm" className="w-full text-white/60 border-white/10 hover:bg-white/10">
                      <UserPlus className="w-4 h-4 mr-2" />
                      创建新用户
                    </Button>
                  </Link>
                </div>
              </Card>

              {/* Recent Projects */}
              <Card className="p-6 bg-[#12121a] border-white/5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg font-semibold text-white">最近项目</h2>
                    <Briefcase className="w-5 h-5 text-white/40" />
                  </div>
                  <Link href="/admin/projects">
                    <Button variant="ghost" size="sm" className="text-white/60 hover:text-white">
                      查看全部
                    </Button>
                  </Link>
                </div>

                <div className="space-y-3">
                  {recentProjectsData?.data && recentProjectsData.data.length > 0 ? (
                    recentProjectsData.data.map((project: any) => (
                      <Link
                        key={project.id}
                        href={`/admin/projects/${project.id}`}
                        className="p-4 rounded-lg border border-white/5 hover:border-white/10 transition-colors cursor-pointer block"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-white">{project.name}</span>
                            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                              {project.status}
                            </Badge>
                          </div>
                          <span className="text-xs text-white/40">#{project.id.slice(0, 8)}</span>
                        </div>
                        <div className="text-xs text-white/60 mb-2">{project.user?.name || "未知客户"}</div>
                        <Progress value={project.completionRate || 0} className="mb-2 h-1" />
                        <div className="flex items-center justify-between text-xs text-white/40">
                          <span>{project.completionRate || 0}% 完成</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {project.assignedToUser?.name || "未分配"}
                          </span>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <p className="text-sm text-white/40 text-center py-4">暂无最近项目</p>
                  )}
                </div>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* System Health */}
              <Card className="p-6 bg-[#12121a] border-white/5">
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-lg font-semibold text-white">系统健康</h2>
                  <Activity className="w-5 h-5 text-green-400" />
                </div>

                <div className="space-y-3">
                  {mockSystemMetrics.map((metric, idx) => {
                    const Icon = metric.icon;
                    return (
                      <div key={idx} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon
                            className={cn(
                              "w-4 h-4",
                              metric.status === "success"
                                ? "text-green-400"
                                : "text-orange-400"
                            )}
                          />
                          <span className="text-sm text-white/80">{metric.label}</span>
                        </div>
                        <span
                          className={cn(
                            "text-sm font-medium",
                            metric.status === "success"
                              ? "text-green-400"
                              : "text-orange-400"
                          )}
                        >
                          {metric.value}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 pt-4 border-t border-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-white/60">整体健康度</span>
                    <span className="text-lg font-semibold text-green-400">
                      {mockStats.systemHealth}%
                    </span>
                  </div>
                  <Progress value={mockStats.systemHealth} className="h-2" />
                </div>
              </Card>

              {/* Quick Actions */}
              <Card className="p-6 bg-[#12121a] border-white/5">
                <h2 className="text-lg font-semibold text-white mb-4">快捷操作</h2>
                <div className="space-y-2">
                  <Link href="/admin/users/new">
                    <Button
                      variant="outline"
                      className="w-full justify-start text-white/60 border-white/10 hover:bg-white/10"
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      创建用户
                    </Button>
                  </Link>
                  <Link href="/admin/projects/new">
                    <Button
                      variant="outline"
                      className="w-full justify-start text-white/60 border-white/10 hover:bg-white/10"
                    >
                      <Briefcase className="w-4 h-4 mr-2" />
                      创建项目
                    </Button>
                  </Link>
                  <Link href="/admin/settings">
                    <Button
                      variant="outline"
                      className="w-full justify-start text-white/60 border-white/10 hover:bg-white/10"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      系统设置
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
