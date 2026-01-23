"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Home, FolderKanban, CreditCard, Headphones, FileText, Users,
  Settings, BookOpen, Gift, MessageCircle, Bell, ChevronRight,
  Pause, Play, XCircle, CheckCircle, Clock, Zap, AlertCircle,
  TrendingUp, Plus, ArrowRight, Calendar, RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { mainNav, otherNav } from "@/lib/dashboard-nav";

// Mock subscription data
const mockSubscription = {
  plan: "PROFESSIONAL",
  status: "ACTIVE" as "ACTIVE" | "PAUSED" | "EXPIRED",
  price: "¥5,998",
  period: "/月",
  quotaUsed: 1,
  quotaTotal: 2,
  startDate: "2024-01-01",
  endDate: "2024-01-31",
  daysUsed: 8,
  daysTotal: 31,
  daysRemaining: 23,
  pausedDays: 5,
  features: [
    "无限次设计请求",
    "2 个并发项目",
    "设计总监服务（8年+ 经验）",
    "平均 48 小时交付",
    "无限品牌数",
    "无限团队成员",
    "专属客服支持",
    "随时暂停或取消",
  ],
};

const mockPauseHistory = [
  { id: 1, pauseDate: "2024-01-05", resumeDate: "2024-01-08", days: 3, reason: "项目需求暂缓" },
  { id: 2, pauseDate: "2024-01-15", resumeDate: "2024-01-17", days: 2, reason: "出差" },
];

const plans = [
  { id: "professional", name: "Professional", price: "¥5,998", concurrent: 2 },
  { id: "business", name: "Business", price: "¥9,998", concurrent: 4 },
];

export default function SubscriptionPage() {
  const [showSupport, setShowSupport] = useState(false);
  const [pauseDialogOpen, setPauseDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [resumeDialogOpen, setResumeDialogOpen] = useState(false);
  const [pauseReason, setPauseReason] = useState("");
  const [cancelReason, setCancelReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handlePause = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    setPauseDialogOpen(false);
  };

  const handleCancel = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    setCancelDialogOpen(false);
  };

  const handleResume = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    setResumeDialogOpen(false);
  };

  const statusConfig = {
    ACTIVE: { label: "正常", color: "bg-green-500/20 text-green-400 border-green-500/30" },
    PAUSED: { label: "已暂停", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
    EXPIRED: { label: "已过期", color: "bg-red-500/20 text-red-400 border-red-500/30" },
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
          <button
            onMouseEnter={() => setShowSupport(true)}
            onMouseLeave={() => setShowSupport(false)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-white/10 text-white/50 hover:text-white/80 hover:border-white/20 hover:bg-white/5 transition-all duration-200 text-sm"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{showSupport ? "在线客服 24/7" : "联系客服"}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 w-full md:ml-60">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 h-16 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-4 min-w-0 flex-1">
            <h1 className="text-base md:text-lg font-light text-white/90 truncate">订阅管理</h1>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link href="/dashboard/notifications" className="relative p-2 text-white/40 hover:text-white/80 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
            </Link>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/80 to-accent/80 flex items-center justify-center text-xs font-medium text-white">
              张
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-4 sm:p-6 md:p-8 w-full">
          {/* Page Header */}
          <div className="mb-10">
            <h1 className="text-lg md:text-xl font-light text-white mb-2">订阅管理</h1>
            <p className="text-white/40 text-xs sm:text-sm">管理您的订阅计划和配额</p>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
            {/* Left Column - 70% */}
            <div className="lg:col-span-7 space-y-8">
              {/* Current Subscription Overview */}
              <div className="rounded-xl md:rounded-2xl bg-[#12121a] border border-white/5 overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-white/5">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg md:text-xl font-medium text-white">{mockSubscription.plan}</h2>
                    <span className={cn(
                      "px-3 py-1 text-xs rounded-full border",
                      statusConfig[mockSubscription.status].color
                    )}>
                      {statusConfig[mockSubscription.status].label}
                    </span>
                  </div>
                </div>

                <div className="p-4 sm:p-6">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                    <div className="p-3 sm:p-4 rounded-lg md:rounded-xl bg-white/[0.02]">
                      <div className="flex items-center gap-2 mb-3">
                        <CreditCard className="w-4 h-4 text-primary/60" />
                        <span className="text-xs text-white/40">订阅价格</span>
                      </div>
                      <p className="text-xl md:text-2xl font-light text-white">
                        {mockSubscription.price}
                        <span className="text-xs sm:text-sm text-white/40">{mockSubscription.period}</span>
                      </p>
                    </div>

                    <div className="p-3 sm:p-4 rounded-lg md:rounded-xl bg-white/[0.02]">
                      <div className="flex items-center gap-2 mb-3">
                        <Zap className="w-4 h-4 text-accent/60" />
                        <span className="text-xs text-white/40">并发项目配额</span>
                      </div>
                      <p className="text-xl md:text-2xl font-light text-white mb-2">
                        {mockSubscription.quotaUsed} <span className="text-white/30">/ {mockSubscription.quotaTotal}</span>
                      </p>
                      <Progress value={(mockSubscription.quotaUsed / mockSubscription.quotaTotal) * 100} className="h-1 bg-white/5" />
                    </div>

                    <div className="p-3 sm:p-4 rounded-lg md:rounded-xl bg-white/[0.02]">
                      <div className="flex items-center gap-2 mb-3">
                        <Clock className="w-4 h-4 text-orange-400/60" />
                        <span className="text-xs text-white/40">剩余时间</span>
                      </div>
                      <p className="text-xl md:text-2xl font-light text-primary mb-1">{mockSubscription.daysRemaining} 天</p>
                      <Link href="/dashboard/subscription/renew" className="text-xs text-primary/70 hover:text-primary transition-colors">
                        续费管理 →
                      </Link>
                    </div>
                  </div>

                  {/* Subscription Progress */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between text-xs text-white/40 mb-2">
                      <span>{mockSubscription.startDate}</span>
                      <span>{mockSubscription.endDate}</span>
                    </div>
                    <Progress 
                      value={(mockSubscription.daysUsed / mockSubscription.daysTotal) * 100} 
                      className="h-2 bg-white/5" 
                    />
                    <p className="text-xs text-white/30 mt-2">
                      已使用 {mockSubscription.daysUsed} 天（{Math.round((mockSubscription.daysUsed / mockSubscription.daysTotal) * 100)}%）
                    </p>
                  </div>

                  {/* Pause Notice */}
                  {mockSubscription.pausedDays > 0 && (
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/10 mb-6">
                      <AlertCircle className="w-4 h-4 text-primary shrink-0" />
                      <p className="text-sm text-white/70">
                        您已累计暂停 <span className="text-primary">{mockSubscription.pausedDays} 天</span>，订阅时间已自动顺延
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3 pt-6 border-t border-white/5">
                    {mockSubscription.status === "ACTIVE" && (
                      <>
                        <Button 
                          variant="outline" 
                          onClick={() => setPauseDialogOpen(true)}
                          className="bg-transparent border-white/10 text-white/60 hover:text-white hover:bg-white/5"
                        >
                          <Pause className="w-4 h-4 mr-2" />
                          暂停订阅
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => setCancelDialogOpen(true)}
                          className="bg-transparent border-red-500/20 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          取消订阅
                        </Button>
                        <Button asChild className="ml-auto bg-primary hover:bg-primary/90 text-primary-foreground">
                          <Link href="/dashboard/subscription/upgrade?planId=business">
                            <TrendingUp className="w-4 h-4 mr-2" />
                            升级计划
                          </Link>
                        </Button>
                      </>
                    )}
                    {mockSubscription.status === "PAUSED" && (
                      <>
                        <Button 
                          onClick={() => setResumeDialogOpen(true)}
                          className="bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          恢复订阅
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => setCancelDialogOpen(true)}
                          className="bg-transparent border-white/10 text-white/60 hover:text-white hover:bg-white/5"
                        >
                          取消订阅
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Plan Features */}
              <div className="rounded-xl md:rounded-2xl bg-[#12121a] border border-white/5 overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-white/5">
                  <h2 className="text-sm font-medium text-white/80">计划特性</h2>
                </div>
                <div className="p-4 sm:p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {mockSubscription.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-primary/60 shrink-0" />
                        <span className="text-sm text-white/60">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Pause History */}
              {mockPauseHistory.length > 0 && (
                <div className="rounded-xl md:rounded-2xl bg-[#12121a] border border-white/5 overflow-hidden">
                  <div className="p-4 sm:p-6 border-b border-white/5">
                    <h2 className="text-sm font-medium text-white/80">暂停历史</h2>
                  </div>
                  <div className="divide-y divide-white/5">
                    {mockPauseHistory.map((record) => (
                      <div key={record.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                        <div className="flex items-center gap-2 text-sm text-white/40">
                          <Calendar className="w-4 h-4" />
                          <span>{record.pauseDate}</span>
                          <ArrowRight className="w-3 h-3" />
                          <span>{record.resumeDate}</span>
                        </div>
                        <span className="px-2 py-1 text-xs bg-white/5 text-white/50 rounded">
                          {record.days} 天
                        </span>
                        <span className="text-xs text-white/30 flex-1">{record.reason}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Usage Guide */}
              <div className="rounded-2xl bg-primary/5 border border-primary/10 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-medium text-white/80">订阅使用须知</h3>
                </div>
                <ul className="space-y-2 text-sm text-white/50">
                  <li className="flex items-start gap-2">
                    <span className="text-primary/60">•</span>
                    订阅按月计费，可随时暂停或取消
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary/60">•</span>
                    暂停期间订阅时间自动顺延，不会浪费
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary/60">•</span>
                    有进行中的项目时无法暂停订阅
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary/60">•</span>
                    Professional 最多支持 2 个项目同时进行
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary/60">•</span>
                    项目完成后，配额会自动释放
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Column - 30% */}
            <div className="lg:col-span-3 xl:col-span-3 space-y-6 lg:space-y-8">
              {/* Quick Actions */}
              <div className="rounded-xl md:rounded-2xl bg-[#12121a] border border-white/5 overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-white/5">
                  <h2 className="text-sm font-medium text-white/80">快捷操作</h2>
                </div>
                <div className="p-4 space-y-2">
                  <Button asChild className="w-full justify-start gap-3 bg-primary/10 hover:bg-primary/20 text-primary border-0">
                    <Link href="/dashboard/projects/new" className="flex items-center gap-3 w-full">
                      <Plus className="w-4 h-4" />
                      <span className="flex-1 text-left">提交新项目</span>
                    </Link>
                  </Button>
                  <p className="text-[10px] text-white/30 px-3 mb-2">
                    剩余配额：{mockSubscription.quotaTotal - mockSubscription.quotaUsed} 个
                  </p>

                  <Link href="/dashboard/subscription/renew" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/[0.02] transition-colors text-white/50 hover:text-white/70">
                    <RefreshCw className="w-4 h-4" />
                    <span className="text-sm">续费管理</span>
                  </Link>
                  <Link href="/dashboard/projects" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/[0.02] transition-colors text-white/50 hover:text-white/70">
                    <FolderKanban className="w-4 h-4" />
                    <span className="text-sm">查看我的项目</span>
                  </Link>
                  <Link href="/dashboard/orders" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/[0.02] transition-colors text-white/50 hover:text-white/70">
                    <CreditCard className="w-4 h-4" />
                    <span className="text-sm">我的订单（支付 / 发票）</span>
                  </Link>
                  <Link href="/about" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/[0.02] transition-colors text-white/50 hover:text-white/70">
                    <Headphones className="w-4 h-4" />
                    <span className="text-sm">关于我们 / 联系</span>
                  </Link>
                </div>
              </div>

              {/* Plan Comparison */}
              <div className="rounded-2xl bg-[#12121a] border border-white/5 overflow-hidden">
                <div className="p-6 border-b border-white/5">
                  <h2 className="text-sm font-medium text-white/80">想要更多并发项目？</h2>
                </div>
                <div className="p-4 space-y-3 sm:space-y-4">
                  {/* Current Plan */}
                  <div className="p-3 sm:p-4 rounded-lg md:rounded-xl bg-white/[0.02] border border-white/5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-white/60">当前</span>
                      <span className="text-xs text-white/30">Professional</span>
                    </div>
                    <p className="text-lg font-light text-white/80">¥5,998/月</p>
                    <p className="text-xs text-white/40 mt-1">2 个并发项目</p>
                  </div>

                  <div className="flex justify-center">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-primary" />
                    </div>
                  </div>

                  {/* Upgrade Plan */}
                  <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-primary">推荐升级</span>
                      <span className="text-xs text-primary/60">Business</span>
                    </div>
                    <p className="text-lg font-light text-white">¥9,998/月</p>
                    <p className="text-xs text-white/50 mt-1">4 个并发项目</p>
                  </div>

                  <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Link href="/dashboard/subscription/upgrade?planId=business">
                      升级到 Business
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Referral Card */}
              <div className="rounded-xl md:rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 p-4 sm:p-6">
                <Gift className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-sm font-medium text-white/80 mb-2">邀请好友获得返佣</h3>
                <p className="text-xs text-white/50 mb-4">每月获得 5% 持续收益</p>
                <Button asChild variant="outline" size="sm" className="w-full bg-transparent border-primary/30 text-primary hover:bg-primary/10">
                  <Link href="/dashboard/referral">获取推荐链接</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Pause Dialog */}
      <Dialog open={pauseDialogOpen} onOpenChange={setPauseDialogOpen}>
        <DialogContent className="bg-[#12121a] border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white">确定要暂停订阅吗？</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <p className="text-sm text-white/60">
              暂停期间不会扣费，订阅时间将自动顺延
            </p>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <p className="text-xs text-red-400">注意：有进行中的项目时无法暂停</p>
            </div>
            <div>
              <label className="text-xs text-white/40 mb-2 block">暂停原因（可选）</label>
              <Textarea 
                value={pauseReason}
                onChange={(e) => setPauseReason(e.target.value)}
                placeholder="请告诉我们暂停的原因..."
                className="bg-white/5 border-white/10 text-white/80 placeholder:text-white/30 resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPauseDialogOpen(false)} className="bg-transparent border-white/10 text-white/60">
              我再想想
            </Button>
            <Button onClick={handlePause} disabled={isLoading} className="bg-primary hover:bg-primary/90">
              {isLoading ? "处理中..." : "确认暂停"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent className="bg-[#12121a] border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white">确定要取消订阅吗？</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <p className="text-sm text-white/60">
              取消后您仍可在当前订阅周期内正常使用服务，到期后将不再自动续费
            </p>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/10">
              <AlertCircle className="w-4 h-4 text-primary shrink-0" />
              <p className="text-xs text-white/60">您也可以选择暂停订阅，保留账户余额</p>
            </div>
            <div>
              <label className="text-xs text-white/40 mb-2 block">请告诉我们取消的原因</label>
              <div className="space-y-2">
                {["太贵了", "不需要了", "服务不满意", "其他"].map((reason) => (
                  <label 
                    key={reason}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors",
                      cancelReason === reason 
                        ? "border-primary/50 bg-primary/5" 
                        : "border-white/10 hover:border-white/20"
                    )}
                  >
                    <input
                      type="radio"
                      name="cancelReason"
                      value={reason}
                      checked={cancelReason === reason}
                      onChange={(e) => setCancelReason(e.target.value)}
                      className="sr-only"
                    />
                    <div className={cn(
                      "w-4 h-4 rounded-full border flex items-center justify-center",
                      cancelReason === reason ? "border-primary bg-primary" : "border-white/30"
                    )}>
                      {cancelReason === reason && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                    <span className="text-sm text-white/70">{reason}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setCancelDialogOpen(false);
                setPauseDialogOpen(true);
              }} 
              className="bg-transparent border-white/10 text-white/60"
            >
              暂停订阅
            </Button>
            <Button 
              onClick={handleCancel} 
              disabled={isLoading}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {isLoading ? "处理中..." : "确认取消"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Resume Dialog */}
      <Dialog open={resumeDialogOpen} onOpenChange={setResumeDialogOpen}>
        <DialogContent className="bg-[#12121a] border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white">恢复订阅</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/40">暂停天数</span>
                <span className="text-sm text-white/80">{mockSubscription.pausedDays} 天</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/40">顺延后新结束日期</span>
                <span className="text-sm text-primary">2024-02-05</span>
              </div>
            </div>
            <p className="text-sm text-white/50">恢复后将继续正常扣费</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResumeDialogOpen(false)} className="bg-transparent border-white/10 text-white/60">
              取消
            </Button>
            <Button onClick={handleResume} disabled={isLoading} className="bg-primary hover:bg-primary/90">
              {isLoading ? "处理中..." : "确认恢复"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
