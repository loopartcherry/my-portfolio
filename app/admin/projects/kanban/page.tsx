"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Briefcase,
  Plus,
  Search,
  Filter,
  Calendar,
  Clock,
  User,
  CheckCircle,
  AlertCircle,
  MoreVertical,
  Edit,
  Eye,
  GripVertical,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const columns = [
  { id: "PENDING", title: "待分配", color: "bg-gray-500/20 text-gray-400 border-gray-500/30" },
  { id: "ASSIGNED", title: "已分配", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  { id: "IN_PROGRESS", title: "设计中", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  { id: "REVIEW", title: "待验收", color: "bg-orange-500/20 text-orange-400 border-orange-500/30" },
  { id: "COMPLETED", title: "已完成", color: "bg-green-500/20 text-green-400 border-green-500/30" },
];

export default function AdminProjectsKanbanPage() {
  const qc = useQueryClient();
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [showTaskDialog, setShowTaskDialog] = useState(false);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [taskForm, setTaskForm] = useState({
    name: "",
    description: "",
    assignedToUserId: "",
    priority: "medium" as "low" | "medium" | "high" | "urgent",
    estimatedHours: "",
    dueDate: "",
  });

  // 获取所有项目
  const { data: projectsData, isLoading } = useQuery({
    queryKey: ["admin-projects"],
    queryFn: async () => {
      const res = await fetch("/api/admin/projects", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("获取项目失败");
      const data = await res.json();
      return data.data || [];
    },
  });

  // 获取设计师列表
  const { data: designersData } = useQuery({
    queryKey: ["admin-designers"],
    queryFn: async () => {
      const res = await fetch("/api/admin/designers", {
        credentials: "include",
      });
      if (!res.ok) return [];
      const data = await res.json();
      return data.data || [];
    },
  });

  // 更新项目状态
  const updateStatus = useMutation({
    mutationFn: async ({ projectId, status, completionRate }: { projectId: string; status: string; completionRate?: number }) => {
      const res = await fetch(`/api/admin/projects/${projectId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status, completionRate }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "更新失败");
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-projects"] });
      toast.success("项目状态已更新");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  // 创建子任务
  const createTask = useMutation({
    mutationFn: async (data: typeof taskForm) => {
      if (!selectedProject) throw new Error("未选择项目");
      const res = await fetch(`/api/admin/projects/${selectedProject.id}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...data,
          estimatedHours: data.estimatedHours ? parseFloat(data.estimatedHours) : undefined,
          dueDate: data.dueDate || undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || "创建失败");
      return json;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-projects"] });
      toast.success("子任务创建成功");
      setShowTaskDialog(false);
      setTaskForm({
        name: "",
        description: "",
        assignedToUserId: "",
        priority: "medium",
        estimatedHours: "",
        dueDate: "",
      });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  // 分配项目
  const assignProject = useMutation({
    mutationFn: async ({ projectId, designerId, estimatedHours }: { projectId: string; designerId: string; estimatedHours?: number }) => {
      const res = await fetch(`/api/admin/designers/${designerId}/assign-project`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ projectId, estimatedHours }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || "分配失败");
      return json;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-projects"] });
      toast.success("项目分配成功");
      setShowAssignDialog(false);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const projects = projectsData || [];
  const designers = designersData || [];

  // 按状态分组项目
  const projectsByStatus = columns.reduce((acc, col) => {
    acc[col.id] = projects.filter((p: any) => p.status === col.id);
    return acc;
  }, {} as Record<string, any[]>);

  const handleDragStart = (e: React.DragEvent, project: any) => {
    e.dataTransfer.setData("projectId", project.id);
    e.dataTransfer.setData("currentStatus", project.status);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStatus: string) => {
    e.preventDefault();
    const projectId = e.dataTransfer.getData("projectId");
    const currentStatus = e.dataTransfer.getData("currentStatus");

    if (currentStatus !== targetStatus) {
      updateStatus.mutate({ projectId, status: targetStatus });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "high":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      default:
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "紧急";
      case "high":
        return "高";
      case "medium":
        return "中";
      default:
        return "低";
    }
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
        </div>

        <div className="flex-1 overflow-y-auto">
          <nav className="p-4 space-y-1">
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
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 w-full md:ml-60">
        <div className="p-6">
          {/* Page Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-white">项目看板</h1>
                <Briefcase className="w-6 h-6 text-white/40" />
              </div>
              <div className="flex gap-2">
                <Link href="/admin/projects">
                  <Button variant="outline" className="border-white/10">
                    列表视图
                  </Button>
                </Link>
                <Button
                  onClick={() => setShowTaskDialog(true)}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  创建子任务
                </Button>
              </div>
            </div>
            <p className="text-sm text-white/60">
              共 {projects.length} 个项目
            </p>
          </div>

          {/* Kanban Board */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-4">
              {columns.map((column) => {
                const columnProjects = projectsByStatus[column.id] || [];
                return (
                  <div
                    key={column.id}
                    className="flex-shrink-0 w-80"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, column.id)}
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge className={cn("text-xs", column.color)}>
                          {column.title}
                        </Badge>
                        <span className="text-sm text-white/40">
                          ({columnProjects.length})
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3 min-h-[600px]">
                      {columnProjects.map((project: any) => (
                        <Card
                          key={project.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, project)}
                          className="p-4 bg-[#12121a] border-white/5 hover:border-white/10 transition-all cursor-move"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h3 className="font-medium text-white text-sm mb-1">
                                {project.name}
                              </h3>
                              <p className="text-xs text-white/40 mb-2">
                                {project.user?.name || "未知客户"}
                              </p>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="bg-[#12121a] border-white/10">
                                <DropdownMenuItem
                                  className="text-white hover:bg-white/10"
                                  onClick={() => setSelectedProject(project)}
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  查看详情
                                </DropdownMenuItem>
                                {project.status === "PENDING" && (
                                  <DropdownMenuItem
                                    className="text-white hover:bg-white/10"
                                    onClick={() => {
                                      setSelectedProject(project);
                                      setShowAssignDialog(true);
                                    }}
                                  >
                                    <User className="w-4 h-4 mr-2" />
                                    分配设计师
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem
                                  className="text-white hover:bg-white/10"
                                  onClick={() => {
                                    setSelectedProject(project);
                                    setShowTaskDialog(true);
                                  }}
                                >
                                  <Plus className="w-4 h-4 mr-2" />
                                  创建子任务
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>

                          {project.description && (
                            <p className="text-xs text-white/60 mb-2 line-clamp-2">
                              {project.description}
                            </p>
                          )}

                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={cn("text-xs", getPriorityColor(project.priority))}>
                              {getPriorityLabel(project.priority)}
                            </Badge>
                            {project.assignedToUser && (
                              <div className="flex items-center gap-1">
                                <Avatar className="w-4 h-4">
                                  <AvatarFallback className="bg-primary/20 text-primary text-[8px]">
                                    {project.assignedToUser.name?.[0] || "?"}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-xs text-white/60">
                                  {project.assignedToUser.name}
                                </span>
                              </div>
                            )}
                          </div>

                          {project.completionRate !== null && (
                            <div className="mb-2">
                              <Progress value={project.completionRate || 0} className="h-1" />
                              <span className="text-xs text-white/40 mt-1">
                                {project.completionRate || 0}% 完成
                              </span>
                            </div>
                          )}

                          {project.estimatedHours && (
                            <div className="text-xs text-white/40 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              预估 {project.estimatedHours}h
                            </div>
                          )}
                        </Card>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Create Task Dialog */}
      <Dialog open={showTaskDialog} onOpenChange={setShowTaskDialog}>
        <DialogContent className="max-w-2xl bg-[#12121a] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>创建子任务</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className="text-white/80">任务名称 *</Label>
              <Input
                value={taskForm.name}
                onChange={(e) => setTaskForm({ ...taskForm, name: e.target.value })}
                className="mt-1 bg-[#0a0a0f] border-white/10 text-white"
                placeholder="输入任务名称"
              />
            </div>
            <div>
              <Label className="text-white/80">任务描述</Label>
              <textarea
                value={taskForm.description}
                onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                className="mt-1 w-full px-4 py-3 bg-[#0a0a0f] border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50"
                rows={3}
                placeholder="输入任务描述"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-white/80">分配给设计师</Label>
                <Select
                  value={taskForm.assignedToUserId}
                  onValueChange={(v) => setTaskForm({ ...taskForm, assignedToUserId: v })}
                >
                  <SelectTrigger className="mt-1 bg-[#0a0a0f] border-white/10 text-white">
                    <SelectValue placeholder="选择设计师" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#12121a] border-white/10">
                    <SelectItem value="">不分配</SelectItem>
                    {designers.map((d: any) => (
                      <SelectItem key={d.id} value={d.userId}>
                        {d.user?.name || d.user?.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-white/80">优先级</Label>
                <Select
                  value={taskForm.priority}
                  onValueChange={(v) => setTaskForm({ ...taskForm, priority: v as any })}
                >
                  <SelectTrigger className="mt-1 bg-[#0a0a0f] border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#12121a] border-white/10">
                    <SelectItem value="low">低</SelectItem>
                    <SelectItem value="medium">中</SelectItem>
                    <SelectItem value="high">高</SelectItem>
                    <SelectItem value="urgent">紧急</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-white/80">预估工时（小时）</Label>
                <Input
                  type="number"
                  value={taskForm.estimatedHours}
                  onChange={(e) => setTaskForm({ ...taskForm, estimatedHours: e.target.value })}
                  className="mt-1 bg-[#0a0a0f] border-white/10 text-white"
                  placeholder="0"
                />
              </div>
              <div>
                <Label className="text-white/80">截止日期</Label>
                <Input
                  type="date"
                  value={taskForm.dueDate}
                  onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                  className="mt-1 bg-[#0a0a0f] border-white/10 text-white"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              className="border-white/10"
              onClick={() => setShowTaskDialog(false)}
            >
              取消
            </Button>
            <Button
              className="bg-gradient-to-r from-purple-500 to-pink-500"
              onClick={() => {
                if (!taskForm.name) {
                  toast.error("请输入任务名称");
                  return;
                }
                createTask.mutate(taskForm);
              }}
              disabled={createTask.isPending}
            >
              {createTask.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  创建中...
                </>
              ) : (
                "创建任务"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Project Dialog */}
      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent className="max-w-md bg-[#12121a] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>分配设计师</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className="text-white/80">项目</Label>
              <Input
                value={selectedProject?.name || ""}
                disabled
                className="mt-1 bg-[#0a0a0f] border-white/10 text-white/60"
              />
            </div>
            <div>
              <Label className="text-white/80">选择设计师 *</Label>
              <Select
                value=""
                onValueChange={(designerId) => {
                  if (selectedProject) {
                    assignProject.mutate({
                      projectId: selectedProject.id,
                      designerId,
                      estimatedHours: selectedProject.estimatedHours || undefined,
                    });
                  }
                }}
              >
                <SelectTrigger className="mt-1 bg-[#0a0a0f] border-white/10 text-white">
                  <SelectValue placeholder="选择设计师" />
                </SelectTrigger>
                <SelectContent className="bg-[#12121a] border-white/10">
                  {designers.map((d: any) => (
                    <SelectItem key={d.id} value={d.userId}>
                      {d.user?.name || d.user?.email} ({d.currentLoad}/{d.maxCapacity})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              className="border-white/10"
              onClick={() => setShowAssignDialog(false)}
            >
              取消
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
