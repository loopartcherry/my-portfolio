"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Plus, FolderKanban, CheckCircle, Clock, Zap, Activity,
  CheckSquare, MessageSquare, Bell, CreditCard,
  HelpCircle, Headphones, Gift, MessageCircle,
  Users, ArrowRight, Star, Home, FileText, Settings,
  BookOpen, ChevronRight, ClipboardCheck, ShoppingBag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { mainNav, otherNav } from "@/lib/dashboard-nav";

// Mock data - simplified
const mockUser = {
  name: "张三",
  subscription: "Professional",
  quotaUsed: 1,
  quotaTotal: 2,
};

const mockStats = {
  inProgress: 3,
  pending: 2,
  completed: 15,
  avgRating: 4.8,
};

const mockProjects = [
  { id: "PRJ001", name: "企业品牌 Logo 设计", status: "反馈中", progress: 65, deadline: "明天" },
  { id: "PRJ002", name: "产品官网 UI 设计", status: "设计中", progress: 40, deadline: "3天后" },
  { id: "PRJ003", name: "数据大屏可视化", status: "待验收", progress: 100, deadline: "今天" },
];

const mockTodos = [
  { id: 1, content: "回复 #PRJ001 设计反馈", urgent: true, completed: false },
  { id: 2, content: "查看设计初稿", urgent: false, completed: true },
  { id: 3, content: "填写满意度调查", urgent: false, completed: false },
];

const mockActivities = [
  { id: 1, content: "设计师已上传 Logo 初稿", time: "2小时前" },
  { id: 2, content: "您对项目提交了反馈", time: "5小时前" },
  { id: 3, content: "项目 #PRJ003 已完成", time: "2天前" },
];

function getGreeting() {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12) return "早上好";
  if (hour >= 12 && hour < 18) return "下午好";
  return "晚上好";
}

export default function DashboardPage() {
  const [todos, setTodos] = useState(mockTodos);
  const [showSupport, setShowSupport] = useState(false);

  const toggleTodo = (id: number) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex" data-dashboard>
      {/* Left Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-60 bg-[#0d0d14] border-r border-white/5 flex-col z-40">
        {/* Logo */}
        <div className="p-6 border-b border-white/5">
          <Link href="/" className="flex items-center">
            <Image
              src="/loopart-logo.svg"
              alt="LoopArt Logo"
              width={120}
              height={21}
              className="h-5 w-auto"
            />
          </Link>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {mainNav.map((item) => {
            const Icon = item.icon;
            const isActive = item.href === "/dashboard/overview";
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
                  <span className={cn(
                    "px-2 py-0.5 text-[10px] font-medium rounded-full",
                    item.badgeColor === "primary" ? "bg-primary/20 text-primary" : "bg-orange-500/20 text-orange-400"
                  )}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}

          {/* Divider */}
          <div className="my-4 border-t border-white/5" />

          {/* Other Navigation */}
          {otherNav.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-white/40 hover:text-white/70 hover:bg-white/5 transition-all duration-200"
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom - Contact Support */}
        <div className="p-4 border-t border-white/5">
          <button
            onMouseEnter={() => setShowSupport(true)}
            onMouseLeave={() => setShowSupport(false)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-white/10 text-white/50 hover:text-white/80 hover:border-white/20 hover:bg-white/5 transition-all duration-200 text-sm"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{showSupport ? "在线客服 24/7" : "联系客服"}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 w-full md:ml-60">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 h-16 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-4 min-w-0 flex-1">
            <h1 className="text-base md:text-lg font-light text-white/90 truncate">{getGreeting()}，{mockUser.name}</h1>
            <span className="hidden sm:inline px-3 py-1 text-xs font-mono bg-primary/10 text-primary rounded-full border border-primary/20">
              {mockUser.subscription}
            </span>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/80 to-accent/80 flex items-center justify-center text-xs font-medium text-white">
              张
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-4 sm:p-6 md:p-8 w-full">
          {/* Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 md:mb-10">
            {/* In Progress */}
            <div className="p-4 sm:p-6 rounded-xl md:rounded-2xl bg-[#12121a] border border-white/5">
              <div className="flex items-center justify-between mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <FolderKanban className="w-5 h-5 text-primary" />
                </div>
              </div>
              <p className="text-white/40 text-xs mb-1">进行中</p>
              <p className="text-xl md:text-2xl font-light text-white">{mockStats.inProgress}</p>
            </div>

            {/* Pending */}
            <div className="p-4 sm:p-6 rounded-xl md:rounded-2xl bg-[#12121a] border border-white/5">
              <div className="flex items-center justify-between mb-6">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-orange-400" />
                </div>
                <span className="text-[10px] text-orange-400">需要反馈</span>
              </div>
              <p className="text-white/40 text-xs mb-1">待验收</p>
              <p className="text-2xl md:text-3xl font-light text-white">{mockStats.pending}</p>
            </div>

            {/* Completed */}
            <div className="p-4 sm:p-6 rounded-xl md:rounded-2xl bg-[#12121a] border border-white/5">
              <div className="flex items-center justify-between mb-6">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  <span className="text-[10px] text-white/40">{mockStats.avgRating}</span>
                </div>
              </div>
              <p className="text-white/40 text-xs mb-1">已完成</p>
              <p className="text-xl md:text-2xl font-light text-white">{mockStats.completed}</p>
            </div>

            {/* Quota */}
            <div className="p-4 sm:p-6 rounded-xl md:rounded-2xl bg-[#12121a] border border-white/5">
              <div className="flex items-center justify-between mb-6">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-accent" />
                </div>
              </div>
              <p className="text-white/40 text-xs mb-1">剩余配额</p>
              <div className="flex items-baseline gap-2">
                <p className="text-xl md:text-2xl font-light text-white">{mockUser.quotaTotal - mockUser.quotaUsed}</p>
                <span className="text-xs text-white/30">/ {mockUser.quotaTotal}</span>
              </div>
              <Progress value={(mockUser.quotaUsed / mockUser.quotaTotal) * 100} className="mt-4 h-1 bg-white/5" />
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 w-full">
            {/* Left - Projects */}
            <div className="lg:col-span-2 xl:col-span-3 space-y-8">
              {/* Projects */}
              <div className="rounded-xl md:rounded-2xl bg-[#12121a] border border-white/5 overflow-hidden">
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/5">
                  <h2 className="text-sm font-medium text-white/80">我的项目</h2>
                  <Link href="/dashboard/projects" className="text-xs text-white/40 hover:text-primary flex items-center gap-1 transition-colors">
                    查看全部 <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
                <div className="divide-y divide-white/5">
                  {mockProjects.map((project) => (
                    <div
                      key={project.id}
                      className="p-5 hover:bg-white/[0.02] transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-sm text-white/70">
                          {project.name[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-lg text-white/90 truncate">{project.name}</h3>
                            <span className="px-2 py-0.5 text-[10px] bg-white/5 text-white/50 rounded">
                              {project.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-4">
                            <Progress value={project.progress} className="flex-1 h-1 bg-white/5" />
                            <span className="text-[10px] text-white/30 shrink-0">{project.progress}%</span>
                          </div>
                        </div>
                        <span className="text-[10px] text-white/30">{project.deadline}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-white/5">
                  <Link href="/dashboard/projects/new">
                    <Button className="w-full gap-2 bg-primary/10 hover:bg-primary/20 text-primary border-0">
                      <Plus className="w-4 h-4" />
                      新建项目
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Activity */}
              <div className="rounded-xl md:rounded-2xl bg-[#12121a] border border-white/5 overflow-hidden">
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/5">
                  <h2 className="text-sm font-medium text-white/80 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-white/40" />
                    最近活动
                  </h2>
                </div>
                <div className="p-6 space-y-4">
                  {mockActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/50 mt-2 shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm text-white/70">{activity.content}</p>
                        <p className="text-[10px] text-white/30 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right - Todos & Quick Actions */}
            <div className="space-y-8 flex flex-wrap w-full">
              {/* Todos */}
              <div className="rounded-xl md:rounded-2xl bg-[#12121a] border border-white/5 overflow-hidden w-full">
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/5 w-full">
                  <h2 className="text-sm font-medium text-white/80 flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-white/40" />
                    今日待办
                  </h2>
                  <span className="text-[10px] text-white/30">
                    {todos.filter(t => t.completed).length}/{todos.length}
                  </span>
                </div>
                <div className="p-4 space-y-2 w-full">
                  {todos.map((todo) => (
                    <div
                      key={todo.id}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg transition-colors",
                        todo.completed ? "opacity-50" : "hover:bg-white/[0.02]"
                      )}
                    >
                      <Checkbox
                        checked={todo.completed}
                        onCheckedChange={() => toggleTodo(todo.id)}
                        className="border-white/20"
                      />
                      <span className={cn(
                        "text-sm flex-1",
                        todo.completed ? "line-through text-white/30" : "text-white/70"
                      )}>
                        {todo.content}
                      </span>
                      {todo.urgent && !todo.completed && (
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="rounded-xl md:rounded-2xl bg-[#12121a] border border-white/5 overflow-hidden w-full">
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/5 w-full">
                  <h2 className="text-sm font-medium text-white/80">快捷操作</h2>
                </div>
                <div className="p-4 space-y-2 w-full">
                  <Link href="/diagnosis" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/[0.02] transition-colors text-white/60 hover:text-white/80 w-full">
                    <ClipboardCheck className="w-4 h-4" />
                    <span className="text-sm">进行 VCMA 诊断</span>
                    <ArrowRight className="w-3 h-3 ml-auto" />
                  </Link>
                  <Link href="/pricing" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/[0.02] transition-colors text-white/60 hover:text-white/80 w-full">
                    <CreditCard className="w-4 h-4" />
                    <span className="text-sm">查看订阅方案</span>
                    <ArrowRight className="w-3 h-3 ml-auto" />
                  </Link>
                  <Link href="/shop" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/[0.02] transition-colors text-white/60 hover:text-white/80 w-full">
                    <ShoppingBag className="w-4 h-4" />
                    <span className="text-sm">浏览模版商城</span>
                    <ArrowRight className="w-3 h-3 ml-auto" />
                  </Link>
                </div>
              </div>

              {/* Subscription Status */}
              <div className="rounded-xl md:rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10 p-4 sm:p-6 w-full">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="w-4 h-4 text-primary" />
                  <h2 className="text-sm font-medium text-white/80">订阅状态</h2>
                </div>
                <p className="text-xl md:text-2xl font-light text-white mb-1">Professional</p>
                <p className="text-xs text-white/40 mb-4">剩余 30 天到期</p>
                <Button variant="outline" size="sm" className="w-full border-primary/30 text-primary bg-transparent hover:bg-primary/10">
                  管理订阅
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

