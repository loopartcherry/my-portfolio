"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import {
  Briefcase,
  Plus,
  Search,
  Filter,
  Grid3X3,
  List,
  Calendar,
  Clock,
  User,
  CheckCircle,
  AlertCircle,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Loader2,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import {
  adminMainNav,
  adminSystemNav,
  adminSettingsNav,
} from "@/lib/admin-nav";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AssignProjectSimpleDialog } from "@/components/admin/projects/assign-project-simple-dialog";

// Mock data
const mockProjects = [
  {
    id: "PRJ-001",
    name: "某 AI 公司品牌升级",
    client: "某 AI 科技有限公司",
    designer: { name: "张设计师", avatar: undefined },
    status: "进行中",
    progress: 65,
    priority: "紧急",
    deadline: "2024-02-15",
    createdAt: "2024-01-10",
    category: "品牌设计",
    budget: 50000,
  },
  {
    id: "PRJ-002",
    name: "某 SaaS 产品 UI 设计",
    client: "某 SaaS 公司",
    designer: { name: "李设计师", avatar: undefined },
    status: "设计中",
    progress: 45,
    priority: "高",
    deadline: "2024-02-28",
    createdAt: "2024-01-08",
    category: "产品设计",
    budget: 30000,
  },
];

export default function AdminProjectsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<"all" | "pending">("all");
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  // 获取所有项目数据
  const { data: projectsData, isLoading, refetch } = useQuery({
    queryKey: ["admin-projects", statusFilter, activeTab],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (activeTab === "pending") {
        const res = await fetch(`/api/admin/projects/pending?${params.toString()}`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("获取待处理项目失败");
        return res.json();
      } else {
        if (statusFilter !== "all") params.set("status", statusFilter);
        const res = await fetch(`/api/admin/projects?${params.toString()}`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("获取项目失败");
        return res.json();
      }
    },
  });

  const projects = projectsData?.data || [];
  const pendingProjects = activeTab === "pending" ? projects : [];

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
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <nav className="p-4 space-y-1">
            <div className="text-xs text-white/40 mb-2 px-4">主要功能</div>
            {adminMainNav.map((item) => {
              const Icon = item.icon;
              const isActive = item.href === "/admin/projects";
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
                          : "bg-orange-500/20 text-orange-400"
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}

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
        <div className="p-6 max-w-[1400px] mx-auto">
          {/* Page Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-white">项目管理</h1>
                <Briefcase className="w-6 h-6 text-white/40" />
              </div>
              <Link href="/admin/projects/new">
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="w-4 h-4 mr-2" />
                  创建项目
                </Button>
              </Link>
            </div>
            <p className="text-sm text-white/60">
              共 {projects.length} 个项目，{projects.filter((p: any) => ["ASSIGNED", "IN_PROGRESS", "REVIEW"].includes(p.status)).length} 个进行中
              {activeTab === "pending" && `，${pendingProjects.length} 个待分配`}
            </p>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "all" | "pending")} className="mb-6">
            <TabsList className="bg-white/5 border border-white/10">
              <TabsTrigger value="all" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary text-white/60">
                全部项目
              </TabsTrigger>
              <TabsTrigger value="pending" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary text-white/60">
                待处理项目
                {pendingProjects.length > 0 && (
                  <Badge className="ml-2 bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">
                    {pendingProjects.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Filters */}
          <Card className="p-4 mb-6 bg-[#12121a] border-white/5">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <Input
                  placeholder="搜索项目..."
                  className="pl-9 bg-[#0a0a0f] border-white/5 text-white placeholder:text-white/30"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 bg-[#0a0a0f] border-white/5 text-white">
                  <SelectValue placeholder="状态筛选" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  <SelectItem value="in-progress">进行中</SelectItem>
                  <SelectItem value="completed">已完成</SelectItem>
                  <SelectItem value="paused">已暂停</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center gap-2">
                <Link href="/admin/projects/kanban">
                  <Button variant="outline" size="sm" className="border-white/10">
                    看板视图
                  </Button>
                </Link>
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>

          {/* Projects Table */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {viewMode === "list" && (
                <Card className="bg-[#12121a] border-white/5">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/5">
                        <TableHead className="text-white/60">项目名称</TableHead>
                        <TableHead className="text-white/60">客户</TableHead>
                        <TableHead className="text-white/60">设计师</TableHead>
                        <TableHead className="text-white/60">状态</TableHead>
                        <TableHead className="text-white/60">进度</TableHead>
                        <TableHead className="text-white/60">优先级</TableHead>
                        <TableHead className="text-white/60">操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {projects.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-10 text-white/40">
                            暂无项目
                          </TableCell>
                        </TableRow>
                      ) : (
                        projects.map((project: any) => {
                          const statusLabels: Record<string, string> = {
                            PENDING: "待分配",
                            ASSIGNED: "已分配",
                            IN_PROGRESS: "设计中",
                            REVIEW: "待验收",
                            COMPLETED: "已完成",
                            CANCELLED: "已取消",
                          };
                          const priorityLabels: Record<string, string> = {
                            urgent: "紧急",
                            high: "高",
                            medium: "中",
                            low: "低",
                          };
                          return (
                            <TableRow
                              key={project.id}
                              className="border-white/5 hover:bg-white/5"
                            >
                              <TableCell>
                                <div className="font-medium text-white">{project.name}</div>
                                <div className="text-xs text-white/40">#{project.id.slice(0, 8)}</div>
                              </TableCell>
                              <TableCell className="text-white/80">{project.user?.name || "未知客户"}</TableCell>
                              <TableCell>
                                {project.assignedToUser ? (
                                  <div className="flex items-center gap-2">
                                    <Avatar className="w-6 h-6">
                                      <AvatarFallback className="bg-primary/20 text-primary text-xs">
                                        {project.assignedToUser.name?.[0] || "?"}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm text-white/80">
                                      {project.assignedToUser.name}
                                    </span>
                                  </div>
                                ) : (
                                  <span className="text-sm text-white/40">未分配</span>
                                )}
                              </TableCell>
                              <TableCell>
                                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                                  {statusLabels[project.status] || project.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Progress value={project.completionRate || 0} className="w-20 h-1" />
                                  <span className="text-sm text-white/80">{project.completionRate || 0}%</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  className={cn(
                                    "text-xs",
                                    project.priority === "urgent"
                                      ? "bg-red-500/20 text-red-400 border-red-500/30"
                                      : project.priority === "high"
                                      ? "bg-orange-500/20 text-orange-400 border-orange-500/30"
                                      : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                                  )}
                                >
                                  {priorityLabels[project.priority] || project.priority}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  {project.status === "PENDING" && (
                                    <Button
                                      size="sm"
                                      className="bg-primary hover:bg-primary/90 text-xs"
                                      onClick={() => {
                                        setSelectedProjectId(project.id);
                                        setAssignDialogOpen(true);
                                      }}
                                    >
                                      <Users className="w-3 h-3 mr-1" />
                                      分配
                                    </Button>
                                  )}
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="sm">
                                        <MoreVertical className="w-4 h-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="bg-[#12121a] border-white/10">
                                      <DropdownMenuItem className="text-white hover:bg-white/10">
                                        <Eye className="w-4 h-4 mr-2" />
                                        查看详情
                                      </DropdownMenuItem>
                                      <DropdownMenuItem className="text-white hover:bg-white/10">
                                        <Edit className="w-4 h-4 mr-2" />
                                        编辑项目
                                      </DropdownMenuItem>
                                      <DropdownMenuSeparator className="bg-white/10" />
                                      <DropdownMenuItem className="text-red-400 hover:bg-red-500/10">
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        删除项目
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                </Card>
              )}

              {/* Projects Grid View */}
              {viewMode === "grid" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.length === 0 ? (
                    <div className="col-span-3 text-center py-20 text-white/40">
                      暂无项目
                    </div>
                  ) : (
                    projects.map((project: any) => {
                      const statusLabels: Record<string, string> = {
                        PENDING: "待分配",
                        ASSIGNED: "已分配",
                        IN_PROGRESS: "设计中",
                        REVIEW: "待验收",
                        COMPLETED: "已完成",
                        CANCELLED: "已取消",
                      };
                      const priorityLabels: Record<string, string> = {
                        urgent: "紧急",
                        high: "高",
                        medium: "中",
                        low: "低",
                      };
                      return (
                        <Card
                          key={project.id}
                          className="p-6 bg-[#12121a] border-white/5 hover:border-white/10 transition-colors cursor-pointer"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                                {statusLabels[project.status] || project.status}
                              </Badge>
                              {project.priority && (
                                <Badge
                                  className={cn(
                                    "text-xs",
                                    project.priority === "urgent"
                                      ? "bg-red-500/20 text-red-400 border-red-500/30"
                                      : project.priority === "high"
                                      ? "bg-orange-500/20 text-orange-400 border-orange-500/30"
                                      : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                                  )}
                                >
                                  {priorityLabels[project.priority] || project.priority}
                                </Badge>
                              )}
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="bg-[#12121a] border-white/10">
                                <DropdownMenuItem className="text-white hover:bg-white/10">
                                  <Eye className="w-4 h-4 mr-2" />
                                  查看详情
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-white hover:bg-white/10">
                                  <Edit className="w-4 h-4 mr-2" />
                                  编辑项目
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>

                          <h3 className="font-semibold text-white mb-2">{project.name}</h3>
                          <div className="text-sm text-white/60 mb-4">{project.user?.name || "未知客户"}</div>
                          <div className="text-xs text-white/40 mb-4">#{project.id.slice(0, 8)}</div>

                          <Progress value={project.completionRate || 0} className="mb-4 h-1" />
                          <div className="flex items-center justify-between text-xs text-white/60 mb-4">
                            <span>{project.completionRate || 0}% 完成</span>
                            {project.assignedToUser && (
                              <span className="flex items-center gap-1">
                                <User className="w-3 h-3" />
                                {project.assignedToUser.name}
                              </span>
                            )}
                          </div>

                          {project.estimatedHours && (
                            <div className="text-xs text-white/40 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              预估 {project.estimatedHours}h
                            </div>
                          )}
                        </Card>
                      );
                    })
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Assign Project Dialog */}
      {selectedProjectId && (
        <AssignProjectSimpleDialog
          open={assignDialogOpen}
          onOpenChange={(open) => {
            setAssignDialogOpen(open);
            if (!open) {
              setSelectedProjectId(null);
            }
          }}
          projectId={selectedProjectId}
          projectName={projects.find((p: any) => p.id === selectedProjectId)?.name}
          onSuccess={() => {
            refetch();
            setAssignDialogOpen(false);
            setSelectedProjectId(null);
          }}
        />
      )}
    </div>
  );
}
