"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Home,
  FolderKanban,
  CreditCard,
  FileText,
  Settings,
  Gift,
  ChevronRight,
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { mainNav, otherNav } from "@/lib/dashboard-nav";
import { useCurrentSubscription } from "@/hooks/use-subscription";
import { useSubscriptionPlans } from "@/hooks/use-subscription";
import { useUpgradeAction } from "@/hooks/use-subscription-actions";
import { toast } from "sonner";

function UpgradePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = searchParams.get("planId");

  const { data: currentSubscription, isLoading: loadingCurrent } = useCurrentSubscription();
  const { data: plans, isLoading: loadingPlans } = useSubscriptionPlans();
  const upgradeMutation = useUpgradeAction();

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [priceInfo, setPriceInfo] = useState<{
    currentPrice: number;
    newPrice: number;
    difference: number;
    needsRefund: boolean;
    refundAmount?: number;
    proratedAmount: number;
    remainingDays: number;
  } | null>(null);
  const [loadingPrice, setLoadingPrice] = useState(false);

  // 获取新套餐信息
  const newPlan = plans?.find((p: any) => p.id === planId);
  const currentPlan = currentSubscription?.plan;

  // 计算升级差价
  useEffect(() => {
    if (currentSubscription?.subscription && planId && newPlan) {
      setLoadingPrice(true);
      fetch(`/api/subscriptions/upgrade`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ planId }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.data?.upgradeInfo) {
            setPriceInfo({
              currentPrice: data.data.upgradeInfo.oldPlan?.price || 0,
              newPrice: data.data.upgradeInfo.newPlan?.price || 0,
              difference: data.data.upgradeInfo.upgradeAmount || 0,
              needsRefund: data.data.upgradeInfo.upgradeAmount < 0,
              refundAmount: data.data.upgradeInfo.upgradeAmount < 0 
                ? Math.abs(data.data.upgradeInfo.upgradeAmount) 
                : undefined,
              proratedAmount: data.data.upgradeInfo.upgradeAmount || 0,
              remainingDays: data.data.upgradeInfo.remainingDays || 0,
            });
          }
        })
        .catch((error) => {
          console.error("计算差价失败:", error);
          toast.error("计算差价失败");
        })
        .finally(() => {
          setLoadingPrice(false);
        });
    }
  }, [currentSubscription, planId, newPlan]);

  const handleUpgrade = () => {
    if (!planId) {
      toast.error("请选择要升级的套餐");
      return;
    }

    if (!priceInfo) {
      toast.error("正在计算差价，请稍候");
      return;
    }

    setShowConfirmDialog(true);
  };

  const confirmUpgrade = () => {
    if (!planId) return;

    upgradeMutation.mutate(
      { planId },
      {
        onSuccess: () => {
          setShowConfirmDialog(false);
        },
      }
    );
  };

  // 如果没有选择套餐，重定向到订阅页面
  if (!planId && !loadingPlans) {
    router.push("/dashboard/subscription");
    return null;
  }

  // 加载状态
  if (loadingCurrent || loadingPlans) {
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

  // 错误状态
  if (!currentSubscription?.subscription) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex">
        <div className="flex-1 w-full md:ml-60">
          <div className="p-8">
            <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-6 text-center">
              <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h2 className="text-lg font-medium text-white mb-2">无法获取订阅信息</h2>
              <p className="text-white/60 mb-4">请先订阅套餐后再进行升级</p>
              <Button onClick={() => router.push("/dashboard/subscription")}>
                返回订阅页面
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!newPlan) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex">
        <div className="flex-1 w-full md:ml-60">
          <div className="p-8">
            <div className="rounded-xl bg-yellow-500/10 border border-yellow-500/20 p-6 text-center">
              <AlertCircle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h2 className="text-lg font-medium text-white mb-2">套餐不存在</h2>
              <p className="text-white/60 mb-4">请选择有效的套餐进行升级</p>
              <Button onClick={() => router.push("/dashboard/subscription")}>
                返回订阅页面
              </Button>
            </div>
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
            <h1 className="text-base md:text-lg font-light text-white/90">升级套餐</h1>
          </div>
        </header>

        <div className="p-4 sm:p-6 md:p-8 max-w-6xl mx-auto">
          {/* 当前套餐 vs 新套餐对比 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* 当前套餐 */}
            <Card className="p-6 bg-[#12121a] border-white/5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-white/60">当前套餐</h3>
                <Badge className="bg-white/10 text-white/60">当前使用</Badge>
              </div>
              <h2 className="text-2xl font-light text-white mb-2">
                {currentPlan?.name || "未知套餐"}
              </h2>
              <div className="text-3xl font-light text-white mb-4">
                ¥{currentPlan?.price || 0}
                <span className="text-sm text-white/40 ml-1">/月</span>
              </div>
              <div className="space-y-2 text-sm text-white/60">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>最多 {currentPlan?.maxProjects || 0} 个项目</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>{currentPlan?.maxStorage || 0} GB 存储空间</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>最多 {currentPlan?.maxTeamMembers || 0} 个团队成员</span>
                </div>
              </div>
            </Card>

            {/* 新套餐 */}
            <Card className="p-6 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-primary">升级至</h3>
                <Badge className="bg-primary/20 text-primary">推荐</Badge>
              </div>
              <h2 className="text-2xl font-light text-white mb-2">{newPlan.name}</h2>
              <div className="text-3xl font-light text-white mb-4">
                ¥{newPlan.price}
                <span className="text-sm text-white/40 ml-1">/月</span>
              </div>
              <div className="space-y-2 text-sm text-white/60">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  <span>最多 {newPlan.maxProjects || 0} 个项目</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  <span>{newPlan.maxStorage || 0} GB 存储空间</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  <span>最多 {newPlan.maxTeamMembers || 0} 个团队成员</span>
                </div>
              </div>
            </Card>
          </div>

          {/* 差价计算详情 */}
          <Card className="p-6 bg-[#12121a] border-white/5 mb-8">
            <h3 className="text-lg font-medium text-white mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              升级费用详情
            </h3>

            {loadingPrice ? (
              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : priceInfo ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-white/5">
                  <span className="text-white/60">当前套餐剩余价值</span>
                  <span className="text-white font-medium">
                    ¥{priceInfo.currentPrice.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-white/5">
                  <span className="text-white/60">新套餐价格（按比例）</span>
                  <span className="text-white font-medium">
                    ¥{priceInfo.proratedAmount.toFixed(2)}
                  </span>
                </div>
                <div className="h-px bg-white/10 my-4" />
                <div
                  className={cn(
                    "flex items-center justify-between p-4 rounded-lg",
                    priceInfo.needsRefund
                      ? "bg-green-500/10 border border-green-500/20"
                      : "bg-primary/10 border border-primary/20"
                  )}
                >
                  <span className="text-white font-medium">
                    {priceInfo.needsRefund ? "应退款" : "需补差价"}
                  </span>
                  <span
                    className={cn(
                      "text-xl font-semibold",
                      priceInfo.needsRefund ? "text-green-400" : "text-primary"
                    )}
                  >
                    {priceInfo.needsRefund ? "-" : "+"}¥
                    {Math.abs(priceInfo.difference).toFixed(2)}
                  </span>
                </div>
                <div className="text-xs text-white/40 mt-2">
                  剩余 {priceInfo.remainingDays} 天，已按比例计算
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-white/60">
                无法计算差价，请稍后重试
              </div>
            )}
          </Card>

          {/* 权益对比表 */}
          <Card className="p-6 bg-[#12121a] border-white/5 mb-8">
            <h3 className="text-lg font-medium text-white mb-6">权益对比</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-sm font-medium text-white/60">
                      功能
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-white/60">
                      当前套餐
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-primary">
                      新套餐
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr>
                    <td className="py-3 px-4 text-sm text-white/80">项目数量</td>
                    <td className="py-3 px-4 text-sm text-center text-white/60">
                      {currentPlan?.maxProjects || 0}
                    </td>
                    <td className="py-3 px-4 text-sm text-center text-primary">
                      {newPlan.maxProjects || 0}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-sm text-white/80">存储空间</td>
                    <td className="py-3 px-4 text-sm text-center text-white/60">
                      {currentPlan?.maxStorage || 0} GB
                    </td>
                    <td className="py-3 px-4 text-sm text-center text-primary">
                      {newPlan.maxStorage || 0} GB
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-sm text-white/80">团队成员</td>
                    <td className="py-3 px-4 text-sm text-center text-white/60">
                      {currentPlan?.maxTeamMembers || 0}
                    </td>
                    <td className="py-3 px-4 text-sm text-center text-primary">
                      {newPlan.maxTeamMembers || 0}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>

          {/* 操作按钮 */}
          <div className="flex items-center gap-4">
            <Button asChild variant="outline" className="flex-1 bg-transparent border-white/10 text-white/60 hover:text-white">
              <Link href="/dashboard/subscription">取消</Link>
            </Button>
            <Button
              onClick={handleUpgrade}
              disabled={loadingPrice || upgradeMutation.isPending}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              {upgradeMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  处理中...
                </>
              ) : (
                <>
                  确认升级
                  <ChevronRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </main>

      {/* 确认对话框 */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent className="bg-[#12121a] border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">确认升级套餐</AlertDialogTitle>
            <AlertDialogDescription className="text-white/60">
              {priceInfo?.needsRefund ? (
                <>
                  升级后，您将获得 ¥{priceInfo.refundAmount?.toFixed(2)} 的退款。
                  <br />
                  新套餐将立即生效，当前周期剩余 {priceInfo.remainingDays} 天。
                </>
              ) : (
                <>
                  升级需要补交 ¥{priceInfo?.difference.toFixed(2)}。
                  <br />
                  新套餐将立即生效，当前周期剩余 {priceInfo?.remainingDays} 天。
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-white/10 text-white/60 hover:text-white">
              取消
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmUpgrade}
              className="bg-primary hover:bg-primary/90"
            >
              确认升级
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default function UpgradePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
          <div className="text-white/60">加载中...</div>
        </div>
      }
    >
      <UpgradePageContent />
    </Suspense>
  );
}
