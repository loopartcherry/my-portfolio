"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShoppingBag,
  Search,
  Filter,
  Download,
  MoreVertical,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  Calendar,
  DollarSign,
  User,
  Loader2,
  Package,
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

// Mock data
const mockOrders = [
  {
    id: "ORD-2024-0120",
    customer: { name: "张三", email: "zhangsan@example.com", avatar: undefined },
    date: "2024-01-20 14:32",
    status: "completed",
    statusText: "已完成",
    amount: 668.2,
    items: 2,
    subscription: "Professional",
  },
  {
    id: "ORD-2024-0118",
    customer: { name: "李四", email: "lisi@example.com", avatar: undefined },
    date: "2024-01-18 10:15",
    status: "pending",
    statusText: "待支付",
    amount: 3998,
    items: 1,
    subscription: "Standard",
  },
  {
    id: "ORD-2024-0115",
    customer: { name: "王五", email: "wangwu@example.com", avatar: undefined },
    date: "2024-01-15 16:45",
    status: "processing",
    statusText: "处理中",
    amount: 5998,
    items: 1,
    subscription: "Professional",
  },
];

const statusConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  completed: { label: "已完成", color: "text-green-400", bgColor: "bg-green-500/20 border-green-500/30" },
  pending: { label: "待支付", color: "text-orange-400", bgColor: "bg-orange-500/20 border-orange-500/30" },
  processing: { label: "处理中", color: "text-primary", bgColor: "bg-primary/20 border-primary/30" },
  cancelled: { label: "已取消", color: "text-gray-400", bgColor: "bg-gray-500/20 border-gray-500/30" },
  paid: { label: "已支付", color: "text-green-400", bgColor: "bg-green-500/20 border-green-500/30" },
  failed: { label: "支付失败", color: "text-red-400", bgColor: "bg-red-500/20 border-red-500/30" },
  refunded: { label: "已退款", color: "text-gray-400", bgColor: "bg-gray-500/20 border-gray-500/30" },
};

const typeConfig: Record<string, { label: string; icon: any }> = {
  template: { label: "模板购买", icon: Package },
  subscription: { label: "订阅", icon: ShoppingBag },
  upgrade: { label: "升级", icon: CheckCircle },
  renewal: { label: "续费", icon: Clock },
};

export default function AdminOrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const isLoading = false; // 如果使用 API，这里应该是 useQuery 的 isLoading
  const statsLoading = false; // 如果使用 API，这里应该是统计数据加载状态

  const filteredOrders = mockOrders.filter((order) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (
        !order.id.toLowerCase().includes(query) &&
        !order.customer.name.toLowerCase().includes(query) &&
        !order.customer.email.toLowerCase().includes(query)
      ) {
        return false;
      }
    }
    if (statusFilter !== "all" && order.status !== statusFilter) return false;
    if (typeFilter !== "all" && (order as any).type && (order as any).type !== typeFilter) return false;
    return true;
  });

  const pagination = { totalPages: 1, total: filteredOrders.length };

  const stats = {
    total: mockOrders.length,
    completed: mockOrders.filter((o) => o.status === "completed").length,
    pending: mockOrders.filter((o) => o.status === "pending").length,
    processing: mockOrders.filter((o) => o.status === "processing").length,
    totalRevenue: mockOrders
      .filter((o) => o.status === "completed")
      .reduce((sum, o) => sum + o.amount, 0),
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
              const isActive = item.href === "/admin/orders";
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
                <h1 className="text-2xl font-bold text-white">订单管理</h1>
                <ShoppingBag className="w-6 h-6 text-white/40" />
              </div>
              <Button variant="outline" size="sm" className="border-white/10 text-white/60 hover:text-white">
                <Download className="w-4 h-4 mr-2" />
                导出订单
              </Button>
            </div>
            <p className="text-sm text-white/60">
              共 {filteredOrders.length} 个订单
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="p-4 bg-[#12121a] border-white/5">
              <div className="text-white/40 text-xs mb-1">总订单数</div>
              <div className="text-2xl font-light text-white">{stats.total}</div>
            </Card>
            <Card className="p-4 bg-[#12121a] border-white/5">
              <div className="text-white/40 text-xs mb-1">已完成</div>
              <div className="text-2xl font-light text-green-400">{stats.completed}</div>
            </Card>
            <Card className="p-4 bg-[#12121a] border-white/5">
              <div className="text-white/40 text-xs mb-1">待支付</div>
              <div className="text-2xl font-light text-orange-400">{stats.pending}</div>
            </Card>
            <Card className="p-4 bg-[#12121a] border-white/5">
              <div className="text-white/40 text-xs mb-1">总营收</div>
              <div className="text-2xl font-light text-white">
                ¥{(stats.totalRevenue / 10000).toFixed(1)}万
              </div>
            </Card>
          </div>

          {/* Filters */}
          <Card className="p-4 mb-6 bg-[#12121a] border-white/5">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <Input
                  placeholder="搜索订单..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-[#0a0a0f] border-white/5 text-white placeholder:text-white/30"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 bg-[#0a0a0f] border-white/5 text-white">
                  <SelectValue placeholder="状态筛选" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  <SelectItem value="paid">已支付</SelectItem>
                  <SelectItem value="pending">待支付</SelectItem>
                  <SelectItem value="failed">支付失败</SelectItem>
                  <SelectItem value="cancelled">已取消</SelectItem>
                  <SelectItem value="refunded">已退款</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40 bg-[#0a0a0f] border-white/5 text-white">
                  <SelectValue placeholder="类型筛选" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部类型</SelectItem>
                  <SelectItem value="template">模板购买</SelectItem>
                  <SelectItem value="subscription">订阅</SelectItem>
                  <SelectItem value="upgrade">升级</SelectItem>
                  <SelectItem value="renewal">续费</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>

          {/* Orders Table */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <Card className="bg-[#12121a] border-white/5">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/5">
                    <TableHead className="text-white/60">订单编号</TableHead>
                    <TableHead className="text-white/60">客户</TableHead>
                    <TableHead className="text-white/60">类型</TableHead>
                    <TableHead className="text-white/60">商品/服务</TableHead>
                    <TableHead className="text-white/60">金额</TableHead>
                    <TableHead className="text-white/60">状态</TableHead>
                    <TableHead className="text-white/60">创建时间</TableHead>
                    <TableHead className="text-white/60">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-10 text-white/40">
                        暂无订单
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredOrders.map((order: any) => {
                      const statusInfo = statusConfig[order.status] || statusConfig.pending;
                      const typeInfo = typeConfig[(order as any).type] || { label: (order as any).type || "未知", icon: Package };
                      const TypeIcon = typeInfo.icon;

                      return (
                        <TableRow key={order.id} className="border-white/5 hover:bg-white/5">
                          <TableCell>
                            <div className="font-mono text-xs text-white/60">{order.id.slice(0, 12)}...</div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="w-8 h-8">
                                <AvatarFallback className="bg-primary/20 text-primary">
                                  {order.user?.name?.[0] || order.user?.email?.[0] || "?"}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="text-sm text-white">{order.user?.name || "未知用户"}</div>
                                <div className="text-xs text-white/40">{order.user?.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <TypeIcon className="w-4 h-4 text-white/40" />
                              <span className="text-sm text-white/80">{typeInfo.label}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {order.template ? (
                              <div className="text-sm text-white">{order.template.name}</div>
                            ) : order.subscription ? (
                              <div className="text-sm text-white">
                                {order.subscription.plan?.name || "订阅套餐"}
                              </div>
                            ) : (
                              <span className="text-sm text-white/40">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="text-lg font-semibold text-white">
                              ¥{order.amount.toFixed(2)}
                            </div>
                            {order.paidAt && (
                              <div className="text-xs text-white/40">
                                {new Date(order.paidAt).toLocaleDateString("zh-CN")}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge className={cn("text-xs", statusInfo.bgColor, statusInfo.color)}>
                              {statusInfo.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-sm text-white/60">
                              <Calendar className="w-3 h-3" />
                              {new Date(order.createdAt).toLocaleDateString("zh-CN")}
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
                                  <Eye className="w-4 h-4 mr-2" />
                                  查看详情
                                </DropdownMenuItem>
                                {order.status === "paid" && (
                                  <DropdownMenuItem className="text-white hover:bg-white/10">
                                    <Download className="w-4 h-4 mr-2" />
                                    下载发票
                                  </DropdownMenuItem>
                                )}
                                {order.status === "paid" && (
                                  <>
                                    <DropdownMenuSeparator className="bg-white/10" />
                                    <DropdownMenuItem className="text-red-400 hover:bg-red-500/10">
                                      退款处理
                                    </DropdownMenuItem>
                                  </>
                                )}
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
    </div>
  );
}
