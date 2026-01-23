"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Home,
  FolderKanban,
  CreditCard,
  FileText,
  Settings,
  Gift,
  ArrowLeft,
  Calendar,
  Clock,
  RefreshCw,
  CheckCircle,
  XCircle,
  Loader2,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { mainNav, otherNav } from "@/lib/dashboard-nav";
import { useCurrentSubscription } from "@/hooks/use-subscription";
import { useSubscriptionHistory } from "@/hooks/use-subscription";
import { useRenewSubscription } from "@/hooks/use-subscription-actions";
import { toast } from "sonner";

export default function RenewPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [autoRenew, setAutoRenew] = useState(true);

  const { data: currentSubscription, isLoading: loadingCurrent } = useCurrentSubscription();
  const { data: historyData, isLoading: loadingHistory } = useSubscriptionHistory(page, 10);
  const renewMutation = useRenewSubscription();

  // 计算续费信息
  const subscription = currentSubscription?.subscription;
  const plan = currentSubscription?.plan;

  const now = new Date();
  const endDate = subscription?.endDate ? new Date(subscription.endDate) : null;
  const daysUntilExpiry = endDate
    ? Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const canRenew = daysUntilExpiry <= 7 || daysUntilExpiry < 0;
  const renewalPrice = subscription?.type === "yearly" ? plan?.yearlyPrice : plan?.price;

  // 处理自动续费开关
  const handleAutoRenewToggle = async (checked: boolean) => {
    // TODO: 调用 API 更新自动续费设置
    setAutoRenew(checked);
    toast.success(checked ? "已开启自动续费" : "已关闭自动续费");
  };

  // 处理续费
  const handleRenew = () => {
    if (!subscription || !plan) {
      toast.error("无法获取订阅信息");
      return;
    }

    renewMutation.mutate({
      planId: plan.id,
      type: subscription.type as "monthly" | "yearly",
    });
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

        <nav className="flex-1 p-4 space-y-1">
          {mainNav.map((item) => {
            const Icon = item.icon;
            const isActive = item.href === "/dashboard/subscription";
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
      </aside>

      {/* Main Content */}
      <main className="flex-1 w-full md:ml-60">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 h-16 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="sm" className="text-white/60 hover:text-white">
              <Link href="/dashboard/subscription" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                返回订阅管理
              </Link>
            </Button>
            <h1 className="text-base md:text-lg font-light text-white/90">续费管理</h1>
          </div>
        </header>

        <div className="p-4 sm:p-6 md:p-8 max-w-6xl mx-auto">
          {/* 续费信息卡片 */}
          <Card className="p-6 bg-[#12121a] border-white/5 mb-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-light text-white mb-2">当前订阅</h2>
                <p className="text-sm text-white/60">{plan?.name || "未知套餐"}</p>
              </div>
              <Badge
                className={cn(
                  "text-xs",
                  subscription?.status === "active"
                    ? "bg-green-500/20 text-green-400 border-green-500/30"
                    : subscription?.status === "expired"
                    ? "bg-red-500/20 text-red-400 border-red-500/30"
                    : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                )}
              >
                {subscription?.status === "active"
                  ? "正常"
                  : subscription?.status === "expired"
                  ? "已过期"
                  : subscription?.status}
              </Badge>
            </div>

            {loadingCurrent ? (
              <div className="space-y-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : subscription && plan ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* 过期日期 */}
                <div className="p-4 rounded-lg bg-white/5">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-white/40" />
                    <span className="text-xs text-white/60">过期日期</span>
                  </div>
                  <p className="text-lg font-medium text-white">
                    {endDate?.toLocaleDateString("zh-CN") || "未知"}
                  </p>
                  <p
                    className={cn(
                      "text-xs mt-1",
                      daysUntilExpiry < 0
                        ? "text-red-400"
                        : daysUntilExpiry <= 7
                        ? "text-yellow-400"
                        : "text-white/40"
                    )}
                  >
                    {daysUntilExpiry < 0
                      ? `已过期 ${Math.abs(daysUntilExpiry)} 天`
                      : `剩余 ${daysUntilExpiry} 天`}
                  </p>
                </div>

                {/* 续费价格 */}
                <div className="p-4 rounded-lg bg-white/5">
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard className="w-4 h-4 text-white/40" />
                    <span className="text-xs text-white/60">续费价格</span>
                  </div>
                  <p className="text-lg font-medium text-white">
                    ¥{renewalPrice || 0}
                    <span className="text-sm text-white/40 ml-1">
                      /{subscription.type === "yearly" ? "年" : "月"}
                    </span>
                  </p>
                  <p className="text-xs text-white/40 mt-1">
                    {subscription.type === "yearly" ? "年付" : "月付"}
                  </p>
                </div>

                {/* 自动续费 */}
                <div className="p-4 rounded-lg bg-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 text-white/40" />
                      <span className="text-xs text-white/60">自动续费</span>
                    </div>
                    <Switch
                      checked={autoRenew}
                      onCheckedChange={handleAutoRenewToggle}
                      className="data-[state=checked]:bg-primary"
                    />
                  </div>
                  <p className="text-sm text-white/80">
                    {autoRenew ? "已开启" : "已关闭"}
                  </p>
                  <p className="text-xs text-white/40 mt-1">
                    {autoRenew
                      ? "到期后将自动续费"
                      : "到期后需要手动续费"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-white/60">
                无法获取订阅信息
              </div>
            )}

            {/* 续费按钮 */}
            {subscription && (
              <div className="flex items-center gap-4 pt-6 border-t border-white/10">
                <div className="flex-1">
                  {!canRenew && daysUntilExpiry > 7 && (
                    <p className="text-sm text-white/60">
                      订阅将在到期前 7 天内开放续费
                    </p>
                  )}
                  {canRenew && (
                    <p className="text-sm text-white/60">
                      {daysUntilExpiry < 0
                        ? "订阅已过期，请立即续费以恢复服务"
                        : "可以续费，续费后将从当前到期日延长一个周期"}
                    </p>
                  )}
                </div>
                <Button
                  onClick={handleRenew}
                  disabled={!canRenew || renewMutation.isPending}
                  className="bg-primary hover:bg-primary/90"
                >
                  {renewMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      处理中...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      立即续费
                    </>
                  )}
                </Button>
              </div>
            )}
          </Card>

          {/* 续费历史 */}
          <Card className="p-6 bg-[#12121a] border-white/5">
            <h3 className="text-lg font-medium text-white mb-6">续费历史</h3>

            {loadingHistory ? (
              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : historyData?.data && historyData.data.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/10">
                        <TableHead className="text-white/60">订阅周期</TableHead>
                        <TableHead className="text-white/60">套餐</TableHead>
                        <TableHead className="text-white/60">金额</TableHead>
                        <TableHead className="text-white/60">状态</TableHead>
                        <TableHead className="text-white/60">续费时间</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {historyData.data.map((item: any) => {
                        const sub = item.subscription;
                        const orders = item.orders || [];
                        const latestOrder = orders[0];

                        return (
                          <TableRow
                            key={sub.id}
                            className="border-white/5 hover:bg-white/5"
                          >
                            <TableCell className="text-white/80">
                              {sub.startDate
                                ? new Date(sub.startDate).toLocaleDateString("zh-CN")
                                : "-"}{" "}
                              ~{" "}
                              {sub.endDate
                                ? new Date(sub.endDate).toLocaleDateString("zh-CN")
                                : "-"}
                            </TableCell>
                            <TableCell className="text-white/80">
                              {sub.plan?.name || "未知"}
                            </TableCell>
                            <TableCell className="text-white/80">
                              ¥{sub.price || 0}
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={cn(
                                  "text-xs",
                                  sub.status === "active"
                                    ? "bg-green-500/20 text-green-400"
                                    : sub.status === "expired"
                                    ? "bg-red-500/20 text-red-400"
                                    : "bg-white/10 text-white/60"
                                )}
                              >
                                {sub.status === "active"
                                  ? "正常"
                                  : sub.status === "expired"
                                  ? "已过期"
                                  : sub.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-white/60">
                              {latestOrder?.paidAt
                                ? new Date(latestOrder.paidAt).toLocaleString("zh-CN")
                                : latestOrder?.createdAt
                                ? new Date(latestOrder.createdAt).toLocaleString("zh-CN")
                                : "-"}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>

                {/* 分页 */}
                {historyData.pagination && historyData.pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/10">
                    <p className="text-sm text-white/60">
                      共 {historyData.pagination.total} 条记录
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="bg-transparent border-white/10 text-white/60"
                      >
                        上一页
                      </Button>
                      <span className="text-sm text-white/60">
                        {page} / {historyData.pagination.totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setPage((p) =>
                            Math.min(historyData.pagination.totalPages, p + 1)
                          )
                        }
                        disabled={page >= historyData.pagination.totalPages}
                        className="bg-transparent border-white/10 text-white/60"
                      >
                        下一页
                      </Button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12 text-white/60">
                <Clock className="w-12 h-12 mx-auto mb-4 text-white/20" />
                <p>暂无续费历史</p>
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
}
