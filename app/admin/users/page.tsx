"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Users,
  UserPlus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Mail,
  Phone,
  Calendar,
  Shield,
  CheckCircle,
  XCircle,
  Ban,
  UserCheck,
  TrendingUp,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { UserRole } from "@/lib/types/user";
import { CreateUserDialog } from "@/components/admin/users/create-user-dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const roleLabels: Record<UserRole, string> = {
  client: "客户",
  designer: "设计师",
  admin: "管理员",
};

export default function AdminUsersPage() {
  const qc = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [page, setPage] = useState(1);

  const { data: usersData, isLoading } = useQuery({
    queryKey: ["admin-users", roleFilter, page],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (roleFilter !== "all") params.set("role", roleFilter);
      params.set("page", page.toString());
      params.set("limit", "20");

      const res = await fetch(`/api/admin/users?${params.toString()}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("获取用户列表失败");
      return res.json();
    },
  });

  // 更新用户状态
  const updateUserStatus = useMutation({
    mutationFn: async ({ userId, status }: { userId: string; status: "active" | "inactive" | "suspended" }) => {
      const res = await fetch(`/api/admin/users/${userId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "更新失败");
      return data;
    },
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success(`用户已${variables.status === "active" ? "启用" : "禁用"}`);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const users = usersData?.data || [];
  const pagination = usersData?.pagination || { total: 0, totalPages: 1 };

  const filteredUsers = users.filter((user: any) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        user.name?.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
      );
    }
    return true;
  });

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
              const isActive = item.href === "/admin/users";
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
                <h1 className="text-2xl font-bold text-white">用户管理</h1>
                <Users className="w-6 h-6 text-white/40" />
              </div>
              <Button
                className="bg-primary hover:bg-primary/90"
                onClick={() => setCreateDialogOpen(true)}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                创建用户
              </Button>
            </div>
            <p className="text-sm text-white/60">
              共 {filteredUsers.length} 个用户
            </p>
          </div>

          {/* Filters */}
          <Card className="p-4 mb-6 bg-[#12121a] border-white/5">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <Input
                  placeholder="搜索用户..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-[#0a0a0f] border-white/5 text-white placeholder:text-white/30"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-40 bg-[#0a0a0f] border-white/5 text-white">
                  <SelectValue placeholder="角色筛选" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部角色</SelectItem>
                  <SelectItem value="client">客户</SelectItem>
                  <SelectItem value="designer">设计师</SelectItem>
                  <SelectItem value="admin">管理员</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>

          {/* Users Table */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <Card className="bg-[#12121a] border-white/5">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/5">
                    <TableHead className="text-white/60">用户</TableHead>
                    <TableHead className="text-white/60">角色</TableHead>
                    <TableHead className="text-white/60">联系方式</TableHead>
                    <TableHead className="text-white/60">活跃度</TableHead>
                    <TableHead className="text-white/60">状态</TableHead>
                    <TableHead className="text-white/60">注册时间</TableHead>
                    <TableHead className="text-white/60">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-10 text-white/40">
                        暂无用户
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user: any) => {
                      const isActive = user.designer?.status === "active" || !user.designer;
                      return (
                        <TableRow key={user.id} className="border-white/5 hover:bg-white/5">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="w-10 h-10">
                                <AvatarFallback className="bg-primary/20 text-primary">
                                  {user.name?.[0] || user.email[0] || "?"}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium text-white">{user.name || "未设置"}</div>
                                <div className="text-xs text-white/40">{user.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={cn(
                                "text-xs",
                                user.role === "client"
                                  ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                                  : user.role === "designer"
                                  ? "bg-primary/20 text-primary border-primary/30"
                                  : "bg-red-500/20 text-red-400 border-red-500/30"
                              )}
                            >
                              {roleLabels[user.role as UserRole]}
                            </Badge>
                            {user.designer && (
                              <div className="text-xs text-white/40 mt-1">
                                负载: {user.designer.currentLoad}/{user.designer.maxCapacity}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-sm text-white/80">
                                <Mail className="w-3 h-3 text-white/40" />
                                {user.email}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-sm text-white/80">
                                <TrendingUp className="w-3 h-3 text-white/40" />
                                项目: {user.projectsCount || 0}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-white/80">
                                <ShoppingBag className="w-3 h-3 text-white/40" />
                                订单: {user.ordersCount || 0}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {isActive ? (
                                <>
                                  <CheckCircle className="w-4 h-4 text-green-400" />
                                  <span className="text-sm text-green-400">活跃</span>
                                </>
                              ) : (
                                <>
                                  <XCircle className="w-4 h-4 text-gray-400" />
                                  <span className="text-sm text-gray-400">已禁用</span>
                                </>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 text-sm text-white/60">
                              <Calendar className="w-3 h-3" />
                              {new Date(user.createdAt).toLocaleDateString("zh-CN")}
                            </div>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="bg-[#12121a] border-white/10">
                                <DropdownMenuItem className="text-white hover:bg-white/10">
                                  <Edit className="w-4 h-4 mr-2" />
                                  编辑用户
                                </DropdownMenuItem>
                                {user.role === "designer" && (
                                  <DropdownMenuItem
                                    className={cn(
                                      "hover:bg-white/10",
                                      isActive ? "text-orange-400" : "text-green-400"
                                    )}
                                    onClick={() => {
                                      updateUserStatus.mutate({
                                        userId: user.id,
                                        status: isActive ? "inactive" : "active",
                                      });
                                    }}
                                  >
                                    {isActive ? (
                                      <>
                                        <Ban className="w-4 h-4 mr-2" />
                                        禁用账号
                                      </>
                                    ) : (
                                      <>
                                        <UserCheck className="w-4 h-4 mr-2" />
                                        启用账号
                                      </>
                                    )}
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator className="bg-white/10" />
                                <DropdownMenuItem className="text-red-400 hover:bg-red-500/10">
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  删除用户
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between p-4 border-t border-white/5">
                  <div className="text-sm text-white/60">
                    第 {page} / {pagination.totalPages} 页，共 {pagination.total} 条
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="border-white/10"
                    >
                      上一页
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                      disabled={page === pagination.totalPages}
                      className="border-white/10"
                    >
                      下一页
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          )}
        </div>
      </main>

      <CreateUserDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
    </div>
  );
}
