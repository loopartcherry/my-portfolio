"use client";

import { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Briefcase,
  CheckSquare,
  FolderOpen,
  MessageSquare,
  MessageCircle,
  Users,
  Clock,
  BarChart3,
  User,
  Settings,
  Upload,
  Play,
  Plus,
  Bell,
  HelpCircle,
  Search,
  LogOut,
  AlertCircle,
  Activity,
  CheckCircle,
  Calendar,
  TrendingUp,
  Palette,
  MoreHorizontal,
  FileText,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
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
  designerMainNav,
  designerCollaborationNav,
  designerDataNav,
  designerSettingsNav,
} from "@/lib/designer-nav";

// Mock data
const mockDesigner = {
  name: "张设计师",
  role: "资深 UI 设计师",
  employeeId: "#DS-001",
  avatar: undefined,
  todayHours: 6.5,
  weeklyHours: 32.5,
  weeklyTarget: 40,
  inProgressProjects: 5,
  pendingTasks: 12,
};

const mockTodayTasks = [
  {
    id: 1,
    priority: "紧急",
    title: "XX 项目 Logo 第三版修改",
    project: "某 AI 公司品牌升级",
    deadline: "今天 18:00",
    status: "等待客户反馈",
    progress: 0,
  },
  {
    id: 2,
    priority: "高",
    title: "XX 项目技术白皮书封面设计",
    deadline: "明天 17:00",
    status: "进行中",
    progress: 30,
  },
  {
    id: 3,
    priority: "中",
    title: "XX 项目 PPT 模板第一版",
    deadline: "今天 11:30",
    status: "已完成",
    progress: 100,
    completedAt: "今天 11:30",
  },
];

const mockProjects = [
  {
    id: "PRJ-001",
    name: "某 AI 公司品牌升级",
    client: "某 AI 科技有限公司",
    status: "进行中",
    priority: "紧急",
    progress: 65,
    currentStage: "第二轮修改",
    tasksCompleted: "8/12 任务完成",
    filesCount: 24,
    deadline: "2024-02-15",
    daysRemaining: 31,
    teamMembers: ["张", "李", "王"],
    moreMembers: 2,
    coverImage: undefined,
  },
  {
    id: "PRJ-002",
    name: "某 SaaS 产品 UI 设计",
    status: "设计中",
    progress: 45,
    deadline: "2024-02-28",
  },
  {
    id: "PRJ-003",
    name: "某大数据公司技术白皮书",
    status: "待验收",
    progress: 80,
    deadline: "2024-01-20",
  },
];

const mockWeeklyHours = [
  { day: "周一", hours: 8, target: 8, status: "达标" },
  { day: "周二", hours: 7.5, target: 8, status: "达标" },
  { day: "周三", hours: 8, target: 8, status: "达标" },
  { day: "周四", hours: 6, target: 8, status: "低于目标" },
  { day: "周五", hours: 3, target: 8, status: "当前" },
  { day: "周六", hours: 0, target: 0, status: "计划" },
  { day: "周日", hours: 0, target: 0, status: "计划" },
];

const mockPendingFeedback = [
  {
    id: 1,
    client: { name: "张总", role: "CEO", avatar: undefined },
    project: "某 AI 公司品牌升级",
    content: "Logo 的颜色需要调整，建议使用更深的蓝色...",
    time: "2小时前",
    attachments: 3,
    priority: "紧急",
  },
  {
    id: 2,
    project: "某 SaaS 产品 UI 设计",
    content: "整体方向不错，但需要优化导航栏...",
    time: "5小时前",
  },
];

const mockRecentFiles = [
  {
    id: 1,
    name: "logo_v3_final.fig",
    size: "2.3 MB",
    project: "某 AI 公司",
    status: "已审核",
    uploadedAt: "2小时前",
    type: "fig",
  },
];

function getGreeting() {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12) return "早上好";
  if (hour >= 12 && hour < 18) return "下午好";
  return "晚上好";
}

export default function DesignerDashboardPage() {
  const [showSupport, setShowSupport] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex" data-dashboard>
      {/* Left Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-60 bg-[#0d0d14] border-r border-white/5 flex-col z-40">
        {/* Logo */}
        <div className="p-6 border-b border-white/5">
          <Link href="/" className="text-lg font-light tracking-wider">
            <span className="text-primary">VCMA</span>
            <span className="text-white/40"> 设计师工作台</span>
          </Link>
          <div className="mt-2">
            <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
              Designer
            </Badge>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            <div className="text-xs text-white/40 mb-2 px-4">工作台</div>
            {designerMainNav.map((item) => {
              const Icon = item.icon;
              const isActive = item.href === "/designer/overview";
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
                          : "bg-red-500/20 text-red-400"
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            {designerCollaborationNav.length > 0 && (
              <>
                <div className="my-4 border-t border-white/5" />
                <div className="text-xs text-white/40 mb-2 px-4">协作沟通</div>
                {designerCollaborationNav.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-white/40 hover:text-white/70 hover:bg-white/5 transition-all duration-200"
                    >
                      <Icon className="w-4 h-4" />
                      <span className="flex-1">{item.label}</span>
                      {item.badge && (
                        <span className={cn(
                          "px-2 py-0.5 text-[10px] font-medium rounded-full",
                          item.badgeColor === "red"
                            ? "bg-red-500/20 text-red-400"
                            : "bg-orange-500/20 text-orange-400"
                        )}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </>
            )}

            {designerDataNav.length > 0 && (
              <>
                <div className="my-4 border-t border-white/5" />
                <div className="text-xs text-white/40 mb-2 px-4">数据统计</div>
                {designerDataNav.map((item) => {
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
              </>
            )}

            <div className="my-4 border-t border-white/5" />

            <div className="text-xs text-white/40 mb-2 px-4">个人设置</div>
            {designerSettingsNav.map((item) => {
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
            <h1 className="text-base md:text-lg font-light text-white/90 truncate">{getGreeting()}，{mockDesigner.name}</h1>
            <span className="hidden sm:inline text-xs text-white/40 truncate">
              进行中项目: {mockDesigner.inProgressProjects} · 待办任务: {mockDesigner.pendingTasks} · 今日工时: {mockDesigner.todayHours}h
            </span>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/80 to-accent/80 flex items-center justify-center text-xs font-medium text-white">
              {mockDesigner.name[0]}
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-4 sm:p-6 md:p-8 w-full">

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 md:mb-10">
            <div className="p-4 sm:p-6 rounded-xl md:rounded-2xl bg-[#12121a] border border-white/5 hover:border-white/10 transition-all cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Upload className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium text-white/90 text-sm">上传设计文件</div>
                  <div className="text-xs text-white/50">拖拽或点击上传</div>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6 rounded-xl md:rounded-2xl bg-[#12121a] border border-white/5 hover:border-white/10 transition-all cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <Play className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <div className="font-medium text-white/90 text-sm">开始计时</div>
                  <div className="text-xs text-white/50">记录工作时间</div>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6 rounded-xl md:rounded-2xl bg-[#12121a] border border-white/5 hover:border-white/10 transition-all cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Plus className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <div className="font-medium text-white/90 text-sm">创建任务</div>
                  <div className="text-xs text-white/50">添加待办事项</div>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6 rounded-xl md:rounded-2xl bg-[#12121a] border border-white/5 hover:border-white/10 transition-all cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <div className="font-medium text-white/90 text-sm">未读消息</div>
                  <div className="text-xs text-white/50">
                    <span className="text-primary font-medium">3 条</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Today's Tasks */}
          <div className="rounded-xl md:rounded-2xl bg-[#12121a] border border-white/5 overflow-hidden mb-8">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/5">
              <div className="flex items-center gap-3">
                <h2 className="text-sm font-medium text-white/80">今日待办</h2>
                <Badge className="bg-orange-500/10 text-orange-400 border-orange-500/20 text-xs">
                  5 项紧急任务
                </Badge>
              </div>
              <Link
                href="/designer/tasks"
                className="text-xs text-white/40 hover:text-primary flex items-center gap-1 transition-colors"
              >
                查看全部 <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="divide-y divide-white/5">
              {mockTodayTasks.map((task) => (
                <div
                  key={task.id}
                  className={cn(
                    "p-5 hover:bg-white/[0.02] transition-colors",
                    task.status === "已完成" && "opacity-60"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <Checkbox
                        checked={task.status === "已完成"}
                        className="border-white/20"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge
                            className={cn(
                              "text-[10px] border",
                              task.priority === "紧急"
                                ? "bg-red-500/10 text-red-400 border-red-500/20"
                                : task.priority === "高"
                                ? "bg-orange-500/10 text-orange-400 border-orange-500/20"
                                : "bg-white/5 text-white/50 border-white/10"
                            )}
                          >
                            {task.priority}
                          </Badge>
                          <span
                            className={cn(
                              "font-medium text-white/90",
                              task.status === "已完成" && "line-through text-white/40"
                            )}
                          >
                            {task.title}
                          </span>
                          {task.status === "已完成" && (
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          )}
                        </div>
                        <div className="text-xs text-white/50 mb-2">
                          {task.project && (
                            <Badge className="mr-2 text-[10px] bg-white/5 text-white/50 border-white/10">
                              {task.project}
                            </Badge>
                          )}
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {task.deadline}
                          </span>
                        </div>
                        {task.status !== "已完成" && (
                          <div className="text-xs text-white/40">{task.status}</div>
                        )}
                        {task.progress > 0 && task.progress < 100 && (
                          <Progress value={task.progress} className="mt-2 h-1 bg-white/5" />
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      {task.status !== "已完成" && (
                        <Button variant="ghost" size="sm" className="text-xs text-white/60 hover:text-white/80">
                          开始工作
                        </Button>
                      )}
                      <Link
                        href={`/designer/projects/${task.id}`}
                        className="text-xs text-primary hover:underline"
                      >
                        查看详情
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-white/5 flex items-center justify-between">
              <Link href="/designer/tasks">
                <Button variant="outline" size="sm" className="text-xs bg-transparent border-white/10 text-white/60 hover:text-white">
                  查看更多任务
                </Button>
              </Link>
              <div className="text-xs text-white/50 flex items-center gap-2">
                今日完成度：3/8
                <Progress value={37.5} className="h-1 w-24 bg-white/5" />
              </div>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 w-full">
            {/* Left Column - Projects */}
            <div className="lg:col-span-2 xl:col-span-3 space-y-8">
              {/* In Progress Projects */}
              <div className="rounded-xl md:rounded-2xl bg-[#12121a] border border-white/5 overflow-hidden">
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <h2 className="text-sm font-medium text-white/80">进行中项目</h2>
                    <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
                      {mockProjects.length} 个项目
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={cn(
                        "px-3 py-1.5 text-xs rounded-md transition-all",
                        viewMode === "grid" ? "bg-primary/20 text-primary" : "text-white/50 hover:text-white/80"
                      )}
                    >
                      Grid
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={cn(
                        "px-3 py-1.5 text-xs rounded-md transition-all",
                        viewMode === "list" ? "bg-primary/20 text-primary" : "text-white/50 hover:text-white/80"
                      )}
                    >
                      List
                    </button>
                  </div>
                </div>

                {viewMode === "grid" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 p-4 sm:p-6">
                    {mockProjects.map((project) => (
                      <div
                        key={project.id}
                        className="group rounded-xl md:rounded-2xl bg-[#0a0a0f] border border-white/5 hover:border-white/10 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                      >
                        <div className="p-4 sm:p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <Badge className={cn(
                                "text-[10px] border",
                                project.status === "进行中" 
                                  ? "bg-primary/10 text-primary border-primary/20"
                                  : project.status === "设计中"
                                  ? "bg-orange-500/10 text-orange-400 border-orange-500/20"
                                  : "bg-green-500/10 text-green-400 border-green-500/20"
                              )}>
                                {project.status}
                              </Badge>
                              {project.priority && (
                                <Badge className="bg-red-500/10 text-red-400 border-red-500/20 text-[10px]">
                                  {project.priority}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <h3 className="font-medium text-white/90 mb-1">{project.name}</h3>
                          {project.client && (
                            <div className="text-xs text-white/50 mb-3">{project.client}</div>
                          )}
                          <div className="text-[10px] text-white/30 font-mono mb-2">#{project.id}</div>
                          <Progress value={project.progress} className="mb-2 h-1.5 bg-white/5" />
                          <div className="flex items-center justify-between text-xs text-white/50">
                            <span>{project.progress}% 完成</span>
                            {project.deadline && (
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {project.deadline}
                              </span>
                            )}
                          </div>
                          {project.currentStage && (
                            <div className="mt-2 text-xs text-white/40">
                              {project.currentStage}
                            </div>
                          )}
                          {project.tasksCompleted && (
                            <div className="mt-1 text-xs text-white/40">
                              {project.tasksCompleted}
                            </div>
                          )}
                          <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Button size="sm" className="text-xs bg-primary hover:bg-primary/90">
                                继续工作
                              </Button>
                              <Button variant="outline" size="sm" className="text-xs bg-transparent border-white/10 text-white/60 hover:text-white">
                                <Upload className="w-3 h-3 mr-1" />
                                上传
                              </Button>
                            </div>
                            <Link
                              href={`/designer/projects/${project.id}`}
                              className="text-xs text-primary hover:underline"
                            >
                              查看详情
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="divide-y divide-white/5">
                    {mockProjects.map((project) => (
                      <div
                        key={project.id}
                        className="p-5 hover:bg-white/[0.02] transition-colors cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-white/90">{project.name}</span>
                              <Badge className="text-[10px] bg-white/5 text-white/50 border-white/10">
                                {project.status}
                              </Badge>
                            </div>
                            <div className="text-xs text-white/50">
                              {project.client || `#${project.id}`}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-white/80">{project.progress}%</div>
                            <div className="text-xs text-white/50">{project.deadline}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="p-4 border-t border-white/5">
                  <Link href="/designer/projects">
                    <Button variant="outline" size="sm" className="w-full text-xs bg-transparent border-white/10 text-white/60 hover:text-white">
                      查看全部项目
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Weekly Hours */}
              <div className="rounded-xl md:rounded-2xl bg-[#12121a] border border-white/5 overflow-hidden">
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <h2 className="text-sm font-medium text-white/80">本周工时统计</h2>
                    <Clock className="w-4 h-4 text-white/40" />
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-light text-white">
                      {mockDesigner.weeklyHours}h / {mockDesigner.weeklyTarget}h
                    </div>
                    <div className="text-xs text-white/50">完成度 81%</div>
                  </div>
                </div>

                <div className="p-4 sm:p-6 space-y-3">
                  {mockWeeklyHours.map((day, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="w-16 text-xs text-white/60">{day.day}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <div className="text-sm font-medium text-white/80">{day.hours}h</div>
                          <div className="text-xs text-white/50">{day.target}h 目标</div>
                        </div>
                        <Progress
                          value={(day.hours / (day.target || 1)) * 100}
                          className={cn(
                            "h-1.5 bg-white/5",
                            day.status === "达标" && "bg-green-500",
                            day.status === "低于目标" && "bg-orange-500",
                            day.status === "当前" && "bg-primary",
                            day.status === "计划" && "bg-white/10"
                          )}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 sm:p-6 pt-4 border-t border-white/5 grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm font-medium text-white/90">26.5h</div>
                    <div className="text-xs text-white/50">占比 81%</div>
                    <Palette className="w-4 h-4 text-primary mt-1" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white/90">4h</div>
                    <div className="text-xs text-white/50">占比 12%</div>
                    <MessageSquare className="w-4 h-4 text-green-400 mt-1" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white/90">2h</div>
                    <div className="text-xs text-white/50">占比 7%</div>
                    <MoreHorizontal className="w-4 h-4 text-white/40 mt-1" />
                  </div>
                </div>

                <div className="p-4 sm:p-6 pt-4 border-t border-white/5 flex items-center justify-between">
                  <Link
                    href="/designer/tasks"
                    className="text-xs text-primary hover:underline"
                  >
                    查看任务
                  </Link>
                  <Button variant="outline" size="sm" className="text-xs bg-transparent border-white/10 text-white/60 hover:text-white">
                    <Clock className="w-3 h-3 mr-1" />
                    快速记录
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Pending Feedback */}
              <div className="rounded-xl md:rounded-2xl bg-[#12121a] border border-white/5 overflow-hidden">
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <h2 className="text-sm font-medium text-white/80">待处理客户反馈</h2>
                    <MessageCircle className="w-4 h-4 text-white/40" />
                  </div>
                  <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">
                    2 条新反馈
                  </Badge>
                </div>

                <div className="divide-y divide-white/5">
                  {mockPendingFeedback.map((feedback) => (
                    <div
                      key={feedback.id}
                      className="p-5 hover:bg-white/[0.02] transition-colors"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        {feedback.client && (
                          <Avatar className="w-10 h-10">
                            <AvatarFallback className="bg-primary/20 text-primary">
                              {feedback.client.name[0]}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div className="flex-1">
                          <div className="font-medium text-sm text-white/90 mb-1">{feedback.project}</div>
                          <div className="text-xs text-white/60 line-clamp-2 mb-2">
                            {feedback.content}
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="text-xs text-white/40">
                              {feedback.client?.name} ({feedback.client?.role}) · {feedback.time}
                            </div>
                            {feedback.attachments && (
                              <div className="text-xs text-white/40 flex items-center gap-1">
                                <span>3 张图片</span>
                              </div>
                            )}
                          </div>
                        </div>
                        {feedback.priority && (
                          <div className="w-2 h-2 bg-red-400 rounded-full" />
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="text-xs flex-1 bg-transparent border-white/10 text-white/60 hover:text-white">
                          查看详情
                        </Button>
                        <Button variant="outline" size="sm" className="text-xs bg-transparent border-white/10 text-white/60 hover:text-white">
                          标记已读
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 border-t border-white/5">
                  <Link href="/designer/projects">
                    <Button variant="outline" size="sm" className="w-full text-xs bg-transparent border-white/10 text-white/60 hover:text-white">
                      查看全部项目
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Recent Files */}
              <div className="rounded-xl md:rounded-2xl bg-[#12121a] border border-white/5 overflow-hidden">
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <h2 className="text-sm font-medium text-white/80">最近上传</h2>
                    <FolderOpen className="w-4 h-4 text-white/40" />
                  </div>
                  <div className="text-xs text-white/50">45GB / 100GB 已使用</div>
                </div>
                <div className="p-4 sm:p-6">
                  <Progress value={45} className="mb-4 h-1.5 bg-white/5" />

                  <div className="space-y-2">
                    {mockRecentFiles.map((file) => (
                      <div
                        key={file.id}
                        className="p-3 rounded-lg bg-white/5 hover:bg-white/[0.02] transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded flex items-center justify-center">
                            <FileText className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm text-white/90 truncate">{file.name}</div>
                            <div className="text-xs text-white/50">
                              {file.size} · {file.uploadedAt}
                            </div>
                          </div>
                          <Badge
                            className={cn(
                              "text-[10px] border",
                              file.status === "已审核"
                                ? "bg-green-500/10 text-green-400 border-green-500/20"
                                : "bg-orange-500/10 text-orange-400 border-orange-500/20"
                            )}
                          >
                            {file.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t border-white/5">
                    <Button size="sm" className="w-full text-xs bg-primary hover:bg-primary/90">
                      <Upload className="w-3 h-3 mr-2" />
                      上传文件
                    </Button>
                  </div>
                </div>
              </div>

              {/* Team Activity */}
              <div className="rounded-xl md:rounded-2xl bg-[#12121a] border border-white/5 overflow-hidden">
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/5">
                  <h2 className="text-sm font-medium text-white/80">团队动态</h2>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-xs text-white/50">实时更新</span>
                  </div>
                </div>

                <div className="p-4 sm:p-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-green-500/20 text-green-400 text-xs">
                        李
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="text-sm text-white/90">
                        李设计师 完成了 XX 项目 Logo 设计
                      </div>
                      <Link
                        href="/designer/projects/XX"
                        className="text-xs text-primary hover:underline"
                      >
                        某 AI 公司品牌升级
                      </Link>
                      <div className="text-xs text-white/40 mt-1">5分钟前</div>
                    </div>
                    <span className="text-xs text-white/40">3</span>
                  </div>
                </div>

                <div className="p-4 border-t border-white/5">
                  <Link
                    href="/designer/projects"
                    className="text-xs text-primary hover:underline"
                  >
                    查看更多项目
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
