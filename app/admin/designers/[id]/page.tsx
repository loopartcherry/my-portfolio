"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Palette,
  ArrowLeft,
  Edit,
  Mail,
  Phone,
  Calendar,
  Star,
  Clock,
  Briefcase,
  TrendingUp,
  CheckCircle,
  XCircle,
  AlertCircle,
  UserPlus,
  Settings,
  Ban,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  adminMainNav,
  adminSystemNav,
  adminSettingsNav,
} from "@/lib/admin-nav";
import {
  useDesignerDetail,
  useDesignerProjects,
  useUpdateDesigner,
} from "@/hooks/use-designers";
import { AssignProjectDialog } from "@/components/admin/designers/assign-project-dialog";
import { ReassignProjectDialog } from "@/components/admin/designers/reassign-project-dialog";
import { EditDesignerModal } from "@/components/admin/designers/edit-designer-modal";

export default function DesignerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const designerId = params.id as string;

  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [reassignDialogOpen, setReassignDialogOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedProjectName, setSelectedProjectName] = useState<string>("");
  const [editModalOpen, setEditModalOpen] = useState(false);

  const { data: designer, isLoading } = useDesignerDetail(designerId);
  const { data: activeProjects = [] } = useDesignerProjects(designerId, {
    status: "in_progress",
    sortBy: "assignedAt",
  });
  const { data: completedProjects = [] } = useDesignerProjects(designerId, {
    status: "completed",
    sortBy: "assignedAt",
  });
  const updateMutation = useUpdateDesigner();

  const utilization = designer?.maxCapacity
    ? Math.round((designer.currentLoad / designer.maxCapacity) * 100)
    : 0;

  const handleReassign = (projectId: string, projectName: string) => {
    setSelectedProjectId(projectId);
    setSelectedProjectName(projectName);
    setReassignDialogOpen(true);
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!designerId) return;
    await updateMutation.mutateAsync({
      designerId,
      data: { status: newStatus as any },
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex">
        <div className="flex-1 w-full md:ml-60">
          <div className="p-8">
            <Skeleton className="h-8 w-64 mb-6" />
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!designer) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex">
        <div className="flex-1 w-full md:ml-60">
          <div className="p-8">
            <Card className="p-6 bg-[#12121a] border-white/5 text-center">
              <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h2 className="text-lg font-medium text-white mb-2">设计师不存在</h2>
              <p className="text-white/60 mb-4">请检查设计师ID是否正确</p>
              <Button onClick={() => router.push("/admin/designers")}>
                返回设计师列表
              </Button>
            </Card>
          </div>
        </div>
      </div>
    );
  }

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
              const isActive = item.href === "/admin/designers";
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
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/admin/designers")}
              className="text-white/60 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回
            </Button>
            <h1 className="text-base md:text-lg font-light text-white/90">
              {designer.name || "设计师详情"}
            </h1>
          </div>
        </header>

        <div className="p-4 sm:p-6 md:p-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column - Basic Info */}
            <div className="lg:col-span-3 space-y-6">
              {/* Profile Card */}
              <Card className="p-6 bg-[#12121a] border-white/5">
                <div className="text-center mb-6">
                  <Avatar className="w-20 h-20 mx-auto mb-4">
                    <AvatarImage src={undefined} />
                    <AvatarFallback className="bg-primary/20 text-primary text-2xl">
                      {designer.name?.charAt(0) || "D"}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-medium text-white mb-1">{designer.name || "未命名"}</h2>
                  <p className="text-sm text-white/60">{designer.email}</p>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-white/60">
                    <Mail className="w-4 h-4" />
                    <span>{designer.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/60">
                    <Calendar className="w-4 h-4" />
                    <span>加入时间：{new Date(designer.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full mt-4 bg-transparent border-white/10 text-white/60 hover:text-white"
                  onClick={() => setEditModalOpen(true)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  编辑信息
                </Button>
              </Card>

              {/* Skills Card */}
              <Card className="p-6 bg-[#12121a] border-white/5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-white/80">技能标签</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditModalOpen(true)}
                    className="text-primary hover:text-primary/80"
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {((designer.specialties || []) as string[]).map((skill, i) => (
                    <Badge
                      key={i}
                      variant="outline"
                      className="bg-white/5 border-white/10 text-white/80"
                    >
                      {skill}
                    </Badge>
                  ))}
                  {((designer.specialties || []) as string[]).length === 0 && (
                    <span className="text-sm text-white/40">暂无技能标签</span>
                  )}
                </div>
              </Card>

              {/* Work Parameters */}
              <Card className="p-6 bg-[#12121a] border-white/5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-white/80">工作参数</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditModalOpen(true)}
                    className="text-primary hover:text-primary/80"
                  >
                    <Settings className="w-3 h-3" />
                  </Button>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-white/60">时薪</span>
                    <span className="text-white font-medium">¥{designer.hourlyRate}/小时</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/60">最大容量</span>
                    <span className="text-white font-medium">{designer.maxCapacity} 个项目</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/60">当前负载</span>
                    <span className="text-white font-medium">
                      {designer.currentLoad} / {designer.maxCapacity} ({utilization}%)
                    </span>
                  </div>
                  <Progress value={utilization} className="h-2" />
                  <div className="flex items-center justify-between">
                    <span className="text-white/60">状态</span>
                    {designer.status === "active" ? (
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        活跃
                      </Badge>
                    ) : designer.status === "inactive" ? (
                      <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">
                        <XCircle className="w-3 h-3 mr-1" />
                        离线
                      </Badge>
                    ) : (
                      <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                        <Clock className="w-3 h-3 mr-1" />
                        休假
                      </Badge>
                    )}
                  </div>
                </div>
              </Card>

              {/* Stats Card */}
              <Card className="p-6 bg-[#12121a] border-white/5">
                <h3 className="text-sm font-medium text-white/80 mb-4">评价统计</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-white/60">总项目数</span>
                    <span className="text-white font-medium">{designer.totalProjects || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/60">平均评分</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-white font-medium">
                        {designer.rating?.toFixed(1) || "0.0"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/60">平均完成时间</span>
                    <span className="text-white font-medium">
                      {designer.averageCompletionTime
                        ? `${Math.round(designer.averageCompletionTime)}h`
                        : "-"}
                    </span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Middle Column - Projects */}
            <div className="lg:col-span-6 space-y-6">
              {/* Active Projects */}
              <Card className="p-6 bg-[#12121a] border-white/5">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium text-white">进行中的项目 ({activeProjects.length})</h3>
                </div>
                <div className="space-y-4">
                  {activeProjects.length === 0 ? (
                    <p className="text-white/40 text-center py-8">暂无进行中的项目</p>
                  ) : (
                    activeProjects.map((project: any) => (
                      <div
                        key={project.id}
                        className="p-4 rounded-lg bg-white/5 border border-white/10"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="text-white font-medium mb-1">{project.name}</h4>
                            <p className="text-sm text-white/60">
                              客户：{project.client?.name || project.client?.email || "未知"}
                            </p>
                          </div>
                          <Badge variant="outline" className="bg-primary/10 border-primary/20 text-primary">
                            进行中
                          </Badge>
                        </div>
                        <div className="space-y-2 mb-3">
                          <div className="flex items-center justify-between text-xs text-white/60">
                            <span>进度</span>
                            <span>{project.completionRate || 0}%</span>
                          </div>
                          <Progress value={project.completionRate || 0} className="h-2" />
                        </div>
                        <div className="flex items-center justify-between text-xs text-white/40 mb-3">
                          <span>分配时间：{project.assignedAt ? new Date(project.assignedAt).toLocaleDateString() : "-"}</span>
                          <span>预估工时：{project.estimatedHours || "-"}h</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleReassign(project.id, project.name)}
                            className="bg-transparent border-white/10 text-white/60 hover:text-white"
                          >
                            重新分配
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="bg-transparent border-white/10 text-white/60 hover:text-white"
                          >
                            <Link href={`/admin/projects/${project.id}`}>查看详情</Link>
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </Card>

              {/* Completed Projects */}
              <Card className="p-6 bg-[#12121a] border-white/5">
                <h3 className="text-lg font-medium text-white mb-6">
                  最近完成的项目 ({completedProjects.length})
                </h3>
                <div className="space-y-4">
                  {completedProjects.length === 0 ? (
                    <p className="text-white/40 text-center py-8">暂无已完成的项目</p>
                  ) : (
                    completedProjects.slice(0, 5).map((project: any) => (
                      <div
                        key={project.id}
                        className="p-4 rounded-lg bg-white/5 border border-white/10"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="text-white font-medium">{project.name}</h4>
                            <p className="text-sm text-white/60">
                              客户：{project.client?.name || project.client?.email || "未知"}
                            </p>
                          </div>
                          <Badge variant="outline" className="bg-green-500/10 border-green-500/20 text-green-400">
                            已完成
                          </Badge>
                        </div>
                        <div className="text-xs text-white/40">
                          交付日期：{project.createdAt ? new Date(project.createdAt).toLocaleDateString() : "-"}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            </div>

            {/* Right Column - Quick Actions */}
            <div className="lg:col-span-3 space-y-6">
              <Card className="p-6 bg-[#12121a] border-white/5">
                <h3 className="text-sm font-medium text-white/80 mb-4">快速操作</h3>
                <div className="space-y-2">
                  <Button
                    className="w-full justify-start bg-primary/10 hover:bg-primary/20 text-primary border-0"
                    onClick={() => setAssignDialogOpen(true)}
                    disabled={utilization >= 100 || designer.status !== "active"}
                  >
                    <Briefcase className="w-4 h-4 mr-2" />
                    分配项目
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent border-white/10 text-white/60 hover:text-white"
                    onClick={() => setEditModalOpen(true)}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    调整参数
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent border-white/10 text-white/60 hover:text-white"
                    onClick={() => setEditModalOpen(true)}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    休假设置
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent border-white/10 text-white/60 hover:text-white"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    查看评价
                  </Button>
                  {designer.status === "active" ? (
                    <Button
                      variant="outline"
                      className="w-full justify-start bg-transparent border-red-500/20 text-red-400 hover:bg-red-500/10"
                      onClick={() => handleStatusChange("inactive")}
                    >
                      <Ban className="w-4 h-4 mr-2" />
                      禁用账户
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      className="w-full justify-start bg-transparent border-green-500/20 text-green-400 hover:bg-green-500/10"
                      onClick={() => handleStatusChange("active")}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      启用账户
                    </Button>
                  )}
                </div>
              </Card>

              {/* Work Timeline (Mock) */}
              <Card className="p-6 bg-[#12121a] border-white/5">
                <h3 className="text-sm font-medium text-white/80 mb-4">工作时间线（最近 7 天）</h3>
                <div className="space-y-2 text-sm">
                  {["周一", "周二", "周三", "周四", "周五", "周六", "周日"].map((day, i) => (
                    <div key={day} className="flex items-center justify-between text-white/60">
                      <span>{day}</span>
                      <span>{i < 5 ? `${7 + i * 0.5}h` : "0h"}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Dialogs */}
      <AssignProjectDialog
        open={assignDialogOpen}
        onOpenChange={setAssignDialogOpen}
        designerId={designerId}
        onSuccess={() => setAssignDialogOpen(false)}
      />

      {selectedProjectId && (
        <ReassignProjectDialog
          open={reassignDialogOpen}
          onOpenChange={setReassignDialogOpen}
          designerId={designerId}
          projectId={selectedProjectId}
          projectName={selectedProjectName}
          onSuccess={() => {
            setReassignDialogOpen(false);
            setSelectedProjectId(null);
            setSelectedProjectName("");
          }}
        />
      )}

      <EditDesignerModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        designerId={designerId}
        onSuccess={() => setEditModalOpen(false)}
      />
    </div>
  );
}
