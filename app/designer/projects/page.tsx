"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { DeliverProjectDialog } from "@/components/designer/deliver-project-dialog";
import {
  Briefcase,
  Grid3X3,
  List,
  Search,
  Filter,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Upload,
  Eye,
  ChevronRight,
  MoreVertical,
  MessageCircle,
  Bell,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import {
  designerMainNav,
  designerCollaborationNav,
  designerDataNav,
  designerSettingsNav,
} from "@/lib/designer-nav";

// Mock data
const mockProjects = [
  {
    id: "PRJ-001",
    name: "某 AI 公司品牌升级",
    client: "某 AI 科技有限公司",
    category: "品牌设计",
    servicePackage: "系统提升套餐",
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
    createdAt: "2024-01-10",
  },
  {
    id: "PRJ-002",
    name: "某 SaaS 产品 UI 设计",
    client: "某 SaaS 公司",
    category: "产品设计",
    servicePackage: "UI设计套餐",
    status: "设计中",
    priority: "高",
    progress: 45,
    deadline: "2024-02-28",
    daysRemaining: 43,
    createdAt: "2024-01-08",
  },
  {
    id: "PRJ-003",
    name: "某大数据公司技术白皮书",
    client: "某大数据公司",
    category: "文档设计",
    servicePackage: "文档设计套餐",
    status: "待验收",
    priority: "中",
    progress: 80,
    deadline: "2024-01-20",
    daysRemaining: 5,
    createdAt: "2024-01-05",
  },
];

export default function DesignerProjectsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeTab, setActiveTab] = useState("all");
  const [timeRange, setTimeRange] = useState("30days");
  const [sortBy, setSortBy] = useState("deadline");
  const [deliverDialogOpen, setDeliverDialogOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  // 获取设计师的项目列表
  const { data: projectsData, isLoading, refetch } = useQuery({
    queryKey: ["designer-projects", activeTab],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (activeTab !== "all") {
        const statusMap: Record<string, string> = {
          "in-progress": "IN_PROGRESS",
          "assigned": "ASSIGNED",
          "review": "REVIEW",
          "completed": "COMPLETED",
        };
        if (statusMap[activeTab]) {
          params.set("status", statusMap[activeTab]);
        }
      }
      const res = await fetch(`/api/designer/projects?${params.toString()}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("获取项目失败");
      return res.json();
    },
  });

  const projects = projectsData?.data || [];
  const stats = {
    all: projects.length,
    inProgress: projects.filter((p: any) => ["ASSIGNED", "IN_PROGRESS"].includes(p.status)).length,
    review: projects.filter((p: any) => p.status === "REVIEW").length,
    completed: projects.filter((p: any) => p.status === "COMPLETED").length,
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex" data-dashboard>
      {/* Left Sidebar - 复用设计师工作台的侧边栏 */}
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
            const isActive = item.href === "/designer/projects";
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
            <h1 className="text-base md:text-lg font-light text-white/90 truncate">我的项目</h1>
            <span className="hidden sm:inline text-xs text-white/40 truncate">共 {mockProjects.length} 个项目</span>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link href="/designer/notifications" className="relative p-2 text-white/40 hover:text-white/80 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
            </Link>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/80 to-accent/80 flex items-center justify-center text-xs font-medium text-white">
              张
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6 md:p-8 w-full">
          {/* Filters and View Toggle */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
              <TabsList className="bg-white/5 border border-white/10">
                <TabsTrigger value="all" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary text-white/60">
                  全部 ({stats.all})
                </TabsTrigger>
                <TabsTrigger
                  value="in-progress"
                  className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary text-white/60"
                >
                  进行中 ({stats.inProgress})
                </TabsTrigger>
                <TabsTrigger
                  value="review"
                  className="data-[state=active]:bg-orange-500/10 data-[state=active]:text-orange-400 text-white/60"
                >
                  待验收 ({stats.review})
                </TabsTrigger>
                <TabsTrigger
                  value="completed"
                  className="data-[state=active]:bg-green-500/10 data-[state=active]:text-green-400 text-white/60"
                >
                  已完成 ({stats.completed})
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative flex-1 sm:w-auto sm:min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <Input
                    placeholder="搜索项目..."
                    className="pl-9 bg-white/5 border-white/10 text-white/80 placeholder:text-white/30"
                  />
                </div>
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-32 bg-white/5 border-white/10 text-white/80">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a24] border-white/10">
                    <SelectItem value="7days" className="text-white/80">最近 7 天</SelectItem>
                    <SelectItem value="30days" className="text-white/80">最近 30 天</SelectItem>
                    <SelectItem value="3months" className="text-white/80">最近 3 个月</SelectItem>
                    <SelectItem value="6months" className="text-white/80">最近 6 个月</SelectItem>
                    <SelectItem value="all" className="text-white/80">全部时间</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-32 bg-white/5 border-white/10 text-white/80">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a24] border-white/10">
                    <SelectItem value="deadline" className="text-white/80">截止时间</SelectItem>
                    <SelectItem value="created" className="text-white/80">创建时间</SelectItem>
                    <SelectItem value="name" className="text-white/80">项目名称</SelectItem>
                    <SelectItem value="progress" className="text-white/80">进度</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={cn(
                    "p-2 rounded-md transition-all",
                    viewMode === "grid" ? "bg-white/10 text-white" : "text-white/40 hover:text-white/60"
                  )}
                >
                  <Grid3X3 className="w-4 h-4" />
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
              </div>
            </div>

          {/* Projects Grid/List */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {projects.length === 0 ? (
                <div className="col-span-3 text-center py-20 text-white/40">
                  暂无项目
                </div>
              ) : (
                projects.map((project: any) => {
                  const statusLabels: Record<string, string> = {
                    PENDING: "待分配",
                    ASSIGNED: "已分配",
                    IN_PROGRESS: "进行中",
                    REVIEW: "待验收",
                    COMPLETED: "已完成",
                    CANCELLED: "已取消",
                  };
                  return (
                <div
                  key={project.id}
                  className="group rounded-xl md:rounded-2xl bg-[#12121a] border border-white/5 hover:border-white/10 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                >
                  <div className="p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className={cn(
                          "text-[10px] border",
                          project.status === "IN_PROGRESS" || project.status === "ASSIGNED"
                            ? "bg-primary/10 text-primary border-primary/20"
                            : project.status === "REVIEW"
                            ? "bg-orange-500/10 text-orange-400 border-orange-500/20"
                            : project.status === "COMPLETED"
                            ? "bg-green-500/10 text-green-400 border-green-500/20"
                            : "bg-white/10 text-white/60 border-white/20"
                        )}>
                          {statusLabels[project.status] || project.status}
                        </Badge>
                        {project.priority && (
                          <Badge
                            className={cn(
                              "text-[10px] border",
                              project.priority === "紧急"
                                ? "bg-red-500/10 text-red-400 border-red-500/20"
                                : project.priority === "高"
                                ? "bg-orange-500/10 text-orange-400 border-orange-500/20"
                                : "bg-white/5 text-white/50 border-white/10"
                            )}
                          >
                            {project.priority}
                          </Badge>
                        )}
                        </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-1.5 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/5">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-[#1a1a24] border-white/10">
                          <DropdownMenuItem className="text-white/80 gap-2">
                            <Eye className="w-4 h-4" /> 查看详情
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-white/80 gap-2">
                            <Upload className="w-4 h-4" /> 上传文件
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="w-full h-32 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg mb-4 flex items-center justify-center">
                      <span className="text-2xl text-white/40">
                        {project.name[0]}
                      </span>
                    </div>

                    <p className="text-[10px] text-white/30 font-mono mb-2">#{project.id.slice(0, 8)}</p>
                    <h3 className="font-medium text-white/90 mb-1">{project.name}</h3>
                    <div className="text-xs text-white/50 mb-3">{project.user?.name || "未知客户"}</div>

                    {project.category && (
                      <div className="text-xs text-primary mb-2">{project.category}</div>
                    )}
                    {project.servicePackage && (
                      <div className="text-xs text-white/50 mb-3">
                        {project.servicePackage}
                      </div>
                    )}

                    <Progress value={project.completionRate || 0} className="mb-3 h-1.5 bg-white/5" />
                    <div className="flex items-center justify-between text-xs text-white/50 mb-3">
                      <span>{project.completionRate || 0}% 完成</span>
                    </div>
                    {project.estimatedHours && (
                      <div className="text-xs text-white/40 mb-3 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        预估 {project.estimatedHours}h
                      </div>
                    )}
                    {project.deliveryLink && (
                      <div className="text-xs text-primary mb-3">
                        <a href={project.deliveryLink} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          查看交付物 →
                        </a>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      {(project.status === "ASSIGNED" || project.status === "IN_PROGRESS") && (
                        <Button
                          size="sm"
                          className="flex-1 text-xs bg-primary hover:bg-primary/90"
                          onClick={() => {
                            setSelectedProjectId(project.id);
                            setDeliverDialogOpen(true);
                          }}
                        >
                          <Upload className="w-3 h-3 mr-1" />
                          提交交付
                        </Button>
                      )}
                      {project.status === "REVIEW" && (
                        <Button size="sm" variant="outline" className="flex-1 text-xs bg-orange-500/10 border-orange-500/20 text-orange-400">
                          待客户验收
                        </Button>
                      )}
                      {project.status === "COMPLETED" && (
                        <Button size="sm" variant="outline" className="flex-1 text-xs bg-green-500/10 border-green-500/20 text-green-400">
                          已完成
                        </Button>
                      )}
                      <Link
                        href={`/designer/projects/${project.id}`}
                        className="text-xs text-primary hover:underline flex items-center"
                      >
                        查看详情
                        <ChevronRight className="w-3 h-3 ml-1" />
                      </Link>
                    </div>
                  </div>
                </div>
                  );
                })
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {mockProjects.map((project) => (
                <div
                  key={project.id}
                  className="p-4 rounded-xl bg-[#12121a] border border-white/5 hover:border-white/10 hover:bg-white/[0.02] transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center">
                        <span className="text-xl text-white/40">
                          {project.name[0]}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-white/90">
                            {project.name}
                          </span>
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
                            <Badge
                              className={cn(
                                "text-[10px] border",
                                project.priority === "紧急"
                                    ? "bg-red-100 text-red-600"
                                    : "bg-orange-100 text-orange-600"
                                )}
                              >
                                {project.priority}
                              </Badge>
                            )}
                          </div>
                          <div className="text-xs text-gray-500 mb-1">
                            {project.client} · #{project.id}
                          </div>
                          {project.category && (
                            <div className="text-xs text-blue-600 mb-1">
                              {project.category} · {project.servicePackage}
                            </div>
                          )}
                          <div className="flex items-center gap-4 mt-2">
                            <Progress value={project.progress} className="flex-1 h-1" />
                            <span className="text-xs text-gray-500">
                              {project.progress}%
                            </span>
                          </div>
                          {project.currentStage && (
                            <div className="text-xs text-gray-400 mt-1">
                              {project.currentStage} · {project.tasksCompleted}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right mr-4">
                        <div className="text-sm font-medium text-gray-900 mb-1">
                          {project.deadline}
                        </div>
                        {project.daysRemaining !== undefined && (
                          <div
                            className={cn(
                              "text-xs",
                              project.daysRemaining <= 7
                                ? "text-red-600"
                                : project.daysRemaining <= 30
                                ? "text-orange-600"
                                : "text-green-600"
                            )}
                          >
                            剩余 {project.daysRemaining} 天
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="text-xs">
                          <Upload className="w-3 h-3 mr-1" />
                          上传
                        </Button>
                        <Link href={`/designer/projects/${project.id}`}>
                          <Button variant="ghost" size="sm">
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
          )}
        </div>
      </main>

      {/* Deliver Project Dialog */}
      {selectedProjectId && (
        <DeliverProjectDialog
          open={deliverDialogOpen}
          onOpenChange={(open) => {
            setDeliverDialogOpen(open);
            if (!open) {
              setSelectedProjectId(null);
            }
          }}
          projectId={selectedProjectId}
          projectName={projects.find((p: any) => p.id === selectedProjectId)?.name}
          onSuccess={() => {
            refetch();
            setDeliverDialogOpen(false);
            setSelectedProjectId(null);
          }}
        />
      )}
    </div>
  );
}
