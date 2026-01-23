"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Home, FolderKanban, CreditCard, Headphones, FileText, Users, Settings,
  BookOpen, Gift, MessageCircle, ClipboardCheck, ShoppingBag,
  Calendar, Download, ArrowRight, ChevronRight, BarChart3, Target,
  TrendingUp, Clock, CheckCircle, AlertCircle, RefreshCw, Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { mainNav, otherNav } from "@/lib/dashboard-nav";

// Mock diagnosis data
const diagnosisHistory = [
  {
    id: "VCMA-2024-001",
    date: "2024-01-15",
    totalScore: 62,
    level: "L2",
    dimensions: { brand: 58, tech: 70, product: 55, data: 65 },
    status: "completed",
    hasReport: true,
  },
  {
    id: "VCMA-2023-003",
    date: "2023-11-20",
    totalScore: 45,
    level: "L1",
    dimensions: { brand: 40, tech: 52, product: 38, data: 50 },
    status: "completed",
    hasReport: true,
  },
];

const appointments = [
  {
    id: "APT-001",
    date: "2024-01-20",
    time: "14:00-15:00",
    type: "方案咨询",
    status: "upcoming",
    consultant: "资深顾问",
  },
];

const purchases = [
  {
    id: "PUR-001",
    plan: "系统级方案",
    date: "2024-01-16",
    amount: 28800,
    status: "active",
  },
];

export default function VCMADashboardPage() {
  const [showSupport, setShowSupport] = useState(false);
  const latestDiagnosis = diagnosisHistory[0];

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
            const isActive = item.href === "/dashboard/vcma";
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
        <header className="sticky top-0 z-30 h-16 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-4 min-w-0 flex-1">
            <h1 className="text-base md:text-lg font-light text-white/90 truncate">VCMA诊断</h1>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link href="/diagnosis">
              <Button size="sm" className="gap-2 bg-primary/10 hover:bg-primary/20 text-primary border-0">
                <RefreshCw className="w-4 h-4" />
                重新诊断
              </Button>
            </Link>
            <Link href="/dashboard/notifications" className="relative p-2 text-white/40 hover:text-white/80 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
            </Link>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/80 to-accent/80 flex items-center justify-center text-xs font-medium text-white">
              张
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6 md:p-8 w-full">
          {/* Latest Result Summary */}
          {latestDiagnosis && (
            <div className="rounded-xl md:rounded-2xl bg-[#12121a] border border-white/5 p-4 sm:p-6 md:p-8 mb-6 md:mb-8">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6 md:mb-8">
                <div>
                  <p className="text-xs text-white/40 mb-2">最新诊断结果</p>
                  <h2 className="text-xl md:text-2xl font-light text-white mb-2">
                    综合评分 <span className="text-primary">{latestDiagnosis.totalScore}</span>
                  </h2>
                  <p className="text-sm text-white/50">
                    成熟度等级：<span className="text-primary font-mono">{latestDiagnosis.level}</span> · 诊断日期：{latestDiagnosis.date}
                  </p>
                </div>
                <div className="flex gap-2 sm:gap-3 flex-wrap">
                  <Link href="/diagnosis/results">
                    <Button variant="outline" size="sm" className="gap-2 bg-transparent border-white/10 text-white/60 hover:text-white hover:bg-white/5">
                      查看详情
                      <ChevronRight className="w-3 h-3" />
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent border-white/10 text-white/60 hover:text-white hover:bg-white/5">
                    <Download className="w-3 h-3" />
                    下载报告
                  </Button>
                </div>
              </div>

              {/* 4 Dimensions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { key: "brand", label: "品牌可视化", icon: Target },
                  { key: "tech", label: "技术可视化", icon: BarChart3 },
                  { key: "product", label: "产品可视化", icon: FolderKanban },
                  { key: "data", label: "数据可视化", icon: TrendingUp },
                ].map((dim) => {
                  const Icon = dim.icon;
                  const score = latestDiagnosis.dimensions[dim.key as keyof typeof latestDiagnosis.dimensions];
                  return (
                    <div key={dim.key} className="p-3 sm:p-4 rounded-lg md:rounded-xl bg-white/[0.02] border border-white/5">
                      <div className="flex items-center gap-2 mb-3">
                        <Icon className="w-4 h-4 text-white/40" />
                        <span className="text-xs text-white/50">{dim.label}</span>
                      </div>
                      <p className="text-xl md:text-2xl font-light text-white mb-2">{score}</p>
                      <Progress value={score} className="h-1 bg-white/5" />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {/* Left - History & Appointments */}
            <div className="lg:col-span-2 xl:col-span-3 space-y-6 lg:space-y-8">
              {/* Diagnosis History */}
              <div className="rounded-xl md:rounded-2xl bg-[#12121a] border border-white/5 overflow-hidden">
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/5">
                  <h2 className="text-sm font-medium text-white/80">诊断历史</h2>
                </div>
                <div className="divide-y divide-white/5">
                  {diagnosisHistory.map((record) => (
                    <div key={record.id} className="p-4 sm:p-5 hover:bg-white/[0.02] transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                            <span className="text-lg font-light text-primary">{record.totalScore}</span>
                          </div>
                          <div>
                            <p className="text-sm text-white/80 mb-1">
                              <span className="font-mono text-white/40 mr-2">{record.id}</span>
                              等级 {record.level}
                            </p>
                            <p className="text-xs text-white/40">{record.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {record.hasReport && (
                            <Button variant="ghost" size="sm" className="text-white/40 hover:text-white">
                              <Download className="w-4 h-4" />
                            </Button>
                          )}
                          <Link href="/diagnosis/results">
                            <Button variant="outline" size="sm" className="bg-transparent border-white/10 text-white/50 hover:text-white hover:bg-white/5">
                              查看
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Appointments */}
              <div className="rounded-xl md:rounded-2xl bg-[#12121a] border border-white/5 overflow-hidden">
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/5">
                  <h2 className="text-sm font-medium text-white/80">我的预约</h2>
                </div>
                {appointments.length > 0 ? (
                  <div className="divide-y divide-white/5">
                    {appointments.map((apt) => (
                      <div key={apt.id} className="p-4 sm:p-5">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                              <Calendar className="w-5 h-5 text-accent" />
                            </div>
                            <div>
                              <p className="text-sm text-white/80 mb-1">{apt.type}</p>
                              <p className="text-xs text-white/40">
                                {apt.date} · {apt.time} · {apt.consultant}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-1 text-[10px] rounded bg-green-500/10 text-green-400">
                              {apt.status === "upcoming" ? "即将开始" : "已完成"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <p className="text-white/30 text-sm mb-4">暂无预约</p>
                    <Link href="/diagnosis/solutions">
                      <Button size="sm" className="gap-2 bg-primary/10 hover:bg-primary/20 text-primary border-0">
                        预约咨询
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Right - Purchases & Actions */}
            <div className="space-y-8">
              {/* Purchased Plans */}
              <div className="rounded-xl md:rounded-2xl bg-[#12121a] border border-white/5 overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-white/5">
                  <h2 className="text-sm font-medium text-white/80">已购方案</h2>
                </div>
                {purchases.length > 0 ? (
                  <div className="p-4 space-y-3">
                    {purchases.map((purchase) => (
                      <div key={purchase.id} className="p-3 sm:p-4 rounded-lg md:rounded-xl bg-white/[0.02] border border-white/5">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                          <span className="text-sm text-white/80">{purchase.plan}</span>
                          <span className="px-2 py-0.5 text-[10px] rounded bg-primary/10 text-primary self-start">
                            {purchase.status === "active" ? "进行中" : "已完成"}
                          </span>
                        </div>
                        <p className="text-xs text-white/40 mb-3">
                          购买日期：{purchase.date}
                        </p>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <span className="text-base md:text-lg font-light text-primary">¥{purchase.amount.toLocaleString()}</span>
                          <Link href={`/dashboard/projects`}>
                            <Button variant="ghost" size="sm" className="text-xs text-white/40 hover:text-white">
                              查看项目 <ArrowRight className="w-3 h-3 ml-1" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center">
                    <p className="text-white/30 text-sm mb-4">暂未购买方案</p>
                    <Link href="/diagnosis/solutions">
                      <Button size="sm" className="gap-2 bg-primary/10 hover:bg-primary/20 text-primary border-0">
                        查看推荐方案
                      </Button>
                    </Link>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="rounded-xl md:rounded-2xl bg-[#12121a] border border-white/5 overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-white/5">
                  <h2 className="text-sm font-medium text-white/80">快捷操作</h2>
                </div>
                <div className="p-4 space-y-2">
                  <Link href="/diagnosis" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/[0.02] transition-colors text-white/60 hover:text-white/80">
                    <RefreshCw className="w-4 h-4" />
                    <span className="text-sm">重新诊断</span>
                    <ArrowRight className="w-3 h-3 ml-auto" />
                  </Link>
                  <Link href="/diagnosis/solutions" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/[0.02] transition-colors text-white/60 hover:text-white/80">
                    <Target className="w-4 h-4" />
                    <span className="text-sm">查看推荐方案</span>
                    <ArrowRight className="w-3 h-3 ml-auto" />
                  </Link>
                  <Link href="/method" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/[0.02] transition-colors text-white/60 hover:text-white/80">
                    <BookOpen className="w-4 h-4" />
                    <span className="text-sm">了解VCMA体系</span>
                    <ArrowRight className="w-3 h-3 ml-auto" />
                  </Link>
                </div>
              </div>

              {/* CTA */}
              <div className="rounded-xl md:rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10 p-4 sm:p-6">
                <p className="text-sm text-white/80 mb-2">需要专业指导？</p>
                <p className="text-xs text-white/40 mb-4">预约1对1咨询，获取定制化建议</p>
                <Link href="/diagnosis/purchase">
                  <Button size="sm" className="w-full gap-2 bg-primary hover:bg-primary/90 text-white">
                    预约咨询
                    <ArrowRight className="w-3 h-3" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
