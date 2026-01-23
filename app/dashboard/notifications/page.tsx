"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Bell,
  Check,
  X,
  Trash2,
  Filter,
  MoreVertical,
  MessageSquare,
  FileText,
  UserPlus,
  CheckCircle,
  AlertCircle,
  Clock,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { mainNav, otherNav } from "@/lib/dashboard-nav";
import { formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";

import type { LucideIcon } from "lucide-react";

interface NotificationData {
  id: string;
  type: string;
  title: string;
  content: string;
  read: boolean;
  readAt: string | null;
  createdAt: string;
  actionUrl?: string | null;
  projectId?: string | null;
  taskId?: string | null;
  fileId?: string | null;
}

const notificationTypeMap: Record<string, { label: string; icon: LucideIcon; color: string }> = {
  task_assigned: { label: "任务分配", icon: UserPlus, color: "text-blue-400" },
  task_completed: { label: "任务完成", icon: CheckCircle, color: "text-green-400" },
  project_comment: { label: "项目评论", icon: MessageSquare, color: "text-purple-400" },
  file_uploaded: { label: "文件上传", icon: FileText, color: "text-orange-400" },
  project_status_changed: { label: "项目状态", icon: AlertCircle, color: "text-yellow-400" },
  system: { label: "系统通知", icon: Bell, color: "text-gray-400" },
};

export default function NotificationsPage() {
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // 获取通知列表
  const { data: notificationsData, isLoading } = useQuery({
    queryKey: ["notifications", filter, typeFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filter === "unread") params.set("read", "false");
      if (filter === "read") params.set("read", "true");
      if (typeFilter) params.set("type", typeFilter);

      const res = await fetch(`/api/notifications?${params.toString()}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("获取通知失败");
      return res.json();
    },
  });

  const notifications = notificationsData?.data || [];
  const unreadCount = notificationsData?.unreadCount || 0;

  // 标记为已读
  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/notifications/${id}`, {
        method: "PATCH",
        credentials: "include",
      });
      if (!res.ok) throw new Error("标记失败");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  // 全部标记为已读
  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/notifications/read-all", {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("标记失败");
      return res.json();
    },
    onSuccess: () => {
      toast.success("已标记所有通知为已读");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  // 删除通知
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/notifications/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("删除失败");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const handleMarkAsRead = (id: string) => {
    markAsReadMutation.mutate(id);
  };

  const handleDelete = (id: string) => {
    if (confirm("确定删除此通知？")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex" data-dashboard>
      {/* Left Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-60 bg-[#0d0d14] border-r border-white/5 flex-col z-40">
        <div className="p-6 border-b border-white/5">
          <Link href="/" className="text-lg font-light tracking-wider">
            <span className="text-primary">SPIRAL</span>
            <span className="text-white/40">.VISION</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {mainNav.map((item) => {
            const Icon = item.icon;
            const isActive = item.href === "/dashboard/notifications";
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

        <div className="p-4 border-t border-white/5">
          <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-white/10 text-white/50 hover:text-white/80 hover:border-white/20 hover:bg-white/5 transition-all duration-200 text-sm">
            <MessageSquare className="w-4 h-4" />
            <span>联系客服</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 w-full md:ml-60">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 h-16 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-4 min-w-0 flex-1">
            <h1 className="text-base md:text-lg font-light text-white/90 truncate">通知中心</h1>
            {unreadCount > 0 && (
              <Badge className="bg-primary/20 text-primary border-primary/30">
                {unreadCount} 条未读
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => markAllAsReadMutation.mutate()}
              disabled={unreadCount === 0 || markAllAsReadMutation.isPending}
              className="border-white/10 text-white/60"
            >
              <Check className="w-4 h-4 mr-2" />
              全部已读
            </Button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/80 to-accent/80 flex items-center justify-center text-xs font-medium text-white">
              张
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6 md:p-8 w-full">
          {/* Filters */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant={filter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("all")}
                className={cn(
                  filter === "all"
                    ? "bg-primary text-primary-foreground"
                    : "border-white/10 text-white/60"
                )}
              >
                全部
              </Button>
              <Button
                variant={filter === "unread" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("unread")}
                className={cn(
                  filter === "unread"
                    ? "bg-primary text-primary-foreground"
                    : "border-white/10 text-white/60"
                )}
              >
                未读
                {unreadCount > 0 && (
                  <Badge className="ml-2 bg-white/20 text-white text-[10px]">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
              <Button
                variant={filter === "read" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("read")}
                className={cn(
                  filter === "read"
                    ? "bg-primary text-primary-foreground"
                    : "border-white/10 text-white/60"
                )}
              >
                已读
              </Button>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="border-white/10 text-white/60">
                  <Filter className="w-4 h-4 mr-2" />
                  类型筛选
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-[#12121a] border-white/10">
                <DropdownMenuItem
                  onClick={() => setTypeFilter(null)}
                  className={cn(
                    "text-white hover:bg-white/10",
                    typeFilter === null && "bg-primary/10"
                  )}
                >
                  全部类型
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10" />
                {Object.entries(notificationTypeMap).map(([type, info]) => {
                  const Icon = info.icon;
                  return (
                    <DropdownMenuItem
                      key={type}
                      onClick={() => setTypeFilter(type)}
                      className={cn(
                        "text-white hover:bg-white/10",
                        typeFilter === type && "bg-primary/10"
                      )}
                    >
                      <Icon className={cn("w-4 h-4 mr-2", info.color)} />
                      {info.label}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Notifications List */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-white/40">加载中...</div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Bell className="w-16 h-16 text-white/20 mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">暂无通知</h3>
              <p className="text-white/60">当有新的活动时，您会在这里收到通知</p>
            </div>
          ) : (
                        <div className="space-y-3">
                          {notifications.map((notification: NotificationData) => {
                const typeInfo = notificationTypeMap[notification.type] || notificationTypeMap.system;
                const Icon = typeInfo.icon;

                return (
                  <Card
                    key={notification.id}
                    className={cn(
                      "p-4 bg-[#12121a] border-white/5 transition-all hover:border-white/10",
                      !notification.read && "border-primary/30 bg-primary/5"
                    )}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                          !notification.read ? "bg-primary/20" : "bg-white/5"
                        )}
                      >
                        <Icon className={cn("w-5 h-5", typeInfo.color)} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <h3
                              className={cn(
                                "text-sm font-medium mb-1",
                                !notification.read ? "text-white" : "text-white/70"
                              )}
                            >
                              {notification.title}
                            </h3>
                            <p className="text-sm text-white/60 mb-2">{notification.content}</p>
                            <div className="flex items-center gap-3 text-xs text-white/40">
                              <span>
                                {formatDistanceToNow(new Date(notification.createdAt), {
                                  addSuffix: true,
                                  locale: zhCN,
                                })}
                              </span>
                              {notification.actionUrl && (
                                <Link
                                  href={notification.actionUrl}
                                  className="text-primary hover:text-primary/80"
                                >
                                  查看详情 →
                                </Link>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 flex-shrink-0">
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleMarkAsRead(notification.id)}
                                className="h-8 w-8 p-0 text-white/40 hover:text-white"
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(notification.id)}
                              className="h-8 w-8 p-0 text-white/40 hover:text-red-400"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
