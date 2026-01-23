"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Palette,
  UserPlus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Mail,
  Calendar,
  Star,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  TrendingUp,
  TrendingDown,
  Eye,
  Briefcase,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  adminMainNav,
  adminSystemNav,
  adminSettingsNav,
} from "@/lib/admin-nav";
import {
  useDesignersList,
  useDesignerWorkload,
  useUpdateDesigner,
  type DesignerFilters,
} from "@/hooks/use-designers";
import { AssignProjectDialog } from "@/components/admin/designers/assign-project-dialog";
import { EditDesignerModal } from "@/components/admin/designers/edit-designer-modal";

export default function AdminDesignersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [specialtyFilter, setSpecialtyFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedDesignerId, setSelectedDesignerId] = useState<string | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingDesignerId, setEditingDesignerId] = useState<string | null>(null);

  const filters: DesignerFilters = {
    ...(statusFilter !== "all" && { status: statusFilter as any }),
    ...(specialtyFilter !== "all" && { specialty: specialtyFilter }),
    ...(sortBy && { sortBy: sortBy as any }),
    ...(searchQuery && { search: searchQuery }),
  };

  const { data: designers = [], isLoading } = useDesignersList(filters);
  const { data: workload = [] } = useDesignerWorkload();
  const updateDesigner = useUpdateDesigner();

  const commonSpecialties = ["Logo设计", "VI系统", "网站设计", "品牌策划", "UI设计", "插画设计"];

  const filteredDesigners = designers.filter((designer: any) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (
        !designer.name?.toLowerCase().includes(query) &&
        !designer.email?.toLowerCase().includes(query)
      ) {
        return false;
      }
    }
    if (selectedSpecialties.length > 0) {
      const designerSpecialties = (designer.specialties || []) as string[];
      const hasMatch = selectedSpecialties.some((s) =>
        designerSpecialties.some((ds) => ds.toLowerCase().includes(s.toLowerCase()))
      );
      if (!hasMatch) return false;
    }
    return true;
  });

  const handleAssignProject = (designerId: string) => {
    setSelectedDesignerId(designerId);
    setAssignDialogOpen(true);
  };

  const handleEdit = (designerId: string) => {
    setEditingDesignerId(designerId);
    setEditModalOpen(true);
  };

  const handleStatusChange = async (designerId: string, newStatus: string) => {
    await updateDesigner.mutateAsync({
      designerId,
      data: { status: newStatus as any },
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            <CheckCircle className="w-3 h-3 mr-1" />
            活跃
          </Badge>
        );
      case "inactive":
        return (
          <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">
            <XCircle className="w-3 h-3 mr-1" />
            离线
          </Badge>
        );
      case "on_leave":
        return (
          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
            <Clock className="w-3 h-3 mr-1" />
            休假
          </Badge>
        );
      default:
        return null;
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
                  {item.badge && (
                    <span
                      className={cn(
                        "px-2 py-0.5 text-[10px] font-medium rounded-full",
                        item.badgeColor === "primary"
                          ? "bg-primary/20 text-primary"
                          : item.badgeColor === "orange"
                            ? "bg-orange-500/20 text-orange-400"
                            : ""
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
                <div className="text-xs text-white/40 mb-2 px-4 mt-4">系统管理</div>
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

            {adminSettingsNav.length > 0 && (
              <>
                <div className="text-xs text-white/40 mb-2 px-4 mt-4">设置</div>
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
              </>
            )}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 w-full md:ml-60">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 h-16 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-4 min-w-0 flex-1">
            <h1 className="text-base md:text-lg font-light text-white/90 truncate">
              设计师管理
            </h1>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <Button
              onClick={() => {
                setEditingDesignerId(null);
                setEditModalOpen(true);
              }}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              添加设计师
            </Button>
          </div>
        </header>

        {/* Content */}
        <div className="p-4 sm:p-6 md:p-8 w-full">
          {/* Filters */}
          <Card className="p-4 mb-6 bg-[#12121a] border-white/5">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <Input
                    placeholder="搜索设计师（姓名、邮箱）"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30"
                  />
                </div>
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px] bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="状态筛选" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  <SelectItem value="active">活跃</SelectItem>
                  <SelectItem value="inactive">离线</SelectItem>
                  <SelectItem value="on_leave">休假</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-[180px] bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="排序方式" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">创建时间</SelectItem>
                  <SelectItem value="rating">评分</SelectItem>
                  <SelectItem value="capacity">容量</SelectItem>
                  <SelectItem value="load">负载</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Specialty Filters */}
            <div className="mt-4 pt-4 border-t border-white/5">
              <div className="text-xs text-white/40 mb-2">技能筛选</div>
              <div className="flex flex-wrap gap-2">
                {commonSpecialties.map((specialty) => (
                  <div key={specialty} className="flex items-center gap-2">
                    <Checkbox
                      id={specialty}
                      checked={selectedSpecialties.includes(specialty)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedSpecialties([...selectedSpecialties, specialty]);
                        } else {
                          setSelectedSpecialties(selectedSpecialties.filter((s) => s !== specialty));
                        }
                      }}
                    />
                    <label
                      htmlFor={specialty}
                      className="text-sm text-white/60 cursor-pointer"
                    >
                      {specialty}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Designer Cards Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="p-6 bg-[#12121a] border-white/5">
                  <Skeleton className="h-32 w-full" />
                </Card>
              ))}
            </div>
          ) : filteredDesigners.length === 0 ? (
            <Card className="p-12 text-center bg-[#12121a] border-white/5">
              <Palette className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <p className="text-white/60">暂无设计师</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDesigners.map((designer: any) => {
                const utilization = designer.maxCapacity > 0
                  ? Math.round((designer.currentLoad / designer.maxCapacity) * 100)
                  : 0;
                const isOverloaded = utilization >= 100;
                const workloadInfo = workload.find((w: any) => w.designerId === designer.id);

                return (
                  <Card
                    key={designer.id}
                    className="p-6 bg-[#12121a] border-white/5 hover:border-primary/20 transition-all group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={undefined} />
                          <AvatarFallback className="bg-primary/20 text-primary">
                            {designer.name?.charAt(0) || "D"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-white font-medium">{designer.name || "未命名"}</h3>
                          <p className="text-xs text-white/40">{designer.email}</p>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-[#12121a] border-white/10">
                          <DropdownMenuItem
                            onClick={() => handleEdit(designer.id)}
                            className="text-white/80"
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            编辑
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleAssignProject(designer.id)}
                            className="text-white/80"
                            disabled={isOverloaded || designer.status !== "active"}
                          >
                            <Briefcase className="w-4 h-4 mr-2" />
                            分配项目
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            asChild
                            className="text-white/80"
                          >
                            <Link href={`/admin/designers/${designer.id}`}>
                              <Eye className="w-4 h-4 mr-2" />
                              查看详情
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-white/10" />
                          {designer.status === "active" ? (
                            <DropdownMenuItem
                              onClick={() => handleStatusChange(designer.id, "inactive")}
                              className="text-white/80"
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              禁用账户
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              onClick={() => handleStatusChange(designer.id, "active")}
                              className="text-white/80"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              启用账户
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {((designer.specialties || []) as string[]).slice(0, 3).map((skill, i) => (
                        <Badge
                          key={i}
                          variant="outline"
                          className="text-xs bg-white/5 border-white/10 text-white/60"
                        >
                          {skill}
                        </Badge>
                      ))}
                      {((designer.specialties || []) as string[]).length > 3 && (
                        <Badge
                          variant="outline"
                          className="text-xs bg-white/5 border-white/10 text-white/60"
                        >
                          +{((designer.specialties || []) as string[]).length - 3}
                        </Badge>
                      )}
                    </div>

                    {/* Workload */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-xs text-white/40 mb-2">
                        <span>工作负载</span>
                        <span className={cn(isOverloaded && "text-red-400")}>
                          {designer.currentLoad} / {designer.maxCapacity}
                        </span>
                      </div>
                      <Progress
                        value={utilization}
                        className={cn(
                          "h-2",
                          isOverloaded ? "bg-red-500/20" : "bg-white/5"
                        )}
                      />
                      {isOverloaded && (
                        <div className="flex items-center gap-1 mt-2 text-xs text-red-400">
                          <AlertCircle className="w-3 h-3" />
                          <span>当前已满载</span>
                        </div>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-4 pt-4 border-t border-white/5">
                      <div>
                        <div className="text-xs text-white/40 mb-1">总项目</div>
                        <div className="text-sm font-medium text-white">
                          {designer.totalProjects || 0}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-white/40 mb-1">评分</div>
                        <div className="flex items-center gap-1 text-sm font-medium text-white">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          {designer.rating?.toFixed(1) || "0.0"}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-white/40 mb-1">平均时间</div>
                        <div className="text-sm font-medium text-white">
                          {designer.averageCompletionTime
                            ? `${Math.round(designer.averageCompletionTime)}h`
                            : "-"}
                        </div>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      {getStatusBadge(designer.status)}
                      {designer.leaveFrom && designer.leaveTo && designer.status === "on_leave" && (
                        <span className="text-xs text-white/40">
                          {new Date(designer.leaveFrom).toLocaleDateString()} -{" "}
                          {new Date(designer.leaveTo).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Assign Project Dialog */}
      {selectedDesignerId && (
        <AssignProjectDialog
          open={assignDialogOpen}
          onOpenChange={setAssignDialogOpen}
          designerId={selectedDesignerId}
          onSuccess={() => {
            setAssignDialogOpen(false);
            setSelectedDesignerId(null);
          }}
        />
      )}

      {/* Edit Designer Modal */}
      <EditDesignerModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        designerId={editingDesignerId}
        onSuccess={() => {
          setEditModalOpen(false);
          setEditingDesignerId(null);
        }}
      />
    </div>
  );
}
