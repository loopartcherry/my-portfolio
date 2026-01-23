"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckSquare,
  Plus,
  Upload,
  Download,
  Grid3X3,
  List,
  Calendar,
  Filter,
  GripVertical,
  Clock,
  Paperclip,
  MessageCircle,
  User,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  designerMainNav,
  designerCollaborationNav,
  designerDataNav,
  designerSettingsNav,
} from "@/lib/designer-nav";

// Mock data
const mockTasks = {
  todo: [
    {
      id: 1,
      title: "Logo 第三版设计修改",
      project: "某 AI 公司品牌升级",
      description: "根据客户反馈修改 Logo 颜色，建议使用更深的蓝色",
      priority: "紧急",
      deadline: "今天 18:00",
      estimatedHours: 2,
      attachments: 3,
      comments: 2,
      assignee: { name: "张设计师", avatar: undefined },
      tags: ["Logo设计", "紧急"],
    },
    {
      id: 2,
      title: "技术白皮书封面设计",
      project: "某大数据公司技术白皮书",
      priority: "高",
      deadline: "明天 17:00",
      estimatedHours: 3,
      tags: ["封面设计", "高"],
    },
  ],
  inProgress: [
    {
      id: 3,
      title: "PPT 模板第一版设计",
      project: "某 AI 公司品牌升级",
      priority: "中",
      deadline: "今天 11:30",
      progress: 30,
      startedAt: "今天 09:30",
      currentHours: 2.5,
      tags: ["PPT设计", "中"],
    },
  ],
  review: [
    {
      id: 4,
      title: "VI 系统设计",
      project: "某 AI 公司品牌升级",
      priority: "高",
      submittedAt: "2小时前",
      status: "等待客户审核",
      tags: ["VI设计", "高"],
    },
  ],
  completed: [
    {
      id: 5,
      title: "Logo 初稿设计",
      project: "某 AI 公司品牌升级",
      completedAt: "昨天 16:00",
      tags: ["Logo设计"],
    },
  ],
};

export default function DesignerTasksPage() {
  const [viewMode, setViewMode] = useState<"kanban" | "list" | "calendar">("kanban");

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex" data-dashboard>
      {/* Left Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-60 bg-[#0d0d14] border-r border-white/5 flex-col z-40">
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

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <div className="text-xs text-white/40 mb-2 px-4">工作台</div>
          {designerMainNav.map((item) => {
            const Icon = item.icon;
            const isActive = item.href === "/designer/tasks";
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

        <div className="p-4 border-t border-white/5">
          <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-white/10 text-white/50 hover:text-white/80 hover:border-white/20 hover:bg-white/5 transition-all duration-200 text-sm">
            <MessageCircle className="w-4 h-4" />
            <span>联系客服</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 w-full md:ml-60">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 h-16 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-4 min-w-0 flex-1">
            <h1 className="text-base md:text-lg font-light text-white/90 truncate">我的任务</h1>
            <span className="hidden sm:inline text-xs text-white/40 truncate">12 个待办，3 个今日到期</span>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/80 to-accent/80 flex items-center justify-center text-xs font-medium text-white">
              张
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6 md:p-8 w-full">
          {/* Toolbar */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2">
              <Button size="sm" className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                新建任务
              </Button>
              <Button variant="outline" size="sm" className="bg-transparent border-white/10 text-white/60 hover:text-white">
                <Upload className="w-4 h-4 mr-2" />
                批量导入
              </Button>
              <Button variant="outline" size="sm" className="bg-transparent border-white/10 text-white/60 hover:text-white">
                <Download className="w-4 h-4 mr-2" />
                导出任务
              </Button>
            </div>
            <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
              <button
                onClick={() => setViewMode("kanban")}
                className={cn(
                  "px-3 py-1.5 text-xs rounded-md transition-all",
                  viewMode === "kanban" ? "bg-primary/20 text-primary" : "text-white/50 hover:text-white/80"
                )}
              >
                Kanban
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "p-2 rounded-md transition-all",
                  viewMode === "list" ? "bg-white/10 text-white" : "text-white/40 hover:text-white/60"
                )}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("calendar")}
                className={cn(
                  "p-2 rounded-md transition-all",
                  viewMode === "calendar" ? "bg-white/10 text-white" : "text-white/40 hover:text-white/60"
                )}
              >
                <Calendar className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Kanban View */}
          {viewMode === "kanban" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Column 1: 待开始 */}
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-white/80">
                    待开始 ({mockTasks.todo.length})
                  </h3>
                  <button className="p-1.5 rounded-lg text-white/40 hover:text-white/80 hover:bg-white/5">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-3">
                  {mockTasks.todo.map((task) => (
                    <div
                      key={task.id}
                      className="p-4 rounded-xl bg-[#12121a] border border-white/5 hover:border-white/10 transition-all cursor-pointer"
                    >
                      <div className="flex items-start gap-2 mb-2">
                        <div
                          className={cn(
                            "w-1 h-12 rounded-full",
                            task.priority === "紧急"
                              ? "bg-red-500"
                              : task.priority === "高"
                              ? "bg-orange-500"
                              : "bg-white/20"
                          )}
                        />
                        <div className="flex-1">
                          <div className="font-medium text-sm text-white/90 mb-1">
                            {task.title}
                          </div>
                          <Badge className="text-[10px] bg-white/5 text-white/50 border-white/10 mb-2">
                            {task.project}
                          </Badge>
                          {"description" in task && task.description && (
                            <div className="text-xs text-white/60 line-clamp-2 mb-2">
                              {task.description}
                            </div>
                          )}
                          <div className="flex items-center gap-2 flex-wrap mb-2">
                            {task.tags?.map((tag, idx) => (
                              <Badge
                                key={idx}
                                className="text-[10px] bg-white/5 text-white/50 border-white/10"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex items-center justify-between text-xs text-white/50 mb-2">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-orange-400" />
                              {"deadline" in task && task.deadline}
                            </span>
                            {"estimatedHours" in task && task.estimatedHours && (
                              <span>预估 {task.estimatedHours}h</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-white/40">
                            {"attachments" in task && task.attachments && (
                              <span className="flex items-center gap-1">
                                <Paperclip className="w-3 h-3" />
                                {task.attachments}
                              </span>
                            )}
                            {"comments" in task && task.comments && (
                              <span className="flex items-center gap-1">
                                <MessageCircle className="w-3 h-3" />
                                {task.comments}
                              </span>
                            )}
                          </div>
                          {"assignee" in task && task.assignee && (
                            <div className="mt-2 flex items-center justify-end">
                              <Avatar className="w-6 h-6">
                                <AvatarFallback className="bg-primary/20 text-primary text-xs">
                                  {task.assignee.name[0]}
                                </AvatarFallback>
                              </Avatar>
                            </div>
                          )}
                          <div className="mt-2 flex items-center gap-2">
                            <Button size="sm" className="flex-1 text-xs bg-primary hover:bg-primary/90">
                              开始工作
                            </Button>
                            <Link
                              href={`/designer/projects/${task.id}`}
                              className="text-xs text-primary hover:underline"
                            >
                              查看详情
                            </Link>
                          </div>
                        </div>
                        <GripVertical className="w-4 h-4 text-white/30 cursor-move" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Column 2: 进行中 */}
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-white/80">
                    进行中 ({mockTasks.inProgress.length})
                  </h3>
                </div>
                <div className="space-y-3">
                  {mockTasks.inProgress.map((task) => (
                    <div
                      key={task.id}
                      className="p-4 rounded-xl bg-[#12121a] border border-white/5 hover:border-white/10 transition-all cursor-pointer"
                    >
                      <div className="flex items-start gap-2 mb-2">
                        <div className="w-1 h-12 rounded-full bg-orange-500" />
                        <div className="flex-1">
                          <div className="font-medium text-sm text-white/90 mb-1">
                            {task.title}
                          </div>
                          <Badge className="text-[10px] bg-white/5 text-white/50 border-white/10 mb-2">
                            {task.project}
                          </Badge>
                          <Progress value={task.progress} className="mb-2 h-1 bg-white/5" />
                          <div className="text-xs text-white/50 mb-2">
                            开始时间：{task.startedAt}
                          </div>
                          <div className="text-xs text-white/50 mb-2">
                            当前耗时：{task.currentHours}h
                          </div>
                          <div className="flex items-center gap-2 text-xs text-white/40">
                            <Clock className="w-3 h-3 text-orange-400" />
                            {"deadline" in task && task.deadline}
                          </div>
                          <div className="mt-2 flex items-center gap-2">
                            <Button variant="outline" size="sm" className="flex-1 text-xs bg-transparent border-white/10 text-white/60 hover:text-white">
                              继续工作
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Column 3: 待审核 */}
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-white/80">
                    待审核 ({mockTasks.review.length})
                  </h3>
                </div>
                <div className="space-y-3">
                  {mockTasks.review.map((task) => (
                    <div
                      key={task.id}
                      className="p-4 rounded-xl bg-[#12121a] border border-white/5 hover:border-white/10 transition-all cursor-pointer"
                    >
                      <div className="flex items-start gap-2 mb-2">
                        <div className="w-1 h-12 rounded-full bg-orange-500" />
                        <div className="flex-1">
                          <div className="font-medium text-sm text-white/90 mb-1">
                            {task.title}
                          </div>
                          <Badge className="text-[10px] bg-white/5 text-white/50 border-white/10 mb-2">
                            {task.project}
                          </Badge>
                          <Badge className="bg-orange-500/10 text-orange-400 border-orange-500/20 text-[10px] mb-2">
                            {task.status}
                          </Badge>
                          <div className="text-xs text-white/50">
                            提交时间：{task.submittedAt}
                          </div>
                          <div className="mt-2 flex items-center gap-2">
                            <Button variant="outline" size="sm" className="flex-1 text-xs bg-transparent border-white/10 text-white/60 hover:text-white">
                              查看详情
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Column 4: 已完成 */}
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-white/80">
                    已完成 ({mockTasks.completed.length})
                  </h3>
                </div>
                <div className="space-y-3">
                  {mockTasks.completed.map((task) => (
                    <div
                      key={task.id}
                      className="p-4 rounded-xl bg-[#12121a] border border-white/5 opacity-60 cursor-pointer hover:opacity-80 transition-all"
                    >
                      <div className="flex items-start gap-2 mb-2">
                        <div className="w-1 h-12 rounded-full bg-white/20" />
                        <div className="flex-1">
                          <div className="font-medium text-sm text-white/70 line-through mb-1">
                            {task.title}
                          </div>
                          <Badge className="text-[10px] bg-white/5 text-white/50 border-white/10 mb-2">
                            {task.project}
                          </Badge>
                          <div className="flex items-center gap-1 text-xs text-green-400 mb-2">
                            <CheckCircle className="w-3 h-3" />
                            完成时间：{task.completedAt}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* List View */}
          {viewMode === "list" && (
            <div className="rounded-xl border border-white/5 overflow-hidden">
              <div className="p-4 border-b border-white/5 bg-white/5">
                <div className="flex items-center gap-2">
                  <Checkbox className="border-white/20" />
                  <span className="text-sm text-white/60">全选</span>
                </div>
              </div>
              <div className="divide-y divide-white/5">
                {[...mockTasks.todo, ...mockTasks.inProgress, ...mockTasks.review].map(
                  (task) => (
                    <div
                      key={task.id}
                      className="p-4 hover:bg-white/[0.02] transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <Checkbox className="border-white/20" />
                        <div
                          className={cn(
                            "w-1 h-12 rounded-full",
                            task.priority === "紧急"
                              ? "bg-red-500"
                              : task.priority === "高"
                              ? "bg-orange-500"
                              : "bg-white/20"
                          )}
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-white/90">{task.title}</span>
                            <Badge className="text-[10px] bg-white/5 text-white/50 border-white/10">
                              {task.priority}
                            </Badge>
                          </div>
                          <div className="text-xs text-white/50">
                            {task.project} · {"deadline" in task && task.deadline}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-white/80">
                            {"deadline" in task && task.deadline}
                          </div>
                          {"assignee" in task && task.assignee && (
                            <Avatar className="w-6 h-6 mt-1">
                              <AvatarFallback className="bg-primary/20 text-primary text-xs">
                                {task.assignee.name[0]}
                              </AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                        <Button variant="ghost" size="sm" className="text-white/60 hover:text-white/80">
                          操作
                        </Button>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
