"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  Filter,
  BarChart3,
  PieChart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  adminMainNav,
  adminSystemNav,
  adminSettingsNav,
} from "@/lib/admin-nav";

// Mock data
const mockFinancials = {
  monthlyRevenue: 1256800,
  revenueGrowth: 12.5,
  totalOrders: 234,
  averageOrderValue: 5371,
  refunds: 15600,
  refundRate: 1.24,
  subscriptions: {
    active: 128,
    revenue: 768000,
    churn: 3,
  },
  oneTime: {
    orders: 106,
    revenue: 488800,
  },
};

const monthlyData = [
  { month: "1月", revenue: 980000, orders: 180 },
  { month: "2月", revenue: 1120000, orders: 205 },
  { month: "3月", revenue: 1256800, orders: 234 },
];

export default function AdminFinancialsPage() {
  const [timeRange, setTimeRange] = useState("month");

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
              const isActive = item.href === "/admin/financials";
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
                <h1 className="text-2xl font-bold text-white">财务管理</h1>
                <CreditCard className="w-6 h-6 text-white/40" />
              </div>
              <div className="flex items-center gap-2">
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-40 bg-[#12121a] border-white/5 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">本周</SelectItem>
                    <SelectItem value="month">本月</SelectItem>
                    <SelectItem value="quarter">本季度</SelectItem>
                    <SelectItem value="year">本年</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" className="border-white/10 text-white/60 hover:text-white">
                  <Download className="w-4 h-4 mr-2" />
                  导出报表
                </Button>
              </div>
            </div>
            <p className="text-sm text-white/60">财务数据统计和分析</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="p-6 bg-[#12121a] border-white/5">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-green-400" />
                </div>
                <div className="flex items-center gap-1 text-green-400">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-xs">+{mockFinancials.revenueGrowth}%</span>
                </div>
              </div>
              <p className="text-white/40 text-xs mb-1">本月营收</p>
              <p className="text-2xl font-light text-white">
                ¥{(mockFinancials.monthlyRevenue / 10000).toFixed(1)}万
              </p>
            </Card>

            <Card className="p-6 bg-[#12121a] border-white/5">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-blue-400" />
                </div>
              </div>
              <p className="text-white/40 text-xs mb-1">总订单数</p>
              <p className="text-2xl font-light text-white">{mockFinancials.totalOrders}</p>
              <p className="text-xs text-white/40 mt-2">
                平均订单：¥{mockFinancials.averageOrderValue.toLocaleString()}
              </p>
            </Card>

            <Card className="p-6 bg-[#12121a] border-white/5">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                  <TrendingDown className="w-5 h-5 text-orange-400" />
                </div>
              </div>
              <p className="text-white/40 text-xs mb-1">退款金额</p>
              <p className="text-2xl font-light text-white">
                ¥{(mockFinancials.refunds / 1000).toFixed(1)}k
              </p>
              <p className="text-xs text-white/40 mt-2">
                退款率：{mockFinancials.refundRate}%
              </p>
            </Card>

            <Card className="p-6 bg-[#12121a] border-white/5">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-purple-400" />
                </div>
              </div>
              <p className="text-white/40 text-xs mb-1">订阅收入</p>
              <p className="text-2xl font-light text-white">
                ¥{(mockFinancials.subscriptions.revenue / 10000).toFixed(1)}万
              </p>
              <p className="text-xs text-white/40 mt-2">
                {mockFinancials.subscriptions.active} 个活跃订阅
              </p>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6 bg-[#12121a] border-white/5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">月度营收趋势</h2>
                <Button variant="ghost" size="sm" className="text-white/60 hover:text-white">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-3">
                {monthlyData.map((data, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className="w-16 text-sm text-white/60">{data.month}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-sm font-medium text-white">
                          ¥{(data.revenue / 10000).toFixed(1)}万
                        </div>
                        <div className="text-xs text-white/40">{data.orders} 订单</div>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{
                            width: `${(data.revenue / monthlyData[2].revenue) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 bg-[#12121a] border-white/5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">收入构成</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-white/80">订阅收入</span>
                    <span className="text-sm font-medium text-white">
                      ¥{(mockFinancials.subscriptions.revenue / 10000).toFixed(1)}万
                    </span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{
                        width: `${
                          (mockFinancials.subscriptions.revenue /
                            (mockFinancials.subscriptions.revenue +
                              mockFinancials.oneTime.revenue)) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                  <div className="text-xs text-white/40 mt-1">
                    {mockFinancials.subscriptions.active} 个活跃订阅
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-white/80">一次性订单</span>
                    <span className="text-sm font-medium text-white">
                      ¥{(mockFinancials.oneTime.revenue / 10000).toFixed(1)}万
                    </span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{
                        width: `${
                          (mockFinancials.oneTime.revenue /
                            (mockFinancials.subscriptions.revenue +
                              mockFinancials.oneTime.revenue)) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                  <div className="text-xs text-white/40 mt-1">
                    {mockFinancials.oneTime.orders} 个订单
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
